import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Destinations from './pages/Destinations'
import LocationDetail from './pages/LocationDetail'
import Gallery from './pages/Gallery'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="destinations" element={<Destinations />} />
        </Route>
        <Route path="/location/:id" element={<LocationDetail />} />
        <Route path="/gallery/:id"  element={<Gallery />} />
      </Routes>
    </BrowserRouter>
  )
}
