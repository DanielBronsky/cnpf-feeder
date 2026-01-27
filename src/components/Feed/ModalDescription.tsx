import styled from 'styled-components';

const ModalDescriptionContainer = styled.div`
  opacity: 0.78;
  margin-bottom: 12px;
`;

interface ModalDescriptionProps {
  children: React.ReactNode;
}

export function ModalDescription({ children }: ModalDescriptionProps) {
  return <ModalDescriptionContainer>{children}</ModalDescriptionContainer>;
}
