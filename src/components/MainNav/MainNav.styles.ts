/**
 * MainNav — отдельный блок навигации под хедером.
 * Стилизован под desktop и mobile.
 */

import Link from 'next/link';
import styled from 'styled-components';

export const MainNavWrap = styled.nav`
  background: linear-gradient(
    180deg,
    rgba(24, 26, 32, 0.85) 0%,
    rgba(18, 19, 24, 0.6) 100%
  );
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding: 10px 0;

  @media (max-width: 768px) {
    padding: 10px 0;
  }

  @media (max-width: 520px) {
    padding: 8px 0;
  }
`;

export const NavList = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    padding: 0 14px;
    gap: 6px;
  }

  @media (max-width: 520px) {
    padding: 0 12px;
    gap: 6px;
    justify-content: center;
  }
`;

export const NavItem = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
  text-decoration: none;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.98);
  }

  &[data-active='true'] {
    background: rgba(99, 102, 241, 0.2);
    border-color: rgba(99, 102, 241, 0.4);
    color: #a5b4fc;
  }

  @media (max-width: 520px) {
    padding: 9px 14px;
    font-size: 13px;
  }
`;
