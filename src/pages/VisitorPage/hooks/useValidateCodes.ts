import { useQuery } from "@tanstack/react-query";
import { request } from "services/request";

type ValidateResult = {
    ok: boolean;
    data?: any;      // API qaytaradigan data
    error?: string;  // xatolik bo'lsa
};

export const useValidateCodes = (codes: string[]) => {
    return useQuery<Record<string, ValidateResult>>({
        queryKey: ["validate-onetime-codes", codes], // codes o'zgarsa qayta ishlaydi
        enabled: codes.length > 0,

        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,

        queryFn: async () => {
            const entries = await Promise.allSettled(
                codes.map(async (code) => {
                    const res = await request.get(`/api/v1/onetime-codes/validate/${code}`);
                    return [code, { ok: true, data: res.data }] as const;
                })
            );

            const map: Record<string, ValidateResult> = {};

            for (let i = 0; i < entries.length; i++) {
                const code = codes[i];

                const e = entries[i];
                if (e.status === "fulfilled") {
                    const [, value] = e.value;
                    map[code] = value;
                } else {
                    const msg =
                        (e.reason?.response?.data?.message as string) ||
                        (e.reason?.message as string) ||
                        "Validate failed";
                    map[code] = { ok: false, error: msg };
                }
            }

            return map;
        },
    });
};
