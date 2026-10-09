import { dicts, type Lang } from "~~/i18n/dict";

export function serviceLabels(lang: Lang): Record<string, string> {
  return dicts[lang].serviceLabels;
}

export function sectorLabels(lang: Lang): Record<string, string> {
  return dicts[lang].sectorLabels;
}

export function candidateSectors(lang: Lang): string[] {
  return dicts[lang].candidateSectors;
}

export function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
