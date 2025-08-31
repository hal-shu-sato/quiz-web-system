import type { Judge } from '../../../../../../server/src/sockets/events';

export default function JudgeView({
  judge,
  showAnswer,
  showJudge,
}: {
  judge: Judge | null;
  showAnswer: boolean;
  showJudge: boolean;
}) {
  if (showAnswer && showJudge) {
    return <div>あなたの回答は{judge?.judgment_result}です！</div>;
  }
  if (showAnswer) {
    return <div>あなたの回答はこちらです！</div>;
  }
  return <div>採点中...</div>;
}
