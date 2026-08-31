import { mkdir, readFile, writeFile } from "node:fs/promises";

const streakStartDate = "2023-01-23";
const generatedPath = "generated/streak.tex";

function daysBetweenUtc(startDate, endDate) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const start = Date.UTC(
    startDate.getUTCFullYear(),
    startDate.getUTCMonth(),
    startDate.getUTCDate(),
  );
  const end = Date.UTC(
    endDate.getUTCFullYear(),
    endDate.getUTCMonth(),
    endDate.getUTCDate(),
  );

  return Math.floor((end - start) / millisecondsPerDay);
}

const today = process.env.STREAK_TODAY
  ? new Date(`${process.env.STREAK_TODAY}T00:00:00Z`)
  : new Date();
const start = new Date(`${streakStartDate}T00:00:00Z`);
const streakDays = daysBetweenUtc(start, today) + 1;

if (!Number.isInteger(streakDays) || streakDays < 1) {
  throw new Error(`Invalid streak day count calculated from ${streakStartDate}`);
}

const contents = `\\newcommand{\\duolingoStreakDays}{${streakDays}}\n`;

await mkdir("generated", { recursive: true });

let existing = "";
try {
  existing = await readFile(generatedPath, "utf8");
} catch {
  // The generated file may not exist yet.
}

if (existing !== contents) {
  await writeFile(generatedPath, contents);
}
