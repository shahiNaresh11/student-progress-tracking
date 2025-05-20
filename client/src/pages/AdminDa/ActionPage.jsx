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
        ],
        attendanceRecords: [
            { date: "April 15, 2025", status: "Present" },
            { date: "April 14, 2025", status: "Present" },
            { date: "April 13, 2025", status: "Late" },
            { date: "April 12, 2025", status: "Absent" },
            { date: "April 11, 2025", status: "Present" }
        ]
    });

    // Attendance form state
    const [attendanceStatus, setAttendanceStatus] = useState('present');
    const [attendanceDate, setAttendanceDate] = useState(
        new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
    );

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

    // Function to handle attendance submission
    const handleAttendanceSubmit = () => {
        const formattedDate = new Date(attendanceDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Capitalize first letter of status
        const formattedStatus = attendanceStatus.charAt(0).toUpperCase() + attendanceStatus.slice(1);

        // Add new attendance record
        setStudent(prev => ({
            ...prev,
            attendanceRecords: [
                { date: formattedDate, status: formattedStatus },
                ...prev.attendanceRecords
            ]
        }));

        // Optionally update points based on attendance
        if (attendanceStatus === 'absent') {
            handlePredefinedAction("-10", "Absent from class");
        } else if (attendanceStatus === 'late') {
            handlePredefinedAction("-5", "Late to class");
        }
    };

    // Function to handle predefined actions
    const handlePredefinedAction = (points, reason) => {
        const pointsValue = parseInt(points);

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
                {/* Student Profile and Attendance - Left Side */}
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

                    {/* Attendance Section (Replaces Recent Activities) */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h3 className="text-lg font-semibold mb-4">Attendance</h3>

                        {/* Attendance Form */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={attendanceDate}
                                        onChange={(e) => setAttendanceDate(e.target.value)}
                                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={attendanceStatus}
                                        onChange={(e) => setAttendanceStatus(e.target.value)}
                                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="present">Present</option>
                                        <option value="absent">Absent</option>
                                        <option value="late">Late</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={handleAttendanceSubmit}
                                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Record Attendance
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Attendance Records */}
                        <div className="space-y-4">
                            <h4 className="font-medium text-gray-700">Recent Attendance Records</h4>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {student.attendanceRecords.map((record, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {record.date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${record.status === 'Present' ? 'bg-green-100 text-green-800' :
                                                            record.status === 'Late' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                        }`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {student.attendanceRecords.length === 0 && (
                                <p className="text-gray-500 text-center py-4">No attendance records found</p>
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