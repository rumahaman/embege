import { CtaBannerSection } from "@/components/mbg/cta-banner-section"
import { HeroSection } from "@/components/mbg/hero-section"
import { IkutiPerjalananSection } from "@/components/mbg/ikuti-perjalanan-section"
import { LokasiAcaraSection } from "@/components/mbg/lokasi-acara-section"
import { ReservationDialogProvider } from "@/components/mbg/reservation-dialog-provider"
import { SetorSajakSection } from "@/components/mbg/setor-sajak-section"
import { SiteFooter } from "@/components/mbg/site-footer"
import { SiteHeader } from "@/components/mbg/site-header"
import { TentangAcaraSection } from "@/components/mbg/tentang-acara-section"

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <LokasiAcaraSection />
        <TentangAcaraSection />
        <SetorSajakSection />
        <CtaBannerSection />
        <IkutiPerjalananSection />
      </main>
      <SiteFooter />
      <ReservationDialogProvider />
    </>
  )
}
