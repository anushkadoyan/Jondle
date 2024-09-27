export const dateInPST = (date: Date) =>
  new Date(
    date.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    })
  );

export const startDate = new Date(
  new Date("September 5, 2024").toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
  })
);

console.log(startDate);
