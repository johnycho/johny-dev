"use strict";(self.webpackChunkjohnycho_dev=self.webpackChunkjohnycho_dev||[]).push([[3171],{4265:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>r,default:()=>p,frontMatter:()=>i,metadata:()=>s,toc:()=>l});const s=JSON.parse('{"id":"cs/cs-http-method-idempotency","title":"HTTP \uba54\uc11c\ub4dc\uc758 \uba71\ub4f1\uc131","description":"\uc5f0\uc0b0\uc744 \uc5ec\ub7ec \ubc88 \uc801\uc6a9\ud558\ub354\ub77c\ub3c4 \uacb0\uacfc\uac00 \ub2ec\ub77c\uc9c0\uc9c0 \uc54a\ub294 \uc131\uc9c8\uc744 \uba71\ub4f1\uc131\uc774\ub77c\uace0 \ud569\ub2c8\ub2e4. HTTP \uba54\uc11c\ub4dc\uc758 \uba71\ub4f1\uc131\uc740 \ub3d9\uc77c\ud55c \uc694\uccad\uc744 \ud55c\ubc88 \ubcf4\ub0b4\ub294 \uac83\uacfc \uc5ec\ub7ec\ubc88 \ubcf4\ub0b4\ub294 \uac83\uc774 \uc11c\ub85c \ub3d9\uc77c\ud55c \ud6a8\uacfc\ub97c \uc9c0\ub2c8\uba70, \uc11c\ubc84\uc758 \uc0c1\ud0dc\ub3c4 \ub3d9\uc77c\ud558\uac8c \ub0a8\uc744 \uacbd\uc6b0\uc5d0 \uba71\ub4f1\ud558\ub2e4\uace0 \uc774\uc57c\uae30\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4. \ub300\ud45c\uc801\uc73c\ub85c \uba71\ub4f1\ud55c \uba54\uc11c\ub4dc\ub294 GET, HEAD, PUT, DELETE, TRACE, OPTIONS \uac00 \uc788\uc2b5\ub2c8\ub2e4.","source":"@site/docs/cs/cs-http-method-idempotency.md","sourceDirName":"cs","slug":"/cs/cs-http-method-idempotency","permalink":"/docs/cs/cs-http-method-idempotency","draft":false,"unlisted":false,"tags":[{"inline":false,"label":"Computer Science","permalink":"/docs/tags/cs","description":"Computer Science tag description"}],"version":"current","frontMatter":{"slug":"cs-http-method-idempotency","title":"HTTP \uba54\uc11c\ub4dc\uc758 \uba71\ub4f1\uc131","tags":["cs"]},"sidebar":"johnyDocsSidebar","previous":{"title":"HTTP vs HTTPS","permalink":"/docs/cs/cs-https"},"next":{"title":"HTTP/1.1\uacfc HTTP/2.0","permalink":"/docs/cs/cs-http-version"}}');var c=n(4848),o=n(8453);const i={slug:"cs-http-method-idempotency",title:"HTTP \uba54\uc11c\ub4dc\uc758 \uba71\ub4f1\uc131",tags:["cs"]},r="HTTP \uba54\uc11c\ub4dc\uc5d0\uc11c \uba71\ub4f1\uc131\uc774\ub780?",d={},l=[{value:"\u2714\ufe0f \uba71\ub4f1\uc131\uc740 \uc5b4\ub5bb\uac8c \ud65c\uc6a9\ub420 \uc218 \uc788\ub098\uc694? \ud83e\udd14",id:"\ufe0f-\uba71\ub4f1\uc131\uc740-\uc5b4\ub5bb\uac8c-\ud65c\uc6a9\ub420-\uc218-\uc788\ub098\uc694-",level:2},{value:"\u2714\ufe0f DELETE \uba54\uc18c\ub4dc\uac00 \uba71\ub4f1\ud55c \uc774\uc720",id:"\ufe0f-delete-\uba54\uc18c\ub4dc\uac00-\uba71\ub4f1\ud55c-\uc774\uc720",level:2}];function h(e){const t={blockquote:"blockquote",h1:"h1",h2:"h2",header:"header",img:"img",li:"li",ol:"ol",p:"p",...(0,o.R)(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(t.header,{children:(0,c.jsx)(t.h1,{id:"http-\uba54\uc11c\ub4dc\uc5d0\uc11c-\uba71\ub4f1\uc131\uc774\ub780",children:"HTTP \uba54\uc11c\ub4dc\uc5d0\uc11c \uba71\ub4f1\uc131\uc774\ub780?"})}),"\n",(0,c.jsx)(t.p,{children:"\uc5f0\uc0b0\uc744 \uc5ec\ub7ec \ubc88 \uc801\uc6a9\ud558\ub354\ub77c\ub3c4 \uacb0\uacfc\uac00 \ub2ec\ub77c\uc9c0\uc9c0 \uc54a\ub294 \uc131\uc9c8\uc744 \uba71\ub4f1\uc131\uc774\ub77c\uace0 \ud569\ub2c8\ub2e4. HTTP \uba54\uc11c\ub4dc\uc758 \uba71\ub4f1\uc131\uc740 \ub3d9\uc77c\ud55c \uc694\uccad\uc744 \ud55c\ubc88 \ubcf4\ub0b4\ub294 \uac83\uacfc \uc5ec\ub7ec\ubc88 \ubcf4\ub0b4\ub294 \uac83\uc774 \uc11c\ub85c \ub3d9\uc77c\ud55c \ud6a8\uacfc\ub97c \uc9c0\ub2c8\uba70, \uc11c\ubc84\uc758 \uc0c1\ud0dc\ub3c4 \ub3d9\uc77c\ud558\uac8c \ub0a8\uc744 \uacbd\uc6b0\uc5d0 \uba71\ub4f1\ud558\ub2e4\uace0 \uc774\uc57c\uae30\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4. \ub300\ud45c\uc801\uc73c\ub85c \uba71\ub4f1\ud55c \uba54\uc11c\ub4dc\ub294 GET, HEAD, PUT, DELETE, TRACE, OPTIONS \uac00 \uc788\uc2b5\ub2c8\ub2e4."}),"\n",(0,c.jsx)(t.h2,{id:"\ufe0f-\uba71\ub4f1\uc131\uc740-\uc5b4\ub5bb\uac8c-\ud65c\uc6a9\ub420-\uc218-\uc788\ub098\uc694-",children:"\u2714\ufe0f \uba71\ub4f1\uc131\uc740 \uc5b4\ub5bb\uac8c \ud65c\uc6a9\ub420 \uc218 \uc788\ub098\uc694? \ud83e\udd14"}),"\n",(0,c.jsx)(t.p,{children:"\ubaa8\uc885\uc758 \uc774\uc720\ub85c \uc804\uc1a1 \ucee4\ub125\uc158\uc774 \ub04a\uc5b4\uc84c\uc744 \ub54c, \uba71\ub4f1\uc131\uc740 \ud074\ub77c\uc774\uc5b8\ud2b8\uac00 \ub2e4\uc2dc \uac19\uc740 \uc694\uccad\uc744 \ud574\ub3c4 \ub418\ub294\uac00\uc5d0 \ub300\ud55c \ud310\ub2e8 \uadfc\uac70\uac00 \ub420 \uc218 \uc788\uc2b5\ub2c8\ub2e4. \uba71\ub4f1\ud558\ub2e4\uba74 \uc694\uccad\uc744 \uc7ac\uc2dc\ub3c4\ud560 \ub54c \uac19\uc740 \uc11c\ubc84\uc758 \uc0c1\ud0dc\ub97c \ubcf4\uc7a5\ud558\uae30 \ub54c\ubb38\uc5d0 \ubb38\uc81c\uac00 \uc5c6\uc2b5\ub2c8\ub2e4. \ubc18\uba74, \uba71\ub4f1\ud558\uc9c0 \uc54a\ub2e4\uba74 \uc7ac\uc2dc\ub3c4 \uc694\uccad\uc2dc \uc911\ubcf5 \uc694\uccad\uc744 \ubcf4\ub0b4 \ubb38\uc81c\ub97c \ubc1c\uc0dd \uc2dc\ud0ac \uc218 \uc788\uc2b5\ub2c8\ub2e4. \uc608\ub97c \ub4e4\uc5b4, \uc0ac\uc6a9\uc790\uac00 \uacb0\uc81c\ud558\ub294 \uc2dc\uc810\uc5d0 \ud0c0\uc784\uc544\uc6c3\uc73c\ub85c \uc778\ud574 \uc815\uc0c1 \uc751\ub2f5\uc744 \ubabb\ubc1b\ub294 \uc0c1\ud669\uc744 \uc0dd\uac01\ud574 \ubcfc \uc218 \uc788\uc2b5\ub2c8\ub2e4. \ud574\ub2f9 \uacbd\uc6b0\uc5d0\uc11c \uba71\ub4f1\ud558\uc9c0 \uc54a\uc740 \uacb0\uc81c API \uacbd\uc6b0\uc5d0\ub294 \uacb0\uc81c\uac00 \uc131\uacf5\ud588\ub294\uc9c0 \uc218\ub3d9\uc73c\ub85c \ud655\uc778\ud558\uace0 \uc7ac\uc694\uccad\ud574\uc57c\ud569\ub2c8\ub2e4. \ubc18\uba74, \uba71\ub4f1\ud55c \uacb0\uc81c API\uc758 \uacbd\uc6b0\uc5d0\ub294 \uc548\uc2ec\ud558\uace0 \uc5ec\ub7ec \ubc88 \uc694\uccad\ud560 \uc218 \uc788\uc73c\uba70 \uc911\ubcf5 \uc694\uccad\uc73c\ub85c \ubc1c\uc0dd\ud558\ub294 \ubb38\uc81c(\uc911\ubcf5 \uacb0\uc81c)\ub97c \ubc29\uc9c0\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."}),"\n",(0,c.jsx)(t.h2,{id:"\ufe0f-delete-\uba54\uc18c\ub4dc\uac00-\uba71\ub4f1\ud55c-\uc774\uc720",children:"\u2714\ufe0f DELETE \uba54\uc18c\ub4dc\uac00 \uba71\ub4f1\ud55c \uc774\uc720"}),"\n",(0,c.jsx)(t.p,{children:"\uc608\ub97c \ub4e4\uc5b4 \uc790\uc6d0\uc774 \uc788\ub294 \uc0c1\ud0dc\uc5d0\uc11c \uc6b0\ub9ac\uac00 \ub2e4\uc74c\uacfc \uac19\uc774 \uc0ac\uc6a9\uc790 \uc0ad\uc81c \uc694\uccad\uc744 \ubcf4\ub0c8\ub2e4\uace0 \ud558\uc790. \ucc98\uc74c\uc5d0\ub294 \uc131\uacf5 \uc751\ub2f5(200)\uc744 \ubc1b\uc558\uc9c0\ub9cc, \ub3d9\uc77c\ud55c \uc694\uccad\uc744 \ubcf4\ub0c8\ub354\ub2c8 \uc5d0\ub7ec \uc751\ub2f5(404)\uc744 \ubc1b\uc740 \uac83\uc774\ub2e4."}),"\n",(0,c.jsxs)(t.blockquote,{children:["\n",(0,c.jsxs)(t.ol,{children:["\n",(0,c.jsx)(t.li,{children:"DELETE \u2192 200 OK"}),"\n",(0,c.jsx)(t.li,{children:"DELETE \u2192 404 NOT FOUND"}),"\n"]}),"\n"]}),"\n",(0,c.jsxs)(t.p,{children:["DELETE\ub97c \uc0ac\uc6a9\ud558\uba74 \ud074\ub77c\uc774\uc5b8\ud2b8\uac00 \ubc1b\ub294 \uc751\ub2f5 \uc0c1\ud0dc \ucf54\ub4dc\uac00 \ub2ec\ub77c\uc9c8 \uc218 \uc788\uc74c\uc5d0\ub3c4 \ubd88\uad6c\ud558\uace0 DELETE \uba54\uc18c\ub4dc\ub294 \uba71\ub4f1\ud558\ub2e4. \uc65c\ub0d0\ud558\uba74 ",(0,c.jsx)("mark",{children:"\uba71\ub4f1\uc131\uc758 \uae30\uc900\uc774 \u201c\uc0c1\ud0dc \ucf54\ub4dc\u201d\uac00 \uc544\ub2c8\uae30 \ub54c\ubb38"}),"\uc774\ub2e4. \uc55e\uc11c \uc0b4\ud3b4\ubcf8\ub300\ub85c \uacf5\uc2dd \ubb38\uc11c\uc758 \uc124\uba85\uc5d0 \ub530\ub974\uba74 \uba71\ub4f1\uc131\uc740 \u201c\uc11c\ubc84\uc5d0\xa0\ubbf8\uce58\ub294\xa0\uc758\ub3c4\ub41c\xa0\uc601\ud5a5\uc774\xa0\ub3d9\uc77c\ud55c\uac00?\u201d \uc774\ub2e4. DELETE\uc758 \ubaa9\uc801\uc740\xa0\ub9ac\uc18c\uc2a4\ub97c \uc0ad\uc81c\ud558\uc5ec \uc11c\ubc84\uc5d0 \ub9ac\uc18c\uc2a4\uac00 \uc5c6\ub3c4\ub85d \ub9cc\ub4dc\ub294 \uac83\uc774\uace0, DELETE\ub97c \uc5ec\ub7ec \ubc88 \ud638\ucd9c\ud574\ub3c4 \uc751\ub2f5 \uc0c1\ud0dc\uc640 \ubb34\uad00\ud558\uac8c \ub9ac\uc18c\uc2a4\uac00 \uc5c6\ub294 \uc0c1\ud0dc\ub97c \uc720\uc9c0\ud558\ub3c4\ub85d \ud55c\ub2e4. \uadf8\ub7ec\ubbc0\ub85c HTTP DELETE \uba54\uc18c\ub4dc\ub294 \uba71\ub4f1\ud55c \uac83\uc774\ub2e4.\n\uacb0\uad6d \uba71\ub4f1\uc131\uc740 \ub9ac\uc18c\uc2a4 \uad00\uc810\uc5d0\uc11c \uc0dd\uac01\ud558\ub294 \uac83\uc774 \uc911\uc694\ud558\ub2e4. \uc5ec\ub7ec \ubc88 \uc694\uccad\ud574\ub3c4 \ub9ac\uc18c\uc2a4\uac00 \ub3d9\uc77c\ud558\ub2e4\uba74 \uba71\ub4f1\ud55c \uac83\uc73c\ub85c \ubd10\ub3c4 \ub41c\ub2e4."]}),"\n",(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.img,{alt:"HTTP method_itempotency",src:n(8183).A+"",width:"1280",height:"502"}),"\n",(0,c.jsx)(t.img,{alt:"HTTP method_itempotency2",src:n(5331).A+"",width:"1280",height:"542"})]})]})}function p(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(h,{...e})}):h(e)}},5331:(e,t,n)=>{n.d(t,{A:()=>s});const s=n.p+"assets/images/http-method-itempotency2-87a53bb4106f5e5b0ef16fb1fffc5b03.png"},8183:(e,t,n)=>{n.d(t,{A:()=>s});const s=n.p+"assets/images/http-method_itempotency-ae7bb265738a05f86e50c893cc17e1c8.png"},8453:(e,t,n)=>{n.d(t,{R:()=>i,x:()=>r});var s=n(6540);const c={},o=s.createContext(c);function i(e){const t=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(c):e.components||c:i(e.components),s.createElement(o.Provider,{value:t},e.children)}}}]);