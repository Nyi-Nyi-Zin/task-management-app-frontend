import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store";
import { AuthProvider } from "./providers/auth-provider";
import { SyncProvider } from "./providers/sync-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AppRouter } from "@/lib/react-router/routes";

const queryClient = new QueryClient();

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <TooltipProvider>
        <AuthProvider>
          <SyncProvider>
            <Toaster />
            <Sonner />
            <AppRouter />
          </SyncProvider>
        </AuthProvider>
      </TooltipProvider>
    </Provider>
  </QueryClientProvider>
);

export default App;
