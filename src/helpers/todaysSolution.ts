import { songs, startDate } from "../constants";

// const epochMs = new Date(2022, 3, 10).valueOf();
// const now = Date.now();
// const index = Math.floor((now - epochMs) / msInDay);

export const getTodaysSolution = () => {
  const msInDay = 86400000;
  const todaysDate = new Date();

  const index = Math.floor(
    (todaysDate.getTime() - startDate.getTime()) / msInDay
  );
  return songs[(index % songs.length) + 1];
};
