"use client";

import { useState, useRef, useCallback, useEffect} from 'react';
import * as React from "react";

interface RegionData {
  id: string;
  name: string;
  description: string;
  color: string; // RGB color from the image
}

interface ColorBasedMapProps {
  className?: string;
  regionCounts: Record<string, number>;
  referralCounts: Record<string, number>;
}

// Map RGB colors from the image to districts
const colorToRegion: Record<string, RegionData> = {
  // Based on the colors visible in the uploaded image
  "115,142,154": { // Tuen Mun area
    id: 'tuen-mun',
    name: 'Tuen Mun 屯門',
    description: 'Northwestern New Territories district known for its new town development',
    color: 'rgb(114,142,154)'
  },
  "187,214,225": { // Yuen Long area
    id: 'yuen-long',
    name: 'Yuen Long 元朗',
    description: 'Agricultural heartland of Hong Kong with traditional villages',
    color: 'rgb(187,214,225)'
  },
  "172,187,162": { // North District
    id: 'north',
    name: 'North 北', 
    description: 'Bordering Shenzhen with scenic countryside and border crossings',
    color: 'rgb(172,188,162)'
  },
  "121,157,99": { // Tai Po 
    id: 'tai-po',
    name: 'Tai Po 大埔',
    description: 'Historic market town surrounded by country parks',
    color: 'rgb(121,157,99)'
  },
  "74,100,65": { // Sha Tin
    id: 'sha-tin', 
    name: 'Sha Tin 沙田',
    description: 'Major new town with racecourse and university',
    color: 'rgb(73,100,65)'
  },
  "204,161,83": { // Sai Kung
    id: 'sai-kung',
    name: 'Sai Kung 西貢',
    description: 'Scenic peninsula known for seafood and outdoor activities', 
    color: 'rgb(204,161,83)'
  },
  "143,161,168": { // Tsuen Wan
    id: 'tsuen-wan',
    name: 'Tsuen Wan 荃灣',
    description: 'Industrial new town in western New Territories',
    color: 'rgb(143,161,168)'
  },
  "123,113,144": { // Kwai Tsing
    id: 'kwai-tsing', 
    name: 'Kwai Tsing 葵青',
    description: 'Major container port and industrial area',
    color: 'rgb(123,113,144)'
  },
  "231,2,3": { // Central & Western
    id: 'central-western',
    name: 'Central and Western 中西', 
    description: 'Financial heart of Hong Kong with iconic skyline',
    color: 'rgb(231,5,5)'
  },
  "165,37,1": { // Wan Chai
    id: 'wan-chai',
    name: 'Wan Chai 灣仔',
    description: 'Vibrant district mixing business, culture and nightlife',
    color: 'rgb(165,38,5)'
  },
  "255,178,155": { // Eastern District
    id: 'eastern',
    name: 'Eastern 東',
    description: 'Diverse residential and commercial areas', 
    color: 'rgb(255,178,155)'
  },
  "221,205,123": { // Islands District (Lantau)
    id: 'islands',
    name: 'Islands 離島',
    description: 'Lantau Island and other outlying islands',
    color: 'rgb(220,206,124)'
  },
  "167,130,105": { // Yau Tsim Mong
    id: 'yau-tsim-mong',
    name: 'Yau Tsim Mong 油尖旺', 
    description: 'Dense urban area including Tsim Sha Tsui tourist district',
    color: 'rgb(167,130,104)'
  },
  "187,177,188": { // Sham Shui Po
    id: 'sham-shui-po',
    name: 'Sham Shui Po 深水埗',
    description: 'Historic working-class area with street markets',
    color: 'rgb(187,177,188)'  
  },
  "201,156,123": { // Kowloon City 
    id: 'kowloon-city',
    name: 'Kowloon City 九龍城',
    description: 'Residential area famous for its former walled city',
    color: 'rgb(201,156,123)'
  },
  "220,185,128": { // Wong Tai Sin
    id: 'wong-tai-sin',
    name: 'Wong Tai Sin 黃大仙',
    description: 'Public housing estates and famous temple',
    color: 'rgb(220,185,127)'
  },
  "198,189,134": { // Kwun Tong
    id: 'kwun-tong', 
    name: 'Kwun Tong 觀塘',
    description: 'Industrial and residential district undergoing urban renewal',
    color: 'rgb(197,189,134)'
  },
  "255,110,98": { // Southern District
    id: 'southern',
    name: 'Southern 南',
    description: 'Scenic southern peninsula with beaches and country parks',
    color: 'rgb(255,110,97)'
  }
};

// Helper function to find closest color match
const findRegionByColor = (r: number, g: number, b: number): RegionData | null => {
  const colorKey = `${r},${g},${b}`;
  
  // First try exact match
  if (colorToRegion[colorKey]) {
    return colorToRegion[colorKey];
  }
  
  // If no exact match, find closest color within tolerance
  const tolerance = 5;
  for (const [key, region] of Object.entries(colorToRegion)) {
    const [targetR, targetG, targetB] = key.split(',').map(Number);
    const distance = Math.sqrt(
      Math.pow(r - targetR, 2) + 
      Math.pow(g - targetG, 2) + 
      Math.pow(b - targetB, 2)
    );
    
    if (distance <= tolerance) {
      return region;
    }
  }
  
  return null;
};

export const ColorBasedMap = ({ className = "", regionCounts, referralCounts }: ColorBasedMapProps) => {
  const [hoveredRegion, setHoveredRegion] = useState<RegionData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const setupCanvas = useCallback(() => {
    if (!canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const image = imageRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas size to match image
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    
    // Draw image to canvas for pixel data access
    ctx.drawImage(image, 0, 0);
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!canvasRef.current || !containerRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const container = containerRef.current;
    const image = imageRef.current;
    
    if (!ctx) return;
    
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert screen coordinates to image coordinates
    const scaleX = canvas.width / image.offsetWidth;
    const scaleY = canvas.height / image.offsetHeight;
    const imageX = Math.floor(x * scaleX);
    const imageY = Math.floor(y * scaleY);
    
    // Get pixel color at cursor position
    const pixelData = ctx.getImageData(imageX, imageY, 1, 1).data;
    const [r, g, b] = pixelData;
    
    // Skip white/transparent pixels (background)
    if (r > 240 && g > 240 && b > 240) {
      setHoveredRegion(null);
      setTooltipPosition(null);
      return;
    }
    
    const region = findRegionByColor(r, g, b);
    
    if (region) {
      setHoveredRegion(region);
      setTooltipPosition({ x, y });
    } else {
      setHoveredRegion(null);
      setTooltipPosition(null);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredRegion(null);
    setTooltipPosition(null);
  }, []);


  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl border border-map-border shadow-xl ${className}`}
      style={{ minHeight: '500px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Visible map image */}
      <img
        ref={imageRef}
        src="/hongkong-map.png"
        alt="Hong Kong Districts Map"
        className="w-full h-full object-contain bg-map-ocean"
        draggable={false}
        onLoad={setupCanvas}
      />
      
      {/* Hidden canvas for color detection */}
      <canvas
        ref={canvasRef}
        className="hidden"
      />

      {/* Color overlay for hovered region */}
      {hoveredRegion && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(45deg, transparent 0%, hsl(var(--map-hover) / 0.3) 50%, transparent 100%)`,
            mixBlendMode: 'multiply'
          }}
        />
      )}

      {/* Hover tooltip */}
      {hoveredRegion && tooltipPosition && (
        <div
          className="absolute z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y - 10,
          }}
        >
          <div className="bg-white text-tooltip-text px-4 py-3 rounded-lg shadow-lg border border-map-border animate-fade-in">
            <div className="text-sm font-semibold">{hoveredRegion.name}</div>
            <div className="text-xs opacity-90 mt-1 max-w-48">
              {(() => {
                const id = hoveredRegion.id;
                const donors = Number(regionCounts?.[id] ?? 0);
                const referrals = Number(referralCounts?.[id] ?? 0);

                if (donors > 0) {
                  return (
                    <>
                      <div>Donors from this region: {donors}</div>
                      <div>Referrals from this region: {isNaN(referrals) ? 0 : referrals}</div>
                    </>
                  );
                }
                return "No donors from this region yet. Refer your friends !";
              })()}
            </div>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2 top-full">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-tooltip-bg"></div>
          </div>
        </div>
      )}
    </div>
  );
};
