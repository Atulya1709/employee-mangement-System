"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
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

  const router = useRouter();

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

  const registerUser = async () => {
    if (loading) return;

    // Basic validation
    if (!f_name || !l_name || !email || !password || !password_confirmation) {
      alert("Please fill all required fields!");
      return;
    }

    if (password !== password_confirmation) {
      alert("Passwords do not match!");
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
      if (!response.ok) throw new Error(data.message || "Failed to register");

      alert("✅ User registered successfully!");

      // Clear form
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

      router.push("/dashboard");
    } catch (error) {
      console.error("❌ Error registering user:", error);
      alert("Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-8">
          Create Account
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">First Name</label>
            <input
              type="text"
              placeholder="Enter first name"
              value={f_name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Last Name</label>
            <input
              type="text"
              placeholder="Enter last name"
              value={l_name}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Mobile</label>
            <input
              type="tel"
              pattern="[0-9]{10}"
              placeholder="Enter mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Role</label>
            <select
              value={role_id}
              onChange={(e) => setRoleid(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Country */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Country</label>
            <select
              value={country_id}
              onChange={(e) => setCountryid(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
            >
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* State */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">State</label>
            <select
              value={state_id}
              onChange={(e) => setStateid(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
              disabled={!country_id}
            >
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">City</label>
            <select
              value={city_id}
              onChange={(e) => setCityid(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
              disabled={!state_id}
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
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">Note</label>
            <input
              type="text"
              placeholder="Add a note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={password_confirmation}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={registerUser}
          disabled={loading}
          className={`mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-transform transform hover:scale-105 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </div>
  );
}
