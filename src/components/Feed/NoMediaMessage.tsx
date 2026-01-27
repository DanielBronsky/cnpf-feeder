import styled from 'styled-components';

const NoMediaContainer = styled.div`
  opacity: 0.75;
  font-size: 13px;
`;

export function NoMediaMessage() {
  return <NoMediaContainer>Медиафайлы не добавлены</NoMediaContainer>;
}
