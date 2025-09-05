import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "Permission denied. You must be logged in!" },
      { status: 401 },
    );
  }

  const { image_id, new_like_status } = await req.json();
  if (!image_id || new_like_status === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (new_like_status === false) {
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("user_id", user.id)
      .eq("image_id", image_id);

    if (error) {
      console.error(error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(null, { status: 200 });
  }

  const { error } = await supabase.from("likes").upsert({
    user_id: user.id,
    image_id: image_id,
  });

  if (error) {
    console.error(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(null, { status: 200 });
}
