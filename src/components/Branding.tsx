import React from 'react';

export const Branding: React.FC = React.memo(() => {
  return (
    <header className="brand-header-top-left" role="banner">
      <div className="brand-mark">
        <h1 className="brand-name">SHREYA GHOSHAL</h1>
        <span className="brand-tag">MELODIES</span>
      </div>
    </header>
  );
});

Branding.displayName = 'Branding';
