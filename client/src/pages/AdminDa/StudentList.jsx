import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminLayout from "../../Layouts/AdminLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAllStudentsByClassId, markAttendance } from "../../Redux/Slices/TeacherSlice";


function StudentList() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const classInfo = location.state?.classInfo || {};
    console.log("student of stdentlist", classInfo);
    const { students = [], loading, error } = useSelector((state) => state.teacher);

    const id = classInfo.id;
    const [selectedStudents, setSelectedStudents] = useState([]);

    useEffect(() => {
        if (id) {
            dispatch(getAllStudentsByClassId(id));
        }
    }, [id]);

    const handleAddClick = (student) => {
        navigate(`/add-points/${student.id}`, { state: { student } });
    };

    const handleSelect = (studentId) => {
        if (selectedStudents.includes(studentId)) {
            setSelectedStudents(prev => prev.filter(id => id !== studentId));
        } else {
            setSelectedStudents(prev => [...prev, studentId]);
        }
    };

    const handleMarkAttendance = async (status) => {
        if (selectedStudents.length === 0) {
            alert("Please select at least one student.");
            return;
        }

        const attendanceData = selectedStudents.map(studentId => ({
            studentId,
            classId: id,
            status,
            date: new Date().toISOString().split("T")[0], // optional
        }));

        // Dispatch your slice when ready
        await dispatch(markAttendance(attendanceData));
        console.log("Marking attendance:", attendanceData);
        alert(`Marked ${status} for ${selectedStudents.length} student(s).`);

        setSelectedStudents([]);
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

                    <div className="mt-6 flex justify-end space-x-2">
                        <button
                            onClick={() => handleMarkAttendance("present")}
                            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                        >
                            Mark Present
                        </button>
                        <button
                            onClick={() => handleMarkAttendance("late")}
                            className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                        >
                            Mark Late
                        </button>
                        <button
                            onClick={() => handleMarkAttendance("absent")}
                            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                        >
                            Mark Absent
                        </button>

                    </div>

                </div>

                <div className="max-w-6xl mx-auto px-6 mt-8">
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-50 text-left border-b">
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Select</th>
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
                                                                <button className="px-3 py-1 text-red-600 hover:bg-red-50 border-t border-b border-r border-gray-300 text-sm font-medium">
                                                                    -
                                                                </button>
                                                            </div>
                                                            <button className="px-3 py-1 bg-blue-600 text-white rounded border text-sm">
                                                                View
                                                            </button>
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
