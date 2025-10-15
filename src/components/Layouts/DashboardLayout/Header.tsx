import React from 'react';
import Navbar from './Navbar';

const Header = ({ setLoading }: any) => {
  return (
    <header className="flex h-full w-full items-center">
      <Navbar setLoading={setLoading} />
    </header>
  );
};

export default Header;
