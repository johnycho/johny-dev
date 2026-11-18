#!/usr/bin/env bash
# PreToolUse(Bash) hook
# 커밋 직전에 rule-sync(커밋 전 규칙 동기화)를 거쳤는지 확인하고, 아니면 커밋을 막는다.
# rule-sync를 마치면 .claude/skills/rule-sync/mark-done.sh 가 현재 변경 상태 해시를 기록한다.
# 기록이 없거나, 기록 이후 파일이 바뀌었으면 차단한다.
# 규칙 갱신은 사용자 확인을 받은 뒤에 한다(임의로 갱신하지 않는다).

input=$(cat)

# 커밋 명령이 아니면 즉시 통과
printf '%s' "$input" | grep -Eq 'git[[:space:]]+commit' || exit 0

root="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
stamp="$root/.claude/.rule-sync-stamp"
current=$(python3 "$root/.claude/hooks/worktree_state.py")

if [ ! -f "$stamp" ] || [ "$(cat "$stamp")" != "$current" ]; then
  echo "[johny-dev] 커밋 차단: rule-sync(커밋 전 규칙 동기화)를 거치지 않았거나, 거친 뒤 파일이 바뀌었습니다." >&2
  echo "다음 순서로 진행한 뒤 커밋을 다시 시도하세요(임의로 갱신하지 말 것):" >&2
  echo "  1) .claude/skills/rule-sync/SKILL.md 절차로 마지막 커밋 이후 피드백 중 규칙에 빠진 것을 찾아 갱신안을 만든다" >&2
  echo "  2) 갱신안(규칙 추가, 수정과 블로그 전체 적용 범위)을 사용자에게 보여 주고 확인을 받는다" >&2
  echo "  3) 확인받은 대로 갱신하고 적용, 검증한 뒤 bash .claude/skills/rule-sync/mark-done.sh 를 실행한다" >&2
  echo "     (갱신할 것이 없다고 사용자가 확인하면 바로 mark-done.sh)" >&2
  echo "  4) 커밋을 다시 시도한다" >&2
  exit 2
fi
exit 0
