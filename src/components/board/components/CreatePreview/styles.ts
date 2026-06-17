import styled from "styled-components";

export const CreatePreviewBox = styled.div`
  pointer-events: none;
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9998;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 2px dashed #f59e0b;
  background: rgba(252, 211, 77, 0.3);
  will-change: transform;
`;
