import styled from 'styled-components';
import { useRouter } from 'next/navigation';

const BackButtonContainer = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 12px;
  width: fit-content;

  &:hover {
    background: var(--surface-3);
    border-color: var(--border-soft);
    transform: translateX(-2px);
  }

  &:active {
    transform: translateX(0);
  }
`;

const BackIcon = styled.span`
  font-size: 18px;
  line-height: 1;
`;

interface BackButtonProps {
  href?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function BackButton({
  href,
  onClick,
  children = 'Назад',
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <BackButtonContainer type='button' onClick={handleClick}>
      <BackIcon>←</BackIcon>
      {children}
    </BackButtonContainer>
  );
}
