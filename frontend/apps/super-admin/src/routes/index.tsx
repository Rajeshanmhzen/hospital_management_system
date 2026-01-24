import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import DashboardPage from "../pages/dashboard";
import TenantPage from "../pages/tenant";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <DashboardLayout />,
                children: [
                    {
                        index: true,
                        element: <DashboardPage />,
                    },
                    {
                        path: "tenants",
                        element: <TenantPage />,
                    }
                ]
            },
        ],
    },
]);

export default router;