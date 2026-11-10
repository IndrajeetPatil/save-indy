import { defineConfig, lazyPlugins } from "vite-plus";
import { playwright } from "vite-plus/test/browser-playwright";

const isCI = Boolean(process.env["CI"]);

// Generated output never gets formatted or linted.
const GENERATED = [
  "coverage/**",
  "dist/**",
  "playwright-report/**",
  "test-results/**",
  ".fallow/**",
  ".lighthouseci/**",
  ".vitest/**",
];

const LINT_PLUGINS = [
  "eslint",
  "typescript",
  "unicorn",
  "oxc",
  "import",
  "jsdoc",
  "promise",
  "node",
  "vitest",
] as const;

const TEST_FILES = ["**/*.test.ts", "**/*.fixture.ts"];

// The production page loads only same-origin, hashed assets, so a strict
// policy costs nothing. It is added at build time because the dev server
// injects inline styles and an HMR client.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join("; ");

const contentSecurityPolicy = () => ({
  name: "content-security-policy",
  apply: "build" as const,
  transformIndexHtml: () => [
    {
      tag: "meta",
      attrs: {
        "http-equiv": "Content-Security-Policy",
        content: CONTENT_SECURITY_POLICY,
      },
      injectTo: "head-prepend" as const,
    },
  ],
});

export default defineConfig({
  // GitHub Pages serves the game from a sub-path; relative URLs keep the build
  // portable to any host and path.
  base: "./",
  plugins: lazyPlugins(() => [contentSecurityPolicy()]) ?? [],
  build: {
    // The font ships as WOFF2 only; inlining it would defeat caching.
    assetsInlineLimit: 0,
  },
  run: {
    tasks: {
      // Fixing source files must always execute, even with `vp run --cache`.
      check: { command: "vp check --deny-warnings", cache: false },
      build: { command: "vp build" },
      qa: {
        command: [
          "vp run check --fix",
          "vp run lint:css",
          "vp test --coverage",
          "vp pm audit -- --audit-level=moderate",
          "vp run fallow",
          "vp run type-coverage",
          "vp run test:e2e",
          "vp run lighthouse",
        ],
        // Tests and registry audits need fresh results on every QA run.
        cache: false,
      },
      "test:e2e": {
        command: "playwright test",
        dependsOn: ["build"],
        cache: false,
      },
      preview: {
        command: "vp preview --host 127.0.0.1 --strictPort",
        dependsOn: ["build"],
        cache: false,
      },
      lighthouse: {
        command: "vp dlx @lhci/cli@0.15.1 autorun",
        dependsOn: ["build"],
        cache: false,
      },
    },
  },
  server: { port: 5173 },
  preview: { port: 4173 },
  test: {
    reporters: isCI ? ["dot", "github-actions"] : ["default"],
    // Tests run in real Chromium, so canvas, Web Audio, and storage behave as
    // they do for players instead of through jsdom stand-ins.
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: "chromium" }],
    },
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts", "src/**/*.fixture.ts", "src/main.ts"],
      reportsDirectory: "coverage",
      reporter: ["text", "html", "lcov"],
      thresholds: {
        statements: 90,
        branches: 80,
        functions: 90,
        lines: 90,
      },
    },
    // Undo `vi.spyOn` and `vi.stubGlobal` before each test so spies and stubs
    // on browser APIs cannot leak.
    restoreMocks: true,
    unstubGlobals: true,
    // Shuffle files and tests on every run so order dependencies surface.
    sequence: { shuffle: true },
  },
  fmt: {
    printWidth: 80,
    // One entry per line with a trailing comma, so additions and removals
    // touch a single line.
    trailingComma: "all",
    objectWrap: "preserve",
    singleAttributePerLine: true,
    sortImports: {},
    ignorePatterns: [
      ...GENERATED,
      "pnpm-lock.yaml",
      ".github/CODE_OF_CONDUCT.md",
    ],
  },
  lint: {
    // Every rule in every category is an error. Rules below are only switched
    // off when they contradict another enabled rule, are obsolete for this
    // stack, or duplicate a stricter tool.
    plugins: [...LINT_PLUGINS],
    categories: {
      correctness: "error",
      suspicious: "error",
      pedantic: "error",
      perf: "error",
      style: "error",
      restriction: "error",
      nursery: "error",
    },
    env: {
      browser: true,
      builtin: true,
    },
    ignorePatterns: GENERATED,
    options: {
      typeAware: true,
      typeCheck: true,
      reportUnusedDisableDirectives: "error",
    },
    rules: {
      // Vite+ re-exports Vite and Vitest; import them through it.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "^(vite|vitest|@vitest/[^/]+)(/|$)",
              message: "Import from the matching vite-plus entry point.",
            },
          ],
        },
      ],

      // Security: every string reaches the page as text, never as markup.
      "no-restricted-properties": [
        "error",
        { property: "innerHTML" },
        { property: "outerHTML" },
        { property: "insertAdjacentHTML" },
        { property: "createContextualFragment" },
        { property: "setHTMLUnsafe" },
        { object: "document", property: "write" },
        { object: "document", property: "writeln" },
      ],
      "import/no-dynamic-require": ["error", { esmodule: true }],
      "no-eval": "error",
      "no-new-func": "error",
      "typescript/no-implied-eval": "error",

      // Cyclomatic complexity matches the Fallow health gate.
      complexity: ["error", { max: 5 }],
      // Coordinates are conventionally `x` and `y`; longer names would make
      // the drawing code harder to read, not easier.
      "id-length": ["error", { exceptions: ["x", "y"], properties: "never" }],
      // Zero, one, and "last" are not magic.
      "no-magic-numbers": ["error", { ignore: [-1, 0, 1] }],

      // Wrapped comments continue mid-sentence in lowercase, and coverage
      // hints such as `v8 ignore next` and `fallow-ignore-next-line` only match
      // in lowercase.
      "capitalized-comments": [
        "error",
        "always",
        {
          ignoreConsecutiveComments: true,
          ignorePattern: "[cv]8|istanbul|fallow",
        },
      ],
      // The vitest plugin's rules apply to every file; this one only makes
      // sense in test files, where the override re-enables it.
      "vitest/require-hook": "off",
      "one-var": ["error", "never"],
      "func-style": ["error", "declaration", { allowArrowFunctions: true }],
      // Promise-returning functions are `async` (promise-function-async);
      // the type-aware variant accepts those that return a promise directly.
      "require-await": "off",
      "typescript/require-await": "error",
      "unicorn/no-useless-undefined": ["error", { checkArguments: false }],
      // `void promise` marks a deliberately unawaited promise.
      "no-void": ["error", { allowAsStatement: true }],
      "no-duplicate-imports": ["error", { allowSeparateTypeImports: true }],
      "import/no-unassigned-import": [
        "error",
        { allow: ["**/*.css", "@fontsource/**"] },
      ],

      // Contradictory pairs: modules use named exports, the DOM uses `null`
      // for "no element", and TypeScript uses `undefined` for "absent".
      "import/no-default-export": "off",
      "import/no-named-export": "off",
      "import/prefer-default-export": "off",
      "import/group-exports": "off",
      "unicorn/no-null": "off",
      "no-undefined": "off",
      // A const object and its union type share a name by design; the type
      // checker still rejects genuine redeclarations.
      "no-redeclare": "off",

      // Obsolete for an ESNext target with native async/await, optional
      // chaining, and object spread.
      "oxc/no-async-await": "off",
      "oxc/no-optional-chaining": "off",
      "oxc/no-rest-spread-properties": "off",

      // Owned by stricter or dedicated tools: Oxfmt sorts imports, and the
      // complexity rule plus Fallow's health gate bound function size better
      // than line and statement counts.
      "sort-imports": "off",
      "max-lines-per-function": "off",
      "max-statements": "off",

      // Rules that forbid core language idioms outright: sorted object keys
      // would scramble data that reads in a natural order, and ternaries and
      // string literals are how the UI is written.
      "sort-keys": "off",
      "no-ternary": "off",
      "typescript/explicit-function-return-type": "off",
      // TypeScript owns parameter and return types; JSDoc must not repeat them.
      "jsdoc/require-param-type": "off",
      "jsdoc/require-returns-type": "off",
      // DOM and canvas types are mutable by design.
      "typescript/prefer-readonly-parameter-types": "off",
    },
    overrides: [
      {
        files: TEST_FILES,
        rules: {
          "vitest/consistent-test-it": ["error", { fn: "test" }],
          "vitest/require-hook": "error",
          "vitest/prefer-called-times": "off",
          // Contradict vitest/prefer-strict-boolean-matchers, which also
          // rejects non-boolean values that merely happen to be truthy.
          "vitest/prefer-to-be-truthy": "off",
          "vitest/prefer-to-be-falsy": "off",
          // Tests load the page markup from the project root.
          "import/no-relative-parent-imports": "off",
          "vitest/valid-title": ["error", { allowArguments: true }],
          "vitest/no-importing-vitest-globals": "off",
          "vitest/no-hooks": "off",
          "vitest/require-top-level-describe": "off",
          "vitest/require-test-timeout": "off",
          "vitest/prefer-expect-assertions": "off",
          // Fixture sizes and expected counts are clearer inline.
          "no-magic-numbers": "off",
        },
      },
      {
        // Pixel art is data: coordinates, sizes, and colours are the content,
        // and naming every one would hide the picture.
        files: ["src/scene/**"],
        rules: {
          "no-magic-numbers": "off",
        },
      },
      {
        files: ["e2e-tests/**"],
        rules: {
          // Playwright Test, not Vitest: its own `test`/`expect` imports,
          // `.spec.ts` naming, and no `test.each`.
          "vitest/prefer-importing-vitest-globals": "off",
          "vitest/consistent-test-filename": "off",
          "vitest/prefer-each": "off",
          "no-magic-numbers": "off",
          // Playwright steps must run sequentially within a page.
          "no-await-in-loop": "off",
          // The fixture reads the question bank in src to know right answers.
          "import/no-relative-parent-imports": "off",
        },
      },
      {
        // Node-run tooling reads the environment and prints results.
        files: ["*.config.ts", "scripts/**", "e2e-tests/**"],
        env: {
          node: true,
        },
        rules: {
          "node/no-top-level-await": "off",
          "node/no-process-env": "off",
          "import/no-nodejs-modules": "off",
          "no-console": "off",
          // Polling a server and reusing one browser page are sequential.
          "no-await-in-loop": "off",
        },
      },
      {
        // The question bank is data; splitting it by level would scatter
        // related questions without making any of them easier to review.
        files: ["src/questions.ts"],
        rules: {
          "max-lines": "off",
        },
      },
      {
        // The lint policy is one declarative list; splitting it across
        // modules would hide which rules are on.
        files: ["vite.config.ts"],
        rules: {
          "max-lines": "off",
        },
      },
    ],
  },
});
