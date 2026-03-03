import { useEffect, useState } from "react";
import { api } from "../api/client";

export function AdminPanel() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Placeholder analytics pull; wire role token and filters in production.
    api.get("/appointments/me").then((res) => setAppointments(res.data)).catch(() => setAppointments([]));
  }, []);

  return (
    <section>
      <h2>Admin Panel</h2>
      <p>Add doctors, view appointments, and analytics.</p>
      <h3>Appointments</h3>
      <pre>{JSON.stringify(appointments, null, 2)}</pre>
    </section>
  );
}
