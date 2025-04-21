import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Award, AlertTriangle } from 'lucide-react';
import { BsPersonCircle } from "react-icons/bs";
import Action from '../../Components/Action';

const Dashboard = () => {
  const navigate = useNavigate();
  const userData = useSelector(state => state?.auth?.data);

  const student = {
    name: userData?.fullName || "Student Name",
    id: userData?.id || "N/A",
    profilePicture: userData?.profilePicture || "",

    totalPoints: userData?.points?.total || 100,
    basePoints: userData?.points?.base || 100,
    deductions: userData?.points?.deductions || -0,
    bonusPoints: userData?.points?.bonus || 0,

    academic: userData?.academic || {
      assignmentsCompleted: "0/0",
      currentGrade: "N/A",
      classRank: "N/A"
    },
    attendance: userData?.attendance || {
      present: "0%",
      late: "0%",
      absent: "0%"
    },
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left Section */}
          <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between mb-6">
              <div className="flex items-center">
                {/* Profile Picture */}
                <div className="relative mr-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-200 bg-gray-100 flex items-center justify-center">
                    {student.profilePicture ? (
                      <img
                        src={student.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BsPersonCircle className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
                  <p className="text-gray-600">Student ID: {student.id}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-4xl font-bold text-indigo-600">{student.totalPoints}</span>
                <p className="text-gray-600">Total Points</p>
              </div>
            </div>

            {/* Points Breakdown */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-100 p-4 rounded-lg">
                <div className="flex justify-between">
                  <Award color="green" size={20} />
                  <span className="text-green-600 font-bold">{student.basePoints}</span>
                </div>
                <p className="text-green-600 mt-2">Base Points</p>
              </div>

              <div className="bg-red-100 p-4 rounded-lg">
                <div className="flex justify-between">
                  <AlertTriangle color="red" size={20} />
                  <span className="text-red-600 font-bold">{student.deductions}</span>
                </div>
                <p className="text-red-600 mt-2">Total Deductions</p>
              </div>

              <div className="bg-blue-100 p-4 rounded-lg">
                <div className="flex justify-between">
                  <Award color="blue" size={20} />
                  <span className="text-blue-600 font-bold">+{student.bonusPoints}</span>
                </div>
                <p className="text-blue-600 mt-2">Bonus Points</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6">
              <Action />
            </div>
          </div>

          {/* Right Section */}
          <div className="md:col-span-1">
            {/* Academic Performance */}
            <div className="bg-white rounded-lg shadow p-6 mb-4">
              <div className="flex items-center mb-4">
                <BookOpen className="mr-2 text-gray-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-800">Academic Performance</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Assignments Completed</p>
                  <p className="font-semibold">{student.academic.assignmentsCompleted}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Current Grade</p>
                  <p className="font-semibold">{student.academic.currentGrade}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Class Rank</p>
                  <p className="font-semibold">{student.academic.classRank}</p>
                </div>
              </div>
            </div>

            {/* Attendance */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Clock className="mr-2 text-gray-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-800">Attendance</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Present</p>
                  <p className="font-semibold text-green-600">{student.attendance.present}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Late</p>
                  <p className="font-semibold text-yellow-600">{student.attendance.late}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Absent</p>
                  <p className="font-semibold text-red-600">{student.attendance.absent}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
