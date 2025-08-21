import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "User must be logged in to get their associated image ID" },
      { status: 401 },
    );
  }

  const { data, error } = await supabase
    .from("kilobytes")
    .select()
    .eq("user_id", user.id);

  if (error) {
    console.error(error.message);
    console.log(req.headers);
    console.log(req.body);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ body: data[0].id }, { status: 200 });
}
