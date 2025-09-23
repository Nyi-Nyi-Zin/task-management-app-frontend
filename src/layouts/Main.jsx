import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";

const Main = () => {
  return (
    <section className="mx-auto min-h-screen w-full overflow-y-hidden  bg-green-100">
      <Nav />
      <Outlet />
    </section>
  );
};

export default Main;
