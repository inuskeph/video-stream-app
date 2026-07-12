import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import './Auth.css';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const nav = useNavigate();
  const submit = async (e) => { e.preventDefault(); const r=await login(email,password); if(r.success){toast.success('Welcome!');nav('/');}else toast.error(r.message); };
  return (<div className="auth-page"><div className="auth-card">
    <div className="auth-header"><h1>Welcome Back</h1><p>Sign in to continue</p></div>
    <form className="auth-form" onSubmit={submit}>
      <div className="form-group"><label><FiMail/> Email</label><input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
      <div className="form-group"><label><FiLock/> Password</label><input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required/></div>
      <button type="submit" className="btn btn-primary btn-full" disabled={loading}><FiLogIn/> {loading?'Signing in...':'Sign In'}</button>
    </form>
    <div className="auth-footer"><p>No account? <Link to="/register">Sign Up</Link></p></div>
    <div className="auth-demo"><p>Demo:</p><span>admin@streamify.com / admin123</span><span>creator@streamify.com / creator123</span></div>
  </div></div>);
}
export default Login;
