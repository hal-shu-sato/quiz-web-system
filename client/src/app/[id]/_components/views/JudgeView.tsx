import { Typography } from '@mui/material';

import AnswersRevealGrid from '@/components/AnswersRevealGrid';

import type { AnswerWithJudge } from '../../../../../../server/src/sockets/events';

export default function JudgeView({
  answers,
  showAnswer,
  showJudge,
}: {
  answers: AnswerWithJudge[];
  showAnswer: boolean;
  showJudge: boolean;
}) {
  if (!showAnswer) {
    return <Typography>採点中...</Typography>;
  }

  const revealAnswers = answers.map((answer) => ({
    id: answer.id,
    participant_name: answer.participant_name,
    answer_text: 'answer_text' in answer ? answer.answer_text : undefined,
    answer_image_url:
      'answer_image_url' in answer ? answer.answer_image_url : undefined,
    judgment_result: answer.judgment_result,
    awarded_points: answer.awarded_points,
  }));

  return (
    <AnswersRevealGrid
      answers={revealAnswers}
      showAnswers={showAnswer}
      showJudges={showJudge}
      emptyMessage="表示できる回答がまだありません"
    />
  );
}
