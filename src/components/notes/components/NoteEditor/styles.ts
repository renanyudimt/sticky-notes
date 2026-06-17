import styled from "styled-components";

export const NoteTextarea = styled.textarea`
  height: 100%;
  width: 100%;
  flex: 1 1 0%;
  resize: none;
  border: none;
  background: transparent;
  padding: 0 0.75rem 0.75rem;
  font-family: inherit;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #171717;
  outline: none;

  &::placeholder {
    color: rgba(23, 23, 23, 0.4);
  }
`;
