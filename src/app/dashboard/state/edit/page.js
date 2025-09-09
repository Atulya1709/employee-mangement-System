"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EditStatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // ✅ Get state ID from query string

  const [stateData, setStateData] = useState({ name: "", note: "", country_id: "" });
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

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
      if (Array.isArray(data.data)) setCountries(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch state details
  const fetchState = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://crud.parxfit.com/api/master/show/${id}?table_name=states`);
      if (!res.ok) throw new Error(`Failed to fetch state: ${res.status}`);
      const data = await res.json();
      setStateData({
        name: data?.data?.name || "",
        note: data?.data?.note || "",
        country_id: data?.data?.country_id || "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
    fetchState();
  }, [id]);

  // Update state
  const updateState = async () => {
    if (!stateData.name.trim() || !stateData.country_id) {
      setError("State name and country are required");
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const res = await fetch(`https://crud.parxfit.com/api/master/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table_name: "states",
          name: stateData.name.trim(),
          note: stateData.note.trim(),
          country_id: stateData.country_id,
        }),
      });

      if (!res.ok) {
        let msg = `HTTP error: ${res.status}`;
        try {
          const errData = await res.json();
          msg = errData.message || msg;
        } catch {}
        throw new Error(msg);
      }

      alert("State updated successfully!");
      router.push("/dashboard/state");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-5 pt-20 bg-gray-100 min-h-screen ml-64">
      {/* Header */}
      <div className="fixed top-0 left-64 right-0 flex items-center justify-between px-6 py-4 bg-white shadow-md z-50 w-[calc(100%-16rem)]">
        <h1 className="text-2xl font-bold text-gray-800">Edit State</h1>
        <button
          type="button"
          onClick={() => router.push("/dashboard/state")}
          className="px-5 py-2 bg-gray-500 text-white rounded-xl"
          disabled={isUpdating}
        >
          ← Back
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 max-w-3xl mx-auto mt-24 p-8">
        {loading ? (
          <div className="flex flex-col items-center py-10">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-600">Loading state data...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 bg-red-50 rounded-md text-center">{error}</div>
        ) : (
          <form className="space-y-6">
            {/* State Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State Name *
              </label>
              <input
                type="text"
                value={stateData.name}
                onChange={(e) => setStateData({ ...stateData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={isUpdating}
                required
              />
            </div>

            {/* State Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State Note
              </label>
              <textarea
                value={stateData.note}
                onChange={(e) => setStateData({ ...stateData, note: e.target.value })}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={isUpdating}
              />
            </div>

            {/* Country Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <select
                value={stateData.country_id}
                onChange={(e) => setStateData({ ...stateData, country_id: e.target.value })}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={isUpdating}
                required
              >
                <option value="">Select Country</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={updateState}
                disabled={isUpdating || loading}
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl"
              >
                {isUpdating ? "Updating..." : "Update State"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/dashboard/state")}
                disabled={isUpdating}
                className="flex-1 py-3 bg-gray-400 text-white rounded-xl"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
