
import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import DisplayRegister from "./pages/DisplayRegister";
import PlannerPage from "./pages/PlannerPage";
import Admin from "./pages/Admin";
import OrganisationSelect from "./pages/OrganisationSelect";
import Dashboard from "./pages/Dashboard";
import Documentation from "./pages/Documentation";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/documentation" element={<Documentation />} />
      <Route path="/login" element={<Admin />}>
        <Route index element={<OrganisationSelect />} />
        <Route path="select" element={<OrganisationSelect />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
      <Route path="/admin" element={<Admin />}>
        <Route index element={<OrganisationSelect />} />
        <Route path="select" element={<OrganisationSelect />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
      <Route path="/register-display" element={<DisplayRegister />} />
      <Route path="/planner" element={<PlannerPage />} />
    </Routes>
  );
}

export default App;
