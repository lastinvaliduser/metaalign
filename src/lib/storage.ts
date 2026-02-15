import type { AnalysisRecord } from "@/types";

const STORAGE_KEY = "metaalign-history";
const MAX_RECORDS = 20;

export function getHistory(): AnalysisRecord[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw) as AnalysisRecord[];
    } catch {
        return [];
    }
}

export function saveRecord(record: AnalysisRecord): void {
    if (typeof window === "undefined") return;
    try {
        const history = getHistory();
        const existingIndex = history.findIndex((r) => r.id === record.id);
        if (existingIndex >= 0) {
            history[existingIndex] = record;
        } else {
            history.unshift(record);
        }
        // FIFO eviction
        const trimmed = history.slice(0, MAX_RECORDS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
        // Storage full or unavailable — fail silently
    }
}

export function clearHistory(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
}
