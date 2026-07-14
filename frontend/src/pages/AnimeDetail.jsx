import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiStar, FiCalendar, FiFilm, FiArrowLeft, FiExternalLink, FiPlay, FiTv, FiX, FiRefreshCw } from 'react-icons/fi';
import AdBanner from '../components/AdBanner';
import './Anime.css';

const INVIDIOUS_INSTANCES = [
  'https://inv.nadeko.net',
  'https://invidious.nerdvpn.de',
  'https://invidious.privacyredirect.com',
  'https://iv.nbohr.de'
];

function AnimeDetail() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [streaming, setStreaming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videoId, setVideoId] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [playerTitle, setPlayerTitle] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');

  useEffect(() => { loadAnime(); window.scrollTo(0, 0); }, [id]);

  const loadAnime = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
      const data = await res.json();
      setAnime(data.data);
      if (data.data?.streaming) setStreaming(data.data.streaming);

      await new Promise(r => setTimeout(r, 1000));
      const epRes = await fetch(`https://api.jikan.moe/v4/anime/${id}/episodes`);
      const epData = await epRes.json();
      setEpisodes(epData.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const searchVideo = async (query, title) => {
    setPlayerTitle(title);
    setShowPlayer(true);
    setVideoId(null);
    setSearching(true);
    setSearchResults([]);
    setCurrentQuery(query);

    for (const instance of INVIDIOUS_INSTANCES) {
      try {
        const res = await fetch(`${instance}/api/v1/search?q=${encodeURIComponent(query)}&type=video&page=1`, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) continue;
        const data = await res.json();
        if (data && data.length > 0) {
          setVideoId(data[0].videoId);
          setSearchResults(data.slice(0, 8));
          setSearching(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      } catch (e) { continue; }
    }

    // All Invidious instances failed - try YouTube search page embed as fallback
    setVideoId(null);
    setSearching(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const playTrailer = () => {
    if (anime?.trailer?.youtube_id) {
      setVideoId(anime.trailer.youtube_id);
      setShowPlayer(true);
      setPlayerTitle('Official Trailer');
      setSearchResults([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Search for trailer on YouTube via Invidious
      searchVideo(`${anime.title} official trailer`, 'Trailer');
    }
  };

  const playEpisode = (epNum, epTitle) => {
    searchVideo(`${anime.title} episode ${epNum} english`, epTitle || `Episode ${epNum}`);
  };

  const playVideoById = (vid, title) => {
    setVideoId(vid);
    setPlayerTitle(title);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tryNextResult = () => {
    const currentIndex = searchResults.findIndex(r => r.videoId === videoId);
    if (currentIndex < searchResults.length - 1) {
      const next = searchResults[currentIndex + 1];
      setVideoId(next.videoId);
      setPlayerTitle(next.title);
    }
  };

  const openOnYouTube = () => {
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(currentQuery)}`, '_blank');
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

  return (
    <div className="anime-detail-page">
      <div className="container">
        <Link to="/anime" className="back-link"><FiArrowLeft /> Back to Anime</Link>

        {showPlayer && (
          <div className="anime-player-section">
            <div className="anime-player-header">
              <h2><FiPlay /> {anime.title} — {playerTitle}</h2>
              <button className="close-player-btn" onClick={() => { setShowPlayer(false); setVideoId(null); setSearchResults([]); }}><FiX size={20} /></button>
            </div>
            <div className="anime-player-wrapper">
              {videoId ? (
                <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`} title={anime.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', color: 'var(--text-muted)' }}>
                  {searching ? (
                    <><div className="loading-spinner"></div><p>Searching for video...</p></>
                  ) : (
                    <><p>Video not found via search</p><button className="btn btn-primary" onClick={openOnYouTube}><FiPlay /> Search on YouTube</button></>
                  )}
                </div>
              )}
            </div>

            {/* Controls: Try next video or search on YouTube */}
            <div className="player-controls">
              {searchResults.length > 1 && (
                <button className="btn btn-secondary" onClick={tryNextResult}><FiRefreshCw size={14} /> Try Next Video</button>
              )}
              <button className="btn btn-ghost" onClick={openOnYouTube}><FiExternalLink size={14} /> Open YouTube Search</button>
            </div>

            {/* More results */}
            {searchResults.length > 1 && (
              <div className="search-results-bar">
                <span>Other results:</span>
                {searchResults.map((r, i) => (
                  <button key={i} onClick={() => playVideoById(r.videoId, r.title)} className={`result-btn ${r.videoId === videoId ? 'active' : ''}`}>
                    {r.title?.substring(0, 45)}{r.title?.length > 45 ? '...' : ''}
                  </button>
                ))}
              </div>
            )}
            <AdBanner type="in-feed" />
          </div>
        )}

        <div className="anime-detail-layout">
          <div className="anime-poster">
            <img src={anime.images?.jpg?.large_image_url} alt={anime.title} />
            <button onClick={playTrailer} className="btn btn-primary trailer-btn"><FiFilm /> Watch Trailer</button>
            <button onClick={() => playEpisode(1, 'Episode 1')} className="btn btn-secondary trailer-btn" style={{ marginTop: '8px' }}><FiPlay /> Watch Episode 1</button>
          </div>

          <div className="anime-detail-info">
            <h1>{anime.title}</h1>
            {anime.title_japanese && <p className="anime-jp-title">{anime.title_japanese}</p>}
            <div className="anime-stats">
              {anime.score && <span className="stat-badge">⭐ {anime.score} / 10</span>}
              <span className="stat-badge"><FiCalendar /> {anime.year || 'N/A'}</span>
              <span className="stat-badge">{anime.type}</span>
              <span className="stat-badge">{anime.episodes ? `${anime.episodes} episodes` : 'Ongoing'}</span>
              <span className="stat-badge">{anime.status}</span>
            </div>
            <div className="anime-genres-list">{anime.genres?.map(g => <span key={g.mal_id} className="genre-tag">{g.name}</span>)}</div>

            <div className="streaming-section">
              <h3><FiTv /> Watch on Streaming Platforms</h3>
              <p className="streaming-note">For best quality, watch on official platforms:</p>
              <div className="streaming-links">
                {getStreamingLinks().map((link, i) => (
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
            <div className="anime-synopsis"><h3>Synopsis</h3><p>{anime.synopsis || 'No synopsis available.'}</p></div>
            <div className="anime-extra-info">
              {anime.studios?.length > 0 && <div className="info-row"><strong>Studio:</strong> {anime.studios.map(s => s.name).join(', ')}</div>}
              {anime.aired?.string && <div className="info-row"><strong>Aired:</strong> {anime.aired.string}</div>}
              {anime.duration && <div className="info-row"><strong>Duration:</strong> {anime.duration}</div>}
              {anime.source && <div className="info-row"><strong>Source:</strong> {anime.source}</div>}
            </div>

            <AdBanner type="banner" />

            {episodes.length > 0 && (
              <div className="anime-episodes">
                <h3><FiPlay /> Episodes ({anime.episodes || episodes.length})</h3>
                <p className="streaming-note">Click to search & play on this page:</p>
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
