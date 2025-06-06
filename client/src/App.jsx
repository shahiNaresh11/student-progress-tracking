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
import CreateClass from './Components/CreateClass'
import ToastProvider from './Components/ToastProvider';
import StudentActions from './pages/AdminDa/StudentActions'

function App() {
  return (
    <>
      <ToastProvider />

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
        <Route path="/students/:id" element={<StudentList />} />
        <Route path="/action/:id" element={<ActionPage />} />
        <Route path="/actions" element={<StudentActions />} />
        <Route path="/admin/classes/create" element={<CreateClass />} />




        <Route path="/superAdmin" element={<SuperDashboard />} />
        <Route path="/addstudent" element={<AddStudent />} />
        <Route path="/addteacher" element={<AddTeacher />} />




        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
