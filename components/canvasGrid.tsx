"use client";

import React, { useState, useRef, useEffect, MouseEvent, TouchEvent } from 'react';
import { Button } from './ui/button';

const PIXEL_SIZE = 5;
const GRID_SIZE = 64;

interface CanvasGridProps {
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

const binaryStringToHex = (binaryString: string): string => {
    let hexString = '';
    for (let i = 0; i < binaryString.length; i += 8) {
        const binaryOctet = binaryString.slice(i, i + 8);
        const hexPair = parseInt(binaryOctet, 2).toString(16).padStart(2, '0');
        hexString += hexPair
    }
    return hexString;
}

const CanvasGrid: React.FC<CanvasGridProps> = ({ bg_color, fg_color, hexString }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [binaryString, setBinaryString] = useState<string>(hexToBinaryString(hexString));
  const [drawing, setDrawing] = useState<boolean>(false);
  const [isEraser, setIsEraser] = useState<boolean>(false);

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

  const getMouseOrTouchPosition = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: Math.floor((x - rect.left) / PIXEL_SIZE),
      y: Math.floor((y - rect.top) / PIXEL_SIZE),
    };
  };

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    updatePixel(e);
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (drawing) {
      updatePixel(e);
    }
  };

  const handleTouchStart = (e: TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setDrawing(true);
    updatePixel(e);
  };

  const handleTouchEnd = () => {
    setDrawing(false);
  };

  const handleTouchMove = (e: TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (drawing) {
      updatePixel(e);
    }
  };

  const updatePixel = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
    const { x, y } = getMouseOrTouchPosition(e);

    const index = y * GRID_SIZE + x;
    const newBinaryString = binaryString.split('');
    newBinaryString[index] = isEraser ? '0' : '1';
    setBinaryString(newBinaryString.join(''));

    drawPixel(x, y, isEraser ? bg_color : fg_color);
  };

  const drawPixel = (x: number, y: number, color: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = color;
    ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
  };

  const clearCanvas = () => {
    setBinaryString('0'.repeat(4096));
  };

  const toggleEraser = () => {
    setIsEraser(!isEraser);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/updatekb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bg_color: bg_color,
          fg_color: fg_color,
          value: binaryStringToHex(binaryString)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      const data = await response.json();
      console.log('Save successful:', data);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * PIXEL_SIZE}
        height={GRID_SIZE * PIXEL_SIZE}
        className="touch-none"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
      />
      <div className='flex flex-col space-y-4 pt-2'>
        <Button asChild size="sm" variant={"outline"}>
          <button onClick={toggleEraser}>
            {isEraser ? 'Switch to Draw' : 'Switch to Eraser'}
          </button>
        </Button>
        <Button asChild size="sm" variant={"destructive"}>
          <button onClick={clearCanvas}>Clear Canvas</button>
        </Button>
        <Button asChild size="sm" variant={"outline"}>
          <button onClick={handleSave}>Save Changes</button>
        </Button>
      </div>
    </div>
  );
};

export default CanvasGrid;
