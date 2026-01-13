import { redirect } from "next/navigation";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

/**
 * Returns the absolute origin for the app.
 * Prefers VERCEL_PROJECT_PRODUCTION_URL, then VERCEL_URL, and finally localhost.
 * Ensures the value is a plain origin without a trailing slash.
 */
export function getOrigin(): string {
  const explicit = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const vercel = process.env.VERCEL_URL?.trim();

  let origin = explicit
    ? (explicit.startsWith("http") ? explicit : `https://${explicit}`)
    : vercel
      ? `https://${vercel}`
      : "http://localhost:3000";

  if (origin.endsWith("/")) origin = origin.slice(0, -1);
  return origin;
}
