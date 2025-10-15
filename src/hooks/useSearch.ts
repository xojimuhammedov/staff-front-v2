import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export function useSearch(paramName: string = "search") {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState<string>(searchParams.get(paramName) || "");

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set(paramName, search);
      params.set("page", "1");
    } else {
      params.delete(paramName);
    }
    setSearchParams(params);
  }, [search, searchParams, paramName, setSearchParams]);

  return {
    search,
    setSearch,
    handleSearch,
  };
}
