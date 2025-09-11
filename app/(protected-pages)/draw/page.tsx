import Editor from "@/components/Editor";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const DEFAULT_BG = "#ffffff";
const DEFAULT_FG = "#000000";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // theoretically, middleware should handle this, but we need to check for TS
  if (!user) {
    return redirect("/sign-in");
  }

  const { data, error } = await supabase
    .from("kilobytes")
    .select()
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error(error);
    return (
      <p>
        There was an error fetching your kilobyte. Please refresh the page to
        try again.
      </p>
    );
  }

  let fg_color;
  let bg_color;
  let value;
  let id = -1;

  if (!data) {
    const { data, error } = await supabase
      .from("kilobytes")
      .insert({
        bg_color: DEFAULT_BG,
        fg_color: DEFAULT_FG,
        value: "0".repeat(1024),
        user_id: user.id,
      })
      .select()
      .single();
    if (error) {
      console.error(error);
      return (
        <p>
          There was an error fetching your kilobyte. Please refresh the page to
          try again.
        </p>
      );
    }
    if (data) {
      id = data.id;
    }
    fg_color = DEFAULT_FG;
    bg_color = DEFAULT_BG;
    value = "0".repeat(1024);
  } else {
    id = data.id;
    fg_color = data.fg_color;
    bg_color = data.bg_color;
    value = data.value;
  }

  return (
    <div className="flex-1 w-full flex flex-col">
      <h1 className="text-4xl pb-6">Your Kilobyte</h1>
      <Editor
        imageId={id}
        initBgColor={bg_color}
        initFgColor={fg_color}
        initHexString={value}
        isHidden={data.hidden}
      />
    </div>
  );
}
