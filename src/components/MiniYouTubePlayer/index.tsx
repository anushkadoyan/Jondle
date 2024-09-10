import React from "react";
import { default as YouTubePlayer } from "react-youtube";

interface Props {
  id: string;
}

export function MiniYouTubePlayer({ id }: Props) {
  return (
    <div style={{ margin: "1% 0" }}>
      <YouTubePlayer
        videoId={id}
        opts={{
          width: "336",
          height: "189",
          playerVars: {
            autoplay: 0,
            playsinline: 1,
            modestbranding: 1, // Minimizes YouTube branding
            rel: 0, // Prevents showing related videos at the end
            showinfo: 0, // Deprecated, but used to hide video info
          },
        }}
      />
    </div>
  );
}
