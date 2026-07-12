import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiThumbsUp, FiShare2, FiEye } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import AdBanner from '../components/AdBanner';
import { videoAPI } from '../utils/api';
import toast from 'react-hot-toast';
import './VideoPlayer.css';
function VideoPlayer() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [video, setVideo] = useState(null);
  const [related, setRelated] = useState([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAd, setShowAd] = useState(true);
  useEffect(() => { load(); window.scrollTo(0,0); }, [id]);
  const load = async () => { setLoading(true);setShowAd(true); try { const [v,r]=await Promise.all([videoAPI.getById(id),videoAPI.getAll({limit:6})]); setVideo(v.data);setRelated(r.data.videos?.filter(x=>x._id!==id)||[]); } catch(e){toast.error('Failed');} finally{setLoading(false);} };
  useEffect(() => { if(showAd&&video){const t=setTimeout(()=>setShowAd(false),5000);return()=>clearTimeout(t);} }, [showAd,video]);
  const like = async () => { if(!isAuthenticated){toast.error('Login required');return;} try{const{data}=await videoAPI.like(id);setVideo(p=>({...p,likes:data.likes}));}catch(e){} };
  const postComment = async (e) => { e.preventDefault(); if(!isAuthenticated||!comment.trim())return; try{const{data}=await videoAPI.comment(id,comment);setVideo(p=>({...p,comments:data}));setComment('');toast.success('Posted!');}catch(e){} };
  if(loading) return <div className="loading-screen"><div className="loading-spinner"></div></div>;
  if(!video) return <div className="container" style={{textAlign:'center',padding:'100px'}}><h2>Not found</h2><Link to="/" className="btn btn-primary">Home</Link></div>;
  return (<div className="video-page"><div className="container"><div className="video-layout">
    <div className="video-player-section">
      {showAd?<div className="player-wrapper" style={{display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}><AdBanner type="video-preroll"/><p style={{color:'var(--text-muted)',fontSize:'13px',marginTop:'8px'}}>Video plays in 5s...</p></div>
      :<div className="player-wrapper"><video src={video.videoUrl} controls autoPlay poster={video.thumbnailUrl}/></div>}
      <div className="video-info"><h1>{video.title}</h1><div className="video-meta"><span><FiEye/> {video.views?.toLocaleString()} views</span><div className="video-actions"><button className="action-btn" onClick={like}><FiThumbsUp/> {video.likes}</button><button className="action-btn" onClick={()=>{navigator.clipboard.writeText(window.location.href);toast.success('Copied!');}}><FiShare2/> Share</button></div></div></div>
      <div className="uploader-info"><div className="uploader-avatar">{video.uploader?.username?.[0]||'U'}</div><div><h3>{video.uploader?.username}</h3><span>{video.category}</span></div></div>
      <div className="video-description"><p>{video.description||'No description.'}</p>{video.tags?.length>0&&<div className="video-tags">{video.tags.map((t,i)=><Link key={i} to={`/browse?search=${t}`} className="video-tag">#{t}</Link>)}</div>}</div>
      <AdBanner type="in-feed"/>
      <div className="comments-section"><h3>{video.comments?.length||0} Comments</h3>
        <form className="comment-form" onSubmit={postComment}><input placeholder={isAuthenticated?'Add comment...':'Login to comment'} value={comment} onChange={e=>setComment(e.target.value)} disabled={!isAuthenticated}/><button type="submit" disabled={!comment.trim()}>Post</button></form>
        {video.comments?.map((c,i)=><div key={i} className="comment-item"><div className="comment-avatar">{c.user?.username?.[0]||'U'}</div><div><span className="comment-author">{c.user?.username}</span><p className="comment-text">{c.text}</p></div></div>)}
      </div>
    </div>
    <aside className="video-sidebar"><AdBanner type="sidebar"/><h3 className="sidebar-title">Related</h3>
      {related.map(v=><Link to={`/video/${v._id}`} key={v._id} className="related-video"><div className="related-thumb"><img src={v.thumbnailUrl||'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=200'} alt={v.title}/></div><div className="related-info"><h4>{v.title}</h4><span>{v.views?.toLocaleString()} views</span></div></Link>)}
      <AdBanner type="sidebar"/>
    </aside>
  </div></div></div>);
}
export default VideoPlayer;
