import Dashboard from "../../../pages/Dashboard/Dashboard"
import Report from "../../../pages/Report/Report"

const routes = [
    {
        path: "/",
        exact: true,
        element: <Dashboard />,
    },
    {
        path: "/Report",
        exact: true,
        element: <Report />,
    },
]

export default routes