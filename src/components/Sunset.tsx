import React from "react";

export default function Sunset() {
  return (
    <svg
      width="144"
      height="144"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="12" y1="40" x2="52" y2="40" stroke="#999" strokeWidth="2" />
      <circle cx="32" cy="40" r="10" fill="#FF914D" />
      <g stroke="#FF914D" strokeWidth="2" strokeLinecap="round">
        <line x1="32" y1="16" x2="32" y2="22" />
        <line x1="22" y1="20" x2="25" y2="24" />
        <line x1="42" y1="20" x2="39" y2="24" />
      </g>
      <rect x="0" y="40" width="64" height="24" fill="#C9B6A3" />
    </svg>
  );
}
