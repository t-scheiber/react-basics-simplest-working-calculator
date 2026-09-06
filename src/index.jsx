import ReactDOM from "react-dom/client";
import App from "./App.jsx";

const container = document.getElementById("root");
if (!container) throw new Error("Application root is missing");
ReactDOM.createRoot(container).render(<App />);
