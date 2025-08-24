"use client";

import Image from "next/image";
import { useTheme } from "@/contexts/theme-context";

interface LogoProps {
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ 
  alt = "DonorConnect", 
  width = 120, 
  height = 40, 
  className = "h-8 w-auto" 
}: LogoProps) {
  const { theme } = useTheme();
  
  const logoSrc = theme === 'dark' ? '/logo-dark.png' : '/logo.png';
  
  return (
    <Image
      src={logoSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
} 