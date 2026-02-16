'use client';

/**
 * Компонент для просмотра одного соревнования
 */
import { useQuery } from '@apollo/client';
import { COMPETITION_QUERY } from '@/lib/graphql/queries';
import { BackButton, LoadingMessage } from '@/components/Feed';
import { Wrap, ErrorText } from '@/app/feed/feed.styles';
import styled from 'styled-components';

type Me = { id: string; isAdmin: boolean } | null;

type Competition = {
  id: string;
  title: string;
  startDate: string | null;
  endDate: string | null;
  location: string;
  tours: Array<{ date: string | null; time: string | null }>;
  openingDate: string | null;
  openingTime: string | null;
  individualFormat: boolean;
  teamFormat: boolean;
  fee: number | null;
  teamLimit: number | null;
  regulations: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

const Card = styled.article`
  border-radius: 18px;
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text);
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px);
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 32px 0;
  letter-spacing: -0.02em;
  text-align: center;
  line-height: 1.3;
  padding-bottom: 24px;
  border-bottom: 2px solid var(--border);
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.1) 0%,
    rgba(139, 92, 246, 0.1) 100%
  );
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 32px;
`;

const Meta = styled.div`
  display: grid;
  gap: 0;
  margin-bottom: 32px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 8px;
  border: 1px solid var(--border-soft);
`;

const MetaRow = styled.div`
  display: flex;
  gap: 16px;
  font-size: 15px;
  align-items: flex-start;
  padding: 14px 0;
  border-bottom: 1px solid var(--border-soft);
  
  &:last-child {
    border-bottom: none;
  }
`;

const MetaLabel = styled.span`
  opacity: 0.7;
  min-width: 200px;
  font-weight: 600;
  flex-shrink: 0;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MetaValue = styled.div`
  opacity: 0.95;
  font-weight: 500;
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 8px 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
  color: rgba(99, 102, 241, 0.95);
  font-size: 14px;
  font-weight: 600;
  border: 1px solid rgba(99, 102, 241, 0.3);
  white-space: nowrap;
`;

const ToursSection = styled.div`
  margin-top: 32px;
  padding-top: 32px;
  border-top: 2px solid var(--border);
`;

const ToursTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 20px 0;
  letter-spacing: -0.01em;
  color: rgba(99, 102, 241, 0.9);
`;

const ToursList = styled.div`
  display: grid;
  gap: 12px;
`;

const TourItem = styled.div`
  padding: 16px 20px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-soft);
  font-size: 15px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateX(4px);
  }
  
  strong {
    color: rgba(99, 102, 241, 0.9);
    font-weight: 700;
    margin-right: 8px;
  }
`;

const Regulations = styled.div`
  margin-top: 32px;
  padding-top: 32px;
  border-top: 2px solid var(--border);
`;

const RegulationsTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 20px 0;
  letter-spacing: -0.01em;
  color: rgba(99, 102, 241, 0.9);
`;

const RegulationsText = styled.div`
  padding: 24px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-soft);
  white-space: pre-wrap;
  line-height: 1.8;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
`;

function fmtDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function fmtDateTime(date: string | null, time: string | null): string {
  if (!date) return '';
  const d = new Date(date);
  const dateStr = d.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  if (time) {
    return `${dateStr} в ${time}`;
  }
  return dateStr;
}

function fmtDateRange(start: string | null, end: string | null): string {
  if (!start || !end) return '';
  const startDate = fmtDate(start);
  const endDate = fmtDate(end);
  if (startDate === endDate) {
    return startDate;
  }
  return `${startDate} - ${endDate}`;
}

export function CompetitionViewClient({ competitionId, me }: { competitionId: string; me: Me }) {
  const { data, loading, error } = useQuery(COMPETITION_QUERY, {
    variables: { id: competitionId },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  });

  if (loading) {
    return (
      <Wrap>
        <BackButton href="/competitions">← Назад к соревнованиям</BackButton>
        <LoadingMessage />
      </Wrap>
    );
  }

  if (error || !data?.competition) {
    return (
      <Wrap>
        <BackButton href="/competitions">← Назад к соревнованиям</BackButton>
        <ErrorText>{error?.message || 'Соревнование не найдено'}</ErrorText>
      </Wrap>
    );
  }

  const competition: Competition = data.competition;

  return (
    <Wrap>
      <BackButton href="/competitions">← Назад к соревнованиям</BackButton>

      <Card>
        <Title>{competition.title}</Title>

        <Meta>
          {competition.startDate && competition.endDate && (
            <MetaRow>
              <MetaLabel>Дата проведения:</MetaLabel>
              <MetaValue>
                <Badge>{fmtDateRange(competition.startDate, competition.endDate)}</Badge>
              </MetaValue>
            </MetaRow>
          )}

          <MetaRow>
            <MetaLabel>Место проведения:</MetaLabel>
            <MetaValue>
              <Badge>{competition.location}</Badge>
            </MetaValue>
          </MetaRow>

          {competition.openingDate && (
            <MetaRow>
              <MetaLabel>Открытие регистрации:</MetaLabel>
              <MetaValue>
                <Badge>{fmtDateTime(competition.openingDate, competition.openingTime)}</Badge>
              </MetaValue>
            </MetaRow>
          )}

          <MetaRow>
            <MetaLabel>Формат:</MetaLabel>
            <MetaValue>
              {competition.individualFormat && <Badge>Индивидуальный</Badge>}
              {competition.teamFormat && <Badge>Командный</Badge>}
            </MetaValue>
          </MetaRow>

          {competition.fee !== null && (
            <MetaRow>
              <MetaLabel>Взнос:</MetaLabel>
              <MetaValue>
                <Badge>{competition.fee} MDL</Badge>
              </MetaValue>
            </MetaRow>
          )}

          {competition.teamLimit !== null && (
            <MetaRow>
              <MetaLabel>Лимит команд:</MetaLabel>
              <MetaValue>
                <Badge>{competition.teamLimit}</Badge>
              </MetaValue>
            </MetaRow>
          )}
        </Meta>

        {competition.tours && competition.tours.length > 0 && (
          <ToursSection>
            <ToursTitle>Туры соревнования:</ToursTitle>
            <ToursList>
              {competition.tours.map((tour, idx) => (
                <TourItem key={idx}>
                  <strong>Тур {idx + 1}:</strong> {tour.date ? fmtDate(tour.date) : 'Дата не указана'}
                  {tour.time && ` в ${tour.time}`}
                </TourItem>
              ))}
            </ToursList>
          </ToursSection>
        )}

        {competition.regulations && (
          <Regulations>
            <RegulationsTitle>Регламент:</RegulationsTitle>
            <RegulationsText>{competition.regulations}</RegulationsText>
          </Regulations>
        )}
      </Card>
    </Wrap>
  );
}
