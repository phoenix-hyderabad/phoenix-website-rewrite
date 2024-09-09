import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/views/Home/Home";
import NotFoundPage from "./views/NotFound";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
