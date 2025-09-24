import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.tsx";
import App from "./App.jsx";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { PersistGate } from "redux-persist/integration/react";

const persistor = persistStore(store);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
