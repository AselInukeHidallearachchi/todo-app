import { getCurrentUser } from "@/lib/auth";
import { NavbarClient } from "./NavbarClient";

/**
 * Server Component: Main Navigation Bar
 * Fetches current user on the server
 * Passes user data to NavbarClient for interactive features
 */

export default async function Navbar() {
  // Fetch user on the server - no loading state needed
  const user = await getCurrentUser();

  return <NavbarClient user={user} />;
}
