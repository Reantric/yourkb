import { createClient } from "@/utils/supabase/server";

import { isCurrentUserAdmin } from "../actions";
import GalleryLoader from "@/components/GalleryLoader";

const CHUNK_SIZE = 60;

export default async function Gallery() {
  const supabase = await createClient();

  const isAdmin = await isCurrentUserAdmin();

  const { data, error } = await (isAdmin
    ? supabase.from("kilobytes").select().limit(1000) // higher limit for admins, no filter
    : supabase
        .from("kilobyte_like_counts")
        .select()
        .eq("hidden", false)
        .limit(CHUNK_SIZE)
        .order("like_count", { ascending: false })); // only non-hidden for normal users

  if (error) {
    console.error(error);
    return <p>An error occurred when fetching KBs.</p>;
  }

  if (!data || data.length === 0) {
    return <p>No KBs to display.</p>;
  }

  return (
    <div className="flex-1 flex flex-col gap-6 px-4">
      <GalleryLoader initialData={data} />
    </div>
  );
}
