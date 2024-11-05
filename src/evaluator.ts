import { UndefinedVariableError, DivisionByZeroError, InvalidSyntaxError } from "./errors.ts";
import { Node } from "./parser.ts";

export class Evaluator {
    private variables: Map<string, number>;

    constructor(variables: Map<string, number> = new Map()) {
        this.variables = variables;
    }

    evaluate(node: Node): number {
        switch (node.type) {
            case "number":
                return node.value as number;

            case "variable": {
                const value = this.variables.get(node.value as string);
                if (value === undefined) {
                    throw new UndefinedVariableError(node.value as string);
                }
                return value;
            }
            case "unary": {
                const operand = this.evaluate(node.right!);
                switch (node.value) {
                    case "+":
                        return +operand;
                    case "-":
                        return -operand;
                    default:
                        throw new InvalidSyntaxError();
                }
            }
            case "binary": {
                const left = this.evaluate(node.left!);
                const right = this.evaluate(node.right!);
                switch (node.value) {
                    case "+":
                        return left + right;
                    case "-":
                        return left - right;
                    case "*":
                        return left * right;
                    case "/":
                        if (Math.abs(right) < Number.EPSILON) {
                            throw new DivisionByZeroError();
                        }
                        return left / right;
                    case "^":
                        return Math.pow(left, right);
                    default:
                        throw new InvalidSyntaxError();
                }
            }

            default: {
                throw new InvalidSyntaxError();
            }
        }
    }
}