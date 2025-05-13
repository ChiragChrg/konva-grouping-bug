import { propertiesSignal } from '@/store/signals';
import { getBoundingBox } from '@/utils/commonUtils';
import Konva from 'konva';
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Layer, Stage, Rect, Group } from 'react-konva'

type RectPos = { x: number; y: number };

const RECT_SIZE = 100;

const PageTree: React.FC = () => {
    // #region Local State
    // State to store the dimensions of the stage
    const [stageDimensions, setStageDimensions] = useState({
        width: 0,
        height: 0
    });

    // State to store the positions of the rectangles
    const [rects, setRects] = useState<RectPos[]>([]);

    // State to store the dimensions of the selection container
    const [selectedRectIndex, setSelectedRectIndex] = useState<string | null>(null);

    const groupBox = useMemo(() => getBoundingBox(rects, RECT_SIZE), [rects])

    // #endregion

    // #region Refs
    // reference to the page tree
    const pageTreeRef = useRef<HTMLDivElement | null>(null);
    // reference to the stage
    const stageRef = useRef<Konva.Stage | null>(null);

    // #endregion

    // #region Effects
    /**
     * Effect that sets the stage dimensions based on the page tree dimensions.
     * It runs once when the component mounts and whenever the page tree reference changes.
     */
    useLayoutEffect(() => {
        if (!pageTreeRef.current) return;

        const stageX = pageTreeRef.current.clientWidth - 100;
        const stageY = pageTreeRef.current.clientHeight - 100;

        setStageDimensions({
            width: stageX,
            height: stageY
        });

        const INITIAL_RECTS: RectPos[] = [
            { x: stageX - 1000, y: stageY - 500 },
            { x: stageX - 500, y: stageY - 500 },
            { x: stageX - 500, y: stageY },
            { x: stageX - 1000, y: stageY },
            { x: stageX - 750, y: stageY - 250 },
        ];

        setRects(INITIAL_RECTS);
    }, [pageTreeRef]);

    // #endregion

    const centerOffset = useMemo(() => ({
        x: (stageDimensions.width - groupBox.width) / 2 - groupBox.x,
        y: (stageDimensions.height - groupBox.height) / 2 - groupBox.y,
    }), [stageDimensions, groupBox]);

    return (
        <div
            ref={pageTreeRef}
            className="w-[80%] h-full flex justify-center items-center">
            <Stage
                ref={stageRef}
                width={stageDimensions.width}
                height={stageDimensions.height}
                className='bg-white'>
                <Layer>
                    {/* Shapes */}
                    <Group
                        name={`group`}
                        id={`group`}
                        x={centerOffset.x}
                        y={centerOffset.y}
                        // Update Properties Section
                        onClick={e => propertiesSignal.value = e.target.getClientRect()}
                        onDragMove={e => propertiesSignal.value = e.target.getClientRect()}
                        onDragEnd={e => propertiesSignal.value = e.target.getClientRect()}
                        draggable
                        dragBoundFunc={pos => {
                            const minX = 0 - groupBox.x;
                            const minY = 0 - groupBox.y;
                            const maxX = stageDimensions.width - groupBox.width - groupBox.x;
                            const maxY = stageDimensions.height - groupBox.height - groupBox.y;

                            return {
                                x: Math.max(minX, Math.min(pos.x, maxX)),
                                y: Math.max(minY, Math.min(pos.y, maxY)),
                            };
                        }}
                    >
                        {/* Group Border Visualization */}
                        <Rect
                            name={`rect-group`}
                            x={groupBox.x}
                            y={groupBox.y}
                            width={groupBox.width}
                            height={groupBox.height}
                            fill={"blue"}
                            opacity={0.1}
                            // listening={false}
                            dash={[10, 5]}
                        // draggable
                        />

                        {/* Rect Shapes */}
                        {rects.map((pos, idx) => (
                            <Rect
                                key={idx}
                                name={`rect-${idx}`}
                                id={`rect-${idx}`}
                                x={pos.x}
                                y={pos.y}
                                width={RECT_SIZE}
                                height={RECT_SIZE}
                                fill={idx === 4 ? "lime" : "orange"}
                                strokeWidth={2}
                                dash={[10, 5]}
                                // Update Properties Section
                                onClick={e => propertiesSignal.value = e.target.getClientRect()}
                                onDblClick={(e) => {
                                    setSelectedRectIndex(`rect-${idx}`)

                                    // Clear stroke from all rects
                                    const layer = e.target.getLayer();
                                    if (layer) {
                                        layer.find('Rect').forEach(node => {
                                            node.setAttr('stroke', null);
                                        });
                                    }

                                    // Add stroke to selected rect
                                    e.target.setAttr('stroke', 'blue');

                                    // Force layer to redraw
                                    e.target.getLayer()?.batchDraw();
                                }}
                                onDragMove={e => propertiesSignal.value = e.target.getClientRect()}
                                onDragEnd={e => {
                                    propertiesSignal.value = e.target.getClientRect();

                                    const pos = e.target.position();
                                    setRects(prev => prev.map((r, i) =>
                                        i === idx ? { x: pos.x, y: pos.y } : r
                                    ));
                                }}
                                draggable={selectedRectIndex === `rect-${idx}`}
                                dragBoundFunc={pos => {
                                    const minX = 0;
                                    const minY = 0;
                                    const maxX = stageDimensions.width - RECT_SIZE;
                                    const maxY = stageDimensions.height - RECT_SIZE;
                                    return {
                                        x: Math.max(minX, Math.min(pos.x, maxX)),
                                        y: Math.max(minY, Math.min(pos.y, maxY)),
                                    };
                                }}
                            />
                        ))}
                    </Group>
                </Layer>
            </Stage>
        </div >
    )
}

export default PageTree