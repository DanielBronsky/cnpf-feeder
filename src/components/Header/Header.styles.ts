/**
 * src/components/Header.styles.ts
 * Styled-components стили для Header.
 */

import Link from 'next/link';
import styled from 'styled-components';

export const HeaderWrap = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(10px);
  background: rgba(10, 10, 10, 0.55);
  color: var(--text);
  border-bottom: 1px solid var(--border-soft);
`;

export const Inner = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 12px 14px;
  }

  @media (max-width: 690px) {
    flex-wrap: wrap;
    row-gap: 10px;
    flex-direction: column;
    padding: 10px 12px;
  }

  @media (max-width: 520px) {
    padding: 10px;
  }
`;

export const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: inherit;
  text-decoration: none;
  min-width: 0;
`;

export const BrandLogo = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 100%;
  object-fit: cover;
  border: 1px solid var(--border);
  background: var(--input-bg);
`;

export const BrandText = styled.span`
  font-weight: 800;
  letter-spacing: -0.02em;
  white-space: nowrap;
  font-size: 20px;
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
`;

export const Pill = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.06);
  color: inherit;
  text-decoration: none;
  cursor: pointer;

  @media (max-width: 690px) {
    padding: 9px 10px;
    border-radius: 12px;
    font-size: 13px;
  }
`;

export const PillPrimary = styled(Pill)`
  background: #ffffff;
  /* форсим цвет текста для всех состояний, чтобы не переопределялся глобальным правилом для ссылок */
  &,
  &:visited,
  &:hover,
  &:active {
    color: #000000;
    -webkit-text-fill-color: #000000;
  }
  font-weight: 700;
`;

export const UserBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.06);

  @media (max-width: 690px) {
    padding: 6px 8px;
    gap: 8px;
  }
`;

export const Avatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 999px;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--border);
`;

export const AvatarFallback = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--border);
`;

export const Username = styled.div`
  font-size: 14px;
  font-weight: 600;
  opacity: 0.95;

  @media (max-width: 690px) {
    max-width: 140px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const Muted = styled.div`
  font-size: 12px;
  opacity: 0.7;

  @media (max-width: 690px) {
    display: none;
  }
`;
