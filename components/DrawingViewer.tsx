"use client";

import React, { useRef } from "react";

const GRID_SIZE = 64;

interface CanvasDisplayProps {
  fgColor: string;
  bgColor: string;
  hexString: string;
  pixelSize: number;
  smallWindowPixelSize?: number;
}

// Function to convert hex string to binary string
const hexToBinaryString = (hexString: string): string => {
  let binaryString = "";
  for (let i = 0; i < hexString.length; i += 2) {
    const hexPair = hexString.slice(i, i + 2);
    const binaryOctet = parseInt(hexPair, 16).toString(2).padStart(8, "0");
    binaryString += binaryOctet;
  }
  return binaryString;
};

const CanvasDisplay: React.FC<CanvasDisplayProps> = ({
  bgColor,
  fgColor,
  hexString,
  pixelSize,
  smallWindowPixelSize,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const binaryString = hexToBinaryString(hexString);

  const canvas = canvasRef.current;
  if (!canvas) {
    return null;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return null;
  }

  const finalPixelSize = smallWindowPixelSize
    ? window.innerWidth <= 600
      ? smallWindowPixelSize
      : pixelSize
    : pixelSize;
  const gridSize = GRID_SIZE;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const index = y * gridSize + x;
      const bit = binaryString[index] === "1";
      ctx.fillStyle = bit ? fgColor : bgColor;
      ctx.fillRect(
        x * finalPixelSize,
        y * finalPixelSize,
        finalPixelSize,
        finalPixelSize,
      );
    }
  }

  return (
    <canvas
      ref={canvasRef}
      width={GRID_SIZE * finalPixelSize}
      height={GRID_SIZE * finalPixelSize}
    />
  );
};

export default CanvasDisplay;
