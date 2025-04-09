
import './App.css'
import { Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import HomeLayouts from './Layouts/HomeLayouts'
import Dashboard from './pages/Dashboard'


function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/lay" element={<HomeLayouts />}></Route>
        <Route path="/home" element={<Dashboard />}></Route>



      </Routes>

    </>
  )
}

export default App
