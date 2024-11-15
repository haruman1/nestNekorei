import{r as n,j as e,C as v}from"./index-D78BoYcG.js";import{a as P,S as u}from"./sweetalert2.esm.all-BkWV0ahU.js";import{C as x}from"./index.esm-DE85ZETH.js";import{H as E}from"./Helmet-COvbvP3y.js";import{a as R,b as T}from"./CContainer-Do9BA3GG.js";import{C as L,a as B}from"./CRow-CyGxND7d.js";import{C as I,a as A}from"./CCardBody-GFE-fcVc.js";import{C as F}from"./CForm-CWpR11I_.js";import{C as w}from"./CAlert-D1YsfPm2.js";import{C as i,a as l}from"./CInputGroupText-DWu3_p7O.js";import{c as G}from"./cil-user-Ddrdy7PS.js";import{b as c}from"./CFormInput-DSRM3zOj.js";import{c as y}from"./cil-lock-locked-DmxpJbVL.js";import"./Transition-DSsazqEQ.js";const _=()=>{const[s,N]=n.useState({name:"",email:"",password:"",repeatPassword:""}),[j,m]=n.useState(null),[C,g]=n.useState(null),[S,d]=n.useState(!1),a=p=>{const{id:h,value:r}=p.target;N(o=>({...o,[h]:r}))},b=async()=>{const{email:p,name:h,password:r,repeatPassword:o}=s;(!h||!p||!r||!o)&&(m("Silahkan isi semua kolom dengan benar."),g(null)),r!==o&&(m("Passwords don't match."),g(null)),d(!0);const k={name:s.name,email:s.email,role:"admin",password:s.password};P.post("https://x-yq.xyz/users/register",k).then(t=>{t.status===201&&(u.mixin({toast:!0,position:"top-end",showConfirmButton:!1,timer:3e3,timerProgressBar:!0,didOpen:f=>{f.onmouseenter=u.stopTimer,f.onmouseleave=u.resumeTimer}}).fire({icon:"success",title:"Akun sudah terdaftar, silahkan login"}),setTimeout(()=>{d(!1),window.location.href="auth/login"},3e3))}).catch(t=>{d(!1),m(t.response.data.message),console.log("Error registering user:",t)})};return e.jsxs(e.Fragment,{children:[e.jsxs(E,{children:[e.jsx("title",{children:"Register - Nekorei Management"}),e.jsx("meta",{name:"description",content:"Login Page yang tersedia di Nekoreishion Management"})]}),e.jsx("div",{className:"bg-body-tertiary min-vh-100 d-flex flex-row align-items-center",children:e.jsx(R,{children:e.jsx(L,{className:"justify-content-center",children:e.jsx(B,{md:9,lg:7,xl:6,children:e.jsxs(I,{className:"mx-4",children:[e.jsx(A,{className:"p-4",children:e.jsxs(F,{children:[e.jsx("h1",{children:"Register"}),e.jsx("p",{className:"text-body-secondary",children:"Create your account"}),j&&e.jsx(w,{color:"danger",children:j}),C&&e.jsx(w,{color:"sucess",children:C})," ",e.jsxs(i,{className:"mb-3",children:[e.jsx(l,{children:e.jsx(x,{icon:G})}),e.jsx(c,{id:"name",placeholder:"Name",autoComplete:"name",value:s.name,onChange:a})]}),e.jsxs(i,{className:"mb-3",children:[e.jsx(l,{children:"@"}),e.jsx(c,{id:"email",placeholder:"Email",autoComplete:"email",value:s.email,onChange:a})]}),e.jsxs(i,{className:"mb-3",children:[e.jsx(l,{children:e.jsx(x,{icon:y})}),e.jsx(c,{id:"password",type:"password",placeholder:"Password",autoComplete:"new-password",value:s.password,onChange:a})]}),e.jsxs(i,{className:"mb-4",children:[e.jsx(l,{children:e.jsx(x,{icon:y})}),e.jsx(c,{id:"repeatPassword",type:"password",placeholder:"Repeat password",autoComplete:"new-password",value:s.repeatPassword,onChange:a})]}),e.jsx("div",{className:"d-grid",children:S?e.jsx("div",{className:"text-center",children:e.jsx(v,{color:"primary"})}):e.jsx(T,{color:"success",onClick:b,children:"Create Account"})})]})}),"Sudah daftar? Silahkan ",e.jsx("a",{href:"#/auth/login",children:"Login"})]})})})})})]})};export{_ as default};