import { Tokenizer } from "./src/tokenizer.ts";
import { Parser } from "./src/parser.ts";
import { Evaluator } from "./src/evaluator.ts";
import {
  InvalidSyntaxError,
  UndefinedVariableError,
  DivisionByZeroError,
} from "./src/errors.ts";

export {
  Tokenizer,
  Parser,
  Evaluator,
  InvalidSyntaxError,
  UndefinedVariableError,
  DivisionByZeroError,
};

export function evaluateExpression(
  expression: string,
  variables: Map<string, number> = new Map()
): number {
  if (!expression.trim()) {
    return 0;
  }

  try {
    const tokenizer = new Tokenizer(expression);
    const tokens = tokenizer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const evaluator = new Evaluator(variables);
    return evaluator.evaluate(ast);
  } catch (error) {
    if (
      error instanceof InvalidSyntaxError ||
      error instanceof UndefinedVariableError ||
      error instanceof DivisionByZeroError
    ) {
      throw error;
    }
    if (error instanceof Error) {
      throw new InvalidSyntaxError(error.message);
    }
    throw new InvalidSyntaxError("An unknown error occurred");
  }
}