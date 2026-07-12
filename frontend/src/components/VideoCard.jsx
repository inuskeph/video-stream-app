import { Link } from 'react-router-dom';
import { FiEye, FiClock } from 'react-icons/fi';
import './VideoCard.css';
function VideoCard({ video }) {
  const fmtViews = (v) => v>=1e6?`${(v/1e6).toFixed(1)}M`:v>=1e3?`${(v/1e3).toFixed(1)}K`:v;
  const fmtDur = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;
  const id = video._id || video.id;
  return (<Link to={`/video/${id}`} className="video-card">
    <div className="video-card-thumb">
      <img src={video.thumbnailUrl || video.thumbnail_url || 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400'} alt={video.title} loading="lazy"/>
      {video.duration>0&&<span className="video-duration"><FiClock size={10}/>{fmtDur(video.duration)}</span>}
      <div className="video-card-overlay"><span>Watch Now</span></div>
    </div>
    <div className="video-card-info">
      <h3 className="video-card-title">{video.title}</h3>
      <div className="video-card-meta"><span className="video-card-uploader">{video.uploader?.username||'Unknown'}</span>
      <div className="video-card-stats"><span><FiEye size={12}/> {fmtViews(video.views)}</span></div></div>
      <span className="video-card-category">{video.category}</span>
    </div>
  </Link>);
}
export default VideoCard;
