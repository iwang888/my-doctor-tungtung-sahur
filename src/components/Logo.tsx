/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export default function Logo() {
  return (
    <div className="flex items-center gap-1.5 select-none shrink-0" id="mydoctor-logo-group">
      <svg className="w-10 h-10 drop-shadow-sm" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="crossShieldGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="rightShieldGrad" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        
        {/* Left shield + medical cross integrated (blue) */}
        <path 
          d="M 50 12 
             C 32 12, 16 18, 16 35 
             V 52 
             C 16 72, 36 86, 50 90 
             V 70
             C 50 70, 48 70, 46 68
             C 44 66, 44 64, 44 64
             V 54
             H 28
             C 28 54, 25 54, 25 50
             V 40
             C 25 36, 28 36, 28 36
             H 44
             V 24
             C 44 24, 44 20, 48 20
             H 50
             Z" 
          fill="url(#crossShieldGrad)" 
        />
        
        {/* Right shield wing (green) */}
        <path 
          d="M 50 12
             C 68 12, 84 18, 84 35
             V 52
             C 84 72, 64 86, 50 90
             V 20
             C 52 20, 56 20, 56 24
             V 36
             H 72
             C 72 36, 75 36, 75 40
             V 50
             C 75 54, 72 54, 72 54
             H 56
             V 64
             C 56 64, 56 66, 54 68
             C 52 70, 50 70, 50 70
             Z" 
          fill="url(#rightShieldGrad)" 
          opacity="0.95"
        />

        {/* Centered stylized white human silhouette */}
        {/* Head */}
        <circle cx="50" cy="40" r="7" fill="#ffffff" />
        
        {/* Curved upper body with outstretched arms */}
        <path 
          d="M 28 46
             C 34 40, 42 46, 50 46
             C 58 46, 66 40, 72 46
             C 68 56, 58 64, 50 64
             C 42 64, 32 56, 28 46
             Z" 
          fill="#ffffff" 
        />
        
        {/* Lower body leg-like curve */}
        <path 
          d="M 44 60
             C 44 72, 42 78, 50 82
             C 58 78, 56 72, 56 60
             Z"
          fill="#ffffff"
        />

        {/* Small light-green heart on the chest */}
        <path 
          d="M 50 56
             C 50 56, 47 53, 46 51.5
             C 45 50, 46 48.5, 47.5 48.5
             C 49 48.5, 49.5 50, 50 50.5
             C 50.5 50, 51 48.5, 52.5 48.5
             C 54 48.5, 55 50, 54 51.5
             C 53 53, 50 56, 50 56
             Z" 
          fill="#4ade80" 
        />
      </svg>
      
      {/* text: mydoctor */}
      <div className="flex items-baseline font-sans leading-none">
        <span className="text-2xl font-bold text-[#38bdf8] tracking-tight">my</span>
        <span className="text-2xl font-black text-[#1e40af] tracking-tight">doctor</span>
      </div>
    </div>
  );
}
