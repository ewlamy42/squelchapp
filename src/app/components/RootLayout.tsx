import { Outlet } from "react-router";
import { AppProvider } from "./AppContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export function RootLayout() {
  return (
    <DndProvider backend={HTML5Backend}>
      <AppProvider>
        <Outlet />
      </AppProvider>
    </DndProvider>
  );
}
