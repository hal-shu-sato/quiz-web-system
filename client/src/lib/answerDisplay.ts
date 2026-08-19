export type JudgmentResult =
  'pending' | 'correct' | 'partial' | 'incorrect' | 'dobon';

export type AnswerDisplayMode = 'hidden' | 'original' | 'judged';

export function getJudgmentBackgroundColor(
  judgment: JudgmentResult,
): [number, number, number] {
  switch (judgment) {
    case 'correct':
      return [255, 0, 0];
    case 'partial':
      return [0, 127, 0];
    case 'dobon':
      return [0, 0, 0];
    case 'incorrect':
    case 'pending':
    default:
      return [0, 0, 255];
  }
}

export function applyAnswerDisplayFilter(
  imageData: ImageData,
  mode: AnswerDisplayMode,
  judgment: JudgmentResult,
) {
  if (mode === 'original') {
    return;
  }

  const data = imageData.data;
  const [bgR, bgG, bgB] =
    mode === 'judged' ? getJudgmentBackgroundColor(judgment) : [0, 0, 255];

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const isStroke = avg < 128;

    if (mode === 'hidden') {
      if (isStroke) {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
      } else {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 191;
      }
      data[i + 3] = 255;
      continue;
    }

    if (isStroke) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    } else {
      data[i] = bgR;
      data[i + 1] = bgG;
      data[i + 2] = bgB;
    }

    data[i + 3] = 255;
  }
}
