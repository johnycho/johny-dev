"use strict";(self.webpackChunkjohnycho_dev=self.webpackChunkjohnycho_dev||[]).push([[7643],{5631:(e,t,a)=>{a.r(t),a.d(t,{default:()=>j});a(6540);var n=a(4164),s=a(797),i=a(8207),r=a(204),l=a(569),o=a(7448),c=a(7220),d=a(4005),m=a(7143),g=a(3750),u=a(4848);function h(e){const t=(0,g.kJ)(e);return(0,u.jsx)(m.A,{children:(0,u.jsx)("script",{type:"application/ld+json",children:JSON.stringify(t)})})}function p(e){const{metadata:t}=e,{siteConfig:{title:a}}=(0,s.A)(),{blogDescription:n,blogTitle:r,permalink:l}=t,o="/"===l?a:r;return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(i.be,{title:o,description:n}),(0,u.jsx)(c.A,{tag:"blog_posts_list"})]})}function x(e){const{metadata:t,items:a,sidebar:n}=e;return(0,u.jsxs)(l.A,{sidebar:n,children:[(0,u.jsx)(d.A,{items:a}),(0,u.jsx)(o.A,{metadata:t})]})}function j(e){return(0,u.jsxs)(i.e3,{className:(0,n.A)(r.G.wrapper.blogPages,r.G.page.blogListPage),children:[(0,u.jsx)(p,{...e}),(0,u.jsx)(h,{...e}),(0,u.jsx)(x,{...e})]})}},7448:(e,t,a)=>{a.d(t,{A:()=>r});a(6540);var n=a(539),s=a(1865),i=a(4848);function r(e){const{metadata:t}=e,{previousPage:a,nextPage:r}=t;return(0,i.jsxs)("nav",{className:"pagination-nav","aria-label":(0,n.T)({id:"theme.blog.paginator.navAriaLabel",message:"Blog list page navigation",description:"The ARIA label for the blog pagination"}),children:[a&&(0,i.jsx)(s.A,{permalink:a,title:(0,i.jsx)(n.A,{id:"theme.blog.paginator.newerEntries",description:"The label used to navigate to the newer blog posts page (previous page)",children:"Newer entries"})}),r&&(0,i.jsx)(s.A,{permalink:r,title:(0,i.jsx)(n.A,{id:"theme.blog.paginator.olderEntries",description:"The label used to navigate to the older blog posts page (next page)",children:"Older entries"}),isNext:!0})]})}},4005:(e,t,a)=>{a.d(t,{A:()=>r});a(6540);var n=a(3750),s=a(9910),i=a(4848);function r(e){let{items:t,component:a=s.A}=e;return(0,i.jsx)(i.Fragment,{children:t.map((e=>{let{content:t}=e;return(0,i.jsx)(n.in,{content:t,children:(0,i.jsx)(a,{children:(0,i.jsx)(t,{})})},t.metadata.permalink)}))})}},1865:(e,t,a)=>{a.d(t,{A:()=>r});a(6540);var n=a(4164),s=a(6289),i=a(4848);function r(e){const{permalink:t,title:a,subLabel:r,isNext:l}=e;return(0,i.jsxs)(s.A,{className:(0,n.A)("pagination-nav__link",l?"pagination-nav__link--next":"pagination-nav__link--prev"),to:t,children:[r&&(0,i.jsx)("div",{className:"pagination-nav__sublabel",children:r}),(0,i.jsx)("div",{className:"pagination-nav__label",children:a})]})}},3953:(e,t,a)=>{a.d(t,{A:()=>l});a(6540);var n=a(4164),s=a(6289);const i={tag:"tag_zVej",tagRegular:"tagRegular_sFm0",tagWithCount:"tagWithCount_h2kH"};var r=a(4848);function l(e){let{permalink:t,label:a,count:l,description:o}=e;return(0,r.jsxs)(s.A,{href:t,title:o,className:(0,n.A)(i.tag,l?i.tagWithCount:i.tagRegular),children:[a,l&&(0,r.jsx)("span",{children:l})]})}},6239:(e,t,a)=>{a.d(t,{A:()=>o});a(6540);var n=a(4164),s=a(539),i=a(3953);const r={tags:"tags_jXut",tag:"tag_QGVx"};var l=a(4848);function o(e){let{tags:t}=e;return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("b",{children:(0,l.jsx)(s.A,{id:"theme.tags.tagsListLabel",description:"The label alongside a tag list",children:"Tags:"})}),(0,l.jsx)("ul",{className:(0,n.A)(r.tags,"padding--none","margin-left--sm"),children:t.map((e=>(0,l.jsx)("li",{className:r.tag,children:(0,l.jsx)(i.A,{...e})},e.permalink)))})]})}},9370:(e,t,a)=>{a.d(t,{A:()=>i});var n=a(6540),s=a(4848);function i(){return(0,n.useEffect)((()=>{if(window.DISQUS)window.DISQUS.reset({reload:!0,config:function(){this.page.url=window.location.href,this.page.identifier=window.location.pathname}});else{const e=document,t=e.createElement("script");t.src="https://johny-dev.disqus.com/embed.js",t.setAttribute("data-timestamp",Date.now().toString()),t.async=!0,(e.head||e.body).appendChild(t)}}),[]),(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("div",{id:"disqus_thread",style:{marginTop:"2rem"}}),(0,s.jsxs)("noscript",{children:["Please enable JavaScript to view the"," ",(0,s.jsx)("a",{href:"https://disqus.com/?ref_noscript",children:"comments powered by Disqus."})]})]})}},9910:(e,t,a)=>{a.d(t,{A:()=>I});var n=a(6540),s=a(4164),i=a(3750),r=a(4848);function l(e){let{children:t,className:a}=e;return(0,r.jsx)("article",{className:a,children:t})}var o=a(6289);const c={title:"title_f1Hy"};function d(e){let{className:t}=e;const{metadata:a,isBlogPostPage:n}=(0,i.e7)(),{permalink:l,title:d}=a,m=n?"h1":"h2";return(0,r.jsx)(m,{className:(0,s.A)(c.title,t),children:n?d:(0,r.jsx)(o.A,{to:l,children:d})})}var m=a(539),g=a(1430),u=a(8569);const h={container:"container_mt6G"};function p(e){let{readingTime:t}=e;const a=function(){const{selectMessage:e}=(0,g.W)();return t=>{const a=Math.ceil(t);return e(a,(0,m.T)({id:"theme.blog.post.readingTime.plurals",description:'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:"One min read|{readingTime} min read"},{readingTime:a}))}}();return(0,r.jsx)(r.Fragment,{children:a(t)})}function x(e){let{date:t,formattedDate:a}=e;return(0,r.jsx)("time",{dateTime:t,children:a})}function j(){return(0,r.jsx)(r.Fragment,{children:" \xb7 "})}function f(e){let{className:t}=e;const{metadata:a}=(0,i.e7)(),{date:n,readingTime:l}=a,o=(0,u.i)({day:"numeric",month:"long",year:"numeric",timeZone:"UTC"});return(0,r.jsxs)("div",{className:(0,s.A)(h.container,"margin-vert--md",t),children:[(0,r.jsx)(x,{date:n,formattedDate:(c=n,o.format(new Date(c)))}),void 0!==l&&(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(j,{}),(0,r.jsx)(p,{readingTime:l})]})]});var c}var A=a(5921);const b={authorCol:"authorCol_Hf19",imageOnlyAuthorRow:"imageOnlyAuthorRow_pa_O",imageOnlyAuthorCol:"imageOnlyAuthorCol_G86a"};function v(e){let{className:t}=e;const{metadata:{authors:a},assets:n}=(0,i.e7)();if(0===a.length)return null;const l=a.every((e=>{let{name:t}=e;return!t})),o=1===a.length;return(0,r.jsx)("div",{className:(0,s.A)("margin-top--md margin-bottom--sm",l?b.imageOnlyAuthorRow:"row",t),children:a.map(((e,t)=>(0,r.jsx)("div",{className:(0,s.A)(!l&&(o?"col col--12":"col col--6"),l?b.imageOnlyAuthorCol:b.authorCol),children:(0,r.jsx)(A.A,{author:{...e,imageURL:n.authorsImageUrls[t]??e.imageURL}})},t)))})}var w=a(6347);function N(e){let{slug:t}=e;const a=(0,w.zy)();return(0,n.useEffect)((()=>{"undefined"!=typeof window&&window.DISQUSWIDGETS&&window.DISQUSWIDGETS.getCount({reset:!0})}),[a.pathname]),(0,r.jsx)("a",{href:`${t}#disqus_thread`,"data-disqus-identifier":t,style:{marginLeft:"1rem",fontSize:"0.9rem"},children:"\ub313\uae00 \ubcf4\uae30"})}function _(){const{metadata:e}=(0,i.e7)(),{permalink:t}=e;return(0,r.jsxs)("header",{children:[(0,r.jsx)(d,{}),(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center"},children:[(0,r.jsx)(f,{}),(0,r.jsx)(N,{slug:t})]}),(0,r.jsx)(v,{})]})}var y=a(99),T=a(900);function k(e){let{children:t,className:a}=e;const{isBlogPostPage:n}=(0,i.e7)();return(0,r.jsx)("div",{id:n?y.LU:void 0,className:(0,s.A)("markdown",a),children:(0,r.jsx)(T.A,{children:t})})}var P=a(204),U=a(5783),C=a(6239);function R(){return(0,r.jsx)("b",{children:(0,r.jsx)(m.A,{id:"theme.blog.post.readMore",description:"The label used in blog post item excerpts to link to full blog posts",children:"Read more"})})}function S(e){const{blogPostTitle:t,...a}=e;return(0,r.jsx)(o.A,{"aria-label":(0,m.T)({message:"Read more about {title}",id:"theme.blog.post.readMoreLabel",description:"The ARIA label for the link to full blog posts from excerpts"},{title:t}),...a,children:(0,r.jsx)(R,{})})}function D(){const{metadata:e,isBlogPostPage:t}=(0,i.e7)(),{tags:a,title:n,editUrl:l,hasTruncateMarker:o,lastUpdatedBy:c,lastUpdatedAt:d}=e,m=!t&&o,g=a.length>0;if(!(g||m||l))return null;if(t){const e=!!(l||d||c);return(0,r.jsxs)("footer",{className:"docusaurus-mt-lg",children:[g&&(0,r.jsx)("div",{className:(0,s.A)("row","margin-top--sm",P.G.blog.blogFooterEditMetaRow),children:(0,r.jsx)("div",{className:"col",children:(0,r.jsx)(C.A,{tags:a})})}),e&&(0,r.jsx)(U.A,{className:(0,s.A)("margin-top--sm",P.G.blog.blogFooterEditMetaRow),editUrl:l,lastUpdatedAt:d,lastUpdatedBy:c})]})}return(0,r.jsxs)("footer",{className:"row docusaurus-mt-lg",children:[g&&(0,r.jsx)("div",{className:(0,s.A)("col",{"col--9":m}),children:(0,r.jsx)(C.A,{tags:a})}),m&&(0,r.jsx)("div",{className:(0,s.A)("col text--right",{"col--3":g}),children:(0,r.jsx)(S,{blogPostTitle:n,to:e.permalink})})]})}var F=a(9370);function I(e){let{children:t,className:a}=e;const{isBlogPostPage:n}=(0,i.e7)(),o=function(){const{isBlogPostPage:e}=(0,i.e7)();return e?void 0:"margin-bottom--xl"}();return(0,r.jsxs)(l,{className:(0,s.A)(o,a),children:[(0,r.jsx)(_,{}),(0,r.jsx)(k,{children:t}),(0,r.jsx)(D,{}),n&&(0,r.jsx)(F.A,{})]})}}}]);