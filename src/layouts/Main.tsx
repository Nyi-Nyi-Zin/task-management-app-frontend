import { Outlet, useLocation } from "react-router-dom";
import Nav from "../components/Nav";

const Main = () => {
  const location = useLocation();
  const hideNavbarPaths = ["/login", "/register"];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <section className="flex flex-col min-h-screen">
      {!shouldHideNavbar && <Nav />}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </section>
  );
};

export default Main;
