import dayjs from "dayjs";

type DraftParams = {
    startDate?: string;
    endDate?: string;
    employeeIds: number[];
    organizationId: number;
};

export function uniqSorted(nums: number[]) {
    return Array.from(new Set(nums)).sort((a, b) => a - b);
}

export function readEmployeeIds(sp: URLSearchParams): number[] {
    // Sizda bracketsiz format ishlatyapti: employeeIds=1&employeeIds=2
    const a = sp.getAll("employeeIds").map(Number).filter(Number.isFinite);

    // ehtiyot uchun: employeeIds[]=1&employeeIds[]=2 bo‘lib qolgan bo‘lsa
    const b = sp.getAll("employeeIds[]").map(Number).filter(Number.isFinite);

    return uniqSorted([...a, ...b]);
}

export function readDraftFromSearchParams(sp: URLSearchParams): DraftParams {
    const startDate = sp.get("startDate") ?? undefined;
    const endDate = sp.get("endDate") ?? undefined;
    const organizationId = sp.get("organizationId") ?? undefined;

    return {
        startDate,
        endDate,
        employeeIds: readEmployeeIds(sp),
        organizationId: organizationId as unknown as number,
    };
}

export function toPickerRange(start?: string, end?: string) {
    // MyTailwindPicker nimani kutishini sizning komponentingiz belgilaydi.
    // Odatda Date yoki string bo‘lishi mumkin. Sizning FormValues: string | Date.
    return {
        startDate: start ? dayjs(start, "YYYY-MM-DD").toDate() : undefined,
        endDate: end ? dayjs(end, "YYYY-MM-DD").toDate() : undefined,
    };
}
