import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminLayout from "../../Layouts/AdminLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAllStudentsByClassId, markAttendance } from "../../Redux/Slices/TeacherSlice";
import toast from "react-hot-toast";
import {
    Users,
    Zap,
    ClipboardCheck,
    ChevronDown,
    CheckCircle,
    AlertTriangle,
    Clock,
    XCircle,
    RefreshCw,
    AlertCircle,
    UserX,
    Plus,
    Minus,
    X
} from "lucide-react";

function StudentList() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const classInfo = location.state?.classInfo || {};
    console.log("student of stdentlist", classInfo);
    const { students = [], loading, error } = useSelector((state) => state.teacher);

    const id = classInfo.id;
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [showAttendanceDropdown, setShowAttendanceDropdown] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(getAllStudentsByClassId(id));
        }
    }, [id]);

    const handleAddClick = (student, action) => {
        navigate(`/action/${student.id}`, {
            state: {
                student,
                action: action, // 'add' or 'deduct'
                classInfo
            }
        });
    };

    const handleSelect = (studentId) => {
        if (selectedStudents.includes(studentId)) {
            setSelectedStudents(prev => prev.filter(id => id !== studentId));
        } else {
            setSelectedStudents(prev => [...prev, studentId]);
        }
    };

    const handleMarkAttendance = (status) => {
        if (selectedStudents.length === 0) {
            toast.error("Please select at least one student to mark attendance.");
            return;
        }

        setShowAttendanceDropdown(false);

        toast((t) => (
            <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 text-lg">Confirm Attendance</p>
                        <p className="text-sm text-gray-600">
                            Mark {selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''} as {status}?
                        </p>
                    </div>
                </div>
                <div className="flex justify-center gap-3 mt-4">
                    <button
                        onClick={async () => {
                            const attendanceData = selectedStudents.map(studentId => ({
                                studentId,
                                classId: id,
                                status,
                                date: new Date().toISOString().split("T")[0],
                            }));

                            await dispatch(markAttendance(attendanceData));
                            toast.dismiss(t.id);
                            setSelectedStudents([]);
                        }}
                        className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-sm"
                    >
                        Yes, Confirm
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: 10000,
            style: {
                minWidth: '350px',
            }
        });
    };

    const getAttendanceIcon = (status) => {
        switch (status) {
            case 'present':
                return <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>;
            case 'late':
                return <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>;
            case 'absent':
                return <div className="w-2.5 h-2.5 bg-rose-500 rounded-full"></div>;
            default:
                return null;
        }
    };

    return (
        <AdminLayout>
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {classInfo.className || "Unnamed Class"}
                                    </h1>
                                    <p className="text-gray-600 mt-1 flex items-center">
                                        <Users className="w-4 h-4 mr-1.5" />
                                        Manage student performance and attendance
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => navigate('/actions', { state: { classInfo } })}
                                    className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-sm flex items-center space-x-2"
                                >
                                    <Zap className="w-4 h-4" />
                                    <span>Quick Actions</span>
                                </button>

                                {/* Enhanced Attendance Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowAttendanceDropdown(!showAttendanceDropdown)}
                                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-sm flex items-center space-x-2"
                                    >
                                        <ClipboardCheck className="w-4 h-4" />
                                        <span>Attendance</span>
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showAttendanceDropdown ? 'rotate-180' : ''}`} />
                                    </button>

                                    {showAttendanceDropdown && (
                                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 backdrop-blur-sm">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mark Attendance</p>
                                            </div>
                                            <button
                                                onClick={() => handleMarkAttendance("present")}
                                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 transition-colors flex items-center space-x-3 group"
                                            >
                                                {getAttendanceIcon('present')}
                                                <span className="group-hover:text-emerald-700 font-medium">Mark Present</span>
                                            </button>
                                            <button
                                                onClick={() => handleMarkAttendance("late")}
                                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 transition-colors flex items-center space-x-3 group"
                                            >
                                                {getAttendanceIcon('late')}
                                                <span className="group-hover:text-amber-700 font-medium">Mark Late</span>
                                            </button>
                                            <button
                                                onClick={() => handleMarkAttendance("absent")}
                                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-rose-50 transition-colors flex items-center space-x-3 group"
                                            >
                                                {getAttendanceIcon('absent')}
                                                <span className="group-hover:text-rose-700 font-medium">Mark Absent</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Selected Students Info */}
                        {selectedStudents.length > 0 && (
                            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-blue-900">
                                                {selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''} selected
                                            </p>
                                            <p className="text-xs text-blue-700">Ready for attendance marking or bulk actions</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedStudents([])}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        Clear selection
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Enhanced Students Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <h2 className="text-lg font-semibold text-gray-900">Student Roster</h2>
                                    <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                        {students.length} students
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-left">
                                            <input
                                                type="checkbox"
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedStudents(students.map(s => s.id || s._id));
                                                    } else {
                                                        setSelectedStudents([]);
                                                    }
                                                }}
                                                checked={selectedStudents.length === students.length && students.length > 0}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                            />
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">Point Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center space-y-3">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                    <p className="text-gray-500">Loading students...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center space-y-3">
                                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-red-600 font-medium">{error}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : students.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center space-y-4">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-gray-900 font-medium">No students found</p>
                                                        <p className="text-gray-500 text-sm mt-1">Students will appear here once they're enrolled in this class</p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        students.map((student, index) => {
                                            const studentId = student.id || student._id;
                                            const points = typeof student.points?.total_points === 'number' ? student.points.total_points : 0;

                                            return (
                                                <tr key={studentId} className="hover:bg-blue-50/50 transition-colors duration-150">
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedStudents.includes(studentId)}
                                                            onChange={() => handleSelect(studentId)}
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="relative">
                                                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-sm">
                                                                    <span className="text-white font-semibold text-lg">
                                                                        {student.name?.charAt(0)?.toUpperCase() || "S"}
                                                                    </span>
                                                                </div>
                                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-gray-900 text-base">{student.name}</div>
                                                                <div className="text-sm text-gray-500">ID: {studentId}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-gray-900 font-medium">{student.email}</div>
                                                        <div className="text-sm text-gray-500">Email Address</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-gray-900 font-medium">{student.phone}</div>
                                                        <div className="text-sm text-gray-500">Contact Number</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center space-x-2">
                                                            {/* Enhanced Action Buttons */}
                                                            <div className="flex items-center bg-gray-50 rounded-xl p-1 shadow-sm border border-gray-200">
                                                                <button
                                                                    onClick={() => handleAddClick(student, 'add')}
                                                                    className="group flex items-center justify-center w-10 h-10 text-emerald-600 hover:text-white hover:bg-emerald-500 rounded-lg transition-all duration-200 font-bold text-lg relative overflow-hidden"
                                                                    title="Add Points"
                                                                >
                                                                    <span className="relative z-10">+</span>
                                                                    <div className="absolute inset-0 bg-emerald-500 transform scale-0 group-hover:scale-100 transition-transform duration-200 rounded-lg"></div>
                                                                </button>

                                                                <div className="w-px h-6 bg-gray-300"></div>

                                                                <button
                                                                    onClick={() => handleAddClick(student, 'deduct')}
                                                                    className="group flex items-center justify-center w-10 h-10 text-rose-600 hover:text-white hover:bg-rose-500 rounded-lg transition-all duration-200 font-bold text-lg relative overflow-hidden"
                                                                    title="Deduct Points"
                                                                >
                                                                    <span className="relative z-10">−</span>
                                                                    <div className="absolute inset-0 bg-rose-500 transform scale-0 group-hover:scale-100 transition-transform duration-200 rounded-lg"></div>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="text-center mt-2">
                                                            <span className="text-xs text-gray-500">Points Management</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default StudentList;