import LogoSvg from 'assets/icons/LogoSvg';
import NavbarMenu from './NavbarMenu';
import NavbarToolbar from './NavbarToolbar';
import { Link } from 'react-router-dom';
import { NavMenuModal } from './NavMenuModal';

const Navbar = ({ setLoading }: any) => {

  return (
    <>
      <nav className="flex h-full w-full items-center">
        <div className="mr-5 flex h-10 w-10 items-center justify-center rounded-m border-[1px] border-border-base bg-bg-base dark:border-dark-line dark:bg-bg-dark-bg">
          <Link to={'/'}>
            <LogoSvg width={24} height={24} />
          </Link>
        </div>
        <NavbarMenu />
        <NavbarToolbar setLoading={setLoading} />
        <NavMenuModal />
      </nav>
    </>
  );
};

export default Navbar;
