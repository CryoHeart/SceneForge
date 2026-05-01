import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { AdminUsersPage } from "./pages/AdminUsersPage";
import { BandProfilePage } from "./pages/BandProfilePage";
import { BandsPage } from "./pages/BandsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { EventDetailsPage } from "./pages/EventDetailsPage";
import { EventsPage } from "./pages/EventsPage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PosterWallPage } from "./pages/PosterWallPage";
import { RegisterPage } from "./pages/RegisterPage";
import { VenueProfilePage } from "./pages/VenueProfilePage";
import { VenuesPage } from "./pages/VenuesPage";

function AppShell() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/bands" element={<BandsPage />} />
        <Route path="/bands/:id" element={<BandProfilePage />} />
        <Route path="/venues" element={<VenuesPage />} />
        <Route path="/venues/:id" element={<VenueProfilePage />} />
        <Route path="/posters" element={<PosterWallPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/events" element={<DashboardPage />} />
        <Route path="/dashboard/manage" element={<DashboardPage />} />
        <Route path="/dashboard/upload" element={<DashboardPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
