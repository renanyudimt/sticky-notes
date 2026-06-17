import styled from "styled-components";

export const Content = styled.div`
  position: fixed;
  z-index: 50;
  width: 18rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.popover};
  color: ${({ theme }) => theme.colors.popoverForeground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.md};
  outline: none;
  animation: popover-fade-in 0.12s ease;

  @keyframes popover-fade-in {
    from {
      opacity: 0;
      transform: scale(0.97);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;
