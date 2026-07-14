import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiStar, FiCalendar, FiFilm, FiArrowLeft, FiExternalLink, FiPlay, FiTv, FiX } from 'react-icons/fi';
import AdBanner from '../components/AdBanner';
import './Anime.css';

const YT_API_KEY = 'AIzaSyDOwiN7ODgGb4wLcAT7ntn6bXmLrsZDGWQ';

function AnimeDetail() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [streaming, setStreaming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videoId, setVideoId] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [playerTitle, setPlayerTitle] = useState('');

  useEffect(() => { loadAnime(); window.scrollTo(0, 0); }, [id]);

  const loadAnime = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
      const data = await res.json();
      setAnime(data.data);

      if (data.data?.streaming) {
        setStreaming(data.data.streaming);
      }

      // Auto-show trailer if available
      if (data.data?.trailer?.youtube_id) {
        setVideoId(data.data.trailer.youtube_id);
        setShowPlayer(true);
        setPlayerTitle('Trailer');
      }

      await new Promise(r => setTimeout(r, 1000));

      const epRes = await fetch(`https://api.jikan.moe/v4/anime/${id}/episodes`);
      const epData = await epRes.json();
      setEpisodes(epData.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // Search YouTube and play first result
  const searchAndPlay = async (query, title) => {
    setPlayerTitle(title);
    setShowPlayer(true);
    setVideoId(null);

    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1&key=${YT_API_KEY}`);
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        setVideoId(data.items[0].id.videoId);
      } else {
        // Fallback: use trailer
        if (anime?.trailer?.youtube_id) {
          setVideoId(anime.trailer.youtube_id);
          setPlayerTitle('Trailer (Episode not found)');
        }
      }
    } catch (e) {
      // Fallback to trailer
      if (anime?.trailer?.youtube_id) {
        setVideoId(anime.trailer.youtube_id);
        setPlayerTitle('Trailer');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const playTrailer = () => {
    if (anime?.trailer?.youtube_id) {
      setVideoId(anime.trailer.youtube_id);
      setShowPlayer(true);
      setPlayerTitle('Official Trailer');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const playEpisode = (epNum, epTitle) => {
    const query = `${anime.title} episode ${epNum} full`;
    searchAndPlay(query, epTitle || `Episode ${epNum}`);
  };

  const getStreamingLinks = () => {
    if (!anime) return [];
    const title = encodeURIComponent(anime.title);
    const links = [
      { name: 'Crunchyroll', url: `https://www.crunchyroll.com/search?q=${title}`, icon: '🍥' },
      { name: 'Netflix', url: `https://www.netflix.com/search?q=${encodeURIComponent(anime.title)}`, icon: '🎬' },
      { name: 'Hulu', url: `https://www.hulu.com/search?q=${title}`, icon: '📺' },
      { name: 'Funimation', url: `https://www.funimation.com/search/?q=${title}`, icon: '🌟' },
      { name: 'Amazon Prime', url: `https://www.amazon.com/s?k=${title}+anime&i=instant-video`, icon: '📦' }
    ];

    if (streaming.length > 0) {
      streaming.forEach(s => {
        if (!links.find(l => l.name.toLowerCase() === s.name.toLowerCase())) {
          links.unshift({ name: s.name, url: s.url, icon: '🔗', official: true });
        }
      });
    }

    return links;
  };

  if (loading) return <div className="loading-screen"><div className="loading-spinner"></div></div>;
  if (!anime) return <div className="container" style={{ textAlign: 'center', padding: '100px' }}><h2>Anime not found</h2><Link to="/anime" className="btn btn-primary">Back to Anime</Link></div>;

  const streamingLinks = getStreamingLinks();

  return (
    <div className="anime-detail-page">
      <div className="container">
        <Link to="/anime" className="back-link"><FiArrowLeft /> Back to Anime</Link>

        {/* YouTube Embedded Player */}
        {showPlayer && (
          <div className="anime-player-section">
            <div className="anime-player-header">
              <h2><FiPlay /> {anime.title} — {playerTitle}</h2>
              <button className="close-player-btn" onClick={() => { setShowPlayer(false); setVideoId(null); }}><FiX size={20} /></button>
            </div>
            <div className="anime-player-wrapper">
              {videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                  title={anime.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  <div className="loading-spinner"></div>
                </div>
              )}
            </div>
            <AdBanner type="in-feed" />
          </div>
        )}

        <div className="anime-detail-layout">
          {/* Poster */}
          <div className="anime-poster">
            <img src={anime.images?.jpg?.large_image_url} alt={anime.title} />
            {anime.trailer?.youtube_id && (
              <button onClick={playTrailer} className="btn btn-primary trailer-btn">
                <FiFilm /> Watch Trailer
              </button>
            )}
            <button
              onClick={() => playEpisode(1, 'Episode 1')}
              className="btn btn-secondary trailer-btn"
              style={{ marginTop: '8px' }}
            >
              <FiPlay /> Watch Episode 1
            </button>
          </div>

          {/* Info */}
          <div className="anime-detail-info">
            <h1>{anime.title}</h1>
            {anime.title_japanese && <p className="anime-jp-title">{anime.title_japanese}</p>}

            <div className="anime-stats">
              {anime.score && <span className="stat-badge">⭐ {anime.score} / 10</span>}
              <span className="stat-badge"><FiCalendar /> {anime.year || 'N/A'}</span>
              <span className="stat-badge">{anime.type}</span>
              <span className="stat-badge">{anime.episodes ? `${anime.episodes} episodes` : 'Ongoing'}</span>
              <span className="stat-badge">{anime.status}</span>
              <span className="stat-badge">{anime.rating}</span>
            </div>

            <div className="anime-genres-list">
              {anime.genres?.map(g => (
                <span key={g.mal_id} className="genre-tag">{g.name}</span>
              ))}
            </div>

            {/* Streaming Links */}
            <div className="streaming-section">
              <h3><FiTv /> Also Available On</h3>
              <p className="streaming-note">Watch in HD on these platforms:</p>
              <div className="streaming-links">
                {streamingLinks.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className={`streaming-link ${link.official ? 'official' : ''}`}>
                    <span className="streaming-icon">{link.icon}</span>
                    <span className="streaming-name">{link.name}</span>
                    {link.official && <span className="official-badge">Official</span>}
                    <FiExternalLink size={14} />
                  </a>
                ))}
              </div>
            </div>

            <AdBanner type="in-feed" />

            <div className="anime-synopsis">
              <h3>Synopsis</h3>
              <p>{anime.synopsis || 'No synopsis available.'}</p>
            </div>

            <div className="anime-extra-info">
              {anime.studios?.length > 0 && <div className="info-row"><strong>Studio:</strong> {anime.studios.map(s => s.name).join(', ')}</div>}
              {anime.aired?.string && <div className="info-row"><strong>Aired:</strong> {anime.aired.string}</div>}
              {anime.duration && <div className="info-row"><strong>Duration:</strong> {anime.duration}</div>}
              {anime.source && <div className="info-row"><strong>Source:</strong> {anime.source}</div>}
              {anime.members && <div className="info-row"><strong>Members:</strong> {anime.members.toLocaleString()}</div>}
            </div>

            <AdBanner type="banner" />

            {/* Episodes - Click to play */}
            {episodes.length > 0 && (
              <div className="anime-episodes">
                <h3><FiPlay /> Episodes ({anime.episodes || episodes.length})</h3>
                <p className="streaming-note">Click to watch on this page:</p>
                <div className="episodes-list">
                  {episodes.slice(0, 50).map(ep => (
                    <button key={ep.mal_id} onClick={() => playEpisode(ep.mal_id, ep.title || `Episode ${ep.mal_id}`)} className="episode-item">
                      <span className="ep-number">EP {ep.mal_id}</span>
                      <span className="ep-title">{ep.title || `Episode ${ep.mal_id}`}</span>
                      <FiPlay size={12} className="ep-link-icon" />
                    </button>
                  ))}
                </div>
                {episodes.length > 50 && <p className="more-eps">+ {episodes.length - 50} more episodes</p>}
              </div>
            )}

            <AdBanner type="in-feed" />
          </div>
        </div>

        <AdBanner type="banner" />
      </div>
    </div>
  );
}

export default AnimeDetail;
