import styled from 'styled-components';

const ModalTitleContainer = styled.h2`
  margin-bottom: 6px;
  font-size: 22px;
  letter-spacing: -0.01em;
`;

interface ModalTitleProps {
  children: React.ReactNode;
}

export function ModalTitle({ children }: ModalTitleProps) {
  return <ModalTitleContainer>{children}</ModalTitleContainer>;
}
