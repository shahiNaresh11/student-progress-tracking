import React, { useState } from 'react';
import {
    Users,
    Award,
    Clock,
    AlertCircle,
    Plus,
    Search,
    BarChart3,
    BookOpen,
    Calendar,
    Settings,
    ArrowLeft,
    MinusCircle,
    PlusCircle,
    ChevronLeft,
    ChevronRight,
    Menu
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function Hello() {
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);
    const [selectedTab, setSelectedTab] = useState('dashboard');
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showQuickAction, setShowQuickAction] = useState(false);

    // Mock data for demonstration

    const students = [
        {
            id: 1, name: "Alice Johnson", class: "10-A", points: 95, attendance: "98%",
            email: "alice@school.com", rollNo: "101", joinDate: "2023-09-01",
            lastDeduction: "Late Assignment (-2)", status: "Good Standing",
            recentActivities: [
                { date: new Date(2024, 2, 20, 14, 30), type: "deduction", reason: "Late to class", points: -2 },
                { date: new Date(2024, 2, 20, 10, 15), type: "addition", reason: "Class participation", points: 5 },
                { date: new Date(2024, 2, 19, 15, 45), type: "deduction", reason: "Incomplete homework", points: -3 }
            ],
            monthlyDeductions: [
                { date: "2024-03-01", reason: "Late to class", points: -2 },
                { date: "2024-03-10", reason: "Incomplete homework", points: -3 }
            ]
        },
        {
            id: 2, name: "Bob Smith", class: "10-A", points: 82, attendance: "95%",
            email: "bob@school.com", rollNo: "102", joinDate: "2023-09-01",
            lastDeduction: "Behavioral Issue (-5)", status: "Warning",
            recentActivities: [
                { date: new Date(2024, 2, 20, 13, 0), type: "deduction", reason: "Behavioral warning", points: -5 },
                { date: new Date(2024, 2, 19, 11, 30), type: "addition", reason: "Homework completion", points: 3 }
            ],
            monthlyDeductions: [
                { date: "2024-03-05", reason: "Behavioral warning", points: -5 }
            ]
        },
    ];

    const predefinedActions = [
        { id: 1, label: "Late to Class", points: -2 },
        { id: 2, label: "Absent", points: -3 },
        { id: 3, label: "Behavioral Warning", points: -5 },
        { id: 4, label: "Incomplete Homework", points: -2 },
        { id: 5, label: "Disrupting Class", points: -4 },
    ];

    const positiveActions = [
        { id: 1, label: "Class Participation", points: 2 },
        { id: 2, label: "Perfect Attendance", points: 5 },
        { id: 3, label: "Homework Excellence", points: 3 },
        { id: 4, label: "Helping Others", points: 4 },
        { id: 5, label: "Extra Credit", points: 5 },
    ];


    const StudentView = ({ student }) => {
        const [customAction, setCustomAction] = useState('');
        const [customPoints, setCustomPoints] = useState('');
        const [actionType, setActionType] = useState('deduct');

        const recentActivities = student.recentActivities.filter(
            activity => new Date().getTime() - activity.date.getTime() <= 24 * 60 * 60 * 1000
        );

        return (
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
                                <button className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
                                    Deduct Points
                                </button>
                                <button className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                                    Add Points
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const ClassDashboard = ({ classInfo }) => {
        const classStudents = students.filter(student => student.class === classInfo.name.split(' ')[1]);

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSelectedClass(null)}
                            className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Classes
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800">{classInfo.name}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search students..."
                                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <Plus className="w-5 h-5" />
                            Add Student
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-lg font-semibold mb-4">Student List</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">Student Name</th>
                                    <th className="text-left py-3 px-4">Points</th>
                                    <th className="text-left py-3 px-4">Attendance</th>
                                    <th className="text-left py-3 px-4">Status</th>
                                    <th className="text-left py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classStudents.map((student) => (
                                    <tr key={student.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => setSelectedStudent(student)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                {student.name}
                                            </button>
                                        </td>
                                        <td className="py-3 px-4">{student.points}</td>
                                        <td className="py-3 px-4">{student.attendance}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-sm ${student.status === 'Excellent' ? 'bg-green-100 text-green-800' :
                                                student.status === 'Good Standing' ? 'bg-blue-100 text-blue-800' :
                                                    student.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedStudent(student);
                                                        setShowQuickAction(true);
                                                        setActionType('deduct');
                                                    }}
                                                    className="p-1 text-yellow-600 hover:text-yellow-800"
                                                >
                                                    <MinusCircle className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedStudent(student);
                                                        setShowQuickAction(true);
                                                        setActionType('add');
                                                    }}
                                                    className="p-1 text-green-600 hover:text-green-800"
                                                >
                                                    <PlusCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Collapsible Sidebar */}
            <div className={`fixed h-full bg-white shadow-lg transition-all duration-300 ${isNavCollapsed ? 'w-16' : 'w-64'
                }`}>
                <div className="flex items-center justify-between p-4 border-b">
                    {!isNavCollapsed && (
                        <>
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-8 h-8 text-blue-600" />
                                <h1 className="text-xl font-bold text-gray-800">Teacher Portal</h1>
                            </div>
                        </>
                    )}
                    <button
                        onClick={() => setIsNavCollapsed(!isNavCollapsed)}
                        className={`p-1 rounded-lg hover:bg-gray-100 ${isNavCollapsed ? 'mx-auto' : ''}`}
                    >
                        {isNavCollapsed ? (
                            <ChevronRight className="w-6 h-6 text-gray-600" />
                        ) : (
                            <ChevronLeft className="w-6 h-6 text-gray-600" />
                        )}
                    </button>
                </div>
                <nav className="p-4">
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => {
                                    setSelectedTab('dashboard');
                                    setSelectedClass(null);
                                    setSelectedStudent(null);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${selectedTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <BarChart3 className="w-5 h-5" />
                                {!isNavCollapsed && 'Dashboard'}
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setSelectedTab('calendar')}
                                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${selectedTab === 'calendar' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <Calendar className="w-5 h-5" />
                                {!isNavCollapsed && 'Calendar'}
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setSelectedTab('settings')}
                                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${selectedTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <Settings className="w-5 h-5" />
                                {!isNavCollapsed && 'Settings'}
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${isNavCollapsed ? 'ml-16' : 'ml-64'
                } p-8`}>
                {selectedStudent ? (
                    <div className="space-y-6">
                        <button
                            onClick={() => setSelectedStudent(null)}
                            className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Class
                        </button>
                        <StudentView student={selectedStudent} />
                    </div>
                ) : selectedClass ? (
                    <ClassDashboard classInfo={selectedClass} />
                ) : (
                    <ClassList />
                )}
            </div>
        </div>
    );
}

export default Hello;