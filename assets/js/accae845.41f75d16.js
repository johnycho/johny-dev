"use strict";(self.webpackChunkjohnycho_dev=self.webpackChunkjohnycho_dev||[]).push([[5461],{3808:(e,n,c)=>{c.r(n),c.d(n,{assets:()=>i,contentTitle:()=>o,default:()=>u,frontMatter:()=>t,metadata:()=>s,toc:()=>a});const s=JSON.parse('{"id":"cs/cs-concurrency-and-parallelism","title":"\ub3d9\uc2dc\uc131\uacfc \ubcd1\ub82c\uc131","description":"Concurrency and Parallelism","source":"@site/docs/cs/cs-concurrency-and-parallelism.md","sourceDirName":"cs","slug":"/cs/cs-concurrency-and-parallelism","permalink":"/docs/cs/cs-concurrency-and-parallelism","draft":false,"unlisted":false,"tags":[{"inline":false,"label":"Computer Science","permalink":"/docs/tags/cs","description":"Computer Science tag description"}],"version":"current","frontMatter":{"slug":"cs-concurrency-and-parallelism","title":"\ub3d9\uc2dc\uc131\uacfc \ubcd1\ub82c\uc131","tags":["cs"]},"sidebar":"johnyDocsSidebar","previous":{"title":"\uc2a4\ub808\ub4dc, \ud504\ub85c\uc138\uc2a4, \ucf54\uc5b4\uc758 \uc218\ub294 \ub9ce\uc744 \uc218\ub85d \uc88b\uc744\uae4c?","permalink":"/docs/cs/cs-computing-resources"},"next":{"title":"CORS(Cross Origin Resource Sharing)","permalink":"/docs/cs/cs-cors"}}');var r=c(4848),l=c(8453);const t={slug:"cs-concurrency-and-parallelism",title:"\ub3d9\uc2dc\uc131\uacfc \ubcd1\ub82c\uc131",tags:["cs"]},o=void 0,i={},a=[{value:"\u2714\ufe0f \ub3d9\uc2dc\uc131(Concurrency)\uc774\ub780?",id:"\ufe0f-\ub3d9\uc2dc\uc131concurrency\uc774\ub780",level:2},{value:"\u2714\ufe0f \ubcd1\ub82c\uc131(Parallelism)\uc774\ub780?",id:"\ufe0f-\ubcd1\ub82c\uc131parallelism\uc774\ub780",level:2}];function d(e){const n={code:"code",h2:"h2",img:"img",p:"p",strong:"strong",...(0,l.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"Concurrency and Parallelism",src:c(6987).A+"",width:"1024",height:"768"})}),"\n",(0,r.jsx)(n.h2,{id:"\ufe0f-\ub3d9\uc2dc\uc131concurrency\uc774\ub780",children:"\u2714\ufe0f \ub3d9\uc2dc\uc131(Concurrency)\uc774\ub780?"}),"\n",(0,r.jsxs)(n.p,{children:["\ub3d9\uc2dc\uc131\uc774\ub780 \uc774\ub984\ucc98\ub7fc \uc2e4\uc81c\ub85c \uc5ec\ub7ec \uc791\uc5c5\uc744 \ub3d9\uc2dc\uc5d0 \uc218\ud589\ud558\ub294 \uac83\uc774 \uc544\ub2c8\ub77c, ",(0,r.jsx)("mark",{children:(0,r.jsx)(n.strong,{children:"\ub17c\ub9ac\uc801\uc73c\ub85c \ub3d9\uc2dc\uc5d0 \uc2e4\ud589\ub418\ub294 \uac83\ucc98\ub7fc \ubcf4\uc774\uac8c \ub9cc\ub4dc\ub294 \uac1c\ub150"})}),"\uc785\ub2c8\ub2e4. \ub2e8\uc77c \ucf54\uc5b4\ub97c \uae30\uc900\uc73c\ub85c \uc2dc\uac04 \ubd84\ud560\uc744 \ud1b5\ud574 \uc5ec\ub7ec \uc2a4\ub808\ub4dc\ub97c \ubc88\uac08\uc544 \uac00\uba70 \uc791\uc5c5\uc744 \uc218\ud589\ud568\uc73c\ub85c\uc368, \ub9c8\uce58 \ub3d9\uc2dc\uc5d0 \uc5ec\ub7ec \uc791\uc5c5\uc774 \ucc98\ub9ac\ub418\ub294 \uac83\ucc98\ub7fc \ubcf4\uc774\uac8c \ud569\ub2c8\ub2e4."]}),"\n",(0,r.jsxs)(n.p,{children:["\uc0ac\uc6a9\uc790\uc758 \uc785\ub825\uc744 \uae30\ub2e4\ub9ac\uac70\ub098, \ub124\ud2b8\uc6cc\ud06c \uc694\uccad, \ud30c\uc77c \uc785\ucd9c\ub825 \ub4f1\uc758 I/O \uc791\uc5c5 \uc2dc\uc5d0\ub294 CPU\uac00 \uc720\ud734 \uc0c1\ud0dc\ub85c \ub300\uae30\ud558\uac8c \ub429\ub2c8\ub2e4. \uc774\ub54c CPU\uac00 \uc544\ubb34 \uc77c\ub3c4 \ud558\uc9c0 \uc54a\uace0 \ub300\uae30\ud558\ub294 \ub300\uc2e0, \ucee8\ud14d\uc2a4\ud2b8 \uc2a4\uc704\uce6d\uc744 \ud1b5\ud574 \ub2e4\ub978 \uc2a4\ub808\ub4dc\uc758 \uc791\uc5c5\uc744 \ucc98\ub9ac\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4. \uc774\ub7ec\ud55c \ud2b9\uc131 \ub355\ubd84\uc5d0 \uc11c\ubc84\ub294 \uc5ec\ub7ec \ud074\ub77c\uc774\uc5b8\ud2b8\uc758 \uc694\uccad\uc744 \ub3d9\uc2dc\uc5d0 \ucc98\ub9ac\ud560 \uc218 \uc788\uc5b4 \ud6a8\uc728\uc801\uc785\ub2c8\ub2e4. \ub2e4\ub9cc, \ub3d9\uc2dc\uc131 \ud658\uacbd\uc744 \uc2e0\uc911\ud558\uac8c \uace0\ub824\ud558\uc9c0 \uc54a\uc73c\uba74 \uc5ec\ub7ec \uc2a4\ub808\ub4dc\ub97c \uc0ac\uc6a9\ud558\uba74\uc11c ",(0,r.jsx)(n.code,{children:"Deadlock"}),", ",(0,r.jsx)(n.code,{children:"Race Condition"}),", ",(0,r.jsx)(n.code,{children:"Starvation"})," \ub4f1\uc758 \ubb38\uc81c\uac00 \ubc1c\uc0dd\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."]}),"\n",(0,r.jsx)(n.h2,{id:"\ufe0f-\ubcd1\ub82c\uc131parallelism\uc774\ub780",children:"\u2714\ufe0f \ubcd1\ub82c\uc131(Parallelism)\uc774\ub780?"}),"\n",(0,r.jsxs)(n.p,{children:["\ubcd1\ub82c\uc131\uc774\ub780 ",(0,r.jsx)("mark",{children:(0,r.jsx)(n.strong,{children:"\ubb3c\ub9ac\uc801\uc73c\ub85c \ub3d9\uc77c\ud55c \uc2dc\uac04\uc5d0 \uc5ec\ub7ec \uc791\uc5c5\uc744 \ub3c5\ub9bd\uc801\uc73c\ub85c \uc218\ud589\ud558\ub294 \uac83"})}),"\uc744 \uc758\ubbf8\ud569\ub2c8\ub2e4. \uc5ec\ub7ec \uac1c\uc758 \ucf54\uc5b4\uac00 \uac01\uac01 \ub3c5\ub9bd\ub41c \uc2a4\ub808\ub4dc\uc758 \uc791\uc5c5\uc744 \ub3d9\uc2dc\uc5d0 \ucc98\ub9ac\ud568\uc73c\ub85c\uc368, ",(0,r.jsx)("mark",{children:(0,r.jsx)(n.strong,{children:"\uc2e4\uc81c\ub85c \uc5ec\ub7ec \uc791\uc5c5\uc774 \ub3d9\uc2dc\uc5d0 \uc2e4\ud589"})}),"\ub429\ub2c8\ub2e4. \ub3d9\uc2dc\uc131\uacfc\ub294 \ub2ec\ub9ac, \ud558\ub098\uc758 \ucf54\uc5b4\uac00 \uc5ec\ub7ec \uc2a4\ub808\ub4dc\ub97c \ubc88\uac08\uc544 \uac00\uba70 \ucc98\ub9ac\ud560 \ud544\uc694 \uc5c6\uc774, \uac01 \ucf54\uc5b4\uc5d0\uc11c \ub3c5\ub9bd\uc801\uc73c\ub85c \uc791\uc5c5\uc744 \uc2e4\ud589\ud569\ub2c8\ub2e4."]}),"\n",(0,r.jsx)(n.p,{children:"\ub3c5\ub9bd\uc801\uc778 \ud558\uc704 \uc791\uc5c5\uc73c\ub85c \ub098\ub20c \uc218 \uc788\ub294 \uacc4\uc0b0\uacfc \uac19\uc740 \uc791\uc5c5\uc744 \uc5ec\ub7ec \ucf54\uc5b4\uc5d0 \ubd84\uc0b0\ud568\uc73c\ub85c\uc368, \uc791\uc5c5 \uc644\ub8cc \uc2dc\uac04\uc744 \ucd5c\uc18c\ud654\ud560 \uc218 \uc788\uc5b4 \uace0\uc131\ub2a5 \ucef4\ud4e8\ud305\uc5d0 \uc774\uc0c1\uc801\uc785\ub2c8\ub2e4. \ud558\uc9c0\ub9cc \ubcd1\ub82c \ucc98\ub9ac\ub294 \ub370\uc774\ud130\ub098 \ub9ac\uc18c\uc2a4\ub97c \uacf5\uc720\ud560 \ub54c \uc791\uc5c5 \uac04 \ub3d9\uae30\ud654\uac00 \ud544\uc694\ud560 \uacbd\uc6b0\uac00 \ub9ce\uc544, \uc774\ub7ec\ud55c \ub3d9\uae30\ud654\ub85c \uc778\ud574 \uc0c1\ub2f9\ud55c \uc624\ubc84\ud5e4\ub4dc\uac00 \ubc1c\uc0dd\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."})]})}function u(e={}){const{wrapper:n}={...(0,l.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},6987:(e,n,c)=>{c.d(n,{A:()=>s});const s=c.p+"assets/images/concurrency-and-parallelism-61e23bae11ab63de50edc78b491779d9.png"},8453:(e,n,c)=>{c.d(n,{R:()=>t,x:()=>o});var s=c(6540);const r={},l=s.createContext(r);function t(e){const n=s.useContext(l);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:t(e.components),s.createElement(l.Provider,{value:n},e.children)}}}]);