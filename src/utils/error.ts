export class BasicError extends Error {
  constructor(message?: string) {
    super(`[yacu] ${message}`);
  }
}
