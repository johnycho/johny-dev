"use strict";(self.webpackChunkjohnycho_dev=self.webpackChunkjohnycho_dev||[]).push([[718],{5770:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>o,contentTitle:()=>i,default:()=>p,frontMatter:()=>s,metadata:()=>t,toc:()=>c});const t=JSON.parse('{"id":"spring-data-jpa/spring-data-jpa-ddl-auto","title":"ddl-auto \uc635\uc158","description":"ddl-auto \uc635\uc158\uc740 \uc2a4\ud504\ub9c1 \ubd80\ud2b8 \uc560\ud50c\ub9ac\ucf00\uc774\uc158\uc5d0\uc11c Hibernate\uc640 \uac19\uc740 JPA \uad6c\ud604\uccb4\ub97c \uc0ac\uc6a9\ud560 \ub54c \ub370\uc774\ud130\ubca0\uc774\uc2a4 \uc2a4\ud0a4\ub9c8 \uad00\ub9ac\ub97c \uc81c\uc5b4\ud558\ub294 \uc124\uc815\uc785\ub2c8\ub2e4.","source":"@site/docs/spring-data-jpa/spring-data-jpa-ddl-auto.md","sourceDirName":"spring-data-jpa","slug":"/spring-data-jpa/spring-data-jpa-ddl-auto","permalink":"/docs/spring-data-jpa/spring-data-jpa-ddl-auto","draft":false,"unlisted":false,"tags":[{"inline":false,"label":"JPA","permalink":"/docs/tags/jpa","description":"JPA tag description"}],"version":"current","frontMatter":{"slug":"spring-data-jpa-ddl-auto","title":"ddl-auto \uc635\uc158","tags":["jpa"]},"sidebar":"johnyDocsSidebar","previous":{"title":"Spring Data JPA","permalink":"/docs/category/spring-data-jpa"},"next":{"title":"\uc5d4\ud2f0\ud2f0 \ub9e4\ub2c8\uc800(Entity Manager)","permalink":"/docs/spring-data-jpa/spring-data-jpa-entity-manager"}}');var d=a(4848),r=a(8453);const s={slug:"spring-data-jpa-ddl-auto",title:"ddl-auto \uc635\uc158",tags:["jpa"]},i="JPA\uc758 ddl-auto \uc635\uc158\uc740 \uac01\uac01 \uc5b4\ub5a4 \ub3d9\uc791\uc744 \ud558\uace0 \uc5b4\ub5a4 \uc0c1\ud669\uc5d0\uc11c \uc0ac\uc6a9\ud574\uc57c \ud560\uae4c?",o={},c=[{value:"\uac01 \uc635\uc158\uc740 \uc5b4\ub5bb\uac8c \ub2e4\ub978\ub370? \ud83e\udd14",id:"\uac01-\uc635\uc158\uc740-\uc5b4\ub5bb\uac8c-\ub2e4\ub978\ub370-",level:2},{value:"\ud504\ub85c\ub355\uc158 \ud658\uacbd\uc5d0\uc11c \uc2a4\ud0a4\ub9c8 \ubcc0\uacbd\uc740 \uc5b4\ub5bb\uac8c \ud574\uc57c\ud560\uae4c? \ud83e\udd13",id:"\ud504\ub85c\ub355\uc158-\ud658\uacbd\uc5d0\uc11c-\uc2a4\ud0a4\ub9c8-\ubcc0\uacbd\uc740-\uc5b4\ub5bb\uac8c-\ud574\uc57c\ud560\uae4c-",level:2}];function l(e){const n={code:"code",h1:"h1",h2:"h2",header:"header",p:"p",...(0,r.R)(),...e.components};return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(n.header,{children:(0,d.jsx)(n.h1,{id:"jpa\uc758-ddl-auto-\uc635\uc158\uc740-\uac01\uac01-\uc5b4\ub5a4-\ub3d9\uc791\uc744-\ud558\uace0-\uc5b4\ub5a4-\uc0c1\ud669\uc5d0\uc11c-\uc0ac\uc6a9\ud574\uc57c-\ud560\uae4c",children:"JPA\uc758 ddl-auto \uc635\uc158\uc740 \uac01\uac01 \uc5b4\ub5a4 \ub3d9\uc791\uc744 \ud558\uace0 \uc5b4\ub5a4 \uc0c1\ud669\uc5d0\uc11c \uc0ac\uc6a9\ud574\uc57c \ud560\uae4c?"})}),"\n",(0,d.jsxs)(n.p,{children:["ddl-auto \uc635\uc158\uc740 \uc2a4\ud504\ub9c1 \ubd80\ud2b8 \uc560\ud50c\ub9ac\ucf00\uc774\uc158\uc5d0\uc11c Hibernate\uc640 \uac19\uc740 JPA \uad6c\ud604\uccb4\ub97c \uc0ac\uc6a9\ud560 \ub54c \ub370\uc774\ud130\ubca0\uc774\uc2a4 \uc2a4\ud0a4\ub9c8 \uad00\ub9ac\ub97c \uc81c\uc5b4\ud558\ub294 \uc124\uc815\uc785\ub2c8\ub2e4.\n\uc774 \uc635\uc158\uc740 ",(0,d.jsx)(n.code,{children:"application.properties"})," \ub610\ub294 ",(0,d.jsx)(n.code,{children:"application.yml"})," \ud30c\uc77c\uc5d0\uc11c \uc124\uc815\ud560 \uc218 \uc788\uc73c\uba70, \ub2e4\uc591\ud55c \uac12\uc5d0 \ub530\ub77c \ub370\uc774\ud130\ubca0\uc774\uc2a4 \uc2a4\ud0a4\ub9c8\uc5d0 \ub300\ud574 \ub2e4\ub978 \ub3d9\uc791\uc744\n\uc218\ud589\ud569\ub2c8\ub2e4.\nddl-auto \uc635\uc158\uc5d0\ub294 none, validate, update, create, create-drop \ub4f1\uc774 \uc874\uc7ac\ud569\ub2c8\ub2e4."]}),"\n",(0,d.jsx)(n.h2,{id:"\uac01-\uc635\uc158\uc740-\uc5b4\ub5bb\uac8c-\ub2e4\ub978\ub370-",children:"\uac01 \uc635\uc158\uc740 \uc5b4\ub5bb\uac8c \ub2e4\ub978\ub370? \ud83e\udd14"}),"\n",(0,d.jsxs)(n.p,{children:[(0,d.jsx)(n.code,{children:"none"}),"\uc73c\ub85c \uc124\uc815\ud558\uba74 \ub370\uc774\ud130\ubca0\uc774\uc2a4 \uc2a4\ud0a4\ub9c8\uc640 \uad00\ub828\ub41c \uc5b4\ub5a0\ud55c \uc791\uc5c5\ub3c4 \uc218\ud589\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4. \ub370\uc774\ud130\ubca0\uc774\uc2a4 \uc2a4\ud0a4\ub9c8\ub97c \uc218\ub3d9\uc73c\ub85c \uad00\ub9ac\ud558\uace0 \uc2f6\uc744 \ub54c \uc720\uc6a9\ud558\uba70, \ud504\ub85c\ub355\uc158 \ud658\uacbd\uc5d0\uc11c \uc8fc\ub85c\n\uc0ac\uc6a9\ub429\ub2c8\ub2e4."]}),"\n",(0,d.jsxs)(n.p,{children:[(0,d.jsx)(n.code,{children:"validate"}),"\ub294 \uc560\ud50c\ub9ac\ucf00\uc774\uc158\uc774 \uc2dc\uc791\ub420 \ub54c, \uc5d4\ud2f0\ud2f0 \ub9e4\ud551\uc774 \ub370\uc774\ud130\ubca0\uc774\uc2a4 \uc2a4\ud0a4\ub9c8\uc640 \uc77c\uce58\ud558\ub294\uc9c0 \uac80\uc99d\ud558\uba70 \uc2a4\ud0a4\ub9c8 \ubcc0\uacbd\uc740 \ub530\ub85c \uc218\ud589\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4. \ud504\ub85c\ub355\uc158 \ud658\uacbd\uc5d0\uc11c \uc5d4\ud2f0\ud2f0\uc640\n\ub370\uc774\ud130\ubca0\uc774\uc2a4 \uc2a4\ud0a4\ub9c8\uac00 \uc77c\uce58\ud558\ub294\uc9c0 \ud655\uc778\ud558\uace0 \uc2f6\uc744 \ub54c \uc0ac\uc6a9\ud569\ub2c8\ub2e4."]}),"\n",(0,d.jsxs)(n.p,{children:[(0,d.jsx)(n.code,{children:"update"}),"\ub294 \uc5d4\ud2f0\ud2f0 \ub9e4\ud551\uacfc \ub370\uc774\ud130\ubca0\uc774\uc2a4 \uc2a4\ud0a4\ub9c8\ub97c \ube44\uad50\ud558\uc5ec \ud544\uc694\ud55c \uacbd\uc6b0 \uc2a4\ud0a4\ub9c8\ub97c \uc5c5\ub370\uc774\ud2b8\ud569\ub2c8\ub2e4. \uae30\uc874 \ub370\uc774\ud130\ub294 \uc720\uc9c0\ub418\uc9c0\ub9cc, \uc0c8\ub85c\uc6b4 \uc5d4\ud2f0\ud2f0\ub098 \ubcc0\uacbd\ub41c \uc5d4\ud2f0\ud2f0 \ud544\ub4dc\ub294 \uc2a4\ud0a4\ub9c8\uc5d0\n\ubc18\uc601\ub429\ub2c8\ub2e4. \ud574\ub2f9 \uc635\uc158\uc740 \uc5d4\ud2f0\ud2f0\uc5d0 \ubcc0\uacbd\uc774 \ubc1c\uc0dd\ud560 \ub54c \uc790\ub3d9\uc73c\ub85c \uc2a4\ud0a4\ub9c8\ub97c \uc5c5\ub370\uc774\ud2b8\ud558\uace0 \uc2f6\uc744 \ub54c \uc720\uc6a9\ud569\ub2c8\ub2e4. \ud504\ub85c\ub355\uc158 \ud658\uacbd\uc5d0\uc11c\ub294 \uc608\uae30\uce58 \uc54a\uc740 \uc2a4\ud0a4\ub9c8 \ubcc0\uacbd\uc744 \ubc29\uc9c0\ud558\uae30 \uc704\ud574 \uc8fc\uc758\uac00\n\ud544\uc694\ud569\ub2c8\ub2e4."]}),"\n",(0,d.jsxs)(n.p,{children:[(0,d.jsx)(n.code,{children:"create"}),"\ub294 \uc560\ud50c\ub9ac\ucf00\uc774\uc158\uc774 \uc2dc\uc791\ub420 \ub54c \uae30\uc874 \uc2a4\ud0a4\ub9c8\ub97c \uc0ad\uc81c\ud558\uace0 \uc0c8\ub85c \uc0dd\uc131\ud569\ub2c8\ub2e4. \ub370\uc774\ud130\uac00 \ubaa8\ub450 \uc0ad\uc81c\ub418\uba70 \uc5d4\ud2f0\ud2f0 \ub9e4\ud551\uc744 \uae30\ubc18\uc73c\ub85c \uc0c8\ub85c\uc6b4 \uc2a4\ud0a4\ub9c8\uac00 \uc0dd\uc131\ub429\ub2c8\ub2e4. \uac1c\ubc1c \ucd08\uae30\uc5d0 \ube48\n\ub370\uc774\ud130\ubca0\uc774\uc2a4 \uc2a4\ud0a4\ub9c8\ub97c \ubc18\ubcf5\uc801\uc73c\ub85c \uc0dd\uc131\ud574\uc57c \ud560 \ub54c \uc720\uc6a9\ud569\ub2c8\ub2e4. \uae30\uc874 \ub370\uc774\ud130\uac00 \ubaa8\ub450 \uc0ad\uc81c\ub418\ubbc0\ub85c \ud504\ub85c\ub355\uc158 \ud658\uacbd\uc5d0\uc11c\ub294 \uc0ac\uc6a9\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4."]}),"\n",(0,d.jsxs)(n.p,{children:[(0,d.jsx)(n.code,{children:"create-drop"}),"\uc740 ",(0,d.jsx)(n.code,{children:"create"}),"\uc640 \uc720\uc0ac\ud558\uc9c0\ub9cc, \uc560\ud50c\ub9ac\ucf00\uc774\uc158\uc774 \uc885\ub8cc\ub420 \ub54c \uc2a4\ud0a4\ub9c8\ub97c \uc0ad\uc81c\ud55c\ub2e4\ub294 \uc810\uc774 \ub2e4\ub985\ub2c8\ub2e4. \ud574\ub2f9 \uc635\uc158\uc740 \ud14c\uc2a4\ud2b8 \ud658\uacbd\uc5d0\uc11c \uc77c\uc2dc\uc801\uc778 \ub370\uc774\ud130\ubca0\uc774\uc2a4 \uc2a4\ud0a4\ub9c8\uac00\n\ud544\uc694\ud55c \uacbd\uc6b0 \uc720\uc6a9\ud558\uba70, \ub9e4 \ud14c\uc2a4\ud2b8 \uc2e4\ud589 \uc2dc\ub9c8\ub2e4 \uae68\ub057\ud55c \ub370\uc774\ud130\ubca0\uc774\uc2a4 \uc0c1\ud0dc\ub97c \uc720\uc9c0\ud558\uace0\uc790 \ud560 \ub54c \uc0ac\uc6a9\ub429\ub2c8\ub2e4. \ud504\ub85c\ub355\uc158 \ud658\uacbd\uc5d0\uc11c\ub294 \uc0ac\uc6a9\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4."]}),"\n",(0,d.jsx)(n.h2,{id:"\ud504\ub85c\ub355\uc158-\ud658\uacbd\uc5d0\uc11c-\uc2a4\ud0a4\ub9c8-\ubcc0\uacbd\uc740-\uc5b4\ub5bb\uac8c-\ud574\uc57c\ud560\uae4c-",children:"\ud504\ub85c\ub355\uc158 \ud658\uacbd\uc5d0\uc11c \uc2a4\ud0a4\ub9c8 \ubcc0\uacbd\uc740 \uc5b4\ub5bb\uac8c \ud574\uc57c\ud560\uae4c? \ud83e\udd13"}),"\n",(0,d.jsx)(n.p,{children:"\uc2a4\ud0a4\ub9c8 \ubcc0\uacbd\uc774 \ud544\uc694\ud560 \ub54c\ub294 \uc801\uc808\ud55c \ub370\uc774\ud130\ubca0\uc774\uc2a4 \ub9c8\uc774\uadf8\ub808\uc774\uc158 \ub3c4\uad6c(Flyway, Liquibase \ub4f1)\ub97c \uc0ac\uc6a9\ud558\uc5ec \uc81c\uc5b4\ub41c \ubc29\uc2dd\uc73c\ub85c \uc2a4\ud0a4\ub9c8\ub97c \uad00\ub9ac\ud558\uac70\ub098, \uc0ac\uc6a9\uc790\uac00 \uc5c6\ub294 \uc0c8\ubcbd\uc5d0 \uc2a4\ud0a4\ub9c8\n\ubcc0\uacbd \uc791\uc5c5\uc744 \uc218\ub3d9\uc73c\ub85c \uc9c4\ud589\ud558\ub294 \uac83\uc774 \ub354\uc6b1 \uc548\uc804\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."})]})}function p(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,d.jsx)(n,{...e,children:(0,d.jsx)(l,{...e})}):l(e)}},8453:(e,n,a)=>{a.d(n,{R:()=>s,x:()=>i});var t=a(6540);const d={},r=t.createContext(d);function s(e){const n=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(d):e.components||d:s(e.components),t.createElement(r.Provider,{value:n},e.children)}}}]);