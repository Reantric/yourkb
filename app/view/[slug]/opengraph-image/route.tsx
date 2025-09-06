import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "edge";
export const alt = "YourKB preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const GRID_SIZE = 64;

function hexToBinaryString(hexString: string): string {
  let binaryString = "";
  for (let i = 0; i < hexString.length; i += 2) {
    const hexPair = hexString.slice(i, i + 2);
    const binaryOctet = parseInt(hexPair, 16).toString(2).padStart(8, "0");
    binaryString += binaryOctet;
  }
  return binaryString;
}

export async function GET(
  { params }: { params: { slug: string } },
) {
  const { slug } = params;
  const id = Number.parseInt(slug);
  if (Number.isNaN(id)) {
    return new Response("Invalid id", { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("kilobytes")
    .select()
    .eq("id", id)
  .single();

  if (error || !data || data.hidden) {
    return new Response("Not found", { status: 404 });
  }

  const fgColor: string = data.fg_color || "#000000";
  const bgColor: string = data.bg_color || "#ffffff";
  const hexString: string = data.value as string;
  const bin = hexToBinaryString(hexString);

  // Compute a pixel size that fits 64x64 into 1200x630 with padding
  const padding = 60;
  const availW = size.width - padding * 2;
  const availH = size.height - padding * 2;
  const px = Math.floor(Math.min(availW / GRID_SIZE, availH / GRID_SIZE));

  // We'll render a CSS grid of absolutely positioned divs for speed
  const cells: JSX.Element[] = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const index = y * GRID_SIZE + x;
      const bit = bin[index] === "1";
      cells.push(
        <div
          key={`${x}-${y}`}
          style={{
            position: "absolute",
            left: padding + x * px,
            top: padding + y * px,
            width: px,
            height: px,
            background: bit ? fgColor : bgColor,
          }}
        />,
      );
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: "flex",
          background: bgColor,
          position: "relative",
        }}
      >
        {cells}
      </div>
    ),
    { ...size }
  );
}
