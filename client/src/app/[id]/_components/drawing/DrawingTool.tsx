import React from 'react';

import { Box, MenuItem, Select } from '@mui/material';

import DrawingCanvas from './DrawingCanvas';

export default function DrawingTool() {
  const [tool, setTool] = React.useState('pen');

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
        <DrawingCanvas tool={tool} />
      </Box>
    </Box>
  );
}
