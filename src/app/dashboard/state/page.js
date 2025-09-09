"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Trash } from "lucide-react";

const StateTable = () => {
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchCountries();
    fetchStates();
  }, []);

  // Fetch Countries
  const fetchCountries = async () => {
    try {
      const response = await fetch("https://crud.parxfit.com/api/master/data-filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table_name: "countries" }),
      });
      if (!response.ok) throw new Error("Failed to fetch countries");
      const data = await response.json();
      if (Array.isArray(data.data)) setCountries(data.data);
    } catch (err) {
      console.error("Error fetching countries:", err);
    }
  };

  // Fetch States
  const fetchStates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://crud.parxfit.com/api/master/data-filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table_name: "states" }),
      });
      if (!response.ok) throw new Error(`Failed to fetch states: ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data.data)) setStates(data.data);
      else throw new Error("Invalid response structure");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete State
  const deleteState = async (id) => {
    if (!confirm("Are you sure you want to delete this state?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`https://crud.parxfit.com/api/master/destroy/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table_name: "states" }),
      });
      if (!response.ok) throw new Error(`Failed to delete state: ${response.status}`);
      alert("State deleted successfully!");
      fetchStates();
    } catch (error) {
      alert("Failed to delete state: " + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-2">
      {/* Header */}
      <div className="fixed top-0 left-64 right-0 flex items-center justify-between px-6 py-4 bg-white shadow-md z-50 w-[calc(100%-16rem)]">
        <h1 className="text-2xl font-bold text-gray-800">States</h1>
        <Link href="/dashboard/state/new">
          <button className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white rounded-xl bg-gradient-to-r from-green-500 to-blue-600 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
            Add New
          </button>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mt-20">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-6 text-gray-500">Loading...</p>
          ) : (
            <table className="w-full text-sm">
              {/* Table Head */}
              <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
                <tr>
                  {["ID", "State Name", "State Note", "Country", "Actions"].map(
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

              {/* Table Body */}
              <tbody className="divide-y divide-gray-100">
                {states.length > 0 ? (
                  states.map((state, index) => (
                    <tr
                      key={state.id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100 transition`}
                    >
                      <td className="px-6 py-3 font-medium text-gray-900">
                        {state.id}
                      </td>
                      <td className="px-6 py-3 text-gray-700">{state.name}</td>
                      <td className="px-6 py-3 text-gray-700">{state.note || "-"}</td>
                      <td className="px-6 py-3 text-gray-700">
                        {countries.find((c) => c.id === state.country_id)?.name || "-"}
                      </td>
                      <td className="px-6 py-3 flex items-center gap-3">
                        {/* Edit Button using query param */}
                        <Link
                          href={`/dashboard/state/edit?id=${state.id}`}
                          className="p-2 rounded-full text-blue-600 hover:bg-blue-50 transition"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>

                        {/* Delete Button */}
                        <button
                          onClick={() => deleteState(state.id)}
                          disabled={deletingId === state.id}
                          className={`p-2 rounded-full transition ${
                            deletingId === state.id
                              ? "bg-gray-300 cursor-not-allowed text-gray-600"
                              : "text-red-600 hover:bg-red-50"
                          }`}
                          title="Delete"
                        >
                          {deletingId === state.id ? "..." : <Trash className="w-5 h-5" />}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <span className="text-3xl mb-2">📭</span>
                        <p className="italic">No states found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StateTable;
