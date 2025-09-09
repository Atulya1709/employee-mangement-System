"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddEmployeePage() {
  const [f_name, setName] = useState("");
  const [l_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [role_id, setRoleid] = useState("");
  const [country_id, setCountryid] = useState("");
  const [state_id, setStateid] = useState("");
  const [city_id, setCityid] = useState("");
  const [note, setNote] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setConfirmPassword] = useState("");

  const [roles, setRoles] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  // Fetch Roles and Countries
  useEffect(() => {
    fetchData("roles", setRoles);
    fetchData("countries", setCountries);
  }, []);

  const fetchData = async (table, setter, filters = {}) => {
    try {
      const res = await fetch("https://crud.parxfit.com/api/master/data-filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table_name: table, ...filters }),
      });
      const data = await res.json();
      setter(data.data);
    } catch (err) {
      console.error("Failed to fetch", table, err);
    }
  };

  useEffect(() => {
    if (country_id) {
      fetchData("states", setStates, { country_id });
      setStateid("");
      setCityid("");
      setCities([]);
    }
  }, [country_id]);

  useEffect(() => {
    if (state_id) {
      fetchData("cities", setCities, { state_id });
      setCityid("");
    }
  }, [state_id]);

  const addEmployee = async (e) => {
    e.preventDefault();

    if (!f_name || !l_name || !email || !mobile || !role_id || !password || !password_confirmation) {
      setError("Please fill all required fields!");
      return;
    }

    if (password !== password_confirmation) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://crud.parxfit.com/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          f_name,
          l_name,
          email,
          mobile,
          role_id,
          country_id,
          state_id,
          city_id,
          note,
          password,
          password_confirmation,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add employee");

      alert("✅ Employee added successfully!");

      // Reset form
      setName("");
      setLastName("");
      setEmail("");
      setMobile("");
      setRoleid("");
      setCountryid("");
      setStateid("");
      setCityid("");
      setNote("");
      setPassword("");
      setConfirmPassword("");
      setError(null);

      router.push("/dashboard/employee");
    } catch (error) {
      console.error("❌ Error adding employee:", error);
      setError("Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2">
      {/* Header */}
      <div className="fixed top-0 left-64 right-0 flex items-center justify-between px-6 py-4 bg-white shadow-md z-50 w-[calc(100%-16rem)]">
        <h1 className="text-2xl font-bold text-gray-800">Add Employee</h1>
        <Link href="/dashboard/employee">
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white rounded-xl bg-gradient-to-r from-gray-500 to-gray-700 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            ← Back
          </button>
        </Link>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 max-w-3xl mx-auto mt-24 p-8">
        <form onSubmit={addEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <input
            type="text"
            placeholder="First Name"
            value={f_name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
          />

          {/* Last Name */}
          <input
            type="text"
            placeholder="Last Name"
            value={l_name}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
          />

          {/* Mobile */}
          <input
            type="tel"
            pattern="[0-9]{10}"
            placeholder="Mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
          />

          {/* Role */}
          <select
            value={role_id}
            onChange={(e) => setRoleid(e.target.value)}
            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Role</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          {/* Country */}
          <select
            value={country_id}
            onChange={(e) => setCountryid(e.target.value)}
            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* State */}
          <select
            value={state_id}
            onChange={(e) => setStateid(e.target.value)}
            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-green-500"
            disabled={!country_id}
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* City */}
          <select
            value={city_id}
            onChange={(e) => setCityid(e.target.value)}
            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-green-500"
            disabled={!state_id}
          >
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Note */}
          <input
            type="text"
            placeholder="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full md:col-span-2 p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
          />

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            value={password_confirmation}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
          />

          {error && <p className="text-red-500 font-medium md:col-span-2">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            {loading ? "Saving..." : "Save Employee"}
          </button>
        </form>
      </div>
    </div>
  );
}
