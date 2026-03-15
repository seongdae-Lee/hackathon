import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // 테스트 파일은 일부 규칙 완화 대상이므로 별도 override로 처리
  ]),

  // ─── 프로젝트 공통 강화 규칙 ──────────────────────────────────────────
  {
    rules: {
      // console.log 금지 — 에러/경고 로깅(console.warn, console.error)은 허용
      // 이유: 프로덕션 번들에 디버그 로그 노출 방지. 에러 핸들러·에러 바운더리에서만 허용
      "no-console": ["error", { allow: ["warn", "error"] }],

      // any 타입 사용 금지 — tsconfig strict 모드와 이중 보호
      "@typescript-eslint/no-explicit-any": "error",

      // 미사용 변수 에러 — _접두사 변수는 의도적 미사용으로 허용
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // var 금지, const/let 강제
      "no-var": "error",
      "prefer-const": "error",

      // 빈 함수 경고 (의도적 빈 함수는 _noop 명명 규칙 사용)
      "@typescript-eslint/no-empty-function": "warn",

      // 타입 단언보다 타입 가드 권장
      "@typescript-eslint/consistent-type-assertions": [
        "warn",
        { assertionStyle: "as", objectLiteralTypeAssertions: "allow-as-parameter" },
      ],

      // 중복 import 방지
      "no-duplicate-imports": "error",
    },
  },

  // ─── 테스트 파일 완화 규칙 ───────────────────────────────────────────
  {
    files: ["__tests__/**/*.{ts,tsx}", "e2e/**/*.{ts,tsx}"],
    rules: {
      // 테스트에서는 console 허용 (디버깅 목적)
      "no-console": "off",
      // 테스트 유틸리티 함수에서 async 없이 Promise 반환 허용
      "@typescript-eslint/require-await": "off",
      // jest.fn(() => {}) 등 의도적 빈 콜백 허용
      "@typescript-eslint/no-empty-function": "off",
    },
  },
])

export default eslintConfig
