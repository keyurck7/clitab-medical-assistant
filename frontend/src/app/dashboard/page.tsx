"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentUser,
  getProfile,
  getMedicalRecords,
  getAppointments,
  createMedicalRecord,
  createAppointment,
  deleteMedicalRecord,
  updateAppointment
} from "@/services/api";
import EditPatientForm from "@/components/EditpatientForm";
import EditMedicalRecordForm from "@/components/EditMedicalRecordForm";
import EditAppointmentForm from "@/components/EditAppointmentForm";
import { format } from "path";
import AppointmentChart from "@/components/AppointmentChart";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<number | null>(null);
  const [editingAppointmentId, setEditingAppointmentId] = useState<number | null>(null);
  const [recordSearch, setRecordSearch] = useState("");
  const [recordCategoryFilter, setRecordCategoryFilter] = useState("all");
  const [recordSortOrder, setRecordSortOrder] = useState("newest");

  const [recordForm, setRecordForm] = useState({
    title: "",
    category: "",
    description: "",
    record_date: "",
  });

  const [recordFile, setRecordFile] = useState<File | null>(null);

  const [recordMessage, setRecordMessage] = useState("");

  const [appointmentForm, setAppointmentForm] = useState({
    doctor_name: "",
    appointment_date: "",
    appointment_time: "",
    reason: "",
  });


  const [appointmentMessage, setAppointmentMessage] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    async function loadDashboardData() {
      const savedToken = localStorage.getItem("token");

      if (!savedToken) {
        router.push("/login");
        return;
      }

      try {
        setError("");

        const userData = await getCurrentUser();
        setUser(userData);

        const profileData = await getProfile();
        setProfile(profileData);

        const recordsData = await getMedicalRecords();
        setRecords(recordsData);

        const appointmentsData = await getAppointments();
        setAppointments(appointmentsData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load dashboard data");
        }
      }
    }

    loadDashboardData();
  }, [router]);

  const handleRecordChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRecordForm({
      ...recordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleRecordFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    setRecordFile(e.target.files[0]);
  }
};

  const handleRecordSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setRecordMessage("");

  try {
    const formData = new FormData();
    formData.append("title", recordForm.title);
    formData.append("category", recordForm.category);
    formData.append("description", recordForm.description);
    formData.append("record_date", recordForm.record_date);

    if (recordFile) {
      formData.append("file", recordFile);
    }

    await createMedicalRecord(formData);

    setRecordMessage("Medical record created successfully!");

    const updatedRecords = await getMedicalRecords();
    setRecords(updatedRecords);

    setRecordForm({
      title: "",
      category: "",
      description: "",
      record_date: "",
    });

    setRecordFile(null);
  } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Failed to create medical record");
    }
  }
};

  const handleAppointmentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAppointmentForm({
      ...appointmentForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAppointmentMessage("");

    try {
      await createAppointment(appointmentForm);

      setAppointmentMessage("Appointment created successfully!");

      const updatedAppointments = await getAppointments();
      setAppointments(updatedAppointments);

      setAppointmentForm({
        doctor_name: "",
        appointment_date: "",
        appointment_time: "",
        reason: "",
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create appointment");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const getStatusColor = (status: string) => {
  switch (status) {
    case "scheduled":
      return "bg-blue-600";
    case "completed":
      return "bg-green-600";
    case "cancelled":
      return "bg-red-600";
    case "missed":
      return "bg-yellow-500 text-black";
    default:
      return "bg-gray-600";
  }
};

const handleQuickAppointmentStatusUpdate = async (
  appointment: any,
  newStatus: string
) => {
  try {
    const updatedAppointment = await updateAppointment(appointment.id, {
      doctor_name: appointment.doctor_name,
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      reason: appointment.reason,
      status: newStatus,
    });

    setAppointments((prevAppointments) =>
      prevAppointments.map((a) =>
        a.id === updatedAppointment.id ? updatedAppointment : a
      )
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Failed to update appointment status");
    }
  }
};

const filteredRecords = records
  .filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(recordSearch.toLowerCase()) ||
      record.category.toLowerCase().includes(recordSearch.toLowerCase()) ||
      record.description.toLowerCase().includes(recordSearch.toLowerCase());

    const matchesCategory =
      recordCategoryFilter === "all" ||
      record.category.toLowerCase() === recordCategoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  })
  .sort((a, b) => {
    if (recordSortOrder === "newest") {
      return new Date(b.record_date).getTime() - new Date(a.record_date).getTime();
    }
    return new Date(a.record_date).getTime() - new Date(b.record_date).getTime();
  });

  type TimelineRecordItem = {
  id: string;
  type: "record";
  title: string;
  category: string;
  description: string;
  date: string;
  file_url?: string;
  file_name?: string;
};

type TimelineAppointmentItem = {
  id: string;
  type: "appointment";
  doctor_name: string;
  reason: string;
  appointment_time: string;
  status: string;
  date: string;
};

type TimelineItem = TimelineRecordItem | TimelineAppointmentItem;

const timelineItems: TimelineItem[] = [
  ...records.map(
    (record): TimelineRecordItem => ({
      id: `record-${record.id}`,
      type: "record",
      title: record.title,
      category: record.category,
      description: record.description,
      date: record.record_date,
      file_url: record.file_url,
      file_name: record.file_name,
    })
  ),
  ...appointments.map(
    (appointment): TimelineAppointmentItem => ({
      id: `appointment-${appointment.id}`,
      type: "appointment",
      doctor_name: appointment.doctor_name,
      reason: appointment.reason,
      appointment_time: appointment.appointment_time,
      status: appointment.status,
      date: appointment.appointment_date,
    })
  ),
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const getTimelineBadgeColor = (type: string) => {
  return type === "record"
    ? "bg-purple-600"
    : "bg-cyan-600";
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const totalRecords = records.length;

const totalAppointments = appointments.length;

const completedAppointments = appointments.filter(
  (a) => a.status === "completed"
).length;

const upcomingAppointments = appointments.filter(
  (a) => a.status === "scheduled"
).length;


  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg font-semibold"
        >
          Logout
        </button>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {user && (
        <div className="bg-slate-900 p-6 rounded-2xl max-w-xl mb-6">
          <h2 className="text-2xl font-semibold mb-4">User Information</h2>
          <p className="mb-2">
            <strong>Name:</strong> {user.full_name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      )}

      <div className="bg-slate-900 p-6 rounded-2xl max-w-3xl mb-6">
        <h2 className="text-2xl font-semibold mb-4">Patient Profile</h2>

        {!profile ? (
          <p className="text-slate-300">No patient profile found.</p>
        ) : isEditingProfile ? (
          token ? (
            <EditPatientForm
              patient={profile}
              token={token}
              onSuccess={(updatedPatient: any) => {
                setProfile(updatedPatient);
                setIsEditingProfile(false);
              }}
              onCancel={() => setIsEditingProfile(false)}
            />
          ) : (
            <p className="text-red-400">Authentication token missing.</p>
          )
        ) : (
          <>
            <div className="space-y-2 text-slate-200">
              <p>
                <strong>Date of Birth:</strong> {profile.date_of_birth || "N/A"}
              </p>
              <p>
                <strong>Blood Group:</strong> {profile.blood_group?.trim() || "N/A"}
              </p>
              <p>
                <strong>Allergies:</strong> {profile.allergies?.trim() || "N/A"}
              </p>
              <p>
                <strong>Chronic Conditions:</strong> {profile.chronic_conditions?.trim() || "N/A"}
              </p>
              <p>
                <strong>Emergency Contact:</strong> {profile.emergency_contact?.trim() || "N/A"}
              </p>
            </div>

            <button
              onClick={() => setIsEditingProfile(true)}
              className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold"
            >
              Edit Profile
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
    <p className="text-slate-400 text-sm">Medical Records</p>
    <p className="text-2xl font-bold text-purple-400">{totalRecords}</p>
  </div>

  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
    <p className="text-slate-400 text-sm">Appointments</p>
    <p className="text-2xl font-bold text-blue-400">{totalAppointments}</p>
  </div>

  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
    <p className="text-slate-400 text-sm">Completed</p>
    <p className="text-2xl font-bold text-green-400">
      {completedAppointments}
    </p>
  </div>

  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
    <p className="text-slate-400 text-sm">Upcoming</p>
    <p className="text-2xl font-bold text-yellow-400">
      {upcomingAppointments}
    </p>
  </div>

</div>

<AppointmentChart appointments={appointments} />

      <div className="flex flex-col md:flex-row gap-3 mb-4">
  <input
    type="text"
    placeholder="Search records..."
    value={recordSearch}
    onChange={(e) => setRecordSearch(e.target.value)}
    className="flex-1 p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
  />

  <select
    value={recordCategoryFilter}
    onChange={(e) => setRecordCategoryFilter(e.target.value)}
    className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
  >
    <option value="all">All Categories</option>
    <option value="lab report">Lab Report</option>
    <option value="prescription">Prescription</option>
    <option value="scan">Scan</option>
    <option value="diagnosis">Diagnosis</option>
  </select>

  <select
    value={recordSortOrder}
    onChange={(e) => setRecordSortOrder(e.target.value)}
    className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
  >
    <option value="newest">Newest First</option>
    <option value="oldest">Oldest First</option>
  </select>
</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-6 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-4">Create Medical Record</h2>

          <form onSubmit={handleRecordSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={recordForm.title}
              onChange={handleRecordChange}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
              required
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={recordForm.category}
              onChange={handleRecordChange}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
              required
            />

            <textarea
              name="description"
              placeholder="Description"
              value={recordForm.description}
              onChange={handleRecordChange}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
              rows={4}
              required
            />

            <input
              type="date"
              name="record_date"
              value={recordForm.record_date}
              onChange={handleRecordChange}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
              required
            />

            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleRecordFileChange}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg font-semibold"
            >
              Create Record
            </button>
          </form>

          {recordMessage && (
            <p className="text-green-400 mt-4">{recordMessage}</p>
          )}
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-4">Medical Records</h2>

          {filteredRecords.length === 0 ? (
  <p className="text-slate-300">No matching medical records found.</p>
) : (
            <div className="space-y-4">
              {filteredRecords.map((record) => (
  <div
    key={record.id}
    className="bg-slate-800 p-4 rounded-xl border border-slate-700"
  >
    {editingRecordId === record.id ? (
      <EditMedicalRecordForm
        record={record}
        onSuccess={(updatedRecord) => {
          setRecords((prevRecords) =>
            prevRecords.map((r) =>
              r.id === updatedRecord.id ? updatedRecord : r
            )
          );
          setEditingRecordId(null);
        }}
        onCancel={() => setEditingRecordId(null)}
      />
    ) : (
      <>
        <p>
          <strong>Title:</strong> {record.title}
        </p>
        <p>
          <strong>Category:</strong> {record.category}
        </p>
        <p>
          <strong>Description:</strong> {record.description}
        </p>
        <p>
          <strong>Date:</strong> {record.record_date}
        </p>

        {record.file_url && (
        <p className="mt-2">
        <strong>Attachment:</strong>{" "}
       <a
        href={record.file_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 underline"
       >
      {record.file_name || "View File"}
       </a>
       </p>
      )}

        <button
          onClick={() => setEditingRecordId(record.id)}
          className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold"
        >
          Edit Record
        </button>

        <button
  onClick={async () => {
    if (!confirm("Delete this record?")) return;

    await deleteMedicalRecord(record.id);

    setRecords((prev) =>
      prev.filter((r) => r.id !== record.id)
    );
  }}
  className="mt-2 ml-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white"
>
  Delete
</button>
      </>
    )}
  </div>
))}
            </div>
          )}
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-4">Create Appointment</h2>

          <form onSubmit={handleAppointmentSubmit} className="space-y-4">
            <input
              type="text"
              name="doctor_name"
              placeholder="Doctor Name"
              value={appointmentForm.doctor_name}
              onChange={handleAppointmentChange}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
              required
            />

            <input
              type="date"
              name="appointment_date"
              value={appointmentForm.appointment_date}
              onChange={handleAppointmentChange}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
              required
            />

            <input
              type="time"
              name="appointment_time"
              value={appointmentForm.appointment_time}
              onChange={handleAppointmentChange}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
              required
            />

            <textarea
              name="reason"
              placeholder="Reason"
              value={appointmentForm.reason}
              onChange={handleAppointmentChange}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
              rows={4}
              required
            />

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-lg font-semibold"
            >
              Create Appointment
            </button>
          </form>

          {appointmentMessage && (
            <p className="text-green-400 mt-4">{appointmentMessage}</p>
          )}
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-4">Appointments</h2>

          {appointments.length === 0 ? (
            <p className="text-slate-300">No appointments found.</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
  <div
    key={appointment.id}
    className="bg-slate-800 p-4 rounded-xl border border-slate-700"
  >
    {editingAppointmentId === appointment.id ? (
      <EditAppointmentForm
        appointment={appointment}
        onSuccess={(updatedAppointment) => {
          setAppointments((prevAppointments) =>
            prevAppointments.map((a) =>
              a.id === updatedAppointment.id ? updatedAppointment : a
            )
          );
          setEditingAppointmentId(null);
        }}
        onCancel={() => setEditingAppointmentId(null)}
      />
    ) : (
      <>
  <p>
    <strong>Doctor:</strong> {appointment.doctor_name}
  </p>
  <p>
    <strong>Date:</strong> {appointment.appointment_date}
  </p>
  <p>
    <strong>Time:</strong> {appointment.appointment_time}
  </p>
  <p>
    <strong>Reason:</strong> {appointment.reason}
  </p>
  <p className="mt-2">
    <strong>Status:</strong>{" "}
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
        appointment.status
      )}`}
    >
      {appointment.status}
    </span>
  </p>

  <div className="flex gap-2 mt-4 flex-wrap">
    <button
      onClick={() =>
        handleQuickAppointmentStatusUpdate(appointment, "completed")
      }
      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-semibold"
    >
      Mark Completed
    </button>

    <button
      onClick={() =>
        handleQuickAppointmentStatusUpdate(appointment, "cancelled")
      }
      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-semibold"
    >
      Cancel
    </button>

    <button
      onClick={() =>
        handleQuickAppointmentStatusUpdate(appointment, "missed")
      }
      className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg text-black font-semibold"
    >
      Mark Missed
    </button>

    <button
      onClick={() => setEditingAppointmentId(appointment.id)}
      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold"
    >
      Edit Appointment
    </button>
  </div>
</>
    )}
  </div>
))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-900 p-6 rounded-2xl mt-6">
  <h2 className="text-2xl font-semibold mb-4">Patient Timeline</h2>

  {timelineItems.length === 0 ? (
    <p className="text-slate-300">No timeline events found.</p>
  ) : (
    <div className="space-y-4">
      {timelineItems.map((item) => (
  <div
    key={item.id}
    className="bg-slate-800 p-4 rounded-xl border border-slate-700"
  >
    <div className="flex items-center gap-3 mb-2 flex-wrap">
      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${getTimelineBadgeColor(
          item.type
        )}`}
      >
        {item.type === "record" ? "Medical Record" : "Appointment"}
      </span>

      <span className="text-slate-300 text-sm font-medium">
        {formatDate(item.date)}
      </span>
    </div>

    {item.type === "record" ? (
      <>
        <p>
          <strong>Title:</strong> {item.title}
        </p>
        <p>
          <strong>Category:</strong> {item.category}
        </p>
        <p>
          <strong>Description:</strong> {item.description}
        </p>

        {item.file_url && (
          <p className="mt-2">
            <strong>Attachment:</strong>{" "}
            <a
              href={item.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              {item.file_name || "View File"}
            </a>
          </p>
        )}
      </>
    ) : (
      <>
        <p>
          <strong>Doctor:</strong> {item.doctor_name}
        </p>
        <p>
          <strong>Reason:</strong> {item.reason}
        </p>
        <p>
          <strong>Time:</strong> {item.appointment_time}
        </p>
        <p>
          <strong>Status:</strong> {item.status}
        </p>
      </>
    )}
  </div>
))}
    </div>
  )}
</div>
      
    </main>
  );
}