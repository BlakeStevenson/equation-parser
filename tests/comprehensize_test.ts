import {
    assertEquals,
    assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { evaluateExpression, Tokenizer, Parser, Evaluator, DivisionByZeroError, InvalidSyntaxError, UndefinedVariableError } from "../mod.ts";

// Helper function to round to a specific decimal place for floating-point comparisons
function round(value: number, decimals: number): number {
    return Number(Math.round(Number(value + "e" + decimals)) + "e-" + decimals);
}

// Basic Arithmetic Tests
Deno.test("basic arithmetic - addition", () => {
    assertEquals(evaluateExpression("2 + 3"), 5);
    assertEquals(evaluateExpression("0 + 0"), 0);
    assertEquals(evaluateExpression("1000 + 2000"), 3000);
    assertEquals(evaluateExpression("-5 + 3"), -2);
});

Deno.test("basic arithmetic - subtraction", () => {
    assertEquals(evaluateExpression("5 - 3"), 2);
    assertEquals(evaluateExpression("0 - 0"), 0);
    assertEquals(evaluateExpression("1000 - 2000"), -1000);
    assertEquals(evaluateExpression("-5 - 3"), -8);
});

Deno.test("basic arithmetic - multiplication", () => {
    assertEquals(evaluateExpression("2 * 3"), 6);
    assertEquals(evaluateExpression("0 * 5"), 0);
    assertEquals(evaluateExpression("-5 * 3"), -15);
    assertEquals(evaluateExpression("-5 * -3"), 15);
});

Deno.test("basic arithmetic - division", () => {
    assertEquals(evaluateExpression("6 / 2"), 3);
    assertEquals(evaluateExpression("0 / 5"), 0);
    assertEquals(round(evaluateExpression("10 / 3"), 10), round(10 / 3, 10));
    assertEquals(evaluateExpression("-15 / 3"), -5);
});

// Complex Expression Tests
Deno.test("complex expressions", () => {
    assertEquals(evaluateExpression("2 + 3 * 4"), 14);
    assertEquals(evaluateExpression("(2 + 3) * 4"), 20);
    assertEquals(evaluateExpression("2 * 3 + 4 * 5"), 26);
    assertEquals(evaluateExpression("(2 + 3 * 4) / 2"), 7);
});

// Parentheses Tests
Deno.test("nested parentheses", () => {
    assertEquals(evaluateExpression("((2 + 3) * (4 + 5))"), 45);
    assertEquals(evaluateExpression("(2 + (3 * 4))"), 14);
    assertEquals(evaluateExpression("((2 + 3) * 4)"), 20);
    assertEquals(evaluateExpression("(2 + 3) * (4 + 5)"), 45);
});

// Variable Tests
Deno.test("variable expressions", () => {
    const variables = new Map([
        ["x", 5],
        ["y", 3],
        ["z", 10],
    ]);

    assertEquals(evaluateExpression("x + y", variables), 8);
    assertEquals(evaluateExpression("x * y", variables), 15);
    assertEquals(evaluateExpression("(x + y) * z", variables), 80);
    assertEquals(evaluateExpression("x + y * z", variables), 35);
});

// Decimal Number Tests
Deno.test("decimal numbers", () => {
    assertEquals(evaluateExpression("2.5 + 3.7"), 6.2);
    assertEquals(evaluateExpression("2.5 * 3"), 7.5);
    assertEquals(round(evaluateExpression("10.5 / 3"), 4), round(3.5, 4));
    assertEquals(evaluateExpression("2.5 + 3.7 * 2"), 9.9);
});

// Whitespace Handling Tests
Deno.test("whitespace handling", () => {
    assertEquals(evaluateExpression("2+3"), 5);
    assertEquals(evaluateExpression(" 2 + 3 "), 5);
    assertEquals(evaluateExpression("2    +    3"), 5);
    assertEquals(evaluateExpression("\t2\t+\t3\n"), 5);
});

// Error Handling Tests
Deno.test("error handling - invalid syntax", () => {
    // Test consecutive operators
    assertThrows(
        () => evaluateExpression("2 + * 3"),
        InvalidSyntaxError,
        "Expression cannot start with a binary operator"
    );

    // Test expression starting with binary operator
    assertThrows(
        () => evaluateExpression("* 2 + 3"),
        InvalidSyntaxError,
        "Expression cannot start with a binary operator"
    );

    // Test expression ending with operator
    assertThrows(
        () => evaluateExpression("2 + 3 +"),
        InvalidSyntaxError,
        "Expression cannot end with an operator"
    );

    // Test mismatched parentheses
    assertThrows(
        () => evaluateExpression("2 + (3"),
        InvalidSyntaxError,
        "Mismatched parentheses"
    );

    assertThrows(
        () => evaluateExpression("2 + )3"),
        InvalidSyntaxError,
        "Mismatched parentheses"
    );

    // Test invalid number format
    assertThrows(
        () => evaluateExpression("2 + 3."),
        InvalidSyntaxError,
        "Invalid number format"
    );

    Deno.test("error handling - invalid syntax", () => {
        assertThrows(
            () => evaluateExpression("2 + + 3"),
            InvalidSyntaxError,
            "Consecutive operators are not allowed"
        );

        assertThrows(
            () => evaluateExpression("2 +"),
            InvalidSyntaxError,
            "Expression cannot end with an operator"
        );

        assertThrows(
            () => evaluateExpression("+ 2"),
            InvalidSyntaxError,
            "Invalid syntax"
        );
    });
});

// verify instanceof works
/*Deno.test("error instanceof check", () => {
    try {
        evaluateExpression("2 + + 3");
        throw new Error("Should not reach here");
    } catch (error) {
        assertEquals(error instanceof InvalidSyntaxError, true);
        if (error instanceof InvalidSyntaxError) {
            assertEquals(error.message, "Consecutive operators are not allowed");
        } else {
            throw error;
        }
    }
});*/

// Large Number Tests
Deno.test("large numbers", () => {
    assertEquals(evaluateExpression("999999 + 1"), 1000000);
    assertEquals(evaluateExpression("1000000 * 1000000"), 1000000000000);
});

// Order of Operations Tests
Deno.test("order of operations", () => {
    assertEquals(evaluateExpression("2 + 3 * 4 + 5"), 19);
    assertEquals(evaluateExpression("2 * 3 + 4 * 5"), 26);
    assertEquals(evaluateExpression("2 + 3 * 4 / 2"), 8);
    assertEquals(evaluateExpression("10 - 2 * 3"), 4);
});

// Component Tests
Deno.test("tokenizer component", () => {
    const tokenizer = new Tokenizer("2 + 3 * (4 - x)");
    const tokens = tokenizer.tokenize();
    assertEquals(tokens.length, 9);
    assertEquals(tokens[0].value, "2");
    assertEquals(tokens[1].value, "+");
    assertEquals(tokens[2].value, "3");
});

Deno.test("parser component", () => {
    const tokenizer = new Tokenizer("2 + 3");
    const tokens = tokenizer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    assertEquals(ast.type, "binary");
    assertEquals(ast.value, "+");
});

Deno.test("evaluator component", () => {
    const variables = new Map([["x", 5]]);
    const evaluator = new Evaluator(variables);
    const ast = {
        type: "binary",
        value: "+",
        left: { type: "number", value: 2 },
        right: { type: "variable", value: "x" },
    };
    assertEquals(evaluator.evaluate(ast), 7);
});

// Performance Tests
Deno.test("performance - complex expression", () => {
    const start = performance.now();
    const result = evaluateExpression(
        "((2 + 3 * 4) / 2) * ((5 + 6) * (7 + 8))"
    );
    const end = performance.now();
    assertEquals(result, 1155);
    assertEquals(end - start < 100, true); // Should complete within 100ms
});

// Stress Tests
Deno.test("stress test - deep nesting", () => {
    let expression = "1";
    for (let i = 0; i < 50; i++) {
        expression = `(${expression} + 1)`;
    }
    const result = evaluateExpression(expression);
    assertEquals(result, 51);
});

// Edge Cases
Deno.test("edge cases", () => {
    assertEquals(evaluateExpression(""), 0);
    assertEquals(evaluateExpression(" "), 0);
    assertEquals(evaluateExpression("0"), 0);
    assertEquals(evaluateExpression("-0"), 0);
    assertEquals(evaluateExpression("+0"), 0);
});

// Scientific Notation
Deno.test("scientific notation", () => {
    assertEquals(evaluateExpression("1e2"), 100);
    assertEquals(evaluateExpression("1e-2"), 0.01);
    assertEquals(evaluateExpression("1.5e2"), 150);
});

// Variable Name Edge Cases
Deno.test("variable name edge cases", () => {
    const variables = new Map([
        ["x1", 1],
        ["_y", 2],
        ["longVariableName", 3],
    ]);

    assertEquals(evaluateExpression("x1 + _y", variables), 3);
    assertEquals(evaluateExpression("longVariableName * 2", variables), 6);
});

// Unary Operators
Deno.test("unary operators", () => {
    assertEquals(evaluateExpression("-5"), -5);
    //assertEquals(evaluateExpression("--5"), 5);
    assertEquals(evaluateExpression("-(-5)"), 5);
});

Deno.test("unary operators and negative numbers", () => {
    // Test negative numbers
    assertEquals(evaluateExpression("-5"), -5);
    assertEquals(evaluateExpression("(-5)"), -5);
    assertEquals(evaluateExpression("-5 * -3"), 15);
    assertEquals(evaluateExpression("(-5) * (-3)"), 15);
    
    // Test positive unary operator
    assertEquals(evaluateExpression("+5"), 5);
    assertEquals(evaluateExpression("(+5)"), 5);
    
    // Test combinations
    assertEquals(evaluateExpression("-5 + 3"), -2);
    assertEquals(evaluateExpression("5 * -3"), -15);
    assertEquals(evaluateExpression("-5 * -3"), 15);
  });
  
  Deno.test("invalid operator usage", () => {
    // Test invalid binary operator at start
    assertThrows(
      () => evaluateExpression("* 5"),
      InvalidSyntaxError,
      "Expression cannot start with a binary operator"
    );
    
    // Test consecutive binary operators
    /*assertThrows(
      () => evaluateExpression("5 * * 3"),
      InvalidSyntaxError,
      "Consecutive operators are not allowed"
    );*/
    
    // Test operator at end
    assertThrows(
      () => evaluateExpression("5 *"),
      InvalidSyntaxError,
      "Expression cannot end with an operator"
    );
  });