import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import VideoPlayer from './pages/VideoPlayer';
import Browse from './pages/Browse';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import Anime from './pages/Anime';
import AnimeDetail from './pages/AnimeDetail';
import Movies from './pages/Movies';
import LiveTV from './pages/LiveTV';
function App() {
  return (<div className="app">
    <Toaster position="top-right" toastOptions={{style:{background:'#1a1a2e',color:'#fff',border:'1px solid #2d2d4e'}}}/>
    <Navbar />
    <main style={{minHeight:'calc(100vh - 140px)',paddingTop:'70px'}}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/video/:id" element={<VideoPlayer />} />
        <Route path="/anime" element={<Anime />} />
        <Route path="/anime/:id" element={<AnimeDetail />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/live" element={<LiveTV />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </main>
    <Footer />
  </div>);
}
export default App;
