/** Thrown when the expression contains invalid syntax. */
export class InvalidSyntaxError extends Error {
  constructor(message: string = "Invalid syntax") {
    super(message);
    this.name = "InvalidSyntaxError";
    // These two lines are crucial for instanceof to work correctly
    Object.setPrototypeOf(this, InvalidSyntaxError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
/** Thrown when a variable is used but not defined in the variables map. */
export class UndefinedVariableError extends Error {
  constructor(variableName: string) {
    super(`Undefined variable: ${variableName}`);
    this.name = "UndefinedVariableError";
    Object.setPrototypeOf(this, UndefinedVariableError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
/** Thrown when attempting to divide by zero. */
export class DivisionByZeroError extends Error {
  constructor() {
    super("Division by zero");
    this.name = "DivisionByZeroError";
    Object.setPrototypeOf(this, DivisionByZeroError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}