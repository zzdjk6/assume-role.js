export const isExpired = (expiration: string) => {
  if (!expiration) {
    return true;
  }

  const exp = Date.parse(expiration);
  const now = Date.now();

  // Allow 5 minutes gap
  if (exp - now < 5 * 60 * 1000) {
    return true;
  }

  return false;
};
