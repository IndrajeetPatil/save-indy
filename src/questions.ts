import type { Level } from "./config.ts";

/**
 * A multiple-choice question. Text between backticks renders as inline code.
 */
export interface Question {
  readonly level: Level;
  readonly prompt: string;
  /** Exactly four distinct answers, one of which is `correct`. */
  readonly answers: readonly string[];
  readonly correct: string;
  readonly explanation: string;
}

export const QUESTIONS: readonly Question[] = [
  // ---------------- beginner ----------------
  {
    level: "beginner",
    prompt: "What will `+true` evaluate to?",
    answers: ["0", "1", "SyntaxError", "2"],
    correct: "1",
    explanation:
      "Unary `+` converts its operand to a number, and `true` converts to `1`.",
  },
  {
    level: "beginner",
    prompt: "What does `typeof NaN` evaluate to?",
    answers: ["number", "undefined", "null", "NaN"],
    correct: "number",
    explanation: '`NaN` ("not a number") is still a value of the number type.',
  },
  {
    level: "beginner",
    prompt: "What does `null == undefined` evaluate to?",
    answers: ["true", "false", "undefined", "null"],
    correct: "true",
    explanation:
      "Loose equality treats `null` and `undefined` as equal to each other and to nothing else.",
  },
  {
    level: "beginner",
    prompt: "Which of the following is not a literal?",
    answers: ["null", "true", "myVar", "3.14"],
    correct: "myVar",
    explanation:
      "`myVar` is an identifier that names a variable; the others are values written directly in code.",
  },
  {
    level: "beginner",
    prompt: "Which of the following is not a falsy value?",
    answers: ["''", "null", "undefined", "[ ]"],
    correct: "[ ]",
    explanation: "Every object is truthy, including an empty array.",
  },
  {
    level: "beginner",
    prompt: "Which of the following is not a truthy value?",
    answers: ["'false'", "'0'", "''", "[ ]"],
    correct: "''",
    explanation:
      "Only the empty string is falsy; any non-empty string, even `'false'` or `'0'`, is truthy.",
  },
  {
    level: "beginner",
    prompt: "Which of the following is not a primitive type?",
    answers: ["string", "object", "symbol", "undefined"],
    correct: "object",
    explanation:
      "Objects are reference types; strings, symbols, and `undefined` are primitives.",
  },
  {
    level: "beginner",
    prompt: "Which of the following array methods doesn't create a new array?",
    answers: ["filter", "sort", "map", "concat"],
    correct: "sort",
    explanation:
      "`sort` reorders the array in place and returns that same array; use `toSorted` for a copy.",
  },
  {
    level: "beginner",
    prompt: "Which of the following statements is true?",
    answers: [
      "Objects are immutable.",
      "Variables are untyped.",
      "Primitives are mutable.",
      "Constants are typed.",
    ],
    correct: "Variables are untyped.",
    explanation:
      "Values have types, but a variable can hold a value of any type at any time.",
  },
  {
    level: "beginner",
    prompt: "Which of these is not a predefined global value?",
    answers: ["Infinity", "NaN", "undefined", "Nil"],
    correct: "Nil",
    explanation:
      "`Infinity`, `NaN`, and `undefined` are read-only properties of the global object; JavaScript has no `Nil`.",
  },
  {
    level: "beginner",
    prompt:
      "Which special value is returned if underflow occurs from a negative number?",
    answers: ["-Infinity", "-0", "0", "NaN"],
    correct: "-0",
    explanation:
      "A negative result too small to represent rounds to negative zero, which keeps its sign.",
  },
  {
    level: "beginner",
    prompt: "What will `0 === -0` evaluate to?",
    answers: ["null", "true", "false", "undefined"],
    correct: "true",
    explanation:
      "Strict equality treats the two zeros as equal; only `Object.is(0, -0)` tells them apart.",
  },
  {
    level: "beginner",
    prompt: "Which of the following is not a valid string delimiter?",
    answers: ["'", '"', "`", "{"],
    correct: "{",
    explanation:
      "Strings are delimited by single quotes, double quotes, or backticks (template literals).",
  },
  {
    level: "beginner",
    prompt: "Which of these is not a meaningful escape sequence?",
    answers: [String.raw`\b`, String.raw`\q`, String.raw`\n`, String.raw`\t`],
    correct: String.raw`\q`,
    explanation:
      "`\\b`, `\\n`, and `\\t` are backspace, newline, and tab; an unknown escape like `\\q` is just `q`.",
  },
  {
    level: "beginner",
    prompt: "Which of these string methods doesn't return a Boolean?",
    answers: ["startsWith", "endsWith", "includes", "indexOf"],
    correct: "indexOf",
    explanation:
      "`indexOf` returns a position, or `-1` when the substring is missing.",
  },
  {
    level: "beginner",
    prompt: "Which of these is a valid RegExp literal?",
    answers: ["/^x/", "\\^x\\", "/^x\\", String.raw`\^x/`],
    correct: "/^x/",
    explanation:
      "A regular expression literal is a pattern between two forward slashes.",
  },
  {
    level: "beginner",
    prompt: "If `x` is an array of length 2, what would `x[2]` return?",
    answers: ["null", "undefined", "TypeError", "NaN"],
    correct: "undefined",
    explanation:
      "Indexes start at 0, so `x[2]` is past the end, and reading a missing element gives `undefined`.",
  },
  {
    level: "beginner",
    prompt: "What does `Number(undefined)` evaluate to?",
    answers: ["undefined", "1", "0", "NaN"],
    correct: "NaN",
    explanation: "`undefined` has no numeric meaning, so it converts to `NaN`.",
  },
  {
    level: "beginner",
    prompt: "What does `Number(null)` evaluate to?",
    answers: ["undefined", "1", "0", "NaN"],
    correct: "0",
    explanation: "Unlike `undefined`, `null` converts to `0`.",
  },
  {
    level: "beginner",
    prompt: "If a variable is declared but not initialized, what's its value?",
    answers: ["undefined", "null", "0", "NaN"],
    correct: "undefined",
    explanation:
      "`let x;` or `var x;` leaves `x` holding `undefined` until something is assigned.",
  },
  {
    level: "beginner",
    prompt: "If `let a = [], b = [];`, what would `a == b` evaluate to?",
    answers: ["undefined", "true", "false", "NaN"],
    correct: "false",
    explanation:
      "Objects compare by reference, and `a` and `b` are two different arrays.",
  },
  {
    level: "beginner",
    prompt: "Which of the following will not return `NaN`?",
    answers: ["1 + 'x'", "1 * 'x'", "1 % 'x'", "1 - 'x'"],
    correct: "1 + 'x'",
    explanation:
      "With a string operand, `+` concatenates and gives `'1x'`; the other operators convert `'x'` to `NaN`.",
  },
  {
    level: "beginner",
    prompt: "What would `Boolean(() => {})` evaluate to?",
    answers: ["undefined", "true", "false", "NaN"],
    correct: "true",
    explanation: "Functions are objects, and every object is truthy.",
  },
  {
    level: "beginner",
    prompt: "What would `0 == '0' || 0 === '0'` evaluate to?",
    answers: ["undefined", "true", "false", "null"],
    correct: "true",
    explanation:
      "`0 == '0'` converts the string to a number and is `true`, so `||` returns `true` without checking the rest.",
  },
  {
    level: "beginner",
    prompt: "Which is not a valid syntax for a `for` loop?",
    answers: [
      "for(let i = 0, i < x.length, i++)",
      "for(let i of x)",
      "for(const i of x)",
      "for(let i in x)",
    ],
    correct: "for(let i = 0, i < x.length, i++)",
    explanation:
      "The three parts of a classic `for` header are separated by semicolons, not commas.",
  },
  {
    level: "beginner",
    prompt:
      "If `let x = 'hello';`, which of the following will not return `'ll'`?",
    answers: [
      "x.slice(2, 4);",
      "x.substring(2, 4);",
      "x[2] + x[3];",
      "x[2, 3];",
    ],
    correct: "x[2, 3];",
    explanation:
      "Inside the brackets, the comma operator evaluates to its last operand, so `x[2, 3]` is just `x[3]`, which is `'l'`.",
  },
  {
    level: "beginner",
    prompt: "If `let x = [5, , 1];`, then what is `x[1]`?",
    answers: ["NaN", "null", "5", "undefined"],
    correct: "undefined",
    explanation:
      "The empty slot is a hole in a sparse array, and reading it gives `undefined`.",
  },
  {
    level: "beginner",
    prompt: "If `let x = [5, 1, ];`, then what is `x.length`?",
    answers: ["2", "3", "0", "undefined"],
    correct: "2",
    explanation: "A single trailing comma in an array literal is ignored.",
  },
  {
    level: "beginner",
    prompt: "Which of the following is not a valid identifier?",
    answers: ["a3", "_a3", "3a", "A3"],
    correct: "3a",
    explanation: "Identifiers may contain digits but cannot start with one.",
  },
  {
    level: "beginner",
    prompt: "If `let x, y = 0;`, what would `x[y++]` evaluate to?",
    answers: ["TypeError", "null", "undefined", "NaN"],
    correct: "TypeError",
    explanation:
      "`x` is `undefined`, and reading any property of `undefined` throws a `TypeError`.",
  },
  {
    level: "beginner",
    prompt: "Which of the following is not a valid operator?",
    answers: ["++", "delete", "??", "?!"],
    correct: "?!",
    explanation:
      "`++` increments, `delete` removes a property, and `??` is nullish coalescing; `?!` doesn't exist.",
  },
  {
    level: "beginner",
    prompt: "Which keyword calls the parent constructor?",
    answers: ["new", "this", "super", "here"],
    correct: "super",
    explanation:
      "In a subclass constructor, `super(...)` runs the parent class's constructor.",
  },
  {
    level: "beginner",
    prompt: "If `let x = -2; ++x;`, what will `console.log(x--);` print?",
    answers: ["-2", "-1", "-3", "0"],
    correct: "-1",
    explanation:
      "`++x` makes `x` equal `-1`; postfix `x--` returns the old value `-1` before decrementing.",
  },
  {
    level: "beginner",
    prompt: "What will `3 > 2 > 1` evaluate to?",
    answers: ["true", "false", "SyntaxError", "TypeError"],
    correct: "false",
    explanation:
      "It runs left to right: `3 > 2` is `true`, and `true > 1` compares `1 > 1`, which is `false`.",
  },
  {
    level: "beginner",
    prompt: "Do `1 + (2 + '3')` and `(1 + 2) + '3'` return the same string?",
    answers: ["true", "false", "SyntaxError", "TypeError"],
    correct: "false",
    explanation:
      "The first is `1 + '23'`, giving `'123'`; the second is `3 + '3'`, giving `'33'`.",
  },
  {
    level: "beginner",
    prompt: "Which of the following operators is used for assignment?",
    answers: ["=", "==", "===", "===="],
    correct: "=",
    explanation:
      "`=` assigns; `==` and `===` compare, and `====` doesn't exist.",
  },
  {
    level: "beginner",
    prompt: "Which of the following is false?",
    answers: [
      "typeof null === 'null'",
      "typeof undefined === 'undefined'",
      "typeof Math.max === 'function'",
      "typeof [] === 'object'",
    ],
    correct: "typeof null === 'null'",
    explanation: "A long-standing quirk: `typeof null` is `'object'`.",
  },
  {
    level: "beginner",
    prompt: "After `let x = [1, 2]; delete x[0];`, what is `x.length`?",
    answers: ["0", "1", "2", "undefined"],
    correct: "2",
    explanation:
      "`delete` leaves a hole without shifting elements, so the length stays the same.",
  },
  {
    level: "beginner",
    prompt:
      "Which statement won't make the interpreter jump to a different part of the program?",
    answers: ["return;", "break;", "debugger;", "continue;"],
    correct: "debugger;",
    explanation:
      "`debugger` only pauses execution when developer tools are open; it doesn't change where the program goes next.",
  },

  // ---------------- intermediate ----------------
  {
    level: "intermediate",
    prompt: "Which primary expression is not a constant?",
    answers: ["true", "false", "null", "this"],
    correct: "this",
    explanation:
      "`this` evaluates to a different object depending on how the surrounding code is called.",
  },
  {
    level: "intermediate",
    prompt: "Which of these types doesn't have a literal syntax?",
    answers: ["string", "symbol", "BigInt", "number"],
    correct: "symbol",
    explanation:
      "Strings (`'a'`), BigInts (`1n`), and numbers (`42`) have literals; symbols only come from `Symbol()`.",
  },
  {
    level: "intermediate",
    prompt: "In `let [x, y, z] = [1, [2, 3]];`, what value is assigned to `z`?",
    answers: ["[2, 3]", "2", "3", "undefined"],
    correct: "undefined",
    explanation:
      "The array has two elements, so `y` gets `[2, 3]` and `z` has nothing left to take.",
  },
  {
    level: "intermediate",
    prompt: "Which option produces variable `x` without block scope?",
    answers: ["let x", "const x", "var x", "define x"],
    correct: "var x",
    explanation:
      "`var` is scoped to the enclosing function; `let` and `const` are scoped to the block.",
  },
  {
    level: "intermediate",
    prompt: "If `let x = 1; let [a, b] = [++x, x++];`, what is `[a, b, x]`?",
    answers: ["[2, 2, 3]", "[1, 2, 3]", "[2, 2, 2]", "[2, 3, 3]"],
    correct: "[2, 2, 3]",
    explanation:
      "`++x` makes `x` 2 and returns 2; `x++` returns 2 and then makes `x` 3.",
  },
  {
    level: "intermediate",
    prompt:
      "If `let x = { y: 1 };`, which is an invalid property access expression?",
    answers: ["x.y", "x['y']", "x?.y", "x?['y']"],
    correct: "x?['y']",
    explanation:
      "Optional chaining with brackets is written `x?.['y']`; `x?['y']` starts a conditional expression and is a syntax error.",
  },
  {
    level: "intermediate",
    prompt: "If `let x, y = 0;`, what would `x?.[y++]` evaluate to?",
    answers: ["TypeError", "null", "undefined", "NaN"],
    correct: "undefined",
    explanation:
      "`x` is `undefined`, so `?.` short-circuits to `undefined` and `y++` never runs.",
  },
  {
    level: "intermediate",
    prompt: "Which of these will produce a TypeError?",
    answers: [
      "[...'hi'];",
      "[...new Set([1, 2])];",
      "[...[1, 2]];",
      "[...{ x: [1, 2] }];",
    ],
    correct: "[...{ x: [1, 2] }];",
    explanation:
      "Array spread needs an iterable; strings, sets, and arrays are iterable but plain objects aren't.",
  },
  {
    level: "intermediate",
    prompt: "No JavaScript operator has which arity?",
    answers: ["unary", "binary", "ternary", "quaternary"],
    correct: "quaternary",
    explanation:
      "Operators take one (`!x`), two (`a + b`), or three (`c ? a : b`) operands, never four.",
  },
  {
    level: "intermediate",
    prompt: "What does `'x' + + 'y'` evaluate to?",
    answers: ["xNaN", "x y", "TypeError", "xNaNy"],
    correct: "xNaN",
    explanation:
      "The second `+` is unary and turns `'y'` into `NaN`; then `'x' + NaN` concatenates to `'xNaN'`.",
  },
  {
    level: "intermediate",
    prompt: "What does `-3**2` evaluate to?",
    answers: ["-9", "9", "SyntaxError", "NaN"],
    correct: "SyntaxError",
    explanation:
      "A unary operator directly before `**` is ambiguous, so you must write `(-3)**2` or `-(3**2)`.",
  },
  {
    level: "intermediate",
    prompt: "For which primitive type are `++x` and `x + 1` not equivalent?",
    answers: ["null", "boolean", "string", "number"],
    correct: "string",
    explanation:
      "`++` always converts to a number, but `+` concatenates strings: if `x` is `'1'`, `++x` is `2` and `x + 1` is `'11'`.",
  },
  {
    level: "intermediate",
    prompt:
      "If `let p = { a: 'x', b: 'y' };`, which of the following is not true?",
    answers: ["'a' in p", "'b' in p", "'x' in p", "'constructor' in p"],
    correct: "'x' in p",
    explanation:
      "`in` checks property names, including inherited ones like `constructor`, not values.",
  },
  {
    level: "intermediate",
    prompt:
      "In non-strict code, after `let x = 5; var y = 6;` and `eval('let x = 1; var y = 2;')`, what will `x` and `y` be?",
    answers: ["5 and 2", "5 and 6", "1 and 6", "1 and 2"],
    correct: "5 and 2",
    explanation:
      "`let` inside `eval` stays local to the eval, but a non-strict direct `eval` declares `var` in the surrounding scope.",
  },
  {
    level: "intermediate",
    prompt:
      "If no `case` of a `switch` matches and there is no `default`, what happens?",
    answers: [
      "Execution continues after the switch",
      "SyntaxError",
      "TypeError",
      "The last case runs",
    ],
    correct: "Execution continues after the switch",
    explanation:
      "`default` is optional; without a match, the whole `switch` body is skipped.",
  },
  {
    level: "intermediate",
    prompt: "Which of the following is not an iterable object?",
    answers: ["string", "map", "plain object", "set"],
    correct: "plain object",
    explanation:
      "Plain objects don't implement `Symbol.iterator`; use `Object.entries` to loop over them with `for/of`.",
  },
  {
    level: "intermediate",
    prompt: "Which of these `for` loop headers is invalid?",
    answers: [
      "for (;;)",
      "for (i in x)",
      "for (let i = 0;;)",
      "None, all are valid",
    ],
    correct: "None, all are valid",
    explanation:
      "Every part of a classic `for` header is optional, and `for/in` can assign to an existing variable.",
  },
  {
    level: "intermediate",
    prompt: "Which statement can be used with a statement label?",
    answers: ["break", "return", "throw", "with"],
    correct: "break",
    explanation:
      "`break label` (and `continue label`) can exit or continue an outer, labelled statement.",
  },
  {
    level: "intermediate",
    prompt:
      "If `function f() { return this; }`, what will `typeof f()` be in strict mode?",
    answers: ["SyntaxError", "TypeError", "undefined", "object"],
    correct: "undefined",
    explanation:
      "In strict mode, a plain function call gets `this === undefined` instead of the global object.",
  },
  {
    level: "intermediate",
    prompt: "Which is not a valid state for a Promise object?",
    answers: ["pending", "fulfilled", "rejected", "accepted"],
    correct: "accepted",
    explanation:
      "A promise is pending until it settles as either fulfilled or rejected.",
  },
  {
    level: "intermediate",
    prompt: "If `let f = function() {};`, what is `f.length`?",
    answers: ["null", "undefined", "0", "SyntaxError"],
    correct: "0",
    explanation:
      "A function's `length` is the number of declared parameters, and `f` has none.",
  },
  {
    level: "intermediate",
    prompt: "Which of these values won't be serialized to `null`?",
    answers: ["true", "-Infinity", "NaN", "Infinity"],
    correct: "true",
    explanation:
      "JSON has no representation for `NaN` or infinities, so `JSON.stringify` writes `null`; `true` stays `true`.",
  },

  // ---------------- advanced ----------------
  {
    level: "advanced",
    prompt:
      "Which is not a valid algorithm for object-to-primitive conversions?",
    answers: [
      "prefer-string",
      "prefer-number",
      "prefer-boolean",
      "no-preference",
    ],
    correct: "prefer-boolean",
    explanation:
      "Conversion to boolean never calls an object's methods: every object is simply `true`.",
  },
  {
    level: "advanced",
    prompt: "Which value does `JSON.stringify` turn into a meaningful string?",
    answers: ["a function", "a Date", "a RegExp", "undefined"],
    correct: "a Date",
    explanation:
      "Dates have a `toJSON` method that returns an ISO string; a RegExp becomes `{}`, and functions and `undefined` are dropped.",
  },
  {
    level: "advanced",
    prompt:
      "What's the standard way to refer to the global object in any context?",
    answers: ["global", "globalThis", "window", "self"],
    correct: "globalThis",
    explanation:
      "`window`, `self`, and `global` exist only in some environments; `globalThis` works everywhere.",
  },
  {
    level: "advanced",
    prompt:
      "In `let [x, y, ...z] = [1, [2, 3]];`, what value is assigned to `z`?",
    answers: ["[ ]", "null", "3", "undefined"],
    correct: "[ ]",
    explanation:
      "A rest element always produces an array, which is empty when nothing is left over.",
  },
  {
    level: "advanced",
    prompt:
      "Which declaration is hoisted to the top of the enclosing function?",
    answers: ["let x", "const x", "var x", "no declaration is"],
    correct: "var x",
    explanation:
      "`var` is function-scoped and usable (as `undefined`) before its line; `let` and `const` are block-scoped and unusable until declared.",
  },
  {
    level: "advanced",
    prompt:
      "What would be the value of `tan` after `let {sin, cos, ...tan} = Math;`?",
    answers: [
      "function tan() { [native code] }",
      "{ }",
      "TypeError",
      "undefined",
    ],
    correct: "{ }",
    explanation:
      "Object rest copies only own enumerable properties, and none of `Math`'s properties are enumerable.",
  },
  {
    level: "advanced",
    prompt: "What is the length of the string literal `'😋'`?",
    answers: ["1", "2", "0", "undefined"],
    correct: "2",
    explanation:
      "`length` counts UTF-16 code units, and this emoji needs two (a surrogate pair).",
  },
  {
    level: "advanced",
    prompt: "Which of the following is not an lvalue?",
    answers: ["variable", "literal", "object property", "array element"],
    correct: "literal",
    explanation:
      "An lvalue is something you can assign to; you can't assign to a literal like `3`.",
  },
  {
    level: "advanced",
    prompt: "Which is not a valid way to iterate over object (`o`) properties?",
    answers: [
      "for(let p in o)",
      "for(let p of o)",
      "for(let k of Object.keys(o))",
      "for(let [k, v] of Object.entries(o))",
    ],
    correct: "for(let p of o)",
    explanation:
      "`for/of` needs an iterable, and plain objects aren't; it throws a `TypeError`.",
  },
  {
    level: "advanced",
    prompt:
      "How many times will a `for/of` loop iterate over the `'🐍❌🤖'` string?",
    answers: ["3", "5", "0", "2"],
    correct: "3",
    explanation:
      "String iteration goes by code point, so each emoji is one step even though `length` is 5.",
  },
  {
    level: "advanced",
    prompt: "Which of these is false for strict mode?",
    answers: [
      "Variable declaration isn't optional.",
      "Function parameters can't have duplicate names.",
      "The `with` statement isn't allowed.",
      "BigInt literals aren't allowed.",
    ],
    correct: "BigInt literals aren't allowed.",
    explanation:
      "Strict mode removes sloppy features such as implicit globals and `with`; BigInt literals like `1n` work in any mode.",
  },
  {
    level: "advanced",
    prompt: "Which of the following operations creates a deep copy?",
    answers: [
      "`Array.from()`",
      "`Object.assign()`",
      "Spread syntax",
      "`structuredClone()`",
    ],
    correct: "`structuredClone()`",
    explanation:
      "The others copy only the top level; `structuredClone` recursively copies nested objects too.",
  },
  {
    level: "advanced",
    prompt:
      "Which method won't create an array from an iterable, array-like object `x` (e.g. `arguments`)?",
    answers: [
      "`[...x]`",
      "`Array.from(x)`",
      "`Array.prototype.slice.call(x)`",
      "`Object.create(Array)`",
    ],
    correct: "`Object.create(Array)`",
    explanation:
      "`Object.create(Array)` makes a new object that inherits from the `Array` constructor and ignores `x` entirely.",
  },
];
