import styled from "styled-components";

import type { NoteColor } from "../../types";

export const NoteSurface = styled.article<{
  $color: NoteColor;
  $isMoving: boolean;
  $isPendingDelete: boolean;
}>`
  position: absolute;
  display: flex;
  flex-direction: column;
  overflow: visible;
  user-select: none;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme, $color }) => theme.noteColors[$color].border};
  background: ${({ theme, $color }) => theme.noteColors[$color].bg};
  box-shadow: ${({ theme, $isMoving }) =>
    `${$isMoving ? theme.shadow.xl2 : theme.shadow.lg}, 0 0 0 1px rgba(0, 0, 0, 0.05)`};
  opacity: ${({ $isPendingDelete }) => ($isPendingDelete ? 0.4 : 1)};
  transform: ${({ $isPendingDelete }) =>
    $isPendingDelete ? "scale(0.95)" : "none"};
  transition: opacity 0.15s ease, transform 0.15s ease;

  &:hover [data-resize-handle] {
    opacity: 1;
  }
`;
