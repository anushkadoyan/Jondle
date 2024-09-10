import styled from "styled-components";

export const ProgressBackground = styled.div`
  position: relative;
  z-index: -1;

  width: 100%;
  height: 20px;
  background-color: ${({ theme }) => theme.gray};
  border-radius: 2px;

  margin-top: 2%;
`;

// width: ${({ value }) => value * 9.4}%;
export const Progress = styled.div<{ value: number }>`
  width: ${({ value }) => value}%;
  max-width: 100%;
  height: 20px;

  align-self: flex-start;

  background-color: ${({ theme }) => theme.green};

  border-radius: 2px;

  transition: width 0.5s;
`;

export const Separator = styled.div`
  position: absolute;
  top: 0;

  width: 1px;
  height: 100%;

  background-color: ${({ theme }) => theme.border100};
`;

export const TimeStamps = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
`;

export const TimeStamp = styled.p`
  color: ${({ theme }) => theme.text};
  height: 5px;
  margin: 2px 0px;
`;
