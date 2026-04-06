import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { Dashboard } from "./components/Dashboard";
import { ProjectDetail } from "./components/ProjectDetail";
import { WorkspaceView } from "./components/WorkspaceView";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "project/:projectId",
        Component: ProjectDetail,
      },
      {
        path: "workspace",
        Component: WorkspaceView,
      },
    ],
  },
]);