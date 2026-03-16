'use client';

import WordDetailsDisplay from '@/components/WordDetailsDisplay';
import { useParams } from 'next/navigation';

export default function WordResultPage() {
  const params = useParams();
  const term = typeof params.term === 'string' ? params.term : '';

  return <WordDetailsDisplay term={term} />;
}