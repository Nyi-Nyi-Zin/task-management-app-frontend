import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "./layouts/Main";

import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import AuthProvider from "./providers/AuthProvider";
import Profile from "./pages/profile/Index";
import Board from "./pages/profile/Board";
import ErrorPage from "./pages/ErrorPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Main />,
      children: [
        {
          index: true,
          element: (
            <AuthProvider>
              <Profile />
            </AuthProvider>
          ),
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/profile",
          element: (
            <AuthProvider>
              <Profile />
            </AuthProvider>
          ),
        },
        {
          path: "/board/:boardId",
          element: (
            <AuthProvider>
              <Board />
            </AuthProvider>
          ),
        },

        {
          path: "*",
          element: <ErrorPage />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
