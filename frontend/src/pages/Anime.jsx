import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiStar, FiPlay, FiSearch, FiFilter } from 'react-icons/fi';
import AdBanner from '../components/AdBanner';
import './Anime.css';

const GENRES = ['All', 'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi', 'Sports'];

function Anime() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [animeList, setAnimeList] = useState([]);
  const [topAnime, setTopAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [page, setPage] = useState(1);
  const [genre, setGenre] = useState('All');

  useEffect(() => { loadTop(); }, []);
  useEffect(() => { loadAnime(); }, [page, genre, searchParams]);

  const loadTop = async () => {
    try {
      const res = await fetch('https://api.jikan.moe/v4/top/anime?limit=5');
      const data = await res.json();
      setTopAnime(data.data || []);
    } catch (e) { console.error(e); }
  };

  const loadAnime = async () => {
    setLoading(true);
    try {
      const q = searchParams.get('q') || '';
      let url = '';
      if (q) {
        url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&page=${page}&limit=12`;
      } else if (genre !== 'All') {
        const genreMap = { Action: 1, Adventure: 2, Comedy: 4, Drama: 8, Fantasy: 10, Horror: 14, Romance: 22, 'Sci-Fi': 24, Sports: 30 };
        url = `https://api.jikan.moe/v4/anime?genres=${genreMap[genre]}&page=${page}&limit=12&order_by=score&sort=desc`;
      } else {
        url = `https://api.jikan.moe/v4/top/anime?page=${page}&limit=12`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setAnimeList(data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      setSearchParams({ q: search.trim() });
      setPage(1);
    }
  };

  return (
    <div className="anime-page">
      <div className="container">
        {/* Header */}
        <div className="anime-header">
          <h1>🎌 Anime</h1>
          <p>Browse thousands of anime series and movies</p>
        </div>

        {/* Search */}
        <form className="anime-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search anime... (e.g. Naruto, One Piece, Attack on Titan)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit"><FiSearch size={18} /></button>
        </form>

        {/* Ad */}
        <AdBanner type="banner" />

        {/* Genre Filter */}
        <div className="anime-genres">
          <FiFilter />
          {GENRES.map(g => (
            <button
              key={g}
              className={`genre-btn ${genre === g ? 'active' : ''}`}
              onClick={() => { setGenre(g); setPage(1); setSearchParams({}); setSearch(''); }}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Top Anime Banner (only on first page) */}
        {page === 1 && topAnime.length > 0 && !searchParams.get('q') && genre === 'All' && (
          <div className="top-anime-section">
            <h2><FiStar /> Top Rated</h2>
            <div className="top-anime-list">
              {topAnime.map((anime, i) => (
                <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id} className="top-anime-card">
                  <span className="top-rank">#{i + 1}</span>
                  <img src={anime.images?.jpg?.image_url} alt={anime.title} />
                  <div className="top-anime-info">
                    <h4>{anime.title}</h4>
                    <span>⭐ {anime.score}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <AdBanner type="in-feed" />

        {/* Anime Grid */}
        {loading ? (
          <div className="loading-screen" style={{ minHeight: '40vh' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="anime-grid">
            {animeList.map(anime => (
              <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id} className="anime-card">
                <div className="anime-card-img">
                  <img src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url} alt={anime.title} />
                  <div className="anime-card-overlay">
                    <FiPlay size={24} />
                  </div>
                  {anime.score && <span className="anime-score">⭐ {anime.score}</span>}
                  {anime.episodes && <span className="anime-eps">{anime.episodes} eps</span>}
                </div>
                <div className="anime-card-body">
                  <h3>{anime.title}</h3>
                  <div className="anime-card-meta">
                    <span>{anime.type || 'TV'}</span>
                    <span>{anime.status}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="pagination">
          <button className="btn btn-secondary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
          <span className="page-info">Page {page}</span>
          <button className="btn btn-secondary" onClick={() => setPage(p => p + 1)} disabled={animeList.length < 12}>Next</button>
        </div>

        <AdBanner type="banner" />
      </div>
    </div>
  );
}

export default Anime;
