import { useEffect, useRef } from 'react';
import './AdBanner.css';

function AdBanner({ type = 'banner', className = '' }) {
  const adRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!pushed.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch (e) {}
    }
  }, []);

  const getStyle = () => {
    switch (type) {
      case 'banner': return { display: 'block', width: '100%', maxWidth: '728px', height: '90px', margin: '0 auto' };
      case 'sidebar': return { display: 'block', width: '300px', height: '250px' };
      case 'video-preroll': return { display: 'block', width: '100%', height: '200px' };
      case 'in-feed': return { display: 'block', width: '100%', height: '120px' };
      default: return { display: 'block' };
    }
  };

  return (
    <div className={`ad-wrapper ad-${type} ${className}`}>
      <ins
        className="adsbygoogle"
        style={getStyle()}
        data-ad-client="ca-pub-3120721964411193"
        data-ad-format="auto"
        data-full-width-responsive="true"
        ref={adRef}
      />
    </div>
  );
}

export default AdBanner;
