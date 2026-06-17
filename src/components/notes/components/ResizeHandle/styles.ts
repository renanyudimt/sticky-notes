import styled, { css } from "styled-components";

import type { ResizeDirection } from "../../types";

const POSITION: Record<ResizeDirection, ReturnType<typeof css>> = {
  nw: css`
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
  `,
  n: css`
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
  `,
  ne: css`
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
  `,
  e: css`
    top: 50%;
    right: 0;
    transform: translate(50%, -50%);
  `,
  se: css`
    bottom: 0;
    right: 0;
    transform: translate(50%, 50%);
  `,
  s: css`
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 50%);
  `,
  sw: css`
    bottom: 0;
    left: 0;
    transform: translate(-50%, 50%);
  `,
  w: css`
    top: 50%;
    left: 0;
    transform: translate(-50%, -50%);
  `,
};

const CURSOR: Record<ResizeDirection, string> = {
  n: "ns-resize",
  s: "ns-resize",
  e: "ew-resize",
  w: "ew-resize",
  ne: "nesw-resize",
  sw: "nesw-resize",
  nw: "nwse-resize",
  se: "nwse-resize",
};

export const Handle = styled.div<{ $direction: ResizeDirection }>`
  position: absolute;
  z-index: 10;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 9999px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  background: #ffffff;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  opacity: 0;
  transition: opacity 0.15s ease;
  cursor: ${({ $direction }) => CURSOR[$direction]};

  &:focus-visible {
    opacity: 1;
  }

  ${({ $direction }) => POSITION[$direction]}
`;
