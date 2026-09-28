import { ArrowRight } from "lucide-react"

const socialLinks = [
  {
    name: "Instagram",
    handle: "@badan.gigs.nasional",
    href: "https://instagram.com/badan.gigs.nasional",
    icon: "/icons/instagram.svg",
    ariaLabel: "Instagram Badan Gigs Nasional",
  },
  {
    name: "Spotify",
    handle: "Aldy Amis",
    href: "https://open.spotify.com/artist/1cH4Kfu1QYyTnmAgEt1j8V",
    icon: "/icons/spotify.svg",
    ariaLabel: "Spotify Aldy Amis",
  },
  {
    name: "YouTube",
    handle: "@aldyamis",
    href: "https://youtube.com/@aldyamis",
    icon: "/icons/youtube.svg",
    ariaLabel: "YouTube Aldy Amis",
  },
]

export function IkutiPerjalananSection() {
  return (
    <section
      id="ikuti-perjalanan"
      aria-labelledby="ikuti-perjalanan-title"
      className="relative overflow-hidden bg-[#A9C1CC] py-14 sm:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8">
          <h2
            id="ikuti-perjalanan-title"
            className="mt-2 font-heading text-5xl leading-none text-[#2F3E46] sm:text-6xl"
          >
            Ikuti Perjalanan
          </h2>

          <p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-[#2F3E46]/65 sm:text-base">
            Empat kota. Satu ruang temu. Ikuti kabar, musik, dan cerita dari
            perjalanan Manggung Bergizi Gratis.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.ariaLabel}
              className="group flex items-center justify-between border border-white/35 bg-white/15 px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/25"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white">
                  <img
                    src={social.icon}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="size-6 object-contain"
                  />
                </div>

                <div>
                  <p className="font-body text-base font-semibold text-[#2F3E46]">
                    {social.name}
                  </p>

                  <p className="font-body text-sm text-[#2F3E46]/60">
                    {social.handle}
                  </p>
                </div>
              </div>

              <ArrowRight className="size-5 text-[#2F3E46] transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}