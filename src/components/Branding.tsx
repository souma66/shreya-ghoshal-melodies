import React from 'react';

export const Branding: React.FC = React.memo(() => {
  return (
    <header className="brand-header-top-left" role="banner">
      <div className="brand-mark">
        <h1 className="brand-name">Shreya Ghoshal Melodies</h1>
        <span className="brand-tag">A CINEMATIC LISTENING EXPERIENCE</span>
      </div>
    </header>
  );
});

Branding.displayName = 'Branding';
