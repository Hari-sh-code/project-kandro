import { createContext, useState } from "react";

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const [filter, setFilter] = useState(() => {
    const localFil = localStorage.getItem("localFil");
    return localFil ? JSON.parse(localFil) : 0;
  });

  const handleFilter = (val) => {
    setFilter(val);
    localStorage.setItem("localFil", JSON.stringify(val));
  };

  return (
    <DataContext.Provider value={{ filter, handleFilter }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
