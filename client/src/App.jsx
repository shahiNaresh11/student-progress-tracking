
import './App.css'
import { Routes, Route } from 'react-router-dom'

import Login from './pages/Student/Login'
import HomeLayouts from './Layouts/HomeLayouts'
import Dashboard from './pages/Student/Dashboard'
import AssignmentPage from './pages/AssignmentPage'
import RecordsPage from './pages/RecordsPage'
import Class from './pages/AdminDa/Class'
import StudentList from './pages/AdminDa/StudentList'
import Action from './Components/Action'
import ActionPage from './pages/AdminDa/ActionPage'




function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/lay" element={<HomeLayouts />}></Route>
        <Route path="/home" element={<Dashboard />}></Route>
        <Route path="/assignment" element={<AssignmentPage />}></Route>
        <Route path="/records" element={<RecordsPage />}></Route>
        <Route path="/assignment" element={<AssignmentPage />}></Route>
        {/* <Route path="/profile" element={<Profile />}></Route> */}
        <Route path="/admin/classes/:id/students" element={<StudentList />} />
        <Route path="/add-points/:studentId" element={<ActionPage />} />

        <Route path="/profile" element={<Class />}></Route>




      </Routes>

    </>
  )
}

export default App
