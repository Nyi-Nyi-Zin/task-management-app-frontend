import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ROUTES } from "@/config/routes";
import { AuthPage } from "@/pages/auth/AuthPage";
import BoardDetailPage from "@/pages/board/Index";
import { Home } from "@/pages/Index";
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
          <Home />
        </ProtectedRoute>
      ),
    },
    {
      path: "/boards/:id",
      element: (
        <ProtectedRoute>
          <BoardDetailPage />
        </ProtectedRoute>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
};
