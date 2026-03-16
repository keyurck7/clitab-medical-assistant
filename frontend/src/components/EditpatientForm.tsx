"use client";

import { useState } from "react";
import { updatePatientProfile } from "@/services/api";

type PatientProfile = {
  date_of_birth: string;
  blood_group: string;
  allergies: string;
  chronic_conditions: string;
  emergency_contact: string;
};

type Props = {
  patient: PatientProfile;
  token: string;
  onSuccess?: (updatedPatient: PatientProfile) => void;
  onCancel?: () => void;
};

export default function EditPatientForm({
  patient,
  token,
  onSuccess,
  onCancel,
}: Props) {
  const [formData, setFormData] = useState({
    date_of_birth: patient.date_of_birth || "",
    blood_group: patient.blood_group || "",
    allergies: patient.allergies || "",
    chronic_conditions: patient.chronic_conditions || "",
    emergency_contact: patient.emergency_contact || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      const updatedPatient = await updatePatientProfile(formData, token);
      if (onSuccess) {
        onSuccess(updatedPatient);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong while updating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="date"
        name="date_of_birth"
        value={formData.date_of_birth}
        onChange={handleChange}
        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
        required
      />

      <input
        type="text"
        name="blood_group"
        placeholder="Blood Group"
        value={formData.blood_group}
        onChange={handleChange}
        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
      />

      <textarea
        name="allergies"
        placeholder="Allergies"
        value={formData.allergies}
        onChange={handleChange}
        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
        rows={3}
      />

      <textarea
        name="chronic_conditions"
        placeholder="Chronic Conditions"
        value={formData.chronic_conditions}
        onChange={handleChange}
        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
        rows={3}
      />

      <input
        type="text"
        name="emergency_contact"
        placeholder="Emergency Contact"
        value={formData.emergency_contact}
        onChange={handleChange}
        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
      />

      {error && <p className="text-red-400">{error}</p>}
      {success && <p className="text-green-400">{success}</p>}

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