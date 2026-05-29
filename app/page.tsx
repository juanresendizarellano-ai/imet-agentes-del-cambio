import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutProgram from "@/components/AboutProgram";
import Benefits from "@/components/Benefits";
import Comparison from "@/components/Comparison";
import Stages from "@/components/Stages";
import Programs from "@/components/Programs";
import ApplicationForm from "@/components/ApplicationForm";
import Footer from "@/components/Footer";
import VisitTracker from "@/components/VisitTracker";
import UrgencyBanner from "@/components/UrgencyBanner";
import StickyMobileCTA from "@/components/StickyMobileCTA";

export default function HomePage() {
  return (
    <>
      <VisitTracker />
      {/* Wrapper sticky: banner + header viajan juntos en la parte superior */}
      <div className="sticky top-0 z-40">
        <UrgencyBanner />
        <Header />
      </div>
      <main>
        <Hero />
        <AboutProgram />
        <Benefits />
        <Comparison />
        <Stages />
        <Programs />
        <ApplicationForm />
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
