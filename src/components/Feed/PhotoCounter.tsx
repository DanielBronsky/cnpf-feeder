import styled from 'styled-components';

const PhotoCounterContainer = styled.div`
  opacity: 0.75;
  font-size: 12px;
`;

interface PhotoCounterProps {
  current: number;
  max: number;
}

export function PhotoCounter({ current, max }: PhotoCounterProps) {
  return (
    <PhotoCounterContainer>
      Сейчас: {current} / {max}
    </PhotoCounterContainer>
  );
}
