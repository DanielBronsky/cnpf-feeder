import styled from 'styled-components';

const EmptyStateContainer = styled.div`
  opacity: 0.75;
`;

export function EmptyState() {
  return <EmptyStateContainer>Пока нет отчётов. Будь первым!</EmptyStateContainer>;
}
