const URL =
  process.env.NODE_ENV === 'production'
    ? (process.env.NEXT_PUBLIC_SOCKET_SERVER_URL ?? 'http://localhost:4000')
    : 'http://localhost:4000';

export default URL;
