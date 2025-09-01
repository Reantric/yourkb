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
import {
  bitmaskToHexadecimal,
  clearBit,
  getBit,
  hexadecimalToBitmask,
  setBit,
} from "@/lib/bits";

const DEFAULT_PIXEL_SIZE = 5;
const SMALL_PIXEL_SIZE = 3;
const GRID_SIZE = 64;

export default function CanvasGrid({
  bgColor,
  fgColor,
  customPixelSize,
  drawing,
  setDrawing,
  isEraser,
  setIsEraser,
  bitmask,
  setBitmask,
}: {
  fgColor: string;
  bgColor: string;
  hexString: string;
  customPixelSize?: number;
  drawing: boolean;
  setDrawing: React.Dispatch<React.SetStateAction<boolean>>;
  isEraser: boolean;
  setIsEraser: React.Dispatch<React.SetStateAction<boolean>>;
  bitmask: BigUint64Array;
  setBitmask: React.Dispatch<React.SetStateAction<BigUint64Array>>;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = GRID_SIZE * pixelSize;
    canvas.height = GRID_SIZE * pixelSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const index = y * GRID_SIZE + x;
        const bit = getBit(bitmask, index); // ✅ use bitmask instead of binaryString
        ctx.fillStyle = bit ? fgColor : bgColor;
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    }
  }, [bitmask, fgColor, bgColor, pixelSize]);

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
    if (index < 0 || index >= GRID_SIZE * GRID_SIZE) return;

    if (getBit(bitmask, index) === (isEraser ? false : true)) {
      // No change needed
      return;
    }

    // Update bitmask with new pixel value
    const newBitmask = new BigUint64Array(bitmask);
    if (isEraser) {
      clearBit(newBitmask, index);
    } else {
      setBit(newBitmask, index);
    }
    setBitmask(newBitmask);
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
    setBitmask(hexadecimalToBitmask("0".repeat(GRID_SIZE * GRID_SIZE)));
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
          value: bitmaskToHexadecimal(bitmask),
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
        className="touch-none border border-foreground"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
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
