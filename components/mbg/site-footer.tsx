import Image from "next/image"

export function SiteFooter() {
  return (
    <footer id="kontak" className="relative overflow-hidden bg-[#2F3E46] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Identity */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo-bgn.jpg"
                alt="Logo Badan Gigs Nasional"
                width={40}
                height={40}
                className="size-10 rounded-full object-cover"
              />

              <div>
                <p className="font-hand text-xl leading-none text-white">
                  Manggung Bergizi Gratis
                </p>

                <p className="mt-1 font-body text-sm text-white/60">
                  Dipersembahkan oleh
                </p>

                <p className="font-body text-sm font-semibold text-white/80">
                  Badan Gigs Nasional
                </p>
              </div>
            </div>
          </div>

          {/* Closing statement */}
          <div className="max-w-sm md:text-right">
            <p className="font-hand text-2xl leading-tight text-white/80 sm:text-3xl">
              Musik, sajak, dan
              <br />
              perjumpaan manusia.
            </p>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-center font-body text-xs text-white/45">
            &copy; {new Date().getFullYear()} Badan Gigs Nasional
          </p>
        </div>
      </div>
    </footer>
  )
}