const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function registerUser(data: {
  full_name: string;
  email: string;
  password: string;
  role: string;
}) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Registration failed");
  }

  return response.json();
}

export async function loginUser(data: {
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Login failed");
  }

  return response.json();
}

export async function getProfile() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/patients/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to load profile");
  }

  return response.json();
}

export async function getCurrentUser() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to load user");
  }

  return response.json();
}

export async function getMedicalRecords() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/records`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to load medical records");
  }

  return response.json();
}

export async function getAppointments() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/appointments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to load appointments");
  }

  return response.json();
}

export async function createMedicalRecord(formData: FormData) {
  const token = localStorage.getItem("token");

  const response = await fetch("http://127.0.0.1:8000/records/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to create medical record");
  }

  return response.json();
}

export async function createAppointment(data: {
  doctor_name: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to create appointment");
  }

  return response.json();
}

export async function updatePatientProfile(
  formData: {
    date_of_birth: string;
    blood_group: string;
    allergies: string;
    chronic_conditions: string;
    emergency_contact: string;
  },
  token: string
) {
  const response = await fetch("http://127.0.0.1:8000/patients/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to update patient profile");
  }

  return response.json();
}

export async function updateMedicalRecord(
  recordId: number,
  formData: {
    title: string;
    category: string;
    description: string;
    record_date: string;
  }
) {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://127.0.0.1:8000/records/${recordId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to update medical record");
  }

  return response.json();
}

export async function updateAppointment(
  appointmentId: number,
  formData: {
    doctor_name: string;
    appointment_date: string;
    appointment_time: string;
    reason: string;
    status: string;
  }
) {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://127.0.0.1:8000/appointments/${appointmentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to update appointment");
  }

  return response.json();
}

export async function deleteMedicalRecord(recordId: number) {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://127.0.0.1:8000/records/${recordId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to delete record");
  }

  return response.json();
}

