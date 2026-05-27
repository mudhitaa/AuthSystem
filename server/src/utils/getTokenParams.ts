export const getTokenParam = (token: string | string[] | undefined): string | null => {
  if (!token || Array.isArray(token)) return null;
  return token;
};