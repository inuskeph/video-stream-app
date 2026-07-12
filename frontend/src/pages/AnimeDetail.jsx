import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiStar, FiCalendar, FiFilm, FiArrowLeft, FiExternalLink, FiPlay, FiTv, FiX } from 'react-icons/fi';
import AdBanner from '../components/AdBanner';
import './Anime.css';

function AnimeDetail() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [streaming, setStreaming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null); // YouTube embed search query
  const [showPlayer, setShowPlayer] = useState(false);

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

      // Auto-play trailer if available
      if (data.data?.trailer?.youtube_id) {
        setActiveVideo(data.data.trailer.youtube_id);
        setShowPlayer(true);
      }

      await new Promise(r => setTimeout(r, 1000));

      const epRes = await fetch(`https://api.jikan.moe/v4/anime/${id}/episodes`);
      const epData = await epRes.json();
      setEpisodes(epData.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const playEpisode = (epNum) => {
    const query = `${anime.title} episode ${epNum}`;
    setActiveVideo(null);
    setShowPlayer(true);
    // Use YouTube search embed
    setActiveVideo(`search_${encodeURIComponent(query)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const playTrailer = () => {
    if (anime?.trailer?.youtube_id) {
      setActiveVideo(anime.trailer.youtube_id);
      setShowPlayer(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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

  // Get YouTube embed URL
  const getEmbedUrl = () => {
    if (!activeVideo) return '';
    if (activeVideo.startsWith('search_')) {
      const query = activeVideo.replace('search_', '');
      return `https://www.youtube.com/embed?listType=search&list=${query}`;
    }
    return `https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`;
  };

  return (
    <div className="anime-detail-page">
      <div className="container">
        <Link to="/anime" className="back-link"><FiArrowLeft /> Back to Anime</Link>

        {/* YouTube Embedded Player */}
        {showPlayer && (
          <div className="anime-player-section">
            <div className="anime-player-header">
              <h2><FiPlay /> Now Playing: {anime.title}</h2>
              <button className="close-player-btn" onClick={() => setShowPlayer(false)}><FiX size={20} /></button>
            </div>
            <div className="anime-player-wrapper">
              <iframe
                src={getEmbedUrl()}
                title={anime.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
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
            {/* Quick play button */}
            <button
              onClick={() => playEpisode(1)}
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

            {/* WATCH NOW - Streaming Links */}
            <div className="streaming-section">
              <h3><FiTv /> Watch on Other Platforms</h3>
              <p className="streaming-note">Also available on these legal platforms:</p>
              <div className="streaming-links">
                {streamingLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`streaming-link ${link.official ? 'official' : ''}`}
                  >
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

            {/* Additional Info */}
            <div className="anime-extra-info">
              {anime.studios?.length > 0 && (
                <div className="info-row"><strong>Studio:</strong> {anime.studios.map(s => s.name).join(', ')}</div>
              )}
              {anime.aired?.string && (
                <div className="info-row"><strong>Aired:</strong> {anime.aired.string}</div>
              )}
              {anime.duration && (
                <div className="info-row"><strong>Duration:</strong> {anime.duration}</div>
              )}
              {anime.source && (
                <div className="info-row"><strong>Source:</strong> {anime.source}</div>
              )}
              {anime.members && (
                <div className="info-row"><strong>Members:</strong> {anime.members.toLocaleString()}</div>
              )}
            </div>

            <AdBanner type="banner" />

            {/* Episodes - Click to play on site */}
            {episodes.length > 0 && (
              <div className="anime-episodes">
                <h3><FiPlay /> Episodes ({anime.episodes || episodes.length})</h3>
                <p className="streaming-note">Click an episode to watch on this page:</p>
                <div className="episodes-list">
                  {episodes.slice(0, 50).map(ep => (
                    <button
                      key={ep.mal_id}
                      onClick={() => playEpisode(ep.mal_id)}
                      className="episode-item"
                    >
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
