export type TransactionType = "gasto" | "ingreso";

export type SheetType = "categories" | "payment-methods" | "date" | null;

export type SelectableItem = {
  id: number;
  name: string;
};

export function formatPrettyDate(date: Date): string {
  const formatted = date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
