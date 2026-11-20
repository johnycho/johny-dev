// 그림 2(창고 위치 계층): 그림 1과 같은 센터 모형을 그대로 쓰고, 위치 계층과 먼저 나갈 로트의 출고 단계만 보여 준다.
// 장면과 작업자는 scm-milk-flow/build.mjs 한 곳에서 관리한다.
// node tools/anatomy/scm-warehouse/build.mjs [--light] → static/diagrams/scm-warehouse(-light).html
process.argv.push("--warehouse");
await import("../scm-milk-flow/build.mjs");
