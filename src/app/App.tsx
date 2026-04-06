import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AppProvider } from "./components/AppContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;