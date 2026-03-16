import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { term: string };
}): Promise<Metadata> {
  const word = params.term;

  const res = await fetch(`https://grab-vocab-1.vercel.app/api/define/${word}`);
  const data = await res.json();

  const title = `Learn "${data.result?.word || word}" - GrabVocab`;
  const description =
    data.result?.meaning || "Expand your vocabulary with GrabVocab.";
  const image =
    data.result?.imageURL ||
    "https://preply.com/wp-content/uploads/2018/04/word.jpg";
  const url = `https://grab-vocab-1.vercel.app/word/${word}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
      url,
      siteName: "GrabVocab",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    metadataBase: new URL("https://grab-vocab-1.vercel.app"),
    alternates: {
      canonical: url,
    },
  };
}
