export type MasterResumeErrorCode = "CONTENT_EMPTY" | "CONTENT_TOO_LONG";

export class MasterResumeError extends Error {
  constructor(
    readonly code: MasterResumeErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "MasterResumeError";
  }
}
