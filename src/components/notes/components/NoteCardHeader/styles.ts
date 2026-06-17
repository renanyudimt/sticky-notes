import styled from "styled-components";

export const NoteHeader = styled.header`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

export const NoteDeleteButton = styled.button`
  display: flex;
  width: 1.25rem;
  height: 1.25rem;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: rgba(64, 64, 64, 0.7);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #171717;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.ring};
    outline-offset: 1px;
  }

  & svg {
    width: 0.875rem;
    height: 0.875rem;
  }
`;
