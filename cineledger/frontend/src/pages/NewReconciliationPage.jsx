import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileCheck2, Film, Building2, Calendar, ChevronRight, ChevronLeft, CheckCircle2, RefreshCw, AlertTriangle } from 'lucide-react';
import { filmService, cinemaService, contractService, reconciliationService } from '../services/api';

export default function NewReconciliationPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [films, setFilms] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    filmId: '',
    cinemaId: '',
    contractId: '',
    periodStart: '',
    periodEnd: '',
    notes: '',
  });

  useEffect(() => {
    Promise.all([
      filmService.getAll(),
      cinemaService.getAll(),
      contractService.getAll(),
    ])
      .then(([f, c, ct]) => {
        setFilms(Array.isArray(f) ? f : []);
        setCinemas(Array.isArray(c) ? c : []);
        setContracts(Array.isArray(ct) ? ct : []);
      })
      .catch((err) => console.error('Failed to load reference data', err))
      .finally(() => setLoading(false));
  }, []);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const selectedFilm = films.find((f) => String(f.id) === String(form.filmId));
  const selectedCinema = cinemas.find((c) => String(c.id) === String(form.cinemaId));
  const selectedContract = contracts.find((c) => String(c.id) === String(form.contractId));

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!form.filmId) { setError('Please select a theatrical feature.'); return false; }
        return true;
      case 2:
        if (!form.cinemaId) { setError('Please select a cinema circuit.'); return false; }
        return true;
      case 3:
        if (!form.periodStart || !form.periodEnd) { setError('Please specify the reporting period.'); return false; }
        if (form.periodStart > form.periodEnd) { setError('Start date must be before end date.'); return false; }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, 4));
  };

  const prevStep = () => {
    setError('');
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        filmId: Number(form.filmId),
        cinemaId: Number(form.cinemaId),
        contractId: form.contractId ? Number(form.contractId) : null,
        periodStart: form.periodStart,
        periodEnd: form.periodEnd,
        notes: form.notes || null,
      };
      const result = await reconciliationService.create(payload);
      navigate(`/app/reconciliations/${result.id || result}`);
    } catch (err) {
      setError(err.message || 'Failed to create reconciliation');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: 'Select Film', icon: Film },
    { num: 2, label: 'Select Cinema', icon: Building2 },
    { num: 3, label: 'Reporting Period', icon: Calendar },
    { num: 4, label: 'Review & Create', icon: CheckCircle2 },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2">
        <RefreshCw size={22} className="animate-spin text-[#C18C55]" />
        <p className="text-xs font-mono text-[#817366]">Loading reference data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#C18C55] font-semibold">NEW RECONCILIATION CYCLE</span>
        <h2 className="text-2xl font-serif font-bold text-[#29211D]">Initiate Box-Office Reconciliation</h2>
        <p className="text-xs text-[#817366] mt-0.5">Select film, cinema circuit, and reporting period to begin cross-examination</p>
      </div>

      {/* Progress Stepper */}
      <div className="morph-card p-4">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.num;
            const isComplete = step > s.num;
            return (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      isComplete
                        ? 'bg-[#657B65]/15 border border-[#657B65]/35 text-[#465B46]'
                        : isActive
                        ? 'bg-gradient-to-r from-[#C18C55] to-[#996D3D] text-white shadow-md shadow-[#C18C55]/25'
                        : 'bg-[#F4EDE1] border border-[rgba(129,115,102,0.18)] text-[#817366]'
                    }`}
                  >
                    {isComplete ? <CheckCircle2 size={17} /> : <Icon size={17} />}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:block ${isActive ? 'text-[#29211D]' : isComplete ? 'text-[#465B46]' : 'text-[#817366]'}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-3 ${step > s.num ? 'bg-[#657B65]/40' : 'bg-[rgba(129,115,102,0.16)]'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3.5 rounded-xl bg-[#B8755C]/10 border border-[#B8755C]/30 flex items-center gap-2 text-xs text-[#9A5840]">
          <AlertTriangle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* Step Content */}
      <div className="morph-card p-6 shadow-sm">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#29211D]">Select Theatrical Feature</h3>
            <p className="text-xs text-[#817366]">Choose the film master record for this reconciliation cycle.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
              {films.map((film) => (
                <button
                  key={film.id}
                  onClick={() => updateForm('filmId', film.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    String(form.filmId) === String(film.id)
                      ? 'border-[#C18C55] bg-[#C18C55]/12 shadow-md shadow-[#C18C55]/10'
                      : 'border-[rgba(129,115,102,0.16)] bg-white/70 hover:border-[#C18C55]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-14 rounded-xl bg-[#F4EDE1] border border-[rgba(193,140,85,0.25)] flex items-center justify-center flex-shrink-0">
                      <Film size={18} className="text-[#C18C55]" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-serif font-bold text-sm text-[#29211D] truncate">{film.title}</p>
                      <p className="text-[10px] text-[#817366] font-mono mt-0.5">{film.language} · {film.releaseYear}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#29211D]">Select Cinema Circuit</h3>
            <p className="text-xs text-[#817366]">Choose the exhibition venue or cinema chain.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
              {cinemas.map((cinema) => (
                <button
                  key={cinema.id}
                  onClick={() => updateForm('cinemaId', cinema.id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    String(form.cinemaId) === String(cinema.id)
                      ? 'border-[#C18C55] bg-[#C18C55]/12 shadow-md shadow-[#C18C55]/10'
                      : 'border-[rgba(129,115,102,0.16)] bg-white/70 hover:border-[#C18C55]/50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-[#F4EDE1] text-[#C18C55] border border-[rgba(193,140,85,0.2)]">
                      <Building2 size={20} className="flex-shrink-0" />
                    </div>
                    <div>
                      <p className="font-serif font-bold text-sm text-[#29211D]">{cinema.name}</p>
                      <p className="text-[10px] text-[#817366] font-mono mt-0.5">{cinema.city} · {cinema.screenCount || '—'} screens</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#29211D]">Reporting Period &amp; Contract</h3>
            <p className="text-xs text-[#817366]">Set the date range for this reconciliation and optionally bind a contract.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="form-group">
                <label className="form-label">Period Start</label>
                <input type="date" className="form-input" value={form.periodStart} onChange={(e) => updateForm('periodStart', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Period End</label>
                <input type="date" className="form-input" value={form.periodEnd} onChange={(e) => updateForm('periodEnd', e.target.value)} />
              </div>
              <div className="form-group md:col-span-2">
                <label className="form-label">Contract (Optional)</label>
                <select className="form-select" value={form.contractId} onChange={(e) => updateForm('contractId', e.target.value)}>
                  <option value="">— No Contract Bound —</option>
                  {contracts.map((c) => (
                    <option key={c.id} value={c.id}>{c.contractNumber} — {c.description || c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group md:col-span-2">
                <label className="form-label">Notes (Optional)</label>
                <textarea className="form-textarea" rows={3} placeholder="Any special instructions or context..." value={form.notes} onChange={(e) => updateForm('notes', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-lg text-[#29211D]">Review &amp; Confirm</h3>
            <p className="text-xs text-[#817366]">Verify the reconciliation parameters before initiating the cycle.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-2xl bg-[#F4EDE1]/65 border border-[rgba(129,115,102,0.16)]">
                <p className="text-[10px] uppercase font-mono tracking-wider text-[#817366] mb-1 font-semibold">Theatrical Feature</p>
                <p className="font-serif font-bold text-[#29211D]">{selectedFilm?.title || '—'}</p>
                <p className="text-[10px] text-[#817366] font-mono mt-0.5">{selectedFilm?.language} · {selectedFilm?.releaseYear}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F4EDE1]/65 border border-[rgba(129,115,102,0.16)]">
                <p className="text-[10px] uppercase font-mono tracking-wider text-[#817366] mb-1 font-semibold">Cinema Circuit</p>
                <p className="font-serif font-bold text-[#29211D]">{selectedCinema?.name || '—'}</p>
                <p className="text-[10px] text-[#817366] font-mono mt-0.5">{selectedCinema?.city}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F4EDE1]/65 border border-[rgba(129,115,102,0.16)]">
                <p className="text-[10px] uppercase font-mono tracking-wider text-[#817366] mb-1 font-semibold">Reporting Period</p>
                <p className="font-serif font-bold text-[#29211D]">{form.periodStart} → {form.periodEnd}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F4EDE1]/65 border border-[rgba(129,115,102,0.16)]">
                <p className="text-[10px] uppercase font-mono tracking-wider text-[#817366] mb-1 font-semibold">Bound Contract</p>
                <p className="font-serif font-bold text-[#29211D]">{selectedContract?.contractNumber || 'None'}</p>
              </div>
            </div>
            {form.notes && (
              <div className="p-4 rounded-2xl bg-[#F4EDE1]/65 border border-[rgba(129,115,102,0.16)]">
                <p className="text-[10px] uppercase font-mono tracking-wider text-[#817366] mb-1 font-semibold">Notes</p>
                <p className="text-sm text-[#29211D]">{form.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevStep}
          disabled={step === 1}
          className={`btn btn-secondary text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 ${step === 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
          <ChevronLeft size={14} />
          <span>Back</span>
        </button>

        {step < 4 ? (
          <button onClick={nextStep} className="btn btn-primary text-xs py-2.5 px-5 rounded-xl flex items-center gap-1.5">
            <span>Continue</span>
            <ChevronRight size={14} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn btn-primary text-xs py-2.5 px-5 rounded-xl flex items-center gap-1.5"
          >
            {submitting ? <RefreshCw size={14} className="animate-spin" /> : <FileCheck2 size={14} />}
            <span>{submitting ? 'Creating...' : 'Create Reconciliation'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
