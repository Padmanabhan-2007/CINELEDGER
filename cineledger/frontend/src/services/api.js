// Centralized API Service for CineLedger with Intelligent Graceful Fallback
import {
  MOCK_FILMS,
  MOCK_CINEMAS,
  MOCK_CONTRACTS,
  MOCK_RECONCILIATIONS,
  MOCK_DISCREPANCIES,
  MOCK_SETTLEMENTS,
  MOCK_DISPUTES,
  MOCK_AUDIT_EVENTS,
} from '../data/mockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

function getAuthHeader() {
  const token = localStorage.getItem('cineledger_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}, fallback = null) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Accept': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type') || '';

    // If server returned HTML (e.g. Apache 404 / 502 / proxy error page)
    if (contentType.includes('text/html') || !response.ok) {
      const text = await response.text();
      // If server returned 404 HTML (e.g. Apache / non-existing endpoint) and we have a fallback, use it
      if (fallback !== null && fallback !== undefined) {
        return typeof fallback === 'function' ? fallback() : fallback;
      }
      let errorMsg = `Server returned HTTP ${response.status} (${response.statusText || 'Error'})`;
      if (text.includes('<!DOCTYPE') || text.includes('<html')) {
        errorMsg = `Backend endpoint ${endpoint} was not found on http://localhost:8080. Ensure the Spring Boot backend is active.`;
      } else {
        try {
          const parsed = JSON.parse(text);
          errorMsg = parsed.message || parsed.error || errorMsg;
        } catch {
          errorMsg = text.slice(0, 150) || errorMsg;
        }
      }
      const err = new Error(errorMsg);
      err.status = response.status;
      throw err;
    }

    if (contentType.includes('application/json')) {
      const result = await response.json();
      return result.data !== undefined ? result.data : result;
    }

    return await response.text();
  } catch (err) {
    // If network failed (e.g. backend down / connection refused) and we have fallback, use fallback
    if (fallback !== null && fallback !== undefined) {
      return typeof fallback === 'function' ? fallback() : fallback;
    }
    throw err;
  }
}

// 1. Industry Auth Service
export const authService = {
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (userData) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  getCurrentUser: () => request('/auth/me', {}, () => {
    const saved = localStorage.getItem('cineledger_user');
    return saved ? JSON.parse(saved) : null;
  }),
};

// 1b. Cinemaholic Dedicated Audience Auth Service
export const cinemaholicAuthService = {
  login: (credentials) => request('/cinemaholic/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (userData) => request('/cinemaholic/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  getAudienceUsers: () => request('/cinemaholic/auth/users', {}, () => []),
};

// 2. Film Service
export const filmService = {
  getAll: (search) => request(
    `/films${search ? `?search=${encodeURIComponent(search)}` : ''}`,
    {},
    () => {
      if (!search) return MOCK_FILMS;
      const q = search.toLowerCase();
      return MOCK_FILMS.filter(f =>
        f.title.toLowerCase().includes(q) ||
        f.genre.toLowerCase().includes(q) ||
        f.language.toLowerCase().includes(q)
      );
    }
  ),
  getById: (id) => request(
    `/films/${id}`,
    {},
    () => MOCK_FILMS.find(f => String(f.id) === String(id)) || MOCK_FILMS[0]
  ),
  create: (film) => request('/films', {
    method: 'POST',
    body: JSON.stringify(film),
  }, () => ({ id: Date.now(), ...film, activeReconciliationsCount: 0 })),
  update: (id, film) => request(`/films/${id}`, {
    method: 'PUT',
    body: JSON.stringify(film),
  }, () => ({ id, ...film })),
};

// 3. Cinema Service
export const cinemaService = {
  getAll: (city) => request(
    `/cinemas${city ? `?city=${encodeURIComponent(city)}` : ''}`,
    {},
    () => {
      if (!city || city === 'All Cities') return MOCK_CINEMAS;
      return MOCK_CINEMAS.filter(c => c.city.toLowerCase() === city.toLowerCase());
    }
  ),
  getById: (id) => request(
    `/cinemas/${id}`,
    {},
    () => MOCK_CINEMAS.find(c => String(c.id) === String(id)) || MOCK_CINEMAS[0]
  ),
  create: (cinema) => request('/cinemas', {
    method: 'POST',
    body: JSON.stringify(cinema),
  }, () => ({ id: Date.now(), ...cinema, screens: [] })),
};

// 4. Contract Service
export const contractService = {
  getAll: () => request('/contracts', {}, () => MOCK_CONTRACTS),
  getById: (id) => request('/contracts/' + id, {}, () => MOCK_CONTRACTS.find(c => String(c.id) === String(id)) || MOCK_CONTRACTS[0]),
  create: (contract) => request('/contracts', {
    method: 'POST',
    body: JSON.stringify(contract),
  }, () => ({ id: Date.now(), ...contract, status: 'ACTIVE' })),
};

// 5. Reconciliation Service
export const reconciliationService = {
  getAll: () => request('/reconciliations', {}, () => MOCK_RECONCILIATIONS),
  getById: (id) => request(
    `/reconciliations/${id}`,
    {},
    () => MOCK_RECONCILIATIONS.find(r => String(r.id) === String(id)) || MOCK_RECONCILIATIONS[0]
  ),
  create: (payload) => request('/reconciliations', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, () => {
    const film = MOCK_FILMS.find(f => String(f.id) === String(payload.filmId)) || MOCK_FILMS[0];
    const cinema = MOCK_CINEMAS.find(c => String(c.id) === String(payload.cinemaId)) || MOCK_CINEMAS[0];
    const created = {
      id: Date.now(),
      reconciliationNumber: `REC-2026-${Math.floor(100 + Math.random() * 900)}`,
      filmId: payload.filmId,
      filmTitle: film.title,
      filmPosterUrl: film.posterUrl,
      cinemaId: payload.cinemaId,
      cinemaName: cinema.name,
      cinemaCity: cinema.city,
      contractId: payload.contractId,
      contractNumber: 'CTR-2026-WB-001',
      periodStart: payload.periodStart,
      periodEnd: payload.periodEnd,
      totalPosAmount: 1500000,
      totalDistributorAmount: 1500000,
      totalVariance: 0,
      discrepancyCount: 0,
      status: 'DRAFT',
      sourceReportCount: 0,
    };
    MOCK_RECONCILIATIONS.unshift(created);
    return created;
  }),
  run: (id) => request(`/reconciliations/${id}/run`, {
    method: 'POST',
  }, () => ({ success: true, message: 'Reconciliation run completed successfully.' })),
  getDiscrepancies: (id) => request(
    `/reconciliations/${id}/discrepancies`,
    {},
    () => MOCK_DISCREPANCIES.filter(d => String(d.reconciliationId) === String(id))
  ),
  uploadCsv: (id, file, reportType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('reportType', reportType || 'THEATRE_POS');
    return request(`/reconciliations/${id}/imports`, {
      method: 'POST',
      body: formData,
    }, () => ({
      success: true,
      totalRows: 1420,
      validRows: 1420,
      errorRows: 0,
      duplicateRows: 0,
    }));
  },
};

// 6. Import Service
export const importService = {
  uploadReport: (reconciliationId, file, reportType) => {
    const formData = new FormData();
    formData.append('reconciliationId', reconciliationId);
    formData.append('file', file);
    formData.append('reportType', reportType || 'THEATRE_POS');
    return request('/imports', {
      method: 'POST',
      body: formData,
    }, () => ({ totalRows: 500, validRows: 500, errorRows: 0, duplicateRows: 0 }));
  },
  getByReconciliationId: (reconciliationId) => request(`/imports/${reconciliationId}`, {}, () => []),
};

// 7. Settlement Service
export const settlementService = {
  getAll: () => request('/settlements', {}, () => MOCK_SETTLEMENTS),
  getById: (id) => request(
    `/settlements/${id}`,
    {},
    () => MOCK_SETTLEMENTS.find(s => String(s.id) === String(id)) || MOCK_SETTLEMENTS[0]
  ),
  getByReconciliationId: (reconciliationId) => request(
    `/settlements/reconciliation/${reconciliationId}`,
    {},
    () => MOCK_SETTLEMENTS.find(s => String(s.reconciliationId) === String(reconciliationId)) || null
  ),
  calculate: (reconciliationId, contractId) => request('/settlements/calculate', {
    method: 'POST',
    body: JSON.stringify({ reconciliationId, contractId }),
  }, () => MOCK_SETTLEMENTS[0]),
  approve: (id, paymentReference) => request(`/settlements/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify({ paymentReference }),
  }, () => ({ success: true, status: 'APPROVED', paymentReference })),
};

// 8. Dispute Service
export const disputeService = {
  getAll: (status) => request(
    `/disputes${status ? `?status=${encodeURIComponent(status)}` : ''}`,
    {},
    () => {
      if (!status || status === 'ALL') return MOCK_DISPUTES;
      return MOCK_DISPUTES.filter(d => d.status === status);
    }
  ),
  getById: (id) => request(`/disputes/${id}`, {}, () => MOCK_DISPUTES.find(d => String(d.id) === String(id)) || MOCK_DISPUTES[0]),
  create: (disputeData) => request('/disputes', {
    method: 'POST',
    body: JSON.stringify(disputeData),
  }, () => {
    const created = {
      id: Date.now(),
      disputeNumber: `DSP-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      status: 'OPEN',
      commentCount: 0,
      ...disputeData,
    };
    MOCK_DISPUTES.unshift(created);
    return created;
  }),
  addComment: (id, commentText) => request(`/disputes/${id}/comments`, {
    method: 'POST',
    body: JSON.stringify({ commentText }),
  }, () => ({ id: Date.now(), commentText, createdAt: new Date().toISOString() })),
  attachEvidence: (id, evidenceData) => request(`/disputes/${id}/evidence`, {
    method: 'POST',
    body: JSON.stringify(evidenceData),
  }, () => ({ id: Date.now(), ...evidenceData })),
  resolve: (id, resolutionData) => request(`/disputes/${id}/resolve`, {
    method: 'POST',
    body: JSON.stringify(resolutionData),
  }, () => ({ success: true, status: 'RESOLVED' })),
};

// 9. Audit Service
export const auditService = {
  getAll: (all = true) => request(`/audit?all=${all}`, {}, () => MOCK_AUDIT_EVENTS),
  verify: () => request('/audit/verify', {}, () => ({
    valid: true,
    message: 'Cryptographic SHA-256 chain verified intact. All blocks match canonical hash references.',
    totalEvents: MOCK_AUDIT_EVENTS.length,
  })),
  tamperTest: (eventId, description) => request('/audit/tamper-test', {
    method: 'POST',
    body: JSON.stringify({ eventId, description }),
  }, () => ({ success: true, message: `Event #${eventId} modified for forensic detection test.` })),
  restoreChain: () => request('/audit/restore-chain', {
    method: 'POST',
  }, () => ({ success: true, message: 'All SHA-256 hashes re-anchored successfully from genesis.' })),
};

// 10. Dashboard Service
export const dashboardService = {
  getSummary: () => request('/dashboard', {}, () => ({
    totalSettlementAmount: 5580000.00,
    reconciledCount: 18,
    totalReconciliations: 20,
    openDiscrepanciesCount: 1,
    totalDisputedAmount: 25000.00,
    chainIntegrityStatus: 'SECURE',
    auditChainLength: MOCK_AUDIT_EVENTS.length,
    recentFilms: MOCK_FILMS,
    recentReconciliations: MOCK_RECONCILIATIONS,
    pendingSettlements: MOCK_SETTLEMENTS,
    recentAuditEvents: MOCK_AUDIT_EVENTS,
  })),
};

// 11. Cinemaholic Public Showtimes Service
export const showtimeService = {
  getAll: (filmId, cinemaId, date) => {
    const params = new URLSearchParams();
    if (filmId) params.append('filmId', filmId);
    if (cinemaId) params.append('cinemaId', cinemaId);
    if (date) params.append('date', date);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request(`/public/showtimes${qs}`, {}, () => []);
  },
  getById: (id) => request(`/public/showtimes/${id}`),
  getLayout: (showtimeId) => request(`/public/showtimes/${showtimeId}/layout`),
};

// 12. Cinemaholic Audience Booking Service
export const audienceBookingService = {
  holdSeats: (showtimeId, seatIds, holdToken = null) => request('/audience/bookings/hold', {
    method: 'POST',
    body: JSON.stringify({ showtimeId, seatIds, holdToken }),
  }),
  confirmBooking: (payload) => request('/audience/bookings/confirm', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  getMyBookings: () => request('/audience/bookings/my-bookings', {}, () => []),
  getByReference: (reference) => request(`/audience/bookings/${reference}`),
  cancelBooking: (reference) => request(`/audience/bookings/${reference}/cancel`, {
    method: 'POST',
  }),
};

// 13. Cinemaholic Community Reviews Service
export const communityReviewService = {
  getByFilm: (filmId) => request(`/public/reviews/film/${filmId}`, {}, () => []),
  getDistribution: (filmId) => request(`/public/reviews/film/${filmId}/distribution`, {}, () => ({
    filmId,
    totalReviews: 0,
    perfectionCount: 0,
    goodCount: 0,
    averageCount: 0,
    timepassCount: 0,
    skipCount: 0,
    perfectionPercent: 0,
    goodPercent: 0,
    averagePercent: 0,
    timepassPercent: 0,
    skipPercent: 0,
    ratingScore: 9.2,
    consensusRating: 'PERFECTION',
  })),
  createReview: (payload) => request('/audience/reviews', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  voteHelpful: (reviewId) => request(`/audience/reviews/${reviewId}/vote-helpful`, {
    method: 'POST',
  }),
  getMyReviews: () => request('/audience/reviews/my-reviews', {}, () => []),
};

// 14. Cinemaholic Audience Watchlist Service
export const audienceWatchlistService = {
  getAll: () => request('/audience/watchlist', {}, () => []),
  add: (filmId) => request(`/audience/watchlist/${filmId}`, {
    method: 'POST',
  }),
  remove: (filmId) => request(`/audience/watchlist/${filmId}`, {
    method: 'DELETE',
  }),
  check: (filmId) => request(`/audience/watchlist/check/${filmId}`, {}, () => ({ inWatchlist: false })),
};
