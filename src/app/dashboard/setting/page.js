"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Globe, Bell } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: "light",
    language: "English",
    notifications: "true",
    timezone: "GMT+5:30",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch Settings from API
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://crud.parxfit.com/api/master/data-filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table_name: "settings" }),
      });

      if (!res.ok) throw new Error("Failed to fetch settings");

      const data = await res.json();
      const mapped = {};
      data.data.forEach((item) => {
        mapped[item.key] = item.value;
      });

      setSettings((prev) => ({ ...prev, ...mapped }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // ✅ Save Settings to API
  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await fetch("https://crud.parxfit.com/api/master", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table_name: "settings",
            key,
            value: String(value),
          }),
        });
      }
      alert("✅ Settings saved successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) return <p className="p-6">Loading settings...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">⚙️ App Settings</h1>

      <div className="space-y-4">
        {/* Theme */}
        <div className="p-4 border rounded-xl flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            {settings.theme === "light" ? (
              <Sun className="text-yellow-500" />
            ) : (
              <Moon className="text-blue-500" />
            )}
            <div>
              <h2 className="font-semibold">Theme</h2>
              <p className="text-sm text-gray-500">Choose Light or Dark mode</p>
            </div>
          </div>
          <select
            value={settings.theme}
            onChange={(e) => handleChange("theme", e.target.value)}
            className="border rounded p-2"
          >
            <option value="light">🌞 Light</option>
            <option value="dark">🌙 Dark</option>
          </select>
        </div>

        {/* Language */}
        <div className="p-4 border rounded-xl flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <Globe className="text-green-600" />
            <div>
              <h2 className="font-semibold">Language</h2>
              <p className="text-sm text-gray-500">Set your preferred language</p>
            </div>
          </div>
          <select
            value={settings.language}
            onChange={(e) => handleChange("language", e.target.value)}
            className="border rounded p-2"
          >
            <option>English</option>
            <option>हिंदी</option>
            <option>Español</option>
            <option>Français</option>
          </select>
        </div>

        {/* Notifications */}
        <div className="p-4 border rounded-xl flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <Bell className="text-purple-600" />
            <div>
              <h2 className="font-semibold">Notifications</h2>
              <p className="text-sm text-gray-500">Enable or disable app alerts</p>
            </div>
          </div>
          <button
            onClick={() =>
              handleChange("notifications", settings.notifications === "true" ? "false" : "true")
            }
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition ${
              settings.notifications === "true" ? "bg-blue-600" : "bg-gray-400"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                settings.notifications === "true" ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Timezone */}
        <div className="p-4 border rounded-xl flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-lg">🕒</span>
            <div>
              <h2 className="font-semibold">Timezone</h2>
              <p className="text-sm text-gray-500">Adjust your system timezone</p>
            </div>
          </div>
          <select
            value={settings.timezone}
            onChange={(e) => handleChange("timezone", e.target.value)}
            className="border rounded p-2"
          >
            <option>GMT</option>
            <option>GMT+5:30</option>
            <option>GMT+1</option>
            <option>GMT-5</option>
          </select>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 text-right">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
