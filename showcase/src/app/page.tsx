import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PipelineSection from "@/components/PipelineSection";
import GallerySection from "@/components/GallerySection";
import ExperimentsSection from "@/components/ExperimentsSection";
import CLISection from "@/components/CLISection";
import ChallengesSection from "@/components/ChallengesSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <PipelineSection />
        <GallerySection />
        <ExperimentsSection />
        <CLISection />
        <ChallengesSection />
      </main>
      <Footer />
    </>
  );
}
