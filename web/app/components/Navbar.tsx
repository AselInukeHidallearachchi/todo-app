"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <nav className="shadow p-4 flex justify-between">
      <Link href="/tasks" className="font-bold text-lg">
        Todo App
      </Link>
      <button onClick={handleLogout} className="text-red-600 hover:underline">
        Logout
      </button>
    </nav>
  );
}
