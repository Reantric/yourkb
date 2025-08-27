import Editor from "@/components/Editor";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CopyLinkButton from "@/components/DrawingLink";

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
    .eq("user_id", user.id);

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

  if (!data || data.length === 0) {
    const { data, error } = await supabase
      .from("kilobytes")
      .insert({
        bg_color: DEFAULT_BG,
        fg_color: DEFAULT_FG,
        value: "0".repeat(1024),
        user_id: user.id,
      })
      .select();
    if (error) {
      console.error(error);
      return (
        <p>
          There was an error fetching your kilobyte. Please refresh the page to
          try again.
        </p>
      );
    }
    if (data && data.length !== 0) {
      id = data[0].id;
    }
    fg_color = DEFAULT_FG;
    bg_color = DEFAULT_BG;
    value = "0".repeat(1024);
  } else {
    id = data[0].id;
    fg_color = data[0].fg_color;
    bg_color = data[0].bg_color;
    value = data[0].value;
  }

  return (
    <div className="flex-1 w-full flex flex-col">
      <h1 className="text-4xl pb-6">Your Kilobyte</h1>
      <Editor
        initBgColor={bg_color}
        initFgColor={fg_color}
        initHexString={value}
      />
      <CopyLinkButton id={id} />
    </div>
  );
}
