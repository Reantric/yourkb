import InternalHeader from "./InternalHeader";
import { createClient } from "@/utils/supabase/server";

export default async function Header() {
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  return <InternalHeader user={user} />;
}
