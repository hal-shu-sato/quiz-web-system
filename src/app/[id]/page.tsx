import QuizPanel from './QuizPanel';

export default async function PlayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <QuizPanel id={id} />;
}
