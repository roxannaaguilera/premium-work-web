import FixedHeader from "@/components/chrome/FixedHeader";
import { WhyUs } from "@/components/WhyUs";

/**
 * Vista «Nosotros»: la sección de ventajas de la antigua principal,
 * ahora en su propia página.
 */
export default function NosotrosPage() {
  return (
    <>
      <FixedHeader />
      <main className="min-h-screen bg-[#faf6ee]">
        <div aria-hidden="true" className="h-28 md:h-48" />
        <WhyUs />
      </main>
    </>
  );
}
