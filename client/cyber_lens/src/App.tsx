import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import History from "./pages/History";
import News from "./pages/News";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SentEmail from "./pages/SentEmailConfirmation";
import VerifyEmail from "./pages/VerifyEmail";
import RequestPasswordReset from "./pages/RequestPasswordReset";
import ResetPassword from "./pages/ResetPassword";
import Analytics from "./pages/Analytics";
import NewsDetail from "./pages/NewsDetail";
import Settings from "./pages/Settings";
import VerifyAction from "./pages/VerifyAction";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* -------- App Pages (with Navbar & Footer) -------- */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/lookup" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* -------- Auth Pages (NO Navbar / Footer) -------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/check-email" element={<SentEmail />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify-action" element={<VerifyAction />} />
        <Route path="/forgot-password" element={<RequestPasswordReset />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
