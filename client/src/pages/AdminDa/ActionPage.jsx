import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../../Layouts/AdminLayout';
import { useLocation } from 'react-router-dom';
import { createActivity } from '../../Redux/Slices/TeacherSlice';
import { useDispatch, useSelector } from 'react-redux';

function ActionPage() {
    const dispatch = useDispatch();
    const location = useLocation();

    const studentData = location.state?.student || {};
    console.log("this is student data", studentData);

    const activities = useSelector(state => state.teacher.activities) || [];

    console.log("this is activity data from redux", activities);

    const [student, setStudent] = useState({ ...studentData, monthlyDeductions: [], status: 'Good Standing' });
    const [actionType, setActionType] = useState('deduct');
    const [customAction, setCustomAction] = useState('');
    const [customPoints, setCustomPoints] = useState('');

    const predefinedActions = [
        { id: 1, label: "Late for class", points: -2 },
        { id: 2, label: "Incomplete homework", points: -3 },
        { id: 3, label: "Dress code violation", points: -2 },
        { id: 4, label: "Disruptive behavior", points: -2 },
        { id: 5, label: "Unauthorized device use", points: -5 },
        { id: 6, label: "Fighting", points: -5 },
        { id: 7, label: "Rude with teacher", points: -5 },
        { id: 8, label: "fail in internal exams", points: -8 }


    ];

    const positiveActions = [
        { id: 1, label: "Helping classmates", points: 2 },
        { id: 2, label: "Active participation", points: 8 },
        { id: 3, label: "Extra credit work", points: 8 },
        { id: 4, label: "Perfect attendance (week)", points: 1 },
        { id: 5, label: "Outstanding sports achievement", points: 5 },
        { id: 6, label: "Class Leader for Good Conduct", points: 7 },
        { id: 7, label: "Top perfomer in internal exam", points: 10 },



    ];

    const handlePredefinedAction = (points, activity) => {
        if (!student?.id) return;

        toast((t) => (
            <div className="text-center text-lg leading-relaxed">
                <p>
                    Are you sure you want to apply <b>{activity}</b> ({points > 0 ? '+' : ''}{points} points)?
                </p>
                <div className="mt-4 flex justify-center gap-4">
                    <button
                        onClick={() => {
                            const activityData = {
                                studentId: student.id,
                                points,
                                activity,
                            };
                            dispatch(createActivity(activityData));
                            toast.dismiss(t.id);
                            toast.success('Action saved successfully!');
                        }}
                        className="px-6 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition duration-200"
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md font-semibold hover:bg-gray-400 transition duration-200"
                    >
                        No
                    </button>
                </div>
            </div>
        ), { duration: 8000 });
    };

    const handleCustomAction = (isAddition) => {
        if (!customAction || !customPoints || !student?.id) return;

        const points = isAddition ? parseInt(customPoints) : -parseInt(customPoints);

        toast((t) => (
            <div className="text-center text-lg leading-relaxed">
                <p>
                    Are you sure you want to apply <b>{customAction}</b> ({points > 0 ? '+' : ''}{points} points)?
                </p>
                <div className="mt-4 flex justify-center gap-4">
                    <button
                        onClick={() => {
                            const activityData = {
                                studentId: student.id,
                                points,
                                activity: customAction,
                            };
                            dispatch(createActivity(activityData));
                            toast.dismiss(t.id);
                            toast.success('Custom action saved!');
                            setCustomAction('');
                            setCustomPoints('');
                        }}
                        className="px-6 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition duration-200"
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md font-semibold hover:bg-gray-400 transition duration-200"
                    >
                        No
                    </button>
                </div>
            </div>
        ), { duration: 8000 });
    };

    useEffect(() => {
        if (!student.points || typeof student.points.total_points !== "number") return;

        const pts = student.points.total_points;
        let newStatus = "Probation";

        if (pts >= 100) {
            newStatus = "Outstanding";
        } else if (pts >= 80 && pts < 100) {
            newStatus = "Excellent";
        } else if (pts >= 70 && pts < 80) {
            newStatus = "Good Standing";
        } else if (pts >= 50 && pts < 70) {
            newStatus = "Warning";
        } else if (pts < 50) {
            newStatus = "Probation";
        }

        if (newStatus !== student.status) {
            setStudent(prev => ({
                ...prev,
                status: newStatus
            }));
        }
    }, [student.points?.total_points]);

    // Filter recent activities from Redux - last 24 hours
    const recentActivities = activities
        .map(item => item.data) // extract inner data object
        .filter(activity => {
            if (!activity) return false;
            if (activity.student_id !== student.id) return false;  // <-- Filter by current student
            const now = new Date();
            const activityTime = new Date(activity.timestamp || activity.date);
            const diffHours = (now - activityTime) / (1000 * 60 * 60);
            return diffHours <= 24;
        });



    return (
        <AdminLayout>
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex flex-col mb-6">
                            <img
                                src={student.profilePic}
                                alt={`${student.name}'s profile`}
                                className="w-32 h-32 rounded-full object-cover border mb-3"
                            />
                            <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <p><span className="font-bold">Student Id:</span> {student.id}</p>
                                <p><span className="font-bold">Email:</span> {student.email}</p>
                                <p><span className="font-bold">Phone:</span> {student.phone}</p>
                            </div>
                            <div className="space-y-3">
                                <span className="font-bold">Current Points:</span> <span className="font-bold text-xl">{student?.points?.total_points}</span>

                                <p className="text-gray-600">
                                    <span className="font-bold">Status:</span>
                                    <span className={`ml-2 px-2 py-1 rounded-full text-sm ${student.status === 'Excellent' ? 'bg-green-100 text-green-800' :
                                        student.status === 'Good Standing' ? 'bg-blue-100 text-blue-800' :
                                            student.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {student.status}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity from Redux */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h3 className="text-lg font-semibold mb-4">Recent Activity (Last 24 Hours)</h3>
                        {recentActivities.length > 0 ? (
                            <div className="space-y-4">
                                {recentActivities.map((activity, index) => (
                                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                                        <div>
                                            <p className="font-medium">{activity.activity}</p>
                                            <p className="text-sm text-gray-500">{new Date(activity.timestamp || activity.date).toLocaleString()}</p>
                                        </div>
                                        <span className={`font-medium ${activity.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {activity.points > 0 ? `+${activity.points}` : activity.points}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No recent activity in the last 24 hours.</p>
                        )}


                    </div>


                </div>

                {/* Quick Actions Panel */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Quick Actions</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActionType('deduct')}
                                    className={`px-3 py-1 rounded-lg ${actionType === 'deduct' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    Deduct
                                </button>
                                <button
                                    onClick={() => setActionType('add')}
                                    className={`px-3 py-1 rounded-lg ${actionType === 'add' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {(actionType === 'deduct' ? predefinedActions : positiveActions).map((action) => (
                                <button
                                    key={action.id}
                                    onClick={() => handlePredefinedAction(action.points, action.label)}
                                    className={`w-full flex items-center justify-between p-3 border rounded-lg transition-colors ${actionType === 'deduct' ? 'hover:bg-red-50' : 'hover:bg-green-50'}`}
                                >
                                    <span>{action.label}</span>
                                    <span className={`${action.points > 0 ? 'text-green-600' : 'text-red-600'} font-bold`}>
                                        {action.points > 0 ? `+${action.points}` : action.points}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="mt-6">
                            <h4 className="mb-2 font-semibold">Custom Action</h4>
                            <input
                                type="text"
                                placeholder="Activity Description"
                                className="w-full mb-2 p-2 border rounded"
                                value={customAction}
                                onChange={(e) => setCustomAction(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Points"
                                className="w-full mb-2 p-2 border rounded"
                                value={customPoints}
                                onChange={(e) => setCustomPoints(e.target.value)}
                            />
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleCustomAction(false)}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition"
                                >
                                    Deduct Points
                                </button>
                                <button
                                    onClick={() => handleCustomAction(true)}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition"
                                >
                                    Add Points
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default ActionPage;
