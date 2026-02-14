import React, { Suspense, lazy } from 'react'
import './App.css'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import ScrollToTop from './components/ScrollToTop'
import ContactSideWidget from './components/ContactSideWidget'
import Footer from './components/Footer'
import { DashboardStoreProvider } from './context/DashboardStore'

const Home = lazy(() => import('./pages/home/Home'))
const About = lazy(() => import('./pages/about/About'))
const Services = lazy(() => import('./pages/services/Services'))
const Properties = lazy(() => import('./pages/properties/Properties'))
const PropertyDetails = lazy(() => import('./pages/properties/PropertyDetails'))
import Login from './pages/dashboard/Login'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import ProtectedRoute from './pages/dashboard/ProtectedRoute'
import PropertiesManage from './pages/dashboard/PropertiesManage'
import TestimonialsManage from './pages/dashboard/TestimonialsManage'
import LocationsManage from './pages/dashboard/LocationsManage'
import FeaturedManage from './pages/dashboard/FeaturedManage'
import DevelopersManage from './pages/dashboard/DevelopersManage'
import ContactManage from './pages/dashboard/ContactManage'
import SocialManage from './pages/dashboard/SocialManage'
import DownloadLeadsManage from './pages/dashboard/DownloadLeadsManage'

function App() {
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard')

  if (isDashboard) {
    return (
      <DashboardStoreProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { background: '#262626', color: '#fff', borderRadius: '12px' },
            success: { iconTheme: { primary: '#B8862E' } },
            error: { style: { background: '#991b1b', color: '#fff' } },
          }}
        />
        <Routes>
          <Route path="/dashboard/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard/properties" replace />} />
            <Route path="properties" element={<PropertiesManage />} />
            <Route path="testimonials" element={<TestimonialsManage />} />
            <Route path="locations" element={<LocationsManage />} />
            <Route path="featured" element={<FeaturedManage />} />
            <Route path="developers" element={<DevelopersManage />} />
            <Route path="contact" element={<ContactManage />} />
            <Route path="social" element={<SocialManage />} />
            <Route path="download-leads" element={<DownloadLeadsManage />} />
          </Route>
        </Routes>
      </DashboardStoreProvider>
    )
  }

  return (
    <DashboardStoreProvider>
      <ScrollToTop />
      <ContactSideWidget />
      <div className="flex min-h-screen flex-col">
        <AnimatePresence mode="wait">
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><span className="text-[#717171]">Loading…</span></div>}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:slug" element={<PropertyDetails />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
        <Footer />
      </div>
    </DashboardStoreProvider>
  )
}

export default App
