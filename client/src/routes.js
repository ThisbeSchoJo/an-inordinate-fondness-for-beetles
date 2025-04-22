import App from "./components/App";
import Home from "./components/Home";
import Sighting from "./components/Sighting";
import Species from "./components/Species";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ErrorPage from "./components/ErrorPage";


const routes = [
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/sightings",
                element: <Sighting />
            },
            {
                path: "/species",
                element: <Species />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/signup",
                element: <Signup />
            }
        ]
    }
]

export default routes;