'use client';

/**
 * src/components/Competition/CompetitionsSection.tsx
 * Секция соревнований для главной страницы.
 */
import { useEffect, useState } from 'react';
import { SectionDescription, SectionHeader, SectionTitle } from '@/app/feed/feed.styles';
import { CompetitionCard } from './CompetitionCard';
import { List } from '@/app/feed/feed.styles';

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
};

export function CompetitionsSection({ competitions }: { competitions: Competition[] }) {
  if (competitions.length === 0) {
    return null;
  }

  return (
    <>
      <SectionHeader>
        <SectionTitle>Молдавские соревнования</SectionTitle>
        <SectionDescription>
          Здесь отображаются актуальные соревнования по рыболовству, проводимые в Молдове.
          Следите за расписанием, результатами и новостями о предстоящих турнирах.
        </SectionDescription>
      </SectionHeader>
      <List>
        {competitions.map((comp) => (
          <CompetitionCard key={comp.id} competition={comp} />
        ))}
      </List>
    </>
  );
}
