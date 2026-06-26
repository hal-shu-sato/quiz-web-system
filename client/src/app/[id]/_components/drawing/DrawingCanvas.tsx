import React from 'react';

import { Layer, Line, Rect, Stage } from 'react-konva';

import type Konva from 'konva';
import type { KonvaEventObject, Node, NodeConfig } from 'konva/lib/Node';

export type DrawingCanvasHandle = {
  exportImage: () => string;
};

const DrawingCanvas = React.forwardRef<DrawingCanvasHandle, { tool: string }>(
  function DrawingCanvas({ tool }, ref) {
    const stageRef = React.useRef<Konva.Stage>(null);
    const [lines, setLines] = React.useState<
      { tool: string; points: number[] }[]
    >([]);
    const isDrawing = React.useRef(false);

    React.useImperativeHandle(ref, () => ({
      exportImage: () => stageRef.current?.toDataURL() ?? '',
    }));

    const handleMouseDown = (e: KonvaEventObject<Event, Node<NodeConfig>>) => {
      isDrawing.current = true;
      const pos = e.target.getStage()!.getPointerPosition();
      if (!pos) return;
      setLines([...lines, { tool, points: [pos.x, pos.y] }]);
    };

    const handleMouseMove = (e: KonvaEventObject<Event, Node<NodeConfig>>) => {
      if (!isDrawing.current) {
        return;
      }
      const stage = e.target.getStage();
      if (!stage) return;
      const point = stage.getPointerPosition();
      if (!point) return;
      const lastLine = lines[lines.length - 1];
      lastLine.points = lastLine.points.concat([point.x, point.y]);
      lines.splice(lines.length - 1, 1, lastLine);
      setLines(lines.concat());
    };

    const handleMouseUp = () => {
      isDrawing.current = false;
    };

    return (
      <Stage
        ref={stageRef}
        width={640}
        height={360}
        style={{ width: 'fit-content', backgroundColor: '#ffffff' }}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <Layer>
          <Rect x={0} y={0} width={640} height={360} fill="#ffffff" />
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#000000"
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
  },
);

export default DrawingCanvas;
