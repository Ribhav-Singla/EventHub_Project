import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import Authentication from "./pages/Authentication/Authentication";
import Homepage from "./pages/Homepage/Homepage";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Event from "./pages/Event/Event";
import Events from "./pages/Events/Events";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard/Dashboard";
import Hub from "./Hub";
import { AuthProvider } from "./lib/AuthProvider";
import Overview from "./pages/Dashboard/Overview/Overview";
import ManageEvents from "./pages/Dashboard/Events/ManageEvents";
import Analytics from "./pages/Dashboard/Analytics/Analytics";
import Purchases from "./pages/Dashboard/Purchases/Purchases";
import Profile from "./pages/Dashboard/Profile/Profile";
import Wishlist from "./pages/Dashboard/Wishlist/Wishlist";
import Publish from "./pages/Dashboard/Publish/Publish";
import TDetails from "./components/TDetails/TDetails";
import TPayment from "./components/TPayment/TPayment";
import TConfirm from "./components/TConfirm/TConfirm";
import UpdateEvent from "./pages/Dashboard/UpdateEvent/UpdateEvent";
import EventAnalytics from "./pages/Dashboard/EventAnalytics/EventAnalytics";
import GoogleAuthProvider from "./lib/GoogleAuthProvider";
import AuthProtect from "./lib/AuthProtect";
import Blog from "./pages/Homepage/Sections/Blog";
import NotFound from "./components/NotFound.tsx/NotFound";
import { FlowGuard } from "./lib/FlowGuard";
import ETicket from "./components/ETicket/ETicket";
import EventRegistrations from "./pages/Dashboard/Events/Sections/EventRegistrations";
import Chat from "./pages/Dashboard/Chat/Chat";
import { SocketProvider } from "./lib/SocketProvider";

function Layout() {
  const location = useLocation();
  const showNavbarAndFooter = !location.pathname.startsWith("/dashboard");

  return (
    <>
      {showNavbarAndFooter && <Navbar />}
      <Toaster />
      <Routes>
        <Route path="/" element={<Hub />}>
          <Route path="" element={<Homepage />} />
          <Route path="/blog/:blogId" element={<Blog />} />
          <Route
            path="auth"
            element={
              <GoogleAuthProvider>
                <Authentication />
              </GoogleAuthProvider>
            }
          />
          <Route path="event/:eventId" element={<Event />} />
          <Route path="event/all" element={<Events />} />
          <Route
            path="event/:eventId/tdetails"
            element={
              <AuthProtect>
                <FlowGuard expectedFlow="event-flow">
                  <TDetails />
                </FlowGuard>
              </AuthProtect>
            }
          />
          <Route
            path="event/:eventId/tpayment"
            element={
              <AuthProtect>
                <FlowGuard expectedFlow="tdetails-flow">
                  <TPayment />
                </FlowGuard>
              </AuthProtect>
            }
          />
          <Route
            path="event/:transactionId/tconfirm"
            element={
              <AuthProtect>
                <FlowGuard expectedFlow="tpayment-flow">
                  <TConfirm />
                </FlowGuard>
              </AuthProtect>
            }
          />
          <Route
            path="event/:transactionId/eticket"
            element={
              <AuthProtect>
                <ETicket />
              </AuthProtect>
            }
          />
        </Route>

        <Route
          path="/dashboard"
          element={
            <AuthProtect>
              <Dashboard />
            </AuthProtect>
          }
        >
          <Route index element={<Overview />} />
          <Route path="overview" element={<Overview />} />
          <Route path="events" element={<ManageEvents />} />
          <Route
            path="event/registrations/:eventId"
            element={<EventRegistrations />}
          />
          <Route path="analytics" element={<Analytics />} />
          <Route path="analytics/event/:eventId" element={<EventAnalytics />} />
          <Route path="purchases" element={<Purchases />} />
          <Route path="profile" element={<Profile />} />
          <Route path="publish" element={<Publish />} />
          <Route path="update/:eventId" element={<UpdateEvent />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route
            path="chat"
            element={
              <SocketProvider>
                <Chat />
              </SocketProvider>
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showNavbarAndFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <AuthProvider>
          <Layout />
        </AuthProvider>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
