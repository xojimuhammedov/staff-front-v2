import { useCallback, useEffect, useMemo, useState } from "react";

export interface Employee {
    id: number;
    name: string;
    avatar?: string;
}

export function useEmployeeSelection(employees: Employee[], initialSelectedIds: number[] = []) {

    const [tempSelectedIds, setTempSelectedIds] = useState<number[]>([]);
    const [finalSelectedIds, setFinalSelectedIds] = useState<number[]>(initialSelectedIds);
    const [selectedDeviceTypes, setSelectedDeviceTypes] = useState<string[]>([]);

    // === FIRST LOAD (UPDATE MODE) ===
    useEffect(() => {
        setFinalSelectedIds(initialSelectedIds);
    }, [initialSelectedIds]);

    // === TEMP TOGGLE ===
    const toggleTempSelect = useCallback((id: number) => {
        setTempSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    }, []);

    // === SELECT ALL ===
    const toggleSelectAll = useCallback(() => {
        setTempSelectedIds(prev =>
            prev.length === employees.length ? [] : employees.map(e => e.id)
        );
    }, [employees]);

    // === ADD TO FINAL ===
    const addSelectedToFinal = useCallback((deviceTypes: string[]) => {
        if (!tempSelectedIds.length) return;

        setFinalSelectedIds(prev =>
            Array.from(new Set([...prev, ...tempSelectedIds]))
        );

        setSelectedDeviceTypes(deviceTypes);
        setTempSelectedIds([]);
    }, [tempSelectedIds]);

    // === REMOVE FROM FINAL ===
    const removeFromFinal = useCallback((id: number) => {
        setFinalSelectedIds(prev => prev.filter(x => x !== id));
    }, []);

    // === FINAL EMPLOYEE LIST ===
    const finalEmployees = useMemo(
        () => employees.filter(e => finalSelectedIds.includes(e.id)),
        [employees, finalSelectedIds]
    );

    // === LEFT EMPLOYEE LIST ===
    const leftEmployees = useMemo(() => {
        const selected = new Set(finalSelectedIds);
        return employees.filter(e => !selected.has(e.id));
    }, [employees, finalSelectedIds]);

    return {
        tempSelectedIds,
        finalSelectedIds,
        selectedDeviceTypes,

        toggleTempSelect,
        toggleSelectAll,
        addSelectedToFinal,
        removeFromFinal,

        setSelectedDeviceTypes,

        finalEmployees,
        leftEmployees,
    };
}
