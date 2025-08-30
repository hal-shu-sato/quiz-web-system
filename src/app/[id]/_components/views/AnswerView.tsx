import { Button } from '@mui/material';

import DrawingTool from '../drawing/DrawingTool';

export default function AnswerView() {
  return (
    <>
      <DrawingTool />
      <Button variant="contained" color="primary" sx={{ mt: 2 }}>
        回答を提出
      </Button>
    </>
  );
}
