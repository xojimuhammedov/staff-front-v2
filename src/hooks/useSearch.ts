import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "./useDebounce";

export function useSearch(paramName: string = "search") {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState<string>(searchParams.get(paramName) || "");

  const debouncedSearch = useDebounce(search, 500);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      params.set(paramName, debouncedSearch);
      params.set("page", "1");
    } else {
      params.delete(paramName);
    }
    setSearchParams(params);
  }, [debouncedSearch, searchParams, paramName, setSearchParams]);

  return {
    search,
    setSearch,
    handleSearch,
    debouncedSearch, // kerak bo‘lsa tashqarida ham ishlatishingiz mumkin
  };
}
