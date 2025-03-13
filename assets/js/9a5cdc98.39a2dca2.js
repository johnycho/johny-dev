"use strict";(self.webpackChunkjohnycho_dev=self.webpackChunkjohnycho_dev||[]).push([[2821],{5076:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>i,default:()=>u,frontMatter:()=>o,metadata:()=>s,toc:()=>d});const s=JSON.parse('{"id":"cs/cs-log-and-metric","title":"\ub85c\uadf8\uc640 \uba54\ud2b8\ub9ad","description":"\u2714\ufe0f \ub85c\uadf8","source":"@site/docs/cs/cs-log-and-metric.md","sourceDirName":"cs","slug":"/cs/cs-log-and-metric","permalink":"/docs/cs/cs-log-and-metric","draft":false,"unlisted":false,"tags":[{"inline":false,"label":"Computer Science","permalink":"/docs/tags/cs","description":"Computer Science tag description"}],"version":"current","frontMatter":{"slug":"cs-log-and-metric","title":"\ub85c\uadf8\uc640 \uba54\ud2b8\ub9ad","tags":["cs"]},"sidebar":"johnyDocsSidebar","previous":{"title":"HTTP \uba54\uc11c\ub4dc\uc758 \uba71\ub4f1\uc131","permalink":"/docs/cs/cs-http-method-idempotency"},"next":{"title":"Connection Timeout, Socket Timeout, Read Timeout\uc758 \ucc28\uc774\uc810","permalink":"/docs/cs/cs-network-timeout"}}');var c=t(4848),r=t(8453);const o={slug:"cs-log-and-metric",title:"\ub85c\uadf8\uc640 \uba54\ud2b8\ub9ad",tags:["cs"]},i="\ub85c\uadf8\uc640 \uba54\ud2b8\ub9ad",l={},d=[{value:"\u2714\ufe0f \ub85c\uadf8",id:"\ufe0f-\ub85c\uadf8",level:2},{value:"\u2714\ufe0f \uba54\ud2b8\ub9ad",id:"\ufe0f-\uba54\ud2b8\ub9ad",level:2},{value:"\u2714\ufe0f \ub85c\uadf8\uc640 \uba54\ud2b8\ub9ad \uc218\uc9d1 \uc608\uc2dc",id:"\ufe0f-\ub85c\uadf8\uc640-\uba54\ud2b8\ub9ad-\uc218\uc9d1-\uc608\uc2dc",level:2},{value:"\u2714\ufe0f \uc704\uc5d0\uc11c \uc218\uc9d1\ud55c \uba54\ud2b8\ub9ad \uc9c0\ud45c\uc758 \ud544\uc694\uc131\uc740?",id:"\ufe0f-\uc704\uc5d0\uc11c-\uc218\uc9d1\ud55c-\uba54\ud2b8\ub9ad-\uc9c0\ud45c\uc758-\ud544\uc694\uc131\uc740",level:2},{value:"\u2714\ufe0f System.out.println\uc744 \uc0ac\uc6a9\ud558\uba74 \ub85c\uae45 \ud504\ub808\uc784\uc6cc\ud06c\ub294 \uc0ac\uc6a9\ud560 \ud544\uc694\uac00 \uc5c6\uc9c0 \uc54a\uc744\uae4c? \ud83d\udc40",id:"\ufe0f-systemoutprintln\uc744-\uc0ac\uc6a9\ud558\uba74-\ub85c\uae45-\ud504\ub808\uc784\uc6cc\ud06c\ub294-\uc0ac\uc6a9\ud560-\ud544\uc694\uac00-\uc5c6\uc9c0-\uc54a\uc744\uae4c-",level:2}];function a(e){const n={blockquote:"blockquote",br:"br",code:"code",h1:"h1",h2:"h2",header:"header",p:"p",...(0,r.R)(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(n.header,{children:(0,c.jsx)(n.h1,{id:"\ub85c\uadf8\uc640-\uba54\ud2b8\ub9ad",children:"\ub85c\uadf8\uc640 \uba54\ud2b8\ub9ad"})}),"\n",(0,c.jsx)(n.h2,{id:"\ufe0f-\ub85c\uadf8",children:"\u2714\ufe0f \ub85c\uadf8"}),"\n",(0,c.jsxs)(n.p,{children:["\uc11c\ubc84\uac00 \ub3d9\uc791\ud560 \ub54c ",(0,c.jsx)("mark",{children:"\uc11c\ubc84\uc758 \uc0c1\ud0dc\uc640 \ub3d9\uc791 \uc815\ubcf4\ub97c \uc2dc\uac04 \uacbd\uacfc\uc5d0 \ub530\ub77c \uae30\ub85d\ud55c \uacb0\uacfc"}),"\uc785\ub2c8\ub2e4. \ub85c\uadf8\ub294 \uc2dc\uc2a4\ud15c\uc758 \uc624\ub958\uc640 \ubb38\uc81c\ub4e4\uc744 \uc27d\uac8c \ucc3e\uc544\ub0bc \uc218 \uc788\ub3c4\ub85d \ub3c4\uc640\uc90d\ub2c8\ub2e4."]}),"\n",(0,c.jsx)(n.h2,{id:"\ufe0f-\uba54\ud2b8\ub9ad",children:"\u2714\ufe0f \uba54\ud2b8\ub9ad"}),"\n",(0,c.jsxs)(n.p,{children:[(0,c.jsx)("mark",{children:"\uc2dc\uc2a4\ud15c\uc758 \uc131\ub2a5\uacfc \uc0c1\ud0dc\uc5d0 \ub300\ud55c \ud1b5\uacc4\uc801\uc778 \uc815\ubcf4"}),"\ub97c \uc758\ubbf8\ud569\ub2c8\ub2e4. \uba54\ud2b8\ub9ad\uc744 \uc798 \uc218\uc9d1\ud558\uba74 \uc2dc\uc2a4\ud15c\uc758 \ud604\uc7ac \uc0c1\ud0dc\ub97c \uc190\uc27d\uac8c \ud30c\uc545\ud560 \uc218 \uc788\uace0, \uc0ac\uc5c5 \ud604\ud669\uc5d0 \uad00\ud55c \uc720\uc6a9\ud55c \uc815\ubcf4\ub97c \uc5bb\uc744 \uc218 \uc788\uc2b5\ub2c8\ub2e4. \uac00\ub839, \uba54\ud2b8\ub9ad\uc740 DAU, Retension, CPU \uc0ac\uc6a9\ub7c9, \uba54\ubaa8\ub9ac \uc0ac\uc6a9\ub7c9 \ub4f1\uc774 \uc788\uc2b5\ub2c8\ub2e4."]}),"\n",(0,c.jsx)(n.h2,{id:"\ufe0f-\ub85c\uadf8\uc640-\uba54\ud2b8\ub9ad-\uc218\uc9d1-\uc608\uc2dc",children:"\u2714\ufe0f \ub85c\uadf8\uc640 \uba54\ud2b8\ub9ad \uc218\uc9d1 \uc608\uc2dc"}),"\n",(0,c.jsx)(n.p,{children:"\uc2a4\ud504\ub9c1 \ubd80\ud2b8 \uc561\ucd94\uc5d0\uc774\ud130\ub97c \uc0ac\uc6a9\ud574 \uba54\ud2b8\ub9ad\uc744 \uc0dd\uc131\ud558\uace0 \ud504\ub85c\uba54\ud14c\uc6b0\uc2a4\uc5d0 \uc800\uc7a5\ud55c \ub2e4\uc74c \uadf8\ub77c\ud30c\ub098\ub85c \uc2dc\uac01\ud654\ud55c \uacbd\ud5d8\uc774 \uc788\uc2b5\ub2c8\ub2e4. \uc218\uc9d1\ud55c \uc9c0\ud45c\ub294 \ub2e4\uc74c\uacfc \uac19\uc2b5\ub2c8\ub2e4."}),"\n",(0,c.jsxs)(n.blockquote,{children:["\n",(0,c.jsxs)(n.p,{children:["CPU, \uba54\ubaa8\ub9ac, JVM \ud799 \uc0ac\uc6a9\ub7c9",(0,c.jsx)(n.br,{}),"\n","\ud1b0\ucea3 \uc2a4\ub808\ub4dc \ud480\uacfc \ub370\uc774\ud130\ubca0\uc774\uc2a4 \ucee4\ub125\uc158 \ud480 \uc0c1\ud0dc",(0,c.jsx)(n.br,{}),"\n","error \ub808\ubca8 \ub85c\uadf8 \uc99d\uac00\ub7c9"]}),"\n"]}),"\n",(0,c.jsx)(n.p,{children:"\ub85c\uae45\uc740 LogBack\uc744 \uc774\uc6a9\ud588\uc2b5\ub2c8\ub2e4. \uadf8\ub9ac\uace0, Loki\uc5d0 7\uc77c\ub3d9\uc548 \ubcf4\uad00\ud558\ub3c4\ub85d \uc124\uc815\ud588\uc73c\uba70 \ub85c\uadf8 \ucd94\uc801\uc744 \uc704\ud574 MDC\ub97c \uc0ac\uc6a9\ud588\uc2b5\ub2c8\ub2e4."}),"\n",(0,c.jsx)(n.h2,{id:"\ufe0f-\uc704\uc5d0\uc11c-\uc218\uc9d1\ud55c-\uba54\ud2b8\ub9ad-\uc9c0\ud45c\uc758-\ud544\uc694\uc131\uc740",children:"\u2714\ufe0f \uc704\uc5d0\uc11c \uc218\uc9d1\ud55c \uba54\ud2b8\ub9ad \uc9c0\ud45c\uc758 \ud544\uc694\uc131\uc740?"}),"\n",(0,c.jsx)(n.p,{children:"CPU, \uba54\ubaa8\ub9ac, JVM \uc0ac\uc6a9\ub7c9 \uc9c0\ud45c\ub97c \uc218\uc9d1\ud55c \uc774\uc720\ub294 \uc11c\ube44\uc2a4\uac00 \ud604\uc7ac \uc548\uc815\uc801\uc73c\ub85c \ub3d9\uc791\ud558\uace0 \uc788\ub294\uc9c0 \ud30c\uc545\ud558\uae30 \uc704\ud568\uc785\ub2c8\ub2e4. \ub610\ud55c, \ud1b0\ucea3 \uc2a4\ub808\ub4dc \ud480\uacfc \ucee4\ub125\uc158 \ud480\uc758 \uc0c1\ud0dc\uc640 error \ub808\ubca8 \ub85c\uadf8\ub97c \uc218\uc9d1\ud55c \uc774\uc720\ub294 \uc11c\ubc84 \ud504\ub85c\uadf8\ub7a8 \ub0b4\ubd80\uc5d0 \ube44\uc815\uc0c1\uc801\uc778 \uc0c1\ud669\uc774 \uc0dd\uae30\ub294 \uac83\uc744 \uc2e0\uc18d\ud788 \ub300\uc751\ud558\uae30 \uc704\ud568\uc785\ub2c8\ub2e4."}),"\n",(0,c.jsx)(n.h2,{id:"\ufe0f-systemoutprintln\uc744-\uc0ac\uc6a9\ud558\uba74-\ub85c\uae45-\ud504\ub808\uc784\uc6cc\ud06c\ub294-\uc0ac\uc6a9\ud560-\ud544\uc694\uac00-\uc5c6\uc9c0-\uc54a\uc744\uae4c-",children:"\u2714\ufe0f System.out.println\uc744 \uc0ac\uc6a9\ud558\uba74 \ub85c\uae45 \ud504\ub808\uc784\uc6cc\ud06c\ub294 \uc0ac\uc6a9\ud560 \ud544\uc694\uac00 \uc5c6\uc9c0 \uc54a\uc744\uae4c? \ud83d\udc40"}),"\n",(0,c.jsxs)(n.p,{children:["\ub85c\uadf8\ub97c \ucd9c\ub825\ud558\ub294 \uacbd\uc6b0 \ub300\uae30 \uc2dc\uac04\uc774 \ubc1c\uc0dd\ud569\ub2c8\ub2e4. \uadf8\ub9ac\uace0, \ub85c\uadf8 \ub610\ud55c \ub370\uc774\ud130\uc774\uae30 \ub54c\ubb38\uc5d0 \uc800\uc7a5 \uacf5\uac04\uc744 \uc694\uad6c\ud569\ub2c8\ub2e4. \ub530\ub77c\uc11c, \uc815\ub9d0\ub85c \ud544\uc694\ud55c \uacbd\uc6b0\uc5d0\ub9cc \ub85c\uae45\uc744 \uc218\ud589\ud558\ub294 \uac83\uc774 \ube44\uc6a9 \ud6a8\uc728\uc801\uc785\ub2c8\ub2e4. \ud558\uc9c0\ub9cc, ",(0,c.jsx)(n.code,{children:"System.out.println(...)"}),"\uc740 \ub85c\uadf8 \ub808\ubca8 \uc124\uc815\uacfc \ud658\uacbd \ubcc4 \ud544\ud130\ub9c1\uc744 \uc801\uc6a9\ud558\uae30 \uae4c\ub2e4\ub86d\uc2b5\ub2c8\ub2e4. \ubc18\uba74, \ub85c\uae45 \ud504\ub808\uc784\uc6cc\ud06c\ub294 \ub85c\uadf8 \ub808\ubca8 \uc124\uc815, \ud544\ud130\ub9c1 \ub4f1 \ub85c\uadf8\uc758 \uc591 \uc870\uc808\uc744 \ud558\uae30 \uc704\ud55c \uae30\ub2a5\uc744 \uc81c\uacf5\ud558\uae30 \ub54c\ubb38\uc5d0 \uc774\ub97c \uc0ac\uc6a9\ud558\ub294 \uac83\uc774 \uc11c\ube44\uc2a4 \uc6b4\uc601\uc5d0 \uc720\ub9ac\ud569\ub2c8\ub2e4."]})]})}function u(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,c.jsx)(n,{...e,children:(0,c.jsx)(a,{...e})}):a(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>o,x:()=>i});var s=t(6540);const c={},r=s.createContext(c);function o(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(c):e.components||c:o(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);