import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiStar, FiCalendar, FiFilm, FiArrowLeft, FiExternalLink, FiPlay, FiTv } from 'react-icons/fi';
import AdBanner from '../components/AdBanner';
import './Anime.css';

function AnimeDetail() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [streaming, setStreaming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAnime(); window.scrollTo(0, 0); }, [id]);

  const loadAnime = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
      const data = await res.json();
      setAnime(data.data);

      // Get streaming links
      if (data.data?.streaming) {
        setStreaming(data.data.streaming);
      }

      await new Promise(r => setTimeout(r, 1000));

      const epRes = await fetch(`https://api.jikan.moe/v4/anime/${id}/episodes`);
      const epData = await epRes.json();
      setEpisodes(epData.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // Generate streaming links based on anime title
  const getStreamingLinks = () => {
    if (!anime) return [];
    const title = encodeURIComponent(anime.title);
    const links = [
      { name: 'Crunchyroll', url: `https://www.crunchyroll.com/search?q=${title}`, icon: '🍥', color: '#f47521' },
      { name: 'YouTube', url: `https://www.youtube.com/results?search_query=${title}+full+episode`, icon: '▶️', color: '#ff0000' },
      { name: 'Netflix', url: `https://www.netflix.com/search?q=${encodeURIComponent(anime.title)}`, icon: '🎬', color: '#e50914' },
      { name: 'Hulu', url: `https://www.hulu.com/search?q=${title}`, icon: '📺', color: '#1ce783' },
      { name: 'Funimation', url: `https://www.funimation.com/search/?q=${title}`, icon: '🌟', color: '#5b0bb5' },
      { name: 'Amazon Prime', url: `https://www.amazon.com/s?k=${title}+anime&i=instant-video`, icon: '📦', color: '#00a8e1' }
    ];

    // Add official streaming links from Jikan API
    if (streaming.length > 0) {
      streaming.forEach(s => {
        if (!links.find(l => l.name.toLowerCase() === s.name.toLowerCase())) {
          links.unshift({ name: s.name, url: s.url, icon: '🔗', color: 'var(--primary)', official: true });
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

        <div className="anime-detail-layout">
          {/* Poster */}
          <div className="anime-poster">
            <img src={anime.images?.jpg?.large_image_url} alt={anime.title} />
            {anime.trailer?.url && (
              <a href={anime.trailer.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary trailer-btn">
                <FiFilm /> Watch Trailer
              </a>
            )}
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
              <h3><FiTv /> Watch This Anime</h3>
              <p className="streaming-note">Choose a legal streaming platform:</p>
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

            {/* Episodes */}
            {episodes.length > 0 && (
              <div className="anime-episodes">
                <h3><FiPlay /> Episodes ({anime.episodes || episodes.length})</h3>
                <div className="episodes-list">
                  {episodes.slice(0, 24).map(ep => (
                    <a
                      key={ep.mal_id}
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(anime.title)}+episode+${ep.mal_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="episode-item"
                    >
                      <span className="ep-number">EP {ep.mal_id}</span>
                      <span className="ep-title">{ep.title || `Episode ${ep.mal_id}`}</span>
                      <FiExternalLink size={12} className="ep-link-icon" />
                    </a>
                  ))}
                </div>
                {episodes.length > 24 && <p className="more-eps">+ {episodes.length - 24} more episodes</p>}
              </div>
            )}

            <AdBanner type="in-feed" />

            {/* Related/Recommendations placeholder */}
            <div className="streaming-section" style={{ marginTop: '30px' }}>
              <h3>📢 Support the Creators</h3>
              <p className="streaming-note">Watch anime legally to support the studios that make your favorite shows! Subscribe to official platforms for the best quality and latest episodes.</p>
            </div>
          </div>
        </div>

        <AdBanner type="banner" />
      </div>
    </div>
  );
}

export default AnimeDetail;
