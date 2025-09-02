import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Permission denied" }, { status: 401 });
  }

  const { bgColor, fgColor, value } = await req.json();
  if (!bgColor || !fgColor || !value) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { error } = await supabase
    .from("kilobytes")
    .update({
      fg_color: fgColor,
      bg_color: bgColor,
      value: value,
    })
    .eq("user_id", user.id);

  if (error) {
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(null, { status: 200 });
}
