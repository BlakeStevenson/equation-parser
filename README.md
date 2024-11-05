# Deno Equation Parser

A simple mathematical equation parser for Deno.

## Features

- Basic arithmetic operations (+, -, *, /, ^)
- Support for parentheses
- Variable substitution
- Floating-point numbers

## Usage

```typescript
import { evaluateExpression } from "https://deno.land/x/equation_parser/mod.ts";

// Basic arithmetic
console.log(evaluateExpression("2 + 3 * 4")); // Output: 14

// With variables
const variables = new Map([["x", 5], ["y", 3]]);
console.log(evaluateExpression("x + y", variables)); // Output: 8