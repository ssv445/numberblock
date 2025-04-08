/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Engine, Render, World, Bodies, Body, Events, Runner, Mouse, MouseConstraint } from 'matter-js';
import { Block, PlacedBlock, BlockHandlers } from '../types/block';
import { useDrop } from 'react-dnd';

const BLOCK_SIZE = 64;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

interface BuildingAreaProps extends BlockHandlers {
    placedBlocks: PlacedBlock[];
}

type DragEvent = {
    source: {
        body: Matter.Body;
    };
};

export const BuildingArea = ({
    onBlockPlaced,
    placedBlocks,
    onBlockRemoved = () => { },
    onBlockMoved = () => { }
}: BuildingAreaProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<Engine | undefined>(undefined);
    const worldRef = useRef<World | undefined>(undefined);
    const mouseConstraintRef = useRef<MouseConstraint | undefined>(undefined);
    const blockBodiesRef = useRef<Map<string, Matter.Body>>(new Map());

    const handleBlockDrag = useCallback((e: DragEvent) => {
        const body = e.source.body;
        if (body && body.label) {
            Body.setStatic(body, false);
        }
    }, []);

    const handleBlockDragEnd = useCallback((e: DragEvent) => {
        const body = e.source.body;
        if (!body || !body.label) return;

        // Check if block is outside the building area
        const isOutside =
            body.position.x < 0 ||
            body.position.x > CANVAS_WIDTH ||
            body.position.y < 0 ||
            body.position.y > CANVAS_HEIGHT;

        if (isOutside) {
            // Remove block
            if (worldRef.current) {
                World.remove(worldRef.current, body);
                onBlockRemoved(body.label);
                blockBodiesRef.current.delete(body.label);
            }
        } else {
            // Update block position
            Body.setStatic(body, true);
            onBlockMoved(body.label, {
                x: body.position.x - BLOCK_SIZE / 2,
                y: body.position.y - BLOCK_SIZE / 2
            });
        }
    }, [onBlockRemoved, onBlockMoved]);

    // Initialize physics engine
    useEffect(() => {
        if (!canvasRef.current) return;

        // Create engine and world
        const engine = Engine.create({
            enableSleeping: true,
            gravity: { x: 0, y: 1, scale: 0.001 }
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

        // Add mouse control
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });
        mouseConstraintRef.current = mouseConstraint;
        World.add(world, mouseConstraint);

        // Create walls with friction
        const wallOptions = {
            isStatic: true,
            friction: 0.8,
            restitution: 0.2,
            render: { fillStyle: '#e5e7eb' }
        };

        const walls = [
            Bodies.rectangle(CANVAS_WIDTH / 2, CANVAS_HEIGHT + 30, CANVAS_WIDTH, 60, wallOptions),
            Bodies.rectangle(-30, CANVAS_HEIGHT / 2, 60, CANVAS_HEIGHT, wallOptions),
            Bodies.rectangle(CANVAS_WIDTH + 30, CANVAS_HEIGHT / 2, 60, CANVAS_HEIGHT, wallOptions),
        ];
        World.add(world, walls);

        // Add existing blocks
        blockBodiesRef.current.clear();
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
                    label: block.id,
                }
            );
            Body.setStatic(body, true);
            World.add(world, body);
            blockBodiesRef.current.set(block.id, body);
        });

        // Add drag event listeners
        Events.on(mouseConstraint, 'startdrag', handleBlockDrag as any);
        Events.on(mouseConstraint, 'enddrag', handleBlockDragEnd as any);

        // Start the engine
        const runner = Runner.create();
        Runner.run(runner, engine);
        Render.run(render);

        // Cleanup
        return () => {
            Events.off(mouseConstraint, 'startdrag', handleBlockDrag as any);
            Events.off(mouseConstraint, 'enddrag', handleBlockDragEnd as any);
            Render.stop(render);
            Runner.stop(runner);
            World.clear(world, true);
            Engine.clear(engine);

            // Clean up mouse by removing its reference
            if (mouse.element) {
                (mouse as any).element = null;
            }
        };
    }, [placedBlocks, handleBlockDrag, handleBlockDragEnd]);

    const [{ isOver }, drop] = useDrop<Block, void, { isOver: boolean }>({
        accept: 'BLOCK',
        drop: (item: Block, monitor) => {
            const offset = monitor.getClientOffset();
            if (!offset || !worldRef.current) return;

            const canvasRect = canvasRef.current?.getBoundingClientRect();
            if (!canvasRect) return;

            const x = offset.x - canvasRect.left;
            const y = offset.y - canvasRect.top;

            // Create new block body
            const body = Bodies.rectangle(
                x,
                y,
                BLOCK_SIZE - 4,
                BLOCK_SIZE - 4,
                {
                    friction: 0.8,
                    restitution: 0.2,
                    density: 0.001,
                    render: {
                        fillStyle: item.color,
                    },
                    label: `block-${Date.now()}`,
                }
            );

            // Add block to world
            World.add(worldRef.current, body);
            blockBodiesRef.current.set(body.label, body);

            // Wait for block to settle
            const checkSettled = () => {
                if (!engineRef.current) return;

                if (body.speed < 0.1) {
                    Events.off(engineRef.current, 'afterUpdate', checkSettled);
                    Body.setStatic(body, true);
                    onBlockPlaced({
                        ...item,
                        id: body.label,
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
        <div ref={drop as any} className="relative mx-auto">
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