import CopyLinkButton from "@/components/linkGenerator";
import CanvasDisplay from "@/components/viewer";

import { createClient } from '@/utils/supabase/server';

export default async function ViewKilobyte({ params }: { params: Promise<{ slug: string }> }) {

  const { slug } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase
        .from('kilobytes')
        .select()
        .eq('id', slug);

  return (
    <div className="flex-1 flex flex-col space-y-1">
      {(data && data.length !== 0) ? 
        <CanvasDisplay 
          fg_color={data[0].fg_color} 
          bg_color={data[0].bg_color} 
          hexString={data[0].value}
          pixel_size={5}
        /> : <p>This KB seems to be missing.</p>}
        {(data && data.length !== 0) ?
         <CopyLinkButton id={data[0].id}></CopyLinkButton> : <></>}
    </div>
  );
}