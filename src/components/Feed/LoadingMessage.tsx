import styled from 'styled-components';

const LoadingContainer = styled.div`
  opacity: 0.8;
`;

export function LoadingMessage() {
  return <LoadingContainer>Загрузка...</LoadingContainer>;
}
