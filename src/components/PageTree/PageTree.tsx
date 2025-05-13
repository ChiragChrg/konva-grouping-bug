import { propertiesSignal } from '@/store/signals';
import { getBoundingBox } from '@/utils/commonUtils';
import Konva from 'konva';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Layer, Stage, Rect, Group } from 'react-konva'

type RectPos = { x: number; y: number };

const RECT_SIZE = 100;
const INITIAL_RECTS: RectPos[] = [
    { x: 0, y: 0 },
    { x: 400, y: 0 },
    { x: 0, y: 400 },
    { x: 400, y: 400 },
    { x: 200, y: 200 },
];

const PageTree: React.FC = () => {
    // #region Local State
    // State to store the dimensions of the stage
    const [stageDimensions, setStageDimensions] = useState({
        width: 0,
        height: 0
    });

    // State to store the positions of the rectangles
    const [rects, setRects] = useState<RectPos[]>(INITIAL_RECTS);

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
    useEffect(() => {
        if (!pageTreeRef.current) return;

        // Set the stage dimensions to the page tree dimensions
        setStageDimensions({
            width: pageTreeRef.current.clientWidth - 100,
            height: pageTreeRef.current.clientHeight - 100
        });
    }, [pageTreeRef]);

    // #endregion

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
                    {/* <SelectionBox
                        name="SelectionContainer"
                        className="SelectionContainer"
                    />

                    <Transformer
                        name="Transformer"
                        className="Transformer"
                    /> */}

                    {/* Shapes */}
                    <Group
                        name={`group`}
                        id={`group`}
                        x={groupBox.x}
                        y={groupBox.y}
                        // Update Properties Section
                        onClick={e => propertiesSignal.value = e.target.getClientRect()}
                        onDragMove={e => propertiesSignal.value = e.target.getClientRect()}
                        onDragEnd={e => propertiesSignal.value = e.target.getClientRect()}
                        draggable
                        dragBoundFunc={pos => {
                            const minX = 0;
                            const minY = 0;
                            const maxX = stageDimensions.width - groupBox.width;
                            const maxY = stageDimensions.height - groupBox.height;
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
                                fill={idx === 4 ? "green" : "red"}
                                // Update Properties Section
                                onClick={e => propertiesSignal.value = e.target.getClientRect()}
                                onDragMove={e => propertiesSignal.value = e.target.getClientRect()}
                                onDragEnd={e => {
                                    const rectBox = e.target.getClientRect();
                                    propertiesSignal.value = rectBox;

                                    setRects(prev => prev.map((r, i) => (i === idx ? { x: rectBox.x, y: rectBox.y } : r)));
                                }}
                                onDblClick={() => setSelectedRectIndex(`rect-${idx}`)}
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