import { BirthdayScroll } from "@/components/BirthdayScroll";
import { PetalParticles } from "@/components/PetalParticles";
import { AmbientMusic } from "@/components/AmbientMusic";
import { TimeGate } from "@/components/TimeGate";

export default function Home() {
  return (
    <TimeGate>
      <main className="relative min-h-screen w-full bg-[#FFF5F7] selection:bg-[#FB7185]/30 selection:text-[#881337] overflow-x-clip">
        {/* Floating SVG Petal Particles */}
        <PetalParticles />

        {/* Romantic Ambient Melody Toggle */}
        <AmbientMusic />

        {/* Scrollytelling Interactive Experience */}
        <BirthdayScroll />
      </main>
    </TimeGate>
  );
}
