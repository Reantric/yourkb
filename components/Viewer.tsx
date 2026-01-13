"use client";

import { useEffect, useRef, useState, memo, useTransition } from "react";
import CopyLinkButton from "./LinkButton";
import { Toaster } from "./ui/toaster";
import {
  CopyIcon,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  HeartIcon,
  Share2Icon,
} from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "./hooks/use-toast";
import { useRouter } from "next/navigation";

const GRID_SIZE = 64;

// ---------- Types & helpers ----------
type WebShareNavigator = Navigator & {
  share?: (data: ShareData) => Promise<void>;
  canShare?: (data?: ShareData) => boolean;
};

const getWebShareNavigator = (): WebShareNavigator | undefined =>
  typeof navigator === "undefined" ? undefined : (navigator as WebShareNavigator);

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

  // check if web share api is supported
  // ideally, we would use navigator.canShare(), but that's not supported in all browsers
  const [canShare, setCanShare] = useState(false);
  const [shareDisabled, setShareDisabled] = useState(false);
  
  useEffect(() => {
    const nav = getWebShareNavigator();
    setCanShare(Boolean(nav?.share));
  }, []);

  const binaryString = hexToBinaryString(hexString);

  // for some reason I can't get window here
  const [finalPixelSize, setFinalPixelSize] = useState(pixelSize);

  const [isLikeChanging, startLikeChange] = useTransition();

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
      <div className="flex flex-row justify-between space-x-2 w-full">
        <div>
          <Button
            title="Like"
            variant={isLiked ? "default" : "outline"}
            disabled={isLikeChanging}
            onClick={() =>
              startLikeChange(async () => {
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
              })
            }
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
            title="Download Drawing"
            onClick={() => {
              if (!canvasRef.current) return;
              const canvas = canvasRef.current;
              const link = document.createElement("a");
              link.download = `kilobyte-${id}.png`;
              link.href = canvas.toDataURL("image/png");
              link.click();
            }}
            variant="outline"
          >
            <DownloadIcon className="w-5 h-5" />
          </Button>
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
            title={shareDisabled ? "Share unsupported" : "Share Image"}
            disabled={shareDisabled}
            onClick={async () => {
              if (!canShare) {
                toast({
                  title: "Unsupported",
                  description: "Sharing isn't supported in this browser.",
                  variant: "destructive",
                });
                setShareDisabled(true);
                return;
              }
              try {
                await (navigator as WebShareNavigator).share({
                  title: "Share Image",
                  text: "Check out this image!",
                  url: window.location.href,
                });
              } catch (err: unknown) {
                if ((err as Error)?.name !== "AbortError") {
                  toast({
                    title: "Share failed",
                    description: (err as Error)?.message || "Unable to share.",
                    variant: "destructive",
                  });
                }
              }
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
