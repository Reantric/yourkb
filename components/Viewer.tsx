"use client";

import { useEffect, useRef } from "react";
import CopyLinkButton from "./LinkButton";
import { Toaster } from "./ui/toaster";
import { CopyIcon, Share2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "./hooks/use-toast";

const GRID_SIZE = 64;

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

export default function CanvasDisplay({
  id,
  bgColor,
  fgColor,
  hexString,
  pixelSize,
  smallWindowPixelSize,
  imageOnly,
}: {
  id: number;
  fgColor: string;
  bgColor: string;
  hexString: string;
  pixelSize: number;
  smallWindowPixelSize?: number;
  imageOnly?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { toast } = useToast();

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

  const copyCanvasToClipboard = async () => {
    if (!canvasRef.current) return;

    // Convert the canvas contents into a Blob (PNG by default)
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return;

      try {
        // Wrap it in a ClipboardItem and write to the clipboard
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);
        toast({
          title: "Canvas image copied to clipboard!",
          variant: "success",
        });
      } catch (err: unknown) {
        toast({
          title: "Error in copying drawing.",
          variant: "destructive",
          description: (err as Error).message,
        });
      }
    });
  };

  if (imageOnly) {
    return (
      <div>
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * finalPixelSize}
          height={GRID_SIZE * finalPixelSize}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col space-y-2">
      <div>
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * finalPixelSize}
          height={GRID_SIZE * finalPixelSize}
        />
      </div>
      <div className="flex flex-row justify-end gap-2">
        <Button
          className="p-2.5"
          title="Copy Drawing"
          onClick={copyCanvasToClipboard}
          variant="outline"
        >
          <CopyIcon className="w-5 h-5" />
        </Button>
        <CopyLinkButton id={id} compact={true} />
        <Button
          className="p-2.5"
          title="Share Image"
          onClick={async () => {
            await navigator.share({
              title: "Share Image",
              text: "Check out this image!",
              url: window.location.href,
            });
          }}
          variant="outline"
        >
          <Share2Icon className="w-5 h-5" />
        </Button>
      </div>
      <Toaster />
    </div>
  );
}
