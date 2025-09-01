"use client";

import {
  useState,
  useRef,
  useEffect,
  MouseEvent,
  TouchEvent,
  useCallback,
} from "react";
import { Button } from "./ui/button";

const DEFAULT_PIXEL_SIZE = 5;
const SMALL_PIXEL_SIZE = 3;
const GRID_SIZE = 64;

// Convert hex string to binary string
const hexToBinaryString = (hexString: string): string => {
  let binaryString = "";
  for (let i = 0; i < hexString.length; i += 2) {
    const hexPair = hexString.slice(i, i + 2);
    const binaryOctet = parseInt(hexPair, 16).toString(2).padStart(8, "0");
    binaryString += binaryOctet;
  }
  return binaryString;
};

// Convert binary string to hex string
const binaryStringToHex = (binaryString: string): string => {
  let hexString = "";
  for (let i = 0; i < binaryString.length; i += 8) {
    const binaryOctet = binaryString.slice(i, i + 8);
    const hexPair = parseInt(binaryOctet, 2).toString(16).padStart(2, "0");
    hexString += hexPair;
  }
  return hexString;
};

export default function CanvasGrid({
  bgColor,
  fgColor,
  hexString,
  customPixelSize,
  drawing,
  setDrawing,
  isEraser,
  setIsEraser,
}: {
  fgColor: string;
  bgColor: string;
  hexString: string;
  customPixelSize?: number;
  drawing: boolean;
  setDrawing: React.Dispatch<React.SetStateAction<boolean>>;
  isEraser: boolean;
  setIsEraser: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Source of truth for grid pixels
  const [binaryString, setBinaryString] = useState<string>(
    hexToBinaryString(hexString),
  );

  // Responsive pixel size state
  const [pixelSize, setPixelSize] = useState<number>(
    customPixelSize || DEFAULT_PIXEL_SIZE,
  );

  // Adjust pixel size based on window width (for responsiveness)
  useEffect(() => {
    const handleResize = () => {
      // For example: smaller pixel size if width < 640px (sm breakpoint)
      if (window.innerWidth < 640) {
        setPixelSize(customPixelSize || SMALL_PIXEL_SIZE);
      } else {
        setPixelSize(customPixelSize || DEFAULT_PIXEL_SIZE);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [customPixelSize, setPixelSize]);

  // Draw entire grid based on binaryString
  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas based on pixelSize
    canvas.width = GRID_SIZE * pixelSize;
    canvas.height = GRID_SIZE * pixelSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const index = y * GRID_SIZE + x;
        const bit = binaryString[index] === "1";
        ctx.fillStyle = bit ? fgColor : bgColor;
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    }
  }, [binaryString, fgColor, bgColor, pixelSize]);

  // Redraw on binaryString, fgColor, bgColor, pixelSize changes
  useEffect(() => {
    drawGrid();
  }, [drawGrid]);

  // Get mouse or touch coords relative to canvas pixels
  const getMouseOrTouchPosition = (
    e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const x = Math.floor((clientX - rect.left) / pixelSize);
    const y = Math.floor((clientY - rect.top) / pixelSize);

    // Clamp coordinates to grid bounds
    return {
      x: Math.min(Math.max(x, 0), GRID_SIZE - 1),
      y: Math.min(Math.max(y, 0), GRID_SIZE - 1),
    };
  };

  // Update pixel on drawing
  const updatePixel = (
    e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>,
  ) => {
    const { x, y } = getMouseOrTouchPosition(e);
    const index = y * GRID_SIZE + x;
    if (index < 0 || index >= binaryString.length) return;

    if (binaryString[index] === (isEraser ? "0" : "1")) {
      // No change needed
      return;
    }

    // Update binary string with new pixel value
    const newBinaryArray = binaryString.split("");
    newBinaryArray[index] = isEraser ? "0" : "1";
    setBinaryString(newBinaryArray.join(""));
  };

  // Mouse and touch event handlers
  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setDrawing(true);
    updatePixel(e);
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    updatePixel(e);
  };

  const handleTouchStart = (e: TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setDrawing(true);
    updatePixel(e);
  };

  const handleTouchEnd = (e: TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setDrawing(false);
  };

  const handleTouchMove = (e: TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!drawing) return;
    updatePixel(e);
  };

  // Clear canvas handler
  const clearCanvas = () => {
    setBinaryString("0".repeat(GRID_SIZE * GRID_SIZE));
  };

  // Toggle eraser/draw mode
  const toggleEraser = () => {
    setIsEraser((prev) => !prev);
  };

  // Save handler: send hex string of current grid state
  const handleSave = async () => {
    try {
      const response = await fetch("/api/updatekb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bgColor,
          fgColor,
          value: binaryStringToHex(binaryString),
        }),
      });

      if (!response.ok) throw new Error("Failed to save changes");

      const data = await response.json();
      console.log("Save successful:", data);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  return (
    <div id="canvas-grid-wrapper" className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * pixelSize}
        height={GRID_SIZE * pixelSize}
        className="touch-none border border-gray-300"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // stop drawing if mouse leaves canvas
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onTouchMove={handleTouchMove}
        style={{ touchAction: "none", imageRendering: "pixelated" }}
      />

      <div className="flex flex-col space-y-2 pt-4 w-full max-w-xs">
        <Button asChild size="sm" variant={"outline"}>
          <button onClick={toggleEraser}>
            {isEraser ? "Switch to Draw" : "Switch to Eraser"}
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
}
