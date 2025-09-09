"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddStatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    note: "",
    country_id: "",
  });
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // ✅ added error state

  // Fetch countries for dropdown
  const fetchCountries = async () => {
    try {
      const res = await fetch("https://crud.parxfit.com/api/master/data-filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table_name: "countries" }),
      });

      if (!res.ok) throw new Error("Failed to fetch countries");

      const data = await res.json();
      setCountries(data?.data || []);
    } catch (err) {
      console.error("Failed to fetch countries:", err);
      setError("❌ Failed to load countries");
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null); // clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("State name is required");
      return;
    }
    if (!formData.country_id) {
      setError("Please select a country");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        table_name: "states", // required by API
        name: formData.name.trim(),
        note: formData.note.trim(),
        country_id: Number(formData.country_id),
      };

      console.log("➡️ Sending Payload:", payload);

      const res = await fetch("https://crud.parxfit.com/api/master", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("✅ API Response:", data);

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to add state");
      }

      alert("✅ State added successfully!");
      router.push("/dashboard/state");
    } catch (err) {
      console.error("❌ Error saving state:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2">
      {/* ✅ Header */}
      <div className="fixed top-0 left-64 right-0 flex items-center justify-between px-6 py-4 bg-white shadow-md z-50 w-[calc(100%-16rem)]">
        <h1 className="text-2xl font-bold text-gray-800">Add State</h1>
        <Link href="/dashboard/state">
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white rounded-xl bg-gradient-to-r from-gray-500 to-gray-700 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            ← Back
          </button>
        </Link>
      </div>

      {/* ✅ Form Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 max-w-xl mx-auto mt-24 p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="State Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="text"
            name="note"
            placeholder="Note"
            value={formData.note}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <select
            name="country_id"
            value={formData.country_id}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>

          {/* ✅ Show error message */}
          {error && <p className="text-red-500 font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            {loading ? "Saving..." : "Save State"}
          </button>
        </form>
      </div>
    </div>
  );
}
