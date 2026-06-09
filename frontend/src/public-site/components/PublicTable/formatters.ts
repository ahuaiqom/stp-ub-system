/**
 * Display formatters used by the public-site tables.
 */

export const formatMasaTanam = (bulan: number, perTahun: number): string => {
  if (!bulan && !perTahun) return "-";
  const kali = perTahun ? `${perTahun}x Setahun` : "";
  return `Setiap ${bulan} Bulan${kali ? ` (${kali})` : ""}`;
};

export const formatSiklus = (bulan: number, perTahun: number): string =>
  formatMasaTanam(bulan, perTahun);

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export const formatMonth = (iso: string): string => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return MONTHS[d.getMonth()];
};

export const formatLuas = (m2: number): string => `${m2} m2`;

export const padRows = <T,>(items: T[], minRows: number): (T | null)[] => {
  if (items.length >= minRows) return items;
  const fillers = Array.from({ length: minRows - items.length }, () => null);
  return [...items, ...fillers];
};
