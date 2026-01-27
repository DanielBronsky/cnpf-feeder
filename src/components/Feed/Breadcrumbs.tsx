import styled from 'styled-components';
import Link from 'next/link';

const BreadcrumbsContainer = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 8px;
`;

const BreadcrumbLink = styled(Link)`
  color: var(--text);
  text-decoration: none;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
`;

const BreadcrumbSeparator = styled.span`
  opacity: 0.5;
`;

const BreadcrumbCurrent = styled.span`
  opacity: 0.9;
  font-weight: 500;
`;

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <BreadcrumbsContainer>
      {items.map((item, index) => (
        <span key={index}>
          {index > 0 && <BreadcrumbSeparator> / </BreadcrumbSeparator>}
          {item.href ? (
            <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
          ) : (
            <BreadcrumbCurrent>{item.label}</BreadcrumbCurrent>
          )}
        </span>
      ))}
    </BreadcrumbsContainer>
  );
}
