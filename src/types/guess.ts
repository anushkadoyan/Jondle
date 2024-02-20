import { Song } from "./song";

export type GuessType = {
  song: Song | undefined;
  state: GuessState | undefined;
};

export const enum GuessState {
  Correct = 0,
  PartiallyCorrect = 1,
  Incorrect = 2,
  Skipped = 3,
}
