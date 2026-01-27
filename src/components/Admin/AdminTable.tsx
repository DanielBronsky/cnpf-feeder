import styled from 'styled-components';

export const AdminTableWrapper = styled.div`
  overflow-x: auto;
`;

export const AdminTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  background: var(--surface-3);
`;

export const AdminTableHeader = styled.thead``;

export const AdminTableHeaderRow = styled.tr`
  text-align: left;
  opacity: 0.8;
`;

export const AdminTableHeaderCell = styled.th`
  padding: 12px;
`;

export const AdminTableBody = styled.tbody``;

export const AdminTableRow = styled.tr`
  border-top: 1px solid var(--border-soft);
`;

export const AdminTableCell = styled.td<{ $maxWidth?: number; $opacity?: number; $fontSize?: number }>`
  padding: 12px;
  ${({ $maxWidth }) => $maxWidth && `max-width: ${$maxWidth}px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`}
  ${({ $opacity }) => $opacity && `opacity: ${$opacity};`}
  ${({ $fontSize }) => $fontSize && `font-size: ${$fontSize}px;`}
`;
