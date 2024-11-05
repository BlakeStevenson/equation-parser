import { InvalidSyntaxError } from "./errors.ts";

export enum TokenType {
  Number,
  Operator,
  LeftParen,
  RightParen,
  Variable,
  UnaryOperator,
}

export interface Token {
  type: TokenType;
  value: string;
}
/** Determines what each piece of the expression is. */
export class Tokenizer {
  private position = 0;
  private input: string;
  private tokens: Token[] = [];

  constructor(input: string) {
    this.input = input.replace(/\s+/g, "");
  }

  private isDigit(char: string): boolean {
    return /[0-9.]/.test(char);
  }

  private isOperator(char: string): boolean {
    return /[-+*/^]/.test(char);
  }

  private isVariable(char: string): boolean {
    return /[a-zA-Z_]/.test(char);
  }

  private readVariable(): string {
    let variable = "";
    const startPos = this.position;

    // First character must be a letter or underscore
    if (!this.isVariable(this.input[startPos])) {
      throw new InvalidSyntaxError("Variable must start with a letter or underscore");
    }

    while (
      this.position < this.input.length &&
      (this.isVariable(this.input[this.position]) ||
        /[0-9]/.test(this.input[this.position]))
    ) {
      variable += this.input[this.position];
      this.position++;
    }

    return variable;
  }

  private readNumber(): string {
    let number = "";
    let hasDecimal = false;

    while (this.position < this.input.length) {
      const char = this.input[this.position];

      if (char === '.' && !hasDecimal) {
        hasDecimal = true;
        number += char;
        this.position++;
      } else if (char === 'e' || char === 'E') {
        number += char;
        this.position++;

        // Handle optional +/- after e
        if (this.position < this.input.length) {
          if (this.input[this.position] === '+' || this.input[this.position] === '-') {
            number += this.input[this.position];
            this.position++;
          }
        }
      } else if (this.isDigit(char)) {
        number += char;
        this.position++;
      } else {
        break;
      }
    }

    if (number.endsWith('.')) {
      throw new InvalidSyntaxError("Invalid number format");
    }

    return number;
  }

  private isUnaryContext(): boolean {
    if (this.position === 0) {
      const char = this.input[this.position];
      // Only + and - can be unary operators
      return char === '+' || char === '-';
    }

    const prevToken = this.tokens[this.tokens.length - 1];
    return prevToken && (
      prevToken.type === TokenType.Operator ||
      prevToken.type === TokenType.LeftParen
    );
  }

  tokenize(): Token[] {
    try {
      while (this.position < this.input.length) {
        const char = this.input[this.position];

        if (this.isDigit(char)) {
          const number = this.readNumber();
          this.tokens.push({ type: TokenType.Number, value: number });
        } else if (this.isOperator(char)) {
          if ((char === '+' || char === '-') && this.isUnaryContext()) {
            this.tokens.push({ type: TokenType.UnaryOperator, value: char });
          } else {
            // For non-unary operators, check if it's valid in this position
            if (this.position === 0 ||
              (this.tokens.length > 0 && this.tokens[this.tokens.length - 1].type === TokenType.Operator)) {
              throw new InvalidSyntaxError("Expression cannot start with a binary operator");
            }
            this.tokens.push({ type: TokenType.Operator, value: char });
          }
          this.position++;
        } else if (char === "(") {
          this.tokens.push({ type: TokenType.LeftParen, value: char });
          this.position++;
        } else if (char === ")") {
          this.tokens.push({ type: TokenType.RightParen, value: char });
          this.position++;
        } else if (this.isVariable(char)) {
          const variable = this.readVariable();
          this.tokens.push({ type: TokenType.Variable, value: variable });
        } else if (!/\s/.test(char)) {
          throw new InvalidSyntaxError(`Invalid character: ${char}`);
        } else {
          this.position++;
        }
      }

      this.validateTokenSequence();
      return this.tokens;
    } catch (error) {
      // Ensure we're throwing our custom error
      if (error instanceof InvalidSyntaxError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new InvalidSyntaxError(error.message);
      }
      throw new InvalidSyntaxError(String(error));
    }
  }

  private validateTokenSequence(): void {
    if (this.tokens.length === 0) {
      return;
    }

    // Check first token
    const firstToken = this.tokens[0];
    if (firstToken.type === TokenType.Operator) {
      throw new InvalidSyntaxError("Expression cannot start with a binary operator");
    }

    // Check last token
    const lastToken = this.tokens[this.tokens.length - 1];
    if (lastToken.type === TokenType.Operator) {
      throw new InvalidSyntaxError("Expression cannot end with an operator");
    }

    // Check consecutive operators
    for (let i = 0; i < this.tokens.length - 1; i++) {
      const current = this.tokens[i];
      const next = this.tokens[i + 1];

      if (current.type === TokenType.Operator && next.type === TokenType.Operator) {
        throw new InvalidSyntaxError("Consecutive operators are not allowed");
      }
    }
  }
}