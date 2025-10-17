"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    api
      .get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => {
        if (err.response?.status === 403) {
          alert("Access denied — Admins only");
        }
        router.push("/tasks");
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleRole = async (user: User) => {
    const token = localStorage.getItem("token");
    const newRole = user.role === "admin" ? "user" : "admin";

    try {
      await api.patch(
        `/v1/users/${user.id}/role`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(
        users.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
    } catch {
      alert("Failed to update user role");
    }
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <table className="w-full border rounded-md overflow-hidden">
        <thead>
          <tr className="bg-muted text-sm">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Role</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2">{user.is_active ? "Active" : "Inactive"}</td>
              <td className="p-2">
                <Button
                  onClick={() => toggleRole(user)}
                  variant="outline"
                  size="sm"
                >
                  Change to {user.role === "admin" ? "User" : "Admin"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
