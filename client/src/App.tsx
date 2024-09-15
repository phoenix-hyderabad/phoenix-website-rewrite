import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/views/Home/Home";

import NotFoundPage from "@/views/NotFound";
import Resources from "@/views/Resources";
import Navbar from "./components/nav/Navbar";
import Footer from "./components/footer/Footer";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
