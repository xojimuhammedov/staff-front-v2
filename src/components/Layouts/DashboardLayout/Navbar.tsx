import LogoSvg from 'assets/icons/LogoSvg';
import NavbarMenu from './NavbarMenu';
import NavbarToolbar from './NavbarToolbar';
import { Link } from 'react-router-dom';
import MenuButtonIcon from 'assets/icons/MenuButtonIcon';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { X } from 'lucide-react';
import NavMobileMenu from './NavMobileMenu';

const Navbar = ({ setLoading }: any) => {
  const [open, setOpen] = useState<any>(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

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
        <div className="navbar-menu-button">
          <div
            onClick={() => setOpen(true)}
            className="ml-8 flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-[8px] bg-[#FFF] p-[6px] shadow-[0px_0px_0px_1px_rgba(3,7,18,0.08),0px_1px_2px_-1px_rgba(3,7,18,0.08),0px_2px_4px_0px_rgba(3,7,18,0.04)]">
            <MenuButtonIcon />
          </div>
        </div>
      </nav>
      <Modal
        isOpen={open}
        className={
          'header-modal border-white-500 absolute right-0 h-screen w-[248px] flex-shrink-0 flex-col items-start gap-[32px] border bg-white p-[24px]'
        }
        contentLabel="Example Modal">
        <div className="flex items-center justify-between">
          <div className="mr-5 flex h-10 w-10 items-center justify-center rounded-m border-[1px] border-border-base bg-bg-base dark:border-dark-line dark:bg-bg-dark-bg">
            <Link to={'/'}>
              <LogoSvg width={24} height={24} />
            </Link>
          </div>
          <div className="cursor-pointer" onClick={() => setOpen(false)}>
            <X stroke="#9CA3AF" />
          </div>
        </div>
        <div className="mt-9">
          <NavMobileMenu setOpen={setOpen} />
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
