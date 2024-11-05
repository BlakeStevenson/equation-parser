import { InvalidSyntaxError } from "./errors.ts";
import { Token, TokenType } from "./tokenizer.ts";

export interface Node {
  type: string;
  value?: string | number;
  left?: Node;
  right?: Node;
}

export class Parser {
  private tokens: Token[];
  private position = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token | undefined {
    return this.tokens[this.position];
  }

  private consume(): Token {
    return this.tokens[this.position++];
  }

  private parsePrimary(): Node {
    const token = this.peek();

    if (!token) {
      throw new Error("Invalid syntax");
    }

    if (token.type === TokenType.UnaryOperator) {
      this.consume();
      const operand = this.parsePrimary();
      return {
        type: "unary",
        value: token.value,
        right: operand,
      };
    }

    if (token.type === TokenType.Number) {
      this.consume();
      const num = parseFloat(token.value);
      return { type: "number", value: num };
    }

    if (token.type === TokenType.Variable) {
      this.consume();
      return { type: "variable", value: token.value };
    }

    if (token.type === TokenType.LeftParen) {
      this.consume();
      const node = this.parseExpression();
      const rightParen = this.peek();
      if (!rightParen || rightParen.type !== TokenType.RightParen) {
        throw new Error("Invalid syntax");
      }
      this.consume();
      return node;
    }

    throw new Error("Invalid syntax");
  }


  private parseExpression(precedence = 0): Node {
    let left = this.parsePrimary();

    while (true) {
      const token = this.peek();
      if (!token || token.type !== TokenType.Operator) {
        break;
      }

      const nextPrecedence = this.getOperatorPrecedence(token.value);
      if (nextPrecedence <= precedence) {
        break;
      }

      this.consume();
      const right = this.parseExpression(nextPrecedence);
      left = {
        type: "binary",
        value: token.value,
        left,
        right,
      };
    }

    return left;
  }

  private getOperatorPrecedence(operator: string): number {
    switch (operator) {
      case "+":
      case "-":
        return 1;
      case "*":
      case "/":
        return 2;
      case "^":
        return 3;
      default:
        return 0;
    }
  }

  private validateParentheses(tokens: Token[]): void {
    let count = 0;
    for (const token of tokens) {
      if (token.type === TokenType.LeftParen) count++;
      if (token.type === TokenType.RightParen) count--;
      if (count < 0) throw new InvalidSyntaxError("Mismatched parentheses");
    }
    if (count !== 0) throw new InvalidSyntaxError("Mismatched parentheses");
  }

  parse(): Node {
    if (this.tokens.length === 0) {
      return { type: "number", value: 0 };
    }

    try {
      this.validateParentheses(this.tokens);
      const node = this.parseExpression();

      if (this.position < this.tokens.length) {
        throw new InvalidSyntaxError();
      }

      return node;
    } catch (error) {
      if (error instanceof InvalidSyntaxError) {
        throw error;
      }
      throw new InvalidSyntaxError();
    }
  }
}