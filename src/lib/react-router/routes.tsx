import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ROUTES } from "@/config/routes";
import { AuthPage } from "@/pages/auth/AuthPage";
import { BoardPageWrapper } from "@/pages/BoardPageWrapper";
import { BoardsPage } from "@/pages/BoardsPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

export const AppRouter = () => {
  const router = createBrowserRouter([
    {
      path: ROUTES.AUTH,
      element: <AuthPage />,
    },
    {
      path: ROUTES.HOME,
      element: (
        <ProtectedRoute>
          <BoardsPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/boards/:id",
      element: (
        <ProtectedRoute>
          <BoardPageWrapper />
        </ProtectedRoute>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
};
