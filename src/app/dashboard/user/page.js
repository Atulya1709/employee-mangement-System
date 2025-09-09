"use client";
import { useState, useEffect } from "react";
import { Mail, Phone, User, MapPin, Building2 } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://crud.parxfit.com/api/users");

        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (Array.isArray(data)) {
          setUsers(data);
        } else if (data.users && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          throw new Error("Invalid response format: Expected an array.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6 pt-20">
      <div className="fixed w-full top-0 bg-white z-50 py-4 ">
       <h1 className="text-3xl font-bold text-gray-900 mb-4">User</h1>
      <p className="text-gray-700 mb-6">Manage all employee from this section.</p>
     </div>

      {loading && <p className="text-center text-gray-500">Loading employees...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && users.length === 0 && (
        <p className="text-center text-gray-500">No users found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white p-6 rounded-lg shadow-md flex flex-col transition-all hover:shadow-lg hover:bg-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-900">
              {user.f_name} {user.l_name}
            </h2>

            <p className="text-gray-600 flex items-center gap-2">
              <Mail size={18} /> {user.email}
            </p>

            <p className="text-gray-600 flex items-center gap-2">
              <Phone size={18} /> {user.mobile}
            </p>

            <p className="text-gray-700 flex items-center gap-2">
              <User size={18} /> {user.role?.name}
            </p>

            <p className="text-gray-700 flex items-center gap-2">
              <MapPin size={18} /> {user.state?.name}
            </p>

            <p className="text-gray-700 flex items-center gap-2">
              <Building2 size={18} /> {user.city?.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
