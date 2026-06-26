'use client';

import { useState } from 'react';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';

export default function ProblemCard({
  questionId,
  title,
  point,
  onSave,
}: {
  questionId: string;
  title: string;
  point: number;
  onSave: (title: string, point: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editPoint, setEditPoint] = useState(point);

  const handleOpen = () => {
    setEditTitle(title);
    setEditPoint(point);
    setOpen(true);
  };

  const handleSave = () => {
    onSave(editTitle, editPoint);
    setOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader title="問題" />
        <CardContent>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body1">ポイント: {point}</Typography>
          {!questionId && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              問題が未設定です。編集から作成してください。
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleOpen}>
            編集
          </Button>
        </CardActions>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>問題を編集</DialogTitle>
        <DialogContent>
          <TextField
            label="問題文"
            fullWidth
            margin="normal"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <TextField
            label="配点"
            type="number"
            fullWidth
            margin="normal"
            value={editPoint}
            onChange={(e) => setEditPoint(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>キャンセル</Button>
          <Button variant="contained" onClick={handleSave}>
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
