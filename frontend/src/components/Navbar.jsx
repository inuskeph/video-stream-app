import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMenu, FiX, FiUpload, FiLogOut, FiUser } from 'react-icons/fi';
import { MdOndemandVideo } from 'react-icons/md';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';
function Navbar() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const nav = useNavigate();
  const search = (e) => { e.preventDefault(); if(q.trim()){nav(`/browse?search=${encodeURIComponent(q.trim())}`);setQ('');} };
  return (<nav className="navbar"><div className="navbar-container">
    <Link to="/" className="navbar-logo"><MdOndemandVideo size={28}/><span>Streamify</span></Link>
    <form className="navbar-search" onSubmit={search}><input type="text" placeholder="Search videos..." value={q} onChange={e=>setQ(e.target.value)}/><button type="submit" className="search-btn"><FiSearch size={18}/></button></form>
    <div className={`navbar-links ${open?'active':''}`}>
      <Link to="/browse" className="nav-link" onClick={()=>setOpen(false)}>Browse</Link>
      <Link to="/anime" className="nav-link" onClick={()=>setOpen(false)}>Anime</Link>
      <Link to="/movies" className="nav-link" onClick={()=>setOpen(false)}>Movies</Link>
      <Link to="/live" className="nav-link" onClick={()=>setOpen(false)}>Live TV</Link>
      {isAuthenticated ? (<>
        {(user.role==='admin'||user.role==='creator')&&<Link to="/upload" className="nav-link"><FiUpload/> Upload</Link>}
        <div className="nav-user"><FiUser/><span>{user.username}</span></div>
        <button className="btn btn-ghost" onClick={()=>{logout();setOpen(false);}}><FiLogOut/> Logout</button>
      </>) : (<><Link to="/login" className="nav-link">Sign In</Link><Link to="/register" className="btn btn-primary">Sign Up</Link></>)}
    </div>
    <button className="mobile-toggle" onClick={()=>setOpen(!open)}>{open?<FiX size={24}/>:<FiMenu size={24}/>}</button>
  </div></nav>);
}
export default Navbar;
