export type Venue = {
  id: string
  name: string
  city: string
  date: string
  dateShort: string
  quota: number
  image: string
  mapsUrl: string
}

export const venues: Venue[] = [
  {
    id: "ruang-rumi",
    name: "SPPG Ruang Rumi",
    city: "Kabupaten Tangerang",
    date: "15 Oktober 2026",
    dateShort: "15 Okt",
    quota: 100,
    image: "/images/venue-ruang-rumi.jpg",
    mapsUrl: "https://maps.app.goo.gl/e8Q1f8TY1P2owQ4N7",
  },
  {
    id: "rumah-rengganis",
    name: "SPPG Rumah Rengganis",
    city: "Cirebon",
    date: "16 Oktober 2026",
    dateShort: "16 Okt",
    quota: 100,
    image: "/images/venue-rengganis.jpg",
    mapsUrl: "https://maps.app.goo.gl/VQbYJdNwJr7JxYjN7",
  },
  {
    id: "buku-akik",
    name: "SPPG Buku Akik",
    city: "Yogyakarta",
    date: "17 Oktober 2026",
    dateShort: "17 Okt",
    quota: 33,
    image: "/images/venue-buku-akik.jpg",
    mapsUrl: "https://maps.app.goo.gl/beTmF2gKstsNkAWp7",
  },
  {
    id: "rumah-budaya-ratna",
    name: "SPPG Rumah Budaya Ratna",
    city: "Malang",
    date: "18 Oktober 2026",
    dateShort: "18 Okt",
    quota: 100,
    image: "/images/venue-rumah-budaya-ratna.jpg",
    mapsUrl: "https://maps.app.goo.gl/muPyuTYjZVRzvLrT6",
  },
]
