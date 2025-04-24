import { useState } from 'react';
import { Menu, Home, Users, Book, Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';

function SuperAdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`bg-gray-800 text-white ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col`}>
                <div className="p-4 flex items-center justify-between">
                    {sidebarOpen && <h1 className="text-xl font-bold">Dashboard</h1>}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-md hover:bg-gray-700"
                    >
                        <Menu size={20} />
                    </button>
                </div>
                <nav className="flex-1 pt-4">
                    <ul>
                        <li className="mb-2">
                            <Link
                                to="/"
                                className="flex items-center p-4 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md mx-2"
                            >
                                <Home size={20} />
                                {sidebarOpen && <span className="ml-3">Home</span>}
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link
                                to="/addstudent"
                                className="flex items-center p-4 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md mx-2"
                            >
                                <Users size={20} />
                                {sidebarOpen && <span className="ml-3">Students</span>}
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link
                                to="/addteacher"
                                className="flex items-center p-4 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md mx-2"
                            >
                                <Book size={20} />
                                {sidebarOpen && <span className="ml-3">Teachers</span>}
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-md p-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Superadmin Dashboard</h2>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 rounded-full hover:bg-gray-100">
                            <Bell size={20} />
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100">
                            <User size={20} />
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-4">
                    {children}
                </main>

            </div>
        </div>
    );
}

export default SuperAdminLayout;
