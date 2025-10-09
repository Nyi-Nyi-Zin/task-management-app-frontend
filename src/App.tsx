import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { AuthProvider } from "./providers/auth-provider";
import { SyncProvider } from "./providers/sync-provider";
import { routes } from "./lib/react-router/routes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <TooltipProvider>
        <AuthProvider>
          <SyncProvider>
            <Toaster />
            <Sonner />
            <RouterProvider router={routes} />
          </SyncProvider>
        </AuthProvider>
      </TooltipProvider>
    </Provider>
  </QueryClientProvider>
);

export default App;
