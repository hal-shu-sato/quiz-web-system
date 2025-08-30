import React from 'react';

import { Layer, Line, Stage } from 'react-konva';

import type { KonvaEventObject, Node, NodeConfig } from 'konva/lib/Node';

export default function DrawingCanvas({ tool }: { tool: string }) {
  const [lines, setLines] = React.useState<
    { tool: string; points: number[] }[]
  >([]);
  const isDrawing = React.useRef(false);

  const handleMouseDown = (e: KonvaEventObject<Event, Node<NodeConfig>>) => {
    isDrawing.current = true;
    const pos = e.target.getStage()!.getPointerPosition();
    if (!pos) return;
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e: KonvaEventObject<Event, Node<NodeConfig>>) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    if (!stage) return;
    const point = stage.getPointerPosition();
    if (!point) return;
    const lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <Stage
      width={640}
      height={360}
      style={{ width: 'fit-content' }}
      onMouseDown={handleMouseDown}
      onMousemove={handleMouseMove}
      onMouseup={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      <Layer>
        {lines.map((line, i) => (
          <Line
            key={i}
            points={line.points}
            stroke="#df4b26"
            strokeWidth={5}
            tension={0.5}
            lineCap="round"
            lineJoin="round"
            globalCompositeOperation={
              line.tool === 'eraser' ? 'destination-out' : 'source-over'
            }
          />
        ))}
      </Layer>
    </Stage>
  );
}
