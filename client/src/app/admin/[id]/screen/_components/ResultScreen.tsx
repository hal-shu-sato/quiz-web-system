import AnswersRevealGrid from '@/components/AnswersRevealGrid';

export default function ResultScreen({
  results,
  showAnswers = false,
  showJudges = false,
}: {
  results: {
    id: string;
    participant_name: string;
    answer_text?: string;
    answer_image_url?: string;
    judgment_result: 'pending' | 'correct' | 'partial' | 'incorrect' | 'dobon';
    awarded_points: number;
  }[];
  showAnswers?: boolean;
  showJudges?: boolean;
}) {
  return (
    <AnswersRevealGrid
      answers={results}
      showAnswers={showAnswers}
      showJudges={showJudges}
      fullScreen
    />
  );
}
