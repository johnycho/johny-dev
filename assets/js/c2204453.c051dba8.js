(self.webpackChunkjohnycho_dev=self.webpackChunkjohnycho_dev||[]).push([[446],{4753:(e,t,n)=>{"use strict";n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>s,default:()=>f,frontMatter:()=>c,metadata:()=>r,toc:()=>u});var r=n(2967),i=n(4848),o=n(8453),a=n(5363);const c={slug:"johny-dev-blog-launched",title:"\ud83c\udf89 \uac1c\ubc1c \ube14\ub85c\uadf8 \uc624\ud508 \ud83c\udf89",authors:["johnycho"],tags:["hello"]},s=void 0,l={authorsImageUrls:[void 0]},u=[{value:"\u2714\ufe0f\ufe0f Glorious Demo with TypeScript",id:"heavy_check_mark\ufe0f-glorious-demo-with-typescript",level:2},{value:"\u2714\ufe0f Javascript \ucf54\ub4dc \ube14\ub7ed",id:"heavy_check_mark-javascript-\ucf54\ub4dc-\ube14\ub7ed",level:2},{value:"\u2714\ufe0f Java \ucf54\ub4dc \ube14\ub7ed",id:"heavy_check_mark-java-\ucf54\ub4dc-\ube14\ub7ed",level:2},{value:"\u2714\ufe0f Task List",id:"heavy_check_mark-task-list",level:2},{value:"\u2714\ufe0f Using Emoji Shortcodes",id:"heavy_check_mark-using-emoji-shortcodes",level:2},{value:"\u2714\ufe0f Highlight",id:"heavy_check_mark-highlight",level:2},{value:"\u2714\ufe0f Table",id:"heavy_check_mark-table",level:2}];function p(e){const t={code:"code",h1:"h1",h2:"h2",hr:"hr",input:"input",li:"li",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,o.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.hr,{}),"\n",(0,i.jsx)(t.h1,{id:"\ud14c\uc2a4\ud2b8-\ub9c8\ud06c-\ub2e4\uc6b4-\ubb38\uc11c\ub97c-\uc791\uc131\ud574\ubd05\ub2c8\ub2e4",children:"\ud14c\uc2a4\ud2b8 \ub9c8\ud06c \ub2e4\uc6b4 \ubb38\uc11c\ub97c \uc791\uc131\ud574\ubd05\ub2c8\ub2e4.."}),"\n",(0,i.jsxs)(t.h2,{id:"heavy_check_mark\ufe0f-glorious-demo-with-typescript",children:["\u2714\ufe0f","\ufe0f Glorious Demo with TypeScript"]}),"\n",(0,i.jsx)(t.hr,{}),"\n",(0,i.jsxs)(t.p,{children:["\uc544\ub798\ub294 ",(0,i.jsx)(t.code,{children:"glorious-demo"}),"\ub97c \uc774\uc6a9\ud55c \uc5d0\ub514\ud130 + \ud130\ubbf8\ub110 \uc560\ub2c8\uba54\uc774\uc158 \uc608\uc81c\uc785\ub2c8\ub2e4."]}),"\n",(0,i.jsx)(a.A,{fallback:(0,i.jsx)(t.p,{children:"Loading terminal..."}),children:()=>{const e=n(5367).A;return(0,i.jsx)(e,{code:'\nfunction greet(){\nconsole.log("Hello World!");\n}\n\ngreet();\n',command:"node ./demo",response:"Hello World!"})}}),"\n",(0,i.jsx)("br",{}),"\n",(0,i.jsx)("br",{}),"\n",(0,i.jsx)("br",{}),"\n",(0,i.jsx)("br",{}),"\n",(0,i.jsx)("br",{}),"\n",(0,i.jsx)("br",{}),"\n",(0,i.jsxs)(t.h2,{id:"heavy_check_mark-javascript-\ucf54\ub4dc-\ube14\ub7ed",children:["\u2714\ufe0f"," Javascript \ucf54\ub4dc \ube14\ub7ed"]}),"\n",(0,i.jsx)(t.hr,{}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-js",children:"<button onClick={() => alert('button clicked!')}>Click me!</button>\n"})}),"\n",(0,i.jsxs)(t.h2,{id:"heavy_check_mark-java-\ucf54\ub4dc-\ube14\ub7ed",children:["\u2714\ufe0f"," Java \ucf54\ub4dc \ube14\ub7ed"]}),"\n",(0,i.jsx)(t.hr,{}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-java",children:'package com.nhn.meta.banword.application;\n\nimport java.util.Arrays;\nimport java.util.Collections;\nimport java.util.Map;\nimport java.util.stream.Collectors;\n\npublic class Solution {\n\n  public static void main(String[] args) {\n// \ud14c\uc2a4\ud2b8 \ucf00\uc774\uc2a4 \uc2e4\ud589 \ubc0f \uacb0\uacfc \ucd9c\ub825\n    System.out.println("Test Case 1 Result: " + solution(2, "1A 2F 1C") + " (Expected: 2)");\n    System.out.println("Test Case 2 Result: " + solution(3, "") + " (Expected: 6)");\n    System.out.println(\n        "Test Case 3 Result: " + solution(1, "1A 1B 1C 1D 1E 1F 1G 1H 1J 1K") + " (Expected: 0)");\n    System.out.println(\n        "Test Case 4 Result: " + solution(50, "1A 3C 2B 20G 5A 7K 40D 50H") + " (Expected: 95)");\n    System.out.println(\n        "Test Case 5 Result: " + solution(2, "1A 1C 1D 1F 1G 1J 2C 2H") + " (Expected: 1)");\n    System.out.println(\n        "Test Case 6 Result: " + solution(22, "1A 3C 2B 20G 5A") + " (Expected: 41)");\n  }\n\n  public static int solution(int N, String S) {\n    final Map<String, Boolean> reserved = splitStringToMap(S);\n\n    int maxFamilies = 0;\n\n    for (int row = 1; row <= N; row++) {\n      boolean leftAndCenter =\n          !reserved.containsKey(row + "B") &&\n              !reserved.containsKey(row + "C") &&\n              !reserved.containsKey(row + "D") &&\n              !reserved.containsKey(row + "E");\n\n      boolean centerOnly =\n          !reserved.containsKey(row + "D") &&\n              !reserved.containsKey(row + "E") &&\n              !reserved.containsKey(row + "F") &&\n              !reserved.containsKey(row + "G");\n\n      boolean centerAndRight =\n          !reserved.containsKey(row + "F") &&\n              !reserved.containsKey(row + "G") &&\n              !reserved.containsKey(row + "H") &&\n              !reserved.containsKey(row + "J");\n\n      int familiesAdded = 0; // \ub514\ubc84\uae45\uc6a9 \ucd94\uac00\n      if (leftAndCenter) {\n        maxFamilies++;\n        familiesAdded++;\n      }\n\n      if (centerAndRight) {\n        maxFamilies++;\n        familiesAdded++;\n      }\n\n      if (!leftAndCenter && !centerAndRight && centerOnly) {\n        maxFamilies++;\n        familiesAdded++;\n      }\n\n      // \ud589\ubcc4\ub85c \ucd94\uac00\ub41c \uac00\uc871 \uc218 \ucd9c\ub825\n      System.out.printf(\n          "Row %d: leftAndCenter=%b, centerOnly=%b, centerAndRight=%b, Families added=%d\\n",\n          row, leftAndCenter, centerOnly, centerAndRight, familiesAdded);\n    }\n\n    return maxFamilies;\n  }\n\n  public static Map<String, Boolean> splitStringToMap(String s) {\n    if (s == null || s.trim().isEmpty()) {\n      return Collections.emptyMap(); // \ubb38\uc790\uc5f4\uc774 \ube44\uc5b4\uc788\uc73c\uba74 \ube48 \ub9f5 \ubc18\ud658\n    }\n\n    // \uacf5\ubc31 \uae30\uc900\uc73c\ub85c \ub098\ub208 \ud6c4, \uac01 \ub2e8\uc5b4\ub97c \ud0a4\ub85c, \ub2e8\uc5b4\uc758 \uae38\uc774\ub97c \uac12\uc73c\ub85c \ub9f5\uc5d0 \uc800\uc7a5\n    return Arrays.stream(s.split("\\\\s+")) // \uacf5\ubc31 \uae30\uc900\uc73c\ub85c \ubb38\uc790\uc5f4 \ubd84\ub9ac\n        .filter(word -> !word.isEmpty()) // \ube44\uc5b4 \uc788\ub294 \ubb38\uc790\uc5f4 \uc81c\uac70\n        .collect(Collectors.toMap(word -> word, word -> true));\n  }\n}\n'})}),"\n",(0,i.jsxs)(t.h2,{id:"heavy_check_mark-task-list",children:["\u2714\ufe0f"," Task List"]}),"\n",(0,i.jsx)(t.hr,{}),"\n",(0,i.jsxs)(t.ul,{className:"contains-task-list",children:["\n",(0,i.jsxs)(t.li,{className:"task-list-item",children:[(0,i.jsx)(t.input,{type:"checkbox",checked:!0,disabled:!0})," ","Write the press release"]}),"\n",(0,i.jsxs)(t.li,{className:"task-list-item",children:[(0,i.jsx)(t.input,{type:"checkbox",disabled:!0})," ","Update the website"]}),"\n",(0,i.jsxs)(t.li,{className:"task-list-item",children:[(0,i.jsx)(t.input,{type:"checkbox",disabled:!0})," ","Contact the media"]}),"\n"]}),"\n",(0,i.jsxs)(t.h2,{id:"heavy_check_mark-using-emoji-shortcodes",children:["\u2714\ufe0f"," Using Emoji Shortcodes"]}),"\n",(0,i.jsx)(t.hr,{}),"\n",(0,i.jsxs)(t.p,{children:["Gone camping! ","\u26fa"," Be back soon."]}),"\n",(0,i.jsxs)(t.p,{children:["That is so funny! ","\ud83d\ude02"]}),"\n",(0,i.jsxs)(t.h2,{id:"heavy_check_mark-highlight",children:["\u2714\ufe0f"," Highlight"]}),"\n",(0,i.jsx)(t.hr,{}),"\n",(0,i.jsxs)(t.p,{children:["I need to highlight these ",(0,i.jsx)("mark",{children:"very important words"}),"."]}),"\n",(0,i.jsxs)(t.h2,{id:"heavy_check_mark-table",children:["\u2714\ufe0f"," Table"]}),"\n",(0,i.jsx)(t.hr,{}),"\n",(0,i.jsxs)(t.table,{children:[(0,i.jsx)(t.thead,{children:(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.th,{children:"Syntax"}),(0,i.jsx)(t.th,{children:"Description"})]})}),(0,i.jsxs)(t.tbody,{children:[(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Header"}),(0,i.jsx)(t.td,{children:"Title"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Paragraph"}),(0,i.jsx)(t.td,{children:"Text"})]})]})]})]})}function f(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(p,{...e})}):p(e)}},5310:e=>{window,e.exports=function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=18)}([function(e,t,n){window,e.exports=function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=10)}([function(e,t,n){"use strict";var r,i,o,a=n(3),c="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";function s(){o=!1}function l(e){if(e){if(e!==r){if(e.length!==c.length)throw new Error("Custom alphabet for shortid must be "+c.length+" unique characters. You submitted "+e.length+" characters: "+e);var t=e.split("").filter((function(e,t,n){return t!==n.lastIndexOf(e)}));if(t.length)throw new Error("Custom alphabet for shortid must be "+c.length+" unique characters. These characters were not unique: "+t.join(", "));r=e,s()}}else r!==c&&(r=c,s())}function u(){return o||(o=function(){r||l(c);for(var e,t=r.split(""),n=[],i=a.nextValue();t.length>0;)i=a.nextValue(),e=Math.floor(i*t.length),n.push(t.splice(e,1)[0]);return n.join("")}())}e.exports={get:function(){return r||c},characters:function(e){return l(e),r},seed:function(e){a.seed(e),i!==e&&(s(),i=e)},lookup:function(e){return u()[e]},shuffled:u}},function(e,t,n){"use strict";e.exports=n(2)},function(e,t,n){"use strict";var r=n(0),i=n(4),o=n(8),a=n(9)||0;function c(){return i(a)}e.exports=c,e.exports.generate=c,e.exports.seed=function(t){return r.seed(t),e.exports},e.exports.worker=function(t){return a=t,e.exports},e.exports.characters=function(e){return void 0!==e&&r.characters(e),r.shuffled()},e.exports.isValid=o},function(e,t,n){"use strict";var r=1;e.exports={nextValue:function(){return(r=(9301*r+49297)%233280)/233280},seed:function(e){r=e}}},function(e,t,n){"use strict";var r,i,o=n(5),a=(n(0),1567752802062);e.exports=function(e){var t="",n=Math.floor(.001*(Date.now()-a));return n===i?r++:(r=0,i=n),t+=o(7),t+=o(e),r>0&&(t+=o(r)),t+o(n)}},function(e,t,n){"use strict";var r=n(0),i=n(6),o=n(7);e.exports=function(e){for(var t,n=0,a="";!t;)a+=o(i,r.get(),1),t=e<Math.pow(16,n+1),n++;return a}},function(e,t,n){"use strict";var r,i="object"==typeof window&&(window.crypto||window.msCrypto);r=i&&i.getRandomValues?function(e){return i.getRandomValues(new Uint8Array(e))}:function(e){for(var t=[],n=0;n<e;n++)t.push(Math.floor(256*Math.random()));return t},e.exports=r},function(e,t){e.exports=function(e,t,n){for(var r=(2<<Math.log(t.length-1)/Math.LN2)-1,i=Math.ceil(1.6*r*n/t.length),o="";;)for(var a=i,c=e(a);a--;)if((o+=t[c[a]&r]||"").length===+n)return o}},function(e,t,n){"use strict";var r=n(0);e.exports=function(e){return!(!e||"string"!=typeof e||e.length<6||new RegExp("[^"+r.get().replace(/[|\\{}()[\]^$+*?.-]/g,"\\$&")+"]").test(e))}},function(e,t,n){"use strict";e.exports=0},function(e,t,n){"use strict";n.r(t);var r=n(1),i=n.n(r),o={init:function(){i.a.characters("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$_")},generate:function(){return i.a.generate()}};o.init();var a=o,c={onScroll:function(e){window.addEventListener("scroll",e)},isElementAbovePageFold:function(e){return e.offsetTop-(c.getInnerHeight()+c.getPageYOffset())<0},getInnerHeight:function(){return window.innerHeight},getPageYOffset:function(){return window.pageYOffset}},s=c,l={},u=[];function p(){u.forEach((function(e){return f(e.element,e.onShowUp)}))}function f(e,t){s.isElementAbovePageFold(e)&&t()}l.init=function(){s.onScroll(p)},l.subscribe=function(e,t){return setTimeout((function(){return f(e,t)})),function(e,t){var n=a.generate();return u.push({id:n,element:e,onShowUp:t}),n}(e,t)},l.unsubscribe=function(e){var t;u.splice((t=e,u.find((function(e){return e.id===t}))),1)},l.init(),t.default=l}]).default},function(e,t){e.exports='<div class="application" data-application>\n  <div class="application-topbar">\n    <div class="application-actions-container">\n      <div class="application-action application-action-close"></div>\n      <div class="application-action application-action-minimize"></div>\n      <div class="application-action application-action-maximize"></div>\n    </div>\n    <div class="application-title-container" data-title-container></div>\n  </div>\n  <div class="application-content-container" data-content-container></div>\n</div>\n'},function(e,t){e.exports='<span class="cursor"></span>\n'},function(e,t){e.exports='<div class="editor-line">\n  <div class="editor-line-number" data-editor-line-number></div>\n  <pre class="editor-line-text" data-editor-line-text></pre>\n</div>\n'},function(e,t){e.exports='<div class="terminal-line"></div>\n'},function(e,t){e.exports='<div>\n  <div\n    class="terminal-command-line-prompt-string"\n    data-terminal-command-line-prompt-string>\n  </div>\n  <div\n    class="terminal-command-line-text"\n    data-terminal-command-line-text>\n  </div>\n</div>\n'},function(e,t){e.exports='<div class="terminal-response-line-text" data-terminal-response-line-text></div>\n'},function(e,t){e.exports='<div class="desktop"></div>\n'},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return Le})),n(8),n(9);var r=n(0),i=n.n(r),o=(n(10),n(11),n(12),{parseHtml:function(e){return(new DOMParser).parseFromString(e,"text/html").querySelector("body").firstChild},wrapHtmlStringInHtmlTag:function(e,t){return"<".concat(t,">").concat(e,"</").concat(t,">")},clearNodeContent:function(e){return e.innerHTML="",e},containsClosingHtmlTag:function(e){return new RegExp("</.+>","gm").test(e)},isHtmlNodeTypeText:function(e){return e&&"#text"==e.nodeName.toLowerCase()}}),a=o,c={toKebabCase:function(e){return e.toLowerCase().replace(" ","-")},isEmptyString:function(e){return""===e.trim()},removeBlankFirstLine:function(e){var t=e.split("\n");return""===t[0].trim()&&t.splice(0,1),t}},s=c,l=n(1),u=n.n(l);function p(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)){var n=[],r=!0,i=!1,o=void 0;try{for(var a,c=e[Symbol.iterator]();!(r=(a=c.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){i=!0,o=e}finally{try{r||null==c.return||c.return()}finally{if(i)throw o}}return n}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function f(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}function d(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function h(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var m=function(){function e(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=n.id,i=void 0===r?"_default":r,o=f(n,["id"]);d(this,e),this.type=t,this.id=i,this.options=o,this.element=y(t),this.setOptions(this.options)}var t,n,r;return t=e,(n=[{key:"setOptions",value:function(e){var t=this;Object.entries(e).forEach((function(e){var n=p(e,2),r=n[0],i=n[1],o=t.getOptionHandler(r);o&&o(i)}))}},{key:"getOptionHandler",value:function(e){var t=this;return{minHeight:function(e){return t.setMinHeight(e)},windowTitle:function(e){return t.setWindowTitle(e)},inanimate:function(e){return t.configAnimation(e)}}[e]}},{key:"setMinHeight",value:function(e){var t=v(this.element),n=parseInt(e)-26;t.style.minHeight="".concat(n,"px")}},{key:"setWindowTitle",value:function(e){this.element.querySelector("[data-title-container]").innerText=e,this.windowTitle=e}},{key:"configAnimation",value:function(e){this.setInanimate(e),e&&g(this.element).classList.add("application-inanimate")}},{key:"addContent",value:function(e){v(this.element).appendChild(e)}},{key:"setInanimate",value:function(e){this.inanimate=e}},{key:"minimize",value:function(){this.setMaximized(!1),b(this.element,"remove","application-maximized"),b(this.element,"add","application-minimized")}},{key:"maximize",value:function(){this.setMaximized(!0),b(this.element,"remove","application-minimized"),b(this.element,"add","application-maximized")}},{key:"setMaximized",value:function(e){this.isMaximized=e}}])&&h(t.prototype,n),r&&h(t,r),e}();function y(e){var t=function(e){var t=document.createElement("div"),n="".concat(s.toKebabCase(e),"-application");return t.setAttribute("class",n),t}(e);return t.appendChild(a.parseHtml(u.a)),t}function v(e){return e.querySelector("[data-content-container]")}function b(e,t,n){g(e).classList[t](n)}function g(e){return e.querySelector("[data-application]")}n(13),n(14);var x={type:function(e,t,n){var r=t.split(""),i=r.shift();i?function(e,t,n,r){e.append(t),setTimeout((function(){x.type(e,n.join(""),r)}),75)}(e,i,r,n):n()}},w=x,j={};function k(e,t,n){w.type(t,e,n)}j.type=function(e,t,n){!function e(t,n,r){if(!n.length)return r();!function(e,t,n){a.isHtmlNodeTypeText(t)?k(t.textContent,e,n):k(t.textContent,function(e,t){var n=a.clearNodeContent(t);return e.appendChild(n),n}(e,t),n)}(t,n.shift(),(function(){e(t,n,r)}))}(e,function(e){var t=a.wrapHtmlStringInHtmlTag(e,"span"),n=a.parseHtml(t);return Array.from(n.childNodes)}(t),n)};var S=j,C={};function O(e,t,n){e.classList[t](n)}C.type=function(e,t,n){O(e,"add","is-typing"),function(e){return a.containsClosingHtmlTag(e)?S:w}(t).type(e,t,(function(){O(e,"remove","is-typing"),n()}))};var _=C,T=n(2),A=n.n(T);function P(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var E=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.element=a.parseHtml(A.a)}var t,n,r;return t=e,(n=[{key:"write",value:function(e,t){_.type(this.element,e,t)}},{key:"setActive",value:function(){H(this.element,"add","cursor-active")}},{key:"setInactive",value:function(){H(this.element,"remove","cursor-active")}}])&&P(t.prototype,n),r&&P(t,r),e}();function H(e,t,n){e.classList[t](n)}var M=n(3),L=n.n(M);function D(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var N=function(){function e(t,n){var r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.cursor=new E,this.element=a.parseHtml(L.a),r=t,(function(e){return I(e,"[data-editor-line-number]")}(this.element)).innerText=r,function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";R(e).innerHTML=t}(this.element,n),n||R(this.element).appendChild(this.cursor.element)}var t,n,r;return t=e,(n=[{key:"write",value:function(e,t){this.cursor.write(e,t)}},{key:"setActive",value:function(){this.cursor.setActive()}},{key:"setInactive",value:function(){this.cursor.setInactive()}}])&&D(t.prototype,n),r&&D(t,r),e}();function R(e){return I(e,"[data-editor-line-text]")}function I(e,t){return e.querySelector(t)}function z(e){return(z="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function F(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function K(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function q(e,t){return!t||"object"!==z(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function B(e){return(B=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function G(e,t){return(G=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var J=function(e){function t(e){var n,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return F(this,t),(n=q(this,B(t).call(this,"editor",r))).container=e,n.container.appendChild(n.element),n.setupInitialContent(r.initialContent),n.setWindowTitle(W(r)),n}var n,r,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&G(e,t)}(t,e),n=t,(r=[{key:"setupInitialContent",value:function(){var e=U(arguments.length>0&&void 0!==arguments[0]?arguments[0]:"");this.setLines([]),this.appendLines(e)}},{key:"setLines",value:function(e){this.lines=[]}},{key:"appendLines",value:function(e){var t=this;e.forEach((function(e){var n=V(t.lines,e);Y(t,n)}))}},{key:"write",value:function(e,t){!function e(t,n,r){var i,o=n.shift();void 0!==o?((i=t.lines).length&&i[i.length-1].setInactive(),function(e,t,n){var r=V(e.lines);Y(e,r),r.setActive(),r.write(t,n)}(t,o,(function(){e(t,n,r)}))):r()}(this,U(e.codeSample),t)}}])&&K(n.prototype,r),i&&K(n,i),t}(m);function U(e){return s.removeBlankFirstLine(e)}function W(e){return e.windowTitle||"~/demo/demo.js"}function V(e,t){return new N(e.length+1,t)}function Y(e,t){e.addContent(t.element),e.lines.push(t)}n(15),n(16);var $=n(4),Z=n.n($);function Q(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var X=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.element=a.parseHtml(Z.a)}var t,n,r;return t=e,(n=[{key:"setContent",value:function(e){this.element.append(e)}}])&&Q(t.prototype,n),r&&Q(t,r),e}(),ee=n(5),te=n.n(ee);function ne(e){return(ne="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function re(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function ie(e,t){return!t||"object"!==ne(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function oe(e){return(oe=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function ae(e,t){return(ae=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var ce=function(e){function t(e){var n,r;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=ie(this,oe(t).call(this))).cursor=new E,n.setContent(a.parseHtml(te.a)),n.setPromptString(e),(r=n.element,r.querySelector("[data-terminal-command-line-text]")).appendChild(n.cursor.element),n}var n,r,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&ae(e,t)}(t,e),n=t,(r=[{key:"setPromptString",value:function(e){this.element.querySelector("[data-terminal-command-line-prompt-string]").appendChild(a.parseHtml(e))}},{key:"command",value:function(e,t){this.cursor.write(e,t)}},{key:"setActive",value:function(){this.cursor.setActive()}},{key:"setInactive",value:function(){this.cursor.setInactive()}}])&&re(n.prototype,r),i&&re(n,i),t}(X);n(17);var se=n(6),le=n.n(se);function ue(e){return(ue="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function pe(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function fe(e,t){return!t||"object"!==ue(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function de(e){return(de=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function he(e,t){return(he=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var me=function(e){function t(){var e;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(e=fe(this,de(t).call(this))).setContent(a.parseHtml(le.a)),e}var n,r,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&he(e,t)}(t,e),n=t,(r=[{key:"setText",value:function(e){var t,n,r=this.element.querySelector("[data-terminal-response-line-text]");return a.containsClosingHtmlTag(e)?(t=r,n=a.parseHtml(e),ye(t,"terminal-response-line-html-text"),void t.appendChild(n)):function(e,t){ye(e,"terminal-response-line-plain-text"),e.innerText=t}(r,e)}}])&&pe(n.prototype,r),i&&pe(n,i),t}(X);function ye(e,t){e.classList.add(t)}function ve(e){return(ve="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function be(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function ge(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function xe(e,t){return!t||"object"!==ve(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function we(e){return(we=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function je(e,t){return(je=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var ke=function(e){function t(e){var n,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return be(this,t),(n=xe(this,we(t).call(this,"terminal",r))).container=e,n.container.appendChild(n.element),n.setCommandLines([]),n.configOptions(r),n}var n,r,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&je(e,t)}(t,e),n=t,(r=[{key:"configOptions",value:function(e){this.setWindowTitle(function(e){return e.windowTitle||"bash"}(e)),this.setPromptString(function(e){return e.promptString||"~/demo $"}(e))}},{key:"setCommandLines",value:function(e){this.commandLines=e}},{key:"setPromptString",value:function(e){this.promptString=e}},{key:"command",value:function(e,t){var n,r=e.command,i=e.promptString;i&&this.setPromptString(i),(n=this.commandLines).length&&n[n.length-1].setInactive(),function(e,t,n){var r=new ce(e.promptString);e.commandLines.push(r),e.addContent(r.element),r.setActive(),r.command(t,n)}(this,r,t)}},{key:"respond",value:function(e,t){for(var n=e.response,r=s.removeBlankFirstLine(n),i=0;i<r.length;i++)this.addContent(Se(r[i]));t()}}])&&ge(n.prototype,r),i&&ge(n,i),t}(m);function Se(e){var t=new me;return t.setText(e),t.element}var Ce=n(7),Oe=n.n(Ce);function _e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var Te=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.element=a.parseHtml(Oe.a),this.container=t,this.openApplications=[],this.container.appendChild(this.element)}var t,n,r;return t=e,(n=[{key:"openApplication",value:function(e,t){var n=function(e,t){var n=(arguments.length>2&&void 0!==arguments[2]?arguments[2]:{}).id||"_default";return e.filter((function(e){return e.type===t})).find((function(e){return e.id===n}))}(this.openApplications,e,t);return n||function(e,t,n){var r=new("editor"==t?J:ke)(e.element,n);return e.openApplications.push(r),e.element.appendChild(r.element),r}(this,e,t)}},{key:"minimizeAllApplications",value:function(e){this.openApplications.forEach((function(e){return e.minimize()})),e&&setTimeout(e,750)}},{key:"maximizeApplication",value:function(e,t){return e.maximize(),e.inanimate?t():setTimeout(t,750)}}])&&_e(t.prototype,n),r&&_e(t,r),e}();function Ae(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var Pe=function(){function e(t,n){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.container=t,this.steps=n,this.desktop=new Te(t),this.setCurrentStepNumber(0)}var t,n,r;return t=e,(n=[{key:"play",value:function(){var e=this,t=this.desktop,n=this.steps;return new Promise((function(r){return function e(t,n,r,i){var o=t.getCurrentStepNumber();if(o<r.length){var a=r[o];!function(e,t,n){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;Ee(e,t.app,t.options,(function(e){var i=function(){return setTimeout(n,r)};return t.action?e[t.action](t.params,i):i()}))}(n,a,(function(){t.setCurrentStepNumber(o+1),e(t,n,r,i)}),a.onCompleteDelay)}else i()}(e,t,n,r)}))}},{key:"getCurrentStepNumber",value:function(){return this.currentStepNumber}},{key:"setCurrentStepNumber",value:function(e){this.currentStepNumber=e}}])&&Ae(t.prototype,n),r&&Ae(t,r),e}();function Ee(e,t,n,r){var i=e.openApplication(t,n),o=function(){return r(i)};i.isMaximized?r(i):i.inanimate?(e.minimizeAllApplications(),e.maximizeApplication(i,o)):e.minimizeAllApplications((function(){e.maximizeApplication(i,o)}))}function He(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}function Me(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var Le=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.container=document.querySelector(t),this.steps=[]}var t,n,r;return t=e,(n=[{key:"openApp",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return this.steps.push({app:e,options:t,onCompleteDelay:t.onCompleteDelay}),this}},{key:"write",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=t.onCompleteDelay,r=He(t,["onCompleteDelay"]);return this.steps.push({app:"editor",action:"write",params:{codeSample:e},onCompleteDelay:n,options:r}),this}},{key:"command",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=t.onCompleteDelay,r=t.promptString,i=He(t,["onCompleteDelay","promptString"]);return this.steps.push({app:"terminal",action:"command",params:{command:e,promptString:r},onCompleteDelay:n,options:i}),this}},{key:"respond",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=t.onCompleteDelay,r=He(t,["onCompleteDelay"]);return this.steps.push({app:"terminal",action:"respond",params:{response:e},onCompleteDelay:n,options:r}),this}},{key:"end",value:function(){var e=this;return new Promise((function(t){!function(e,t,n){var r=i.a.subscribe(e,(function(){var o=new Pe(e,t);i.a.unsubscribe(r),o.play().then(n)}))}(e.container,e.steps,t)}))}}])&&Me(t.prototype,n),r&&Me(t,r),e}()}]).default},5363:(e,t,n)=>{"use strict";n.d(t,{A:()=>o});n(6540);var r=n(9136),i=n(4848);function o(e){let{children:t,fallback:n}=e;return(0,r.A)()?(0,i.jsx)(i.Fragment,{children:t?.()}):n??null}},5367:(e,t,n)=>{"use strict";n.d(t,{A:()=>c});var r=n(6540),i=n(5310),o=n.n(i),a=n(4848);const c=e=>{let{code:t,command:n,response:i,editorTitle:c="demo.js",commandDelay:s=1500,responseDelay:l=500}=e;const u=(0,r.useRef)(null),p="glorious-demo";return(0,r.useEffect)((()=>{const e=document.getElementById(p);if(!e)return;e.innerHTML="";new(o())(`#${p}`).openApp("editor",{minHeight:"350px",windowTitle:c}).write(t,{onCompleteDelay:s}).openApp("terminal",{minHeight:"350px",promptString:"$"}).command(n,{onCompleteDelay:l}).respond(i).command("").end()}),[t,n,i,c,s,l]),(0,a.jsx)("div",{id:p,ref:u,style:{maxWidth:"600px",margin:"auto",minHeight:"200px"}})}},8453:(e,t,n)=>{"use strict";n.d(t,{R:()=>a,x:()=>c});var r=n(6540);const i={},o=r.createContext(i);function a(e){const t=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function c(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),r.createElement(o.Provider,{value:t},e.children)}},2967:e=>{"use strict";e.exports=JSON.parse('{"permalink":"/blog/johny-dev-blog-launched","source":"@site/blog/2025-02-03-johny-dev-blog-launched.mdx","title":"\ud83c\udf89 \uac1c\ubc1c \ube14\ub85c\uadf8 \uc624\ud508 \ud83c\udf89","description":"_","date":"2025-02-03T00:00:00.000Z","tags":[{"inline":false,"label":"Hello","permalink":"/blog/tags/hello","description":"Hello tag description"}],"readingTime":2.82,"hasTruncateMarker":true,"authors":[{"name":"Johny Cho","title":"Back End Engineer @ NHN","url":"https://github.com/johnycho","page":{"permalink":"/blog/authors/johnycho"},"socials":{"github":"https://github.com/johnycho","instagram":"https://www.instagram.com/johny__cho","linkedin":"https://www.linkedin.com/in/johny-cho/"},"imageURL":"https://github.com/johnycho.png","key":"johnycho"}],"frontMatter":{"slug":"johny-dev-blog-launched","title":"\ud83c\udf89 \uac1c\ubc1c \ube14\ub85c\uadf8 \uc624\ud508 \ud83c\udf89","authors":["johnycho"],"tags":["hello"]},"unlisted":false}')}}]);