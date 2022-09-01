export const server =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_APP_BASE_URL ||
      'https://exetercoursemap.vercel.app'
    : 'http://localhost:3000';
