import Editor from "@/components/editor";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CopyLinkButton from "@/components/linkGenerator";

const DEFAULT_BG = '#ffffff';
const DEFAULT_FG = '#000000';

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  let fg_color;
  let bg_color;
  let value;
  let id = -1;

  const { data, error } = await supabase
  .from('kilobytes')
  .select()
  .eq('user_id', user.id);

  if (!data || data.length === 0) {
    const { data, error } = await supabase
    .from('kilobytes')
    .insert({ 
      bg_color: DEFAULT_BG,
      fg_color: DEFAULT_FG,
      value: '0'.repeat(1024),
      user_id: user.id
    }).select();
    if (data && data.length !== 0) {
      id = data[0].id;
    }
    fg_color = DEFAULT_FG;
    bg_color = DEFAULT_BG;
    value = '0'.repeat(1024);
  } else {
    id = data[0].id;
    fg_color = data[0].fg_color;
    bg_color = data[0].bg_color
    value = data[0].value;
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-6">
      <h1 className="text-4xl">Your Kilobyte</h1>
      <CopyLinkButton id={id}></CopyLinkButton>
      <Editor initBgColor={bg_color} initFgColor={fg_color} initHexString={value}></Editor>
    </div>
  );
}
