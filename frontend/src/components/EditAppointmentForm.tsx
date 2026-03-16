"use client";

import { useState } from "react";
import { updateAppointment } from "@/services/api";

type Appointment = {
  id: number;
  doctor_name: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  status: string;
};

type Props = {
  appointment: Appointment;
  onSuccess?: (updatedAppointment: Appointment) => void;
  onCancel?: () => void;
};

export default function EditAppointmentForm({
  appointment,
  onSuccess,
  onCancel,
}: Props) {
  const [formData, setFormData] = useState({
    doctor_name: appointment.doctor_name || "",
    appointment_date: appointment.appointment_date || "",
    appointment_time: appointment.appointment_time || "",
    reason: appointment.reason || "",
    status: appointment.status || "scheduled",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      const updatedAppointment = await updateAppointment(appointment.id, formData);
      onSuccess?.(updatedAppointment);
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
        name="doctor_name"
        value={formData.doctor_name}
        onChange={handleChange}
        placeholder="Doctor Name"
        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
        required
      />

      <input
        type="date"
        name="appointment_date"
        value={formData.appointment_date}
        onChange={handleChange}
        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
        required
      />

      <input
        type="time"
        name="appointment_time"
        value={formData.appointment_time}
        onChange={handleChange}
        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
        required
      />

      <textarea
        name="reason"
        value={formData.reason}
        onChange={handleChange}
        placeholder="Reason"
        rows={4}
        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
        required
      />

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
        required
      >
        <option value="scheduled">Scheduled</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
        <option value="missed">Missed</option>
      </select>

      {error && <p className="text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}