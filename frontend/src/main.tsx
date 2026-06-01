import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";

// styles.css NÃO deve ser importado aqui.
// Ele já é carregado via __root.tsx com import appCss from "../styles.css?url"
// Importar dos dois lugares causa conflito e pode quebrar o Tailwind.

const router = getRouter();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
