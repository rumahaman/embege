import Image from "next/image"
import { Mail } from "lucide-react"

export function SiteFooter() {
  return (
    <footer id="kontak" className="relative overflow-hidden bg-[#EDF2F5] pt-14">
      <div className="border-t border-[#2F3E46]/10 bg-[#2F3E46] py-10 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo-bgn.jpg"
                alt="Logo Badan Gigs Nasional"
                width={32}
                height={32}
                className="size-8 rounded-full object-cover"
              />
              <span className="font-hand text-lg">Badan Gigs Nasional</span>
            </div>
            <p className="max-w-xs font-body text-sm text-white/60">
              Manggung Bergizi Gratis — dipersembahkan oleh Badan Gigs Nasional.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-hand text-lg">Ikuti Perjalanan</p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/badan.gigs.nasional"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Badan Gigs Nasional"
                className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <img src="/icons/instagram.svg" alt="" className="size-4" />
              </a>
              <a
                href="https://open.spotify.com/artist/aldyamis"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Spotify Aldy Amis"
                className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <img src="/icons/spotify.svg" alt="" className="size-4" />
              </a>
              <a
                href="https://youtube.com/@aldyamis"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube Aldy Amis"
                className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <img src="/icons/youtube.svg" alt="" className="size-4" />
              </a>
              <a
                href="mailto:halo@manggungbergizigratis.id"
                aria-label="Email Badan Gigs Nasional"
                className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-[#F6EB35]"
              >
                <Mail className="size-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-6xl border-t border-white/10 px-4 pt-6 sm:px-6">
          <p className="text-center font-body text-xs text-white/50">
            &copy; {new Date().getFullYear()} Badan Gigs Nasional. Masuk dengan sajak, pulang
            dengan cerita.
          </p>
        </div>
      </div>
    </footer>
  )
}
