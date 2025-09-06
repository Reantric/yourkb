import { ImageResponse } from "next/og";
import { createClient } from "@/utils/supabase/server";

export const runtime = "edge";
export const alt = "YourKB preview";
export const size = {
  width: 640,
  height: 640,
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

export default async function Image({
  params,
}: {
  params: { slug: string };
}) {
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

  // Compute a pixel size that fits into the canvas with padding
  const availW = size.width;
  const availH = size.height;
  const px = Math.floor(Math.min(availW / GRID_SIZE, availH / GRID_SIZE));

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
            left: x * px,
            top: y * px,
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
    { width: size.width, height: size.height }
  );
}
