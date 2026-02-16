/**
 * src/components/Competition/CompetitionCard.tsx
 * Карточка соревнования для главной страницы.
 */
import { useState } from 'react';
import styled from 'styled-components';
import { RegistrationModal } from './RegistrationModal';
import { ParticipantsModal } from './ParticipantsModal';
import { useQuery } from '@apollo/client';
import { ME_QUERY } from '@/lib/graphql/queries';

const Card = styled.article`
  border-radius: 18px;
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text);
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4);
  }
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 20px 0;
  letter-spacing: -0.01em;
  text-align: center;
  position: relative;
  padding-bottom: 16px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(99, 102, 241, 0.5) 20%,
      rgba(139, 92, 246, 0.5) 50%,
      rgba(99, 102, 241, 0.5) 80%,
      transparent 100%
    );
    border-radius: 2px;
  }
`;

const Meta = styled.div`
  display: grid;
  gap: 10px;
  margin-bottom: 16px;
`;

const MetaRow = styled.div`
  display: flex;
  gap: 12px;
  font-size: 14px;
  align-items: center;
`;

const MetaLabel = styled.span`
  opacity: 0.75;
  min-width: 200px;
  font-weight: 500;
  flex-shrink: 0;
`;

const MetaValue = styled.span`
  opacity: 0.9;
  font-weight: 500;
  flex: 1;
`;

const Info = styled.div`
  display: grid;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid var(--border-soft);
`;

const InfoRow = styled.div`
  display: flex;
  gap: 12px;
  font-size: 14px;
  align-items: center;
`;

const InfoLabel = styled.span`
  opacity: 0.75;
  min-width: 200px;
  font-weight: 500;
  flex-shrink: 0;
`;

const InfoValue = styled.span`
  opacity: 0.9;
  font-weight: 500;
  flex: 1;
  word-break: break-word;
`;

const FormatBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 10px;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  font-size: 13px;
  font-weight: 600;
  margin-right: 8px;
  margin-bottom: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(99, 102, 241, 0.2);
    border-color: rgba(99, 102, 241, 0.4);
    transform: translateY(-1px);
  }
`;

const InfoBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border);
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--border-soft);
  }
`;

const DateBadge = styled(InfoBadge)`
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.12) 0%,
    rgba(99, 102, 241, 0.08) 100%
  );
  border-color: rgba(139, 92, 246, 0.25);
  color: rgba(255, 255, 255, 0.95);
`;

const LocationBadge = styled(InfoBadge)`
  background: linear-gradient(
    135deg,
    rgba(20, 184, 166, 0.12) 0%,
    rgba(14, 165, 233, 0.08) 100%
  );
  border-color: rgba(20, 184, 166, 0.25);
  color: rgba(255, 255, 255, 0.95);
`;

const ClosingBadge = styled(InfoBadge)`
  background: linear-gradient(
    135deg,
    rgba(236, 72, 153, 0.12) 0%,
    rgba(219, 39, 119, 0.08) 100%
  );
  border-color: rgba(236, 72, 153, 0.25);
  color: rgba(255, 255, 255, 0.95);
`;

const TourBadge = styled(InfoBadge)`
  background: linear-gradient(
    135deg,
    rgba(251, 191, 36, 0.12) 0%,
    rgba(245, 158, 11, 0.08) 100%
  );
  border-color: rgba(251, 191, 36, 0.25);
  color: rgba(255, 255, 255, 0.95);
  margin-right: 8px;
`;

const FeeBadge = styled(InfoBadge)`
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.12) 0%,
    rgba(22, 163, 74, 0.08) 100%
  );
  border-color: rgba(34, 197, 94, 0.25);
  color: rgba(255, 255, 255, 0.95);
`;

const LimitBadge = styled(InfoBadge)`
  background: linear-gradient(
    135deg,
    rgba(168, 85, 247, 0.12) 0%,
    rgba(147, 51, 234, 0.08) 100%
  );
  border-color: rgba(168, 85, 247, 0.25);
  color: rgba(255, 255, 255, 0.95);
`;

const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

const Regulations = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-soft);
`;

const RegulationsHeader = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--text);
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  opacity: 0.9;
  transition: opacity 0.2s ease;
  text-align: left;

  &:hover {
    opacity: 1;
  }
`;

const RegulationsTitle = styled.span`
  font-weight: 600;
`;

const RegulationsToggle = styled.span<{ $isOpen: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: 8px;
  font-size: 13px;
  font-weight: 500;
  opacity: 0.7;
  transition: opacity 0.2s ease;

  ${RegulationsHeader}:hover & {
    opacity: 1;
  }
`;

const ArrowIcon = styled.span<{ $isOpen: boolean }>`
  display: inline-block;
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};

  &::before {
    content: '▼';
    display: block;
    font-size: 10px;
    line-height: 16px;
    text-align: center;
  }
`;

const RegulationsContent = styled.div<{ $isOpen: boolean }>`
  max-height: ${({ $isOpen }) => ($isOpen ? '2000px' : '0')};
  overflow: hidden;
  transition:
    max-height 0.3s ease,
    margin-top 0.3s ease,
    opacity 0.3s ease;
  margin-top: ${({ $isOpen }) => ($isOpen ? '12px' : '0')};
  opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
`;

const RegulationsText = styled.div`
  opacity: 0.85;
  line-height: 1.6;
  white-space: pre-wrap;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.03);
  padding: 14px;
  border-radius: 10px;
  border: 1px solid var(--border-soft);
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border-soft);
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 14px 20px;
  border-radius: 14px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.15) 0%,
    rgba(139, 92, 246, 0.15) 100%
  );
  color: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(99, 102, 241, 0.3);

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(99, 102, 241, 0.25) 0%,
      rgba(139, 92, 246, 0.25) 100%
    );
    border-color: rgba(99, 102, 241, 0.5);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled(ActionButton)`
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--border);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--border-soft);
  }
`;

type CompetitionCardProps = {
  competition: {
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
  };
};

function formatDateRange(start: string, end: string): string {
  if (!start || !end) return '';
  const startDate = new Date(start);
  const endDate = new Date(end);

  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];

  const startDay = startDate.getDate();
  const startMonth = months[startDate.getMonth()];
  const startYear = startDate.getFullYear();

  const endDay = endDate.getDate();
  const endMonth = months[endDate.getMonth()];
  const endYear = endDate.getFullYear();

  if (startMonth === endMonth && startYear === endYear) {
    return `${startDay} - ${endDay} ${startMonth} ${startYear}`;
  }
  return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
}

function formatDateTime(date: string, time: string): string {
  if (!date) return '';
  const d = new Date(date);
  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  let timeStr = '';
  if (time) {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours, 10);
    const m = parseInt(minutes, 10);
    timeStr = `, время ${h}-${m.toString().padStart(2, '0')}`;
  }

  return `${day} ${month} ${year}${timeStr}`;
}

export function CompetitionCard({ competition }: CompetitionCardProps) {
  const [isRegulationsOpen, setIsRegulationsOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const { data: meData } = useQuery(ME_QUERY);
  const isAuthenticated = !!meData?.me;

  return (
    <Card>
      <Title>{competition.title}</Title>
      <Meta>
        {competition.startDate && competition.endDate ? (
          <MetaRow>
            <MetaLabel>Дата проведения соревнований:</MetaLabel>
            <MetaValue>
              <DateBadge>
                {formatDateRange(competition.startDate, competition.endDate)}
              </DateBadge>
            </MetaValue>
          </MetaRow>
        ) : null}
        <MetaRow>
          <MetaLabel>Место проведения соревнования:</MetaLabel>
          <MetaValue>
            <LocationBadge>{competition.location}</LocationBadge>
          </MetaValue>
        </MetaRow>
        {competition.openingDate ? (
          <MetaRow>
            <MetaLabel>Закрытие соревнований:</MetaLabel>
            <MetaValue>
              <ClosingBadge>
                {formatDateTime(
                  competition.openingDate,
                  competition.openingTime || '',
                )}
              </ClosingBadge>
            </MetaValue>
          </MetaRow>
        ) : null}
      </Meta>
      <Info>
        <InfoRow>
          <InfoLabel>Формат соревнований:</InfoLabel>
          <InfoValue>
            <BadgeContainer>
              {competition.individualFormat && competition.teamFormat ? (
                <>
                  <FormatBadge>Индивидуальный</FormatBadge>
                  <FormatBadge>
                    Командный: Команда из 3 спортсменов + 1 тренер
                  </FormatBadge>
                </>
              ) : competition.individualFormat ? (
                <FormatBadge>Индивидуальный</FormatBadge>
              ) : competition.teamFormat ? (
                <FormatBadge>
                  Командный: Команда из 3 спортсменов + 1 тренер
                </FormatBadge>
              ) : null}
            </BadgeContainer>
          </InfoValue>
        </InfoRow>
        {competition.tours.length > 0 ? (
          <InfoRow>
            <InfoLabel>Начало туров:</InfoLabel>
            <InfoValue>
              <BadgeContainer>
                {competition.tours.map((tour, idx) =>
                  tour.date ? (
                    <TourBadge key={idx}>
                      Тур {idx + 1}:{' '}
                      {formatDateTime(tour.date, tour.time || '')}
                    </TourBadge>
                  ) : null,
                )}
              </BadgeContainer>
            </InfoValue>
          </InfoRow>
        ) : null}
        {competition.fee ? (
          <InfoRow>
            <InfoLabel>Взнос за участие с одного спортсмена:</InfoLabel>
            <InfoValue>
              <FeeBadge>{competition.fee} лей</FeeBadge>
            </InfoValue>
          </InfoRow>
        ) : null}
        {competition.teamLimit ? (
          <InfoRow>
            <InfoLabel>Лимит на участие команд:</InfoLabel>
            <InfoValue>
              <LimitBadge>
                Ограничение регистрации составляет {competition.teamLimit}{' '}
                команд, остальные команды вносятся в резерв.
              </LimitBadge>
            </InfoValue>
          </InfoRow>
        ) : null}
      </Info>
      {competition.regulations ? (
        <Regulations>
          <RegulationsHeader
            type='button'
            onClick={() => setIsRegulationsOpen(!isRegulationsOpen)}
            aria-expanded={isRegulationsOpen}
          >
            <RegulationsTitle>Регламент соревнований:</RegulationsTitle>
            <RegulationsToggle $isOpen={isRegulationsOpen}>
              Подробнее
              <ArrowIcon $isOpen={isRegulationsOpen} />
            </RegulationsToggle>
          </RegulationsHeader>
          <RegulationsContent $isOpen={isRegulationsOpen}>
            <RegulationsText>{competition.regulations}</RegulationsText>
          </RegulationsContent>
        </Regulations>
      ) : null}

      <Actions>
        {isAuthenticated && (
          <ActionButton
            type="button"
            onClick={() => setIsRegistrationModalOpen(true)}
          >
            Регистрация
          </ActionButton>
        )}
        <SecondaryButton
          type="button"
          onClick={() => setIsParticipantsModalOpen(true)}
        >
          Участники
        </SecondaryButton>
      </Actions>

      {isRegistrationModalOpen && (
        <RegistrationModal
          competitionId={competition.id}
          competitionTitle={competition.title}
          individualFormat={competition.individualFormat}
          teamFormat={competition.teamFormat}
          onClose={() => setIsRegistrationModalOpen(false)}
          onSuccess={() => {
            // Refresh participants list if modal is open
            if (isParticipantsModalOpen) {
              // The ParticipantsModal will refetch on its own
            }
          }}
        />
      )}

      {isParticipantsModalOpen && (
        <ParticipantsModal
          competitionId={competition.id}
          competitionTitle={competition.title}
          onClose={() => setIsParticipantsModalOpen(false)}
        />
      )}
    </Card>
  );
}
