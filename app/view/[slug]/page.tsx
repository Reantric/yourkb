import CopyLinkButton from "@/components/LinkButton";
import CanvasDisplay from "@/components/Viewer";
import { Toaster } from "@/components/ui/toaster";

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
        fgColor={data[0].fg_color}
        bgColor={data[0].bg_color}
        hexString={data[0].value}
        pixelSize={5}
        smallWindowPixelSize={3}
      />
      <CopyLinkButton id={data[0].id} />
      <Toaster />
    </div>
  );
}
