import React, { useState } from 'react';
import { LogOut, GraduationCap } from 'lucide-react';

function HomeLayouts({ children }) {  // Accept children as a prop
    const [name, setName] = useState("John Doe");
    const [studentClass, setStudentClass] = useState("Class 10-A");

    return (
        <>
            <header className="bg-gradient-to-r from-indigo-700 to-indigo-500 shadow-lg">
                <div className="container mx-auto px-8 py-5">
                    <div className="flex justify-between items-center">
                        {/* Logo/Brand with Graduation Cap */}
                        <div className="flex items-center space-x-3 ml-4">
                            <div className="bg-white p-2 rounded-full shadow-md">
                                <GraduationCap size={24} className="text-indigo-700" />
                            </div>
                            <h1 className="text-white text-2xl font-bold tracking-wide">Student Portal</h1>
                        </div>

                        {/* User Info & Options */}
                        <div className="flex items-center space-x-3 mr-4">
                            {/* Class Information */}
                            <div className="bg-indigo-800 rounded-lg shadow-md overflow-hidden">
                                <div className="bg-indigo-900 px-3 py-1 text-center">
                                    <span className="text-indigo-200 text-xs font-medium">CLASS</span>
                                </div>
                                <div className="px-4 py-1.5 text-center">
                                    <p className="text-white font-semibold">{studentClass}</p>
                                </div>
                            </div>

                            {/* Student Name */}
                            <div className="bg-indigo-800 rounded-lg shadow-md overflow-hidden">
                                <div className="bg-indigo-900 px-3 py-1 text-center">
                                    <span className="text-indigo-200 text-xs font-medium">STUDENT</span>
                                </div>
                                <div className="px-4 py-1.5 text-center">
                                    <p className="text-white font-semibold">{name}</p>
                                </div>
                            </div>

                            {/* Logout Button */}
                            <div className="bg-indigo-800 rounded-lg shadow-md overflow-hidden hover:bg-indigo-700 transition-colors cursor-pointer">
                                <div className="bg-indigo-900 px-3 py-1 text-center">
                                    <span className="text-indigo-200 text-xs font-medium">ACTION</span>
                                </div>
                                <div className="px-4 py-1.5 flex items-center justify-center">
                                    <LogOut size={16} className="text-white mr-1" />
                                    <span className="text-white font-semibold">Logout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Correctly render children */}
            <main>{children}</main>
        </>
    );
}

export default HomeLayouts;
