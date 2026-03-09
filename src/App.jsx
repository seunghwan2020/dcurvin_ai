import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import OfficeMap from './pages/OfficeMap'
import ManagementTeam from './pages/ManagementTeam'
import LogisticsTeam from './pages/LogisticsTeam'
import CSTeam from './pages/CSTeam'
import DataTeam from './pages/DataTeam'
import SecretaryTeam from './pages/SecretaryTeam'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<OfficeMap />} />
        <Route path="management" element={<ManagementTeam />} />
        <Route path="logistics" element={<LogisticsTeam />} />
        <Route path="cs" element={<CSTeam />} />
        <Route path="data" element={<DataTeam />} />
        <Route path="secretary" element={<SecretaryTeam />} />
      </Route>
    </Routes>
  )
}
