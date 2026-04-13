import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        lazy: async () => {
          const module = await import("./components/Dashboard");
          return { Component: module.Dashboard };
        },
      },
      {
        path: "project/:projectId",
        lazy: async () => {
          const module = await import("./components/ProjectDetail");
          return { Component: module.ProjectDetail };
        },
      },
      {
        path: "workspace",
        lazy: async () => {
          const module = await import("./components/WorkspaceView");
          return { Component: module.WorkspaceView };
        },
      },
    ],
  },
]);
