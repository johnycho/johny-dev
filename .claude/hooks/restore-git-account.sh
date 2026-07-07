#!/usr/bin/env bash
# PostToolUse(Bash) hook
# git push 가 끝나면 gh 활성 계정을 머신 기본값 johny-cho 로 자동 원복한다.
# (commit 에는 반응하지 않는다 — commit 후 push 가 이어질 때 PreToolUse 차단을 피하기 위해.
#  push 가 원격 작업의 종료 지점이므로 여기서 되돌린다.)

input=$(cat)

# git push 가 아니면 즉시 통과 (빠른 경로)
printf '%s' "$input" | grep -Eq 'git[[:space:]]+push' || exit 0

gh auth switch --user johny-cho >/dev/null 2>&1 || true
exit 0
