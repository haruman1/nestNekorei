import{r,_ as p,R as t,a as b,c as C,P as s,b as x}from"./index-DUYgz4DX.js";import{C as k}from"./sweetalert2.esm.all-CuWp6mgg.js";import{u as F,T as P}from"./Transition-B8X7oyuP.js";var N=r.forwardRef(function(e,l){var o=e.children,n=e.className,a=e.color,i=a===void 0?"primary":a,d=e.dismissible,R=e.variant,m=e.visible,c=m===void 0?!0:m,E=e.onClose,y=p(e,["children","className","color","dismissible","variant","visible","onClose"]),f=r.useRef(null),T=F(l,f),u=r.useState(c),g=u[0],v=u[1];return r.useEffect(function(){v(c)},[c]),t.createElement(P,{in:g,mountOnEnter:!0,nodeRef:f,onExit:E,timeout:150,unmountOnExit:!0},function(w){return t.createElement("div",b({className:C("alert",R==="solid"?"bg-".concat(i," text-white"):"alert-".concat(i),{"alert-dismissible fade":d,show:w==="entered"},n),role:"alert"},y,{ref:T}),o,d&&t.createElement(k,{onClick:function(){return v(!1)}}))})});N.propTypes={children:s.node,className:s.string,color:x.isRequired,dismissible:s.bool,onClose:s.func,variant:s.string,visible:s.bool};N.displayName="CAlert";var h=r.forwardRef(function(e,l){var o=e.children,n=e.className,a=e.validated,i=p(e,["children","className","validated"]);return t.createElement("form",b({className:C({"was-validated":a},n)||void 0},i,{ref:l}),o)});h.propTypes={children:s.node,className:s.string,validated:s.bool};h.displayName="CForm";export{h as C,N as a};
