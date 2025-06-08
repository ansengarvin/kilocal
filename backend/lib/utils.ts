export function isDate(date: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
    return dateRegex.test(date);
}

export function isNumericID(value: string): boolean {
    const numericIDRegex = /^\d+$/; // Ensure it is a number
    return numericIDRegex.test(value);
}

export function isNumber(value: unknown): boolean {
    return typeof value === "number" && !isNaN(value);
}
