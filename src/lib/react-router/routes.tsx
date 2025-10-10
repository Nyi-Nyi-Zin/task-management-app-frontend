// AppRouter.tsx
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthPage } from "@/pages/auth/AuthPage";
import { BoardsPage } from "@/pages/BoardsPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

export const AppRouter = () => {
  const router = createBrowserRouter([
    {
      path: "/auth",
      element: <AuthPage />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <BoardsPage />
        </ProtectedRoute>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
};
