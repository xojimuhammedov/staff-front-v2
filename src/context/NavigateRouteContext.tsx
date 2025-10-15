import { createContext, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

const NavigateParamsContext = createContext({});

export const NavigateParamsProvider = ({ children }: any) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleClick = (value: string) => {
    searchParams.set('navigate', value);
    setSearchParams(searchParams);
  };

  return (
    <NavigateParamsContext.Provider value={{ searchParams, handleClick }}>
      {children}
    </NavigateParamsContext.Provider>
  );
};

export const useNavigateParamsProvider = () => useContext(NavigateParamsContext);
