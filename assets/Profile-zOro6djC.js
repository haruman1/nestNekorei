import{r,j as s}from"./index-DUYgz4DX.js";import{a as c}from"./sweetalert2.esm.all-CuWp6mgg.js";import{C as t,a as m}from"./CRow-NYYQzLSh.js";import{C as d,a as i}from"./CCardBody-DdTLzXxm.js";import{C as n}from"./CCardHeader-Bq8JZLL-.js";const C=()=>{const l=async()=>{c.get("http://localhost:3001/users/profile",{headers:{Authorization:`Bearer ${localStorage.getItem("authToken")}`}}).then(e=>{o(e.data),console.log(e.data)}).catch(e=>{console.log(e)})},[a,o]=r.useState({});return r.useEffect(()=>{l()},[]),s.jsx(t,{children:s.jsx(m,{xs:12,children:s.jsxs(d,{className:"mb-4",children:[s.jsx(n,{children:"Profile"}),s.jsxs(i,{children:[s.jsx("p",{className:"text-medium-emphasis small",children:"Here is your profile information"}),s.jsxs("dl",{className:"row mb-0",children:[s.jsx("dt",{className:"col-sm-3",children:"Name"}),s.jsx("dd",{className:"col-sm-9",children:a.name}),s.jsx("dt",{className:"col-sm-3",children:"Email"}),s.jsx("dd",{className:"col-sm-9",children:a.email}),s.jsx("dt",{className:"col-sm-3",children:"Role"}),s.jsx("dd",{className:"col-sm-9",children:a.role})]})]})]})})})};export{C as default};
