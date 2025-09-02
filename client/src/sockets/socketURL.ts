const URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_SOCKET_SERVER_URL
    : 'ws://localhost:4000';

export default URL;
