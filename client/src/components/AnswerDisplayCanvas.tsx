'use client';

import { useEffect, useRef } from 'react';

import { Box } from '@mui/material';

import {
  applyAnswerDisplayFilter,
  type AnswerDisplayMode,
  type JudgmentResult,
} from '@/lib/answerDisplay';

export default function AnswerDisplayCanvas({
  imageUrl,
  mode,
  judgment = 'pending',
  width = 640,
  height = 360,
}: {
  imageUrl: string;
  mode: AnswerDisplayMode;
  judgment?: JudgmentResult;
  width?: number;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageUrl) {
      return;
    }

    const img = new Image();
    img.src = imageUrl;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        return;
      }

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (mode === 'original') {
        return;
      }

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      applyAnswerDisplayFilter(imageData, mode, judgment);
      ctx.putImageData(imageData, 0, 0);
    };
  }, [imageUrl, mode, judgment, width, height]);

  if (!imageUrl && mode === 'hidden') {
    return (
      <Box
        sx={{
          width: '100%',
          aspectRatio: `${width} / ${height}`,
          bgcolor: '#0000bf',
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        objectFit: 'cover',
        width: '100%',
        height: '100%',
        display: 'block',
        backgroundColor: mode === 'original' ? '#ffffff' : undefined,
      }}
    />
  );
}
