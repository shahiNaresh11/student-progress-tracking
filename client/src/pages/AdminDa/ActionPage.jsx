import React, { useState, useEffect } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { useLocation } from 'react-router-dom';

function ActionPage() {
    const location = useLocation();
    const studentData = location.state?.student || {};

    // Initialize student state, but monthlyDeductions won't change locally now
    const [student, setStudent] = useState({ ...studentData, monthlyDeductions: [], status: 'Good Standing' });
    const [actionType, setActionType] = useState('deduct');
    const [customAction, setCustomAction] = useState('');
    const [customPoints, setCustomPoints] = useState('');

    const predefinedActions = [
        { id: 1, label: "Late for class", points: -2 },
        { id: 2, label: "Incomplete homework", points: -4 },
        { id: 3, label: "Dress code violation", points: -2 },
        { id: 4, label: "Disruptive behavior", points: -3 },
        { id: 5, label: "Unauthorized device use", points: -5 }
    ];

    const positiveActions = [
        { id: 1, label: "Helping classmates", points: 2 },
        { id: 2, label: "Active participation", points: 8 },
        { id: 3, label: "Extra credit work", points: 8 },
        { id: 4, label: "Perfect attendance (week)", points: 1 },
        { id: 5, label: "Outstanding achievement", points: 5 }
    ];

    // Stub: Click handler for predefined quick actions - no state update
    const handlePredefinedAction = (points, reason) => {
        // TODO: Integrate API call here to save action to backend
        console.log(`Action clicked: ${reason} (${points} points)`);
    };

    // Stub: Click handler for custom actions - no state update
    const handleCustomAction = (isAddition) => {
        if (!customAction || !customPoints) return;

        // TODO: Integrate API call here to save custom action to backend
        console.log(`Custom Action: ${customAction}, Points: ${customPoints}, Is Addition: ${isAddition}`);

        // Clear input fields after submission
        setCustomAction('');
        setCustomPoints('');
    };

    // Status update logic is retained but it will only update if student.total_points changes externally
    useEffect(() => {
        let newStatus = "Probation";
        if (student.total_points >= 100) newStatus = "Excellent";
        else if (student.total_points >= 80) newStatus = "Excellent";
        else if (student.total_points >= 70) newStatus = "";

        if (newStatus !== student.status) {
            setStudent(prev => ({
                ...prev,
                status: newStatus
            }));
        }
    }, [student.total_points]);

    // Filter recent activities — these won't update now since no actions add to monthlyDeductions
    const last24HoursActivities = student.monthlyDeductions.filter(entry => {
        const now = new Date();
        const diff = (now - new Date(entry.timestamp)) / (1000 * 60 * 60);
        return diff <= 24;
    });

    return (
        <AdminLayout>
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex flex-col  mb-6">
                            <img
                                src={student.profilePic}
                                alt={`${student.name}'s profile`}
                                className="w-32 h-32 rounded-full object-cover border mb-3"
                            />
                            <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <p className="text-gray-600">Student Id: {student.id}</p>
                                <p className="text-gray-600">Email: {student.email}</p>
                                <p className="text-gray-600">Phone: {student.phone}</p>
                            </div>
                            <div className="space-y-3">
                                <p className="text-gray-600">
                                    Current Points: <span className="font-bold text-xl">{student.total_points}</span>
                                </p>
                                <p className="text-gray-600">
                                    Status:
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

                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h3 className="text-lg font-semibold mb-4">Recent Activity (Last 24 Hours)</h3>
                        {last24HoursActivities.length > 0 ? (
                            <div className="space-y-4">
                                {last24HoursActivities.map((deduction, index) => (
                                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                                        <div>
                                            <p className="font-medium">{deduction.reason}</p>
                                            <p className="text-sm text-gray-500">{deduction.date}</p>
                                        </div>
                                        <span className={`font-medium ${deduction.points > 0 ? 'text-green-600' : 'text-red-600'}`}>{deduction.points}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No recent activity in the last 24 hours.</p>
                        )}
                    </div>

                    {/* Monthly Activities */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h3 className="text-lg font-semibold mb-4">Monthly Activities</h3>
                        <div className="space-y-4">
                            {student.monthlyDeductions.length > 0 ? (
                                student.monthlyDeductions.map((deduction, index) => (
                                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                                        <div>
                                            <p className="font-medium">{deduction.reason}</p>
                                            <p className="text-sm text-gray-500">{deduction.date}</p>
                                        </div>
                                        <span className={`font-medium ${deduction.points > 0 ? 'text-green-600' : 'text-red-600'}`}>{deduction.points}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No monthly activities recorded.</p>
                            )}
                        </div>
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
                                    className={`w-full flex items-center justify-between p-3 border rounded-lg transition-colors ${actionType === 'deduct' ? 'hover:bg-red-50 hover:border-red-200' : 'hover:bg-green-50 hover:border-green-200'}`}
                                >
                                    <span>{action.label}</span>
                                    <span className={actionType === 'deduct' ? 'text-red-600' : 'text-green-600'}>
                                        {action.points > 0 ? `+${action.points}` : `${action.points}`}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h3 className="text-lg font-semibold mb-4">Custom Action</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                                <input
                                    type="text"
                                    value={customAction}
                                    onChange={(e) => setCustomAction(e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                    placeholder="Enter reason..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                                <input
                                    type="number"
                                    value={customPoints}
                                    onChange={(e) => setCustomPoints(e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                    placeholder="Enter points..."
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleCustomAction(false)}
                                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                                >
                                    Deduct Points
                                </button>
                                <button
                                    onClick={() => handleCustomAction(true)}
                                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                                >
                                    Add Points
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </AdminLayout >
    );
}

export default ActionPage;
