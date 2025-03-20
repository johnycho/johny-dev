"use strict";(self.webpackChunkjohnycho_dev=self.webpackChunkjohnycho_dev||[]).push([[896],{7107:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>s,contentTitle:()=>c,default:()=>h,frontMatter:()=>o,metadata:()=>t,toc:()=>d});const t=JSON.parse('{"id":"db/db-replication","title":"DB Replication","description":"DB Replication\uc740 \ub370\uc774\ud130\ubca0\uc774\uc2a4\uc758 \uace0\uac00\uc6a9\uc131\uacfc \ub370\uc774\ud130 \uc548\uc815\uc131\uc744 \ubcf4\uc7a5\ud558\uae30 \uc704\ud574 \ub110\ub9ac \ud65c\uc6a9\ub418\ub294 \ud575\uc2ec \uae30\uc220\uc785\ub2c8\ub2e4. \ud2b9\ud788, \ub300\uaddc\ubaa8 \uc560\ud50c\ub9ac\ucf00\uc774\uc158 \ud658\uacbd\uc5d0\uc11c\ub294 \ub370\uc774\ud130\uc758 \uc9c0\uc18d\uc801\uc778 \uac00\uc6a9\uc131\uacfc \uc2e0\ub8b0\uc131\uc774 \ub9e4\uc6b0 \uc911\uc694\ud558\uae30 \ub54c\ubb38\uc5d0, \uc6d0\ubcf8(Source) \uc11c\ubc84\uc640 \ubcf5\uc81c(Replica) \uc11c\ubc84 \uac04\uc758 \ub370\uc774\ud130 \ub3d9\uae30\ud654\ub294 \ud544\uc218\uc785\ub2c8\ub2e4. MySQL \uae30\uc900\uc73c\ub85c \uc124\uba85\ud558\uaca0\uc2b5\ub2c8\ub2e4.","source":"@site/docs/db/db-replication.md","sourceDirName":"db","slug":"/db/db-replication","permalink":"/docs/db/db-replication","draft":false,"unlisted":false,"tags":[{"inline":false,"label":"Database","permalink":"/docs/tags/db","description":"Database tag description"},{"inline":false,"label":"MySQL","permalink":"/docs/tags/mysql","description":"MySQL tag description"}],"version":"current","frontMatter":{"slug":"db-replication","title":"DB Replication","tags":["db","mysql"]},"sidebar":"johnyDocsSidebar","previous":{"title":"Redis\uac00 \uc2f1\uae00 \uc2a4\ub808\ub4dc\ub85c \ub9cc\ub4e4\uc5b4\uc9c4 \uc774\uc720","permalink":"/docs/db/db-redis-single-thread"},"next":{"title":"\ud2b8\ub79c\uc7ad\uc158 \uaca9\ub9ac\uc218\uc900","permalink":"/docs/db/db-transaction-isolation-level"}}');var r=i(4848),l=i(8453);const o={slug:"db-replication",title:"DB Replication",tags:["db","mysql"]},c=void 0,s={},d=[{value:"\u2714\ufe0f \ubc14\uc774\ub108\ub9ac \ub85c\uadf8(Binary log)\ub97c \uc800\uc7a5\ud558\ub294 \ubc29\uc2dd\uc740?",id:"\ufe0f-\ubc14\uc774\ub108\ub9ac-\ub85c\uadf8binary-log\ub97c-\uc800\uc7a5\ud558\ub294-\ubc29\uc2dd\uc740",level:2},{value:"\ud83d\udccc Row",id:"-row",level:3},{value:"\ud83d\udccc Statement",id:"-statement",level:3},{value:"\ud83d\udccc Mixed",id:"-mixed",level:3},{value:"\u2714\ufe0f \ubcf5\uc81c \uacfc\uc815",id:"\ufe0f-\ubcf5\uc81c-\uacfc\uc815",level:2}];function a(e){const n={code:"code",h2:"h2",h3:"h3",p:"p",strong:"strong",...(0,l.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.p,{children:"DB Replication\uc740 \ub370\uc774\ud130\ubca0\uc774\uc2a4\uc758 \uace0\uac00\uc6a9\uc131\uacfc \ub370\uc774\ud130 \uc548\uc815\uc131\uc744 \ubcf4\uc7a5\ud558\uae30 \uc704\ud574 \ub110\ub9ac \ud65c\uc6a9\ub418\ub294 \ud575\uc2ec \uae30\uc220\uc785\ub2c8\ub2e4. \ud2b9\ud788, \ub300\uaddc\ubaa8 \uc560\ud50c\ub9ac\ucf00\uc774\uc158 \ud658\uacbd\uc5d0\uc11c\ub294 \ub370\uc774\ud130\uc758 \uc9c0\uc18d\uc801\uc778 \uac00\uc6a9\uc131\uacfc \uc2e0\ub8b0\uc131\uc774 \ub9e4\uc6b0 \uc911\uc694\ud558\uae30 \ub54c\ubb38\uc5d0, \uc6d0\ubcf8(Source) \uc11c\ubc84\uc640 \ubcf5\uc81c(Replica) \uc11c\ubc84 \uac04\uc758 \ub370\uc774\ud130 \ub3d9\uae30\ud654\ub294 \ud544\uc218\uc785\ub2c8\ub2e4. MySQL \uae30\uc900\uc73c\ub85c \uc124\uba85\ud558\uaca0\uc2b5\ub2c8\ub2e4."}),"\n",(0,r.jsx)(n.h2,{id:"\ufe0f-\ubc14\uc774\ub108\ub9ac-\ub85c\uadf8binary-log\ub97c-\uc800\uc7a5\ud558\ub294-\ubc29\uc2dd\uc740",children:"\u2714\ufe0f \ubc14\uc774\ub108\ub9ac \ub85c\uadf8(Binary log)\ub97c \uc800\uc7a5\ud558\ub294 \ubc29\uc2dd\uc740?"}),"\n",(0,r.jsx)(n.p,{children:"Replication\uc740 Source \uc11c\ubc84\uc5d0\uc11c \ubc1c\uc0dd\ud558\ub294 \ubaa8\ub4e0 \ub370\uc774\ud130 \ubcc0\uacbd \uc0ac\ud56d\uc744 Replica \uc11c\ubc84\ub85c \ubcf5\uc81c\ud558\uc5ec \ub450 \uc11c\ubc84 \uac04\uc758 \ub370\uc774\ud130 \uc77c\uad00\uc131\uc744 \uc720\uc9c0\ud558\ub294 \uba54\ucee4\ub2c8\uc998\uc785\ub2c8\ub2e4. \uc774\ub7ec\ud55c \uacfc\uc815\uc740 \uc8fc\ub85c Binary log\ub97c \uae30\ubc18\uc73c\ub85c \uc774\ub8e8\uc5b4\uc9c0\uba70, Binary log\ub294 Source \uc11c\ubc84\uc5d0\uc11c \uc2e4\ud589\ub41c \ubaa8\ub4e0 \ub370\uc774\ud130 \ubcc0\uacbd \ucffc\ub9ac\ub97c \uae30\ub85d\ud558\ub294 \uc5ed\ud560\uc744 \ud569\ub2c8\ub2e4. MySQL\uc5d0\uc11c\ub294 \uc774 Binary log\ub97c \uc800\uc7a5\ud558\ub294 \ubc29\uc2dd\uc73c\ub85c Row, Statement, Mixed\uc758 \uc138 \uac00\uc9c0 \ubc29\uc2dd\uc744 \uc81c\uacf5\ud558\uba70, \uac01 \ubc29\uc2dd\uc740 \uace0\uc720\ud55c \uc7a5\ub2e8\uc810\uc744 \uac00\uc9c0\uace0 \uc788\uc2b5\ub2c8\ub2e4."}),"\n",(0,r.jsx)(n.h3,{id:"-row",children:"\ud83d\udccc Row"}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"Row"})," \ubc29\uc2dd\uc740 \ub370\uc774\ud130\ubca0\uc774\uc2a4\uc758 ",(0,r.jsx)("mark",{children:(0,r.jsx)(n.strong,{children:"\uac01 \ud589\ubcc4\ub85c \ubcc0\uacbd\ub41c \ub0b4\uc6a9"})}),"\uc744 \uc815\ud655\ud788 \uae30\ub85d\ud569\ub2c8\ub2e4. \uc774 \ubc29\uc2dd\uc740 \ub370\uc774\ud130 \uc77c\uad00\uc131\uc744 \ub9e4\uc6b0 \ub192\uac8c \uc720\uc9c0\ud560 \uc218 \uc788\ub2e4\ub294 \ud070 \uc7a5\uc810\uc774 \uc788\uc2b5\ub2c8\ub2e4. \uc608\ub97c \ub4e4\uc5b4, \ud2b9\uc815 \ud589\uc774 \uc218\uc815\ub418\uc5c8\uc744 \ub54c \uadf8 \ud589\uc758 \uc774\uc804 \uc0c1\ud0dc\uc640 \ubcc0\uacbd\ub41c \uc0c1\ud0dc\ub97c \ubaa8\ub450 \uae30\ub85d\ud558\ubbc0\ub85c, \ubcf5\uc81c \uc11c\ubc84\uc5d0\uc11c\ub3c4 \uc6d0\ubcf8 \uc11c\ubc84\uc640 \ub3d9\uc77c\ud55c \ub370\uc774\ud130 \uc0c1\ud0dc\ub97c \uc720\uc9c0\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4. \uadf8\ub7ec\ub098 \ubaa8\ub4e0 \ud589\uc758 \ubcc0\uacbd \uc0ac\ud56d\uc744 \uc800\uc7a5\ud558\uae30 \ub54c\ubb38\uc5d0 Binary log \ud30c\uc77c\uc758 \ud06c\uae30\uac00 \uae09\uaca9\ud788 \uc99d\uac00\ud560 \uc218 \uc788\uc5b4 \uc800\uc7a5 \uacf5\uac04\uc5d0 \ubd80\ub2f4\uc744 \uc904 \uc218 \uc788\ub294 \ub2e8\uc810\uc774 \uc874\uc7ac\ud569\ub2c8\ub2e4."]}),"\n",(0,r.jsx)(n.h3,{id:"-statement",children:"\ud83d\udccc Statement"}),"\n",(0,r.jsxs)(n.p,{children:["\ubc18\uba74\uc5d0 ",(0,r.jsx)(n.code,{children:"Statement"})," \ubc29\uc2dd\uc740 ",(0,r.jsx)("mark",{children:(0,r.jsx)(n.strong,{children:"\ub370\uc774\ud130 \ubcc0\uacbd\uc744 \uc77c\uc73c\ud0a8 SQL \ubb38 \uc790\uccb4"})}),"\ub97c ",(0,r.jsx)(n.code,{children:"Binary log"}),"\uc5d0 \uae30\ub85d\ud569\ub2c8\ub2e4. \uc774 \ubc29\uc2dd\uc740 \ub85c\uadf8 \ud30c\uc77c\uc758 \ud06c\uae30\ub97c \uc0c1\ub300\uc801\uc73c\ub85c \uc791\uac8c \uc720\uc9c0\ud560 \uc218 \uc788\uc5b4 \uc800\uc7a5 \uacf5\uac04\uc744 \uc808\uc57d\ud560 \uc218 \uc788\ub294 \uc7a5\uc810\uc774 \uc788\uc2b5\ub2c8\ub2e4. \ud558\uc9c0\ub9cc \uc2e4\ud589\ud560 \ub54c\ub9c8\ub2e4 \ub2e4\ub978 \uac12\uc744 \ubc18\ud658\ud558\ub294 \ud568\uc218\uc640 \uac19\uc774 \ube44\ud655\uc815\uc801(non-deterministic) SQL \ucffc\ub9ac\uac00 \uc2e4\ud589\ub420 \uacbd\uc6b0, ",(0,r.jsx)("mark",{children:(0,r.jsx)(n.strong,{children:"\ub3d9\uc77c\ud55c \ucffc\ub9ac\uac00 Source\uc640 Replica \uc11c\ubc84\uc5d0\uc11c \ub2e4\ub978 \uacb0\uacfc\ub97c \ucd08\ub798\ud560 \uc218 \uc788\uc5b4 \ub370\uc774\ud130 \ubd88\uc77c\uce58 \ubb38\uc81c\uac00 \ubc1c\uc0dd\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."})})," \uc608\ub97c \ub4e4\uc5b4, SELECT NOW()\uc640 \uac19\uc740 \ud568\uc218\ub294 \uc2e4\ud589 \uc2dc\uc810\uc5d0 \ub530\ub77c \ub2e4\ub978 \uacb0\uacfc\ub97c \ubc18\ud658\ud560 \uc218 \uc788\uae30 \ub54c\ubb38\uc5d0, \uc774\ub97c \ud3ec\ud568\ud55c \ucffc\ub9ac\ub294 \ubcf5\uc81c \uc2dc \ubb38\uc81c\uac00 \ub420 \uc218 \uc788\uc2b5\ub2c8\ub2e4."]}),"\n",(0,r.jsx)(n.h3,{id:"-mixed",children:"\ud83d\udccc Mixed"}),"\n",(0,r.jsxs)(n.p,{children:["\uc774\ub7ec\ud55c \ubb38\uc81c\ub97c \ubcf4\uc644\ud558\uae30 \uc704\ud574 MySQL\uc740 ",(0,r.jsx)(n.code,{children:"Mixed"})," \ubc29\uc2dd\uc744 \uc81c\uacf5\ud569\ub2c8\ub2e4. Mixed \ubc29\uc2dd\uc740 \uc0c1\ud669\uc5d0 \ub530\ub77c row \uae30\ubc18\uacfc statement \uae30\ubc18\uc744 \ud63c\ud569\ud558\uc5ec \ub85c\uadf8\ub97c \uae30\ub85d\ud569\ub2c8\ub2e4. \ube44\ud655\uc815\uc801 SQL\uc774 \uc544\ub2cc \uacbd\uc6b0\uc5d0\ub294 statement \ubc29\uc2dd\uc744 \uc0ac\uc6a9\ud558\uc5ec \uc800\uc7a5 \uacf5\uac04\uc744 \uc808\uc57d\ud558\uace0, \ube44\ud655\uc815\uc801 SQL\uc774 \uc2e4\ud589\ub418\ub294 \uacbd\uc6b0\uc5d0\ub294 row \ubc29\uc2dd\uc744 \uc0ac\uc6a9\ud558\uc5ec \ub370\uc774\ud130 \uc77c\uad00\uc131\uc744 \uc720\uc9c0\ud569\ub2c8\ub2e4. \uc774\ub97c \ud1b5\ud574 \ub450 \ubc29\uc2dd\uc758 \uc7a5\uc810\uc744 \ubaa8\ub450 \ud65c\uc6a9\ud560 \uc218 \uc788\uc73c\uba70, \ub370\uc774\ud130 \ubd88\uc77c\uce58 \ubb38\uc81c\ub97c \ucd5c\uc18c\ud654\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4. \ub2e4\ub9cc, \uad6c\ud604\uc774 \ub2e4\uc18c \ubcf5\uc7a1\ud560 \uc218 \uc788\ub2e4\ub294 \ub2e8\uc810\uc774 \uc874\uc7ac\ud569\ub2c8\ub2e4."]}),"\n",(0,r.jsx)(n.h2,{id:"\ufe0f-\ubcf5\uc81c-\uacfc\uc815",children:"\u2714\ufe0f \ubcf5\uc81c \uacfc\uc815"}),"\n",(0,r.jsxs)(n.p,{children:["Source \uc11c\ubc84\uc5d0\uc11c \ub370\uc774\ud130 \ubcc0\uacbd \ucffc\ub9ac\uac00 \uc2e4\ud589\ub418\uace0, \uc120\ud0dd\ub41c \ub85c\uadf8 \uc800\uc7a5 \ubc29\uc2dd\uc5d0 \ub530\ub77c ",(0,r.jsx)(n.code,{children:"Binary log"}),"\uc5d0 \uae30\ub85d\ub41c \ud6c4, ",(0,r.jsx)("mark",{children:(0,r.jsx)(n.strong,{children:"Replica \uc11c\ubc84\uc758 IO Thread"})}),"\uac00 ",(0,r.jsx)(n.code,{children:"Binary log"}),"\ub97c \uc77d\uc5b4\uc640 Replica \uc11c\ubc84\uc758 ",(0,r.jsx)(n.code,{children:"Relay log"}),"\ub85c \uc804\uc1a1\ud569\ub2c8\ub2e4. ",(0,r.jsx)(n.code,{children:"Relay log"}),"\ub294 Replica \uc11c\ubc84\uc5d0\uc11c Source \uc11c\ubc84\uc758 ",(0,r.jsx)(n.code,{children:"Binary log"}),"\ub97c \uc800\uc7a5\ud558\ub294 \uc784\uc2dc \uc800\uc7a5\uc18c \uc5ed\ud560\uc744 \ud558\uba70, \uc774\uacf3\uc5d0 \uc800\uc7a5\ub41c \ub85c\uadf8\ub97c \uae30\ubc18\uc73c\ub85c ",(0,r.jsx)("mark",{children:(0,r.jsx)(n.strong,{children:"Replica \uc11c\ubc84\uc758 SQL \uc2a4\ub808\ub4dc"})}),"\uac00 \uc2e4\uc81c \ub370\uc774\ud130\ubca0\uc774\uc2a4\uc5d0 \ubcc0\uacbd \uc0ac\ud56d\uc744 \uc801\uc6a9\ud569\ub2c8\ub2e4. \uc774 \uacfc\uc815\uc740 \ub9e4\uc6b0 \ud6a8\uc728\uc801\uc73c\ub85c \uc124\uacc4\ub418\uc5b4 \uc77c\ubc18\uc801\uc73c\ub85c ",(0,r.jsx)("mark",{children:(0,r.jsx)(n.strong,{children:"\uc57d 100\ubc00\ub9ac\ucd08 \uc774\ub0b4\uc5d0 \ub370\uc774\ud130 \ub3d9\uae30\ud654\uac00 \uc644\ub8cc"})}),"\ub429\ub2c8\ub2e4. \uc774\ub7ec\ud55c \ube60\ub978 \ub3d9\uae30\ud654 \uc18d\ub3c4 \ub355\ubd84\uc5d0 \uc6d0\ubcf8\uacfc \ubcf5\uc81c \uc11c\ubc84 \uac04\uc758 \ub370\uc774\ud130 \uc77c\uad00\uc131\uc774 \uc2e4\uc2dc\uac04\uc5d0 \uac00\uae5d\uac8c \uc720\uc9c0\ub420 \uc218 \uc788\uc2b5\ub2c8\ub2e4."]})]})}function h(e={}){const{wrapper:n}={...(0,l.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(a,{...e})}):a(e)}},8453:(e,n,i)=>{i.d(n,{R:()=>o,x:()=>c});var t=i(6540);const r={},l=t.createContext(r);function o(e){const n=t.useContext(l);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),t.createElement(l.Provider,{value:n},e.children)}}}]);