import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiStar, FiPlay } from 'react-icons/fi';
import VideoCard from '../components/VideoCard';
import AdBanner from '../components/AdBanner';
import { videoAPI } from '../utils/api';
import './Home.css';
function Home() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { (async()=>{ try { const [f,t,l]=await Promise.all([videoAPI.getFeatured(),videoAPI.getTrending(),videoAPI.getAll({limit:8})]); setFeatured(f.data);setTrending(t.data);setLatest(l.data.videos||[]); } catch(e){} finally{setLoading(false);} })(); }, []);
  if (loading) return <div className="loading-screen"><div className="loading-spinner"></div></div>;
  return (<div className="home">
    <section className="hero"><div className="container"><div className="hero-content">
      <h1 className="hero-title">Watch <span className="gradient-text">Unlimited</span> Videos for Free</h1>
      <p className="hero-subtitle">Stream entertainment, education, gaming, music, and more. No subscription needed.</p>
      <div className="hero-actions"><Link to="/browse" className="btn btn-primary btn-lg"><FiPlay/> Start Watching</Link><Link to="/register" className="btn btn-secondary btn-lg">Create Account</Link></div>
      <div className="hero-stats"><div className="stat"><span className="stat-num">10K+</span><span className="stat-label">Videos</span></div><div className="stat"><span className="stat-num">50K+</span><span className="stat-label">Users</span></div><div className="stat"><span className="stat-num">Free</span><span className="stat-label">Forever</span></div></div>
    </div></div></section>
    <div className="container"><AdBanner type="banner"/></div>
    {featured.length>0&&<section className="section"><div className="container"><div className="section-header"><h2><FiStar className="section-icon"/> Featured</h2><Link to="/browse" className="see-all">See All</Link></div><div className="video-grid">{featured.map(v=><VideoCard key={v._id} video={v}/>)}</div></div></section>}
    <div className="container"><AdBanner type="in-feed"/></div>
    {trending.length>0&&<section className="section"><div className="container"><div className="section-header"><h2><FiTrendingUp className="section-icon"/> Trending</h2></div><div className="video-grid">{trending.slice(0,8).map(v=><VideoCard key={v._id} video={v}/>)}</div></div></section>}
    <div className="container"><AdBanner type="banner"/></div>
    {latest.length>0&&<section className="section"><div className="container"><div className="section-header"><h2>Latest</h2></div><div className="video-grid">{latest.map(v=><VideoCard key={v._id} video={v}/>)}</div></div></section>}
  </div>);
}
export default Home;
