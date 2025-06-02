import App from "./components/App";
import Home from "./components/Home";
import Profile from "./components/Profile";
import FriendProfile from "./components/FriendProfile";
import Sighting from "./components/Sighting";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ErrorPage from "./components/ErrorPage";
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
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/:userId",
        element: (
          <ProtectedRoute>
            <FriendProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
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
