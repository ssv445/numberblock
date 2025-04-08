'use client';

import { useEffect, useRef } from 'react';
import { Engine, Render, World, Bodies, Body, Events, Runner } from 'matter-js';
import { Block, PlacedBlock } from '../types/block';
import { useDrop } from 'react-dnd';

const BLOCK_SIZE = 64;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

interface BuildingAreaProps {
    onBlockPlaced: (block: PlacedBlock) => void;
    placedBlocks: PlacedBlock[];
}

export const BuildingArea = ({ onBlockPlaced, placedBlocks }: BuildingAreaProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<Engine>();
    const worldRef = useRef<World>();

    // Initialize physics engine
    useEffect(() => {
        if (!canvasRef.current) return;

        // Create engine and world
        const engine = Engine.create({
            enableSleeping: true,
            gravity: { x: 0, y: 1, scale: 0.001 } // Reduced gravity for better control
        });
        const world = engine.world;
        engineRef.current = engine;
        worldRef.current = world;

        // Create renderer
        const render = Render.create({
            canvas: canvasRef.current,
            engine: engine,
            options: {
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
                wireframes: false,
                background: 'white',
                pixelRatio: window.devicePixelRatio
            }
        });

        // Create walls with friction
        const wallOptions = {
            isStatic: true,
            friction: 0.8,
            restitution: 0.2,
            render: { fillStyle: '#e5e7eb' }
        };

        const walls = [
            Bodies.rectangle(CANVAS_WIDTH / 2, CANVAS_HEIGHT + 30, CANVAS_WIDTH, 60, wallOptions), // Bottom
            Bodies.rectangle(-30, CANVAS_HEIGHT / 2, 60, CANVAS_HEIGHT, wallOptions), // Left
            Bodies.rectangle(CANVAS_WIDTH + 30, CANVAS_HEIGHT / 2, 60, CANVAS_HEIGHT, wallOptions), // Right
        ];
        World.add(world, walls);

        // Add existing blocks with friction
        placedBlocks.forEach(block => {
            const body = Bodies.rectangle(
                block.position.x + BLOCK_SIZE / 2,
                block.position.y + BLOCK_SIZE / 2,
                BLOCK_SIZE - 4,
                BLOCK_SIZE - 4,
                {
                    friction: 0.8,
                    restitution: 0.2,
                    render: {
                        fillStyle: block.color,
                    },
                    label: block.value.toString(),
                }
            );
            Body.setStatic(body, true);
            World.add(world, body);
        });

        // Start the engine
        const runner = Runner.create();
        Runner.run(runner, engine);
        Render.run(render);

        // Cleanup
        return () => {
            Render.stop(render);
            Runner.stop(runner);
            World.clear(world, true);
            Engine.clear(engine);
        };
    }, [placedBlocks]);

    const [{ isOver }, drop] = useDrop<Block, void, { isOver: boolean }>({
        accept: 'BLOCK',
        drop: (item: Block, monitor) => {
            const offset = monitor.getClientOffset();
            if (!offset || !worldRef.current) return;

            const canvasRect = canvasRef.current?.getBoundingClientRect();
            if (!canvasRect) return;

            const x = offset.x - canvasRect.left;
            const y = offset.y - canvasRect.top;

            // Create new block body with physics properties
            const body = Bodies.rectangle(
                x,
                y,
                BLOCK_SIZE - 4,
                BLOCK_SIZE - 4,
                {
                    friction: 0.8,
                    restitution: 0.2,
                    density: 0.001, // Light blocks for better stacking
                    render: {
                        fillStyle: item.color,
                    },
                    label: item.value.toString(),
                }
            );

            // Add block to world
            World.add(worldRef.current, body);

            // Wait for block to settle
            const checkSettled = () => {
                if (!engineRef.current) return;

                if (body.speed < 0.1) {
                    Events.off(engineRef.current, 'afterUpdate', checkSettled);
                    Body.setStatic(body, true);
                    onBlockPlaced({
                        ...item,
                        position: {
                            x: body.position.x - BLOCK_SIZE / 2,
                            y: body.position.y - BLOCK_SIZE / 2,
                        },
                    });
                }
            };

            if (engineRef.current) {
                Events.on(engineRef.current, 'afterUpdate', checkSettled);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    return (
        <div ref={drop} className="relative mx-auto">
            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className={`border-2 border-dashed ${isOver ? 'border-blue-500' : 'border-gray-300'
                    }`}
            />
        </div>
    );
}; 