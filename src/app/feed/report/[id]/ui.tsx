'use client';

/**
 * Компонент для просмотра одного отчета
 */
import { useQuery } from '@apollo/client';
import { REPORT_QUERY } from '@/lib/graphql/queries';
import { BackButton, LoadingMessage } from '@/components/Feed';
import {
  Card,
  CardTitle,
  CardText,
  Author,
  AuthorName,
  AuthorText,
  Avatar,
  AvatarFallback,
  Meta,
  PhotosGrid,
  Photo,
  Wrap,
  ErrorText,
} from '@/app/feed/feed.styles';

type Me = { id: string; isAdmin: boolean } | null;

type Report = {
  id: string;
  title: string;
  text: string;
  createdAt?: string;
  updatedAt?: string;
  author: {
    id: string;
    username: string;
    hasAvatar: boolean;
    avatarUrl: string | null;
  };
  photos: Array<{ url: string }>;
  canEdit: boolean;
};

function fmtDate(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('ru-RU');
}

export function ReportViewClient({ reportId, me }: { reportId: string; me: Me }) {
  const { data, loading, error } = useQuery(REPORT_QUERY, {
    variables: { id: reportId },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  });

  if (loading) {
    return (
      <Wrap>
        <BackButton href="/feed">← Назад к отчетам</BackButton>
        <LoadingMessage />
      </Wrap>
    );
  }

  if (error || !data?.report) {
    return (
      <Wrap>
        <BackButton href="/feed">← Назад к отчетам</BackButton>
        <ErrorText>{error?.message || 'Отчет не найден'}</ErrorText>
      </Wrap>
    );
  }

  const report: Report = data.report;

  return (
    <Wrap>
      <BackButton href="/feed">← Назад к отчетам</BackButton>
      
      <Card>
        <div style={{ marginBottom: '12px' }}>
          <Author>
            {report.author.hasAvatar && report.author.avatarUrl ? (
              <Avatar src={report.author.avatarUrl} alt={report.author.username} />
            ) : (
              <AvatarFallback />
            )}
            <AuthorText>
              <AuthorName>{report.author.username}</AuthorName>
              <Meta>
                {report.createdAt && fmtDate(report.createdAt)}
                {report.updatedAt && report.updatedAt !== report.createdAt && ` (обновлено: ${fmtDate(report.updatedAt)})`}
              </Meta>
            </AuthorText>
          </Author>
        </div>

        <CardTitle>{report.title}</CardTitle>
        <CardText>{report.text}</CardText>

        {report.photos && report.photos.length > 0 && (
          <PhotosGrid>
            {report.photos.map((photo, idx) => (
              <Photo
                key={idx}
                src={photo.url}
                alt={`Фото ${idx + 1}`}
                onClick={() => {
                  // Можно добавить просмотр фото в полноэкранном режиме
                  window.open(photo.url, '_blank');
                }}
              />
            ))}
          </PhotosGrid>
        )}
      </Card>
    </Wrap>
  );
}
