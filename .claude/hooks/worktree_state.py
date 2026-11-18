#!/usr/bin/env python3
"""HEAD 대비 작업 트리 변경 상태의 해시를 출력한다.

rule-sync 완료 표시(mark-done.sh)와 커밋 전 hook(require-rule-sync.sh)이 같은 값을 비교해
'rule-sync 이후 파일이 바뀌지 않았는지' 확인하는 데 쓴다.
- 추적 파일: `git diff HEAD --binary` (스테이징 여부와 무관)
- 추적하지 않는 파일: 경로 + 내용 해시 (.gitignore 대상 제외)
"""
import hashlib
import os
import subprocess
import sys

root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def git(*args):
    return subprocess.run(["git", "-C", root, *args], capture_output=True).stdout


h = hashlib.sha256()
h.update(git("diff", "HEAD", "--binary"))
for rel in sorted(git("ls-files", "--others", "--exclude-standard").decode().splitlines()):
    h.update(rel.encode())
    try:
        h.update(hashlib.sha256(open(os.path.join(root, rel), "rb").read()).digest())
    except OSError:
        pass
sys.stdout.write(h.hexdigest() + "\n")
