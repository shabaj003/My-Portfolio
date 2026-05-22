import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import FreelancingApp from "./FreelancingApp";

createRoot(document.getElementById("freelancing-root")).render(
  <StrictMode>
    <FreelancingApp />
  </StrictMode>
);
