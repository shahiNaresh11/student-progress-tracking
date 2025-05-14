import './App.css'
import { Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import HomeLayouts from './Layouts/HomeLayouts'
import Dashboard from './pages/Student/Dashboard'
import AssignmentPage from './pages/AssignmentPage'
import RecordsPage from './pages/RecordsPage'
import StudentList from './pages/AdminDa/StudentList'
import ActionPage from './pages/AdminDa/ActionPage'
import NotFound from './pages/NotFound'
import SuperDashboard from './pages/superAdmin/SuperDashboard'
import AddStudent from './pages/superAdmin/AddStudent'
import AddTeacher from './pages/superAdmin/AddTeacher'
import TeacherDashboard from './pages/AdminDa/TeacherDashboard'

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Login />} />

      {/* Protected Routes with Layout */}
      <Route element={<HomeLayouts />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assignment" element={<AssignmentPage />} />
        <Route path="/records" element={<RecordsPage />} />

      </Route>


      <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      <Route path="/admin/classes/:id/students" element={<StudentList />} />
      <Route path="/add-points/:studentId" element={<ActionPage />} />



      <Route path="/superAdmin" element={<SuperDashboard />} />
      <Route path="/addstudent" element={<AddStudent />} />
      <Route path="/addteacher" element={<AddTeacher />} />




      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
