import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/views/Home";
import NotFoundPage from "@/views/NotFound";
import Resources from "@/views/Resources";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/nav/Footer";
import Projects from "@/views/Projects";
import Inductions from "@/views/Inductions";
import { Toaster } from "@/components/ui/sonner";
import AboutUs from "@/views/AboutUs";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/inductions" element={<Inductions />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
