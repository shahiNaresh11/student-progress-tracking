import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import AdminLayout from '../../Layouts/AdminLayout';

function ActionPage() {
    // Student data state
    const [student, setStudent] = useState({
        name: "Alex Johnson",
        class: "10-A",
        rollNo: "2023-1045",
        email: "alex.johnson@school.edu",
        joinDate: "August 15, 2024",
        points: 850,
        attendance: "95%",
        status: "Good Standing", // Options: Excellent, Good Standing, Warning, Probation
        monthlyDeductions: [
            { reason: "Late for assembly", date: "April 10, 2025", points: "-10" },
            { reason: "Homework not submitted", date: "April 5, 2025", points: "-15" },
            { reason: "Improper uniform", date: "March 28, 2025", points: "-5" },
            { reason: "Class disruption", date: "March 15, 2025", points: "-20" }
        ]
    });

    // Activity logs
    const [recentActivities, setRecentActivities] = useState([
        {
            reason: "Perfect attendance this week",
            date: new Date(2025, 3, 15, 10, 30), // April 15, 2025
            points: 25,
            type: 'addition'
        },
        {
            reason: "Late submission of assignment",
            date: new Date(2025, 3, 14, 14, 15), // April 14, 2025
            points: -10,
            type: 'deduction'
        }
    ]);

    // Action type state (add or deduct)
    const [actionType, setActionType] = useState('deduct');

    // Custom action form states
    const [customAction, setCustomAction] = useState('');
    const [customPoints, setCustomPoints] = useState('');

    // Predefined deduction actions
    const predefinedActions = [
        { id: 1, label: "Late for class", points: "-5" },
        { id: 2, label: "Incomplete homework", points: "-10" },
        { id: 3, label: "Dress code violation", points: "-15" },
        { id: 4, label: "Disruptive behavior", points: "-20" },
        { id: 5, label: "Unauthorized device use", points: "-25" }
    ];

    // Predefined positive actions
    const positiveActions = [
        { id: 1, label: "Helping classmates", points: "10" },
        { id: 2, label: "Active participation", points: "15" },
        { id: 3, label: "Extra credit work", points: "20" },
        { id: 4, label: "Perfect attendance (week)", points: "25" },
        { id: 5, label: "Outstanding achievement", points: "50" }
    ];

    // Function to handle predefined actions
    const handlePredefinedAction = (points, reason) => {
        const pointsValue = parseInt(points);
        const newActivity = {
            reason: reason,
            date: new Date(),
            points: pointsValue,
            type: pointsValue > 0 ? 'addition' : 'deduction'
        };

        // Update recent activities
        setRecentActivities(prev => [newActivity, ...prev]);

        // Update student points
        setStudent(prev => ({
            ...prev,
            points: prev.points + pointsValue
        }));

        // If it's a deduction, add to monthly deductions
        if (pointsValue < 0) {
            const today = new Date();
            const formattedDate = `${today.toLocaleString('default', { month: 'long' })} ${today.getDate()}, ${today.getFullYear()}`;

            setStudent(prev => ({
                ...prev,
                monthlyDeductions: [
                    { reason: reason, date: formattedDate, points: points },
                    ...prev.monthlyDeductions
                ]
            }));
        }
    };

    // Function to handle custom action
    const handleCustomAction = (isAddition) => {
        if (!customAction || !customPoints) return;

        const pointsValue = isAddition ? Math.abs(parseInt(customPoints)) : -Math.abs(parseInt(customPoints));

        const newActivity = {
            reason: customAction,
            date: new Date(),
            points: pointsValue,
            type: isAddition ? 'addition' : 'deduction'
        };

        // Update recent activities
        setRecentActivities(prev => [newActivity, ...prev]);

        // Update student points
        setStudent(prev => ({
            ...prev,
            points: prev.points + pointsValue
        }));

        // If it's a deduction, add to monthly deductions
        if (!isAddition) {
            const today = new Date();
            const formattedDate = `${today.toLocaleString('default', { month: 'long' })} ${today.getDate()}, ${today.getFullYear()}`;

            setStudent(prev => ({
                ...prev,
                monthlyDeductions: [
                    { reason: customAction, date: formattedDate, points: pointsValue.toString() },
                    ...prev.monthlyDeductions
                ]
            }));
        }

        // Reset form
        setCustomAction('');
        setCustomPoints('');
    };

    // Update student status based on points
    useEffect(() => {
        let newStatus = "Probation";
        if (student.points >= 900) {
            newStatus = "Excellent";
        } else if (student.points >= 750) {
            newStatus = "Good Standing";
        } else if (student.points >= 500) {
            newStatus = "Warning";
        }

        if (newStatus !== student.status) {
            setStudent(prev => ({
                ...prev,
                status: newStatus
            }));
        }
    }, [student.points, student.status]);

    return (
        <AdminLayout>
            <div className="grid grid-cols-12 gap-6">
                {/* Student Profile and Activities - Left Side */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">{student.name}</h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <p className="text-gray-600">Class: {student.class}</p>
                                <p className="text-gray-600">Roll Number: {student.rollNo}</p>
                                <p className="text-gray-600">Email: {student.email}</p>
                                <p className="text-gray-600">Join Date: {student.joinDate}</p>
                            </div>
                            <div className="space-y-3">
                                <p className="text-gray-600">Current Points: <span className="font-bold text-xl">{student.points}</span></p>
                                <p className="text-gray-600">Attendance: {student.attendance}</p>
                                <p className="text-gray-600">Status:
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

                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h3 className="text-lg font-semibold mb-4">Recent Activities (24h)</h3>
                        <div className="space-y-4">
                            {recentActivities.map((activity, index) => (
                                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                                    <div>
                                        <p className="font-medium">{activity.reason}</p>
                                        <p className="text-sm text-gray-500">
                                            {formatDistanceToNow(activity.date, { addSuffix: true })}
                                        </p>
                                    </div>
                                    <span className={`font-medium ${activity.type === 'addition' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {activity.type === 'addition' ? '+' : ''}{activity.points}
                                    </span>
                                </div>
                            ))}
                            {recentActivities.length === 0 && (
                                <p className="text-gray-500 text-center py-4">No activities in the last 24 hours</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h3 className="text-lg font-semibold mb-4">Monthly Activities</h3>
                        <div className="space-y-4">
                            {student.monthlyDeductions.map((deduction, index) => (
                                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                                    <div>
                                        <p className="font-medium">{deduction.reason}</p>
                                        <p className="text-sm text-gray-500">{deduction.date}</p>
                                    </div>
                                    <span className="text-red-600 font-medium">{deduction.points}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions Panel - Right Side */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Quick Actions</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActionType('deduct')}
                                    className={`px-3 py-1 rounded-lg ${actionType === 'deduct'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-gray-100 text-gray-600'
                                        }`}
                                >
                                    Deduct
                                </button>
                                <button
                                    onClick={() => setActionType('add')}
                                    className={`px-3 py-1 rounded-lg ${actionType === 'add'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-600'
                                        }`}
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
                                    className={`w-full flex items-center justify-between p-3 border rounded-lg transition-colors ${actionType === 'deduct'
                                        ? 'hover:bg-red-50 hover:border-red-200'
                                        : 'hover:bg-green-50 hover:border-green-200'
                                        }`}
                                >
                                    <span>{action.label}</span>
                                    <span className={actionType === 'deduct' ? 'text-red-600' : 'text-green-600'}>
                                        {actionType === 'deduct' ? action.points : `+${action.points}`}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h3 className="text-lg font-semibold mb-4">Custom Action</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Reason
                                </label>
                                <input
                                    type="text"
                                    value={customAction}
                                    onChange={(e) => setCustomAction(e.target.value)}
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter reason..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Points
                                </label>
                                <input
                                    type="number"
                                    value={customPoints}
                                    onChange={(e) => setCustomPoints(e.target.value)}
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            </div>
        </AdminLayout>

    );
}

export default ActionPage;