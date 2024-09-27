import { songs, dateInPST } from "../constants";

export const getTodaysSolution = (rightNowDate = new Date()) => {
  const msInDay = 86400000;
  // const todaysDate = new Date();
  const startDate = "September 5, 2024";
  const startDateInPST = dateInPST(new Date(startDate));
  console.log("todaysDateInPST", rightNowDate);
  console.log("startDateInPST", startDateInPST);
  let index = Math.floor(
    (rightNowDate.getTime() - startDateInPST.getTime()) / msInDay
  );
  console.log("index", index);
  let theSolution = songs[index % songs.length];
  console.log("theSolution", theSolution);
  if (theSolution.artist === "Selena Gomez & The Scene") {
    // go back one day
    index = index - 1;
    theSolution = songs[index % songs.length];
  }
  return theSolution;
};
