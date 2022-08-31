if (
  !process.env.NEXT_PUBLIC_APP_BASE_URL &&
  process.env.NODE_ENV === 'production'
)
  throw new Error('APP_BASE_URL environment variable not set.');

export const server =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_APP_BASE_URL
    : 'http://localhost:3000';
