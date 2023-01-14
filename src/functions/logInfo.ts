export const logInfo = (...messages: any[]) => {
  const datetime = new Date().toISOString();
  console.log(`[assume-role.js] ${datetime}: `, ...messages);
};
