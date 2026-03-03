import { Link, Route, Routes } from "react-router-dom";
import { AdminPanel } from "../pages/AdminPanel";
import { DoctorPanel } from "../pages/DoctorPanel";

export function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>Clinic Web Console</h1>
      <nav style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <Link to="/admin">Admin Panel</Link>
        <Link to="/doctor">Doctor Panel</Link>
      </nav>
      <Routes>
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/doctor" element={<DoctorPanel />} />
        <Route path="*" element={<AdminPanel />} />
      </Routes>
    </div>
  );
}
