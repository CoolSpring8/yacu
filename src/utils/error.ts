export class BasicError extends Error {
  constructor(message?: string) {
    super(`[CC98-Evolved] ${message}`);
  }
}
