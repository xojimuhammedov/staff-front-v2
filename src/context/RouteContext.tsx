import { createContext, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

const SearchParamsContext = createContext({});

export const SearchParamsProvider = ({ children }: any) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleClick = (value: string) => {
    searchParams.set('current-setting', value);
    setSearchParams(searchParams);
  };

  return (
    <SearchParamsContext.Provider value={{ searchParams, handleClick }}>
      {children}
    </SearchParamsContext.Provider>
  );
};

export const useSearchParamsContext = () => useContext(SearchParamsContext);
