'use client';

import { useRef, useState } from 'react';

import { Alert, Button } from '@mui/material';

import socket from '@/sockets/socket';

import DrawingTool, { type DrawingToolHandle } from '../drawing/DrawingTool';

export default function AnswerView({
  questionId,
  participantId,
}: {
  questionId: string;
  participantId?: string;
}) {
  const drawingRef = useRef<DrawingToolHandle>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!questionId || !participantId) {
      setError('問題または参加者情報が取得できません');
      return;
    }

    const image = drawingRef.current?.exportImage();
    if (!image) {
      setError('回答を描画してください');
      return;
    }

    socket.emit('answer:create', {
      participant_id: participantId,
      question_id: questionId,
      answer_base64: image,
    });
    setSubmitted(true);
    setError('');
  };

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {submitted && (
        <Alert severity="success" sx={{ mb: 2 }}>
          回答を提出しました
        </Alert>
      )}
      <DrawingTool ref={drawingRef} />
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        disabled={submitted}
        onClick={handleSubmit}
      >
        回答を提出
      </Button>
    </>
  );
}
