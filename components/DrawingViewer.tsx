"use client";

import React, { useEffect, useRef } from "react";

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

  const finalPixelSize =
    smallWindowPixelSize && window.innerWidth <= 600
      ? smallWindowPixelSize
      : pixelSize;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = GRID_SIZE * finalPixelSize;
    canvas.height = GRID_SIZE * finalPixelSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const index = y * GRID_SIZE + x;
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
  }, [bgColor, fgColor, hexString, finalPixelSize]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * finalPixelSize}
        height={GRID_SIZE * finalPixelSize}
      />
    </div>
  );
};

export default CanvasDisplay;
