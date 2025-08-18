import { useEffect, useRef } from 'react';

import {
  Box,
  Container,
  Grid,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material';

function AnswerCanvas({
  imageUrl,
  judgmentResult,
}: {
  imageUrl: string;
  judgmentResult: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const img = new Image();
      img.src = imageUrl;
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;

            if (avg < 128) {
              data[i] = 255;
              data[i + 1] = 255;
              data[i + 2] = 255;
            } else {
              if (judgmentResult === 'correct') {
                data[i] = 255;
                data[i + 1] = 0;
                data[i + 2] = 0;
              } else if (judgmentResult === 'partial') {
                data[i] = 0;
                data[i + 1] = 127;
                data[i + 2] = 0;
              } else if (judgmentResult === 'dobon') {
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;
              } else {
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 255;
              }
            }

            data[i + 3] = 255; // Ensure full opacity
          }

          ctx.putImageData(imageData, 0, 0);
        }
      };
    }
  }, [imageUrl, judgmentResult]);

  return (
    <canvas
      ref={canvasRef}
      width={640}
      height={360}
      style={{
        objectFit: 'cover',
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
}

export default function ResultScreen({
  results,
  showJudges = false,
}: {
  results: {
    id: string;
    participant_name: string;
    answer_text: string;
    answer_image_url: string;
    judgment_result: 'pending' | 'correct' | 'partial' | 'incorrect' | 'dobon';
    awarded_points: number;
  }[];
  showJudges?: boolean;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Container sx={{ my: 2 }}>
        <Grid container spacing={2} justifyContent="center">
          {results.map((result) => {
            return (
              <Grid size={{ sm: 4 }} key={result.id}>
                <ImageListItem>
                  <AnswerCanvas
                    imageUrl={result.answer_image_url}
                    judgmentResult={
                      showJudges ? result.judgment_result : 'pending'
                    }
                  />
                  <ImageListItemBar
                    title={result.participant_name}
                    subtitle={showJudges && `${result.awarded_points}ポイント`}
                    sx={{
                      background: 'rgba(0, 0, 0, 0.25)',
                      textAlign: 'center',
                    }}
                  />
                </ImageListItem>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
