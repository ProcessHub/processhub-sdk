import { BaseError } from "./apirequests";

let errorHandlers: ErrorHandler[] = [];

export function registerErrorHandler(handler: ErrorHandler): void {
  errorHandlers.push(handler);
}

export function removeErrorHandler(handler: ErrorHandler): void {
  errorHandlers = errorHandlers.filter(e => e !== handler);
}

export function getErrorHandlers(): ErrorHandler[] {
  return errorHandlers;
}

export interface ErrorHandler {
  handleError(error: BaseError, requestPath: string): void;
}