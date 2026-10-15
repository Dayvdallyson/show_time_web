import "./index.css";

import { BrowserRouter, Route, Routes } from "react-router";

import { CheckoutPage } from "@/pages/checkout";
import { HomePage } from "@/pages/home";
import { LoginPage } from "@/pages/login";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
