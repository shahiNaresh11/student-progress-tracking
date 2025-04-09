
import './App.css'
import { Routes, Route } from 'react-router-dom'

import Login from './pages/Login'


function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/home" element={<Signup />}></Route>

      </Routes>

    </>
  )
}

export default App
