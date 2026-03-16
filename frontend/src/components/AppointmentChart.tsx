"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Appointment = {
  id: number;
  doctor_name: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  status: string;
};

type Props = {
  appointments: Appointment[];
};

export default function AppointmentChart({ appointments }: Props) {
  const monthlyCounts: Record<string, number> = {};

  appointments.forEach((appointment) => {
    const date = new Date(appointment.appointment_date);
    const label = date.toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    });

    monthlyCounts[label] = (monthlyCounts[label] || 0) + 1;
  });

  const labels = Object.keys(monthlyCounts);
  const values = Object.values(monthlyCounts);

  const data = {
    labels,
    datasets: [
      {
        label: "Appointments",
        data: values,
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#ffffff",
        },
      },
      title: {
        display: true,
        text: "Appointments Per Month",
        color: "#ffffff",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#cbd5e1",
        },
        grid: {
          color: "rgba(255,255,255,0.08)",
        },
      },
      y: {
        ticks: {
          color: "#cbd5e1",
          stepSize: 1,
        },
        grid: {
          color: "rgba(255,255,255,0.08)",
        },
      },
    },
  };

  return (
    <div className="bg-slate-900 p-6 rounded-2xl mt-6">
      <Line data={data} options={options} />
    </div>
  );
}