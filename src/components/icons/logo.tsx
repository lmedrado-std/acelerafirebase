import * as React from 'react';

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
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
