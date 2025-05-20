import { BookOpen, AlertTriangle, Award, Check, Clock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getActivity } from "../Redux/Slices/AuthSlice";
import { useEffect } from "react";

function Action() {
    const dispatch = useDispatch();

    const activity = useSelector(state => state.auth.activityData?.activities); // ✅ Get data from Redux state
    console.log(" Activities from API:", activity);

    useEffect(() => {
        dispatch(getActivity()); // ✅ Dispatch the action as a function
    }, [dispatch]);

    // Icon helper based on type
    const getActivityIcon = (type) => {
        if (type.toLowerCase().includes("assignment")) return <BookOpen color="green" size={20} />;
        if (type.toLowerCase().includes("warning")) return <AlertTriangle color="green" size={20} />;
        if (type.toLowerCase().includes("participation")) return <Award color="green" size={20} />;
        if (type.toLowerCase().includes("attendance")) return <Check color="green" size={20} />;

        return <Award color="green" size={20} />;
    };

    return (
        <div className="mt-8">
            <div className="flex items-center mb-4">
                <Clock className="mr-2 text-gray-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
            </div>

            {activity?.length > 0 ? (
                activity.map((act, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border-b">
                        <div className="flex items-center">
                            {getActivityIcon(act?.activity)}
                            <div className="ml-3">
                                <p className="font-medium">{act?.activity}</p>
                                <p className="text-sm text-gray-500">{new Date(act?.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        {/* ✅ If you have points in API response */}
                        {act.points && (
                            <span className="text-green-600 font-medium">
                                {act?.points}
                            </span>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No recent activities found.</p>
            )}
        </div>
    );
}

export default Action;
