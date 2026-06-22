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
