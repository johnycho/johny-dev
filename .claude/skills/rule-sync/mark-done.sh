#!/usr/bin/env bash
# rule-sync 절차를 마친 뒤 마지막에 실행한다.
# 현재 작업 트리 변경 상태의 해시를 기록해, 커밋 전 hook(require-rule-sync.sh)이 통과시키게 한다.
# 이 뒤에 파일을 하나라도 고치면 해시가 달라져 커밋이 다시 막힌다(그때는 rule-sync를 다시 확인).
set -e
root="$(cd "$(dirname "$0")/../../.." && pwd)"
python3 "$root/.claude/hooks/worktree_state.py" > "$root/.claude/.rule-sync-stamp"
echo "rule-sync 완료 표시: $(cat "$root/.claude/.rule-sync-stamp")"
