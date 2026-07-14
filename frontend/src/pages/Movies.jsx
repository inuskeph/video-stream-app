import { useState, useEffect } from 'react';
import { FiFilm, FiPlay, FiX, FiSearch } from 'react-icons/fi';
import AdBanner from '../components/AdBanner';
import './Movies.css';

// Free legal movies from YouTube (public domain & free-to-watch channels)
const FREE_MOVIES = [
  { id: 'YEaSk9VzOsg', title: 'The Last Man on Earth', year: '1964', genre: 'Sci-Fi/Horror', duration: '1h 26m', thumb: 'https://img.youtube.com/vi/YEaSk9VzOsg/hqdefault.jpg', desc: 'A scientist is the sole survivor of a plague that turns people into vampires.' },
  { id: 'L8QKGKj2RnI', title: 'Night of the Living Dead', year: '1968', genre: 'Horror', duration: '1h 36m', thumb: 'https://img.youtube.com/vi/L8QKGKj2RnI/hqdefault.jpg', desc: 'A group of people hide in a farmhouse while the dead return to life.' },
  { id: 'JLFizgfMBmM', title: 'Nosferatu', year: '1922', genre: 'Horror/Classic', duration: '1h 34m', thumb: 'https://img.youtube.com/vi/JLFizgfMBmM/hqdefault.jpg', desc: 'The classic tale of Count Orlok, the original screen vampire.' },
  { id: 'iniDCiMqJ-k', title: 'His Girl Friday', year: '1940', genre: 'Comedy/Romance', duration: '1h 32m', thumb: 'https://img.youtube.com/vi/iniDCiMqJ-k/hqdefault.jpg', desc: 'A newspaper editor schemes to keep his ex-wife from remarrying.' },
  { id: 'RuQLxZ5foHI', title: 'The General', year: '1926', genre: 'Action/Comedy', duration: '1h 7m', thumb: 'https://img.youtube.com/vi/RuQLxZ5foHI/hqdefault.jpg', desc: 'Buster Keaton classic - a train engineer pursues his stolen locomotive during the Civil War.' },
  { id: 'dI3pPOIbuEU', title: 'Kung Fu Killer', year: '2008', genre: 'Action/Martial Arts', duration: '1h 30m', thumb: 'https://img.youtube.com/vi/dI3pPOIbuEU/hqdefault.jpg', desc: 'A martial arts action film about a fighter seeking revenge.' },
  { id: 'f2x0VkxDdQo', title: 'Sherlock Holmes and the Secret Weapon', year: '1943', genre: 'Mystery/Thriller', duration: '1h 8m', thumb: 'https://img.youtube.com/vi/f2x0VkxDdQo/hqdefault.jpg', desc: 'Sherlock Holmes protects a Swiss inventor and his bomb sight from the Nazis.' },
  { id: 'KH7M_PRfxRQ', title: 'The Stranger', year: '1946', genre: 'Thriller/Noir', duration: '1h 35m', thumb: 'https://img.youtube.com/vi/KH7M_PRfxRQ/hqdefault.jpg', desc: 'An investigator hunts a high-ranking Nazi hiding in a small Connecticut town.' },
  { id: 'Qxnlm8gvMNE', title: 'D.O.A.', year: '1949', genre: 'Film Noir', duration: '1h 23m', thumb: 'https://img.youtube.com/vi/Qxnlm8gvMNE/hqdefault.jpg', desc: 'A man who has been poisoned tries to solve his own murder before he dies.' },
  { id: '3_9brFNHM7A', title: 'Voyage to the Planet of Prehistoric Women', year: '1968', genre: 'Sci-Fi', duration: '1h 18m', thumb: 'https://img.youtube.com/vi/3_9brFNHM7A/hqdefault.jpg', desc: 'Astronauts explore Venus and encounter its inhabitants.' },
  { id: 'H5XbAkjOFjE', title: 'Suddenly', year: '1954', genre: 'Thriller', duration: '1h 15m', thumb: 'https://img.youtube.com/vi/H5XbAkjOFjE/hqdefault.jpg', desc: 'Frank Sinatra stars as a hitman who takes over a house to assassinate the president.' },
  { id: 'oNW9s0LaR5w', title: 'Charade', year: '1963', genre: 'Mystery/Romance', duration: '1h 53m', thumb: 'https://img.youtube.com/vi/oNW9s0LaR5w/hqdefault.jpg', desc: 'A woman is pursued by men who want her murdered husband\'s stolen fortune.' },
  { id: 'LvXxaJdWBc0', title: 'The Iron Mask', year: '1929', genre: 'Adventure', duration: '1h 37m', thumb: 'https://img.youtube.com/vi/LvXxaJdWBc0/hqdefault.jpg', desc: 'Douglas Fairbanks swashbuckles in this tale of the Man in the Iron Mask.' },
  { id: 'DY3l36hIVEM', title: 'Carnival of Souls', year: '1962', genre: 'Horror/Mystery', duration: '1h 18m', thumb: 'https://img.youtube.com/vi/DY3l36hIVEM/hqdefault.jpg', desc: 'A woman survives a car accident and is drawn to a mysterious abandoned pavilion.' },
  { id: 'i_4O2IwCm5s', title: 'Plan 9 from Outer Space', year: '1957', genre: 'Sci-Fi/Comedy', duration: '1h 19m', thumb: 'https://img.youtube.com/vi/i_4O2IwCm5s/hqdefault.jpg', desc: 'Aliens resurrect dead humans to stop humanity from creating a doomsday weapon.' },
  { id: '0FmGkPXMjHo', title: 'Little Shop of Horrors', year: '1960', genre: 'Comedy/Horror', duration: '1h 12m', thumb: 'https://img.youtube.com/vi/0FmGkPXMjHo/hqdefault.jpg', desc: 'A florist raises a plant that feeds on human blood. Jack Nicholson appears.' }
];

const GENRES = ['All', 'Horror', 'Sci-Fi', 'Comedy', 'Action', 'Thriller', 'Mystery', 'Film Noir', 'Adventure', 'Classic'];

function Movies() {
  const [movies, setMovies] = useState(FREE_MOVIES);
  const [videoId, setVideoId] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [playerTitle, setPlayerTitle] = useState('');
  const [genre, setGenre] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let filtered = FREE_MOVIES;
    if (genre !== 'All') filtered = filtered.filter(m => m.genre.toLowerCase().includes(genre.toLowerCase()));
    if (search) filtered = filtered.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));
    setMovies(filtered);
  }, [genre, search]);

  const playMovie = (movie) => {
    setVideoId(movie.id);
    setPlayerTitle(movie.title);
    setShowPlayer(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="movies-page">
      <div className="container">
        <div className="movies-header">
          <h1><FiFilm /> Free Movies</h1>
          <p>Watch full-length movies for free — all legal, public domain classics</p>
        </div>

        {/* Player */}
        {showPlayer && (
          <div className="anime-player-section">
            <div className="anime-player-header">
              <h2><FiPlay /> {playerTitle}</h2>
              <button className="close-player-btn" onClick={() => { setShowPlayer(false); setVideoId(null); }}><FiX size={20} /></button>
            </div>
            <div className="anime-player-wrapper">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title={playerTitle}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <AdBanner type="in-feed" />
          </div>
        )}

        <AdBanner type="banner" />

        {/* Search & Filter */}
        <div className="movies-controls">
          <form className="anime-search" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Search movies..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <button type="submit"><FiSearch size={18} /></button>
          </form>
          <div className="anime-genres">
            {GENRES.map(g => (
              <button key={g} className={`genre-btn ${genre === g ? 'active' : ''}`} onClick={() => setGenre(g)}>{g}</button>
            ))}
          </div>
        </div>

        {/* Movies Grid */}
        <div className="movies-grid">
          {movies.map(movie => (
            <div key={movie.id} className="movie-card" onClick={() => playMovie(movie)}>
              <div className="movie-card-img">
                <img src={movie.thumb} alt={movie.title} />
                <div className="movie-card-overlay"><FiPlay size={30} /></div>
                <span className="movie-duration">{movie.duration}</span>
                <span className="movie-year">{movie.year}</span>
              </div>
              <div className="movie-card-body">
                <h3>{movie.title}</h3>
                <span className="movie-genre">{movie.genre}</span>
                <p className="movie-desc">{movie.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {movies.length === 0 && <div className="no-results"><h2>No movies found</h2><p>Try a different filter</p></div>}

        <AdBanner type="banner" />
      </div>
    </div>
  );
}

export default Movies;
