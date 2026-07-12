import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => { const s=localStorage.getItem('streamify_user'); return s?JSON.parse(s):null; });
  const [loading, setLoading] = useState(false);
  useEffect(() => { user ? localStorage.setItem('streamify_user',JSON.stringify(user)) : localStorage.removeItem('streamify_user'); }, [user]);
  const login = async (email, password) => { setLoading(true); try { const {data}=await authAPI.login({email,password}); setUser(data); return {success:true}; } catch(e){return{success:false,message:e.response?.data?.message||'Failed'};} finally{setLoading(false);} };
  const register = async (username, email, password) => { setLoading(true); try { const {data}=await authAPI.register({username,email,password}); setUser(data); return {success:true}; } catch(e){return{success:false,message:e.response?.data?.message||'Failed'};} finally{setLoading(false);} };
  const logout = () => { setUser(null); localStorage.removeItem('streamify_user'); };
  return <AuthContext.Provider value={{user,login,register,logout,loading,isAuthenticated:!!user}}>{children}</AuthContext.Provider>;
}
export function useAuth() { const c=useContext(AuthContext); if(!c)throw new Error('useAuth must be in AuthProvider'); return c; }
