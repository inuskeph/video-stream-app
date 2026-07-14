import { useState } from 'react';
import { FiRadio, FiPlay, FiX, FiUsers } from 'react-icons/fi';
import AdBanner from '../components/AdBanner';
import './LiveTV.css';

// Free 24/7 YouTube live streams
const CHANNELS = [
  // News
  { id: 'w_Ma8oQLmSM', title: 'ABC News Live', category: 'News', thumb: 'https://img.youtube.com/vi/w_Ma8oQLmSM/hqdefault.jpg', desc: '24/7 live news coverage from ABC News', viewers: '15K' },
  { id: 'GE_SfNVNyqk', title: 'NBC News NOW', category: 'News', thumb: 'https://img.youtube.com/vi/GE_SfNVNyqk/hqdefault.jpg', desc: 'Live news, breaking stories and events', viewers: '12K' },
  { id: '9Auq9mYxFEE', title: 'Sky News', category: 'News', thumb: 'https://img.youtube.com/vi/9Auq9mYxFEE/hqdefault.jpg', desc: 'Live news from around the world', viewers: '20K' },
  { id: 'X1CJTH9Bsqk', title: 'DW News', category: 'News', thumb: 'https://img.youtube.com/vi/X1CJTH9Bsqk/hqdefault.jpg', desc: 'German international news channel', viewers: '8K' },
  { id: 'F-POY4Q0QSI', title: 'France 24 English', category: 'News', thumb: 'https://img.youtube.com/vi/F-POY4Q0QSI/hqdefault.jpg', desc: 'International news from France', viewers: '6K' },
  // Music
  { id: '5qap5aO4i9A', title: 'Lofi Hip Hop Radio', category: 'Music', thumb: 'https://img.youtube.com/vi/5qap5aO4i9A/hqdefault.jpg', desc: 'Beats to relax/study to - 24/7 lofi music', viewers: '35K' },
  { id: 'rUxyKA_-grg', title: 'Chillhop Radio', category: 'Music', thumb: 'https://img.youtube.com/vi/rUxyKA_-grg/hqdefault.jpg', desc: 'Jazzy & lofi hip hop beats 24/7', viewers: '10K' },
  { id: 'HuFYqnbVbzY', title: 'Synthwave Radio', category: 'Music', thumb: 'https://img.youtube.com/vi/HuFYqnbVbzY/hqdefault.jpg', desc: '24/7 synthwave/retro electronic music', viewers: '5K' },
  { id: '7NOSDKb0HlU', title: 'Coffee Shop Radio', category: 'Music', thumb: 'https://img.youtube.com/vi/7NOSDKb0HlU/hqdefault.jpg', desc: 'Relaxing jazz & bossa nova for work/study', viewers: '8K' },
  // Nature / Relaxation
  { id: 'rvsEnmqFHsY', title: 'Relaxing Nature Sounds', category: 'Nature', thumb: 'https://img.youtube.com/vi/rvsEnmqFHsY/hqdefault.jpg', desc: 'Live nature cam with ambient sounds', viewers: '4K' },
  { id: 'ydYDqZQpim8', title: 'Space Station Earth View', category: 'Nature', thumb: 'https://img.youtube.com/vi/ydYDqZQpim8/hqdefault.jpg', desc: 'NASA ISS live view of Earth from space', viewers: '9K' },
  // Gaming
  { id: 'dp8PhLsUcFE', title: 'Riot Games Esports', category: 'Gaming', thumb: 'https://img.youtube.com/vi/dp8PhLsUcFE/hqdefault.jpg', desc: 'League of Legends esports & events', viewers: '25K' },
  // Education
  { id: 'nHCXZC2InAA', title: 'NASA Live', category: 'Education', thumb: 'https://img.youtube.com/vi/nHCXZC2InAA/hqdefault.jpg', desc: 'NASA TV - space missions & science', viewers: '7K' },
  // Animals
  { id: 'cJHEpMpvBOk', title: 'Animal Planet Live', category: 'Animals', thumb: 'https://img.youtube.com/vi/cJHEpMpvBOk/hqdefault.jpg', desc: 'Live animal cams from around the world', viewers: '3K' },
  { id: 'Y54ABqSOScQ', title: 'Monterey Bay Aquarium', category: 'Animals', thumb: 'https://img.youtube.com/vi/Y54ABqSOScQ/hqdefault.jpg', desc: 'Live jellyfish cam - relaxing underwater', viewers: '6K' },
];

const CATEGORIES = ['All', 'News', 'Music', 'Nature', 'Gaming', 'Education', 'Animals'];

function LiveTV() {
  const [videoId, setVideoId] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [playerTitle, setPlayerTitle] = useState('');
  const [category, setCategory] = useState('All');

  const filteredChannels = category === 'All' ? CHANNELS : CHANNELS.filter(c => c.category === category);

  const playChannel = (channel) => {
    setVideoId(channel.id);
    setPlayerTitle(channel.title);
    setShowPlayer(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="livetv-page">
      <div className="container">
        <div className="livetv-header">
          <h1><FiRadio /> Live TV <span className="live-badge"><span className="channel-live-dot"></span> LIVE</span></h1>
          <p>Watch free live streams — news, music, nature, gaming & more</p>
        </div>

        {/* Player */}
        {showPlayer && (
          <div className="anime-player-section">
            <div className="anime-player-header">
              <h2><FiRadio /> {playerTitle} <span className="live-badge"><span className="channel-live-dot"></span> LIVE</span></h2>
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

        {/* Category Filter */}
        <div className="livetv-categories">
          {CATEGORIES.map(c => (
            <button key={c} className={`genre-btn ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>

        {/* Channels Grid */}
        <div className="livetv-grid">
          {filteredChannels.map(channel => (
            <div key={channel.id} className={`channel-card ${videoId === channel.id ? 'active' : ''}`} onClick={() => playChannel(channel)}>
              <div className="channel-card-img">
                <img src={channel.thumb} alt={channel.title} />
                <span className="channel-live-badge"><span className="channel-live-dot"></span> LIVE</span>
                <div className="channel-card-overlay"><FiPlay size={30} /></div>
              </div>
              <div className="channel-card-body">
                <h3>{channel.title}</h3>
                <span className="channel-category">{channel.category}</span>
                <p className="channel-desc">{channel.desc}</p>
                <div className="channel-viewers"><FiUsers size={12} /> {channel.viewers} watching</div>
              </div>
            </div>
          ))}
        </div>

        <AdBanner type="banner" />
      </div>
    </div>
  );
}

export default LiveTV;
