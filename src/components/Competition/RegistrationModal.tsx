'use client';

/**
 * Компонент модального окна для регистрации на соревнование
 */
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useMutation } from '@apollo/client';
import { CREATE_REGISTRATION_MUTATION } from '@/lib/graphql/mutations';
import {
  ModalOverlay,
  ModalCard,
  CloseButton,
  Form,
  Label,
  LabelText,
  Input,
  PrimaryButton,
  FieldError,
  ErrorText,
  OkText,
} from '@/app/feed/feed.styles';
import { ModalTitle, ModalDescription } from '@/components/Feed';
import styled from 'styled-components';

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: var(--input-bg);
  color: var(--text);
  font-size: 14px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: rgba(99, 102, 241, 0.5);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  cursor: pointer;
  user-select: none;
  justify-content: flex-start;
`;

const CheckboxLabel = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: var(--text);
  opacity: 0.9;
  order: -1;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin: 0;
  accent-color: rgba(99, 102, 241, 0.8);
  flex-shrink: 0;
  order: 1;
`;

const ParticipantsSection = styled.div`
  margin-top: 16px;
  display: grid;
  gap: 12px;
`;

const ParticipantRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const SectionTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: rgba(99, 102, 241, 0.9);
`;

type RegistrationModalProps = {
  competitionId: string;
  competitionTitle: string;
  individualFormat: boolean;
  teamFormat: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function RegistrationModal({
  competitionId,
  competitionTitle,
  individualFormat,
  teamFormat,
  onClose,
  onSuccess,
}: RegistrationModalProps) {
  const [mounted, setMounted] = useState(false);
  const [type, setType] = useState<'individual' | 'team'>(
    individualFormat && !teamFormat ? 'individual' : 'team'
  );
  const [teamName, setTeamName] = useState('');
  const [participants, setParticipants] = useState([
    { firstName: '', lastName: '' },
    { firstName: '', lastName: '' },
    { firstName: '', lastName: '' },
  ]);
  const [hasCoach, setHasCoach] = useState(false);
  const [coach, setCoach] = useState({ firstName: '', lastName: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ok, setOk] = useState('');

  const [createRegistration, { loading }] = useMutation(CREATE_REGISTRATION_MUTATION, {
    onCompleted: () => {
      setOk('Регистрация успешно создана!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    },
    onError: (error) => {
      setErrors({ submit: error.message });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setOk('');

    // Validation
    const newErrors: Record<string, string> = {};

    if (type === 'team') {
      if (!teamName.trim()) {
        newErrors.teamName = 'Название команды обязательно';
      }
      if (participants.some((p, idx) => idx < 3 && (!p.firstName.trim() || !p.lastName.trim()))) {
        newErrors.participants = 'Заполните данные всех трех участников';
      }
      if (hasCoach && (!coach.firstName.trim() || !coach.lastName.trim())) {
        newErrors.coach = 'Заполните имя и фамилию тренера';
      }
    } else {
      if (!participants[0].firstName.trim() || !participants[0].lastName.trim()) {
        newErrors.participants = 'Заполните имя и фамилию спортсмена';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare data
    const participantsData = type === 'team' 
      ? participants.slice(0, 3)
      : [participants[0]];

    const coachData = type === 'team' && hasCoach ? {
      firstName: coach.firstName.trim(),
      lastName: coach.lastName.trim(),
    } : null;

    createRegistration({
      variables: {
        input: {
          competitionId,
          type,
          teamName: type === 'team' ? teamName.trim() : null,
          participants: participantsData.map(p => ({
            firstName: p.firstName.trim(),
            lastName: p.lastName.trim(),
          })),
          coach: coachData,
        },
      },
    });
  };

  const updateParticipant = (index: number, field: 'firstName' | 'lastName', value: string) => {
    const newParticipants = [...participants];
    newParticipants[index] = { ...newParticipants[index], [field]: value };
    setParticipants(newParticipants);
  };

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
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <CloseButton type="button" aria-label="Закрыть" onClick={onClose}>
          ×
        </CloseButton>

        <ModalTitle>Регистрация на соревнование</ModalTitle>
        <ModalDescription>{competitionTitle}</ModalDescription>

        <Form onSubmit={handleSubmit}>
          <Label>
            <LabelText>Формат регистрации:</LabelText>
            <Select
              value={type}
              onChange={(e) => {
                setType(e.target.value as 'individual' | 'team');
                setErrors({});
              }}
              disabled={!individualFormat || !teamFormat}
            >
              {individualFormat && <option value="individual">Индивидуальный</option>}
              {teamFormat && <option value="team">Командный</option>}
            </Select>
          </Label>

          {type === 'team' && (
            <Label>
              <LabelText>Название команды:</LabelText>
              <Input
                type="text"
                value={teamName}
                onChange={(e) => {
                  setTeamName(e.target.value);
                  setErrors({ ...errors, teamName: '' });
                }}
                placeholder="Введите название команды"
              />
              {errors.teamName && <FieldError>{errors.teamName}</FieldError>}
            </Label>
          )}

          <ParticipantsSection>
            <SectionTitle>
              {type === 'team' ? 'Участники команды (3 человека):' : 'Данные спортсмена:'}
            </SectionTitle>
            {(type === 'team' ? participants.slice(0, 3) : [participants[0]]).map((p, idx) => (
              <ParticipantRow key={idx}>
                <Label>
                  <LabelText>Имя {type === 'team' ? `участника ${idx + 1}` : 'спортсмена'}:</LabelText>
                  <Input
                    type="text"
                    value={p.firstName}
                    onChange={(e) => {
                      updateParticipant(idx, 'firstName', e.target.value);
                      setErrors({ ...errors, participants: '' });
                    }}
                    placeholder="Имя"
                  />
                </Label>
                <Label>
                  <LabelText>Фамилия {type === 'team' ? `участника ${idx + 1}` : 'спортсмена'}:</LabelText>
                  <Input
                    type="text"
                    value={p.lastName}
                    onChange={(e) => {
                      updateParticipant(idx, 'lastName', e.target.value);
                      setErrors({ ...errors, participants: '' });
                    }}
                    placeholder="Фамилия"
                  />
                </Label>
              </ParticipantRow>
            ))}
            {errors.participants && <FieldError>{errors.participants}</FieldError>}
          </ParticipantsSection>

          {type === 'team' && (
            <>
              <CheckboxContainer htmlFor="hasCoach">
                <CheckboxLabel>Добавить тренера</CheckboxLabel>
                <Checkbox
                  type="checkbox"
                  id="hasCoach"
                  checked={hasCoach}
                  onChange={(e) => {
                    setHasCoach(e.target.checked);
                    if (!e.target.checked) {
                      setCoach({ firstName: '', lastName: '' });
                    }
                    setErrors({ ...errors, coach: '' });
                  }}
                />
              </CheckboxContainer>

              {hasCoach && (
                <ParticipantRow>
                  <Label>
                    <LabelText>Имя тренера:</LabelText>
                    <Input
                      type="text"
                      value={coach.firstName}
                      onChange={(e) => {
                        setCoach({ ...coach, firstName: e.target.value });
                        setErrors({ ...errors, coach: '' });
                      }}
                      placeholder="Имя тренера"
                    />
                  </Label>
                  <Label>
                    <LabelText>Фамилия тренера:</LabelText>
                    <Input
                      type="text"
                      value={coach.lastName}
                      onChange={(e) => {
                        setCoach({ ...coach, lastName: e.target.value });
                        setErrors({ ...errors, coach: '' });
                      }}
                      placeholder="Фамилия тренера"
                    />
                  </Label>
                </ParticipantRow>
              )}
              {errors.coach && <FieldError>{errors.coach}</FieldError>}
            </>
          )}

          {errors.submit && <ErrorText>{errors.submit}</ErrorText>}
          {ok && <OkText>{ok}</OkText>}

          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Сохранение...' : 'Сохранить'}
          </PrimaryButton>
        </Form>
      </ModalCard>
    </ModalOverlay>
  );

  return typeof document !== 'undefined' && document.body
    ? createPortal(modalContent, document.body)
    : null;
}
