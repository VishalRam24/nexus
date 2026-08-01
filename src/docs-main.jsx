import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Docs from "./Docs.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Docs />
  </React.StrictMode>,
);
