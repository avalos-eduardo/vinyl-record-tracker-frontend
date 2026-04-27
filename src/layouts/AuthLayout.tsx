import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <Outlet />
    </main>
  );
}
