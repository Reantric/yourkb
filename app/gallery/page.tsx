import CanvasDisplay from "@/components/viewer";

import { createClient } from '@/utils/supabase/server';

import Link from "next/link";

export default async function ViewKilobyte({ params }: { params: Promise<{ slug: string }> }) {

  const { slug } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase
        .from('kilobytes')
        .select();

  return (
    <div className="flex-1 flex flex-col gap-6 px-4">
      <ul className="grid grid-cols-3 gap-4">
        {data ? data.map((item) =>
          <li key={item.id}><Link href={`/view/${item.id}`}><CanvasDisplay 
            fg_color={item.fg_color} 
            bg_color={item.bg_color} 
            hexString={item.value}
            pixel_size={3}
          /></Link></li>) : <p>No KBs to display.</p>
        }
      </ul>
    </div>
  );
}