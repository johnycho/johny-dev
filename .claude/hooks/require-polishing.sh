#!/usr/bin/env bash
# PreToolUse(Bash) hook
# 커밋 직전에 블로그 전체(blog/*.mdx, static/diagrams/*.html)를 폴리싱 스캔하고, 처리되지 않은 지적이 남아 있으면 커밋을 막는다.
# 지적은 (1) 실제 위반이면 고치고, (2) 문맥상 규칙 예외면 사유와 함께 예외 목록에 등록해야 사라진다.
# 0건이 되어야 커밋을 허용한다. 고치거나 예외로 등록하는 것은 모두 사용자 확인을 받은 뒤에 한다.

input=$(cat)

# 커밋 명령이 아니면 즉시 통과
printf '%s' "$input" | grep -Eq 'git[[:space:]]+commit' || exit 0

root="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
out=$(cd "$root" && shopt -s nullglob && python3 .claude/skills/blog-polishing/scan-polishing.py --check blog/*.mdx static/diagrams/*.html 2>&1)
status=$?

if [ $status -ne 0 ]; then
  echo "[johny-dev] 커밋 차단: 블로그 전체 폴리싱 스캔에 처리되지 않은 지적이 남아 있습니다." >&2
  printf '%s\n' "$out" | grep -E '^  (blog|static)/' | head -30 >&2
  printf '%s\n' "$out" | grep -E '^총 ' >&2
  echo "다음 순서로 진행한 뒤 커밋을 다시 시도하세요(임의로 바꾸지 말 것):" >&2
  echo "  1) /blog-polishing 절차로 지적을 문맥 확인해 '고칠 것'과 '예외로 둘 것(사유)'으로 나눈 변경안을 만든다" >&2
  echo "  2) 변경안을 사용자에게 보여 주고 확인을 받는다" >&2
  echo "  3) 확인받은 대로 고치고, 예외는 scan-polishing.py --allow <파일> <줄> <항목> \"<사유>\" 로 등록한다" >&2
  echo "  4) 0건이 될 때까지 반복한 뒤 커밋을 다시 시도한다" >&2
  exit 2
fi
exit 0
