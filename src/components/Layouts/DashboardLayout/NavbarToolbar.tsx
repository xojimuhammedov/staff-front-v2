import MoonSvg from 'assets/icons/MoonSvg';
import ProfileWidget from './ProfileWidget';
import { Sun } from 'lucide-react';
import { useDarkMode } from 'context/DarkLightContext';
import storage from 'services/storage';
import RusImg from '../../../assets/icons/russian.png';
import EnglishImg from '../../../assets/icons/english.png';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const languageData = [
  {
    id: 1,
    value: 'ru',
    title: 'Русский',
    image: RusImg
  },
  {
    id: 2,
    value: 'en',
    title: 'English',
    image: EnglishImg
  }
];

const NavbarToolbar = ({ setLoading }: any) => {
  const { i18n } = useTranslation();
  const darkLight = storage.get('theme');
  const [isOpen, setIsOpen] = useState(false);
  const { toggleTheme, darkMode }: any = useDarkMode();
  const handleLanguage = (value: string) => {
    setLoading(true); // Loading state true qilib qo'yiladi

    setTimeout(() => {
      i18n.changeLanguage(value); // Til o'zgaradi
      setLoading(false); // 2 sekunddan keyin loading o'chadi
    }, 1000);
  };
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleOptionClick = () => {
    setIsOpen(false);
  };

  const languageTitle = i18n.language === 'ru' ? 'Русский' : 'English';
  const i18nData = languageData.filter((item: any) => item.title !== languageTitle);

  return (
    <div ref={dropdownRef} className="ml-auto flex flex-row items-center gap-5">
      <div className="flex  cursor-pointer items-center justify-center rounded-xl shadow-base">
        <div
          onClick={(event) => {
            toggleDropdown();
            event.preventDefault();
          }}
          className="flex items-center gap-2 px-[10px] py-[4px]">
          <img
            src={i18n.language === 'ru' ? RusImg : EnglishImg}
            className="h-6 w-6 rounded-full"
            alt=""
          />
          <p className="font-medium dark:text-subtext-color-dark">{languageTitle}</p>
        </div>
      </div>
      {isOpen && (
        <ul className="shadow-gray-150 absolute	top-14 flex w-28  flex-col items-baseline bg-white shadow-md dark:bg-bg-dark-bg dark:bg-bg-dark-bg">
          {i18nData?.map((evt: any, index: number) => (
            <li
              onClick={() => {
                handleLanguage(evt.value);
                handleOptionClick();
              }}
              className="flex w-full cursor-pointer items-center gap-2 px-2 py-[6px] transition duration-200 hover:bg-gray-100 dark:hover:bg-black"
              key={index}>
              <img src={evt.image} className="h-6 w-6 rounded-full" alt="" />
              <p className="font-medium dark:text-subtext-color-dark">{evt.title}</p>
            </li>
          ))}
        </ul>
      )}
      {/* <div
        onClick={() => toggleTheme()}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl shadow-base">
        {darkLight === 'dark' ? <Sun stroke="#696E77" /> : <MoonSvg />}
      </div> */}
      <ProfileWidget />
    </div>
  );
};

export default NavbarToolbar;
