import React, { useState, useEffect } from 'react';
import { Building2, Plus, MapPin, RefreshCw } from 'lucide-react';
import { cinemaService } from '../services/api';
import Modal from '../components/Modal';

export default function CinemasPage() {
  const [cinemas, setCinemas] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [newCinema, setNewCinema] = useState({
    name: '',
    code: '',
    circuitName: 'PVR INOX',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    screenCount: 6,
    operatorOrganizationId: 3,
  });

  const loadCinemas = () => {
    setLoading(true);
    cinemaService.getAll(selectedCity)
      .then((res) => setCinemas(res))
      .catch((err) => console.error('Failed to load cinemas', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCinemas();
  }, [selectedCity]);

  const handleCreateCinema = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await cinemaService.create(newCinema);
      setIsModalOpen(false);
      loadCinemas();
      setNewCinema({
        name: '',
        code: '',
        circuitName: 'PVR INOX',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        screenCount: 6,
        operatorOrganizationId: 3,
      });
    } catch (err) {
      setError(err?.message || 'Failed to register cinema');
    } finally {
      setSubmitting(false);
    }
  };

  const cities = ['All Cities', 'Mumbai', 'New Delhi', 'Bengaluru'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#C18C55] font-semibold">EXHIBITION CIRCUITS</span>
          <h2 className="text-2xl font-serif font-bold text-[#29211D]">Theatrical Venues &amp; Screens</h2>
          <p className="text-xs text-[#817366] mt-0.5">Multiplex properties, IMAX auditoriums, and operator organizations</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary text-xs py-2.5 px-4 rounded-xl self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Register New Venue</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[rgba(129,115,102,0.16)] pb-3">
        {cities.map((city) => {
          const val = city === 'All Cities' ? '' : city;
          const isActive = selectedCity === val;
          return (
            <button
              key={city}
              onClick={() => setSelectedCity(val)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#C18C55] to-[#996D3D] text-white shadow-md shadow-[#C18C55]/25'
                  : 'bg-white/70 text-[#817366] border border-[rgba(129,115,102,0.16)] hover:bg-white hover:text-[#29211D]'
              }`}
            >
              {city}
            </button>
          );
        })}
      </div>

      {/* Venues Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-2">
          <RefreshCw size={22} className="animate-spin text-[#C18C55]" />
          <p className="text-xs font-mono text-[#817366]">Fetching venues from database...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cinemas.map((cinema) => (
            <div key={cinema.id} className="morph-card morph-card-hover p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#C18C55] font-bold">{cinema.code}</span>
                  <h3 className="font-serif font-bold text-lg text-[#29211D] mt-0.5">{cinema.name}</h3>
                  <p className="text-xs text-[#9E6E3B] mt-0.5 font-semibold">{cinema.circuitName}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F4EDE1] border border-[rgba(193,140,85,0.28)] text-[#C18C55]">
                  <Building2 size={18} />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#817366]">
                <MapPin size={13} className="text-[#C18C55]" />
                <span>{cinema.city}, {cinema.state}</span>
              </div>

              {/* Screens List */}
              <div className="pt-3 border-t border-[rgba(129,115,102,0.14)] space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono text-[#29211D] font-semibold">
                  <span>Auditoriums ({cinema.screens?.length || cinema.screenCount})</span>
                  <span className="text-[11px] text-[#817366] font-normal">Laser / Dolby</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {cinema.screens?.map((scr) => (
                    <div key={scr.id} className="p-2 rounded-xl bg-[#F4EDE1]/65 border border-[rgba(129,115,102,0.14)] text-[#817366] truncate">
                      <span className="text-[#29211D] font-semibold block truncate">{scr.screenName}</span>
                      <span className="text-[10px] text-[#C18C55] font-mono font-medium">{scr.seatCapacity} seats</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Register Venue Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Theatrical Exhibition Venue"
        subtitle="Configure circuit affiliation and auditorium capacity"
      >
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-[#B8755C]/10 border border-[#B8755C]/30 text-[#9A5840] text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateCinema} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Cinema Property Name</label>
              <input
                type="text"
                required
                value={newCinema.name}
                onChange={(e) => setNewCinema({ ...newCinema, name: e.target.value })}
                className="form-input"
                placeholder="e.g. INOX Megaplex Nexus"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Circuit Code</label>
              <input
                type="text"
                required
                value={newCinema.code}
                onChange={(e) => setNewCinema({ ...newCinema, code: e.target.value })}
                className="form-input"
                placeholder="e.g. CIN-HYD-01"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="form-group">
              <label className="form-label">Circuit Name</label>
              <select
                value={newCinema.circuitName}
                onChange={(e) => setNewCinema({ ...newCinema, circuitName: e.target.value })}
                className="form-select"
              >
                <option value="PVR INOX">PVR INOX</option>
                <option value="Cinepolis">Cinepolis</option>
                <option value="Miraj Cinemas">Miraj Cinemas</option>
                <option value="Wave Cinemas">Wave Cinemas</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                required
                value={newCinema.city}
                onChange={(e) => setNewCinema({ ...newCinema, city: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Auditoriums Count</label>
              <input
                type="number"
                required
                value={newCinema.screenCount}
                onChange={(e) => setNewCinema({ ...newCinema, screenCount: Number(e.target.value) })}
                className="form-input"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary text-xs"
            >
              {submitting ? 'Registering Venue...' : 'Save Venue & Generate Screens'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
