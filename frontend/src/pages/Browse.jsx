import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiGrid, FiFilter } from 'react-icons/fi';
import VideoCard from '../components/VideoCard';
import AdBanner from '../components/AdBanner';
import { videoAPI } from '../utils/api';
import './Browse.css';
const CATS = ['All','Entertainment','Education','Music','Sports','Gaming','News','Technology','Comedy','Lifestyle'];
function Browse() {
  const [sp, setSp] = useSearchParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [cat, setCat] = useState(sp.get('category')||'All');
  const search = sp.get('search')||'';
  useEffect(() => { (async()=>{ setLoading(true); try { const p={page,limit:12}; if(cat!=='All')p.category=cat; if(search)p.search=search; const {data}=await videoAPI.getAll(p); setVideos(data.videos||[]);setPages(data.pages||1); } catch(e){} finally{setLoading(false);} })(); }, [page,cat,search]);
  const changeCat = (c) => { setCat(c);setPage(1);setSp(c!=='All'?{category:c}:{}); };
  return (<div className="browse"><div className="container">
    <div className="browse-header"><h1><FiGrid/> {search?`Search: "${search}"`:'Browse Videos'}</h1></div>
    <AdBanner type="banner"/>
    <div className="category-filter"><FiFilter/><div className="category-list">{CATS.map(c=><button key={c} className={`category-btn ${cat===c?'active':''}`} onClick={()=>changeCat(c)}>{c}</button>)}</div></div>
    {loading?<div className="loading-screen"><div className="loading-spinner"></div></div>:videos.length>0?<><div className="video-grid">{videos.map(v=><VideoCard key={v._id} video={v}/>)}</div>{pages>1&&<div className="pagination"><button className="btn btn-secondary" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>Prev</button><span className="page-info">Page {page}/{pages}</span><button className="btn btn-secondary" onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={page===pages}>Next</button></div>}</>:<div className="no-results"><h2>No videos found</h2></div>}
    <AdBanner type="banner"/>
  </div></div>);
}
export default Browse;
