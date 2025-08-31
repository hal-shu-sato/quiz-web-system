import AdminPanel from './AdminPanel';

export default async function Admin({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminPanel id={id} />;
}
