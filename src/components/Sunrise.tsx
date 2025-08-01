import React from "react";

export default function Sunrise() {
  return (
    <svg
      width="144"
      height="144"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="12" y1="44" x2="52" y2="44" stroke="#999" strokeWidth="2" />
      <circle cx="32" cy="44" r="10" fill="#FFD93B" />
      <g stroke="#FFD93B" strokeWidth="2" strokeLinecap="round">
        <line x1="32" y1="20" x2="32" y2="26" />
        <line x1="22" y1="24" x2="25" y2="28" />
        <line x1="42" y1="24" x2="39" y2="28" />
      </g>
      <rect x="0" y="44" width="64" height="20" fill="#E0E0E0" />
    </svg>
  );
}
