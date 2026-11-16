import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  ChevronDown,
  FileCheck2,
  UploadCloud,
  FileText,
  Receipt,
  AlertOctagon,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Lock,
  Film,
  Building2,
  Scale,
  X,
  TrendingUp,
  Play,
  Layers,
} from 'lucide-react';
import CinemaPosterScene from '../components/3d/CinemaPosterScene';

gsap.registerPlugin(ScrollTrigger);

const CAPABILITIES = [
  {
    id: 'recon',
    title: 'Intelligent Reconciliation',
    desc: 'Line-by-line deterministic comparison pairing theatre POS dumps against distributor EDI reports with automatic variance isolation.',
    icon: FileCheck2,
    tag: '6 Variance Rules',
    metric: '100% Traceable',
    tone: 'sage',
  },
  {
    id: 'import',
    title: 'Box Office Data Import',
    desc: 'Header-alias CSV ingestion supporting currency normalization, show-time parsing, refund deductions, and duplicate detection.',
    icon: UploadCloud,
    tag: 'Multi-Source CSV',
    metric: 'Up to 25MB',
    tone: 'champagne',
  },
  {
    id: 'contract',
    title: 'Contract Management',
    desc: 'Versioned theatrical agreements supporting Net Box Office and Gross Box Office terms, date windows, GST, gateway fees, and VPF.',
    icon: FileText,
    tag: 'Versioned Terms',
    metric: 'Effective-Dated',
    tone: 'champagne',
  },
  {
    id: 'settlement',
    title: 'Settlement Calculation',
    desc: 'Automated gross-to-net revenue waterfall splitting distributor film rentals and exhibitor retentions with BigDecimal HALF_UP precision.',
    icon: Receipt,
    tag: 'BigDecimal Engine',
    metric: '0.01 Precision',
    tone: 'sage',
  },
  {
    id: 'dispute',
    title: 'Dispute Resolution',
    desc: 'Dedicated variance investigation workbench featuring audit comments, evidence linking, proposed adjustments, and formal sign-off.',
    icon: AlertOctagon,
    tag: 'Evidence Backed',
    metric: 'Full Audit Trail',
    tone: 'terracotta',
  },
  {
    id: 'audit',
    title: 'Cryptographic Audit Ledger',
    desc: 'Sequential append-only SHA-256 hash chain anchoring every import, reconciliation run, and settlement payout approval.',
    icon: ShieldCheck,
    tag: 'SHA-256 Chain',
    metric: 'Tamper-Evident',
    tone: 'sage',
  },
];

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Data Import',
    subtitle: 'POS & EDI Ingestion',
    detail: 'Theatre POS files and distributor statements are parsed with duplicate detection and currency sanitization.',
    icon: UploadCloud,
  },
  {
    step: '02',
    title: 'Transaction Matching',
    subtitle: 'Reference Pairing',
    detail: 'Ticket batches are grouped by transaction reference across exhibitor and studio sources.',
    icon: Layers,
  },
  {
    step: '03',
    title: 'Discrepancy Detection',
    subtitle: 'Variance Classification',
    detail: 'Rate mismatches, missing batches, duplicate IDs, and refund gaps are classified by financial severity.',
    icon: AlertOctagon,
  },
  {
    step: '04',
    title: 'Settlement Calculation',
    subtitle: 'Contract Waterfall',
    detail: 'Applicable contract version terms deduct GST, platform fees, and VPF to derive net distributor share.',
    icon: Receipt,
  },
  {
    step: '05',
    title: 'Approval',
    subtitle: 'Payout Governance',
    detail: 'Assurance auditors review settlement line items and attach bank RTGS/NEFT payment references.',
    icon: CheckCircle2,
  },
  {
    step: '06',
    title: 'Audit Verification',
    subtitle: 'Cryptographic Seal',
    detail: 'SHA-256 chained hashes lock the complete historical sequence against silent modification.',
    icon: ShieldCheck,
  },
];

const AUDIT_CHAIN_NODES = [
  {
    seq: '001',
    event: 'SYSTEM_INITIALIZED',
    actor: 'SYSTEM / ADMIN',
    summary: 'Genesis anchor & circuit organizations sealed',
    prevHash: '000000000000...0000',
    hash: '9c4e71b2a04f...38d1',
    status: 'GENESIS',
  },
  {
    seq: '002',
    event: 'REPORT_IMPORT',
    actor: 'PRIYA SHARMA · ANALYST',
    summary: 'Ingested Oppenheimer POS + Distributor EDI reports',
    prevHash: '9c4e71b2a04f...38d1',
    hash: '3f8a19c4d210...8a47',
    status: 'LINKED',
  },
  {
    seq: '003',
    event: 'RECONCILIATION_RUN',
    actor: 'PRIYA SHARMA · ANALYST',
    summary: 'Executed REC-2026-001 · 3 variances isolated',
    prevHash: '3f8a19c4d210...8a47',
    hash: '7b1d45e980a2...f21c',
    status: 'LINKED',
  },
  {
    seq: '004',
    event: 'SETTLEMENT_APPROVED',
    actor: 'MARCUS STERLING · AUDITOR',
    summary: 'Approved STL-2026-002 · Ref HDFC-RTGS-89210741',
    prevHash: '7b1d45e980a2...f21c',
    hash: 'e52a90f314bc...7190',
    status: 'HEAD',
  },
];

export default function LandingPage() {
  const heroSectionRef = useRef(null);
  const heroCopyRef = useRef(null);
  const pageContainerRef = useRef(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [intelTab, setIntelTab] = useState('waterfall');
  const [simulatedTamper, setSimulatedTamper] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero typography entrance
      if (heroCopyRef.current) {
        gsap.from(heroCopyRef.current.children, {
          y: 26,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
        });
      }

      // Track hero scroll progress for 3D poster wall perspective shift
      if (heroSectionRef.current) {
        ScrollTrigger.create({
          trigger: heroSectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => setScrollProgress(self.progress),
        });
      }

      // Section scroll reveals
      const sections = gsap.utils.toArray('.scroll-reveal-section');
      sections.forEach((sec) => {
        gsap.from(sec, {
          y: 32,
          opacity: 0,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 84%',
            once: true,
          },
        });
      });
    }, pageContainerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageContainerRef} className="overflow-x-hidden">
      {/* =================================================================
          HERO: ENORMOUS CONTINUOUSLY MOVING 3D MOVIE POSTER WALL
          ================================================================= */}
      <section
        ref={heroSectionRef}
        className="relative min-h-[94vh] w-full flex items-center pt-24 pb-14 overflow-hidden bg-[#F4EDE1]"
      >
        {/* Interactive WebGL / 3D Poster Wall */}
        <div className="absolute inset-0 z-0">
          <CinemaPosterScene
            scrollProgress={scrollProgress}
            onSelectPoster={(poster) => setSelectedPoster(poster)}
          />
        </div>

        {/* Subtle warm ivory readability veil strictly on the left editorial column */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(92deg, rgba(244,237,225,0.95) 0%, rgba(244,237,225,0.82) 38%, rgba(244,237,225,0.22) 66%, rgba(244,237,225,0.04) 100%)',
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-28 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #F4EDE1 0%, rgba(244,237,225,0) 100%)',
          }}
        />

        {/* Hero Typography Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 items-center pointer-events-none">
          <div ref={heroCopyRef} className="lg:col-span-7 space-y-6 pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full morph-glass-float text-[11px] font-mono font-semibold text-[#8C5E2E] tracking-wide">
              <Sparkles size={13} className="text-[#C18C55]" />
              <span>THEATRICAL FINANCIAL INTELLIGENCE · 3D POSTER ARCHIVE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-[3.4rem] font-serif font-bold text-[#29211D] leading-[1.12] tracking-tight">
              Every Movie Has a Story.
              <span className="block mt-1 champagne-gradient-text">
                Every Collection Has a Number.
              </span>
              <span className="block mt-1 text-[#29211D]">
                Every Number Has a Story to Tell.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#5E5147] leading-relaxed max-w-xl font-normal">
              Bringing financial clarity, intelligent reconciliation and complete transparency to the cinema distribution ecosystem.
            </p>

            {/* CineLedger 2.0 Dual Gateway Portals */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
              {/* Portal 1: Cinemaholic (Public Audience & 3D Booking) */}
              <div className="relative p-5 rounded-2xl bg-gradient-to-br from-[#29211D] to-[#1C1613] text-white shadow-xl border border-[#C18C55]/40 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#C18C55] text-[#14100E]">
                      Moviegoer Portal
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-[#C18C55]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-white">CINEMAHOLIC</h3>
                    <p className="text-[11px] text-[#A69B91] leading-relaxed mt-0.5">
                      Live 3D auditorium booking, exact-seat screen preview, and community reviews.
                    </p>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Link
                    to="/cinemaholic"
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#C18C55] to-[#A87442] hover:from-[#D4AF37] hover:to-[#B58049] text-[#14100E] font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-md transition-all"
                  >
                    <span>Enter Cinemaholic</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <div className="flex items-center justify-between text-[11px] pt-1 px-1 text-[#817366]">
                    <Link to="/cinemaholic/login" className="hover:text-[#E5B982] transition-colors font-medium">
                      Audience Sign In →
                    </Link>
                    <Link to="/cinemaholic/signup" className="hover:text-[#E5B982] transition-colors font-medium">
                      Join Free →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Portal 2: CineLedger Industry (B2B Financial Clearinghouse) */}
              <div className="relative p-5 rounded-2xl bg-white/85 text-[#29211D] shadow-xl border border-[#C18C55]/30 backdrop-blur-md flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#657B65]/20 text-[#3E523E] border border-[#657B65]/30">
                      B2B Industry Portal
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#657B65]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#29211D]">INDUSTRY WORKBENCH</h3>
                    <p className="text-[11px] text-[#817366] leading-relaxed mt-0.5">
                      Box office reconciliations, waterfall settlements, and SHA-256 audit ledger.
                    </p>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Link
                    to="/industry/login"
                    className="w-full py-2.5 px-3 rounded-xl bg-[#29211D] hover:bg-[#3E322C] text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-md transition-all"
                  >
                    <span>Enter Industry Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <div className="flex items-center justify-between text-[11px] pt-1 px-1 text-[#817366]">
                    <Link to="/industry/login" className="hover:text-[#29211D] transition-colors font-medium">
                      Enterprise Sign In →
                    </Link>
                    <Link to="/industry/signup" className="hover:text-[#29211D] transition-colors font-medium">
                      Request Access →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle interactive hint + metrics */}
            <div className="pt-5 flex flex-wrap items-center gap-6 text-xs text-[#817366] font-mono">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#657B65] animate-pulse" />
                20 Curated Releases Live in 3D
              </span>
              <span>Move cursor for depth parallax</span>
              <span>Hover any poster</span>
            </div>
          </div>
        </div>

        {/* Interactive clicked poster details floating glass card */}
        {selectedPoster && (
          <div className="fixed bottom-6 right-6 z-50 morph-card p-4 max-w-xs flex items-center gap-3.5 shadow-2xl border border-[#C18C55]/50">
            <img
              src={selectedPoster.path}
              alt={selectedPoster.title}
              className="w-12 h-18 object-cover rounded-lg border border-[rgba(129,115,102,0.25)]"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#C18C55] font-semibold">
                {selectedPoster.year} · {selectedPoster.rating}
              </p>
              <p className="font-serif font-bold text-sm text-[#29211D] truncate">
                {selectedPoster.title}
              </p>
              <p className="text-[11px] text-[#817366] truncate">{selectedPoster.director}</p>
            </div>
            <button
              onClick={() => setSelectedPoster(null)}
              className="p-1.5 rounded-lg hover:bg-[#F4EDE1] text-[#817366]"
              aria-label="Close poster preview"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Scroll Indicator */}
        <a
          href="#platform"
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-[#817366] hover:text-[#C18C55] transition-colors"
        >
          <span>Scroll to Explore</span>
          <ChevronDown size={16} className="animate-bounce text-[#C18C55]" />
        </a>
      </section>

      {/* =================================================================
          SECTION 1: CINEMA MEETS FINANCIAL INTELLIGENCE
          ================================================================= */}
      <section id="platform" className="scroll-reveal-section max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="inline-block text-[11px] font-mono uppercase tracking-widest text-[#A57340] bg-white/80 px-3.5 py-1 rounded-full border border-[rgba(193,140,85,0.35)]">
              Cinema Meets Financial Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#29211D] leading-tight">
              Built for Studios, Exhibitors & Assurance Auditors Alike.
            </h2>
            <p className="text-sm sm:text-base text-[#817366] leading-relaxed">
              Theatrical distribution generates thousands of ticket-level records across IMAX auditoriums, regional multiplexes, and digital ticketing aggregators. Disjointed CSV dumps and static spreadsheets obscure revenue leakage and delay studio settlements by months.
            </p>
            <p className="text-sm sm:text-base text-[#817366] leading-relaxed">
              CineLedger unites multi-source ingestion, contract-aware BigDecimal waterfall calculations, evidence-backed dispute resolution, and cryptographic hash-chaining inside a calm, editorial workspace.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="morph-card p-4 text-center">
                <p className="font-mono font-bold text-xl text-[#29211D]">BigDecimal</p>
                <p className="text-[11px] text-[#817366] mt-0.5">HALF_UP Precision</p>
              </div>
              <div className="morph-card p-4 text-center">
                <p className="font-mono font-bold text-xl text-[#657B65]">SHA-256</p>
                <p className="text-[11px] text-[#817366] mt-0.5">Append-Only Seal</p>
              </div>
              <div className="morph-card p-4 text-center">
                <p className="font-mono font-bold text-xl text-[#C18C55]">NBO / GBO</p>
                <p className="text-[11px] text-[#817366] mt-0.5">Versioned Contracts</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="morph-surface p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between border-b border-[rgba(129,115,102,0.16)] pb-4">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#C18C55]">
                    PARTNER NETWORK TOPOLOGY
                  </p>
                  <h3 className="font-serif font-bold text-lg text-[#29211D]">
                    Unified Theatrical Clearing House
                  </h3>
                </div>
                <span className="badge badge-reconciled">Live MySQL Engine</span>
              </div>

              <div className="space-y-3">
                {[
                  { icon: Film, title: 'Studios & Distributors', orgs: 'Warner Bros. Discovery · Reliance Entertainment', role: 'Statement EDI & Rental Verification' },
                  { icon: Building2, title: 'Theatrical Exhibitor Chains', orgs: 'PVR INOX Limited · Cinepolis India', role: 'POS Collections & Deduction Evidence' },
                  { icon: Scale, title: 'Independent Assurance', orgs: 'Deloitte Media Assurance', role: 'SHA-256 Audit & Payout Approval' },
                ].map((partner) => {
                  const Icon = partner.icon;
                  return (
                    <div
                      key={partner.title}
                      className="p-4 rounded-xl bg-white/85 border border-[rgba(129,115,102,0.16)] flex items-center gap-4 shadow-sm"
                    >
                      <div className="w-11 h-11 rounded-xl bg-[#F4EDE1] border border-[rgba(193,140,85,0.28)] flex items-center justify-center text-[#C18C55] flex-shrink-0">
                        <Icon size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-serif font-bold text-sm text-[#29211D]">{partner.title}</p>
                        <p className="text-xs text-[#817366] truncate">{partner.orgs}</p>
                      </div>
                      <span className="hidden sm:inline-block text-[10px] font-mono text-[#657B65] bg-[#657B65]/10 px-2.5 py-1 rounded-full border border-[#657B65]/25">
                        {partner.role}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          SECTION 2: PLATFORM CAPABILITIES (6 INTERACTIVE FEATURE CARDS)
          ================================================================= */}
      <section id="capabilities" className="scroll-reveal-section max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <span className="inline-block text-[11px] font-mono uppercase tracking-widest text-[#A57340] bg-white/80 px-3.5 py-1 rounded-full border border-[rgba(193,140,85,0.35)]">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#29211D]">
            Precision Architecture Across Every Stage
          </h2>
          <p className="text-sm sm:text-base text-[#817366]">
            Six core financial engines engineered into one coherent exhibition accounting workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAPABILITIES.map((cap, idx) => {
            const Icon = cap.icon;
            const toneBadge =
              cap.tone === 'sage'
                ? 'bg-[#657B65]/12 text-[#465B46] border-[#657B65]/30'
                : cap.tone === 'terracotta'
                ? 'bg-[#B8755C]/14 text-[#8D4932] border-[#B8755C]/30'
                : 'bg-[#C18C55]/14 text-[#8C5E2E] border-[#C18C55]/30';
            return (
              <motion.div
                key={cap.id}
                whileHover={{ y: -6, rotateX: 1.5, rotateY: -1.5 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="morph-card p-6 sm:p-7 flex flex-col justify-between space-y-5 perspective-1000"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#F4EDE1] border border-[rgba(193,140,85,0.3)] flex items-center justify-center text-[#C18C55] shadow-sm">
                      <Icon size={22} />
                    </div>
                    <span className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full border ${toneBadge}`}>
                      {cap.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#29211D]">
                      {cap.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#817366] leading-relaxed mt-2">
                      {cap.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[rgba(129,115,102,0.14)] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#817366]">0{idx + 1} · ENGINE SPEC</span>
                  <span className="font-semibold text-[#29211D]">{cap.metric}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* =================================================================
          SECTION 3: HOW IT WORKS (6-NODE ANIMATED WORKFLOW)
          ================================================================= */}
      <section id="how-it-works" className="scroll-reveal-section max-w-7xl mx-auto px-6 py-16">
        <div className="morph-surface p-8 sm:p-12 space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#C18C55] font-semibold">
                End-to-End Settlement Pipeline
              </span>
              <h2 className="text-3xl font-serif font-bold text-[#29211D]">
                How CineLedger Turns Raw Ticket Feeds Into Verified Payouts
              </h2>
            </div>
            <p className="text-xs font-mono text-[#817366]">
              Select any stage below to inspect execution behavior
            </p>
          </div>

          {/* Interactive 6-Node Horizontal Flow */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 relative">
            {WORKFLOW_STEPS.map((node, i) => {
              const Icon = node.icon;
              const isSelected = activeStep === i;
              return (
                <button
                  key={node.step}
                  type="button"
                  onClick={() => setActiveStep(i)}
                  className={`relative p-4 rounded-2xl border text-left transition-all duration-300 ${
                    isSelected
                      ? 'bg-white border-[#C18C55] shadow-lg -translate-y-1'
                      : 'bg-[#FBF8F2]/80 border-[rgba(129,115,102,0.18)] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-[#C18C55] text-white'
                          : 'bg-[#F4EDE1] text-[#817366]'
                      }`}
                    >
                      {node.step}
                    </span>
                    <Icon
                      size={16}
                      className={isSelected ? 'text-[#C18C55]' : 'text-[#817366]'}
                    />
                  </div>
                  <p className="font-serif font-bold text-sm text-[#29211D] leading-snug">
                    {node.title}
                  </p>
                  <p className="text-[11px] text-[#817366] mt-0.5">{node.subtitle}</p>
                </button>
              );
            })}
          </div>

          {/* Active Stage Details Bar */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/85 border border-[rgba(193,140,85,0.3)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C18C55] font-bold">
                STAGE {WORKFLOW_STEPS[activeStep].step} · {WORKFLOW_STEPS[activeStep].subtitle}
              </span>
              <h3 className="font-serif font-bold text-lg text-[#29211D]">
                {WORKFLOW_STEPS[activeStep].title}
              </h3>
              <p className="text-sm text-[#817366]">{WORKFLOW_STEPS[activeStep].detail}</p>
            </div>
            <Link
              to="/app/reconciliations"
              className="btn btn-primary text-xs whitespace-nowrap self-start sm:self-center"
            >
              <span>Inspect Live Cycles</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* =================================================================
          SECTION 4: FINANCIAL INTELLIGENCE
          ================================================================= */}
      <section id="financial-intelligence" className="scroll-reveal-section max-w-7xl mx-auto px-6 py-16">
        <div className="morph-card p-7 sm:p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(129,115,102,0.16)] pb-6">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#C18C55] font-semibold">
                FINANCIAL INTELLIGENCE
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#29211D] mt-1">
                Every Rupee Reconciled Before Payout
              </h2>
            </div>

            <div className="inline-flex p-1 rounded-xl bg-[#F4EDE1] border border-[rgba(129,115,102,0.2)]">
              <button
                type="button"
                onClick={() => setIntelTab('waterfall')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  intelTab === 'waterfall'
                    ? 'bg-white text-[#29211D] shadow-sm'
                    : 'text-[#817366] hover:text-[#29211D]'
                }`}
              >
                Settlement Waterfall
              </button>
              <button
                type="button"
                onClick={() => setIntelTab('matching')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  intelTab === 'matching'
                    ? 'bg-white text-[#29211D] shadow-sm'
                    : 'text-[#817366] hover:text-[#29211D]'
                }`}
              >
                Variance Classification
              </button>
            </div>
          </div>

          {intelTab === 'waterfall' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-3 font-mono text-xs sm:text-sm tabular-nums">
                {[
                  { label: '1. Gross Box-Office Collections (POS)', amount: '₹4,79,850.00', bar: 100, color: '#29211D' },
                  { label: '2. Statutory GST Deduction (18.00%)', amount: '- ₹86,373.00', bar: 18, color: '#B8755C' },
                  { label: '3. Ticketing Convenience Fee (2.50%)', amount: '- ₹11,996.25', bar: 2.5, color: '#B8755C' },
                  { label: '4. Virtual Print Fee (VPF Flat)', amount: '- ₹500.00', bar: 0.4, color: '#B8755C' },
                  { label: '5. Net Distributable Basis (NBO)', amount: '₹3,80,980.75', bar: 79.4, color: '#C18C55' },
                  { label: '6. Distributor Film Rental (52.50%)', amount: '₹2,00,014.89', bar: 41.7, color: '#657B65' },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="p-3.5 rounded-xl bg-white/85 border border-[rgba(129,115,102,0.16)] space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[#29211D] font-sans font-medium">{row.label}</span>
                      <span className="font-bold" style={{ color: row.color }}>
                        {row.amount}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#F4EDE1] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.max(row.bar, 2)}%`, backgroundColor: row.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-5 morph-inset p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[#657B65] font-semibold">
                  <TrendingUp size={15} />
                  <span>NET VS GROSS SETTLEMENT BASIS</span>
                </div>
                <h3 className="font-serif font-bold text-xl text-[#29211D]">
                  Transparent Contract Formulas
                </h3>
                <p className="text-xs sm:text-sm text-[#817366] leading-relaxed">
                  Contracts specify whether deductions apply prior to revenue sharing (NET_BOX_OFFICE) or whether splits calculate directly from reported gross receipts (GROSS_BOX_OFFICE). Every calculation generates an itemized 7-row financial voucher.
                </p>
                <div className="pt-2">
                  <Link to="/app/settlements" className="btn btn-sage text-xs w-full">
                    <span>Open Settlement Vouchers</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="table-container">
              <table className="cine-table tabular-nums">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Classification</th>
                    <th>Severity</th>
                    <th>Diagnostic Detail</th>
                    <th>POS Total</th>
                    <th>Distributor</th>
                    <th>Variance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-mono font-semibold text-[#C18C55]">DISC-2026-001</td>
                    <td><span className="badge badge-discrepancy">AMOUNT_MISMATCH</span></td>
                    <td className="font-mono text-xs font-bold text-[#B8755C]">HIGH</td>
                    <td className="text-xs text-[#817366]">IMAX tariff ₹650 in POS vs ₹610 in distributor EDI</td>
                    <td className="font-mono">₹1,95,000.00</td>
                    <td className="font-mono">₹1,83,000.00</td>
                    <td className="font-mono font-bold text-[#B8755C]">₹12,000.00</td>
                  </tr>
                  <tr>
                    <td className="font-mono font-semibold text-[#C18C55]">DISC-2026-002</td>
                    <td><span className="badge badge-dispute">MISSING_IN_DISTRIBUTOR</span></td>
                    <td className="font-mono text-xs font-bold text-[#8D4932]">CRITICAL</td>
                    <td className="text-xs text-[#817366]">Midnight premiere batch absent from distributor report</td>
                    <td className="font-mono">₹10,350.00</td>
                    <td className="font-mono">₹0.00</td>
                    <td className="font-mono font-bold text-[#B8755C]">₹10,350.00</td>
                  </tr>
                  <tr>
                    <td className="font-mono font-semibold text-[#C18C55]">DISC-2026-003</td>
                    <td><span className="badge badge-draft">REFUND_INCONSISTENCY</span></td>
                    <td className="font-mono text-xs font-bold text-[#817366]">MEDIUM</td>
                    <td className="text-xs text-[#817366]">Audio fault patron refund omitted from EDI deduction</td>
                    <td className="font-mono">₹5,650.00</td>
                    <td className="font-mono">₹0.00</td>
                    <td className="font-mono font-bold text-[#B8755C]">₹5,650.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* =================================================================
          SECTION 5: SECURITY (3D CRYPTOGRAPHIC AUDIT-CHAIN VISUALIZATION)
          ================================================================= */}
      <section id="security" className="scroll-reveal-section max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="inline-block text-[11px] font-mono uppercase tracking-widest text-[#465B46] bg-[#657B65]/12 px-3.5 py-1 rounded-full border border-[#657B65]/30">
            Cryptographic Audit Security
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#29211D]">
            Interactive SHA-256 Hash-Chained History
          </h2>
          <p className="text-sm sm:text-base text-[#817366]">
            Each ledger block binds its predecessor's digest (`SHA256(previousHash + "|" + payload)`). Toggle a simulated mutation below to observe instant chain invalidation.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <button
            type="button"
            onClick={() => setSimulatedTamper(!simulatedTamper)}
            className={`btn text-xs ${simulatedTamper ? 'btn-sage' : 'btn-outline-brass'}`}
          >
            <Lock size={14} />
            <span>
              {simulatedTamper
                ? 'Restore Valid Cryptographic Chain'
                : 'Simulate Block #002 Mutation'}
            </span>
          </button>
        </div>

        {/* 3D Perspective Hash-Chain Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 perspective-1200">
          {AUDIT_CHAIN_NODES.map((block, index) => {
            const broken = simulatedTamper && index >= 1;
            const isTarget = simulatedTamper && index === 1;
            return (
              <motion.div
                key={block.seq}
                whileHover={{ rotateY: -4, rotateX: 3, z: 18, y: -4 }}
                transition={{ duration: 0.25 }}
                className={`morph-card p-5 space-y-3 preserve-3d border ${
                  broken
                    ? 'border-[#B8755C] bg-[#F7EBE6]/90'
                    : 'border-[rgba(129,115,102,0.22)]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="font-bold text-[#C18C55]">BLOCK #{block.seq}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-semibold ${
                      broken
                        ? 'bg-[#B8755C]/20 text-[#8D4932]'
                        : 'bg-[#657B65]/15 text-[#465B46]'
                    }`}
                  >
                    {isTarget ? 'MUTATED' : broken ? 'HASH BROKEN' : block.status}
                  </span>
                </div>

                <div>
                  <p className="font-mono text-xs font-bold text-[#29211D]">{block.event}</p>
                  <p className="text-[10px] text-[#817366] font-mono mt-0.5">{block.actor}</p>
                </div>

                <p className="text-xs text-[#5E5147] leading-relaxed">
                  {isTarget ? 'ALTERED_DESCRIPTION_TAMPER_TEST' : block.summary}
                </p>

                <div className="pt-2.5 border-t border-[rgba(129,115,102,0.16)] font-mono text-[10px] space-y-1">
                  <p className="text-[#817366] truncate">
                    Prev: <span className="text-[#29211D]">{block.prevHash}</span>
                  </p>
                  <p className={`truncate ${broken ? 'text-[#B8755C] font-bold' : 'text-[#657B65]'}`}>
                    Hash: {isTarget ? 'deadbeef0000...mismatch' : block.hash}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link to="/app/audit-log" className="btn btn-secondary text-xs">
            <ShieldCheck size={14} className="text-[#657B65]" />
            <span>Open Live Backend Audit Explorer</span>
          </Link>
        </div>
      </section>

      {/* =================================================================
          SECTION 6: FINAL CTA
          ================================================================= */}
      <section className="scroll-reveal-section max-w-7xl mx-auto px-6 py-12">
        <div className="morph-surface p-10 sm:p-16 text-center space-y-6 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#C18C55] font-semibold">
              Transparent Theatrical Accounting
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#29211D] leading-tight">
              Every Collection Deserves Clarity.
            </h2>
            <p className="text-sm sm:text-base text-[#817366]">
              Explore live MySQL reconciliations, upload CSV theatre dumps, calculate contract-aware payouts, and verify SHA-256 audit integrity.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link to="/login" className="btn btn-primary text-sm px-8 py-3.5 rounded-xl">
                <span>Get Started with CineLedger</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/app/dashboard" className="btn btn-secondary text-sm px-8 py-3.5 rounded-xl">
                <span>Open Live Workbench</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
