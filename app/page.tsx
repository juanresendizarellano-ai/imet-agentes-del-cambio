import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutProgram from "@/components/AboutProgram";
import Benefits from "@/components/Benefits";
import Comparison from "@/components/Comparison";
import Stages from "@/components/Stages";
import Programs from "@/components/Programs";
import ApplicationForm from "@/components/ApplicationForm";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
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
    </>
  );
}
