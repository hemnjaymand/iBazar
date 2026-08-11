// server/errors/validation-error.ts
import { ApplicationError } from "./application-error";

export class ValidationError extends ApplicationError {
  readonly code = "VALIDATION_ERROR";
  readonly httpStatus = 400;

  constructor(message: string, public readonly fieldErrors?: Record<string, string[]>) {
    super(message);
  }
}