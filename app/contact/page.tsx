import { Phone, MapPin, Facebook } from "lucide-react"
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll"

export default function ContactPage() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="pt-14 sm:pt-20 pb-8 bg-[#6e7f6a]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="section-label">Kapcsolat</div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#3a3a3a] mb-4 tracking-tight">Elérhetőség</h1>
            <p className="text-lg text-[#4a4f4a] font-light max-w-xl">
              Telefonon elérhetők vagyunk. GPS-koordinátákkal megtalálsz.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Contact Info */}
      <section className="pt-8 pb-14 sm:pb-20 bg-[#ededed]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Phone */}
            <AnimateOnScroll delay={0} className="h-full">
              <div className="border border-[#bfc3c7] bg-[#f5f4f1] rounded-lg p-8 h-full">
                <Phone className="h-6 w-6 text-[#6e7f6a] mb-4" />
                <h3 className="font-semibold text-[#3a3a3a] mb-2 tracking-tight">Telefonszám</h3>
                <p className="text-2xl font-bold text-[#3a3a3a] mb-2 tracking-tight">+36 (30) 123 4567</p>
                <p className="text-sm text-[#4a4f4a] font-light">Szombat–vasárnap, 10:00–12:00</p>
              </div>
            </AnimateOnScroll>

            {/* Contact Person */}
            <AnimateOnScroll delay={100} className="h-full">
              <div className="border border-[#bfc3c7] bg-[#f5f4f1] rounded-lg p-8 h-full">
                <MapPin className="h-6 w-6 text-[#6e7f6a] mb-4" />
                <h3 className="font-semibold text-[#3a3a3a] mb-2 tracking-tight">A helyszínen</h3>
                <p className="text-[#4a4f4a] font-light mb-2">
                  A foglalási napokon 10–12 között mindig ott vagyunk a fenyvesben.
                </p>
                <p className="text-sm text-[#4a4f4a] font-light">Egyéb időpontban előre egyeztess.</p>
              </div>
            </AnimateOnScroll>

            {/* Facebook */}
            <AnimateOnScroll delay={200} className="h-full">
              <div className="border border-[#bfc3c7] bg-[#f5f4f1] rounded-lg p-8 h-full">
                <Facebook className="h-6 w-6 text-[#6e7f6a] mb-4" />
                <h3 className="font-semibold text-[#3a3a3a] mb-2 tracking-tight">Facebook</h3>
                <p className="text-[#4a4f4a] font-light">Képek és hírek az idei szezonról.</p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-14 sm:py-20 bg-[#6e7f6a]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="section-label">Megközelítés</div>
            <h2 className="text-3xl font-bold text-[#3a3a3a] mb-8 tracking-tight">A helyszín</h2>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Map */}
            <AnimateOnScroll>
              <div className="rounded-lg overflow-hidden h-96 bg-[#6e7f6a]/20">
                <iframe
                  title="Zalaegerszeg map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2717.1234567890!2d16.8412!3d46.8206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476551234567%3A0x1234567890abcdef!2sZalaegerszeg!5e0!3m2!1shu!2shu!4v1234567890"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </AnimateOnScroll>

            {/* Info */}
            <AnimateOnScroll delay={150}>
              <p className="text-[#4a4f4a] font-light mb-6">
                Nincs utcacím, nincs házszám. Egy kis erdő Zalaegerszeg határán. GPS-koordinátákkal érkezhetsz — ezt
                a foglalás visszaigazolásában küldjük el.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Zalaegerszeg északi részéről közelítsd meg, a 74-es főút irányából.",
                  "Egy rövid földúton kell behajtani — normál autóval simán járható.",
                  "Parkolás ingyen, közvetlenül a fenyvesnél. Pár autónak van hely.",
                  "Ha elvéted az utat, hívj — megtalálunk.",
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-[#6e7f6a] font-bold text-sm tabular-nums flex-shrink-0 mt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[#4a4f4a] font-light">{item}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://maps.google.com/?q=Zalaegerszeg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer inline-flex items-center justify-center h-12 px-7 text-base font-semibold rounded-lg bg-[#4a4f4a] text-[#ededed] hover:bg-[#4a4f4a]/90 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(74,79,74,0.25)] active:translate-y-0 active:shadow-none transition-all duration-200"
                >
                  Térkép és megközelítés
                </a>
                <a
                  href="https://www.facebook.com/karacsonyfak"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer inline-flex items-center justify-center h-12 px-7 text-base font-normal rounded-lg border border-[#4a4f4a]/30 text-[#4a4f4a]/70 hover:text-[#4a4f4a] hover:border-[#4a4f4a]/60 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  Kövess Facebookon
                </a>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>
    </div>
  )
}
