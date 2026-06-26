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
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';

export default function ProblemCard({
  questionId,
  title,
  point,
  type,
  onSave,
  onNextQuestion,
}: {
  questionId: string;
  title: string;
  point: number;
  type: 'normal' | 'dobon';
  onSave: (title: string, point: number, type: 'normal' | 'dobon') => void;
  onNextQuestion: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editPoint, setEditPoint] = useState(point);
  const [editType, setEditType] = useState<'normal' | 'dobon'>(type);

  const handleOpen = () => {
    setEditTitle(title);
    setEditPoint(point);
    setEditType(type);
    setOpen(true);
  };

  const handleSave = () => {
    onSave(editTitle, editPoint, editType);
    setOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader title="問題" />
        <CardContent>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body1">ポイント: {point}</Typography>
          <Typography variant="body2" color="text.secondary">
            種別: {type === 'dobon' ? 'ドボン' : '通常'}
          </Typography>
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
          <Button size="small" onClick={onNextQuestion}>
            次の問題へ
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
          <TextField
            select
            label="種別"
            fullWidth
            margin="normal"
            value={editType}
            onChange={(e) => setEditType(e.target.value as 'normal' | 'dobon')}
          >
            <MenuItem value="normal">通常</MenuItem>
            <MenuItem value="dobon">ドボン</MenuItem>
          </TextField>
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
