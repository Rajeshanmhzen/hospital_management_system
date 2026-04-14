import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import DashboardPage from "../pages/dashboard";
import TenantPage from "../pages/tenant";
import InquiryPage from "../pages/inquiry";
import SusbcriptionPage from "../pages/subscription";
import PricingPlanPage from "../pages/pricingPlan";

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
                    },
                    {
                        path: "inquiry",
                        element: <InquiryPage />,
                    },
                    {
                        path: "subscriptions",
                        element: <SusbcriptionPage />,
                    },
                    {
                        path: "pricing-plans",
                        element: <PricingPlanPage />,
                    },
                ]
            },
        ],
    },
]);

export default router;