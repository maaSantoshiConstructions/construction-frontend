import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Loader from './components/common/Loader';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';

// Website Pages
import Home from './pages/website/Home';
import Projects from './pages/website/Projects';
import ProjectDetails from './pages/website/ProjectDetails';
import PlotMap from './pages/website/PlotMap';
import Calculators from './pages/website/Calculators';
import Blogs from './pages/website/Blogs';
import BlogDetails from './pages/website/BlogDetails';
import Gallery from './pages/website/Gallery';
import Contact from './pages/website/Contact';
import About from './pages/website/About';
import FAQ from './pages/website/FAQ';
import BookVisit from './pages/website/BookVisit';
import AIRecommendation from './pages/website/AIRecommendation';
import AIChatbot from './pages/features/AIChatbot';
import PropertyComparison from './pages/features/PropertyComparison';
import PropertyValuation from './pages/features/PropertyValuation';
import CustomerReviews from './pages/features/CustomerReviews';
import VirtualSiteTour from './pages/features/VirtualSiteTour';
import PriceTimer from './pages/features/PriceTimer';
import InteriorVisualizer from './pages/features/InteriorVisualizer';
import PlotDirectionAnalyzer from './pages/features/PlotDirectionAnalyzer';
import NearbyLocations from './pages/features/NearbyLocations';
import WhatsAppCRM from './pages/features/WhatsAppCRM';
import AIFollowupAutomation from './pages/features/AIFollowupAutomation';
import InvestmentHeatmap from './pages/features/InvestmentHeatmap';
import NotFound from './pages/website/NotFound';

// Admin Dashboard
import AdminDashboard from './pages/dashboard/admin/AdminDashboard';
import ManageProjects from './pages/dashboard/admin/ManageProjects';
import ManagePlots from './pages/dashboard/admin/ManagePlots';
import ManageBookings from './pages/dashboard/admin/ManageBookings';
import ManageCustomers from './pages/dashboard/admin/ManageCustomers';
import ManageLeads from './pages/dashboard/admin/ManageLeads';
import ManagePayments from './pages/dashboard/admin/ManagePayments';
import ManageDocuments from './pages/dashboard/admin/ManageDocuments';
import ManageSiteVisits from './pages/dashboard/admin/ManageSiteVisits';
import ManageConstructionUpdates from './pages/dashboard/admin/ManageConstructionUpdates';
import ManageChannelPartners from './pages/dashboard/admin/ManageChannelPartners';
import ManageReviews from './pages/dashboard/admin/ManageReviews';
import ManageBlogs from './pages/dashboard/admin/ManageBlogs';
import ManageGallery from './pages/dashboard/admin/ManageGallery';
import ManageFAQs from './pages/dashboard/admin/ManageFAQs';
import ManageSettings from './pages/dashboard/admin/ManageSettings';
import ManageUsers from './pages/dashboard/admin/ManageUsers';

// Sales Dashboard
import SalesDashboard from './pages/dashboard/sales/SalesDashboard';
import MyLeads from './pages/dashboard/sales/MyLeads';
import SalesSiteVisits from './pages/dashboard/sales/SiteVisits';
import SalesCustomers from './pages/dashboard/sales/MyCustomers';

// Partner Dashboard
import PartnerDashboard from './pages/dashboard/partner/PartnerDashboard';
import MyCommissions from './pages/dashboard/partner/MyCommissions';
import MyReferralsPartner from './pages/dashboard/partner/MyReferrals';
import MarketingMaterials from './pages/dashboard/partner/MarketingMaterials';

// Customer Dashboard
import CustomerDashboard from './pages/dashboard/customer/CustomerDashboard';
import MyBookings from './pages/dashboard/customer/MyBookings';
import MyPayments from './pages/dashboard/customer/MyPayments';
import MyDocuments from './pages/dashboard/customer/MyDocuments';
import ConstructionUpdates from './pages/dashboard/customer/ConstructionUpdates';
import MyReferrals from './pages/dashboard/customer/MyReferrals';
import SupportTickets from './pages/dashboard/customer/SupportTickets';
import Profile from './pages/dashboard/customer/Profile';
import Wishlist from './pages/dashboard/customer/Wishlist';

// Layout wrapper for public pages
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="min-h-screen pt-16 lg:pt-20">{children}</main>
    <Footer />
  </>
);

export default function App() {
  const { loading } = useAuth();

  if (loading) return <Loader />;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/projects" element={<PublicLayout><Projects /></PublicLayout>} />
      <Route path="/projects/:slug" element={<PublicLayout><ProjectDetails /></PublicLayout>} />
      <Route path="/plot-map" element={<PublicLayout><PlotMap /></PublicLayout>} />
      <Route path="/calculators" element={<PublicLayout><Calculators /></PublicLayout>} />
      <Route path="/blogs" element={<PublicLayout><Blogs /></PublicLayout>} />
      <Route path="/blogs/:slug" element={<PublicLayout><BlogDetails /></PublicLayout>} />
      <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
      <Route path="/book-visit" element={<PublicLayout><BookVisit /></PublicLayout>} />
      <Route path="/ai-recommendation" element={<PublicLayout><AIRecommendation /></PublicLayout>} />
      <Route path="/ai-chatbot" element={<PublicLayout><AIChatbot /></PublicLayout>} />
      <Route path="/property-comparison" element={<PublicLayout><PropertyComparison /></PublicLayout>} />
      <Route path="/property-valuation" element={<PublicLayout><PropertyValuation /></PublicLayout>} />
      <Route path="/reviews" element={<PublicLayout><CustomerReviews /></PublicLayout>} />
      <Route path="/virtual-tour" element={<PublicLayout><VirtualSiteTour /></PublicLayout>} />
      <Route path="/price-timer" element={<PublicLayout><PriceTimer /></PublicLayout>} />
      <Route path="/interior-visualizer" element={<PublicLayout><InteriorVisualizer /></PublicLayout>} />
      <Route path="/plot-direction" element={<PublicLayout><PlotDirectionAnalyzer /></PublicLayout>} />
      <Route path="/nearby-locations" element={<PublicLayout><NearbyLocations /></PublicLayout>} />
      <Route path="/whatsapp-crm" element={<PublicLayout><WhatsAppCRM /></PublicLayout>} />
      <Route path="/ai-followup" element={<PublicLayout><AIFollowupAutomation /></PublicLayout>} />
      <Route path="/investment-heatmap" element={<PublicLayout><InvestmentHeatmap /></PublicLayout>} />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />

      {/* Super Admin / Company Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute roles={['super_admin', 'company_admin']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="projects" element={<ManageProjects />} />
        <Route path="plots" element={<ManagePlots />} />
        <Route path="bookings" element={<ManageBookings />} />
        <Route path="customers" element={<ManageCustomers />} />
        <Route path="leads" element={<ManageLeads />} />
        <Route path="payments" element={<ManagePayments />} />
        <Route path="documents" element={<ManageDocuments />} />
        <Route path="site-visits" element={<ManageSiteVisits />} />
        <Route path="construction-updates" element={<ManageConstructionUpdates />} />
        <Route path="channel-partners" element={<ManageChannelPartners />} />
        <Route path="reviews" element={<ManageReviews />} />
        <Route path="blogs" element={<ManageBlogs />} />
        <Route path="gallery" element={<ManageGallery />} />
        <Route path="faqs" element={<ManageFAQs />} />
        <Route path="settings" element={<ManageSettings />} />
        <Route path="users" element={<ManageUsers />} />
      </Route>

      {/* Sales Executive Routes */}
      <Route path="/sales" element={
        <ProtectedRoute roles={['sales_executive']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SalesDashboard />} />
        <Route path="leads" element={<MyLeads />} />
        <Route path="site-visits" element={<SalesSiteVisits />} />
        <Route path="customers" element={<SalesCustomers />} />
      </Route>

      {/* Channel Partner Routes */}
      <Route path="/partner" element={
        <ProtectedRoute roles={['channel_partner']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PartnerDashboard />} />
        <Route path="commissions" element={<MyCommissions />} />
        <Route path="referrals" element={<MyReferralsPartner />} />
        <Route path="materials" element={<MarketingMaterials />} />
      </Route>

      {/* Customer Routes */}
      <Route path="/customer" element={
        <ProtectedRoute roles={['customer']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="payments" element={<MyPayments />} />
        <Route path="documents" element={<MyDocuments />} />
        <Route path="construction-updates" element={<ConstructionUpdates />} />
        <Route path="referrals" element={<MyReferrals />} />
        <Route path="support-tickets" element={<SupportTickets />} />
        <Route path="profile" element={<Profile />} />
        <Route path="wishlist" element={<Wishlist />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
    </Routes>
  );
}
