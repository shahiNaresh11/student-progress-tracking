import { useLocation, useNavigation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../../Layouts/AdminLayout";

function StudentList() {
    const location = useLocation();
    const navigate = useNavigate();
    const classInfo = location.state?.classInfo || {};


    const [students, setStudents] = useState([]);

    useEffect(() => {
        // Simulate student fetch for the selected class
        const mockStudents = [
            { id: 1, name: "Alice Johnson", email: "alice.j@school.edu", phone: "(555) 123-4567", points: 87 },
            { id: 2, name: "Bob Smith", email: "bob.smith@school.edu", phone: "(555) 234-5678", points: 75 },
            { id: 3, name: "Charlie Lee", email: "charlie.l@school.edu", phone: "(555) 345-6789", points: 82 },
            { id: 4, name: "Diana Parker", email: "diana.p@school.edu", phone: "(555) 456-7890", points: 94 },
            { id: 5, name: "Evan Rodriguez", email: "evan.r@school.edu", phone: "(555) 567-8901", points: 68 },
        ];

        setStudents(mockStudents);
    }, []);


    const handleAddClick = () => {
        navigate(`/add-points/${students.id}`);
    };

    return (
        <AdminLayout>
            <div className="bg-gray-50 min-h-screen pb-12">
                {/* Header section - displays class name and add student button */}

                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        {/* Class name display */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                {classInfo.name || "Unnamed Class"}
                            </h1>
                            <p className="text-sm text-gray-700 mt-1">
                                Manage and view student performance for this class
                            </p>
                        </div>

                        {/* Add student button */}
                        <div>
                            <button
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md transition duration-200 ease-in-out"
                                onClick={() => navigate("/add-student")}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2"
                                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M12 4v16m8-8H4"></path>
                                </svg>
                                Add New Student
                            </button>
                        </div>
                    </div>
                </div>



                {/* Main content area */}
                <div className="max-w-6xl mx-auto px-6 mt-8">
                    {/* Search and filter controls */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div className="relative">
                            {/* Search input for filtering students */}
                            <input
                                type="text"
                                placeholder="Search students..."
                                className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center space-x-2">
                            {/* Sorting controls */}
                            <select className="border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>Sort by Name</option>
                                <option>Sort by Points (High to Low)</option>
                                <option>Sort by Points (Low to High)</option>
                            </select>
                        </div>
                    </div>

                    {/* Student data table */}
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-50 text-left border-b">
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Name</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Email</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Phone</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Points</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Map through students array to render each student row */}
                                    {students.map((student, index) => (
                                        <tr key={student.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                                            {/* Student name and ID display */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 mr-3">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold">
                                                            {student.name.charAt(0)}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{student.name}</div>
                                                        <div className="text-sm text-gray-500">ID: {student.id.toString().padStart(4, '0')}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Student email */}
                                            <td className="px-6 py-4 text-gray-600">
                                                {student.email}
                                            </td>
                                            {/* Student phone */}
                                            <td className="px-6 py-4 text-gray-600">
                                                {student.phone}
                                            </td>
                                            {/* Student points with conditional formatting based on score */}
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center">
                                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${student.points >= 90 ? 'bg-green-100 text-green-800 border border-green-200' :
                                                        student.points >= 75 ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                                            'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                        }`}>
                                                        {student.points} points
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Action buttons - add/remove points and view details */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <div className="bg-gray-100 rounded-lg flex shadow-sm">
                                                        <button
                                                            onClick={handleAddClick}
                                                            className="px-3 py-1 text-green-600 hover:bg-green-50 rounded-l-lg border border-gray-300 text-sm font-medium">
                                                            +
                                                        </button>
                                                        <button className="px-3 py-1 text-red-600 hover:bg-red-50 border-t border-b border-r border-gray-300 text-sm font-medium">
                                                            -
                                                        </button>
                                                    </div>
                                                    <button className="px-3 py-1 bg-blue-600 text-white rounded border text-sm">
                                                        View
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {/* Empty state message when no students are found */}
                                    {students.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center">
                                                <p className="text-lg font-medium text-gray-500">No students found</p>
                                                <p className="text-gray-400">Try adjusting your search or filters</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination controls for navigating through multiple pages of students */}
                        <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing <span className="font-medium">{students.length}</span> of <span className="font-medium">{students.length}</span> students
                            </div>
                            <div className="flex space-x-1">
                                <button disabled className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-400 cursor-not-allowed">
                                    Previous
                                </button>
                                <button className="px-3 py-1 border border-blue-500 bg-blue-500 text-white rounded-md font-medium text-sm">
                                    1
                                </button>
                                <button disabled className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-400 cursor-not-allowed">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </AdminLayout>

    );
}

export default StudentList;