import { RefreshCw, ShieldCheck, Truck } from 'lucide-react';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { AtelierDossierTab } from '../types/storefront';

interface TrustStripProps {
  onOpenModal: (tab: AtelierDossierTab) => void;
}

/** Three-column architectural trust & Pan-India insured delivery strip. */
export function TrustStrip({ onOpenModal }: TrustStripProps) {
  const { ref, visible } = useRevealOnScroll<HTMLElement>(0.15);

  return (
    <section
      ref={ref}
      data-visible={visible}
      aria-label="Hallmark Assurance and Pan-India Delivery"
      className="border-y border-[#2B1C1E]/10 py-11 px-6 md:px-12 bg-[#F3E4E2] ao-reveal"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <button
          type="button"
          onClick={() => onOpenModal('provenance')}
          style={{ transitionDelay: '40ms' }}
          className="ao-stagger-item flex items-center space-x-4 justify-center md:justify-start group text-left active:scale-[0.985] transition-transform"
        >
          <ShieldCheck className="w-5 h-5 text-[#9A6058] stroke-[1.35] flex-shrink-0 group-hover:-translate-y-0.5 transition-transform" />
          <div>
            <h2 className="text-[11px] uppercase tracking-[0.22em] font-medium group-hover:text-[#9A6058] transition-colors">
              BIS HUID Lifetime Care
            </h2>
            <p className="text-xs text-[#2B1C1E]/60 font-light mt-0.5">
              BIS 750 hallmarked gold, IGI stone dossiers &amp; annual studio polishing.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onOpenModal('assurance')}
          style={{ transitionDelay: '130ms' }}
          className="ao-stagger-item flex items-center space-x-4 justify-center md:justify-start group text-left active:scale-[0.985] transition-transform"
        >
          <Truck className="w-5 h-5 text-[#9A6058] stroke-[1.35] flex-shrink-0 group-hover:-translate-y-0.5 transition-transform" />
          <div>
            <h2 className="text-[11px] uppercase tracking-[0.22em] font-medium group-hover:text-[#9A6058] transition-colors">
              Insured Pan-India Delivery
            </h2>
            <p className="text-xs text-[#2B1C1E]/60 font-light mt-0.5">
              Complimentary OTP-verified vault delivery across 19,000+ Indian pin codes.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onOpenModal('sizing')}
          style={{ transitionDelay: '220ms' }}
          className="ao-stagger-item flex items-center space-x-4 justify-center md:justify-start group text-left active:scale-[0.985] transition-transform"
        >
          <RefreshCw className="w-5 h-5 text-[#9A6058] stroke-[1.35] flex-shrink-0 group-hover:rotate-90 transition-transform duration-500" />
          <div>
            <h2 className="text-[11px] uppercase tracking-[0.22em] font-medium group-hover:text-[#9A6058] transition-colors">
              Atelier Sizing &amp; Exchange
            </h2>
            <p className="text-xs text-[#2B1C1E]/60 font-light mt-0.5">
              Complimentary 30-day bespoke resizing and insured doorstep pickup.
            </p>
          </div>
        </button>
      </div>
    </section>
  );
}

