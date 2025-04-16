import { useState } from "react";
import {
    BookOpen,
    ChevronLeft,
    ChevronRight,
    BarChart3,
    Calendar,
    Settings,
    Bell,
    Menu
} from "lucide-react";

function AdminLayout({ children }) {
    const [isOpen, setisOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState('dashboard');

    return (
        <div className="min-h-screen bg-gray-50 flex ">
            {/* Collapsible Sidebar */}
            <div
                className={`fixed h-full bg-white shadow-lg transition-all duration-300  ${isOpen ? 'w-16' : 'w-64'
                    }`}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    {!isOpen && (
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                            <h1 className="text-lg font-bold text-gray-800">Teacher Portal</h1>
                        </div>
                    )}
                    {isOpen && (
                        <BookOpen className="w-6 h-6 text-blue-600 mx-auto" />
                    )}
                    <button
                        onClick={() => setisOpen(!isOpen)}
                        className="p-1 rounded-lg hover:bg-gray-100"
                    >
                        {isOpen ? (
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        ) : (
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        )}
                    </button>
                </div>

                <nav className="p-3">
                    <ul className="space-y-1">
                        <li>
                            <button
                                onClick={() => setSelectedTab('dashboard')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${selectedTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <BarChart3 className="w-5 h-5" />
                                {!isOpen && <span>Dashboard</span>}
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setSelectedTab('calendar')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${selectedTab === 'calendar' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <Calendar className="w-5 h-5" />
                                {!isOpen && <span>Calendar</span>}
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setSelectedTab('settings')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${selectedTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <Settings className="w-5 h-5" />
                                {!isOpen && <span>Settings</span>}
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Content Container */}
            <div className={`flex-1 transition-all duration-300 ${isOpen ? 'ml-16' : 'ml-64'}`}>
                {/* Header */}
                <header className="bg-white shadow-sm p-4 h-24">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <button className="mr-2 md:hidden p-1 rounded-lg hover:bg-gray-100" onClick={() => setisOpen(!isOpen)}>
                                <Menu className="w-6 h-6 text-gray-600" />
                            </button>
                            <h2 className="text-xl font-semibold text-gray-800">
                                {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}
                            </h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="relative p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 bg-red-500 w-2 h-2 rounded-full"></span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="p-4">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;