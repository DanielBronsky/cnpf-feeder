import styled from 'styled-components';
import { PrimaryButton } from '@/app/feed/feed.styles';

const MoreCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 18px;
  border: 1px solid var(--border);
  background:
    linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
    linear-gradient(225deg, rgba(59, 130, 246, 0.06) 0%, transparent 50%),
    var(--surface-2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(8px);
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
  }
`;

const MoreCardText = styled.p`
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
  text-align: center;
  font-weight: 500;
  letter-spacing: -0.01em;
`;

const MoreCardButton = styled(PrimaryButton)`
  min-width: 200px;
`;

interface MoreReportsCardProps {
  onMoreClick: () => void;
}

export function MoreReportsCard({ onMoreClick }: MoreReportsCardProps) {
  return (
    <MoreCardContainer>
      <MoreCardText>Хотите больше отчётов?</MoreCardText>
      <MoreCardButton type='button' onClick={onMoreClick}>
        Еще
      </MoreCardButton>
    </MoreCardContainer>
  );
}
