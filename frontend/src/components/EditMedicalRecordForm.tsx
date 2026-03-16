"use client";

import { useState } from "react";
import { updateMedicalRecord } from "@/services/api";

type MedicalRecord = {
  id: number;
  title: string;
  category: string;
  description: string;
  record_date: string;
};

type Props = {
  record: MedicalRecord;
  onSuccess?: (updatedRecord: MedicalRecord) => void;
  onCancel?: () => void;
};

export default function EditMedicalRecordForm({
  record,
  onSuccess,
  onCancel,
}: Props) {
  const [formData, setFormData] = useState({
    title: record.title || "",
    category: record.category || "",
    description: record.description || "",
    record_date: record.record_date || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const updatedRecord = await updateMedicalRecord(record.id, formData);

      if (onSuccess) {
        onSuccess(updatedRecord);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong while updating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
        required
      />

      <input
        type="text"
        name="category"
        value={formData.category}
        onChange={handleChange}
        placeholder="Category"
        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
        required
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
        rows={4}
        required
      />

      <input
        type="date"
        name="record_date"
        value={formData.record_date}
        onChange={handleChange}
        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
        required
      />

      {error && <p className="text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}