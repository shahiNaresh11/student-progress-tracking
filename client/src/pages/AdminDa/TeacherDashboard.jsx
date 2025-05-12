import { Award, Clock, Plus, User } from "lucide-react";
import AdminLayout from "../../Layouts/AdminLayout";
import { useNavigate } from "react-router-dom";

function TeacherDashboard() {
    const navigate = useNavigate();

    const classes = [
        { id: 1, name: "Class 10-A", totalStudents: 30, averagePoints: 87, attendance: "95%" },
        { id: 2, name: "Class 11-B", totalStudents: 25, averagePoints: 92, attendance: "98%" },
        { id: 3, name: "Class 12-C", totalStudents: 28, averagePoints: 85, attendance: "92%" },
    ];


    const handleClassClick = (classInfo) => {
        navigate(`/admin/classes/${classInfo.id}/students`, { state: { classInfo } });
    };
    return (

        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Class Overview</h2>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <Plus className="w-5 h-5" />
                        Add New Class
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((classInfo) => (
                        <div
                            key={classInfo.id}
                            onClick={() => handleClassClick(classInfo)}
                            className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">{classInfo.name}</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-600" />
                                    <p className="text-gray-600">Students: {classInfo.totalStudents}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Award className="w-5 h-5 text-green-600" />
                                    <p className="text-gray-600">Average Points: {classInfo.averagePoints}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-yellow-600" />
                                    <p className="text-gray-600">Attendance: {classInfo.attendance}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );



}
export default TeacherDashboard;