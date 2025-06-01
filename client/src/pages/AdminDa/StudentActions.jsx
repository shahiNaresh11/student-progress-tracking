import React, { useState } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../../Layouts/AdminLayout';
import { useLocation } from 'react-router-dom';
import { createActivity } from '../../Redux/Slices/TeacherSlice';
import { useDispatch } from 'react-redux';

function StudentActions() {
    const dispatch = useDispatch();
    const location = useLocation();

    const studentData = location.state?.student || {};
    const [actionType, setActionType] = useState('deduct');
    const [customAction, setCustomAction] = useState('');
    const [customPoints, setCustomPoints] = useState('');

    const predefinedActions = [
        { id: 1, label: "Late for class", points: -2 },
        { id: 2, label: "Incomplete homework", points: -2 },
        { id: 3, label: "Dress code violation", points: -2 },
        { id: 4, label: "Disruptive behavior", points: -3 },
        { id: 5, label: "Phone/device misuse", points: -3 }
    ];

    const positiveActions = [
        { id: 1, label: " program partcipation", points: 5 },
        { id: 2, label: "Great participation", points: 2 },
        { id: 3, label: "Extra credit work", points: 5 },
        { id: 4, label: "Perfect week attendance", points: 1 },
        { id: 5, label: "Outstanding work", points: 2 }
    ];

    const handlePredefinedAction = (points, activity) => {
        if (!studentData?.id) return;

        toast((t) => (
            <div className="text-center">
                <p className="mb-4">
                    Apply <strong>{activity}</strong> ({points > 0 ? '+' : ''}{points} points) to <strong>{studentData.name}</strong>?
                </p>
                <div className="flex justify-center gap-3">
                    <button
                        onClick={() => {
                            const activityData = {
                                studentId: studentData.id,
                                points,
                                activity,
                            };
                            dispatch(createActivity(activityData));
                            toast.dismiss(t.id);
                            toast.success('Done!');
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), { duration: 6000 });
    };

    const handleCustomAction = (isAddition) => {
        if (!customAction || !customPoints || !studentData?.id) {
            toast.error('Please fill in both fields');
            return;
        }

        const points = isAddition ? parseInt(customPoints) : -parseInt(customPoints);

        toast((t) => (
            <div className="text-center">
                <p className="mb-4">
                    Apply <strong>{customAction}</strong> ({points > 0 ? '+' : ''}{points} points) to <strong>{studentData.name}</strong>?
                </p>
                <div className="flex justify-center gap-3">
                    <button
                        onClick={() => {
                            const activityData = {
                                studentId: studentData.id,
                                points,
                                activity: customAction,
                            };
                            dispatch(createActivity(activityData));
                            toast.dismiss(t.id);
                            toast.success('Custom action applied!');
                            setCustomAction('');
                            setCustomPoints('');
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), { duration: 6000 });
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto p-6">
                {/* Simple Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Student Actions</h1>
                    <p className="text-gray-600">Managing points for {studentData.name}</p>
                </div>

                {/* Action Type Selector */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => setActionType('deduct')}
                            className={`px-4 py-2 rounded ${actionType === 'deduct'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Remove Points
                        </button>
                        <button
                            onClick={() => setActionType('add')}
                            className={`px-4 py-2 rounded ${actionType === 'add'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Add Points
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            {actionType === 'deduct' ? 'Common Issues' : 'Good Behavior'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(actionType === 'deduct' ? predefinedActions : positiveActions).map((action) => (
                                <button
                                    key={action.id}
                                    onClick={() => handlePredefinedAction(action.points, action.label)}
                                    className="p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-800">{action.label}</span>
                                        <span className={`font-semibold ${action.points > 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {action.points > 0 ? `+${action.points}` : action.points}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Custom Action */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Custom Action</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                What happened?
                            </label>
                            <input
                                type="text"
                                placeholder=""
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={customAction}
                                onChange={(e) => setCustomAction(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                How many points?
                            </label>
                            <input
                                type="number"
                                placeholder="Enter number"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={customPoints}
                                onChange={(e) => setCustomPoints(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => handleCustomAction(true)}
                                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Add Points
                            </button>
                            <button
                                onClick={() => handleCustomAction(false)}
                                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Remove Points
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default StudentActions;