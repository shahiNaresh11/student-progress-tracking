import { BookOpen, AlertTriangle, Award, Check, Clock } from "lucide-react";

function Action() {
    const student = {
        recentActivity: [
            { type: "Late Assignment", date: "2024-03-10", points: 5 },
            { type: "Behavioral Warning", date: "2024-03-08", points: 3 },
            { type: "Science Fair Participation", date: "2024-03-05", points: 10 },
            { type: "late assignment", date: "2024-03-05", points: +20 }

        ]
    };

    // This function should be outside the student object
    const getActivityIcon = (type) => {
        if (type.includes("Assignment") || type.includes("assignment")) return <BookOpen color="green" size={20} />;
        if (type.includes("Warning") || type.includes("warning")) return <AlertTriangle color="green" size={20} />;
        if (type.includes("Participation") || type.includes("participation")) return <Award color="green" size={20} />;
        if (type.includes("Attendance") || type.includes("attendance")) return <Check color="green" size={20} />;

        return <Award color="green" size={20} />;
    };




    return (
        <div className="mt-8">
            <div className="flex items-center mb-4">
                <Clock className="mr-2 text-gray-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
            </div>

            {student.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border-b">
                    <div className="flex items-center">
                        {getActivityIcon(activity.type)}
                        <div className="ml-3">
                            <p className="font-medium">{activity.type}</p>
                            <p className="text-sm text-gray-500">{activity.date}</p>
                        </div>
                    </div>
                    <span className="text-green-600 font-medium">+{activity.points}</span>
                </div>
            ))}
        </div>
    );
}

export default Action;
