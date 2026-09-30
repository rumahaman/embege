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
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Ruang+Rumi+Sepatan+Tangerang",
  },
  {
    id: "rumah-rengganis",
    name: "SPPG Rengganis Rumah Buku dan Kopi",
    city: "Cirebon",
    date: "16 Oktober 2026",
    dateShort: "16 Okt",
    quota: 100,
    image: "/images/venue-rengganis.jpg",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Rengganis+Rumah+Buku+dan+Kopi+Cirebon",
  },
  {
    id: "buku-akik",
    name: "SPPG Buku Akik",
    city: "Yogyakarta",
    date: "17 Oktober 2026",
    dateShort: "17 Okt",
    quota: 100,
    image: "/images/venue-buku-akik.jpg",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Buku+Akik+Yogyakarta",
  },
  {
    id: "rumah-budaya-ratna",
    name: "SPPG Rumah Budaya Ratna",
    city: "Malang",
    date: "18 Oktober 2026",
    dateShort: "18 Okt",
    quota: 33,
    image: "/images/venue-rumah-budaya-ratna.jpg",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Rumah+Budaya+Ratna+Malang",
  },
]