import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { login } from "../Redux/Slices/AuthSlice";
import { useDispatch } from "react-redux";
import { FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loginData, setloginData] = useState({
        email: "",
        password: "",
    });

    function handleUserInput(e) {
        const { name, value } = e.target;
        setloginData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const { email, password } = loginData;

        if (!email || !password) {
            toast.error("Please fill all the details");
            return;
        }

        try {
            const response = await dispatch(login(loginData));

            if (response.payload?.success) {
                const userRole = response.payload.user.role;
                const normalizedRole = userRole?.toLowerCase();

                if (normalizedRole === "superadmin") {
                    navigate("/superAdmin");
                } else if (normalizedRole === "student") {
                    navigate("/dashboard");
                } else if (normalizedRole === "teacher") {
                    navigate("/teacher-dashboard");
                }

            }
        } catch (error) {
            toast.error("Something went wrong. Try again later.");
            console.error("Login Error:", error);
        }

        setloginData({
            email: "",
            password: "",
        });
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <form
                noValidate
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 p-8 rounded-2xl shadow-2xl w-full max-w-md bg-white backdrop-blur-sm bg-opacity-90 animate-fade-in-up"
            >
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 animate-fade-in">Welcome Back</h1>
                    <p className="mt-2 text-gray-600 animate-fade-in delay-100">Please sign in to continue</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2 animate-fade-in delay-200">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaEnvelope className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                autoComplete="email"
                                required
                                name="email"
                                id="email"
                                placeholder="you@example.com"
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                onChange={handleUserInput}
                                value={loginData.email}
                            />
                        </div>
                    </div>

                    <div className="space-y-2 animate-fade-in delay-300">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                autoComplete="current-password"
                                required
                                name="password"
                                id="password"
                                placeholder="•••"
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                onChange={handleUserInput}
                                value={loginData.password}
                            />
                        </div>
                    </div>


                </div>

                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-2 text-white font-medium rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 animate-fade-in delay-500 flex items-center justify-center gap-2"
                >
                    Sign in
                    <FaArrowRight />
                </button>


            </form>
        </div>
    );
}

export default Login;