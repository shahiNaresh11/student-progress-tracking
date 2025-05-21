import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


import { Award, Clock, Plus, User } from "lucide-react";
import AdminLayout from "../../Layouts/AdminLayout";
import { useNavigate } from "react-router-dom";
import { getAllClass } from "../../Redux/Slices/TeacherSlice";

function TeacherDashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { classes, loading } = useSelector((state) => state.teacher);

    useEffect(() => {
        dispatch(getAllClass());
    }, [dispatch]);

    const handleClassClick = (classInfo) => {
        navigate(`/students/${classInfo.id}`, { state: { classInfo } });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Class Overview</h2>
                    <button
                        onClick={() => navigate("/admin/classes/create")}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Class
                    </button>
                </div>

                {loading ? (
                    <p className="text-gray-500">Loading classes...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classes.length > 0 ? (
                            classes.map((classInfo) => (
                                <div
                                    key={classInfo.id}
                                    onClick={() => handleClassClick(classInfo)}
                                    className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                                >
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                        {classInfo?.className}
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <User className="w-5 h-5 text-blue-600" />
                                            <p className="text-gray-600">
                                                Students: {classInfo?.totalStudents || 0}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Award className="w-5 h-5 text-green-600" />
                                            <p className="text-gray-600">
                                                Average Points: {classInfo?.averagePoints || "N/A"}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-yellow-600" />
                                            <p className="text-gray-600">
                                                Attendance: {classInfo?.attendance || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No classes found.</p>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

export default TeacherDashboard;
