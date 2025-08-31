import AdminScreen from './AdminScreen';

export default async function Screen({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminScreen id={id} />;
}
