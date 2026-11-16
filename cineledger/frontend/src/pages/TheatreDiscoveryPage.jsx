import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Sparkles,
  Search,
  Armchair,
  ChevronRight,
  Filter,
  Film,
} from 'lucide-react';

export default function TheatreDiscoveryPage() {
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const theatres = [
    {
      id: 1,
      name: 'PVR INOX Palladium Lower Parel',
      city: 'Mumbai',
      address: 'High Street Phoenix, Senapati Bapat Marg, Lower Parel',
      screensCount: 7,
      formats: ['IMAX 4K Dual Laser', 'Dolby Atmos', 'Director’s Cut'],
      activeFilms: [
        { title: 'Kalki 2898 AD', time: '10:30 AM', showtimeId: 1 },
        { title: 'Interstellar', time: '02:15 PM', showtimeId: 2 },
        { title: 'Dune: Part Two', time: '06:45 PM', showtimeId: 3 },
      ],
    },
    {
      id: 2,
      name: 'Cinepolis Nexus Mall Koramangala',
      city: 'Bengaluru',
      address: 'Nexus Mall, Hosur Road, Koramangala',
      screensCount: 9,
      formats: ['Dolby Atmos', 'RealD 3D', 'VIP Lounge'],
      activeFilms: [
        { title: 'Oppenheimer', time: '11:00 AM', showtimeId: 1 },
        { title: 'Inception', time: '03:30 PM', showtimeId: 2 },
        { title: 'Avatar: The Way of Water', time: '07:15 PM', showtimeId: 3 },
      ],
    },
    {
      id: 3,
      name: 'PVR Director’s Cut Ambience Mall',
      city: 'Delhi NCR',
      address: 'Ambience Mall, NH 8, Gurugram',
      screensCount: 4,
      formats: ['Director’s Cut Laser', 'Dolby Atmos', 'Fine Dining Concierge'],
      activeFilms: [
        { title: 'The Dark Knight', time: '01:00 PM', showtimeId: 1 },
        { title: 'Blade Runner 2049', time: '05:45 PM', showtimeId: 2 },
      ],
    },
    {
      id: 4,
      name: 'Prasad’s Large Screen IMAX',
      city: 'Hyderabad',
      address: 'NTR Gardens, Khairatabad',
      screensCount: 6,
      formats: ['Dual 4K Laser Giant Screen', 'Dolby Atmos'],
      activeFilms: [
        { title: 'Kalki 2898 AD', time: '09:45 AM', showtimeId: 1 },
        { title: 'Dune: Part Two', time: '02:00 PM', showtimeId: 2 },
        { title: 'Interstellar', time: '06:30 PM', showtimeId: 3 },
      ],
    },
  ];

  const cities = ['ALL', 'Mumbai', 'Bengaluru', 'Delhi NCR', 'Hyderabad'];

  const filteredTheatres = theatres.filter((th) => {
    const matchesCity = selectedCity === 'ALL' || th.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      th.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      th.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F4EDE1] text-[#29211D] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C18C55] mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>EXHIBITOR DIRECTORY</span>
          </div>
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-[#29211D]">
            Explore Premium Auditoriums & Theatres
          </h1>
          <p className="text-xs text-[#817366] mt-1">
            Find certified IMAX, Dolby Atmos, and Director’s Cut auditoriums equipped with 3D seat reservation.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-[#C18C55]/30 shadow-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#C18C55] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by cinema or landmark..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F4EDE1]/50 border border-[#C18C55]/20 text-xs text-[#29211D] placeholder-[#817366] focus:outline-none focus:border-[#C18C55]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedCity === city
                    ? 'bg-[#C18C55] text-white shadow-sm'
                    : 'bg-[#F4EDE1]/60 text-[#817366] hover:bg-[#F4EDE1] hover:text-[#29211D]'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Directory List */}
        <div className="space-y-6">
          {filteredTheatres.map((th) => (
            <div
              key={th.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C18C55]/20 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-3 max-w-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#C18C55]/15 text-[#8C5D2B] border border-[#C18C55]/30">
                    {th.city}
                  </span>
                  <span className="text-xs text-[#817366] font-medium">
                    {th.screensCount} Active Screens
                  </span>
                </div>

                <h2 className="font-serif font-bold text-xl text-[#29211D]">{th.name}</h2>

                <div className="flex items-start gap-1.5 text-xs text-[#817366]">
                  <MapPin className="w-3.5 h-3.5 text-[#C18C55] shrink-0 mt-0.5" />
                  <span>{th.address}</span>
                </div>

                {/* Formats Supported */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {th.formats.map((fmt) => (
                    <span
                      key={fmt}
                      className="px-2.5 py-0.5 rounded-lg bg-[#29211D] text-white text-[10px] font-semibold"
                    >
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>

              {/* Today's Showtimes */}
              <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#817366]">
                  Featured Showtimes Today
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {th.activeFilms.map((film, fIdx) => (
                    <Link
                      key={fIdx}
                      to={`/cinemaholic/book/${film.showtimeId}`}
                      className="px-3 py-2 rounded-xl border border-[#C18C55]/30 bg-[#F4EDE1]/50 hover:bg-[#C18C55] hover:text-[#14100E] text-xs font-semibold text-[#29211D] transition-all flex items-center gap-1.5"
                    >
                      <Armchair className="w-3.5 h-3.5" />
                      <span>{film.title} ({film.time})</span>
                    </Link>
                  ))}
                </div>

                <Link
                  to="/cinemaholic/book/1"
                  className="mt-2 text-xs font-bold text-[#C18C55] hover:text-[#8C5D2B] flex items-center gap-1"
                >
                  <span>Explore 3D Auditorium</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

