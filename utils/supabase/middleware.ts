import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const AUTHENTICATED_ROUTES = ["draw", "reset-password"];
const UNAUTHENTICATED_ROUTES = ["sign-in", "sign-up", "forgot-password"];

export const updateSession = async (request: NextRequest) => {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const user = await supabase.auth.getUser();

    // protect protected routes
    if (
      AUTHENTICATED_ROUTES.some(
        (route) => request.nextUrl.pathname === route,
      ) &&
      (!user || user.error)
    ) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // don't allow access to these routes
    if (
      UNAUTHENTICATED_ROUTES.some(
        (route) => request.nextUrl.pathname === route,
      ) &&
      user &&
      !user.error
    ) {
      return NextResponse.redirect(new URL("/protected", request.url));
    }

    // serve the route
    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    console.error(e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
