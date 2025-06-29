'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';

export const Logo = (props: React.SVGProps<SVGSVGElement>) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Render an empty SVG with the same dimensions to hold the space during SSR
    // and prevent layout shift, while avoiding hydration errors from complex styles.
    return (
      <svg
        width="75"
        height="45"
        viewBox="0 0 258 155"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      />
    );
  }

  return (
    <svg
      width="75"
      height="45"
      viewBox="0 0 258 155"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        y="65"
        style={{
          fontSize: 75,
          fill: '#e54d6e',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 800,
          letterSpacing: '-0.02em',
        }}
      >
        super
      </text>
      <text
        y="130"
        style={{
          fontSize: 75,
          fill: '#5b67ae',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 800,
          letterSpacing: '-0.02em',
        }}
      >
        moda
      </text>
      <text
        x="85"
        y="152"
        style={{
          fontSize: 25,
          fill: '#646464',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
        }}
      >
        calçados
      </text>
    </svg>
  );
};
