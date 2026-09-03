import type { Metadata } from "next"
import { phoneNumber } from "@/lib/site"

export const metadata: Metadata = {
  title: "Adatvédelmi tájékoztató – Zalaegerszegi Nordmann Fenyők",
  description: "Adatvédelmi tájékoztató — hogyan kezeljük személyes adatait (GDPR).",
}

export default function AdatvedelemPage() {
  return (
    <div className="bg-[#ededed] min-h-[calc(100vh-4rem)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#6e7f6a] mb-3">GDPR tájékoztató</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3a3a3a] tracking-tight mb-2">
          Adatvédelmi tájékoztató
        </h1>
        <p className="text-sm text-[#4a4f4a]/60 mb-10">
          Utolsó frissítés: 2026. szeptember 3. &nbsp;·&nbsp; EU 2016/679 (GDPR) alapján
        </p>

        <div className="space-y-8 text-[#4a4f4a]">

          <section>
            <h2 className="text-base font-bold text-[#3a3a3a] mb-2">1. Adatkezelő</h2>
            <p className="text-sm leading-relaxed font-light">
              Zalaegerszegi Nordmann Fenyők (magánszemély, nem gazdasági társaság).
              Kapcsolat: <strong>{phoneNumber}</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#3a3a3a] mb-2">2. Kezelt adatok és céljaik</h2>
            <p className="text-sm leading-relaxed font-light mb-3">
              Az időpontfoglalás során az alábbi adatokat rögzítjük:
            </p>
            <div className="bg-white border border-[#bfc3c7] rounded-xl overflow-hidden">
              {[
                ["Név", "A foglalás azonosítása, kapcsolattartás"],
                ["Telefonszám", "Kapcsolattartás, egyeztetés"],
                ["E-mail-cím", "Foglalás visszaigazolása"],
                ["Látogatás dátuma", "Időpont-kezelés"],
                ["Fenyők száma", "Felkészülés a látogatáshoz"],
                ["Fénykép a kijelölt fáról", "A foglaláshoz tartozó fa azonosítása (admin adminisztráció)"],
              ].map(([adat, cel], i) => (
                <div key={adat} className={`flex gap-4 px-5 py-3 text-sm ${i !== 0 ? "border-t border-[#bfc3c7]" : ""}`}>
                  <span className="font-medium text-[#3a3a3a] w-36 flex-shrink-0">{adat}</span>
                  <span className="font-light">{cel}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#3a3a3a] mb-2">3. Jogalap</h2>
            <p className="text-sm leading-relaxed font-light">
              Az adatkezelés jogalapja a GDPR 6. cikk (1) b) pontja: az adatkezelés olyan szerződés
              teljesítéséhez szükséges, amelynek az érintett az egyik fele (foglalás létrehozása és kezelése).
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#3a3a3a] mb-2">4. Megőrzési idő</h2>
            <p className="text-sm leading-relaxed font-light">
              A foglalási adatokat a szezon lezárultát követően töröljük, legkésőbb az adott naptári év végéig.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#3a3a3a] mb-2">5. Sütik (cookies)</h2>
            <p className="text-sm leading-relaxed font-light">
              Az oldal kizárólag szükséges (elengedhetetlen) sütiket használ: az admin felület
              bejelentkezési munkamenetét és az admin által kiválasztott szezon-nézetet tároló sütiket.
              Ezek az oldal alapvető működéséhez elengedhetetlenek, nem szolgálnak látogatáskövetést vagy
              hirdetési célt, ezért az ePrivacy szabályok alapján nem igényelnek külön hozzájárulást.
              Az oldal nem használ analitikai, marketing- vagy követő sütiket.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#3a3a3a] mb-2">6. Adattovábbítás és adatfeldolgozók</h2>
            <p className="text-sm leading-relaxed font-light mb-3">
              Személyes adataidat harmadik félnek nem adjuk el és nem adjuk át marketingcélra. Az alábbi
              adatfeldolgozókat vesszük igénybe a foglalási folyamat működtetéséhez:
            </p>
            <div className="bg-white border border-[#bfc3c7] rounded-xl overflow-hidden mb-3">
              <div className="px-5 py-3 text-sm">
                <span className="font-medium text-[#3a3a3a]">Contabo GmbH</span>
                <span className="font-light"> — tárhelyszolgáltatás, az oldal európai (EU) adatközpontban üzemel.</span>
              </div>
              <div className="px-5 py-3 text-sm border-t border-[#bfc3c7]">
                <span className="font-medium text-[#3a3a3a]">Resend</span>
                <span className="font-light"> — a foglalás visszaigazoló és értesítő e-mailek kiküldése.</span>
              </div>
              <div className="px-5 py-3 text-sm border-t border-[#bfc3c7]">
                <span className="font-medium text-[#3a3a3a]">Cloudinary</span>
                <span className="font-light"> — a kijelölt fáról készült fénykép tárolása a foglaláshoz.</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed font-light">
              A tárhelyszolgáltatás európai uniós adatközpontban történik, így ehhez nem szükséges
              EU-n/EGT-n kívülre történő adattovábbítás. A Resend és a Cloudinary amerikai egyesült
              államokbeli szolgáltatók; az általuk végzett adatkezelés jogszerűségét az Európai Bizottság
              által jóváhagyott általános adatvédelmi szerződési feltételek (Standard Contractual Clauses,
              SCC), valamint mindkét szolgáltató esetében az EU–U.S. Data Privacy Framework keretrendszernek
              való megfelelés biztosítja.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#3a3a3a] mb-2">7. Szerver naplók</h2>
            <p className="text-sm leading-relaxed font-light mb-3">
              A weboldal működésének biztosítása, hibakeresés, valamint a rendszer biztonságának és a
              visszaélések megelőzésének céljából a szerver technikai naplóadatokat kezelhet.
            </p>
            <p className="text-sm leading-relaxed font-light mb-2">
              A naplóadatok különösen az alábbiakat tartalmazhatják:
            </p>
            <ul className="space-y-1.5 text-sm font-light mb-3">
              {[
                "a látogató IP-címe",
                "a kérés időpontja",
                "a kért URL vagy erőforrás",
                "a HTTP válasz státuszkódja",
                "valamint egyéb, a kérés feldolgozásához kapcsolódó technikai információk",
              ].map((item) => (
                <li key={item} className="flex gap-2 items-baseline">
                  <span className="text-[#6e7f6a] flex-shrink-0">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm leading-relaxed font-light mb-3">
              A szerver- és alkalmazásnaplók automatikus, méretalapú rotációval kerülnek kezelésre, ezért
              megőrzési idejük nem előre meghatározott napok számában történik, hanem a keletkező
              naplóadatok mennyiségétől függ. A rendszer csak korlátozott mennyiségű korábbi naplóállományt
              őriz meg, a régebbi naplóállományok automatikusan felülírásra vagy törlésre kerülnek.
            </p>
            <p className="text-sm leading-relaxed font-light">
              A naplóadatok nem kerülnek felhasználásra marketing- vagy profilalkotási célokra.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#3a3a3a] mb-2">8. Jogaid</h2>
            <p className="text-sm leading-relaxed font-light mb-3">A GDPR alapján az alábbi jogok illetnek meg:</p>
            <ul className="space-y-1.5 text-sm font-light">
              {[
                "Hozzáférés — kérheted az adataidról szóló tájékoztatást",
                "Helyesbítés — kérheted pontatlan adataid javítását",
                "Törlés — kérheted adataid törlését (\"elfeledtetéshez való jog\")",
                "Korlátozás — kérheted az adatkezelés korlátozását",
                "Hordozhatóság — kérheted adataidat géppel olvasható formában",
                "Tiltakozás — tiltakozhatsz az adatkezelés ellen",
              ].map((item) => (
                <li key={item} className="flex gap-2 items-baseline">
                  <span className="text-[#6e7f6a] flex-shrink-0">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm leading-relaxed font-light mt-3">
              Jogaid gyakorlásához írj vagy hívj: <strong>{phoneNumber}</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#3a3a3a] mb-2">9. Felügyeleti hatóság</h2>
            <p className="text-sm leading-relaxed font-light">
              Ha úgy érzed, hogy adataidat jogellenesen kezeljük, panaszt tehetsz a Nemzeti Adatvédelmi
              és Információszabadság Hatóságnál (NAIH):{" "}
              <a
                href="https://naih.hu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6e7f6a] underline underline-offset-2"
              >
                naih.hu
              </a>
              .
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
