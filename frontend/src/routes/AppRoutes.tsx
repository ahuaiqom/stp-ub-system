import { Routes, Route } from "react-router-dom";
import HomePage from "../public-site/pages/HomePage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
};

export default AppRoutes;