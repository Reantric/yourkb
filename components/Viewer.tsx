"use client";

import { useEffect, useRef, useState, memo } from "react";
import CopyLinkButton from "./LinkButton";
import { Toaster } from "./ui/toaster";
import {
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  HeartIcon,
  Share2Icon,
} from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "./hooks/use-toast";
import { useRouter } from "next/navigation";

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

export default memo(function CanvasDisplay({
  id,
  bgColor,
  fgColor,
  hexString,
  pixelSize,
  smallWindowPixelSize,
  imageOnly,
  isAdmin,
  isHidden,
  numLikes,
  isLiked,
}: {
  id: number;
  fgColor: string;
  bgColor: string;
  hexString: string;
  pixelSize: number;
  smallWindowPixelSize?: number;
  imageOnly?: boolean;
  isAdmin?: boolean;
  isHidden?: boolean;
  numLikes?: number;
  isLiked?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { refresh, push } = useRouter();

  const { toast } = useToast();

  const binaryString = hexToBinaryString(hexString);

  // for some reason I can't get window here
  const [finalPixelSize, setFinalPixelSize] = useState(pixelSize);

  useEffect(() => {
    const newFinalPixelSize =
      smallWindowPixelSize && window.innerWidth <= 600
        ? smallWindowPixelSize
        : pixelSize;
    setFinalPixelSize(newFinalPixelSize);
  }, [smallWindowPixelSize, pixelSize]);

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

  const setNewVisibility = async () => {
    if (!isAdmin) return;

    const response = await fetch(`/api/changevisibility`, {
      method: "POST",
      body: JSON.stringify({
        id,
        newVisibility: !isHidden,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      toast({
        title: "Error hiding kilobyte",
        variant: "destructive",
        description: (await response.json()).error,
      });
      return;
    }

    toast({
      title: "Kilobyte hidden",
      variant: "success",
      description: "This kilobyte has been successfully hidden.",
    });
    refresh();
  };

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
  return (
    <div className="flex-1 flex flex-col space-y-2 justify-center items-center">
      <div>
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * finalPixelSize}
          height={GRID_SIZE * finalPixelSize}
        />
      </div>
      <div className="flex flex-row justify-between space-x-2">
        <div>
          <Button
            title="Like"
            variant={isLiked ? "default" : "outline"}
            onClick={async () => {
              const result = await fetch("/api/switchlikestatus", {
                method: "POST",
                body: JSON.stringify({
                  image_id: id,
                  new_like_status: !isLiked,
                }),
                headers: {
                  "Content-Type": "application/json",
                },
              });
              if (!result.ok) {
                if (result.status === 401) {
                  return push("/sign-in");
                }
                const error = await result.json();
                if (error) {
                  toast({
                    title: "Error liking image",
                    variant: "destructive",
                    description: error.message,
                  });
                }
              }
              refresh();
            }}
          >
            <HeartIcon className="w-5 h-5 mr-1" /> {numLikes}
          </Button>
        </div>
        <div className="flex flex-row space-x-2">
          {isAdmin && (
            <Button
              onClick={setNewVisibility}
              variant={isHidden ? "default" : "destructive"}
              title={isHidden ? "Unhide Kilobyte" : "Hide Kilobyte"}
            >
              {isHidden ? (
                <EyeIcon className="w-5 h-5" />
              ) : (
                <EyeOffIcon className="w-5 h-5" />
              )}
            </Button>
          )}
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
      </div>
      <Toaster />
    </div>
  );
});
