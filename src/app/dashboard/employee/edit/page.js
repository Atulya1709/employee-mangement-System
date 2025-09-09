"use client";
import { useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function EditEmployeePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const employeeId = searchParams.get("id");

  const [formData, setFormData] = useState({
    f_name: "",
    l_name: "",
    email: "",
    mobile: "",
    role_id: "",
    country_id: "",
    state_id: "",
    city_id: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 

  
  const [roles, setRoles] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Fetch master data
  const fetchMasterData = async (table, setter) => {
    try {
      const res = await fetch("https://crud.parxfit.com/api/master/data-filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table_name: table }),
      });
      const data = await res.json();
      setter(data?.data || []);
    } catch (err) {
      console.error(`Failed to fetch ${table}:`, err);
    }
  };

  // Fetch single employee
  useEffect(() => {
    if (!employeeId) return;

    const fetchEmployee = async () => {
      try {
        const res = await fetch(
          `https://crud.parxfit.com/api/users/${employeeId}`
        );
        if (!res.ok) throw new Error("Failed to fetch employee");

        const data = await res.json();
        setFormData(data.user); 
      } catch (error) {
        console.error("Error fetching employee:", error);
        setError("Failed to load employee data"); // 
      } finally {
        setLoading(false);
      }
    };

    
    fetchEmployee();
    fetchMasterData("roles", setRoles);
    fetchMasterData("countries", setCountries);
    fetchMasterData("states", setStates);
    fetchMasterData("cities", setCities);
  }, [employeeId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null); // clear error on change
  };

  // Update employee
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `https://crud.parxfit.com/api/users/${employeeId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Failed to update employee");

      alert("Employee updated successfully!");
      router.push("/dashboard/employee");
    } catch (error) {
      console.error("Update failed:", error);
      setError("Error updating employee"); // 
    }
  };

  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading employee...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      {/* ✅ Header (same as State Edit page) */}
      <div className="fixed top-0 left-64 right-0 flex items-center justify-between px-6 py-4 bg-white shadow-md z-50 w-[calc(100%-16rem)]">
        <h1 className="text-2xl font-bold text-gray-800">Edit Employee</h1>
        <Link href="/dashboard/employee">
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white rounded-xl bg-gradient-to-r from-gray-500 to-gray-700 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            ← Back
          </button>
        </Link>
      </div>

      {/* ✅ Form Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 max-w-3xl mx-auto mt-24 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First + Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="f_name"
              value={formData.f_name}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="l_name"
              value={formData.l_name}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email + Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Role / Country / State / City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            <select
              name="country_id"
              value={formData.country_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              name="state_id"
              value={formData.state_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              name="city_id"
              value={formData.city_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select City</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Note */}
         

          {error && <p className="text-red-500">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            {loading ? "Updating..." : "Update Employee"}
          </button>
        </form>
      </div>
    </div>
  );
}
