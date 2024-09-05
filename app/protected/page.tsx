import Editor from "@/components/editor";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const DEFAULT_BG = '#ffffff';
const DEFAULT_FG = '#000000';

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  let fg_color;
  let bg_color;
  let value;

  const { data, error } = await supabase
  .from('kilobytes')
  .select()
  .eq('user_id', user.id);

  if (!data || data.length === 0) {
    await supabase
    .from('kilobytes')
    .insert({ 
      id: 1,
      bg_color: DEFAULT_BG,
      fg_color: DEFAULT_FG,
      value: '0'.repeat(1024),
      user_id: user.id
    });
    fg_color = DEFAULT_FG;
    bg_color = DEFAULT_BG;
    value = '0'.repeat(1024);
  } else {
    fg_color = data[0].fg_color;
    bg_color = data[0].bg_color
    value = data[0].value;
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <h1 className="font-bold text-2xl mb-4">Your Kilobyte</h1>
      <Editor initBgColor={bg_color} initFgColor={fg_color} initHexString={value}></Editor>
    </div>
  );
}
