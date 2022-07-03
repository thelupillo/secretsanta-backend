export const formatUsername = (username: string): string => {
  if (!username) return '';
  return username.toLowerCase();
};
