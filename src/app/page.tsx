import AppInstallPrompt from "@/components/AppInstallationPrompt";
import SafariInstallBanner from "@/components/SafariInstallBanner";
import WordOfTheDay from "@/components/WordOfTheDay";
import "@/theme/theme.css";

export default function Home() {
  const isIosSafari =
    /iPhone|iPad|iPod/.test(navigator.userAgent) &&
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  return (
    <main className="main-container flex flex-col items-center overflow-x-hidden">
      <AppInstallPrompt />
      {!isIosSafari && <SafariInstallBanner />}
      <WordOfTheDay />
    </main>
  );
}
