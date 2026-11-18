import React from 'react';
import { Calendar, MapPin, X } from 'lucide-react';
import { AtelierDossierTab, SalonLocation } from '../types/storefront';

interface AtelierModalProps {
  activeTab: AtelierDossierTab;
  appointmentSalon: SalonLocation;
  appointmentDate: string;
  appointmentSubmitted: boolean;
  onClose: () => void;
  onSelectTab: (tab: AtelierDossierTab) => void;
  onSelectSalon: (salon: SalonLocation) => void;
  onSetDate: (date: string) => void;
  onResetSubmitted: () => void;
  onSubmitAppointment: (e: React.FormEvent) => void;
}

const TABS = [
  { id: 'provenance', label: 'Provenance' },
  { id: 'sizing', label: 'Sizing' },
  { id: 'assurance', label: 'Care & Courier' },
  { id: 'appointment', label: 'Private Salon' }
] as const;

const SALONS: readonly SalonLocation[] = [
  'Mumbai · Kala Ghoda',
  'New Delhi · Mehrauli',
  'Private Video Viewing'
];

/** Multi-tab Atelier dossier modal for material quality, Indian sizing, Pan-India assurance & appointments. */
export function AtelierModal({
  activeTab,
  appointmentSalon,
  appointmentDate,
  appointmentSubmitted,
  onClose,
  onSelectTab,
  onSelectSalon,
  onSetDate,
  onResetSubmitted,
  onSubmitAppointment
}: AtelierModalProps) {
  if (!activeTab) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#2B1C1E]/65 backdrop-blur-sm flex items-center justify-center p-5"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FAF1F0] max-w-xl w-full p-8 md:p-10 border border-[#2B1C1E]/20 relative ao-panel-enter"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close atelier modal"
          className="absolute top-6 right-6 text-[#2B1C1E] hover:text-[#9A6058]"
        >
          <X className="w-5 h-5 stroke-[1.4]" />
        </button>

        <div className="flex space-x-5 border-b border-[#2B1C1E]/12 pb-3 mb-7 text-[10px] uppercase tracking-[0.22em]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`pb-1 border-b transition-colors ${
                activeTab === tab.id
                  ? 'border-[#BC8379] text-[#2B1C1E] font-medium'
                  : 'border-transparent text-[#2B1C1E]/50 hover:text-[#2B1C1E]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'provenance' && (
          <div className="space-y-4">
            <h3 className="font-serif text-3xl font-light">
              Material Quality &amp; Anti-Tarnish Assurance
            </h3>
            <p className="text-xs text-[#2B1C1E]/75 font-light leading-relaxed">
              Every Shreya &amp; Co. piece is crafted with premium anti-tarnish plating on skin-safe stainless steel and brass alloys. Lead-free, nickel-free, and hypoallergenic — designed to stay radiant without turning black through everyday wear.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
              <div className="border border-[#2B1C1E]/12 p-4 bg-[#F3E4E2]/60">
                <span className="block text-[9px] uppercase tracking-[0.22em] text-[#9A6058] mb-1">
                  Prayagraj Creative Studio
                </span>
                Curated aesthetic designs, trendy statement silhouettes, and hand-finished details crafted with love.
              </div>
              <div className="border border-[#2B1C1E]/12 p-4 bg-[#F3E4E2]/60">
                <span className="block text-[9px] uppercase tracking-[0.22em] text-[#9A6058] mb-1">
                  Quality Check &amp; Packaging
                </span>
                Every piece undergoes strict inspection for clasp strength, smooth edges, and shine before entering luxury gift packaging.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sizing' && (
          <div className="space-y-4">
            <h3 className="font-serif text-3xl font-light">
              Indian Ring &amp; Wrist Calibration
            </h3>
            <p className="text-xs text-[#2B1C1E]/75 font-light leading-relaxed">
              For wide bands above 4 mm (such as Celestial Signet Ring), select one Indian size larger than thin-band rings for comfortable knuckle clearance.
            </p>
            <div className="border border-[#2B1C1E]/15 divide-y divide-[#2B1C1E]/10 text-xs ao-num">
              <div className="grid grid-cols-3 p-3 bg-[#F3E4E2] text-[10px] uppercase tracking-[0.2em]">
                <span>Indian Size</span>
                <span>Inside Diameter</span>
                <span>Circumference</span>
              </div>
              {[
                ['IN 10', '15.9 mm', '50.0 mm'],
                ['IN 12', '16.5 mm', '51.8 mm'],
                ['IN 14', '17.2 mm', '54.0 mm'],
                ['IN 16', '17.8 mm', '55.9 mm']
              ].map(([sizeIn, mm, circ]) => (
                <div key={sizeIn} className="grid grid-cols-3 p-3">
                  <span className="font-medium">{sizeIn}</span>
                  <span>{mm}</span>
                  <span>{circ}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'assurance' && (
          <div className="space-y-4">
            <h3 className="font-serif text-3xl font-light">
              Secure Pan-India Delivery &amp; Quality Care
            </h3>
            <p className="text-xs text-[#2B1C1E]/75 font-light leading-relaxed">
              Every order dispatches in tamper-evident protective boxes, tracked door-to-door across India. We ensure every piece reaches you in pristine condition with complete transit safety.
            </p>
            <ul className="space-y-2.5 text-xs text-[#2B1C1E]/80 font-light border-t border-[#2B1C1E]/10 pt-4">
              <li>
                · Anti-tarnish &amp; water-resistant coating to protect against sweat and daily moisture.
              </li>
              <li>
                · Fast Pan-India courier delivery across 19,000+ pin codes via BlueDart &amp; Delhivery.
              </li>
              <li>
                · 100% skin-safe, hypoallergenic &amp; nickel-free materials suitable for sensitive skin.
              </li>
            </ul>
          </div>
        )}

        {activeTab === 'appointment' && (
          <div className="space-y-5">
            <h3 className="font-serif text-3xl font-light">Book a Private Viewing</h3>
            {appointmentSubmitted ? (
              <div className="border border-[#BC8379]/45 bg-[#F3E4E2] p-6 space-y-3">
                <span className="text-[10px] uppercase tracking-[0.26em] text-[#9A6058] block">
                  Appointment Requested
                </span>
                <p className="text-xs text-[#2B1C1E]/80 font-light leading-relaxed">
                  Our concierge will confirm your private viewing at{' '}
                  <strong className="font-medium">{appointmentSalon}</strong> on{' '}
                  <strong className="font-medium">{appointmentDate}</strong> within two business hours.
                </p>
                <button
                  type="button"
                  onClick={onResetSubmitted}
                  className="text-[10px] uppercase tracking-[0.2em] underline underline-offset-4 text-[#2B1C1E]/70 hover:text-[#2B1C1E]"
                >
                  Schedule another consultation
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmitAppointment} className="space-y-4">
                <div>
                  <label className="flex items-center space-x-1.5 text-[10px] uppercase tracking-[0.22em] text-[#2B1C1E]/65 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-[#9A6058]" />
                    <span>Select Salon</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {SALONS.map((salon) => (
                      <button
                        key={salon}
                        type="button"
                        onClick={() => onSelectSalon(salon)}
                        className={`p-3 border text-[10px] uppercase tracking-[0.15em] text-left transition-colors ${
                          appointmentSalon === salon
                            ? 'border-[#2B1C1E] bg-[#F3E4E2] font-medium'
                            : 'border-[#2B1C1E]/20 text-[#2B1C1E]/70'
                        }`}
                      >
                        {salon}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center space-x-1.5 text-[10px] uppercase tracking-[0.22em] text-[#2B1C1E]/65 mb-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#9A6058]" />
                      <span>Preferred Date</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={appointmentDate}
                      onChange={(e) => onSetDate(e.target.value)}
                      className="w-full border border-[#2B1C1E]/25 px-3 py-2.5 text-xs bg-[#FDF8F7]/85 focus:outline-none focus:border-[#2B1C1E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.22em] text-[#2B1C1E]/65 mb-1.5">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      className="w-full border border-[#2B1C1E]/25 px-3 py-2.5 text-xs bg-[#FDF8F7]/85 focus:outline-none focus:border-[#2B1C1E]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2B1C1E] text-[#FAF1F0] py-3.5 text-[11px] uppercase tracking-[0.24em] font-medium hover:bg-[#9A6058] transition-colors"
                >
                  Request Private Consultation
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

