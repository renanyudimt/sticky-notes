import styled from "styled-components";

export const InfoList = styled.ul`
  margin: 0.5rem 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex: 1 1 0%;
  min-height: 0;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  padding-right: 0.25rem;
`;

export const InfoItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

export const InfoIcon = styled.span`
  margin-top: 0.125rem;
  display: flex;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.muted};
  color: ${({ theme }) => theme.colors.foreground};

  & svg {
    width: 1rem;
    height: 1rem;
  }
`;

export const InfoItemTitle = styled.p`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
`;

export const InfoItemDescription = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const INFO_CONTENT_STYLE = {
  display: "flex",
  flexDirection: "column",
  maxHeight: "85vh",
} as const;
