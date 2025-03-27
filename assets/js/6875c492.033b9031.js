"use strict";(self.webpackChunkjohnycho_dev=self.webpackChunkjohnycho_dev||[]).push([[4813],{7448:(e,t,n)=>{n.d(t,{A:()=>r});n(6540);var s=n(539),a=n(1865),i=n(4848);function r(e){const{metadata:t}=e,{previousPage:n,nextPage:r}=t;return(0,i.jsxs)("nav",{className:"pagination-nav","aria-label":(0,s.T)({id:"theme.blog.paginator.navAriaLabel",message:"Blog list page navigation",description:"The ARIA label for the blog pagination"}),children:[n&&(0,i.jsx)(a.A,{permalink:n,title:(0,i.jsx)(s.A,{id:"theme.blog.paginator.newerEntries",description:"The label used to navigate to the newer blog posts page (previous page)",children:"Newer entries"})}),r&&(0,i.jsx)(a.A,{permalink:r,title:(0,i.jsx)(s.A,{id:"theme.blog.paginator.olderEntries",description:"The label used to navigate to the older blog posts page (next page)",children:"Older entries"}),isNext:!0})]})}},4005:(e,t,n)=>{n.d(t,{A:()=>r});n(6540);var s=n(3750),a=n(9910),i=n(4848);function r(e){let{items:t,component:n=a.A}=e;return(0,i.jsx)(i.Fragment,{children:t.map((e=>{let{content:t}=e;return(0,i.jsx)(s.in,{content:t,children:(0,i.jsx)(n,{children:(0,i.jsx)(t,{})})},t.metadata.permalink)}))})}},6956:(e,t,n)=>{n.r(t),n.d(t,{default:()=>f});n(6540);var s=n(4164),a=n(539),i=n(8207),r=n(204),o=n(1926),l=n(6289),c=n(569),d=n(7448),u=n(7220),h=n(4005),g=n(665),m=n(9303),p=n(4848);function x(e){let{tag:t}=e;const n=(0,o.ZD)(t);return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(i.be,{title:n,description:t.description}),(0,p.jsx)(u.A,{tag:"blog_tags_posts"})]})}function j(e){let{tag:t,items:n,sidebar:s,listMetadata:i}=e;const r=(0,o.ZD)(t);return(0,p.jsxs)(c.A,{sidebar:s,children:[t.unlisted&&(0,p.jsx)(g.A,{}),(0,p.jsxs)("header",{className:"margin-bottom--xl",children:[(0,p.jsx)(m.A,{as:"h1",children:r}),t.description&&(0,p.jsx)("p",{children:t.description}),(0,p.jsx)(l.A,{href:t.allTagsPath,children:(0,p.jsx)(a.A,{id:"theme.tags.tagsPageLink",description:"The label of the link targeting the tag list page",children:"View All Tags"})})]}),(0,p.jsx)(h.A,{items:n}),(0,p.jsx)(d.A,{metadata:i})]})}function f(e){return(0,p.jsxs)(i.e3,{className:(0,s.A)(r.G.wrapper.blogPages,r.G.page.blogTagPostListPage),children:[(0,p.jsx)(x,{...e}),(0,p.jsx)(j,{...e})]})}},665:(e,t,n)=>{n.d(t,{A:()=>c});n(6540);var s=n(4164),a=n(7289),i=n(204),r=n(2362),o=n(4848);function l(e){let{className:t}=e;return(0,o.jsx)(r.A,{type:"caution",title:(0,o.jsx)(a.Rc,{}),className:(0,s.A)(t,i.G.common.unlistedBanner),children:(0,o.jsx)(a.Uh,{})})}function c(e){return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(a.AE,{}),(0,o.jsx)(l,{...e})]})}},1926:(e,t,n)=>{n.d(t,{Y4:()=>u,ZD:()=>o,np:()=>d,uz:()=>c,wI:()=>l});n(6540);var s=n(539),a=n(1430),i=n(4848);function r(){const{selectMessage:e}=(0,a.W)();return t=>e(t,(0,s.T)({id:"theme.blog.post.plurals",description:'Pluralized label for "{count} posts". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:"One post|{count} posts"},{count:t}))}function o(e){const t=r();return(0,s.T)({id:"theme.blog.tagTitle",description:"The title of the page for a blog tag",message:'{nPosts} tagged with "{tagName}"'},{nPosts:t(e.count),tagName:e.label})}function l(e){const t=r();return(0,s.T)({id:"theme.blog.author.pageTitle",description:"The title of the page for a blog author",message:"{authorName} - {nPosts}"},{nPosts:t(e.count),authorName:e.name||e.key})}const c=()=>(0,s.T)({id:"theme.blog.authorsList.pageTitle",message:"Authors",description:"The title of the authors page"});function d(){return(0,i.jsx)(s.A,{id:"theme.blog.authorsList.viewAll",description:"The label of the link targeting the blog authors page",children:"View all authors"})}function u(){return(0,i.jsx)(s.A,{id:"theme.blog.author.noPosts",description:"The text for authors with 0 blog post",children:"This author has not written any posts yet."})}},7289:(e,t,n)=>{n.d(t,{AE:()=>l,Rc:()=>r,TT:()=>d,Uh:()=>o,Yh:()=>c});n(6540);var s=n(539),a=n(7143),i=n(4848);function r(){return(0,i.jsx)(s.A,{id:"theme.contentVisibility.unlistedBanner.title",description:"The unlisted content banner title",children:"Unlisted page"})}function o(){return(0,i.jsx)(s.A,{id:"theme.contentVisibility.unlistedBanner.message",description:"The unlisted content banner message",children:"This page is unlisted. Search engines will not index it, and only users having a direct link can access it."})}function l(){return(0,i.jsx)(a.A,{children:(0,i.jsx)("meta",{name:"robots",content:"noindex, nofollow"})})}function c(){return(0,i.jsx)(s.A,{id:"theme.contentVisibility.draftBanner.title",description:"The draft content banner title",children:"Draft page"})}function d(){return(0,i.jsx)(s.A,{id:"theme.contentVisibility.draftBanner.message",description:"The draft content banner message",children:"This page is a draft. It will only be visible in dev and be excluded from the production build."})}},9370:(e,t,n)=>{n.d(t,{A:()=>o});n(6540);var s=n(5363),a=n(1392),i=n(6347),r=n(4848);function o(){const e=(0,i.zy)();return(0,r.jsx)(s.A,{fallback:(0,r.jsx)("div",{children:"Loading comments..."}),children:()=>{const t={url:window.location.href,identifier:e.pathname,title:document.title};return(0,r.jsx)("div",{style:{marginTop:"2rem"},children:(0,r.jsx)(a.Mq,{shortname:"johny-dev",config:t})})}})}},9910:(e,t,n)=>{n.d(t,{A:()=>C});n(6540);var s=n(4164),a=n(3750),i=n(4848);function r(e){let{children:t,className:n}=e;return(0,i.jsx)("article",{className:n,children:t})}var o=n(6289);const l={title:"title_f1Hy"};function c(e){let{className:t}=e;const{metadata:n,isBlogPostPage:r}=(0,a.e7)(),{permalink:c,title:d}=n,u=r?"h1":"h2";return(0,i.jsx)(u,{className:(0,s.A)(l.title,t),children:r?d:(0,i.jsx)(o.A,{to:c,children:d})})}var d=n(539),u=n(1430),h=n(8569);const g={container:"container_mt6G"};function m(e){let{readingTime:t}=e;const n=function(){const{selectMessage:e}=(0,u.W)();return t=>{const n=Math.ceil(t);return e(n,(0,d.T)({id:"theme.blog.post.readingTime.plurals",description:'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:"One min read|{readingTime} min read"},{readingTime:n}))}}();return(0,i.jsx)(i.Fragment,{children:n(t)})}function p(e){let{date:t,formattedDate:n}=e;return(0,i.jsx)("time",{dateTime:t,children:n})}function x(){return(0,i.jsx)(i.Fragment,{children:" \xb7 "})}function j(e){let{className:t}=e;const{metadata:n}=(0,a.e7)(),{date:r,readingTime:o}=n,l=(0,h.i)({day:"numeric",month:"long",year:"numeric",timeZone:"UTC"});return(0,i.jsxs)("div",{className:(0,s.A)(g.container,"margin-vert--md",t),children:[(0,i.jsx)(p,{date:r,formattedDate:(c=r,l.format(new Date(c)))}),void 0!==o&&(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(x,{}),(0,i.jsx)(m,{readingTime:o})]})]});var c}var f=n(5921);const b={authorCol:"authorCol_Hf19",imageOnlyAuthorRow:"imageOnlyAuthorRow_pa_O",imageOnlyAuthorCol:"imageOnlyAuthorCol_G86a"};function A(e){let{className:t}=e;const{metadata:{authors:n},assets:r}=(0,a.e7)();if(0===n.length)return null;const o=n.every((e=>{let{name:t}=e;return!t})),l=1===n.length;return(0,i.jsx)("div",{className:(0,s.A)("margin-top--md margin-bottom--sm",o?b.imageOnlyAuthorRow:"row",t),children:n.map(((e,t)=>(0,i.jsx)("div",{className:(0,s.A)(!o&&(l?"col col--12":"col col--6"),o?b.imageOnlyAuthorCol:b.authorCol),children:(0,i.jsx)(f.A,{author:{...e,imageURL:r.authorsImageUrls[t]??e.imageURL}})},t)))})}var v=n(1392),T=n(5363);function w(e){let{slug:t}=e;return(0,i.jsx)(T.A,{children:()=>{const e={url:window.location.origin+t,identifier:t};return(0,i.jsx)("a",{href:`${t}#disqus_thread`,style:{marginLeft:"1rem",fontSize:"0.9rem"},children:(0,i.jsx)(v.Xz,{shortname:"johny-dev",config:e,children:"\ub313\uae00"})})}})}function y(){const{metadata:e}=(0,a.e7)(),{permalink:t}=e;return(0,i.jsxs)("header",{children:[(0,i.jsx)(c,{}),(0,i.jsxs)("div",{style:{display:"flex",alignItems:"center"},children:[(0,i.jsx)(j,{}),(0,i.jsx)(w,{slug:t})]}),(0,i.jsx)(A,{})]})}var N=n(99),P=n(900);function k(e){let{children:t,className:n}=e;const{isBlogPostPage:r}=(0,a.e7)();return(0,i.jsx)("div",{id:r?N.LU:void 0,className:(0,s.A)("markdown",n),children:(0,i.jsx)(P.A,{children:t})})}var U=n(204),_=n(5783),B=n(6239);function R(){return(0,i.jsx)("b",{children:(0,i.jsx)(d.A,{id:"theme.blog.post.readMore",description:"The label used in blog post item excerpts to link to full blog posts",children:"Read more"})})}function L(e){const{blogPostTitle:t,...n}=e;return(0,i.jsx)(o.A,{"aria-label":(0,d.T)({message:"Read more about {title}",id:"theme.blog.post.readMoreLabel",description:"The ARIA label for the link to full blog posts from excerpts"},{title:t}),...n,children:(0,i.jsx)(R,{})})}function M(){const{metadata:e,isBlogPostPage:t}=(0,a.e7)(),{tags:n,title:r,editUrl:o,hasTruncateMarker:l,lastUpdatedBy:c,lastUpdatedAt:d}=e,u=!t&&l,h=n.length>0;if(!(h||u||o))return null;if(t){const e=!!(o||d||c);return(0,i.jsxs)("footer",{className:"docusaurus-mt-lg",children:[h&&(0,i.jsx)("div",{className:(0,s.A)("row","margin-top--sm",U.G.blog.blogFooterEditMetaRow),children:(0,i.jsx)("div",{className:"col",children:(0,i.jsx)(B.A,{tags:n})})}),e&&(0,i.jsx)(_.A,{className:(0,s.A)("margin-top--sm",U.G.blog.blogFooterEditMetaRow),editUrl:o,lastUpdatedAt:d,lastUpdatedBy:c})]})}return(0,i.jsxs)("footer",{className:"row docusaurus-mt-lg",children:[h&&(0,i.jsx)("div",{className:(0,s.A)("col",{"col--9":u}),children:(0,i.jsx)(B.A,{tags:n})}),u&&(0,i.jsx)("div",{className:(0,s.A)("col text--right",{"col--3":h}),children:(0,i.jsx)(L,{blogPostTitle:r,to:e.permalink})})]})}var O=n(9370);function C(e){let{children:t,className:n}=e;const{isBlogPostPage:o}=(0,a.e7)(),l=function(){const{isBlogPostPage:e}=(0,a.e7)();return e?void 0:"margin-bottom--xl"}();return(0,i.jsxs)(r,{className:(0,s.A)(l,n),children:[(0,i.jsx)(y,{}),(0,i.jsx)(k,{children:t}),(0,i.jsx)(M,{}),o&&(0,i.jsx)(O.A,{})]})}}}]);