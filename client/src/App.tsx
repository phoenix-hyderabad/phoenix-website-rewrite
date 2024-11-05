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
import LiveWire from "@/views/LiveWire";
import Login from "@/views/Login";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/Auth";
import Robowars from "./views/RoboWars";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}
      >
        <AuthProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/robowars" element={<Robowars />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/inductions" element={<Inductions />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/livewire" element={<LiveWire />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Footer />
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
};

export default App;
