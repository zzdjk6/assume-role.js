/**
 * Check if session is still alive
 * Returns `false` if session not exist or expired or will expire in 5 minutes
 *
 * @param expiration
 */
export const isRoleSessionAlive = (expiration: string) => {
  if (!expiration) {
    return false;
  }

  let exp;
  try {
    exp = Date.parse(expiration);
  } catch (e) {
    return false;
  }

  const now = Date.now();

  if (exp - now < 5 * 60 * 1000) {
    return false;
  }

  return true;
};
