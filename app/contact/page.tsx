import { Phone, MapPin, Facebook } from "lucide-react"
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll"

export default function ContactPage() {
  return (
    <div className="w-full">

      {/* Hero + Contact Info */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center bg-[#ededed]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
          <AnimateOnScroll>
            <div className="section-label justify-center sm:justify-start">Kapcsolat</div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#3a3a3a] mb-4 tracking-tight text-center sm:text-left">Elérhetőség</h1>
            <p className="text-lg text-[#4a4f4a] font-light max-w-xl mb-12 text-center sm:text-left">
              Telefonon elérhetők vagyunk. GPS-koordinátákkal megtalálsz.
            </p>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <AnimateOnScroll delay={0} className="h-full">
              <div className="border border-[#bfc3c7] bg-[#f5f4f1] rounded-lg p-8 h-full">
                <Phone className="h-6 w-6 text-[#6e7f6a] mb-4" />
                <h3 className="font-semibold text-[#3a3a3a] mb-2 tracking-tight">Telefonszám</h3>
                <p className="text-2xl font-bold text-[#3a3a3a] mb-2 tracking-tight">+36 (30) 123 4567</p>
                <p className="text-sm text-[#4a4f4a] font-light">Szombat–vasárnap, 10:00–12:00</p>
              </div>
            </AnimateOnScroll>

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
      <section className="min-h-screen flex items-center bg-[#6e7f6a]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
          <AnimateOnScroll>
            <div className="section-label justify-center">Megközelítés</div>
            <h2 className="text-3xl font-bold text-[#3a3a3a] mb-8 tracking-tight text-center">A helyszín</h2>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <AnimateOnScroll>
              <div className="rounded-lg overflow-hidden h-96 bg-[#6e7f6a]/20">
                <iframe
                  title="Zalaegerszeg map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src="https://maps.google.com/maps?q=46.8981178,16.793078&z=15&output=embed"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </AnimateOnScroll>

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
                  href="https://www.google.com/maps/@46.8981178,16.793078,3a,75y,131.58h,73.3t/data=!3m7!1e1!3m5!1s-hT2m-kiN5YvOSq8pHqw9w!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D16.704629455204085%26panoid%3D-hT2m-kiN5YvOSq8pHqw9w%26yaw%3D131.58103283271973!7i16384!8i8192"
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
