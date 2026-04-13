import { Outlet } from "react-router";
import { AppProvider } from "./AppContext";

export function RootLayout() {
  return (
    <AppProvider>
      <Outlet />
    </AppProvider>
  );
}
