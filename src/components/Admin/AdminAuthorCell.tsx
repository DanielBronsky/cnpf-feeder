import styled from 'styled-components';

const AuthorCellContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AuthorAvatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid var(--border);
`;

const AuthorAvatarFallback = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--border);
`;

const AuthorName = styled.div`
  font-weight: 700;
`;

interface AdminAuthorCellProps {
  author: {
    username: string;
    hasAvatar: boolean;
    avatarUrl: string | null;
  };
}

export function AdminAuthorCell({ author }: AdminAuthorCellProps) {
  return (
    <AuthorCellContainer>
      {author.hasAvatar && author.avatarUrl ? (
        <AuthorAvatar src={author.avatarUrl} alt='avatar' />
      ) : (
        <AuthorAvatarFallback />
      )}
      <AuthorName>{author.username}</AuthorName>
    </AuthorCellContainer>
  );
}
