import React from 'react';

import { Box, MenuItem, Select } from '@mui/material';

import DrawingCanvas, { type DrawingCanvasHandle } from './DrawingCanvas';

export type DrawingToolHandle = {
  exportImage: () => string;
};

const DrawingTool = React.forwardRef<DrawingToolHandle>(
  function DrawingTool(_props, ref) {
    const [tool, setTool] = React.useState('pen');
    const canvasRef = React.useRef<DrawingCanvasHandle>(null);

    React.useImperativeHandle(ref, () => ({
      exportImage: () => canvasRef.current?.exportImage() ?? '',
    }));

    return (
      <Box>
        <Select
          value={tool}
          onChange={(e) => {
            setTool(e.target.value);
          }}
        >
          <MenuItem value="pen">Pen</MenuItem>
          <MenuItem value="eraser">Eraser</MenuItem>
        </Select>
        <Box sx={{ BorderColor: 'gray', border: 1, mt: 2 }}>
          <DrawingCanvas ref={canvasRef} tool={tool} />
        </Box>
      </Box>
    );
  },
);

export default DrawingTool;
