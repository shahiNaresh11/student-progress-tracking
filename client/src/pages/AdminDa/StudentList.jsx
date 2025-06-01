import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminLayout from "../../Layouts/AdminLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAllStudentsByClassId, markAttendance } from "../../Redux/Slices/TeacherSlice";
import toast from "react-hot-toast";

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

    const handleAddClick = (student) => {
        navigate(`/action/${student.id}`, { state: { student } });
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
            toast.error("Please select at least one student.");
            return;
        }

        setShowAttendanceDropdown(false); // Close dropdown

        toast((t) => (
            <div className="text-center text-lg">
                <p className="mb-4 font-semibold">Are you sure?</p>
                <div className="flex justify-center gap-4">
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
                        className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-5 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                    >
                        No
                    </button>
                </div>
            </div>
        ), {
            duration: 8000,
        });
    };

    return (
        <AdminLayout>
            <div className="bg-gray-50 min-h-screen pb-12">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                {classInfo.className || "Unnamed Class"}
                            </h1>
                            <p className="text-sm text-gray-700 mt-1 font-bold">
                                Manage and view student performance for this class
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            onClick={() => navigate('/actions', { state: { classInfo } })}
                            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Actions
                        </button>

                        {/* Attendance Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowAttendanceDropdown(!showAttendanceDropdown)}
                                className="px-4 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors flex items-center space-x-2"
                            >
                                <span>Attendance</span>
                                <svg
                                    className={`w-4 h-4 transition-transform ${showAttendanceDropdown ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {showAttendanceDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                                    <button
                                        onClick={() => handleMarkAttendance("present")}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 flex items-center space-x-2"
                                    >
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span>Mark Present</span>
                                    </button>
                                    <button
                                        onClick={() => handleMarkAttendance("late")}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 flex items-center space-x-2"
                                    >
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <span>Mark Late</span>
                                    </button>
                                    <button
                                        onClick={() => handleMarkAttendance("absent")}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 flex items-center space-x-2"
                                    >
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <span>Mark Absent</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Selected Students Info */}
                    {selectedStudents.length > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-700">
                                <span className="font-semibold">{selectedStudents.length}</span> student{selectedStudents.length !== 1 ? 's' : ''} selected
                            </p>
                        </div>
                    )}
                </div>

                <div className="max-w-6xl mx-auto px-6 mt-8">
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-50 text-left border-b">
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
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
                                            />
                                        </th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Name</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Email</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Phone</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Points</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500">Loading students...</td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-red-500">{error}</td>
                                        </tr>
                                    ) : students.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500">No students found</td>
                                        </tr>
                                    ) : (
                                        students.map((student, index) => {
                                            const studentId = student.id || student._id;
                                            const points = typeof student.points?.total_points === 'number' ? student.points.total_points : 0;

                                            return (
                                                <tr key={studentId} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedStudents.includes(studentId)}
                                                            onChange={() => handleSelect(studentId)}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 flex-shrink-0 mr-3">
                                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold">
                                                                    {student.name?.charAt(0) || "S"}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-gray-900">{student.name}</div>
                                                                <div className="text-sm text-gray-500">ID: {studentId.toString().padStart(4, '0')}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">{student.email}</td>
                                                    <td className="px-6 py-4 text-gray-600">{student.phone}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-center">
                                                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${points >= 90 ? 'bg-green-100 text-green-800 border border-green-200' :
                                                                points >= 75 ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                                                    'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                                }`}>
                                                                {points} points
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <div className="bg-gray-100 rounded-lg flex shadow-sm">
                                                                <button
                                                                    onClick={() => handleAddClick(student)}
                                                                    className="px-3 py-1 text-green-600 hover:bg-green-50 rounded-l-lg border border-gray-300 text-sm font-medium"
                                                                >
                                                                    +
                                                                </button>

                                                                <button
                                                                    onClick={() => handleAddClick(student)}
                                                                    className="px-3 py-1 text-red-600 hover:bg-red-50 border-t border-b border-r border-gray-300 text-sm font-medium">
                                                                    -
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
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