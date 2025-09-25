import { Outlet, useLocation } from "react-router-dom";
import Nav from "../components/Nav";

const Main = () => {
  const location = useLocation();

  const hideNavbarPaths = ["/login", "/register"];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <section className="mx-auto min-h-screen w-full ">
      {!shouldHideNavbar && <Nav />}
      <Outlet />
    </section>
  );
};

export default Main;
