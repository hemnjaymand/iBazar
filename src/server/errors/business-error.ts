// server/errors/business-error.ts
import { ApplicationError } from "./application-error";

export class BusinessError extends ApplicationError {
  readonly httpStatus = 422;

  constructor(message: string, public readonly code: string) {
    super(message);
  }
}