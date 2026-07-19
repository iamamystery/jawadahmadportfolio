import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import FounderCore from "@/components/sections/FounderCore";
import Expertise from "@/components/sections/Expertise";
import Projects from "@/components/sections/Projects";
import SystemsGallery from "@/components/sections/SystemsGallery";
import Vault from "@/components/sections/Vault";
import Phantex from "@/components/sections/Phantex";
import KnowledgeHub from "@/components/sections/KnowledgeHub";
import Timeline from "@/components/sections/Timeline";
import ProofOfWork from "@/components/sections/ProofOfWork";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <FounderCore />
      <Expertise />
      <Projects />
      <SystemsGallery />
      <Vault />
      <Phantex />
      <KnowledgeHub />
      <Timeline />
      <ProofOfWork />
      <Contact />
      <Footer />
    </main>
  );
}
