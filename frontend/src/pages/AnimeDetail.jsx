import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiStar, FiCalendar, FiFilm, FiArrowLeft } from 'react-icons/fi';
import AdBanner from '../components/AdBanner';
import './Anime.css';

function AnimeDetail() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAnime(); window.scrollTo(0, 0); }, [id]);

  const loadAnime = async () => {
    setLoading(true);
    try {
      // Rate limit: Jikan allows 3 req/sec, so stagger requests
      const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
      const data = await res.json();
      setAnime(data.data);

      // Wait 1 sec to avoid rate limit
      await new Promise(r => setTimeout(r, 1000));

      const epRes = await fetch(`https://api.jikan.moe/v4/anime/${id}/episodes`);
      const epData = await epRes.json();
      setEpisodes(epData.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="loading-screen"><div className="loading-spinner"></div></div>;
  if (!anime) return <div className="container" style={{ textAlign: 'center', padding: '100px' }}><h2>Anime not found</h2><Link to="/anime" className="btn btn-primary">Back to Anime</Link></div>;

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
            </div>

            <AdBanner type="banner" />

            {/* Episodes */}
            {episodes.length > 0 && (
              <div className="anime-episodes">
                <h3>Episodes ({episodes.length})</h3>
                <div className="episodes-list">
                  {episodes.slice(0, 24).map(ep => (
                    <div key={ep.mal_id} className="episode-item">
                      <span className="ep-number">EP {ep.mal_id}</span>
                      <span className="ep-title">{ep.title || `Episode ${ep.mal_id}`}</span>
                    </div>
                  ))}
                </div>
                {episodes.length > 24 && <p className="more-eps">+ {episodes.length - 24} more episodes</p>}
              </div>
            )}
          </div>
        </div>

        <AdBanner type="banner" />
      </div>
    </div>
  );
}

export default AnimeDetail;
