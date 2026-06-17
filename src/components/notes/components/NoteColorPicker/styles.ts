import styled from "styled-components";

import type { NoteColor } from "../../types";

export const ColorTrigger = styled.button<{ $color: NoteColor }>`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 9999px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: ${({ theme }) => theme.shadow.sm};
  cursor: pointer;
  transition: transform 0.15s ease;
  background: ${({ theme, $color }) => theme.noteColors[$color].border};

  &:hover {
    transform: scale(1.1);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.ring};
    outline-offset: 1px;
  }
`;

export const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
`;

export const SwatchButton = styled.button<{
  $color: NoteColor;
  $selected: boolean;
}>`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.15s ease;
  background: ${({ theme, $color }) => theme.noteColors[$color].border};
  outline: ${({ theme, $selected }) =>
    $selected ? `2px solid ${theme.colors.ring}` : "none"};
  outline-offset: 2px;

  &:hover {
    transform: scale(1.1);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.ring};
    outline-offset: 2px;
  }
`;

export const POPOVER_AUTO_WIDTH = { width: "auto" } as const;
