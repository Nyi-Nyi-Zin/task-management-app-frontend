import { useState } from "react";
import { SyncContext } from "@/contexts/sync-context";

interface SyncProviderProps {
  children: React.ReactNode;
}
export const SyncProvider = ({ children }: SyncProviderProps) => {
  const [isSyncing, setIsSyncing] = useState(false);

  return (
    <SyncContext.Provider value={{ isSyncing, setIsSyncing }}>{children}</SyncContext.Provider>
  );
};
