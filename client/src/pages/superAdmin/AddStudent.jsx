import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createAccount } from '../../Redux/Slices/AuthSlice';
import SuperAdminLayout from '../../Layouts/SuperAdminLayout';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { MdPersonOutline, MdOutlineCameraAlt, MdClass, MdRadioButtonChecked } from 'react-icons/md';

function AddStudent() {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        studentClass: '',
        section: '',
        gender: '',
        rollNum: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        profilePic: null,
        role: 'student'
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

        // Validate image type and size
        if (!file.type.match('image.*')) {
            console.error('Invalid file type:', file.type);
            setMessage({ text: 'Please select an image file', type: 'error' });
            return;
        }

        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            console.error('File too large:', file.size);
            setMessage({ text: 'Image size should be less than 2MB', type: 'error' });
            return;
        }

        setFormData(prevState => ({
            ...prevState,
            profilePic: file
        }));

        // Create preview URL
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewImage(reader.result);
        };
        reader.onerror = () => {
            console.error('Error reading file:', reader.error);
            setMessage({ text: 'Error processing image', type: 'error' });
        };
        reader.readAsDataURL(file);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            studentClass: '',
            section: '',
            gender: '',
            rollNum: '',
            email: '',
            password: '',
            phone: '',
            address: '',
            profilePic: null,
            role: 'student'
        });
        setPreviewImage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });

        // Basic required fields validation
        const requiredFields = ['name', 'email', 'password'];
        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            console.error('Missing required fields:', missingFields);
            setMessage({ text: 'Please fill all required fields', type: 'error' });
            setIsLoading(false);
            return;
        }

        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formDataToSend.append(key, value);
                }
            });

            console.log('Submitting form data:', Object.fromEntries(formDataToSend.entries()));

            const resultAction = await dispatch(createAccount(formDataToSend));
            

            if (createAccount.fulfilled.match(resultAction)) {
                console.log('Student registered successfully:', resultAction.payload);
                setMessage({ text: 'Student registered successfully!', type: 'success' });
                resetForm();
            } else {
                const error = resultAction.error || new Error('Registration failed');
                console.error('Registration failed:', error);
                throw error;
            }
        } catch (error) {
            console.error('Registration error:', error);
            setMessage({
                text: error.message || 'An error occurred during registration',
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
                    <h1 className="text-3xl font-bold text-gray-800">Student Registration</h1>
                    <p className="text-gray-600 mt-2">Add a new student to the system</p>
                </div>

                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                            <label
                                htmlFor="profilePic"
                                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 cursor-pointer shadow-md"
                                aria-label="Upload profile picture"
                            >
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
                        <p className="text-sm text-gray-500 mt-2">Upload profile picture (optional)</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="col-span-2 md:col-span-1">
                            <label htmlFor="name" className="block mb-2 font-medium text-gray-700">Full Name *</label>
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

                        {/* Class */}
                        <div className="col-span-2 md:col-span-1">
                            <label htmlFor="studentClass" className="block mb-2 font-medium text-gray-700">
                                Class *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MdClass className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    id="studentClass"
                                    name="studentClass"
                                    value={formData.studentClass}
                                    onChange={handleChange}
                                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none"
                                    required
                                >
                                    <option value="">Select Class</option>
                                    {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map((roman, index) => (
                                        <option key={index + 1} value={`BCA ${roman}`}>
                                            BCA {roman}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>


                        <div className="col-span-2 md:col-span-1">
                            <label className="block mb-2 font-medium text-gray-700">Section *</label>
                            <div className="flex space-x-4 bg-gray-50 p-3 rounded-lg border border-gray-300">
                                {['A', 'B', 'C'].map(section => (
                                    <label key={section} className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="section"
                                            value={section}
                                            checked={formData.section === section}
                                            onChange={handleChange}
                                            className="hidden"
                                            required
                                        />
                                        <div className={`rounded-full p-2 ${formData.section === section ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'} transition-all duration-200`}>
                                            {section}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Roll No. */}
                        <div className="col-span-2 md:col-span-1">
                            <label htmlFor="rollNum" className="block mb-2 font-medium text-gray-700">Roll No. *</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    id="rollNum"
                                    name="rollNum"
                                    value={formData.rollNum}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                    placeholder="Enter roll number"
                                    required
                                />
                            </div>
                        </div>





                        {/* Gender */}
                        <div className="col-span-2">
                            <label className="block mb-2 font-medium text-gray-700">Gender *</label>
                            <div className="flex space-x-4 bg-gray-50 p-3 rounded-lg border border-gray-300">
                                {['Male', 'Female', 'Other'].map(gender => (
                                    <label key={gender} className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={gender.toLowerCase()}
                                            checked={formData.gender.toLowerCase() === gender.toLowerCase()}
                                            onChange={handleChange}
                                            className="hidden"
                                            required
                                        />
                                        <div className={`rounded-full p-2 ${formData.gender.toLowerCase() === gender.toLowerCase() ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'} transition-all duration-200`}>
                                            {gender}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="col-span-2 md:col-span-1">
                            <label htmlFor="email" className="block mb-2 font-medium text-gray-700">Email *</label>
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
                                    placeholder="student@example.com"
                                    required
                                    pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                                />
                            </div>
                        </div>

                        {/* Password with toggle visibility */}
                        <div className="col-span-2 md:col-span-1">
                            <label htmlFor="password" className="block mb-2 font-medium text-gray-700">Password *</label>
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

                        {/* Phone Number */}
                        <div className="col-span-2 md:col-span-1">
                            <label htmlFor="phone" className="block mb-2 font-medium text-gray-700">Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaPhone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                    placeholder="+1 (123) 456-7890"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="col-span-2">
                            <label htmlFor="address" className="block mb-2 font-medium text-gray-700">Address</label>
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
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200 text-lg font-medium flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                    Processing...
                                </>
                            ) : (
                                'Register Student'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </SuperAdminLayout>
    );
}

export default AddStudent;