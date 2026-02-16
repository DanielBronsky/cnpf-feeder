'use client';

/**
 * Компонент модального окна для просмотра списка участников соревнования
 */
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useQuery } from '@apollo/client';
import { REGISTRATIONS_QUERY } from '@/lib/graphql/queries';
import {
  ModalOverlay,
  ModalCard,
  CloseButton,
  ErrorText,
} from '@/app/feed/feed.styles';
import { ModalTitle, LoadingMessage } from '@/components/Feed';
import styled from 'styled-components';

const ParticipantsList = styled.div`
  margin-top: 20px;
  display: grid;
  gap: 16px;
`;

const RegistrationCard = styled.div`
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.03);
`;

const RegistrationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const TypeBadge = styled.span<{ $isTeam: boolean }>`
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  background: ${({ $isTeam }) =>
    $isTeam
      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)'
      : 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.2) 100%)'};
  color: ${({ $isTeam }) =>
    $isTeam ? 'rgba(167, 139, 250, 0.95)' : 'rgba(134, 239, 172, 0.95)'};
  border: 1px solid
    ${({ $isTeam }) =>
      $isTeam ? 'rgba(99, 102, 241, 0.3)' : 'rgba(34, 197, 94, 0.3)'};
`;

const TeamName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 12px;
`;

const ParticipantsSection = styled.div`
  margin-top: 12px;
`;

const SectionLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  opacity: 0.7;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ParticipantItem = styled.div`
  padding: 8px 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid var(--border-soft);

  &:last-child {
    border-bottom: none;
  }
`;

const CoachSection = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-soft);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  opacity: 0.6;
  font-size: 15px;
`;

type ParticipantsModalProps = {
  competitionId: string;
  competitionTitle: string;
  onClose: () => void;
};

export function ParticipantsModal({
  competitionId,
  competitionTitle,
  onClose,
}: ParticipantsModalProps) {
  const { data, loading, error, refetch } = useQuery(REGISTRATIONS_QUERY, {
    variables: { competitionId },
    fetchPolicy: 'cache-and-network',
  });

  const registrations = data?.registrations || [];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prevent body scroll when modal is open
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, []);

  if (!mounted || typeof document === 'undefined') return null;

  const modalContent = (
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <CloseButton type="button" aria-label="Закрыть" onClick={onClose}>
          ×
        </CloseButton>

        <ModalTitle>Участники соревнования</ModalTitle>
        <div style={{ opacity: 0.7, fontSize: '14px', marginTop: '8px' }}>
          {competitionTitle}
        </div>

        {loading && <LoadingMessage />}
        {error && <ErrorText>{error.message}</ErrorText>}

        {!loading && !error && (
          <>
            {registrations.length === 0 ? (
              <EmptyState>Пока нет зарегистрированных участников</EmptyState>
            ) : (
              <ParticipantsList>
                {registrations.map((registration: any) => (
                  <RegistrationCard key={registration.id}>
                    <RegistrationHeader>
                      <TypeBadge $isTeam={registration.type === 'team'}>
                        {registration.type === 'team' ? 'Команда' : 'Индивидуальный'}
                      </TypeBadge>
                    </RegistrationHeader>

                    {registration.type === 'team' && registration.teamName && (
                      <TeamName>{registration.teamName}</TeamName>
                    )}

                    <ParticipantsSection>
                      <SectionLabel>Участники:</SectionLabel>
                      {registration.participants.map(
                        (participant: any, idx: number) => (
                          <ParticipantItem key={idx}>
                            {participant.firstName} {participant.lastName}
                          </ParticipantItem>
                        ),
                      )}
                    </ParticipantsSection>

                    {registration.type === 'team' && registration.coach && (
                      <CoachSection>
                        <SectionLabel>Тренер:</SectionLabel>
                        <ParticipantItem>
                          {registration.coach.firstName} {registration.coach.lastName}
                        </ParticipantItem>
                      </CoachSection>
                    )}
                  </RegistrationCard>
                ))}
              </ParticipantsList>
            )}
          </>
        )}
      </ModalCard>
    </ModalOverlay>
  );

  return typeof document !== 'undefined' && document.body
    ? createPortal(modalContent, document.body)
    : null;
}
