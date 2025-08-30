export default function JudgeView({
  showAnswer,
  showJudge,
}: {
  showAnswer: boolean;
  showJudge: boolean;
}) {
  if (showAnswer && showJudge) {
    return <div>採点結果はこちらです！</div>;
  }
  if (showAnswer) {
    return <div>あなたの回答はこちらです！</div>;
  }
  return <div>採点中...</div>;
}
