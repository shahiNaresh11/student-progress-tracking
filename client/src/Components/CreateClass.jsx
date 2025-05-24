import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../Layouts/AdminLayout";
import { useDispatch } from "react-redux";
import { createClass } from "../Redux/Slices/TeacherSlice";

function CreateClass() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [className, setClassName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await dispatch(createClass({ className }));
            navigate("/teacher-dashboard");

        } catch (error) {
            console.error("Failed to create class:", error);
            // Optional: Show error message to user
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-bold mb-4">Create New Class</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Class Name</label>
                        <input
                            type="text"
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Create Class
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}

export default CreateClass;
