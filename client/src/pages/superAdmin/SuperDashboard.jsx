import SuperAdminLayout from "../../Layouts/SuperAdminLayout";

function SuperDashboard() {
    return (

        <SuperAdminLayout>
            <main className="flex-1 overflow-auto p-6 bg-gray-100">

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-4">Welcome to Superadmin Dashboard</h3>
                    <p className="text-gray-600">Select an option from the sidebar to manage students or teachers.</p>
                </div>


            </main>

        </SuperAdminLayout>


    );
}
export default SuperDashboard;