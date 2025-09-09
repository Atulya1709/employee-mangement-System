"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit,  Trash } from "lucide-react";

const CitiesTable = () => {
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const router = useRouter();

  // Fetch Countries
  const fetchCountries = async () => {
    try {
      setError(null);
      const res = await fetch("https://crud.parxfit.com/api/master/data-filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table_name: "countries" }),
      });
      if (!res.ok) throw new Error("Failed to fetch countries");
      const data = await res.json();
      if (Array.isArray(data.data)) setCountries(data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch States
  const fetchStates = async () => {
    try {
      setError(null);
      const res = await fetch("https://crud.parxfit.com/api/master/data-filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table_name: "states" }),
      });
      if (!res.ok) throw new Error("Failed to fetch states");
      const data = await res.json();
      if (Array.isArray(data.data)) setStates(data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch Cities
  const fetchCities = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://crud.parxfit.com/api/master/data-filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table_name: "cities" }),
      });
      if (!res.ok) throw new Error("Failed to fetch cities");
      const data = await res.json();
      setCities(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete City
  const handleDelete = async (cityId) => {
    if (!window.confirm("Are you sure you want to delete this city?")) return;

    setDeletingId(cityId);
    try {
      const res = await fetch(`https://crud.parxfit.com/api/master/destroy/${cityId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table_name: "cities" }),
      });
      if (!res.ok) throw new Error("Failed to delete city");
      alert("City deleted successfully!");
      fetchCities();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchCountries();
    fetchStates();
    fetchCities();
  }, []);

  return (
    <div className="p-1">
      {/* Header */}
      <div className="fixed top-0 left-64 right-0 flex justify-between items-center px-6 py-4 bg-white shadow-md z-50 w-[calc(100%-16rem)]">
        <h1 className="text-2xl font-bold text-gray-800">Cities</h1>
        <Link
          href="/dashboard/city/new"
          className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white rounded-xl bg-gradient-to-r from-green-500 to-blue-600 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          Add New
        </Link>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto mt-24">
        {loading && (
          <div className="flex flex-col items-center py-10">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-600">Loading cities...</p>
          </div>
        )}

        {error && <p className="text-red-500 text-center py-4">Error: {error}</p>}

        {!loading && !error && cities.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-sm">
                <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
                  <tr>
                    {["#", "Country", "State", "City Name", "City Note", "Actions"].map(
                      (heading) => (
                        <th
                          key={heading}
                          className="px-6 py-3 text-gray-700 font-semibold uppercase tracking-wider text-xs text-left"
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cities.map((city, index) => {
                    const state = states.find((s) => Number(s.id) === Number(city.state_id));
                    const country = countries.find(
                      (c) => Number(c.id) === Number(state?.country_id)
                    );

                    return (
                      <tr
                        key={city.id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-gray-100 transition`}
                      >
                        <td className="px-6 py-3 font-medium text-gray-900">{index + 1}</td>
                        <td className="px-6 py-3 text-gray-700">{country?.name || "N/A"}</td>
                        <td className="px-6 py-3 text-gray-700">{state?.name || "N/A"}</td>
                        <td className="px-6 py-3 text-gray-700">{city.name}</td>
                        <td className="px-6 py-3 text-gray-600">{city.note || "-"}</td>
                        <td className="px-6 py-3 flex items-center gap-3">
                         
                          <Link
                            href={`/dashboard/city/edit?id=${city.id}`}
                            className="p-2 rounded-full text-blue-600 hover:bg-blue-50 transition"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(city.id)}
                            disabled={deletingId === city.id}
                            className={`p-2 rounded-full transition ${
                              deletingId === city.id
                                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                                : "text-red-600 hover:bg-red-50"
                            }`}
                            title="Delete"
                          >
                            {deletingId === city.id ? "..." : <Trash className="w-5 h-5" />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && !error && cities.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <span className="text-3xl mb-2 block">📭</span>
            <p className="italic">No cities found</p>
            <Link
              href="/dashboard/city/new"
              className="mt-4 inline-block px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl shadow hover:scale-105 transition"
            >
              Add City
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitiesTable;
