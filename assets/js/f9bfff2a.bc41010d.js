"use strict";(self.webpackChunkjohnycho_dev=self.webpackChunkjohnycho_dev||[]).push([[499],{5526:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>o,contentTitle:()=>c,default:()=>a,frontMatter:()=>r,metadata:()=>t,toc:()=>h});const t=JSON.parse('{"id":"cs/cs-cors","title":"CORS(Cross Origin Resource Sharing)","description":"CORS(Cross Origin Resource Sharing)\ub294 \ucd9c\ucc98\uac00 \ub2e4\ub978 \uacf3\uc758 \ub9ac\uc18c\uc2a4\ub97c \uc694\uccad\ud560 \ub54c \uc811\uadfc \uad8c\ud55c\uc744 \ubd80\uc5ec\ud558\ub294 \uba54\ucee4\ub2c8\uc998\uc785\ub2c8\ub2e4. \ub9ac\uc18c\uc2a4\ub97c \uc8fc\uace0\ubc1b\ub294 \ub450 \uacf3\uc758 \ucd9c\ucc98\uac00 \ub2e4\ub974\uba74 \ucd9c\ucc98\uac00 \uad50\ucc28\ud55c\ub2e4\uace0 \ud569\ub2c8\ub2e4. \uc774\ub54c \ucd9c\ucc98\ub294 URL\ubfd0\ub9cc \uc544\ub2c8\ub77c \ud504\ub85c\ud1a0\ucf5c\uacfc \ud3ec\ud2b8\uae4c\uc9c0 \ud3ec\ud568\ub429\ub2c8\ub2e4. \ub9cc\uc57d \ud074\ub77c\uc774\uc5b8\ud2b8\uc758 \ucd9c\ucc98\uac00 \ud5c8\uc6a9\ub418\uc9c0 \uc54a\uc558\ub2e4\uba74 CORS \uc5d0\ub7ec\uac00 \ubc1c\uc0dd\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.","source":"@site/docs/cs/cs-cors.md","sourceDirName":"cs","slug":"/cs/cs-cors","permalink":"/docs/cs/cs-cors","draft":false,"unlisted":false,"tags":[{"inline":false,"label":"Computer Science","permalink":"/docs/tags/cs","description":"Computer Science tag description"},{"inline":false,"label":"Network","permalink":"/docs/tags/network","description":"Network tag description"}],"version":"current","frontMatter":{"slug":"cs-cors","title":"CORS(Cross Origin Resource Sharing)","tags":["cs","network"]},"sidebar":"johnyDocsSidebar","previous":{"title":"\ub3d9\uc2dc\uc131\uacfc \ubcd1\ub82c\uc131","permalink":"/docs/cs/cs-concurrency-and-parallelism"},"next":{"title":"\uc77c\uae09 \uceec\ub809\uc158","permalink":"/docs/cs/cs-first-class-collection"}}');var i=s(4848),l=s(8453);const r={slug:"cs-cors",title:"CORS(Cross Origin Resource Sharing)",tags:["cs","network"]},c="CORS\ub780?",o={},h=[{value:"\u2714\ufe0f CORS\ub294 \uc65c \ud544\uc694\ud558\uc9c0?",id:"\ufe0f-cors\ub294-\uc65c-\ud544\uc694\ud558\uc9c0",level:2},{value:"\u2714\ufe0f CORS\ub294 \uc5b4\ub5bb\uac8c \uc791\ub3d9\ud560\uae4c\uc694? \ud83e\udd14",id:"\ufe0f-cors\ub294-\uc5b4\ub5bb\uac8c-\uc791\ub3d9\ud560\uae4c\uc694-",level:2},{value:"\u2705 Simple Request\ub780?",id:"-simple-request\ub780",level:3},{value:"\u2705 Simple Request\uc758 \uc870\uac74",id:"-simple-request\uc758-\uc870\uac74",level:3},{value:"1\ufe0f\u20e3 \ud5c8\uc6a9\ub41c HTTP \uba54\uc11c\ub4dc\ub9cc \uc0ac\uc6a9\ud574\uc57c \ud568",id:"1\ufe0f\u20e3-\ud5c8\uc6a9\ub41c-http-\uba54\uc11c\ub4dc\ub9cc-\uc0ac\uc6a9\ud574\uc57c-\ud568",level:4},{value:"2\ufe0f\u20e3 \ud5c8\uc6a9\ub41c HTTP \ud5e4\ub354\ub9cc \ud3ec\ud568\ud574\uc57c \ud568",id:"2\ufe0f\u20e3-\ud5c8\uc6a9\ub41c-http-\ud5e4\ub354\ub9cc-\ud3ec\ud568\ud574\uc57c-\ud568",level:4},{value:"3\ufe0f\u20e3 \uc694\uccad\uc5d0 XMLHttpRequest.withCredentials = true\uac00 \uc5c6\uc5b4\uc57c \ud568",id:"3\ufe0f\u20e3-\uc694\uccad\uc5d0-xmlhttprequestwithcredentials--true\uac00-\uc5c6\uc5b4\uc57c-\ud568",level:4},{value:"\u2705 Simple Request \uc608\uc2dc",id:"-simple-request-\uc608\uc2dc",level:3},{value:"\u2705 Preflight Request\ub780?",id:"-preflight-request\ub780",level:3},{value:"\u2705 Preflight Request\uac00 \ud544\uc694\ud55c \uacbd\uc6b0",id:"-preflight-request\uac00-\ud544\uc694\ud55c-\uacbd\uc6b0",level:3},{value:"1\ufe0f\u20e3 \ud5c8\uc6a9\ub418\uc9c0 \uc54a\uc740 HTTP \uba54\uc11c\ub4dc \uc0ac\uc6a9",id:"1\ufe0f\u20e3-\ud5c8\uc6a9\ub418\uc9c0-\uc54a\uc740-http-\uba54\uc11c\ub4dc-\uc0ac\uc6a9",level:4},{value:"2\ufe0f\u20e3 \ud5c8\uc6a9\ub418\uc9c0 \uc54a\uc740 \ud5e4\ub354 \uc0ac\uc6a9",id:"2\ufe0f\u20e3-\ud5c8\uc6a9\ub418\uc9c0-\uc54a\uc740-\ud5e4\ub354-\uc0ac\uc6a9",level:4},{value:"3\ufe0f\u20e3 \ud5c8\uc6a9\ub418\uc9c0 \uc54a\uc740 Content-Type \uc0ac\uc6a9",id:"3\ufe0f\u20e3-\ud5c8\uc6a9\ub418\uc9c0-\uc54a\uc740-content-type-\uc0ac\uc6a9",level:4},{value:"\u2705 Preflight Request\uc758 \ub3d9\uc791 \uacfc\uc815",id:"-preflight-request\uc758-\ub3d9\uc791-\uacfc\uc815",level:3},{value:"1\ufe0f\u20e3 \ube0c\ub77c\uc6b0\uc800\uac00 OPTIONS \uba54\uc11c\ub4dc\ub85c Preflight \uc694\uccad\uc744 \ubcf4\ub0c4",id:"1\ufe0f\u20e3-\ube0c\ub77c\uc6b0\uc800\uac00-options-\uba54\uc11c\ub4dc\ub85c-preflight-\uc694\uccad\uc744-\ubcf4\ub0c4",level:4},{value:"2\ufe0f\u20e3 \uc11c\ubc84\uac00 CORS \uc124\uc815\uc5d0 \ub530\ub77c \uc751\ub2f5",id:"2\ufe0f\u20e3-\uc11c\ubc84\uac00-cors-\uc124\uc815\uc5d0-\ub530\ub77c-\uc751\ub2f5",level:4},{value:"3\ufe0f\u20e3 \ube0c\ub77c\uc6b0\uc800\uac00 \ubcf8 \uc694\uccad(Actual Request) \ubcf4\ub0c4",id:"3\ufe0f\u20e3-\ube0c\ub77c\uc6b0\uc800\uac00-\ubcf8-\uc694\uccadactual-request-\ubcf4\ub0c4",level:4}];function d(e){const n={br:"br",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",hr:"hr",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,l.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"cors\ub780",children:"CORS\ub780?"})}),"\n",(0,i.jsx)(n.p,{children:"CORS(Cross Origin Resource Sharing)\ub294 \ucd9c\ucc98\uac00 \ub2e4\ub978 \uacf3\uc758 \ub9ac\uc18c\uc2a4\ub97c \uc694\uccad\ud560 \ub54c \uc811\uadfc \uad8c\ud55c\uc744 \ubd80\uc5ec\ud558\ub294 \uba54\ucee4\ub2c8\uc998\uc785\ub2c8\ub2e4. \ub9ac\uc18c\uc2a4\ub97c \uc8fc\uace0\ubc1b\ub294 \ub450 \uacf3\uc758 \ucd9c\ucc98\uac00 \ub2e4\ub974\uba74 \ucd9c\ucc98\uac00 \uad50\ucc28\ud55c\ub2e4\uace0 \ud569\ub2c8\ub2e4. \uc774\ub54c \ucd9c\ucc98\ub294 URL\ubfd0\ub9cc \uc544\ub2c8\ub77c \ud504\ub85c\ud1a0\ucf5c\uacfc \ud3ec\ud2b8\uae4c\uc9c0 \ud3ec\ud568\ub429\ub2c8\ub2e4. \ub9cc\uc57d \ud074\ub77c\uc774\uc5b8\ud2b8\uc758 \ucd9c\ucc98\uac00 \ud5c8\uc6a9\ub418\uc9c0 \uc54a\uc558\ub2e4\uba74 CORS \uc5d0\ub7ec\uac00 \ubc1c\uc0dd\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."}),"\n",(0,i.jsx)(n.h2,{id:"\ufe0f-cors\ub294-\uc65c-\ud544\uc694\ud558\uc9c0",children:"\u2714\ufe0f CORS\ub294 \uc65c \ud544\uc694\ud558\uc9c0?"}),"\n",(0,i.jsx)(n.p,{children:"\uacfc\uac70\uc5d0\ub294 \ud06c\ub85c\uc2a4 \uc0ac\uc774\ud2b8 \uc694\uccad \uc704\uc870(CSRF, Cross-Site Request Forgery) \ubb38\uc81c\uac00 \uc788\uc5c8\uc2b5\ub2c8\ub2e4. \ud53c\ud574\uc790\uc758 \ube0c\ub77c\uc6b0\uc800\uc5d0\uc11c \ub2e4\ub978 \uc560\ud50c\ub9ac\ucf00\uc774\uc158\uc73c\ub85c \uac00\uc9dc \ud074\ub77c\uc774\uc5b8\ud2b8 \uc694\uccad\uc744 \uc804\uc1a1\ud558\ub294 \uacf5\uaca9\uc785\ub2c8\ub2e4."}),"\n",(0,i.jsx)(n.p,{children:"CSRF\ub97c \uc608\ubc29\ud558\uae30 \uc704\ud574 \ube0c\ub77c\uc6b0\uc800\ub294 \ub3d9\uc77c \ucd9c\ucc98 \uc815\ucc45(SOP, same-origin policy)\uc744 \uad6c\ud604\ud588\uc2b5\ub2c8\ub2e4. SOP\uac00 \uad6c\ud604\ub41c \ube0c\ub77c\uc6b0\uc800\ub294 \ud074\ub77c\uc774\uc5b8\ud2b8\uc640 \ub3d9\uc77c\ud55c \ucd9c\ucc98\uc758 \ub9ac\uc18c\uc2a4\ub85c\ub9cc \uc694\uccad\uc744 \ubcf4\ub0bc \uc218 \uc788\uc2b5\ub2c8\ub2e4."}),"\n",(0,i.jsx)(n.p,{children:"\ud558\uc9c0\ub9cc, SOP\ub294 \ud55c\uacc4\uac00 \uc788\uc2b5\ub2c8\ub2e4. \ud604\ub300\uc758 \uc6f9 \uc560\ud50c\ub9ac\ucf00\uc774\uc158\uc740 \ub2e4\ub978 \ucd9c\ucc98\uc758 \ub9ac\uc18c\uc2a4\ub97c \uc0ac\uc6a9\ud558\ub294 \uacbd\uc6b0\uac00 \ub9ce\uae30 \ub54c\ubb38\uc785\ub2c8\ub2e4. \ub530\ub77c\uc11c, SOP\ub97c \ud655\uc7a5\ud55c CORS\uac00 \ud544\uc694\ud569\ub2c8\ub2e4."}),"\n",(0,i.jsx)(n.h2,{id:"\ufe0f-cors\ub294-\uc5b4\ub5bb\uac8c-\uc791\ub3d9\ud560\uae4c\uc694-",children:"\u2714\ufe0f CORS\ub294 \uc5b4\ub5bb\uac8c \uc791\ub3d9\ud560\uae4c\uc694? \ud83e\udd14"}),"\n",(0,i.jsx)(n.p,{children:"\ube0c\ub77c\uc6b0\uc800\uac00 \uc694\uccad \uba54\uc2dc\uc9c0\uc5d0 Origin \ud5e4\ub354\uc640 \uc751\ub2f5 \uba54\uc2dc\uc9c0\uc758 Access-Control-Allow-Origin \ud5e4\ub354\ub97c \ube44\uad50\ud574\uc11c CORS\ub97c \uc704\ubc18\ud558\ub294\uc9c0 \ud655\uc778\ud569\ub2c8\ub2e4. \uc774\ub54c, Origin\uc5d0\ub294 \ud604\uc7ac \uc694\uccad\ud558\ub294 \ud074\ub77c\uc774\uc5b8\ud2b8\uc758 \ucd9c\ucc98(\ud504\ub85c\ud1a0\ucf5c, \ub3c4\uba54\uc778, \ud3ec\ud2b8)\uac00, Access-Control-Allow-Origin\uc740 \ub9ac\uc18c\uc2a4 \uc694\uccad\uc744 \ud5c8\uc6a9\ud558\ub294 \ucd9c\ucc98\uac00 \uc791\uc131\ub429\ub2c8\ub2e4."}),"\n",(0,i.jsxs)(n.p,{children:["\uc774\ub807\uac8c \ub2e8\uc21c\ud558\uac8c \uc694\uccad\ud558\ub294 \uac83\uc744 ",(0,i.jsx)(n.strong,{children:"Simple Request"}),"\ub77c\uace0 \ud569\ub2c8\ub2e4. ",(0,i.jsx)(n.strong,{children:"Simple Request"}),"\uc740 \uc694\uccad \uba54\uc11c\ub4dc(GET, POST, HEAD), \uc218\ub3d9\uc73c\ub85c \uc124\uc815\ud55c \uc694\uccad \ud5e4\ub354(Accept, Accept-Language, Content-Language, Content-Type, Range), Content-Type \ud5e4\ub354(application/x-www-form-urlencoded, multipart/form-data, text/plain)\uc778 \uacbd\uc6b0\uc5d0\ub9cc \ud574\ub2f9\ud569\ub2c8\ub2e4."]}),"\n",(0,i.jsxs)(n.p,{children:["\ube0c\ub77c\uc6b0\uc800\uac00 \uc0ac\uc804 \uc694\uccad\uc744 \ubcf4\ub0b4\ub294 \uacbd\uc6b0\ub3c4 \uc788\uc2b5\ub2c8\ub2e4. \uc774\ub54c \uc0ac\uc804 \uc694\uccad\uc744 ",(0,i.jsx)(n.strong,{children:"Preflight Request"}),"\ub77c\uace0 \ud569\ub2c8\ub2e4. \ube0c\ub77c\uc6b0\uc800\uac00 \ubcf8 \uc694\uccad\uc744 \ubcf4\ub0b4\uae30 \uc774\uc804, ",(0,i.jsx)(n.strong,{children:"Preflight Request"}),"\ub97c ",(0,i.jsx)("mark",{children:"OPTIONS \uba54\uc11c\ub4dc"}),"\ub85c \uc694\uccad\uc744 \ubcf4\ub0b4\uc5b4 \uc2e4\uc81c \uc694\uccad\uc774 \uc548\uc804\ud55c\uc9c0 \ud655\uc778\ud569\ub2c8\ub2e4."]}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Preflight Request"}),"\ub294 \ucd94\uac00\ub85c Access-Control-Request-Method\ub85c \uc2e4 \uc694\uccad \uba54\uc11c\ub4dc\uc640, Access-Control-Request-Headers \ud5e4\ub354\uc5d0 \uc2e4 \uc694\uccad\uc758 \ucd94\uac00 \ud5e4\ub354 \ubaa9\ub85d\uc744 \ub2f4\uc544\uc11c \ubcf4\ub0b4\uc57c \ud569\ub2c8\ub2e4."]}),"\n",(0,i.jsx)(n.p,{children:"\uc774\uc5d0 \ub300\ud55c \uc751\ub2f5\uc740 \ub300\uc751\ub418\ub294 Access-Control-Allow-Methods\uc640 Access-Control-Headers\ub97c \ubcf4\ub0b4\uc57c \ud558\uace0, Preflight Request\ub85c \uc778\ud55c \ucd94\uac00 \uc694\uccad\uc744 \uc904\uc774\uae30 \uc704\ud574 \uce90\uc2dc \uae30\uac04\uc744 Access-Control-Max-Age\uc5d0 \ub2f4\uc544\uc11c \ubcf4\ub0b4\uc57c \ud569\ub2c8\ub2e4."}),"\n",(0,i.jsxs)(n.p,{children:["\ub610\ud55c \uc778\uc99d\ub41c \uc694\uccad\uc744 \uc0ac\uc6a9\ud558\ub294 \ubc29\uc2dd\ub3c4 \uc788\ub294\ub370\uc694. \uc774\ub97c ",(0,i.jsx)(n.strong,{children:"Credential Request"}),"\ub77c\uace0 \ud569\ub2c8\ub2e4. \ucfe0\ud0a4\ub098 \ud1a0\ud070\uacfc \uac19\uc740 \uc778\uc99d \uc815\ubcf4\ub97c \ud3ec\ud568\ud55c \uc694\uccad\uc740 \ub354\uc6b1 \uc548\uc804\ud558\uac8c \ucc98\ub9ac\ub418\uc5b4\uc57c \ud569\ub2c8\ub2e4. \uc774\ub54c ",(0,i.jsx)(n.strong,{children:"Credential Request"}),"\ub97c \uc218\ud589\ud569\ub2c8\ub2e4."]}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Credential Request"}),"\ub97c \uc694\uccad\ud558\ub294 \uacbd\uc6b0\uc5d0\ub294 \uc11c\ubc84\uc5d0\uc11c\ub294 Access-Control-Allow-Credentials\ub97c true\ub85c \uc124\uc815\ud574\uc57c \ud558\uba70 Access-Control-Allow-Origin\uc5d0 \uc640\uc77c\ub4dc\uce74\ub4dc\ub97c \uc0ac\uc6a9\ud558\uc9c0 \ubabb\ud569\ub2c8\ub2e4."]}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsx)(n.h3,{id:"-simple-request\ub780",children:"\u2705 Simple Request\ub780?"}),"\n",(0,i.jsx)(n.p,{children:"Simple Request\ub294 \uc6f9 \ube0c\ub77c\uc6b0\uc800\uc5d0\uc11c CORS (Cross-Origin Resource Sharing) \uc815\ucc45\uc5d0 \ub530\ub77c \ubd84\ub958\ub418\ub294 HTTP \uc694\uccad \uc720\ud615 \uc911 \ud558\ub098\uc785\ub2c8\ub2e4."}),"\n",(0,i.jsxs)(n.p,{children:["\u27a1 \uc989, \ube0c\ub77c\uc6b0\uc800\uac00 \uc0ac\uc804 \uc694\uccad(Preflight Request) \uc5c6\uc774 \ubc14\ub85c \uc11c\ubc84\uc5d0 \ubcf4\ub0b4\ub294 \uc694\uccad\uc744 \uc758\ubbf8\ud569\ub2c8\ub2e4.",(0,i.jsx)(n.br,{}),"\n","\u27a1 \ube0c\ub77c\uc6b0\uc800\uac00 \ubcf4\uc548\uc744 \uc704\ud574 CORS \uc815\ucc45\uc744 \uc801\uc6a9\ud560 \ub54c, \uc870\uac74\uc744 \ub9cc\uc871\ud558\uba74 Preflight \uc5c6\uc774 \uc694\uccad\uc744 \ubc14\ub85c \ubcf4\ub0bc \uc218 \uc788\uc74c."]}),"\n",(0,i.jsx)(n.h3,{id:"-simple-request\uc758-\uc870\uac74",children:"\u2705 Simple Request\uc758 \uc870\uac74"}),"\n",(0,i.jsx)(n.p,{children:"CORS \uaddc\uce59\uc5d0 \ub530\ub77c, \uc694\uccad\uc774 Simple Request\ub85c \uc778\uc815\ub418\ub824\uba74 \ub2e4\uc74c \uc870\uac74\uc744 \ucda9\uc871\ud574\uc57c \ud569\ub2c8\ub2e4."}),"\n",(0,i.jsx)(n.h4,{id:"1\ufe0f\u20e3-\ud5c8\uc6a9\ub41c-http-\uba54\uc11c\ub4dc\ub9cc-\uc0ac\uc6a9\ud574\uc57c-\ud568",children:"1\ufe0f\u20e3 \ud5c8\uc6a9\ub41c HTTP \uba54\uc11c\ub4dc\ub9cc \uc0ac\uc6a9\ud574\uc57c \ud568"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"GET"}),"\n",(0,i.jsx)(n.li,{children:"POST"}),"\n",(0,i.jsx)(n.li,{children:"HEAD"}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["\u27a1 \uc774 \uc138 \uac00\uc9c0 \uba54\uc11c\ub4dc\ub9cc \uc0ac\uc6a9 \uac00\ub2a5.",(0,i.jsx)(n.br,{}),"\n","\u27a1 PUT, DELETE, PATCH \ub4f1\uc740 Simple Request\uac00 \uc544\ub2c8\ub77c Preflight \uc694\uccad\uc774 \ud544\uc694\ud568."]}),"\n",(0,i.jsx)(n.h4,{id:"2\ufe0f\u20e3-\ud5c8\uc6a9\ub41c-http-\ud5e4\ub354\ub9cc-\ud3ec\ud568\ud574\uc57c-\ud568",children:"2\ufe0f\u20e3 \ud5c8\uc6a9\ub41c HTTP \ud5e4\ub354\ub9cc \ud3ec\ud568\ud574\uc57c \ud568"}),"\n",(0,i.jsx)(n.p,{children:"Simple Request\uc5d0\uc11c\ub294 \ub2e4\uc74c \ud5e4\ub354\ub9cc \uc0ac\uc6a9\ud560 \uc218 \uc788\uc74c:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Accept"}),"\n",(0,i.jsx)(n.li,{children:"Accept-Language"}),"\n",(0,i.jsx)(n.li,{children:"Content-Language"}),"\n",(0,i.jsx)(n.li,{children:"Content-Type (application/x-www-form-urlencoded, multipart/form-data, text/plain\ub9cc \ud5c8\uc6a9\ub428)"}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"\ud83d\udea8 \uc911\uc694"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Authorization, Custom-Header \uac19\uc740 \uc0ac\uc6a9\uc790 \uc815\uc758 \ud5e4\ub354\uac00 \ud3ec\ud568\ub418\uba74 Simple Request\uac00 \uc544\ub2d8."}),"\n",(0,i.jsx)(n.li,{children:"Content-Type\uc774 application/json\uc774\uba74 Simple Request\uac00 \uc544\ub2d8! (Preflight \uc694\uccad \ud544\uc694)"}),"\n"]}),"\n",(0,i.jsx)(n.h4,{id:"3\ufe0f\u20e3-\uc694\uccad\uc5d0-xmlhttprequestwithcredentials--true\uac00-\uc5c6\uc5b4\uc57c-\ud568",children:"3\ufe0f\u20e3 \uc694\uccad\uc5d0 XMLHttpRequest.withCredentials = true\uac00 \uc5c6\uc5b4\uc57c \ud568"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"\ucfe0\ud0a4\ub098 \uc778\uc99d \uc815\ubcf4\ub97c \ud3ec\ud568\ud558\ub294 \uc694\uccad\uc740 Simple Request\uac00 \uc544\ub2d8 (Preflight \uc694\uccad \ud544\uc694)."}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"-simple-request-\uc608\uc2dc",children:"\u2705 Simple Request \uc608\uc2dc"}),"\n",(0,i.jsx)(n.p,{children:"\ud83d\udccc (1) Simple Request \uc608\uc81c - GET \uc694\uccad"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-http",metastring:"request",children:"GET /api/data HTTP/1.1\nHost: example.com\nAccept: application/json\n"})}),"\n",(0,i.jsx)(n.p,{children:"\u2714 \uc694\uccad \uc870\uac74 \ucda9\uc871"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"\uba54\uc11c\ub4dc: GET (\u2705 \ud5c8\uc6a9\ub428)"}),"\n",(0,i.jsx)(n.li,{children:"\ucd94\uac00 \ud5e4\ub354 \uc5c6\uc74c (\u2705 \ud5c8\uc6a9\ub428)"}),"\n",(0,i.jsx)(n.li,{children:"\ucfe0\ud0a4 \uc5c6\uc74c (\u2705 \ud5c8\uc6a9\ub428)"}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"\u27a1 \uc774 \uc694\uccad\uc740 Simple Request\ub85c \ucc98\ub9ac\ub428."}),"\n",(0,i.jsx)(n.p,{children:"\ud83d\udccc (2) Simple Request \uc608\uc81c - POST \uc694\uccad"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-http",metastring:"request",children:"POST /api/login HTTP/1.1\nHost: example.com\nContent-Type: application/x-www-form-urlencoded\n"})}),"\n",(0,i.jsx)(n.p,{children:"\u2714 \uc694\uccad \uc870\uac74 \ucda9\uc871"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"\uba54\uc11c\ub4dc: POST (\u2705 \ud5c8\uc6a9\ub428)"}),"\n",(0,i.jsx)(n.li,{children:"Content-Type: application/x-www-form-urlencoded (\u2705 \ud5c8\uc6a9\ub428)"}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"\u27a1 \uc774 \uc694\uccad\ub3c4 Simple Request\ub85c \ucc98\ub9ac\ub428."}),"\n",(0,i.jsx)(n.p,{children:"\u2705 Simple Request\uac00 \uc544\ub2cc \uacbd\uc6b0 (Preflight \uc694\uccad \ubc1c\uc0dd)"}),"\n",(0,i.jsx)(n.p,{children:"\u274c (1) Content-Type: application/json \uc0ac\uc6a9"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-http",metastring:"request",children:"POST /api/data HTTP/1.1\nHost: example.com\nContent-Type: application/json\n"})}),"\n",(0,i.jsx)(n.p,{children:"\ud83d\udea8 Simple Request \uc544\ub2d8! (Preflight \ud544\uc694)"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Content-Type: application/json\uc740 CORS\uc5d0\uc11c \ud5c8\uc6a9\ub418\uc9c0 \uc54a\ub294 \uae30\ubcf8 \ud0c0\uc785\uc774\ubbc0\ub85c Preflight \uc694\uccad\uc774 \ubc1c\uc0dd\ud568."}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"\u274c (2) Authorization \ud5e4\ub354 \ud3ec\ud568"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-http",metastring:"request",children:"GET /api/data HTTP/1.1\nHost: example.com\nAuthorization: Bearer abc123\n"})}),"\n",(0,i.jsx)(n.p,{children:"\ud83d\udea8 Simple Request \uc544\ub2d8! (Preflight \ud544\uc694)"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Authorization \ud5e4\ub354\ub294 Simple Request\uc5d0\uc11c \ud5c8\uc6a9\ub418\uc9c0 \uc54a\uc74c."}),"\n"]}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsx)(n.h3,{id:"-preflight-request\ub780",children:"\u2705 Preflight Request\ub780?"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Preflight Request(\uc0ac\uc804 \uc694\uccad)"})," \uc740 CORS (Cross-Origin Resource Sharing) \uc815\ucc45\uc5d0 \uc758\ud574 \ubc1c\uc0dd\ud558\ub294 HTTP \uc694\uccad\uc785\ub2c8\ub2e4."]}),"\n",(0,i.jsx)(n.p,{children:"\u27a1 \ube0c\ub77c\uc6b0\uc800\uac00 \ubcf4\uc548\uc0c1\uc758 \uc774\uc720\ub85c \uc2e4\uc81c \uc694\uccad\uc744 \ubcf4\ub0b4\uae30 \uc804\uc5d0, \uc11c\ubc84\uac00 \ud574\ub2f9 \uc694\uccad\uc744 \ud5c8\uc6a9\ud558\ub294\uc9c0 \ubbf8\ub9ac \ud655\uc778\ud558\ub294 \uacfc\uc815\uc785\ub2c8\ub2e4."}),"\n",(0,i.jsx)(n.p,{children:"\uc989,"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"\ube0c\ub77c\uc6b0\uc800\uac00 \uc2e4\uc81c \uc694\uccad\uc744 \ubcf4\ub0b4\uae30 \uc804\uc5d0 OPTIONS \uba54\uc11c\ub4dc\ub85c \uba3c\uc800 \uc11c\ubc84\uc5d0 \ud5c8\uc6a9 \uc5ec\ubd80\ub97c \ud655\uc778\ud568."}),"\n",(0,i.jsx)(n.li,{children:"\uc11c\ubc84\uac00 \u201c\uc774 \uc694\uccad \ud5c8\uc6a9\ud560\uac8c!\u201c\ub77c\uace0 \uc751\ub2f5\ud558\uba74, \uadf8\uc81c\uc57c \ube0c\ub77c\uc6b0\uc800\uac00 \ubcf8 \uc694\uccad(Actual Request)\uc744 \ubcf4\ub0c4."}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"-preflight-request\uac00-\ud544\uc694\ud55c-\uacbd\uc6b0",children:"\u2705 Preflight Request\uac00 \ud544\uc694\ud55c \uacbd\uc6b0"}),"\n",(0,i.jsx)(n.p,{children:"\ud83d\udccc \uc544\ub798 \uc870\uac74 \uc911 \ud558\ub098\ub77c\ub3c4 \ub9cc\uc871\ud558\uba74 Preflight \uc694\uccad\uc774 \ubc1c\uc0dd\ud569\ub2c8\ub2e4."}),"\n",(0,i.jsx)(n.h4,{id:"1\ufe0f\u20e3-\ud5c8\uc6a9\ub418\uc9c0-\uc54a\uc740-http-\uba54\uc11c\ub4dc-\uc0ac\uc6a9",children:"1\ufe0f\u20e3 \ud5c8\uc6a9\ub418\uc9c0 \uc54a\uc740 HTTP \uba54\uc11c\ub4dc \uc0ac\uc6a9"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"GET, POST, HEAD \uc678\uc758 \uba54\uc11c\ub4dc (PUT, DELETE, PATCH, OPTIONS \ub4f1)\ub97c \uc0ac\uc6a9\ud560 \uacbd\uc6b0."}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"\ud83d\udccc \uc608\uc2dc (Preflight \uc694\uccad \ubc1c\uc0dd!)"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-http",metastring:"request",children:"DELETE /api/delete-user HTTP/1.1\nHost: example.com\n"})}),"\n",(0,i.jsx)(n.p,{children:"\u27a1 DELETE\ub294 Simple Request \uc870\uac74\uc744 \ub9cc\uc871\ud558\uc9c0 \uc54a\uc74c \u2192 Preflight \ud544\uc694!"}),"\n",(0,i.jsx)(n.h4,{id:"2\ufe0f\u20e3-\ud5c8\uc6a9\ub418\uc9c0-\uc54a\uc740-\ud5e4\ub354-\uc0ac\uc6a9",children:"2\ufe0f\u20e3 \ud5c8\uc6a9\ub418\uc9c0 \uc54a\uc740 \ud5e4\ub354 \uc0ac\uc6a9"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Authorization, X-Custom-Header, X-Requested-With \ub4f1 \ube0c\ub77c\uc6b0\uc800\uac00 \uae30\ubcf8\uc801\uc73c\ub85c \ud5c8\uc6a9\ud558\uc9c0 \uc54a\ub294 \ud5e4\ub354\ub97c \ud3ec\ud568\ud558\uba74 Preflight \uc694\uccad \ubc1c\uc0dd."}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"\ud83d\udccc \uc608\uc2dc (Preflight \uc694\uccad \ubc1c\uc0dd!)"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-http",metastring:"request",children:"POST /api/data HTTP/1.1\nHost: example.com\nContent-Type: application/json\nAuthorization: Bearer abc123\n"})}),"\n",(0,i.jsx)(n.p,{children:"\u27a1 Authorization \ud5e4\ub354\ub294 \uae30\ubcf8\uc801\uc73c\ub85c \ud5c8\uc6a9\ub418\uc9c0 \uc54a\uc74c \u2192 Preflight \ud544\uc694!"}),"\n",(0,i.jsx)(n.h4,{id:"3\ufe0f\u20e3-\ud5c8\uc6a9\ub418\uc9c0-\uc54a\uc740-content-type-\uc0ac\uc6a9",children:"3\ufe0f\u20e3 \ud5c8\uc6a9\ub418\uc9c0 \uc54a\uc740 Content-Type \uc0ac\uc6a9"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Content-Type\uc774 \ub2e4\uc74c \uc911 \ud558\ub098\uac00 \uc544\ub2c8\uba74 Preflight \uc694\uccad\uc774 \ubc1c\uc0dd:"}),"\n",(0,i.jsx)(n.li,{children:"application/x-www-form-urlencoded"}),"\n",(0,i.jsx)(n.li,{children:"multipart/form-data"}),"\n",(0,i.jsx)(n.li,{children:"text/plain"}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"\ud83d\udccc \uc608\uc2dc (Preflight \uc694\uccad \ubc1c\uc0dd!)"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-http",metastring:"request",children:"POST /api/data HTTP/1.1\nHost: example.com\nContent-Type: application/json\n"})}),"\n",(0,i.jsx)(n.p,{children:"\u27a1 Content-Type: application/json\uc740 \uae30\ubcf8 \ud5c8\uc6a9\ub418\uc9c0 \uc54a\uc74c \u2192 Preflight \ud544\uc694!"}),"\n",(0,i.jsx)(n.h3,{id:"-preflight-request\uc758-\ub3d9\uc791-\uacfc\uc815",children:"\u2705 Preflight Request\uc758 \ub3d9\uc791 \uacfc\uc815"}),"\n",(0,i.jsx)(n.h4,{id:"1\ufe0f\u20e3-\ube0c\ub77c\uc6b0\uc800\uac00-options-\uba54\uc11c\ub4dc\ub85c-preflight-\uc694\uccad\uc744-\ubcf4\ub0c4",children:"1\ufe0f\u20e3 \ube0c\ub77c\uc6b0\uc800\uac00 OPTIONS \uba54\uc11c\ub4dc\ub85c Preflight \uc694\uccad\uc744 \ubcf4\ub0c4"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-http",metastring:"request",children:"OPTIONS /api/data HTTP/1.1\nHost: example.com\nOrigin: https://my-frontend.com\nAccess-Control-Request-Method: POST\nAccess-Control-Request-Headers: Authorization, Content-Type\n"})}),"\n",(0,i.jsx)(n.p,{children:"\u27a1 \uc11c\ubc84\uc5d0\uac8c \u201c\uc774 \uc694\uccad \ud574\ub3c4 \ub3fc?\u201c\ub77c\uace0 \ubb3c\uc5b4\ubcf4\ub294 \ub2e8\uacc4"}),"\n",(0,i.jsx)(n.h4,{id:"2\ufe0f\u20e3-\uc11c\ubc84\uac00-cors-\uc124\uc815\uc5d0-\ub530\ub77c-\uc751\ub2f5",children:"2\ufe0f\u20e3 \uc11c\ubc84\uac00 CORS \uc124\uc815\uc5d0 \ub530\ub77c \uc751\ub2f5"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-http",metastring:"request",children:"HTTP/1.1 200 OK\nAccess-Control-Allow-Origin: https://my-frontend.com\nAccess-Control-Allow-Methods: GET, POST, PUT, DELETE\nAccess-Control-Allow-Headers: Authorization, Content-Type\nAccess-Control-Max-Age: 3600\n"})}),"\n",(0,i.jsxs)(n.p,{children:["\u2714 Access-Control-Allow-Methods \u2192 \uc11c\ubc84\uac00 \ud5c8\uc6a9\ud558\ub294 HTTP \uba54\uc11c\ub4dc",(0,i.jsx)(n.br,{}),"\n","\u2714 Access-Control-Allow-Headers \u2192 \uc11c\ubc84\uac00 \ud5c8\uc6a9\ud558\ub294 \uc694\uccad \ud5e4\ub354",(0,i.jsx)(n.br,{}),"\n","\u2714 Access-Control-Allow-Origin \u2192 \ud2b9\uc815 Origin\uc5d0\uc11c \uc694\uccad \ud5c8\uc6a9",(0,i.jsx)(n.br,{}),"\n","\u2714 Access-Control-Max-Age \u2192 Preflight \uacb0\uacfc\ub97c \uce90\uc2dc\ud558\ub294 \uc2dc\uac04 (3600\ucd08 = 1\uc2dc\uac04)"]}),"\n",(0,i.jsx)(n.h4,{id:"3\ufe0f\u20e3-\ube0c\ub77c\uc6b0\uc800\uac00-\ubcf8-\uc694\uccadactual-request-\ubcf4\ub0c4",children:"3\ufe0f\u20e3 \ube0c\ub77c\uc6b0\uc800\uac00 \ubcf8 \uc694\uccad(Actual Request) \ubcf4\ub0c4"}),"\n",(0,i.jsx)(n.p,{children:"\u2714 \uc11c\ubc84\uac00 \ud5c8\uc6a9\ud558\uba74 \uc774\uc81c\uc57c \ube0c\ub77c\uc6b0\uc800\uac00 \ubcf8 \uc694\uccad\uc744 \ubcf4\ub0bc \uc218 \uc788\uc74c!"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-http",metastring:"request",children:"POST /api/data HTTP/1.1\nHost: example.com\nOrigin: https://my-frontend.com\nAuthorization: Bearer abc123\nContent-Type: application/json\n"})})]})}function a(e={}){const{wrapper:n}={...(0,l.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},8453:(e,n,s)=>{s.d(n,{R:()=>r,x:()=>c});var t=s(6540);const i={},l=t.createContext(i);function r(e){const n=t.useContext(l);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),t.createElement(l.Provider,{value:n},e.children)}}}]);