import type { Metadata } from 'next';
import App from '@/components/App';
import { calculateScores, decodeResponses } from '@/utils/scoring';
import { SHARE_PARAM, SITE_NAME } from '@/lib/site';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const readCode = async (searchParams: PageProps['searchParams']) => {
  const value = (await searchParams)[SHARE_PARAM];
  return typeof value === 'string' ? value : undefined;
};

/** Shared result links get a title and preview image showing that result. */
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const code = await readCode(searchParams);
  const responses = code ? decodeResponses(code) : null;
  if (!code || !responses) return {};

  const result = calculateScores(responses);
  const title = `${result.topIdeology.name} • %${result.matchPercentage} uyum`;
  const description = `Türkiye İdeolojik sonucum: ${result.topIdeology.name}. Sen hangisisin?`;
  const image = { url: `/og?${SHARE_PARAM}=${encodeURIComponent(code)}`, width: 1200, height: 630, alt: title };

  return {
    title: `${title} | Türkiye İdeolojik`,
    description,
    openGraph: { title, description, images: [image], type: 'website', locale: 'tr_TR', siteName: SITE_NAME },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
  };
}

export default async function Page({ searchParams }: PageProps) {
  return <App initialSharedCode={await readCode(searchParams)} />;
}
