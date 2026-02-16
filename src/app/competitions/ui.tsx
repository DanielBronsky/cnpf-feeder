'use client';

/**
 * Компонент для списка всех соревнований
 */
import { useQuery } from '@apollo/client';
import { COMPETITIONS_QUERY } from '@/lib/graphql/queries';
import { CompetitionsSection } from '@/components/Competition/CompetitionsSection';
import { LoadingMessage } from '@/components/Feed';
import { Wrap, ErrorText } from '@/app/feed/feed.styles';

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
};

export function CompetitionsListClient({ me }: { me: Me }) {
  const { data, loading, error } = useQuery(COMPETITIONS_QUERY, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  });

  if (loading) {
    return (
      <Wrap>
        <LoadingMessage />
      </Wrap>
    );
  }

  if (error) {
    return (
      <Wrap>
        <ErrorText>{error.message}</ErrorText>
      </Wrap>
    );
  }

  const competitions: Competition[] = data?.competitions || [];

  return (
    <Wrap>
      <CompetitionsSection competitions={competitions} />
    </Wrap>
  );
}
