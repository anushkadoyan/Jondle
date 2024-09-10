import React from "react";
import YouTube from "react-youtube";
import { IoPlay } from "react-icons/io5";

import { playTimes } from "../../constants";

import * as Styled from "./index.styled";

interface Props {
  id: string;
  currentTry: number;
}

export function Player({ id, currentTry }: Props) {
  const opts = {
    width: "0",
    height: "0",
  };

  // react-youtube doesn't export types for this
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = React.useRef<any>(null);

  const currentPlayTime = playTimes[currentTry];

  const [play, setPlay] = React.useState<boolean>(false);

  const [currentTime, setCurrentTime] = React.useState<number>(0);

  const [isReady, setIsReady] = React.useState<boolean>(false);

  React.useEffect(() => {
    setInterval(() => {
      playerRef.current?.internalPlayer
        .getCurrentTime()
        .then((time: number) => {
          setCurrentTime(time);
        });
    }, 250);
  }, []);

  React.useEffect(() => {
    if (play) {
      if (currentTime * 1000 >= currentPlayTime) {
        playerRef.current?.internalPlayer.pauseVideo();
        playerRef.current?.internalPlayer.seekTo(0);
        setPlay(false);
      }
    }
  }, [play, currentTime]);

  // don't call play video each time currentTime changes
  const startPlayback = React.useCallback(() => {
    playerRef.current?.internalPlayer.playVideo();
    setPlay(true);
  }, []);

  const setReady = React.useCallback(() => {
    setIsReady(true);
  }, []);

  const progressWidth = (currentTime / 50) * 105;

  return (
    <>
      <YouTube opts={opts} videoId={id} onReady={setReady} ref={playerRef} />
      {isReady ? (
        <>
          <Styled.ProgressBackground>
            {currentTime !== 0 && <Styled.Progress value={progressWidth} />}
            {playTimes.map((playTime, i) => (
              <Styled.Separator
                style={
                  playTime !== -1
                    ? {
                        left: `${(playTime / 50000) * 100}%`,
                        backgroundColor: currentTry === i ? "green" : "gray",
                        width: currentTry === i ? "5px" : "1px",
                      }
                    : {}
                }
                key={playTime}
              />
            ))}
          </Styled.ProgressBackground>
          <Styled.TimeStamps>
            <Styled.TimeStamp>1s</Styled.TimeStamp>
            <Styled.TimeStamp>50s</Styled.TimeStamp>
          </Styled.TimeStamps>
          <IoPlay
            style={{ cursor: "pointer" }}
            size={40}
            color="#fff"
            onClick={startPlayback}
          />
        </>
      ) : (
        <p>Loading player...</p>
      )}
    </>
  );
}
