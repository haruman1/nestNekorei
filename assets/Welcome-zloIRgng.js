import{r as t,_ as B,R as l,a as D,c as P,P as a,j as n}from"./index-BxegOxZp.js";import{a as Ne,b as xe}from"./CContainer-B_sSYCtY.js";import{C as oe,a as ie}from"./CRow-2QZVwYgJ.js";import{i as ce}from"./isInViewport-BGGX6NGH.js";import{u as le}from"./Transition-Cqi6SL1v.js";import{C as ge,a as Ee}from"./CCardBody-D6oxODFr.js";import{C as je}from"./CCardImage-CYFNJRbL.js";import{a as ke}from"./CCardTitle-Dq6ckUuZ.js";var ue=t.createContext({}),J=t.forwardRef(function(e,m){var i=e.children,r=e.activeIndex,s=r===void 0?0:r,N=e.className,x=e.controls,E=e.dark,j=e.indicators,k=e.interval,C=k===void 0?5e3:k,M=e.onSlid,f=e.onSlide,V=e.pause,w=V===void 0?"hover":V,S=e.touch,X=S===void 0?!0:S,I=e.transition,y=e.wrap,H=y===void 0?!0:y,T=B(e,["children","activeIndex","className","controls","dark","indicators","interval","onSlid","onSlide","pause","touch","transition","wrap"]),p=t.useRef(null),Y=le(m,p),v=t.useRef({}).current,F=t.useState(s),c=F[0],b=F[1],d=t.useState(!1),u=d[0],R=d[1],g=t.useState(),K=g[0],de=g[1],Q=t.useState("next"),q=Q[0],z=Q[1],U=t.useState(0),W=U[0],me=U[1],Z=t.useState(null),fe=Z[0],$=Z[1],ee=t.useState(),te=ee[0],re=ee[1];t.useEffect(function(){me(t.Children.toArray(i).length)}),t.useEffect(function(){te&&G()},[te]),t.useEffect(function(){!u&&G(),!u&&M&&M(c,q),u&&f&&f(c,q)},[u]),t.useEffect(function(){return window.addEventListener("scroll",ne),function(){window.removeEventListener("scroll",ne)}});var G=function(){ae(),!(!H&&c===W-1)&&typeof C=="number"&&(v.timeout=setTimeout(function(){return ve()},typeof K=="number"?K:C))},ae=function(){return w&&v.timeout&&clearTimeout(v.timeout)},ve=function(){if(!document.hidden&&p.current&&ce(p.current)){if(u)return;A("next")}},A=function(o){u||(z(o),o==="next"?c===W-1?b(0):b(c+1):b(c===0?W-1:c-1))},he=function(o){if(c!==o){if(c<o){z("next"),b(o);return}c>o&&(z("prev"),b(o))}},ne=function(){!document.hidden&&p.current&&ce(p.current)?re(!0):re(!1)},pe=function(o){var h=fe;if(h!==null){var Ce=o.touches[0].clientX,se=h-Ce;se>5&&A("next"),se<-5&&A("prev"),$(null)}},be=function(o){var h=o.touches[0].clientX;$(h)};return l.createElement("div",D({className:P("carousel slide",{"carousel-fade":I==="crossfade"},N)},E&&{"data-coreui-theme":"dark"},{onMouseEnter:ae,onMouseLeave:G},X&&{onTouchStart:be,onTouchMove:pe},T,{ref:Y}),l.createElement(ue.Provider,{value:{setAnimating:R,setCustomInterval:de}},j&&l.createElement("div",{className:"carousel-indicators"},Array.from({length:W},function(o,h){return h}).map(function(o){return l.createElement("button",D({key:"indicator".concat(o),onClick:function(){!u&&he(o)},className:P({active:c===o}),"data-coreui-target":""},c===o&&{"aria-current":!0},{"aria-label":"Slide ".concat(o+1)}))})),l.createElement("div",{className:"carousel-inner"},t.Children.map(i,function(o,h){if(l.isValidElement(o))return l.cloneElement(o,{active:c===h,direction:q,key:h})})),x&&l.createElement(l.Fragment,null,l.createElement("button",{className:"carousel-control-prev",onClick:function(){return A("prev")}},l.createElement("span",{className:"carousel-control-prev-icon","aria-label":"prev"})),l.createElement("button",{className:"carousel-control-next",onClick:function(){return A("next")}},l.createElement("span",{className:"carousel-control-next-icon","aria-label":"next"})))))});J.propTypes={activeIndex:a.number,children:a.node,className:a.string,controls:a.bool,dark:a.bool,indicators:a.bool,interval:a.oneOfType([a.bool,a.number]),onSlid:a.func,onSlide:a.func,pause:a.oneOf([!1,"hover"]),touch:a.bool,transition:a.oneOf(["slide","crossfade"]),wrap:a.bool};J.displayName="CCarousel";var L=t.forwardRef(function(e,m){var i=e.className,r=B(e,["className"]);return l.createElement("div",D({className:P("carousel-caption",i)},r,{ref:m}))});L.propTypes={className:a.string};L.displayName="CCarouselCaption";var O=t.forwardRef(function(e,m){var i=e.children,r=e.className,s=e.active,N=e.direction,x=e.interval,E=x===void 0?!1:x,j=B(e,["children","className","active","direction","interval"]),k=t.useContext(ue),C=k.setAnimating,M=k.setCustomInterval,f=t.useRef(null),V=le(m,f),w=t.useRef(),S=t.useState(),X=S[0],I=S[1],y=t.useState(),H=y[0],T=y[1],p=t.useState(s&&"active"),Y=p[0],v=p[1],F=t.useState(0),c=F[0],b=F[1];return t.useEffect(function(){s&&(M(E),c!==0&&T("carousel-item-".concat(N))),w.current&&!s&&v("active"),(s||w.current)&&setTimeout(function(){var d;c!==0&&((d=f.current)===null||d===void 0||d.offsetHeight,I("carousel-item-".concat(N==="next"?"start":"end")))},0),w.current=s,c===0&&b(c+1)},[s]),t.useEffect(function(){var d,u;return(d=f.current)===null||d===void 0||d.addEventListener("transitionstart",function(){s&&C(!0)}),(u=f.current)===null||u===void 0||u.addEventListener("transitionend",function(){s&&C(!1),I(""),T(""),s&&v("active"),s||v("")}),function(){var R,g;(R=f.current)===null||R===void 0||R.removeEventListener("transitionstart",function(){s&&C(!0)}),(g=f.current)===null||g===void 0||g.removeEventListener("transitionend",function(){s&&C(!1),I(""),T(""),s&&v("active"),s||v("")})}}),l.createElement("div",D({className:P("carousel-item",Y,X,H,r),ref:V},j),i)});O.propTypes={active:a.bool,children:a.node,className:a.string,direction:a.string,interval:a.oneOfType([a.bool,a.number])};O.displayName="CCarouselItem";var _=t.forwardRef(function(e,m){var i,r=e.align,s=e.className,N=e.fluid,x=e.rounded,E=e.thumbnail,j=B(e,["align","className","fluid","rounded","thumbnail"]);return l.createElement("img",D({className:P((i={},i["float-".concat(r)]=r&&(r==="start"||r==="end"),i["d-block mx-auto"]=r&&r==="center",i["img-fluid"]=N,i.rounded=x,i["img-thumbnail"]=E,i),s)||void 0},j,{ref:m}))});_.propTypes={align:a.oneOf(["start","center","end"]),className:a.string,fluid:a.bool,rounded:a.bool,thumbnail:a.bool};_.displayName="CImage";const Le=()=>{const e=t.useRef([]);t.useEffect(()=>{const i=new IntersectionObserver(r=>{r.forEach(s=>{s.isIntersecting?s.target.classList.add("visible"):s.target.classList.remove("visible")})},{threshold:.5});return e.current.forEach(r=>{r&&i.observe(r)}),()=>{e.current.forEach(r=>{r&&i.unobserve(r)})}},[]);const m=["https://via.placeholder.com/400x200/FF0000/FFFFFF?text=Image+1","https://via.placeholder.com/400x200/00FF00/FFFFFF?text=Image+2","https://ik.imagekit.io/Nekorei/Logo/Nekorei2.png?tr=w-400,h-200,cm-pad"];return n.jsxs(Ne,{className:"my-5",children:[n.jsx(oe,{className:"align-items-center",children:n.jsx(ie,{md:12,children:n.jsxs(J,{controls:!0,transition:"crossfade",className:"mb-5",children:[n.jsxs(O,{children:[n.jsx(_,{className:"d-block w-100",src:"https://via.placeholder.com/1000x500/47877e/fbf82c",alt:"slide 1"}),n.jsxs(L,{className:"d-none d-md-block",children:[n.jsx("h5",{children:"First slide label"}),n.jsx("p",{children:"Some representative placeholder content for the first slide."})]})]}),n.jsxs(O,{children:[n.jsx(_,{className:"d-block w-100",src:"https://via.placeholder.com/1000x500/b29089/fdc87e",alt:"slide 2"}),n.jsxs(L,{className:"d-none d-md-block",children:[n.jsx("h5",{children:"Second slide label"}),n.jsx("p",{children:"Some representative placeholder content for the second slide."})]})]}),n.jsxs(O,{children:[n.jsx(_,{className:"d-block w-100",src:"https://via.placeholder.com/1000x500",alt:"slide 3"}),n.jsxs(L,{className:"d-none d-md-block",children:[n.jsx("h5",{children:"Third slide label"}),n.jsx("p",{children:"Some representative placeholder content for the third slide."})]})]})]})})}),n.jsx(oe,{className:"justify-content-center",children:m.map((i,r)=>n.jsx(ie,{md:6,className:"mb-4",children:n.jsxs(ge,{ref:s=>e.current[r]=s,className:"fade-in-card",children:[n.jsx(je,{orientation:"top",src:i}),n.jsxs(Ee,{children:[n.jsx("h5",{className:"card-title",children:r===0?"Talent Audition":"Our Talents"}),n.jsx(ke,{children:r===0?"Do you have what it takes to be a new talent? Audition now to be part of the wholesome family!":"With more than 230,000 total fans on YouTube and strong presence, our talents are the heart of what we do!"}),n.jsx(xe,{color:r===0?"danger":"primary",children:r===0?"Audition Info":"Talent Info"})]})]})},r))})]})};export{Le as default};
