import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import StatsSection from "./components/StatsSection";
import ServicesSection from "./components/ServicesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import WorkflowSection from "./components/WorkflowSection";
import RolesSection from "./components/RolesSection";
import FinanceSection from "./components/FinanceSection";
import TestimonialsSection from "./components/TestimonialsSection";
import RegistrationForm from "./components/RegistrationForm";
import FooterSection from "./components/FooterSection";

export default function HomePage() {
  return (
    <div className="min-h-screen font-sans" style={{fontFamily:"'Tajawal', sans-serif"}}>
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <HowItWorksSection />
      <WorkflowSection />
      <RolesSection />
      <FinanceSection />
      <TestimonialsSection />
      <RegistrationForm />
      <FooterSection />
    </div>
  );
}
