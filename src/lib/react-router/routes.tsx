import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthPage } from "@/pages/auth/AuthPage";
import { BoardPage } from "@/pages/BoardPage";
import Index from "@/pages/Index";
import { createBrowserRouter } from "react-router-dom";

export const routes = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
    ),
    // errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <BoardPage />,
      },
      // {
      //   path: "/items",
      //   element: <ItemsPage />,
      // },

      // {
      //   path: "*",
      //   element: <NotFoundPage />,
      // },
    ],
  },
]);
