# Deno Equation Parser

A robust mathematical equation parser for Deno that supports arithmetic operations, variables, parentheses, and proper error handling.

## Features

- Basic arithmetic operations (`+`, `-`, `*`, `/`, `^`)
- Support for parentheses and nested expressions
- Variable substitution
- Unary operators (positive and negative numbers)
- Scientific notation
- Comprehensive error handling
- Zero dependencies

## Installation

```typescript
import { evaluateExpression } from "https://deno.land/x/equation_parser@v1.0.0/mod.ts";
```

## Quick Start
```typescript
// Basic arithmetic
console.log(evaluateExpression("2 + 3 * 4"));  // 14
console.log(evaluateExpression("(2 + 3) * 4")); // 20
console.log(evaluateExpression("-5 * -3"));     // 15

// With variables
const variables = new Map([
    ["x", 5],
    ["y", 3]
]);
console.log(evaluateExpression("x + y", variables));     // 8
console.log(evaluateExpression("2 * x + y", variables)); // 13
```

## API Reference
### Main Function
```typescript
evaluateExpression(expression: string, variables?: Map<string, number>): number
```
Evaluates a mathematical expression and returns the result.

**Parameters**:
* `expression`: `string` - The mathematical expression to evaluate.
* `variables?`: `Map<string, number>` - Optional map of variable names to their values.

**Returns**:
* `number` - The result of evaluating the expression.

**Throws**:
* `InvalidSyntaxError` - When the expression contains invalid syntax.
* `UndefinedVariableError` - When a variable is used but not defined.
* `DivisionByZeroError` - When attempting to divide by zero.

### Error Classes
`InvalidSyntaxError`:
Thrown when the expression contains invalid syntax.
```typescript
try {
    evaluateExpression("2 + + 3");
} catch (error) {
    if (error instanceof InvalidSyntaxError) {
        console.error(error.message); // "Consecutive operators are not allowed"
    }
}
```

`UndefinedVariableError`:
Thrown when a variable is used but not defined in the variables map.
```typescript
try {
    evaluateExpression("x + 5");
} catch (error) {
    if (error instanceof UndefinedVariableError) {
        console.error(error.message); // "Undefined variable: x"
    }
}
```

`DivisionByZeroError`:
Thrown when attempting to divide by zero.
```typescript
try {
    evaluateExpression("5 / 0");
} catch (error) {
    if (error instanceof DivisionByZeroError) {
        console.error(error.message); // "Division by zero"
    }
}
```

## Supported Operations

### Arithmetic Operators
* **Addition**: `+`
* **Subtraction**: `-`
* **Multiplication**: `*`
* **Division**: `/`
* **Exponentiation**: `^`

### Unary Operators
* **Positive**: `+`
* **Negative**: `-`

### Parentheses
* **Grouping**: `(` and `)`

### Numbers
* **Integers**: `42`
* **Decimals**: `3.14`
* **Scientific Notation**: `1e-10`, `1.5e+3`

### Variables
* Must start with a letter or underscore.
* Can contain letters, numbers, and underscores.
* Case-sensitive.

## Examples
### Basic Arithmetic
```typescript
evaluateExpression("2 + 3")          // 5
evaluateExpression("2 * 3")          // 6
evaluateExpression("10 - 4")         // 6
evaluateExpression("12 / 3")         // 4
evaluateExpression("2 ^ 3")          // 8
```

### Complex Expressions
```typescript
evaluateExpression("2 + 3 * 4")              // 14
evaluateExpression("(2 + 3) * 4")            // 20
evaluateExpression("2 * (3 + 4)")            // 14
evaluateExpression("((2 + 3) * (4 + 5))")    // 45
```

### Variables
```typescript
const variables = new Map([
    ["x", 5],
    ["y", 3],
    ["price", 9.99]
]);

evaluateExpression("x + y", variables)         // 8
evaluateExpression("x * y", variables)         // 15
evaluateExpression("price * 2", variables)     // 19.98
```

### Scientific Notation
```typescript
evaluateExpression("1e3")        // 1000
evaluateExpression("1.5e-2")     // 0.015
evaluateExpression("1.5e+3")     // 1500
```

### Error Handling
```typescript
// Invalid syntax
try {
    evaluateExpression("2 + + 3");
} catch (error) {
    console.error(error.message); // "Consecutive operators are not allowed"
}

// Undefined variable
try {
    evaluateExpression("x + 5");
} catch (error) {
    console.error(error.message); // "Undefined variable: x"
}

// Division by zero
try {
    evaluateExpression("5 / 0");
} catch (error) {
    console.error(error.message); // "Division by zero"
}
```

## Testing
Run the test suite:
```bash
deno test
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License (see the LICENSE file for details)

## Version History
* 1.0.0
    * Initial release
    * Basic arithmetic operations
    * Variable support
    * Error handling
    * Parentheses support
    * Scientific notation support