import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', headers: { 'Content-Type': 'application/json' } });
api.interceptors.request.use((c) => { const u = JSON.parse(localStorage.getItem('streamify_user')||'null'); if(u?.token) c.headers.Authorization=`Bearer ${u.token}`; return c; });
api.interceptors.response.use((r) => r, (e) => { if(e.response?.status===401){localStorage.removeItem('streamify_user');window.location.href='/login';} return Promise.reject(e); });
export const authAPI = { register:(d)=>api.post('/auth/register',d), login:(d)=>api.post('/auth/login',d), getProfile:()=>api.get('/auth/profile') };
export const videoAPI = { getAll:(p)=>api.get('/videos',{params:p}), getFeatured:()=>api.get('/videos/featured'), getTrending:()=>api.get('/videos/trending'), getById:(id)=>api.get(`/videos/${id}`), create:(d)=>api.post('/videos',d), like:(id)=>api.post(`/videos/${id}/like`), comment:(id,text)=>api.post(`/videos/${id}/comment`,{text}) };
export default api;
