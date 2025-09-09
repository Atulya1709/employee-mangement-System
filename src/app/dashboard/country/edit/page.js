"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EditCountryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // 

  const [country, setCountry] = useState({ name: "", note: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  
  useEffect(() => {
    if (!id) return;

    const fetchCountry = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://crud.parxfit.com/api/master/show/${id}?table_name=countries`
        );

        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

        const data = await res.json();
        setCountry({
          name: data?.data?.name || "",
          note: data?.data?.note || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [id]);

  //  Update country
  const updateCountry = async () => {
    if (!country.name.trim()) {
      setError("Country name is required");
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const res = await fetch(
        `https://crud.parxfit.com/api/master/update/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table_name: "countries",
            name: country.name.trim(),
            note: country.note.trim(),
          }),
        }
      );

      if (!res.ok) {
        let errorMessage = `HTTP error: ${res.status}`;
        try {
          const errData = await res.json();
          errorMessage = errData.message || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      alert("Country updated successfully!");
      router.push("/dashboard/country");
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
        <h1 className="text-2xl font-bold text-gray-800">Edit Country</h1>
        <button
          type="button"
          onClick={() => router.push("/dashboard/country")}
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
            <p className="mt-3 text-gray-600">Loading country data...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 bg-red-50 rounded-md text-center">
            Error: {error}
          </div>
        ) : (
          <form className="space-y-6">
          
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country Name *
              </label>
              <input
                type="text"
                value={country.name}
                onChange={(e) =>
                  setCountry({ ...country, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={isUpdating}
                required
              />
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country Note
              </label>
              <textarea
                value={country.note}
                onChange={(e) =>
                  setCountry({ ...country, note: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={isUpdating}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={updateCountry}
                disabled={isUpdating || loading}
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl"
              >
                {isUpdating ? "Updating..." : "Update Country"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/dashboard/country")}
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
