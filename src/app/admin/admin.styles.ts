/**
 * src/app/admin/admin.styles.ts
 * Styled-components стили для админки (/admin/*): внутренний header + навигация.
 */
import Link from 'next/link';
import styled from 'styled-components';

export const Wrap = styled.main`
  max-width: 1000px;
  margin: 0 auto;
  padding: 18px 16px 28px 16px;
  display: grid;
  gap: 16px;
`;

export const AdminHeader = styled.header`
  border-radius: 18px;
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text);
  padding: 14px 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px);
`;

export const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 10px;
`;

export const Hint = styled.div`
  font-size: 12px;
  opacity: 0.75;
`;

export const Nav = styled.nav`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const NavLink = styled(Link)<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: ${({ $active }) =>
    $active ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.06)'};
  color: inherit;
  text-decoration: none;
  cursor: pointer;
`;

export const SectionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SectionTitle = styled.div`
  font-weight: 700;
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 4px;
`;

export const SectionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Content = styled.section`
  border-radius: 18px;
  border: 1px solid var(--border);
  background: var(--surface-3);
  color: var(--text);
  padding: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
`;
