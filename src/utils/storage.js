// localStorage mit Fehlerbehandlung (z. B. privater Modus oder blockierter Speicher)
export const load = (key, fallback) => {
    try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
    } catch {
        return fallback;
    }
};

export const save = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        /* Speicher nicht verfügbar */
    }
};
