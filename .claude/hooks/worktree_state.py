#!/usr/bin/env python3
"""작업 트리 전체(추적 + 추적하지 않는 파일)의 상태 해시를 출력한다.

rule-sync 완료 표시(mark-done.sh)와 커밋 전 hook(require-rule-sync.sh)이 같은 값을 비교해
'rule-sync 이후 파일이 바뀌지 않았는지' 확인하는 데 쓴다.
- 임시 인덱스에 작업 트리를 통째로 담아(`git add -A`, .gitignore 대상 제외) 트리 해시를 만든다.
- 실제 인덱스는 건드리지 않으므로, 완료 표시 뒤에 `git add`(스테이징)만 해도 값이 바뀌지 않는다.
"""
import os
import subprocess
import sys
import tempfile

root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

with tempfile.TemporaryDirectory() as d:
    env = dict(os.environ, GIT_INDEX_FILE=os.path.join(d, "index"))

    def git(*args):
        return subprocess.run(["git", "-C", root, *args], env=env, capture_output=True, text=True).stdout.strip()

    git("read-tree", "HEAD")
    git("add", "-A")
    sys.stdout.write(git("write-tree") + "\n")
