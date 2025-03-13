"use strict";(self.webpackChunkjohnycho_dev=self.webpackChunkjohnycho_dev||[]).push([[9767],{2494:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>d,default:()=>o,frontMatter:()=>a,metadata:()=>c,toc:()=>r});const c=JSON.parse('{"id":"cs/cs-stack-queue","title":"\uc2a4\ud0dd \uc790\ub8cc\uad6c\uc870","description":"\u2714\ufe0f \uc2a4\ud0dd(Stack)","source":"@site/docs/cs/cs-stack-queue.md","sourceDirName":"cs","slug":"/cs/cs-stack-queue","permalink":"/docs/cs/cs-stack-queue","draft":false,"unlisted":false,"tags":[{"inline":false,"label":"Computer Science","permalink":"/docs/tags/cs","description":"Computer Science tag description"},{"inline":false,"label":"Java","permalink":"/docs/tags/java","description":"Java tag description"}],"version":"current","frontMatter":{"slug":"cs-stack-queue","title":"\uc2a4\ud0dd \uc790\ub8cc\uad6c\uc870","tags":["cs","java"]},"sidebar":"johnyDocsSidebar","previous":{"title":"\uc11c\ubc84 \uc0ac\uc774\ub4dc \ub80c\ub354\ub9c1(SSR)\uacfc \ud074\ub77c\uc774\uc5b8\ud2b8 \uc0ac\uc774\ub4dc \ub80c\ub354\ub9c1(CSR)","permalink":"/docs/cs/cs-ssr-and-csr"},"next":{"title":"\ub3d9\uae30 vs \ube44\ub3d9\uae30, \ube14\ub85c\ud0b9 vs \ub17c\ube14\ub85c\ud0b9","permalink":"/docs/cs/cs-sync-async-blocking-non-blocking"}}');var t=s(4848),i=s(8453);const a={slug:"cs-stack-queue",title:"\uc2a4\ud0dd \uc790\ub8cc\uad6c\uc870",tags:["cs","java"]},d=void 0,l={},r=[{value:"\u2714\ufe0f \uc2a4\ud0dd(Stack)",id:"\ufe0f-\uc2a4\ud0ddstack",level:2},{value:"\u2714\ufe0f \uc790\ubc14\uc5d0\uc11c \uc2a4\ud0dd\uc740 \uc5b4\ub5bb\uac8c \uc0ac\uc6a9\ud560 \uc218 \uc788\uc744\uae4c?",id:"\ufe0f-\uc790\ubc14\uc5d0\uc11c-\uc2a4\ud0dd\uc740-\uc5b4\ub5bb\uac8c-\uc0ac\uc6a9\ud560-\uc218-\uc788\uc744\uae4c",level:2},{value:"\u2714\ufe0f \ud050 (Queue)",id:"\ufe0f-\ud050-queue",level:2},{value:"\u2714\ufe0f Double-Ended Queue (\uc591\ubc29\ud5a5 \ud050)",id:"\ufe0f-double-ended-queue-\uc591\ubc29\ud5a5-\ud050",level:2},{value:"Deque \uc778\ud130\ud398\uc774\uc2a4 \uad6c\ud604\uccb4",id:"deque-\uc778\ud130\ud398\uc774\uc2a4-\uad6c\ud604\uccb4",level:3}];function u(e){const n={code:"code",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",ul:"ul",...(0,i.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h2,{id:"\ufe0f-\uc2a4\ud0ddstack",children:"\u2714\ufe0f \uc2a4\ud0dd(Stack)"}),"\n",(0,t.jsxs)(n.p,{children:["\ud6c4\uc785\uc120\ucd9c(Last In First Out, \ub098\uc911\uc5d0 \ub4e4\uc5b4\uac04 \uac12\uc774 \uba3c\uc800 \ub098\uc628\ub2e4)\uc774\ub77c\ub294 \uac1c\ub150\uc744 \uac00\uc9c4 \uc120\ud615 \uc790\ub8cc\uad6c\uc870\uc785\ub2c8\ub2e4. \uc2a4\ud0dd \uc790\ub8cc\uad6c\uc870\uc5d0\uc11c \uc0ad\uc81c(pop)\ub294 \uac00\uc7a5 \ucd5c\uc0c1\ub2e8(top)\uc5d0\uc11c\ub9cc \uc774\ub8e8\uc5b4\uc9d1\ub2c8\ub2e4. \ube44\uc5b4\uc788\ub294 \uc2a4\ud0dd\uc5d0\uc11c \uac12\uc744 \ucd94\ucd9c\ud558\ub824\uace0 \uc2dc\ub3c4\ud558\ub294 \uacbd\uc6b0\ub97c ",(0,t.jsx)(n.code,{children:"\uc2a4\ud0dd \uc5b8\ub354\ud50c\ub85c\uc6b0"}),"\ub77c\uace0 \ud558\uba70, \uc2a4\ud0dd\uc774 \ub118\uce58\ub294 \uacbd\uc6b0\ub97c ",(0,t.jsx)(n.code,{children:"\uc2a4\ud0dd \uc624\ubc84\ud50c\ub85c\uc6b0"}),"\ub77c\uace0 \ud569\ub2c8\ub2e4. \ub300\ud45c\uc801\uc778 \ud65c\uc6a9 \uc0ac\ub840\ub294 \uc2a4\ud0dd \uba54\ubaa8\ub9ac, \ube0c\ub77c\uc6b0\uc800 \ub4a4\ub85c\uac00\uae30 \uae30\ub2a5, \uc5b8\ub450 \uae30\ub2a5, \uc218\uc2dd \uad04\ud638 \uac80\uc0ac \ub4f1\uc774 \uc788\uc2b5\ub2c8\ub2e4."]}),"\n",(0,t.jsx)(n.h2,{id:"\ufe0f-\uc790\ubc14\uc5d0\uc11c-\uc2a4\ud0dd\uc740-\uc5b4\ub5bb\uac8c-\uc0ac\uc6a9\ud560-\uc218-\uc788\uc744\uae4c",children:"\u2714\ufe0f \uc790\ubc14\uc5d0\uc11c \uc2a4\ud0dd\uc740 \uc5b4\ub5bb\uac8c \uc0ac\uc6a9\ud560 \uc218 \uc788\uc744\uae4c?"}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"Stack"}),"\uc774\ub77c\ub294 \ud074\ub798\uc2a4\ub97c \uc0ac\uc6a9\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4. \ud558\uc9c0\ub9cc, ",(0,t.jsx)(n.code,{children:"Deque"})," \uc778\ud130\ud398\uc774\uc2a4 \uad6c\ud604\uccb4\ub97c \uc0ac\uc6a9\ud558\ub294 \uac83\uc774 \uad8c\uc7a5\ub429\ub2c8\ub2e4. \uc65c\ub0d0\ud558\uba74, ",(0,t.jsx)(n.code,{children:"Stack"})," \ud074\ub798\uc2a4\ub294 \ub0b4\ubd80\uc801\uc73c\ub85c ",(0,t.jsx)(n.code,{children:"Vector"}),"\ub97c \uc0c1\uc18d \ubc1b\uace0 \uc788\uae30 \ub54c\ubb38\uc785\ub2c8\ub2e4. ",(0,t.jsx)(n.code,{children:"Vector"}),"\ub97c \uc0c1\uc18d\ubc1b\uc740 ",(0,t.jsx)(n.code,{children:"Stack"}),"\uc740 \uc778\ub371\uc2a4\ub97c \ud1b5\ud55c \uc811\uadfc, \uc0bd\uc785, \uc81c\uac70 \ub4f1\uc774 \uc2e4\uc9c8\uc801\uc73c\ub85c \uac00\ub2a5\ud569\ub2c8\ub2e4. \uc774\ub294 \ud6c4\uc785\uc120\ucd9c \ud2b9\uc9d5\uc5d0 \ub9de\uc9c0 \uc54a\uae30 \ub54c\ubb38\uc5d0 \uac1c\ubc1c\uc790\uac00 \uc2e4\uc218\ud560 \uc5ec\uc9c0\uac00 \uc788\uc2b5\ub2c8\ub2e4."]}),"\n",(0,t.jsxs)(n.p,{children:["\ub610\ud55c, ",(0,t.jsx)(n.code,{children:"Vector"}),"\uc758 \uba54\uc18c\ub4dc\ub4e4\uc740 ",(0,t.jsx)(n.code,{children:"synchronized"}),"\ub85c \uad6c\ud604\ub418\uc5b4 \uc788\uc5b4 \uba40\ud2f0 \uc2a4\ub808\ub4dc \ud658\uacbd\uc5d0\uc11c\ub294 \ub3d9\uae30\ud654\uc758 \uc774\uc810\uc774 \uc788\uc73c\ub098, \ub2e8\uc77c \uc2a4\ub808\ub4dc \ud658\uacbd\uc5d0\uc11c\ub294 \ubd88\ud544\uc694\ud55c \ub3d9\uae30\ud654 \uc791\uc5c5\uc73c\ub85c \uc778\ud574 \uc131\ub2a5 \uce21\uba74\uc5d0\uc11c \uc88b\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4. \ubc18\uba74\uc5d0, ",(0,t.jsx)(n.code,{children:"Deque"})," \uc778\ud130\ud398\uc774\uc2a4\ub294 \ud6c4\uc785\uc120\ucd9c\uc758 \ud2b9\uc131\uc744 \uc644\uc804\ud788 \uc720\uc9c0\ud558\uba74\uc11c\ub3c4 \ub3d9\uae30\ud654 \uc791\uc5c5\uc744 \uac00\uc9c0\ub294 \uad6c\ud604\uccb4\uc640 \uadf8\ub807\uc9c0 \uc54a\uc740 \uad6c\ud604\uccb4\ub97c \uc120\ud0dd\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4. \uc774\ub294 \uac1c\ubc1c\uc790\uac00 \ud544\uc694\uc5d0 \ub530\ub77c \ub3d9\uae30\ud654 \uc791\uc5c5\uc758 \uc624\ubc84\ud5e4\ub4dc\ub97c \ud68c\ud53c\ud558\uace0 \uc131\ub2a5\uc744 \ucd5c\uc801\ud654\ud560 \uc218 \uc788\ub3c4\ub85d \ud569\ub2c8\ub2e4."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-java",children:'public class Application {\n    public static void main(String[] args) {\n        Stack<String> stack = new Stack<>();\n        stack.push("\uccab \ubc88\uc9f8 \uc694\uc18c");\n        stack.push("\ub450 \ubc88\uc9f8 \uc694\uc18c");\n        System.out.println(stack.pop());\n    }\n}   \n// \uc2e4\ud589 \uacb0\uacfc\n// > Task :Application.main()\n// \ub450 \ubc88\uc9f8 \uc694\uc18c\n'})}),"\n",(0,t.jsx)(n.h2,{id:"\ufe0f-\ud050-queue",children:"\u2714\ufe0f \ud050 (Queue)"}),"\n",(0,t.jsx)(n.p,{children:"\uc120\uc785\uc120\ucd9c(First In First Out, \uba3c\uc800 \ub4e4\uc5b4\uac04 \uac12\uc774 \uba3c\uc800 \ub098\uc628\ub2e4) \uc790\ub8cc\uad6c\uc870\ub97c \uad6c\ud604\ud55c \uc790\ubc14\uc758 \uc778\ud130\ud398\uc774\uc2a4\ub2e4. \uc778\ub371\uc2a4\ub85c \uc694\uc18c\uc5d0 \uc811\uadfc\uc774 \ubd88\uac00\ub2a5\ud558\ub2e4."}),"\n",(0,t.jsx)(n.h2,{id:"\ufe0f-double-ended-queue-\uc591\ubc29\ud5a5-\ud050",children:"\u2714\ufe0f Double-Ended Queue (\uc591\ubc29\ud5a5 \ud050)"}),"\n",(0,t.jsx)(n.p,{children:"Queue \uc778\ud130\ud398\uc774\uc2a4\ub97c \ud655\uc7a5\ud55c \uc778\ud130\ud398\uc774\uc2a4\ub2e4. \uc790\ub8cc\uc758 \uc785\ucd9c\ub825\uc744 \uc591 \ub05d\uc5d0\uc11c \ud560 \uc218 \uc788\ub2e4. \uc778\ub371\uc2a4\ub85c \uc694\uc18c\uc5d0 \uc561\uc138\uc2a4, \uc0bd\uc785, \uc81c\uac70\ub97c \ud5c8\uc6a9\ud558\uc9c0 \uc54a\ub294\ub2e4."}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-java",children:'public class Application {\n    public static void main(String[] args) {\n        Deque<String> deque = new ArrayDeque<>();\n        deque.addFirst("\uccab \ubc88\uc9f8 \uc694\uc18c"); // "\uccab \ubc88\uc9f8 \uc694\uc18c"\n        deque.add("\ub450 \ubc88\uc9f8 \uc694\uc18c"); // "\uccab \ubc88\uc9f8 \uc694\uc18c", "\ub450 \ubc88\uc9f8 \uc694\uc18c"\n        deque.push("\uc138 \ubc88\uc9f8 \uc694\uc18c"); // "\uc138 \ubc88\uc9f8 \uc694\uc18c", "\uccab \ubc88\uc9f8 \uc694\uc18c", "\ub450 \ubc88\uc9f8 \uc694\uc18c"\n        System.out.println(deque.pop());\n        System.out.println(deque.pop());\n    }\n}\n// \uc2e4\ud589 \uacb0\uacfc\n// > Task :Application.main()\n// \uc138 \ubc88\uc9f8 \uc694\uc18c\n// \uccab \ubc88\uc9f8 \uc694\uc18c\n'})}),"\n",(0,t.jsx)(n.h3,{id:"deque-\uc778\ud130\ud398\uc774\uc2a4-\uad6c\ud604\uccb4",children:"Deque \uc778\ud130\ud398\uc774\uc2a4 \uad6c\ud604\uccb4"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"ArrayDeque"}),"\n",(0,t.jsx)(n.li,{children:"LinkedList"}),"\n"]})]})}function o(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(u,{...e})}):u(e)}},8453:(e,n,s)=>{s.d(n,{R:()=>a,x:()=>d});var c=s(6540);const t={},i=c.createContext(t);function a(e){const n=c.useContext(i);return c.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:a(e.components),c.createElement(i.Provider,{value:n},e.children)}}}]);