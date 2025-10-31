import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Navbar as MTNavbar,
  Collapse,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import logoEskom from '/src/assets/img/logo01.png';

export function Navbar({ brandName, routes, action }) {
  const [openNav, setOpenNav] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {routes.map(({ name, path, icon }) => (
        <Typography
          key={name}
          as="li"
          variant="small"
          color="blue-gray"
          className="capitalize"
        >
          <Link 
            to={path} 
            className="flex items-center gap-1 p-1 font-normal hover:text-blue-800 transition-colors"
          >
            {icon &&
              React.createElement(icon, {
                className: "w-[18px] h-[18px] opacity-50 mr-1",
              })}
            {name}
          </Link>
        </Typography>
      ))}
    </ul>
  );

  return (
    <div className="min-h-[96px] bg-gradient-to-br from-blue-50 to-blue-100">
      <MTNavbar className="p-3 max-w-full rounded-none border-none shadow-none bg-transparent">
        <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
          <Link to="/">
            <div className="flex items-center">
              <img src={logoEskom} alt="Logo" className="h-12 mr-2" />
              <Typography
                variant="h5"
                className="cursor-pointer py-1.5 font-bold text-blue-800"
              >
                {brandName}
              </Typography>
            </div>
          </Link>
          <div className="hidden lg:block">{navList}</div>
          <div className="hidden lg:flex gap-2">
            {React.cloneElement(action, {
              className: "hidden lg:inline-block",
            })}
          </div>
          <IconButton
            variant="text"
            size="sm"
            className="ml-auto text-blue-800 hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <XMarkIcon strokeWidth={2} className="h-6 w-6" />
            ) : (
              <Bars3Icon strokeWidth={2} className="h-6 w-6" />
            )}
          </IconButton>
        </div>
        <Collapse open={openNav}>
          <div className="container mx-auto bg-white rounded-lg shadow-lg p-4 mt-2">
            {navList}
            <div className="flex flex-col gap-2 mt-4">
              {React.cloneElement(action, {
                className: "w-full",
              })}
            </div>
          </div>
        </Collapse>
      </MTNavbar>
    </div>
  );
}

Navbar.defaultProps = {
  brandName: "Eskom Expo",
  action: (
    <div className="flex gap-2">
      <Link to="/auth/sign-in">
        <Button variant="outlined" color="blue" size="sm" fullWidth>
          Login
        </Button>
      </Link>
      <Link to="/auth/select-user-register">
        <Button variant="gradient" color="blue" size="sm" fullWidth>
          Register
        </Button>
      </Link>
    </div>
  ),
};

Navbar.propTypes = {
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  action: PropTypes.node,
};

Navbar.displayName = "/src/widgets/layout/navbar.jsx";

export default Navbar;