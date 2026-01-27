'use client';

/**
 * src/app/admin/competitions/ui.tsx
 * Клиентский UI для управления соревнованиями.
 */
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  CloseButton,
  FieldError,
  Form,
  Label,
  LabelText,
  ModalCard,
  ModalOverlay,
  OkText,
  PrimaryButton,
} from '@/app/feed/feed.styles';
import { ModalTitle, ModalDescription } from '@/components/Feed';
import {
  AddTourButton,
  ArrowIcon,
  BadgeContainer,
  Checkbox,
  CheckboxLabel,
  ClosingBadge,
  CompetitionActions,
  CompetitionCard,
  CompetitionHeader,
  CompetitionInfo,
  CompetitionMeta,
  CompetitionTitle,
  CompetitionsList,
  DateBadge,
  DateDisplay,
  DateTimeInput,
  DateTimeRow,
  EmptyState,
  ErrorText,
  FeeBadge,
  FormatBadge,
  FormatDisplay,
  FormatSection,
  GhostButton,
  InfoLabel,
  InfoRow,
  InfoValue,
  Input,
  InputWithSuffix,
  LimitBadge,
  LoadingMessage,
  LocationBadge,
  MetaLabel,
  MetaRow,
  MetaValue,
  Regulations,
  RegulationsContent,
  RegulationsHeader,
  RegulationsText,
  RegulationsTitle,
  RegulationsToggle,
  RemoveTourButton,
  Textarea,
  TourBadge,
  ToursSection,
} from './competitions.styles';

type Tour = {
  date: string;
  time: string;
};

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

export function AdminCompetitionsClient() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [openRegulations, setOpenRegulations] = useState<Record<string, boolean>>({});

  // Form fields
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [tours, setTours] = useState<Tour[]>([
    { date: '', time: '' },
    { date: '', time: '' },
  ]);
  const [openingDate, setOpeningDate] = useState('');
  const [openingTime, setOpeningTime] = useState('');
  const [individualFormat, setIndividualFormat] = useState(false);
  const [teamFormat, setTeamFormat] = useState(false);
  const [fee, setFee] = useState('');
  const [teamLimit, setTeamLimit] = useState('');
  const [regulations, setRegulations] = useState('');

  // Validation errors
  const [titleErr, setTitleErr] = useState('');
  const [startDateErr, setStartDateErr] = useState('');
  const [endDateErr, setEndDateErr] = useState('');
  const [locationErr, setLocationErr] = useState('');

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
      // Преобразуем "07:30" в "7-30"
      const [hours, minutes] = time.split(':');
      const h = parseInt(hours, 10);
      const m = parseInt(minutes, 10);
      timeStr = `, время ${h}-${m.toString().padStart(2, '0')}`;
    }

    return `${day} ${month} ${year}${timeStr}`;
  }

  async function loadCompetitions() {
    setLoading(true);
    setErr('');
    try {
      const r = await fetch('/api/competitions', { cache: 'no-store' });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error ?? 'Failed to load');
      setCompetitions(data.competitions ?? []);
    } catch (e: any) {
      setErr(e?.message ?? 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCompetitions();
  }, []);

  function openCreate() {
    setEditingId(null);
    setOpen(true);
    setErr('');
    setOk('');
    setTitle('');
    setStartDate('');
    setEndDate('');
    setLocation('');
    setTours([
      { date: '', time: '' },
      { date: '', time: '' },
    ]);
    setOpeningDate('');
    setOpeningTime('');
    setIndividualFormat(false);
    setTeamFormat(false);
    setFee('');
    setTeamLimit('');
    setRegulations('');
    setTitleErr('');
    setStartDateErr('');
    setEndDateErr('');
    setLocationErr('');
  }

  function openEdit(comp: Competition) {
    setEditingId(comp.id);
    setOpen(true);
    setErr('');
    setOk('');
    setTitle(comp.title);
    setStartDate(comp.startDate ? comp.startDate.split('T')[0] : '');
    setEndDate(comp.endDate ? comp.endDate.split('T')[0] : '');
    setLocation(comp.location);
    setTours(
      comp.tours.length > 0
        ? comp.tours.map((t) => ({
            date: t.date ? t.date.split('T')[0] : '',
            time: t.time || '',
          }))
        : [{ date: '', time: '' }],
    );
    setOpeningDate(comp.openingDate ? comp.openingDate.split('T')[0] : '');
    setOpeningTime(comp.openingTime || '');
    setIndividualFormat(comp.individualFormat);
    setTeamFormat(comp.teamFormat);
    setFee(comp.fee ? String(comp.fee) : '');
    setTeamLimit(comp.teamLimit ? String(comp.teamLimit) : '');
    setRegulations(comp.regulations || '');
    setTitleErr('');
    setStartDateErr('');
    setEndDateErr('');
    setLocationErr('');
  }

  function closeModal() {
    setOpen(false);
    setErr('');
    setOk('');
  }

  function addTour() {
    setTours([...tours, { date: '', time: '' }]);
  }

  function removeTour(index: number) {
    if (tours.length > 1) {
      setTours(tours.filter((_, i) => i !== index));
    }
  }

  function updateTour(index: number, field: 'date' | 'time', value: string) {
    const updated = [...tours];
    updated[index] = { ...updated[index], [field]: value };
    setTours(updated);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('onSubmit called', { title, startDate, endDate, location, tours, individualFormat, teamFormat });
    
    setErr('');
    setOk('');
    setTitleErr('');
    setStartDateErr('');
    setEndDateErr('');
    setLocationErr('');

    let bad = false;
    if (title.trim().length < 3) {
      setTitleErr('Название минимум 3 символа');
      bad = true;
    }
    if (!startDate) {
      setStartDateErr('Укажите дату начала');
      bad = true;
    }
    if (!endDate) {
      setEndDateErr('Укажите дату окончания');
      bad = true;
    }
    if (!location.trim()) {
      setLocationErr('Укажите место проведения');
      bad = true;
    }
    
    // Проверка туров - хотя бы один должен быть заполнен
    const validTours = tours.filter((tour) => tour.date && tour.time);
    if (validTours.length === 0) {
      setErr('Заполните хотя бы один тур (дата и время)');
      return;
    }

    if (bad) {
      console.log('Validation failed');
      return;
    }

    // Проверка формата
    if (!individualFormat && !teamFormat) {
      setErr('Выберите хотя бы один формат соревнований');
      return;
    }

    try {
      setErr('');
      setOk('');
      
      console.log('Sending request to /api/competitions');

      const url = editingId ? `/api/competitions/${editingId}` : '/api/competitions';
      const method = editingId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          startDate,
          endDate,
          location,
          tours: validTours,
          openingDate,
          openingTime,
          individualFormat,
          teamFormat,
          fee,
          teamLimit,
          regulations,
        }),
      });

      const data = await response.json().catch(() => ({}));
      
      console.log('Response:', { ok: response.ok, status: response.status, data });

      if (!response.ok) {
        const errorMsg = data?.error ?? 'Ошибка при создании соревнования';
        console.error('Error response:', errorMsg, data);
        throw new Error(errorMsg);
      }

      console.log('Success!');
      setOk(editingId ? 'Соревнование успешно обновлено' : 'Соревнование успешно создано');
      await loadCompetitions();
      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (e: any) {
      setErr(e?.message ?? 'Ошибка при создании соревнования');
    }
  }

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modalContent = open ? (
    <ModalOverlay onClick={closeModal}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <CloseButton type='button' aria-label='Закрыть' onClick={closeModal}>
          ×
        </CloseButton>

        <ModalTitle>
          {editingId ? 'Редактировать соревнование' : 'Создать соревнование'}
        </ModalTitle>
        <ModalDescription>
          {editingId
            ? 'Измените необходимые поля соревнования.'
            : 'Заполните все необходимые поля для создания нового соревнования.'}
        </ModalDescription>

        {err ? <ErrorText>{err}</ErrorText> : null}
        {ok ? <OkText>{ok}</OkText> : null}

        <Form onSubmit={onSubmit}>
          <Label>
            <LabelText>Название соревнования *</LabelText>
            <Input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Введите название соревнования'
            />
            <FieldError $visible={!!titleErr}>{titleErr}</FieldError>
          </Label>

          <Label>
            <LabelText>Дата проведения соревнований *</LabelText>
            <DateTimeRow>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <LabelText style={{ fontSize: 12, marginBottom: 0 }}>
                  Начало
                </LabelText>
                <DateTimeInput
                  type='date'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <FieldError $visible={!!startDateErr}>
                  {startDateErr}
                </FieldError>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <LabelText style={{ fontSize: 12, marginBottom: 0 }}>
                  Окончание
                </LabelText>
                <DateTimeInput
                  type='date'
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                />
                <FieldError $visible={!!endDateErr}>{endDateErr}</FieldError>
              </div>
            </DateTimeRow>
            {startDate && endDate ? (
              <DateDisplay>{formatDateRange(startDate, endDate)}</DateDisplay>
            ) : null}
          </Label>

          <Label>
            <LabelText>Место проведения соревнования *</LabelText>
            <Input
              type='text'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder='Введите место проведения'
            />
            <FieldError $visible={!!locationErr}>{locationErr}</FieldError>
          </Label>

          <ToursSection>
            <Label>
              <LabelText>Начало туров</LabelText>
              {tours.map((tour, index) => (
                <DateTimeRow key={index}>
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    <LabelText style={{ fontSize: 12, marginBottom: 0 }}>
                      Дата {index + 1} тура
                    </LabelText>
                    <DateTimeInput
                      type='date'
                      value={tour.date}
                      onChange={(e) =>
                        updateTour(index, 'date', e.target.value)
                      }
                    />
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    <LabelText style={{ fontSize: 12, marginBottom: 0 }}>
                      Время
                    </LabelText>
                    <DateTimeInput
                      type='time'
                      value={tour.time}
                      onChange={(e) =>
                        updateTour(index, 'time', e.target.value)
                      }
                    />
                  </div>
                  {tours.length > 1 ? (
                    <RemoveTourButton
                      type='button'
                      onClick={() => removeTour(index)}
                    >
                      Удалить
                    </RemoveTourButton>
                  ) : null}
                </DateTimeRow>
              ))}
              {tours.map((tour, index) =>
                tour.date ? (
                  <DateDisplay
                    key={`display-${index}`}
                    style={{ marginTop: 4 }}
                  >
                    {formatDateTime(tour.date, tour.time)}
                  </DateDisplay>
                ) : null,
              )}
              <AddTourButton type='button' onClick={addTour}>
                + Добавить Тур
              </AddTourButton>
            </Label>
          </ToursSection>

          <Label>
            <LabelText>Закрытие соревнований</LabelText>
            <DateTimeRow>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <LabelText style={{ fontSize: 12, marginBottom: 0 }}>
                  Дата
                </LabelText>
                <DateTimeInput
                  type='date'
                  value={openingDate}
                  onChange={(e) => setOpeningDate(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <LabelText style={{ fontSize: 12, marginBottom: 0 }}>
                  Время
                </LabelText>
                <DateTimeInput
                  type='time'
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                />
              </div>
            </DateTimeRow>
            {openingDate ? (
              <DateDisplay>
                {formatDateTime(openingDate, openingTime)}
              </DateDisplay>
            ) : null}
          </Label>

          <Label>
            <LabelText>Формат соревнований</LabelText>
            <FormatSection>
              <CheckboxLabel>
                <span>Индивидуальный</span>
                <Checkbox
                  type='checkbox'
                  checked={individualFormat}
                  onChange={(e) => setIndividualFormat(e.target.checked)}
                />
              </CheckboxLabel>
              <CheckboxLabel>
                <span>Командный: Команда из 3 спортсменов + 1 тренер</span>
                <Checkbox
                  type='checkbox'
                  checked={teamFormat}
                  onChange={(e) => setTeamFormat(e.target.checked)}
                />
              </CheckboxLabel>
              {(individualFormat || teamFormat) && (
                <FormatDisplay>
                  {individualFormat && teamFormat
                    ? 'Индивидуальный и Командный: Команда из 3 спортсменов + 1 тренер'
                    : individualFormat
                      ? 'Индивидуальный'
                      : 'Командный: Команда из 3 спортсменов + 1 тренер'}
                </FormatDisplay>
              )}
            </FormatSection>
          </Label>

          <Label>
            <LabelText>Взнос за участие с одного спортсмена (лей)</LabelText>
            <InputWithSuffix>
              <Input
                type='number'
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                placeholder='0'
                min='0'
              />
            </InputWithSuffix>
          </Label>

          <Label>
            <LabelText>Лимит на участие команд</LabelText>
            <Input
              type='number'
              value={teamLimit}
              onChange={(e) => setTeamLimit(e.target.value)}
              placeholder='0'
              min='0'
            />
            {teamLimit && parseInt(teamLimit) > 0 ? (
              <DateDisplay style={{ marginTop: 8 }}>
                Ограничение регистрации составляет {teamLimit} команд, остальные
                команды вносятся в резерв.
              </DateDisplay>
            ) : null}
          </Label>

          <Label>
            <LabelText>Регламент соревнований</LabelText>
            <Textarea
              value={regulations}
              onChange={(e) => setRegulations(e.target.value)}
              placeholder='Введите регламент соревнований...'
              rows={15}
            />
          </Label>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <PrimaryButton type='submit'>
              {editingId ? 'Сохранить изменения' : 'Создать соревнование'}
            </PrimaryButton>
            <GhostButton type='button' onClick={closeModal}>
              Отмена
            </GhostButton>
          </div>
        </Form>
      </ModalCard>
    </ModalOverlay>
  ) : null;

  async function handleDelete(id: string) {
    if (!confirm('Вы уверены, что хотите удалить это соревнование?')) return;

    try {
      const r = await fetch(`/api/competitions/${id}`, { method: 'DELETE' });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error ?? 'Ошибка удаления');
      await loadCompetitions();
    } catch (e: any) {
      setErr(e?.message ?? 'Ошибка удаления');
    }
  }

  return (
    <>
      <div>
        <h1 style={{ fontSize: 28, letterSpacing: '-0.02em', marginBottom: 8 }}>
          Соревнования
        </h1>
        <p style={{ opacity: 0.75, marginBottom: 16 }}>
          Управление соревнованиями. Создавайте, редактируйте и удаляйте соревнования.
        </p>
        <PrimaryButton type='button' onClick={openCreate}>
          Создать соревнование
        </PrimaryButton>
      </div>

      {err && !open ? <ErrorText style={{ marginTop: 16 }}>{err}</ErrorText> : null}
      {ok && !open ? <OkText style={{ marginTop: 16 }}>{ok}</OkText> : null}

      {loading ? (
        <LoadingMessage>Загрузка соревнований...</LoadingMessage>
      ) : competitions.length === 0 ? (
        <EmptyState>Соревнований пока нет. Создайте первое соревнование!</EmptyState>
      ) : (
        <CompetitionsList>
          {competitions.map((comp) => (
            <CompetitionCard key={comp.id}>
              <CompetitionHeader>
                <div style={{ flex: 1 }}>
                  <CompetitionTitle>{comp.title}</CompetitionTitle>
                  <CompetitionMeta>
                    {comp.startDate && comp.endDate ? (
                      <MetaRow>
                        <MetaLabel>Дата проведения соревнований:</MetaLabel>
                        <MetaValue>
                          <DateBadge>{formatDateRange(comp.startDate, comp.endDate)}</DateBadge>
                        </MetaValue>
                      </MetaRow>
                    ) : null}
                    <MetaRow>
                      <MetaLabel>Место проведения соревнования:</MetaLabel>
                      <MetaValue>
                        <LocationBadge>{comp.location}</LocationBadge>
                      </MetaValue>
                    </MetaRow>
                    {comp.openingDate ? (
                      <MetaRow>
                        <MetaLabel>Закрытие соревнований:</MetaLabel>
                        <MetaValue>
                          <ClosingBadge>
                            {formatDateTime(comp.openingDate, comp.openingTime || '')}
                          </ClosingBadge>
                        </MetaValue>
                      </MetaRow>
                    ) : null}
                  </CompetitionMeta>
                </div>
                <CompetitionActions>
                  <GhostButton type='button' onClick={() => openEdit(comp)}>
                    Редактировать
                  </GhostButton>
                  <GhostButton
                    type='button'
                    onClick={() => handleDelete(comp.id)}
                    style={{
                      background: 'rgba(255, 77, 77, 0.15)',
                      color: 'rgba(255, 77, 77, 0.9)',
                      borderColor: 'rgba(255, 77, 77, 0.3)',
                    }}
                  >
                    Удалить
                  </GhostButton>
                </CompetitionActions>
              </CompetitionHeader>
              <CompetitionInfo>
                <InfoRow>
                  <InfoLabel>Формат соревнований:</InfoLabel>
                  <InfoValue>
                    <BadgeContainer>
                      {comp.individualFormat && comp.teamFormat ? (
                        <>
                          <FormatBadge>Индивидуальный</FormatBadge>
                          <FormatBadge>Командный: Команда из 3 спортсменов + 1 тренер</FormatBadge>
                        </>
                      ) : comp.individualFormat ? (
                        <FormatBadge>Индивидуальный</FormatBadge>
                      ) : comp.teamFormat ? (
                        <FormatBadge>Командный: Команда из 3 спортсменов + 1 тренер</FormatBadge>
                      ) : null}
                    </BadgeContainer>
                  </InfoValue>
                </InfoRow>
                {comp.tours.length > 0 ? (
                  <InfoRow>
                    <InfoLabel>Начало туров:</InfoLabel>
                    <InfoValue>
                      <BadgeContainer>
                        {comp.tours.map((tour, idx) =>
                          tour.date ? (
                            <TourBadge key={idx}>
                              Тур {idx + 1}: {formatDateTime(tour.date, tour.time || '')}
                            </TourBadge>
                          ) : null,
                        )}
                      </BadgeContainer>
                    </InfoValue>
                  </InfoRow>
                ) : null}
                {comp.fee ? (
                  <InfoRow>
                    <InfoLabel>Взнос за участие с одного спортсмена:</InfoLabel>
                    <InfoValue>
                      <FeeBadge>{comp.fee} лей</FeeBadge>
                    </InfoValue>
                  </InfoRow>
                ) : null}
                {comp.teamLimit ? (
                  <InfoRow>
                    <InfoLabel>Лимит на участие команд:</InfoLabel>
                    <InfoValue>
                      <LimitBadge>
                        Ограничение регистрации составляет {comp.teamLimit} команд, остальные команды
                        вносятся в резерв.
                      </LimitBadge>
                    </InfoValue>
                  </InfoRow>
                ) : null}
                {comp.regulations ? (
                  <Regulations>
                    <RegulationsHeader
                      type='button'
                      onClick={() =>
                        setOpenRegulations((prev) => ({
                          ...prev,
                          [comp.id]: !prev[comp.id],
                        }))
                      }
                      aria-expanded={openRegulations[comp.id]}
                    >
                      <RegulationsTitle>Регламент соревнований:</RegulationsTitle>
                      <RegulationsToggle $isOpen={!!openRegulations[comp.id]}>
                        Подробнее
                        <ArrowIcon $isOpen={!!openRegulations[comp.id]} />
                      </RegulationsToggle>
                    </RegulationsHeader>
                    <RegulationsContent $isOpen={!!openRegulations[comp.id]}>
                      <RegulationsText>{comp.regulations}</RegulationsText>
                    </RegulationsContent>
                  </Regulations>
                ) : null}
              </CompetitionInfo>
            </CompetitionCard>
          ))}
        </CompetitionsList>
      )}

      {mounted && typeof window !== 'undefined'
        ? createPortal(modalContent, document.body)
        : null}
    </>
  );
}
