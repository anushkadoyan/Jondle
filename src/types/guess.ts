import { Song } from "./song";

export type GuessType = {
  song: Song | undefined;
  state: GuessState | undefined;
};

export const enum GuessState {
  Correct = "Correct",
  PartiallyCorrect = "PartiallyCorrect",
  Incorrect = "Incorrect",
  Skipped = "Skipped",
}
