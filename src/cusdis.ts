// Cusdis 댓글 설정 (johny-dev 전용 — 독립적으로 관리)
//
// 사용 준비 (한 번만):
//   1) https://cusdis.com 회원가입/로그인 → 대시보드에서 "New website" 로
//      johny-dev 용 사이트를 **새로** 추가 (다른 사이트와 별개의 website).
//   2) 발급된 embed 코드의 data-app-id 값을 아래 CUSDIS_APP_ID 에 붙여넣기.
//      → 이 app-id 가 다른 사이트와 다르면 댓글 데이터·관리가 완전히 분리된다.
//   3) (자체 호스팅하는 경우) CUSDIS_HOST 를 본인 서버 주소로 변경.
//
// CUSDIS_APP_ID 가 비어 있으면 댓글 위젯은 렌더링되지 않습니다.

export const CUSDIS_HOST = 'https://cusdis.com';
export const CUSDIS_APP_ID = '50a7e943-2931-424e-ac08-0c02d6d44309'; // johny-dev 전용 (독립 관리)
