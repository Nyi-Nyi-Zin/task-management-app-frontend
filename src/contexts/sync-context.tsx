import { createContext } from "react";

interface SyncContextType {
  isSyncing: boolean;
  setIsSyncing: (syncing: boolean) => void;
}

export const SyncContext = createContext<SyncContextType | undefined>(undefined);
