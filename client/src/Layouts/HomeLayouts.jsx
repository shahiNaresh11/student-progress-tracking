import React, { useState } from 'react';
import { LogOut, GraduationCap, User, Clock, Book, Calendar, Bell, Menu, ChevronLeft } from 'lucide-react';

function HomeLayouts({ children }) {
    const [name, setName] = useState("John Doe");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <header className="fixed top-0 left-0 w-full z-20 bg-gradient-to-r from-indigo-800 to-indigo-600 shadow-md p-2">

                <div className="container mx-auto px-8">
                    <div className="flex h-20 items-center justify-between">
                        {/* Logo/Brand */}
                        <div className="flex items-center space-x-4">
                            <div className="bg-white p-3 rounded-full shadow-lg">
                                <GraduationCap size={24} className="text-indigo-700" />
                            </div>
                            <h1 className="text-white text-2xl font-bold tracking-wide">Student Portal</h1>
                        </div>

                        {/* Action Buttons - Moved slightly to the right with proper spacing */}
                        <div className="flex items-center space-x-5 ml-auto">
                            {/* Records Button */}
                            <button className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-md">
                                <Clock size={18} />
                                <span className="font-medium">Records</span>
                            </button>

                            {/* Notification Button */}
                            <button className="flex items-center justify-center w-11 h-11 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors relative">
                                <Bell size={18} />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">3</span>
                            </button>

                            {/* Profile Button */}
                            <button
                                className="flex items-center space-x-3 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                                onClick={() => {/* Add profile logic */ }}
                            >
                                <div className="w-8 h-8 bg-indigo-300 rounded-full flex items-center justify-center text-indigo-800 font-bold">
                                    {name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <span className="font-medium">{name}</span>
                            </button>

                            {/* Logout Button */}
                            <button
                                className="flex items-center justify-center w-11 h-11 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                                onClick={() => {/* Add logout logic */ }}
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content with Sidebar */}
            <div className="flex flex-1 relative">
                {/* Sidebar - with toggle functionality */}
                <aside
                    className={`bg-white shadow-md pt-8 px-4 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'
                        } h-full fixed left-0 top-20 z-10`}
                >
                    {/* Sidebar Toggle Button */}
                    <button
                        onClick={toggleSidebar}
                        className="absolute -right-4 top-8 bg-white rounded-full p-2 shadow-md text-indigo-700 hover:bg-indigo-50 transition-colors"
                    >
                        {sidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
                    </button>

                    <nav className="space-y-2">
                        <button className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} w-full px-4 py-3 text-left text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors`}>
                            <Book size={18} />
                            {sidebarOpen && <span className="font-medium">Courses</span>}
                        </button>
                        <button className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} w-full px-4 py-3 text-left text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors`}>
                            <Calendar size={18} />
                            {sidebarOpen && <span className="font-medium">Schedule</span>}
                        </button>
                        <button className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} w-full px-4 py-3 text-left text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors`}>
                            <Clock size={18} />
                            {sidebarOpen && <span className="font-medium">Records</span>}
                        </button>
                        <button className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} w-full px-4 py-3 text-left text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors`}>
                            <User size={18} />
                            {sidebarOpen && <span className="font-medium">Profile</span>}
                        </button>
                    </nav>
                </aside>

                {/* Main Content Area - Adjusts based on sidebar state */}
                <main className={`flex-1 p-8 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'
                    }`}>
                    <div className="mt-20">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default HomeLayouts;