import React from "react";
import { IoBug, IoHeart } from "react-icons/io5";
import { Button } from "..";

import * as Styled from "./index.styled";

export function Footer() {
  const [showDebugMenu, setShowDebugMenu] = React.useState<boolean>(false);

  const toggleDebugMenu = React.useCallback(() => {
    setShowDebugMenu(show => !show)
  }, []);

  const clearLocalStorage = React.useCallback(() => {
    localStorage.clear();
    location.reload();
  }, []);

  return (
    <footer>
      <Styled.Text>
        Made with <IoHeart /> by{" "}
        <Styled.Link href="https://epicwolverine.com">
          EpicWolverine
        </Styled.Link>
        {" "}based on the work of{" "}
        <Styled.Link href="https://twitter.com/synowski_maciej">
          Maciej Synowski
        </Styled.Link>
      </Styled.Text>
      <Styled.Text>
        <Button onClick={toggleDebugMenu}><IoBug /> Debug Options</Button><br />
        {showDebugMenu &&
          <Button variant="red" onClick={clearLocalStorage}>
            Clear Local Storage & Reload
          </Button>
        }
      </Styled.Text>
    </footer>
  );
}
