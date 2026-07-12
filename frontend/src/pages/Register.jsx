import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import './Auth.css';
function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const { register, loading } = useAuth();
  const nav = useNavigate();
  const submit = async (e) => { e.preventDefault(); if(password!==confirm){toast.error('Passwords dont match');return;} const r=await register(username,email,password); if(r.success){toast.success('Welcome!');nav('/');}else toast.error(r.message); };
  return (<div className="auth-page"><div className="auth-card">
    <div className="auth-header"><h1>Create Account</h1><p>Join free</p></div>
    <form className="auth-form" onSubmit={submit}>
      <div className="form-group"><label><FiUser/> Username</label><input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} required/></div>
      <div className="form-group"><label><FiMail/> Email</label><input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
      <div className="form-group"><label><FiLock/> Password</label><input type="password" placeholder="Password (6+ chars)" value={password} onChange={e=>setPassword(e.target.value)} required/></div>
      <div className="form-group"><label><FiLock/> Confirm</label><input type="password" placeholder="Confirm password" value={confirm} onChange={e=>setConfirm(e.target.value)} required/></div>
      <button type="submit" className="btn btn-primary btn-full" disabled={loading}><FiUserPlus/> {loading?'Creating...':'Create Account'}</button>
    </form>
    <div className="auth-footer"><p>Have account? <Link to="/login">Sign In</Link></p></div>
  </div></div>);
}
export default Register;
