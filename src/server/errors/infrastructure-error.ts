// server/errors/infrastructure-error.ts
import { ApplicationError } from "./application-error";

export class InfrastructureError extends ApplicationError {
  readonly code = "INFRASTRUCTURE_ERROR";
  readonly httpStatus = 500;
}