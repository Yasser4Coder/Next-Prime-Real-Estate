import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import ScrollToTop from './components/ScrollToTop'
import ContactSideWidget from './components/ContactSideWidget'
import Footer from './components/Footer'
import Home from './pages/home/Home'
import Properties from './pages/properties/Properties'
import PropertyDetails from './pages/properties/PropertyDetails'

function App() {
  const location = useLocation()
  return (
    <>
      <ScrollToTop />
      <ContactSideWidget />
      <div className="flex min-h-screen flex-col">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </div>
    </>
  )
}

export default App
