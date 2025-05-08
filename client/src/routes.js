import App from "./components/App";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Sighting from "./components/Sighting";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ErrorPage from "./components/ErrorPage";
import FireflyObservations from "./components/FireflyObservations";
import ProtectedRoute from "./components/ProtectedRoute";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      // {
      //   path: "/firefly-observations",
      //   element: <FireflyObservations />,
      // },
      {
        path: "/sightings",
        element: (
          <ProtectedRoute>
            <Sighting />
          </ProtectedRoute>
        ),
      },
    ],
  },
];

export default routes;
