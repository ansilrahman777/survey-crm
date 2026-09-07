import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import EnquiriesPage from "./pages/EnquiriesPage";
import EnquiryFormPage from "./pages/EnquiryFormPage";
import EnquiryViewPage from "./pages/EnquiryViewPage";
import InternalRequestsPage from "./pages/InternalRequestsPage";
import SiteVisitRequestPage from "./pages/SiteVisitRequestPage";
import ActivityMasterPage from "./pages/ActivityMasterPage";
import ComingSoonPage from "./pages/ComingSoonPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />

          <Route path="enquiries" element={<EnquiriesPage />} />
          <Route
            path="enquiries/new"
            element={<EnquiryFormPage mode="create" />}
          />
          <Route path="enquiries/:id" element={<EnquiryViewPage />} />
          <Route
            path="enquiries/:id/edit"
            element={<EnquiryFormPage mode="edit" />}
          />

          <Route path="requests" element={<InternalRequestsPage />} />
          <Route path="requests/:id" element={<SiteVisitRequestPage />} />

          <Route path="activities" element={<ActivityMasterPage />} />

          <Route path="coming-soon/:label" element={<ComingSoonPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
