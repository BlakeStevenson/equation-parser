import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { evaluateExpression } from "../mod.ts";

Deno.test("basic arithmetic", () => {
  assertEquals(evaluateExpression("2 + 3"), 5);
  assertEquals(evaluateExpression("2 * 3"), 6);
  assertEquals(evaluateExpression("10 - 4"), 6);
  assertEquals(evaluateExpression("12 / 3"), 4);
});

Deno.test("parentheses", () => {
  assertEquals(evaluateExpression("2 * (3 + 4)"), 14);
  assertEquals(evaluateExpression("(2 + 3) * 4"), 20);
});

Deno.test("variables", () => {
  const variables = new Map([["x", 5], ["y", 3]]);
  assertEquals(evaluateExpression("x + y", variables), 8);
  assertEquals(evaluateExpression("2 * x", variables), 10);
});