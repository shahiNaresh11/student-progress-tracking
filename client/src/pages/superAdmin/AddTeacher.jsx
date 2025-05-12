import { useState } from 'react';
import SuperAdminLayout from '../../Layouts/SuperAdminLayout';
import { createTeacherAccount } from '../../Redux/Slices/AuthSlice';
import { useDispatch } from 'react-redux';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaCamera, FaSpinner } from 'react-icons/fa';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { MdPersonOutline, MdOutlineCameraAlt } from 'react-icons/md';

function AddTeacher() {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        email: '',
        password: '',
        contactNumber: '',
        address: '',
        profilePic: null,
        role: 'teacher'
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate image file
        if (!file.type.match('image.*')) {
            setMessage({ text: 'Please select an image file (JPEG, PNG, etc.)', type: 'error' });
            return;
        }

        // Validate image size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            setMessage({ text: 'Image size should be less than 2MB', type: 'error' });
            return;
        }

        setFormData(prevState => ({
            ...prevState,
            profilePic: file
        }));

        // Create preview
        const reader = new FileReader();
        reader.onload = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            gender: '',
            email: '',
            password: '',
            contactNumber: '',
            address: '',
            profilePic: null
        });
        setPreviewImage(null);
        setMessage({ text: '', type: '' });
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setMessage({ text: 'Full name is required', type: 'error' });
            return false;
        }

        if (!formData.gender) {
            setMessage({ text: 'Please select a gender', type: 'error' });
            return false;
        }

        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setMessage({ text: 'Please enter a valid email address', type: 'error' });
            return false;
        }

        if (formData.password.length < 8) {
            setMessage({ text: 'Password must be at least 8 characters', type: 'error' });
            return false;
        }

        if (!formData.contactNumber.match(/^[+]?[(]?[0-9]{1,4}[)]?[-\\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)) {
            setMessage({ text: 'Please enter a valid phone number', type: 'error' });
            return false;
        }

        if (!formData.address.trim()) {
            setMessage({ text: 'Address is required', type: 'error' });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formDataToSend.append(key, value);
                }
            });

            const resultAction = await dispatch(createTeacherAccount(formDataToSend));

            if (createTeacherAccount.fulfilled.match(resultAction)) {
                setMessage({
                    text: 'Teacher registered successfully!',
                    type: 'success'
                });
                resetForm();
            } else {
                throw resultAction.error || new Error('Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setMessage({
                text: error.message || 'An error occurred during registration. Please try again.',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <SuperAdminLayout>
            <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Teacher Registration</h2>
                    <p className="text-gray-600 mt-2">Add a new teacher to the system</p>
                </div>

                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Image Upload */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-blue-100">
                                {previewImage ? (
                                    <img
                                        src={previewImage}
                                        alt="Profile Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <MdPersonOutline className="h-16 w-16 text-gray-400" />
                                )}
                            </div>
                            <label htmlFor="profilePic"
                                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 cursor-pointer shadow-md">
                                <MdOutlineCameraAlt className="h-5 w-5" />
                            </label>
                            <input
                                type="file"
                                id="profilePic"
                                name="profilePic"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Upload profile picture (optional, max 2MB)</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="col-span-2 md:col-span-1">
                            <label htmlFor="name" className="block mb-2 font-medium text-gray-700">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Gender */}
                        <div className="col-span-2 md:col-span-1">
                            <label className="block mb-2 font-medium text-gray-700">
                                Gender <span className="text-red-500">*</span>
                            </label>
                            <div className="flex space-x-4 bg-gray-50 p-3 rounded-lg border border-gray-300">
                                {["Male", "Female", "Other"].map((option) => (
                                    <label key={option} className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={option}
                                            checked={formData.gender === option}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-gray-700">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="col-span-2 md:col-span-1">
                            <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                    placeholder="email@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="col-span-2 md:col-span-1">
                            <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                    placeholder="Enter password"
                                    required
                                    minLength="8"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    aria-label={passwordVisible ? "Hide password" : "Show password"}
                                >
                                    {passwordVisible ? (
                                        <HiEyeOff className="h-5 w-5 text-gray-500" />
                                    ) : (
                                        <HiEye className="h-5 w-5 text-gray-500" />
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters</p>
                        </div>

                        {/* Contact Number */}
                        <div className="col-span-2 md:col-span-1">
                            <label htmlFor="contactNumber" className="block mb-2 font-medium text-gray-700">
                                Contact Number <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaPhone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="tel"
                                    id="contactNumber"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                    placeholder="+1 (123) 456-7890"
                                    pattern="^\+?[\d\s\-\(\)]{6,20}$"
                                    required
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="col-span-2">
                            <label htmlFor="address" className="block mb-2 font-medium text-gray-700">
                                Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                    <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                                </div>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                    placeholder="Enter full address"
                                    required
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 px-6 rounded-lg focus:outline-none focus:ring-4 transition duration-200 text-lg font-medium flex items-center justify-center ${isLoading
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 text-white'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                    Processing...
                                </>
                            ) : (
                                'Register Teacher'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </SuperAdminLayout>
    );
}

export default AddTeacher;