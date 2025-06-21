import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BsPersonCircle } from "react-icons/bs";
import { BookOpen, Clock, Award, AlertTriangle, Info, AlertCircle, Star, TrendingUp, Flag, CheckCircle } from 'lucide-react';
import { getRecommendation, getStudentAttendance, getUserData, } from '../../Redux/Slices/AuthSlice';
import Action from '../../Components/Action';
import Recommendations from '../../Components/Recommendations';

const Dashboard = () => {
  const dispatch = useDispatch();
  const student = useSelector(state => state.auth.data);
  const attendance = useSelector(state => state.auth.attendanceData);
  const activity = useSelector(state => state.auth.activityData?.activities);
  const recommendation = useSelector(state => state.auth.recommendationData);



  console.log("Dashboard component loaded");
  console.log("this is dashbord activity", activity);

  // Safely handle activities array
  const activities = activity || [];

  // Calculate bonus points (sum of positive activity points)
  const bonusPoints = activities
    .filter(a => a.points > 0)
    .reduce((sum, a) => sum + a.points, 0);

  // Calculate deduced points (sum of negative activity points)
  const deducedPoints = activities
    .filter(a => a.points < 0)
    .reduce((sum, a) => sum + a.points, 0);  // this will be negative

  // Base points from student data or fallback to 100
  const basePoints = student?.user?.points?.base_points || 100;

  // Total points calculation
  const totalPoints = basePoints + bonusPoints + deducedPoints;

  // async function getAssiginment() {
  //   await dispatch(getAssignments());
  // }

  async function getstudentData() {
    try {
      console.log("user api called");
      await dispatch(getUserData());
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  }

  async function getstudentAttendance() {
    try {
      console.log("user attendance api called");
      await dispatch(getStudentAttendance());
    } catch (error) {
      console.error("Failed to fetch user attendance:", error);
    }
  }
  async function Recommendation() {
    try {
      console.log("user attendance api called");
      await dispatch(getRecommendation());
    } catch (error) {
      console.error("Failed to fetch user Recommendation:", error);
    }
  }



  useEffect(() => {
    console.log("useEffect triggered");
    getstudentData();
    getstudentAttendance();
    Recommendation();

  }, []);

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
                    {student?.profilePic ? (
                      <img
                        src={student.profilePic}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BsPersonCircle className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{student?.user?.name}</h2>
                  <p className="text-gray-600">Student Id: {student?.user?.id}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-4xl font-bold text-indigo-600">{totalPoints}</span>
                <p className="text-gray-600">Total Points</p>
              </div>
            </div>

            {/* Points Breakdown */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-100 p-4 rounded-lg">
                <div className="flex justify-between">
                  <Award color="green" size={20} />
                  <span className="text-green-600 font-bold">{basePoints}</span>
                </div>
                <p className="text-green-600 mt-2">Base Points</p>
              </div>

              <div className="bg-red-100 p-4 rounded-lg">
                <div className="flex justify-between">
                  <AlertTriangle color="red" size={20} />
                  <span className="text-red-600 font-bold">{deducedPoints}</span>
                </div>
                <p className="text-red-600 mt-2">Total Deductions</p>
              </div>

              <div className="bg-blue-100 p-4 rounded-lg">
                <div className="flex justify-between">
                  <Award color="blue" size={20} />
                  <span className="text-blue-600 font-bold">{bonusPoints}</span>
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
            {/* <div className="bg-white rounded-lg shadow p-6 mb-4"> */}
            {/* <div className="flex items-center mb-4">
                <BookOpen className="mr-2 text-gray-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-800">Academic Performance</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Assignments Completed</p>
                  <p className="font-semibold">{assiginment?.summary?.total}/{assiginment?.summary?.submitted}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Due</p>
                  <p className="font-semibold">{assiginment?.summary?.late}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Missed</p>
                  <p className="font-semibold">{assiginment?.summary?.missed}</p>
                </div>
              </div>
            </div> */}

            {/* Attendance */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Clock className="mr-2 text-gray-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-800">Attendance</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Present</p>
                  <p className="font-semibold text-green-600">{attendance?.summary?.present ?? 0}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Late</p>
                  <p className="font-semibold text-yellow-600">{attendance?.summary?.late ?? 0}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Absent</p>
                  <p className="font-semibold text-red-600">{attendance?.summary?.absent ?? 0}</p>
                </div>
              </div>
            </div>

            {/* Recommendation Box */}
            <Recommendations recommendation={recommendation} />

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
