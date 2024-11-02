import{r as s,_ as W,R as w,a as q,c as J,P as M,j as e,C as X}from"./index-DsVamXnW.js";import{I as Y,a as Z}from"./imagekitio-react.esm-CMIy3oW-.js";import{a as L}from"./sweetalert2.esm.all-CJaJeW5u.js";import{H as _}from"./Helmet-DiQ4eAka.js";import{a as ee}from"./CContainer-kqqaBj-4.js";import{C as u,a as i}from"./CRow-CkeaoEIw.js";import{C as ae,a as te}from"./CCardBody-PrrWRnlc.js";import{a as R,C as se}from"./CForm-1cRRXMT8.js";import{c as U,C as h,b as k}from"./CFormInput-BKe5CyvR.js";import{C as re}from"./CButton-BtZs5GAv.js";import"./Transition-ilpF5HQZ.js";var A=s.forwardRef(function(t,j){var o,y=t.children,p=t.className,v=t.feedback,x=t.feedbackInvalid,C=t.feedbackValid,f=t.floatingClassName,S=t.floatingLabel,N=t.htmlSize,g=t.id,c=t.invalid,I=t.label,F=t.options,b=t.size,P=t.text,E=t.tooltipFeedback,m=t.valid,n=W(t,["children","className","feedback","feedbackInvalid","feedbackValid","floatingClassName","floatingLabel","htmlSize","id","invalid","label","options","size","text","tooltipFeedback","valid"]);return w.createElement(U,{describedby:n["aria-describedby"],feedback:v,feedbackInvalid:x,feedbackValid:C,floatingClassName:f,floatingLabel:S,id:g,invalid:c,label:I,text:P,tooltipFeedback:E,valid:m},w.createElement("select",q({id:g,className:J("form-select",(o={},o["form-select-".concat(b)]=b,o["is-invalid"]=c,o["is-valid"]=m,o),p),size:N},n,{ref:j}),F?F.map(function(r,T){return w.createElement("option",q({},typeof r=="object"&&r.disabled&&{disabled:r.disabled},typeof r=="object"&&r.value!==void 0&&{value:r.value},{key:T}),typeof r=="string"?r:r.label)}):y))});A.propTypes=q({className:M.string,htmlSize:M.number,options:M.array},U.propTypes);A.displayName="CFormSelect";const fe=()=>{const[t,j]=s.useState(""),[o,y]=s.useState(""),[p,v]=s.useState(""),[x,C]=s.useState(""),[f,S]=s.useState(""),[N,g]=s.useState(""),[c,I]=s.useState({url:"",fileId:""}),[F,b]=s.useState(!1),[P,E]=s.useState([]),[m,n]=s.useState(null),[r,T]=s.useState(null),[B,d]=s.useState(!1),H=async()=>{try{const a=await fetch("https://x-yq.xyz/users/image/auth");if(!a.ok){const Q=await a.text();throw new m(`Request failed with status ${a.status}: ${Q}`)}const l=await a.json(),{signature:z,expire:G,token:O}=l;return{signature:z,expire:G,token:O}}catch(a){K(`Authentication request failed: ${a.message}`),n("Gagal mengupload foto, server sedang bermasalah")}},D=async()=>{(!t||!o||!p||!x||!f||!N||!c)&&(d(!0),n("Silahkan isi semua kolom dengan benar.")),d(!0);const a={name:t,description:o,price:p,sku:x,quantity:f,categoryId:N,image:c.url,imageId:c.fileId};L.post("https://x-yq.xyz/products",a,{headers:{Authorization:"Bearer "+localStorage.getItem("authToken")}}).then(l=>{l.status===201&&(d(!1),T("Produk berhasil ditambahkan."),V(l.data),j(""),y(""),v(""),C(""),S(""),g(""),I(""))}).catch(l=>{d(!1),n(l.response.data.message)})},K=a=>{console.log("Error",a)},V=a=>{d(!1),console.log("Success",a)},$=async()=>{L.get("https://x-yq.xyz/products/categories",{headers:{Authorization:"Bearer "+localStorage.getItem("authToken")}}).then(a=>{if(console.log(a),a.status===200){const l=a.data.data;E(l.map(z=>({id:z.id,name:z.name})))}}).catch(a=>{n("Gagal mengambil data kategori, server sedang bermasalah")})};return s.useEffect(()=>{$()},[]),e.jsxs(e.Fragment,{children:[e.jsxs(_,{children:[e.jsx("title",{children:"Tambah Produk - Nekorei Management"}),e.jsx("meta",{name:"description",content:"Tambah Produk yang tersedia di Nekoreishion Management"})]}),e.jsx(ee,{children:e.jsx(u,{className:"justify-content-center",children:e.jsx(i,{md:8,children:e.jsx(ae,{children:e.jsxs(te,{children:[e.jsx("h3",{className:"mb-4",children:"Tambah Produk"}),r&&e.jsx(R,{color:"success",children:r}),m&&e.jsx(R,{color:"danger",children:m}),e.jsxs(se,{children:[e.jsxs(u,{className:"mb-3",children:[e.jsxs(i,{md:6,children:[e.jsx(h,{htmlFor:"name",children:"Nama Produk"}),e.jsx(k,{type:"text",id:"name",placeholder:"Masukkan nama produk",value:t,onChange:a=>j(a.target.value)})]}),e.jsxs(i,{md:6,children:[e.jsx(h,{htmlFor:"price",children:"Harga"}),e.jsx(k,{type:"number",id:"price",placeholder:"Masukkan harga produk",value:p,onChange:a=>v(a.target.value)})]})]}),e.jsxs(u,{className:"mb-3",children:[e.jsxs(i,{md:6,children:[e.jsx(h,{htmlFor:"sku",children:"SKU"}),e.jsx(k,{type:"text",id:"sku",placeholder:"Masukkan SKU produk",value:x,onChange:a=>C(a.target.value)})]}),e.jsxs(i,{md:6,children:[e.jsx(h,{htmlFor:"quantity",children:"Kuantitas"}),e.jsx(k,{type:"number",id:"quantity",placeholder:"Masukkan jumlah produk",value:f,onChange:a=>S(a.target.value)})]})]}),e.jsx(u,{className:"mb-3",children:e.jsxs(i,{md:12,children:[e.jsx(h,{htmlFor:"description",children:"Deskripsi Produk"}),e.jsx(k,{type:"textarea",id:"description",placeholder:"Masukkan deskripsi produk",value:o,onChange:a=>y(a.target.value)})]})}),e.jsx(u,{className:"mb-3",children:e.jsxs(i,{md:12,children:[e.jsx(h,{htmlFor:"category",children:"Kategori Produk"}),e.jsxs(A,{id:"specificSizeSelect",onChange:a=>g(a.target.value),children:[e.jsx("option",{value:"",children:"--Pilih Kategori--"}),P.map(a=>e.jsx("option",{value:a.id,children:a.name},a.id))]})]})}),e.jsx(u,{className:"mb-3",children:e.jsx(i,{md:12,children:e.jsx(Y,{publicKey:"public_QnAbe++JoAakOIvBBpsbOxvkLPk=",urlEndpoint:"https://ik.imagekit.io/Nekorei",authenticator:H,style:{width:"100%"},children:e.jsxs("label",{style:{display:"inline-block",position:"relative",overflow:"hidden",cursor:"pointer",fontFamily:"Arial, sans-serif",padding:"10px 20px",backgroundColor:F?"#0056b3":"#007bff",color:"#fff",borderRadius:"5px",fontSize:"16px",fontWeight:"600",textAlign:"center",transition:"background-color 0.3s ease"},onMouseEnter:()=>b(!0),onMouseLeave:()=>b(!1),children:[e.jsx(Z,{style:{position:"absolute",top:0,right:0,margin:0,padding:0,fontSize:"20px",cursor:"pointer",opacity:0},onError:K,folder:"/products",onUploadStart:a=>(d(!0),console.log(a)),onSuccess:a=>(I({url:a.url,fileId:a.fileId}),d(!1),console.log(a))}),"Upload an Image"]})})})}),e.jsx(i,{xs:6,children:B?e.jsx("div",{className:"text-center",children:e.jsx(X,{color:"primary"})}):e.jsx(re,{color:"primary",onClick:D,children:"Tambah Produk"})})]})]})})})})})]})};export{fe as default};