import React, { useState } from "react";

import { Song } from "../../types/song";
import { GuessType } from "../../types/guess";
import { scoreToEmoji } from "../../helpers";

import { Button } from "../Button";
import { MiniYouTubePlayer } from "../MiniYouTubePlayer";

import * as Styled from "./index.styled";
import { theme } from "../../constants";
import { Footer } from "../Footer";

interface SolutionProps {
  didGuess: boolean;
  currentTry: number;
  todaysSolution: Song;
}

function Solution({ didGuess, todaysSolution, currentTry }: SolutionProps) {
  return (
    <>
      <Styled.SongTitle>
        {todaysSolution.artist} - {todaysSolution.name}
      </Styled.SongTitle>
      {didGuess && (
        <Styled.Tries>
          You guessed it in {currentTry} {currentTry === 1 ? "try" : "tries"}.
        </Styled.Tries>
      )}
      <MiniYouTubePlayer id={todaysSolution.youtubeId} />
      {todaysSolution.jonYoutubeId ? (
        <MiniYouTubePlayer id={todaysSolution.jonYoutubeId} />
      ) : null}
    </>
  );
}

interface ShareButtonProps {
  guesses: GuessType[];
  variant?: keyof typeof theme;
}

function ShareButton({ guesses, variant }: ShareButtonProps) {
  const result = scoreToEmoji(guesses);
  const [buttonText, setButtonText] = useState("Share Results");
  const handleClick = React.useCallback(() => {
    // The Windows share sheet is dumb and doesn't have a copy function.
    const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];
    const onWindows =
      windowsPlatforms.indexOf(window.navigator.platform) !== -1;
    if (navigator.share !== undefined && !onWindows) {
      navigator.share({ text: result });
    } else if (navigator.clipboard !== undefined) {
      navigator.clipboard.writeText(result);
      setButtonText("Copied!");
    } else {
      setButtonText("Failed to open share menu or copy");
    }
  }, [guesses]);

  return (
    <>
      <Button onClick={handleClick} variant={variant}>
        {buttonText}
      </Button>
    </>
  );
}

interface Props {
  didGuess: boolean;
  currentTry: number;
  todaysSolution: Song;
  guesses: GuessType[];
}

// variations of "you lost", but cheeky
const loseMessages = [
  "You lost",
  "Better luck next time",
  "You were so close",
  "Next time for sure",
  "Not today, pal",
  "You're not that guy, pal",
  "Nice try",
];
export function Result({
  didGuess,
  todaysSolution,
  guesses,
  currentTry,
}: Props) {
  const hoursToNextDay = Math.floor(
    (new Date(new Date().setHours(24, 0, 0, 0)).getTime() -
      new Date().getTime()) /
      1000 /
      60 /
      60
  );

  // random message if you lose
  const loseMessage =
    loseMessages[Math.floor(Math.random() * loseMessages.length)];

  if (didGuess) {
    const textForTry = [
      "Perfect!",
      "Wow!",
      "Super!",
      "Congrats!",
      "Nice!",
      "Yay!",
    ];
    return (
      <>
        <Styled.ResultTitle>{textForTry[currentTry - 1]}</Styled.ResultTitle>
        <Solution
          todaysSolution={todaysSolution}
          didGuess={didGuess}
          currentTry={currentTry}
        />
        <ShareButton guesses={guesses} variant="green" />
        <Styled.TimeToNext>
          Remember to come back in {hoursToNextDay} hours!
        </Styled.TimeToNext>
        <Footer />
      </>
    );
  } else {
    return (
      <>
        <Styled.ResultTitle>{loseMessage}</Styled.ResultTitle>
        <Solution
          todaysSolution={todaysSolution}
          didGuess={didGuess}
          currentTry={currentTry}
        />
        <ShareButton guesses={guesses} variant="red" />
        <Styled.TimeToNext>
          Try again in {hoursToNextDay} hours.
        </Styled.TimeToNext>
        <Footer />
      </>
    );
  }
}
