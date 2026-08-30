/**
 * Ét sted for de tal der ellers ville stå hardcodet rundt omkring og blive
 * forkerte med tiden. Årstallet regnes ud, så heroen aldrig underdriver.
 */
export const CAREER_START = "2021-04-01";

export function yearsOfExperience(from: string = CAREER_START) {
  const start = new Date(from);
  const now = new Date();
  const months =
    (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  return Math.floor(months / 12);
}
