export type ClassValue = string | false | null | undefined;

/** 合併 class 名稱，略過空值。 */
export function cx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}

export type Density = "student" | "teacher";

export function densityClass(density?: Density): string | undefined {
  return density ? `pc-density-${density}` : undefined;
}
