import { isCurrentUserAdmin } from "@/app/actions";
import Viewer from "@/components/Viewer";
import type { Metadata } from "next";

import { createClient } from "@/utils/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = `YourKB #${slug}`;
  const description = "View this kilobyte on YourKB";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/view/${slug}`,
      type: "article",
      images: [`/view/${slug}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/view/${slug}/opengraph-image`],
    },
  };
}

export default async function ViewKilobyte({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();

  const isAdmin = await isCurrentUserAdmin();

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

  if (data.length === 0 || (data[0].hidden && !isAdmin)) {
    return <p>This kilobyte seems to be missing.</p>;
  }

  return (
    <Viewer
      id={data[0].id}
      fgColor={data[0].fg_color}
      bgColor={data[0].bg_color}
      hexString={data[0].value}
      pixelSize={5}
      smallWindowPixelSize={3}
      isAdmin={isAdmin}
      isHidden={data[0].hidden}
    />
  );
}
