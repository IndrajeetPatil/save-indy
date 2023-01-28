let questions = [
  // ---------------- beginner ----------------

  {
    question: "Hello word ?",
    answers: ["0", "1", "SyntaxError", "2"],
    correctAnswer: "1",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "What does `typeof NaN` evaluate to?",
    answers: ["number", "undefined", "null", "NaN"],
    correctAnswer: "number",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "What does `null == undefined` evaluate to?",
    answers: ["true", "false", "undefined", "null"],
    correctAnswer: "true",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "Which of the following is not a literal?",
    answers: ["null", "true", "myVar", "-3.14"],
    correctAnswer: "myVar",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "Which of the following is not a falsy value?",
    answers: ["' '", "null", "undefined", "[ ]"],
    correctAnswer: "[ ]",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "Which of the following is not a truthy value?",
    answers: ["'false'", "'0'", "''", "[ ]"],
    correctAnswer: "''",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "Which of the following is not a primitive type?",
    answers: ["string", "object", "symbol", "undefined"],
    correctAnswer: "object",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "Which of the following array methods doesn't create a new array?",
    answers: ["filter", "sort", "map", "reduce"],
    correctAnswer: "sort",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "Which of the following statements is true?",
    answers: ["Objects are immutable.", "Variables are untyped.", "Primitives are mutable.", "Constants are typed."],
    correctAnswer: "Variables are untyped.",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "Which of these is not a global constant?",
    answers: ["-Infinity", "-0", "NaN", "-NaN"],
    correctAnswer: "-NaN",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "Which special value is returned if underflow occurs from a negative number?",
    answers: ["-Infinity", "-0", "0", "NaN"],
    correctAnswer: "-0",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "What will `0 === -0` evaluate to?",
    answers: ["null", "true", "false", "undefined"],
    correctAnswer: "true",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "Which of the following is not a valid string delimiter?",
    answers: ["'", '"', "`", "{"],
    correctAnswer: "{",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "Currently, which is not a meaningful escape sequence?",
    answers: ["\\b", "\\q", "\\n", "\\t"],
    correctAnswer: "\\q",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "Which of these string methods doesn't return a Boolean?",
    answers: ["startsWith", "endsWith", "includes", "indexOf"],
    correctAnswer: "indexOf",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "Which of this is a valid RegExp datatype?",
    answers: ["/^x/", "\\^x\\", "/^x\\", "\\^x/"],
    correctAnswer: "/^x/",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "If `x` is an array of length 2, what would `x[2]` return?",
    answers: ["null", "undefined", "Error object", "NaN"],
    correctAnswer: "undefined",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "What does `Number(undefined)` evaluate to?",
    answers: ["undefined", "1", "0", "NaN"],
    correctAnswer: "NaN",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "What does `Number(null)` evaluate to?",
    answers: ["undefined", "1", "0", "NaN"],
    correctAnswer: "0",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "If a variable is declared but not initialized, what's its value?",
    answers: ["undefined", "null", "0", "NaN"],
    correctAnswer: "undefined",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "If `let a = [], b = [];`, what would `a == b` evaluate to?",
    answers: ["undefined", "true", "false", "NaN"],
    correctAnswer: "false",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "Which of the following will not return `NaN`?",
    answers: ["1 + 'x'", "1 * 'x'", "1 % 'x'", "1 - 'x'"],
    correctAnswer: "1 + 'x'",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "What would `Boolean(() =&gt; {})` evaluate to?",
    answers: ["undefined", "true", "false", "NaN"],
    correctAnswer: "true",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "What would `0 == '0' || 0 === '0'`, evaluate to?",
    answers: ["undefined", "true", "false", "null"],
    correctAnswer: "true",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "Which is not a valid syntax for a `for` loop?",
    answers: ["for(i; i &lt; x.length; i++)", "for(let i of x)", "for(const i of x)", "for(let i in x)"],
    correctAnswer: "for(i; i &lt; x.length; i++)",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "Which of the following will not return `ll`?",
    answers: ["x.slice(2, 4);", "x.substring(2, 4);", "x[2] + x[3];", "x[2, 3];"],
    correctAnswer: "x[2, 3];",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "If `let x = [5, , 1];`, then what is `x[1]`?",
    answers: ["NaN", "null", "5", "undefined"],
    correctAnswer: "undefined",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "If `let x = [5, 1, ];`, then what is `x.length`?",
    answers: ["2", "3", "0", "undefined"],
    correctAnswer: "2",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "Which of the following is not a valid identifier?",
    answers: ["a3", "_a3", "3a", "A3"],
    correctAnswer: "_a3",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "If `let x; y = 0;`, what would `x.[y++]` evaluate to?",
    answers: ["TypeError", "null", "undefined", "NaN"],
    correctAnswer: "TypeError",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "Which of the following is not a valid operator?",
    answers: ["++", "delete", "??", "?!"],
    correctAnswer: "?!",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "Which keyword calls the parent constructor?",
    answers: ["new", "this", "super", "here"],
    correctAnswer: "super",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "If `let x = -2; ++x;`, what will `console.log(x--);` evaluate to?",
    answers: ["-2", "-1", "-3", "0"],
    correctAnswer: "-1",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "What will `3 &gt; 2 &gt; 1` evaluate to?",
    answers: ["true", "false", "SyntaxError", "TypeError"],
    correctAnswer: "false",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "Do `1 + (2 + '3')` and `(1 + 2) + '3'` return same strings?",
    answers: ["true", "false", "SyntaxError", "TypeError"],
    correctAnswer: "false",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "Which of the following operators is used for assignment?",
    answers: ["=", "==", "===", "===="],
    correctAnswer: "=",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "Which of the following is false?",
    answers: [
      "typeof null === 'null'",
      "typeof undefined === 'undefined'",
      "typeof Math.max === 'function'",
      "typeof [] === 'object'",
    ],
    correctAnswer: "typeof null === 'null'",
    language: "javascript",
    level: "beginner",
  },
  {
    question: "After `let x = [1, 2]; delete x[0];`, what is `x.length`?",
    answers: ["0", "1", "2", "undefined"],
    correctAnswer: "2",
    language: "javascript",
    level: "beginner",
  },

  // ---------------- intermediate ----------------

  {
    question: "Which of the following is not a valid way to declare a variable in javascript?",
    answers: ["var", "let", "const", "define"],
    correctAnswer: "define",
    language: "javascript",
    level: "intermediate",
    },

    {
      question: "Which of the following is not a valid keyword for working with functions in javascript?",
      answers: ["function", "return", "callback", "execute"],
      correctAnswer: "execute",
      language: "javascript",
      level: "intermediate",
      },

      {
        question: "Which of the following is not a valid comparison operator in javascript?",
        answers: ["==", "===", ">=", "is"],
        correctAnswer: "is",
        language: "javascript",
        level: "intermediate",
        },

        {
          question: "Which of the following is not a valid method for working with arrays in javascript?",
          answers: ["slice()", "splice()", "filter()", "search()"],
          correctAnswer: "search()",
          language: "javascript",
          level: "intermediate",
          },


          {
            question: "Which of the following is not a valid keyword for working with control flow in javascript?",
            answers: ["if", "else", "switch", "condition"],
            correctAnswer: "condition",
            language: "javascript",
            level: "intermediate",
            },


            {
              question: "Which of the following is not a valid method for working with objects in javascript?",
              answers: ["hasOwnProperty()", "propertyIsEnumerable()", "getOwnPropertyDescriptor()", "getOwnPropertyNames()"],
              correctAnswer: "getOwnPropertyNames()",
              language: "javascript",
              level: "intermediate",
              },

              {
                question: "Which of the following is not a valid method for working with numbers in javascript?",
                answers: ["toFixed()", "toPrecision()", "toString()", "toValue()"],
                correctAnswer: "toValue()",
                language: "javascript",
                level: "intermediate",
                },

                {
                  question: "Which of the following is not a valid method for working with dates in javascript?",
                  answers: ["getTime()", "getUTCFullYear()", "getUTCHours()", "getMilliseconds()"],
                  correctAnswer: "getMilliseconds()",
                  language: "javascript",
                  level: "intermediate",
                  },
                  {
                    question: "Which of the following is not a valid statement for working with errors in javascript?",
                    answers: ["try-catch", "throw", "assert()", "raise"],
                    correctAnswer: "raise",
                    language: "javascript",
                    level: "intermediate",
                    },
                    
                    
                    
                    
    
  {
    question: "Which primary expression is not a constant?",
    answers: ["true", "false", "null", "this"],
    correctAnswer: "this",
    language: "javascript",
    level: "intermediate",
  },
  {
    question: "Which of the following objects doesn't have a literal syntax?",
    answers: ["string", "symbol", "BigInt", "integer"],
    correctAnswer: "symbol",
    language: "javascript",
    level: "intermediate",
  },
  {
    question: "In `let [x, y, z] = [1, [2, 3]];`, what value is assigned to `z`?",
    answers: ["[2, 3]", "2", "3", "undefined"],
    correctAnswer: "undefined",
    language: "javascript",
    level: "intermediate",
  },
  {
    question: "Which option produces variable `x` without block scope?",
    answers: ["let x", "const x", "var x", "no way exists"],
    correctAnswer: "var x",
    language: "javascript",
    level: "intermediate",
  },
  {
    question: "What would [a, b, x] after `let x = 1; let [a, b] = [++x, x++];` is run?",
    answers: ["[2, 2, 3]", "[1, 2, 3]", "[2, 2, 2]", "[2, 3, 3]"],
    correctAnswer: "[2, 2, 3]",
    language: "javascript",
    level: "intermediate",
  },
  {
    question: "If `let x = { y: 1 };`, which is an invalid property access expression?",
    answers: ["x.y", "x['y']", "x?.y", "x?['y']"],
    correctAnswer: "x?['y']",
    language: "javascript",
    level: "intermediate",
  },
  {
    question: "If `let x; y = 0;`, what would `x?.[y++]` evaluate to?",
    answers: ["TypeError", "null", "undefined", "NaN"],
    correctAnswer: "undefined",
    language: "javascript",
    level: "intermediate",
  },
  {
    question: "Which of these will produce a TypeError?",
    answers: ["[...'hi'];", "[...new Set([1, 2])];", "[...[1, 2]];", "[...{ x: [1, 2] }];"],
    correctAnswer: "[...{ x: [1, 2] }];",
    language: "javascript",
    level: "intermediate",
  },
  {
    question: "None of the operators have the following arity:",
    answers: ["unary", "binary", "ternary", "quaternary"],
    correctAnswer: "quaternary",
    language: "javascript",
    level: "intermediate",
  },
  {
    question: "What does `'x' + + 'y'` evaluate to?",
    answers: ["xNaN", "x y", "TypeError", "xNaNy"],
    correctAnswer: "xNaN",
    language: "javascript",
    level: "intermediate",
  },
  {
    question: "What does `-3**2` evaluate to?",
    answers: ["-9", "9", "SyntaxError", "NaN"],
    correctAnswer: "SyntaxError",
    language: "javascript",
    level: "intermediate",
  },
  {
    question: "For which primitive type are `++x` and `x + 1` not equivalent?",
    answers: ["null", "boolean", "string", "number"],
    correctAnswer: "string",
    language: "javascript",
    level: "intermediate",
  },
  {
    question: "If `let p = { a: 'x', b: 'y' };`, which of the following is not true?",
    answers: ["'a' in p", "'b' in p", "'x' in p", "'constructor' in p"],
    correctAnswer: "'x' in p",
    language: "javascript",
    level: "intermediate",
  },
  {
    question: "After `let x = 5; var y = 6;` and `eval('let x = 1; var y = 2;')`, what will `x` and `y` be?",
    answers: ["5 and 2", "5 and 6", "1 and 6", "1 and 2"],
    correctAnswer: "5 and 2",
    language: "javascript",
    level: "intermediate",
  },
  {
    question: "Which of the following is not a valid method for working with strings in javascript?",
    answers: ["charAt()", "indexOf()", "replace()", "splitString()"],
    correctAnswer: "splitString()",
    language: "javascript",
    level: "intermediate",
    },

  

  // ---------------- advanced ----------------

  {
    question: "Which is not a valid algorithm for object-to-primitive conversions?",
    answers: ["prefer-string", "prefer-number", "prefer-boolean", "no-preference"],
    correctAnswer: "prefer-boolean",
    language: "javascript",
    level: "advanced",
  },

  {
    question: "Which is not a valid algorithm for object-to-primitive conversions?",
    answers: ["prefer-string", "prefer-number", "prefer-boolean", "no-preference"],
    correctAnswer: "prefer-boolean",
    language: "javascript",
    level: "advanced",
  },

  {
    question: "What's the standard way to refer to global object in any context?",
    answers: ["global", "globalThis", "window", "self"],
    correctAnswer: "globalThis",
    language: "javascript",
    level: "advanced",
  },
  {
    question: "In `let [x, y, ...z] = [1, [2, 3]];`, what value is assigned to `z`?",
    answers: ["[ ]", "null", "3", "undefined"],
    correctAnswer: "[ ]",
    language: "javascript",
    level: "advanced",
  },
  {
    question: "Which variable declaration method hoists it to the top of enclosing function?",
    answers: ["let x", "const x", "var x", "no method exists"],
    correctAnswer: "var x",
    language: "javascript",
    level: "advanced",
  },

  {
    question: "What would be the value of `tan` after `let {sin, cos, ...tan} = Math;`?",
    answers: ["function tan() { [native code] }", "{ }", "TypeError", "udefined"],
    correctAnswer: "{ }",
    language: "javascript",
    level: "advanced",
  },
  {
    question: "What is the length of string literal '😋'?",
    answers: ["1", "2", "0", "undefined"],
    correctAnswer: "2",
    language: "javascript",
    level: "advanced",
  },
  {
    question: "Which of the following is not an lvalue?",
    answers: ["variable", "literal", "object property", "array element"],
    correctAnswer: "literal",
    language: "javascript",
    level: "advanced",
  },
  {
    question: "Which of the following is not an lvalue?",
    answers: ["variable", "literal", "object property", "array element"],
    correctAnswer: "literal",
    language: "javascript",
    level: "advanced",
  },
  
{
  question: "What is the correct way to declare a constant variable in javascript?",
  answers: ["const variable = value", "let variable = value", "var variable = value", "final variable = value"],
  correctAnswer: "const variable = value",
  language: "javascript",
  level: "advanced",
  },
  
{
  question: "What is the correct way to declare a constant variable in javascript?",
  answers: ["const variable = value", "let variable = value", "var variable = value", "final variable = value"],
  correctAnswer: "const variable = value",
  language: "javascript",
  level: "advanced",
  }
  
  {
  question: "Which method can be used to concatenate two arrays in javascript?",
  answers: ["append()", "concat()", "join()", "merge()"],
  correctAnswer: "concat()",
  language: "javascript",
  level: "advanced",
  },
  {
    question: "Which of the following is not a valid operator in javascript?",
    answers: ["instanceof", "typeof", "classof", "instanceof()"],
    correctAnswer: "classof",
    language: "javascript",
    level: "advanced",
    },

    
{
  question: "What is the correct way to declare a constant variable in javascript?",
  answers: ["const variable = value", "let variable = value", "var variable = value", "final variable = value"],
  correctAnswer: "const variable = value",
  language: "javascript",
  level: "advanced",
  }
  
  {
  question: "Which method can be used to concatenate two arrays in javascript?",
  answers: ["append()", "concat()", "join()", "merge()"],
  correctAnswer: "concat()",
  language: "javascript",
  level: "advanced",
  }
  
  {
  question: "Which of the following is not a valid operator in javascript?",
  answers: ["instanceof", "typeof", "classof", "instanceof()"],
  correctAnswer: "classof",
  language: "javascript",
  level: "advanced",
  }
  
  {
  question: "Which of the following is not a valid type of function in javascript?",
  answers: ["function declaration", "function expression", "function constructor", "class declaration"],
  correctAnswer: "class declaration",
  language: "javascript",
  level: "advanced",
  },

  {
    question: "Which method can be used to remove the last element of an array in javascript?",
    answers: ["pop()", "shift()", "remove()", "delete()"],
    correctAnswer: "pop()",
    language: "javascript",
    level: "advanced",
    },

    {
      question: "Which of the following is not a valid looping construct in javascript?",
      answers: ["for", "while", "do-while", "foreach"],
      correctAnswer: "foreach",
      language: "javascript",
      level: "advanced",
      },

      {
        question: "Which of the following is not a valid method for creating an object in javascript?",
        answers: ["Object.create()", "new Object()", "Object.defineProperties()", "object literal"],
        correctAnswer: "new Object()",
        language: "javascript",
        level: "advanced",
        },

        
{
  question: "What is the correct way to declare a constant variable in javascript?",
  answers: ["const variable = value", "let variable = value", "var variable = value", "final variable = value"],
  correctAnswer: "const variable = value",
  language: "javascript",
  level: "advanced",
  }
  
  {
  question: "Which method can be used to concatenate two arrays in javascript?",
  answers: ["append()", "concat()", "join()", "merge()"],
  correctAnswer: "concat()",
  language: "javascript",
  level: "advanced",
  }
  
  {
  question: "Which of the following is not a valid operator in javascript?",
  answers: ["instanceof", "typeof", "classof", "instanceof()"],
  correctAnswer: "classof",
  language: "javascript",
  level: "advanced",
  }
  
  {
  question: "Which of the following is not a valid type of function in javascript?",
  answers: ["function declaration", "function expression", "function constructor", "class declaration"],
  correctAnswer: "class declaration",
  language: "javascript",
  level: "advanced",
  }
  
  {
  question: "Which method can be used to remove the last element of an array in javascript?",
  answers: ["pop()", "shift()", "remove()", "delete()"],
  correctAnswer: "pop()",
  language: "javascript",
  level: "advanced",
  }
  
  {
  question: "Which of the following is not a valid looping construct in javascript?",
  answers: ["for", "while", "do-while", "foreach"],
  correctAnswer: "foreach",
  language: "javascript",
  level: "advanced",
  }
  
  {
  question: "Which of the following is not a valid method for creating an object in javascript?",
  answers: ["Object.create()", "new Object()", "Object.defineProperties()", "object literal"],
  correctAnswer: "new Object()",
  language: "javascript",
  level: "advanced",
  }
  
  {
  question: "Which of the following is not a valid method for working with regular expressions in javascript?",
  answers: ["test()", "exec()", "match()", "split()"],
  correctAnswer: "match()",
  language: "javascript",
  level: "advanced",
  },
  {
    question: "Which of the following is not a valid method for working with dates in javascript?",
    answers: ["getDate()", "getFullYear()", "getMinutes()", "getMilliseconds()"],
    correctAnswer: "getMilliseconds()",
    language: "javascript",
    level: "advanced",
    },

    {
      question: "Which of the following is not a valid statement for working with errors in javascript?",
      answers: ["try-catch", "throw", "assert()", "finally"],
      correctAnswer: "assert()",
      language: "javascript",
      level: "advanced",
      },


  
  
];
