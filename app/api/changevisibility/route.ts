import { isCurrentUserAdmin } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "User must be logged in for this route" },
      { status: 401 },
    );
  }

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return NextResponse.json(
      { error: "User does not have permission to access this resource" },
      { status: 403 },
    );
  }

  const { id, newVisibility } = await req.json();

  const { error: updateError } = await supabase
    .from("kilobytes")
    .update({ hidden: newVisibility })
    .eq("id", id);
  if (!updateError) {
    return NextResponse.json({
      status: 200,
      message: "This KB has now been hidden",
    });
  }
  console.error(updateError?.message);
  console.log(req.headers);
  console.log(req.body);
  return NextResponse.json(
    { error: "Error in processing hide request" },
    { status: 500 },
  );
}
