import { useEffect, useRef } from 'react';
import './AdBanner.css';
function AdBanner({ type = 'banner', className = '' }) {
  const adRef = useRef(null);
  useEffect(() => { try { if(window.adsbygoogle)(window.adsbygoogle=window.adsbygoogle||[]).push({}); } catch(e){} }, []);
  const style = type==='banner'?{width:'100%',maxWidth:'728px',height:'90px',margin:'0 auto'}:type==='sidebar'?{width:'300px',height:'250px'}:type==='video-preroll'?{width:'100%',height:'200px'}:{width:'100%',height:'120px'};
  return (<div className={`ad-wrapper ad-${type} ${className}`}><div className="ad-label">Ad</div>
    {/* PRODUCTION: <ins className="adsbygoogle" style={style} data-ad-client="ca-pub-XXXX" data-ad-slot="XXXX" ref={adRef}/> */}
    <div className="ad-placeholder" style={style}><div className="ad-placeholder-content"><span className="ad-icon">📢</span><span className="ad-text">{type==='banner'?'Leaderboard Ad (728x90)':type==='sidebar'?'Sidebar Ad (300x250)':type==='video-preroll'?'Pre-roll Ad':'In-feed Ad'}</span><span className="ad-note">Google AdSense displays here</span></div></div>
  </div>);
}
export default AdBanner;
