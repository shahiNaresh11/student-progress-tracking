import React, { useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { LogOut, GraduationCap, User, Clock, Book, Bell, Menu, ChevronLeft } from 'lucide-react';

import { logout } from '../Redux/Slices/AuthSlice';
import { useDispatch, useSelector } from 'react-redux';

function HomeLayouts() {
    const dispatch = useDispatch();
    const navigate = useNavigate();



    const [sidebarOpen, setSidebarOpen] = useState(false);

    const student = useSelector(state => state.auth.data);
    console.log("from the navbar", student)

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    async function handleLogout(e) {
        e.preventDefault();
        const res = await dispatch(logout());

        console.log("this is logout response", res)
        if (res?.payload?.success) {
            navigate('/'); // Redirect to login page
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header */}
            <header className="fixed top-0 left-0 w-full z-20 bg-gradient-to-r from-indigo-800 to-indigo-600 shadow-md p-2">
                <div className="container mx-auto px-8">
                    <div className="flex h-20 items-center justify-between">
                        {/* Logo/Brand */}
                        <div className="flex items-center space-x-4">
                            <div className="bg-white p-3 rounded-full shadow-lg">
                                <GraduationCap size={24} className="text-indigo-700" />
                            </div>
                            <h1 className="text-white text-2xl font-bold tracking-wide">
                                Student Portal
                            </h1>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-5 ml-auto">
                            {/* Profile Button */}
                            <button
                                className="flex items-center space-x-3 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                                onClick={() => { }}
                            >
                                <div className="w-8 h-8 bg-indigo-300 rounded-full flex items-center justify-center pb-2 text-indigo-800 font-bold text-xl">
                                    {student?.user?.name
                                        ? student?.user?.name
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')
                                        : '?'}
                                </div>
                                <span className="font-medium">{student?.user?.class?.className}</span>

                            </button>

                            {/* Notification Button */}
                            {/* <button className="flex items-center justify-center w-11 h-11 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors relative">
                                <Bell size={18} />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                    3
                                </span>
                            </button> */}

                            {/* Logout Button */}
                            <button
                                className="flex items-center justify-center w-11 h-11 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                                onClick={handleLogout}
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Layout Body */}
            <div className="flex flex-1 relative">
                {/* Sidebar */}
                <aside
                    className={`bg-white shadow-md pt-8 px-4 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'
                        } h-full fixed left-0 top-20 z-10`}
                >
                    {/* Sidebar Toggle */}
                    <button
                        onClick={toggleSidebar}
                        className="absolute -right-4 top-8 bg-white rounded-full p-2 shadow-md text-indigo-700 hover:bg-indigo-50 transition-colors"
                    >
                        {sidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
                    </button>

                    <nav className="space-y-2">
                        <Link
                            to="/assignment"
                            className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'
                                } w-full px-4 py-3 text-left text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors`}
                        >
                            <Book size={18} />
                            {sidebarOpen && <span className="font-medium">Assignment</span>}
                        </Link>

                        <Link
                            to="/records"
                            className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'
                                } w-full px-4 py-3 text-left text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors`}
                        >
                            <Clock size={18} />
                            {sidebarOpen && <span className="font-medium">Records</span>}
                        </Link>

                        {/* <Link
                            to="/profile"
                            className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'
                                } w-full px-4 py-3 text-left text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors`}
                        >
                            <User size={18} />
                            {sidebarOpen && <span className="font-medium">Profile</span>}
                        </Link> */}
                    </nav>
                </aside>

                {/* Main Content */}
                <main
                    className={`flex-1 p-8 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'
                        }`}
                >
                    <div className="mt-20">
                        <Outlet /> {/* Nested page will be rendered here */}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default HomeLayouts;
