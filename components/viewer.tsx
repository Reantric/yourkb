"use client";

import React, { useRef, useEffect } from 'react';

const PIXEL_SIZE = 5;
const GRID_SIZE = 64;

interface CanvasDisplayProps {
  fg_color: string;
  bg_color: string;
  hexString: string;
}

// Function to convert hex string to binary string
const hexToBinaryString = (hexString: string): string => {
  let binaryString = '';
  for (let i = 0; i < hexString.length; i += 2) {
    const hexPair = hexString.slice(i, i + 2);
    const binaryOctet = parseInt(hexPair, 16).toString(2).padStart(8, '0');
    binaryString += binaryOctet;
  }
  return binaryString;
};

const CanvasDisplay: React.FC<CanvasDisplayProps> = ({ bg_color, fg_color, hexString }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const binaryString = hexToBinaryString(hexString);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pixelSize = PIXEL_SIZE;
    const gridSize = GRID_SIZE;

    // Draw the grid
    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          const index = y * gridSize + x;
          const bit = binaryString[index] === '1';
          ctx.fillStyle = bit ? fg_color : bg_color;
          ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
      }
    };

    drawGrid();
  }, [binaryString, fg_color, bg_color]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * PIXEL_SIZE}
        height={GRID_SIZE * PIXEL_SIZE}
      />
    </div>
  );
};

export default CanvasDisplay;
