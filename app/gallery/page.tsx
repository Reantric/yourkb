import CanvasDisplay from "@/components/Viewer";

import { createClient } from "@/utils/supabase/server";

import Link from "next/link";

export default async function Gallery() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("kilobytes").select().limit(100);

  if (error) {
    console.error(error);
    return <p>An error occurred when fetching KBs.</p>;
  }

  if (!data || data.length === 0) {
    return <p>No KBs to display.</p>;
  }

  return (
    <div className="flex-1 flex flex-col gap-6 px-4">
      <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <Link href={`/view/${item.id}`} key={item.id}>
            <CanvasDisplay
              fgColor={item.fg_color}
              bgColor={item.bg_color}
              hexString={item.value}
              pixelSize={4}
            />
          </Link>
        ))}
      </ul>
    </div>
  );
}
