import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="dashboard-root">
      <h1>ASSSU</h1>
      <Outlet />
    </div>
  );
}
