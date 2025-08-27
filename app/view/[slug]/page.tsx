import CopyLinkButton from "@/components/DrawingLink";
import CanvasDisplay from "@/components/DrawingViewer";

import { createClient } from "@/utils/supabase/server";

export default async function ViewKilobyte({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();

  // not sure what protections supabase has against sql injection, so validate here
  const desiredImageId = Number.parseInt(slug);

  const { data, error } = await supabase
    .from("kilobytes")
    .select()
    .eq("id", desiredImageId);

  if (error || !data) {
    return (
      <p>
        An error occured when fetching this image. Please refresh the page to
        try again.
      </p>
    );
  }

  if (data.length === 0) {
    return <p>This kilobyte seems to be missing.</p>;
  }

  return (
    <div className="flex-1 flex flex-col space-y-1">
      <CanvasDisplay
        fg_color={data[0].fg_color}
        bg_color={data[0].bg_color}
        hexString={data[0].value}
        pixel_size={window.innerWidth <= 600 ? 3 : 5}
      />
      <CopyLinkButton id={data[0].id}></CopyLinkButton>
    </div>
  );
}
