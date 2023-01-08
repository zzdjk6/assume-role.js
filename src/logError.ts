export const logError = (...messages) => {
  const datetime = new Date().toISOString();
  console.error(`[assume-role.js] ${datetime}: `, ...messages);
};
