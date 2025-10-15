import { UseExcel } from 'interfaces/use-excel';
import { excel } from 'plugins/file/lib';
import { useEffect, useMemo, useState } from 'react';

export function useDownloadExcel({ currentTableRef, filename, sheet }: UseExcel) {
  const [payload, setPayload] = useState({} as UseExcel);

  useEffect(() => {
    setPayload({
      currentTableRef,
      filename,
      sheet
    });
  }, [currentTableRef, filename, sheet]);

  return useMemo(() => excel(payload), [payload]);
}
