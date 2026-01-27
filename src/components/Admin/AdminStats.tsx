import styled from 'styled-components';

const AdminStatsContainer = styled.div`
  opacity: 0.75;
`;

interface AdminStatsProps {
  count: number;
  label: string;
}

export function AdminStats({ count, label }: AdminStatsProps) {
  return (
    <AdminStatsContainer>
      {label}: {count}
    </AdminStatsContainer>
  );
}
