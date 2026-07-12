import { Link } from 'react-router-dom';
import { MdOndemandVideo } from 'react-icons/md';
import './Footer.css';
function Footer() {
  return (<footer className="footer"><div className="container"><div className="footer-content">
    <div className="footer-brand"><div className="footer-logo"><MdOndemandVideo size={24}/><span>Streamify</span></div><p className="footer-desc">Watch unlimited free videos. Ad-supported.</p></div>
    <div className="footer-links">
      <div className="footer-col"><h4>Explore</h4><Link to="/browse">Browse</Link><Link to="/browse?category=Education">Education</Link><Link to="/browse?category=Gaming">Gaming</Link></div>
      <div className="footer-col"><h4>Company</h4><a href="#">About</a><a href="#">Contact</a></div>
      <div className="footer-col"><h4>Legal</h4><a href="#">Terms</a><a href="#">Privacy</a></div>
    </div>
  </div><div className="footer-bottom"><p>&copy; 2024 Streamify. Free to watch, ad-supported.</p></div></div></footer>);
}
export default Footer;
