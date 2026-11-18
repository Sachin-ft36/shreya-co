import React from 'react';
import { ArrowUpRight, Check, Facebook, Instagram, Twitter } from 'lucide-react';
import { CURRENCY_CONFIG, INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../data/catalog';
import { AtelierDossierTab, Category, CurrencyCode } from '../types/storefront';

interface FooterProps {
  currency: CurrencyCode;
  dispatchEmail: string;
  dispatchSubscribed: boolean;
  onSetCurrency: (code: CurrencyCode) => void;
  onSetDispatchEmail: (email: string) => void;
  onSubmitDispatch: (e: React.FormEvent) => void;
  onJumpToCategory: (cat: Category) => void;
  onOpenAtelierModal: (tab: AtelierDossierTab) => void;
  onTriggerToast: (msg: string) => void;
}

/** 4-column luxury dark cocoa footer with newsletter dispatch & navigation columns. */
export function Footer({
  currency,
  dispatchEmail,
  dispatchSubscribed,
  onSetCurrency,
  onSetDispatchEmail,
  onSubmitDispatch,
  onJumpToCategory,
  onOpenAtelierModal,
  onTriggerToast
}: FooterProps) {
  return (
    <footer className="border-t border-[#2B1C1E]/10 bg-[#2B1C1E] text-[#FAF1F0] py-24 px-6 md:px-12 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
        <div className="md:col-span-4 space-y-6">
          <div className="flex items-center space-x-3">
            <img
              src="/shreya-logo-seal.png"
              alt="Shreya & Co. Monogram"
              loading="lazy"
              className="w-12 h-12 object-contain flex-shrink-0"
            />
            <div>
              <span className="font-serif text-2xl tracking-[0.28em] uppercase font-normal block">
                SHREYA &amp; CO.
              </span>
              <span className="block text-[8px] uppercase tracking-[0.3em] text-[#D9A79C] mt-0.5">
                Jewellery · Accessories · Lifestyle
              </span>
            </div>
          </div>
          <p className="text-xs text-[#FAF1F0]/70 font-light leading-relaxed max-w-sm">
            Curated aesthetic jewellery and trendy accessories crafted for everyday elegance. Anti-tarnish, water-resistant &amp; hypoallergenic fashion finds with Pan-India delivery from Prayagraj.
          </p>
          <div className="flex items-center space-x-5 pt-2">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram ${INSTAGRAM_HANDLE}`}
              className="inline-flex items-center gap-2 border border-[#FAF1F0]/25 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[#FAF1F0]/90 hover:border-[#D9A79C] hover:text-[#D9A79C] transition-colors"
            >
              <Instagram className="w-4 h-4 stroke-[1.5]" />
              <span>{INSTAGRAM_HANDLE}</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <button
              type="button"
              onClick={() => onTriggerToast('Maison updates via Facebook')}
              aria-label="Facebook"
              className="text-[#FAF1F0]/65 hover:text-[#D9A79C] transition-colors"
            >
              <Facebook className="w-5 h-5 stroke-[1.4]" />
            </button>
            <button
              type="button"
              onClick={() => onTriggerToast('Press dispatches @shreyaandco')}
              aria-label="Twitter"
              className="text-[#FAF1F0]/65 hover:text-[#D9A79C] transition-colors"
            >
              <Twitter className="w-5 h-5 stroke-[1.4]" />
            </button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <h4 className="text-[11px] uppercase tracking-[0.25em] text-[#D9A79C] font-medium">
            Collections
          </h4>
          <ul className="space-y-3 text-xs text-[#FAF1F0]/80 font-light tracking-wide">
            <li>
              <button
                type="button"
                onClick={() => onJumpToCategory('All')}
                className="hover:text-[#D9A79C] transition-colors"
              >
                The Gold Edit
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onJumpToCategory('Rings')}
                className="hover:text-[#D9A79C] transition-colors"
              >
                Solitaire Rings
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onJumpToCategory('Necklaces')}
                className="hover:text-[#D9A79C] transition-colors"
              >
                Everyday Chains
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onJumpToCategory('Bracelets')}
                className="hover:text-[#D9A79C] transition-colors"
              >
                Architectural Cuffs
              </button>
            </li>
          </ul>
        </div>

        <div className="md:col-span-2 space-y-4">
          <h4 className="text-[11px] uppercase tracking-[0.25em] text-[#D9A79C] font-medium">
            The Atelier
          </h4>
          <ul className="space-y-3 text-xs text-[#FAF1F0]/80 font-light tracking-wide">
            <li>
              <button
                type="button"
                onClick={() => onOpenAtelierModal('provenance')}
                className="hover:text-[#D9A79C] transition-colors"
              >
                Our Craft &amp; Materials
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onOpenAtelierModal('sizing')}
                className="hover:text-[#D9A79C] transition-colors"
              >
                Sizing &amp; Fit Guide
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onOpenAtelierModal('appointment')}
                className="hover:text-[#D9A79C] transition-colors"
              >
                Private Appointments
              </button>
            </li>
            <li>
              <a href="#journal" className="hover:text-[#D9A79C] transition-colors inline-block">
                Editorial Journal
              </a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-4 space-y-4">
          <h4 className="text-[11px] uppercase tracking-[0.25em] text-[#D9A79C] font-medium">
            Private Dispatch
          </h4>
          <p className="text-xs text-[#FAF1F0]/70 font-light leading-relaxed">
            Receive private invitations to numbered atelier releases and craftsmanship monographs.
          </p>
          {dispatchSubscribed ? (
            <div className="border border-[#D9A79C]/45 px-4 py-3.5 text-xs text-[#FAF1F0]/90 flex items-center space-x-2.5">
              <Check className="w-4 h-4 text-[#D9A79C]" />
              <span>Registered for Private Dispatch ({dispatchEmail}).</span>
            </div>
          ) : (
            <form onSubmit={onSubmitDispatch} className="flex pt-1">
              <label htmlFor="dispatch-email" className="sr-only">
                Email address for Private Dispatch
              </label>
              <input
                id="dispatch-email"
                type="email"
                value={dispatchEmail}
                onChange={(e) => onSetDispatchEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="bg-transparent border border-[#FAF1F0]/30 px-4 py-3 text-xs text-[#FAF1F0] placeholder:text-[#FAF1F0]/40 focus:outline-none focus:border-[#D9A79C] flex-grow rounded-none"
              />
              <button
                type="submit"
                className="bg-[#D9A79C] text-[#2B1C1E] px-6 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-[#E6BFB6] transition-colors rounded-none"
              >
                Join
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-[#FAF1F0]/10 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.22em] text-[#FAF1F0]/55 gap-4">
        <p>© 2026 Shreya &amp; Co. Fine Jewels India. All rights reserved.</p>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center space-x-2 border-r border-[#FAF1F0]/15 pr-6">
            {(Object.keys(CURRENCY_CONFIG) as CurrencyCode[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => onSetCurrency(code)}
                className={`transition-colors ${
                  currency === code ? 'text-[#D9A79C]' : 'hover:text-[#FAF1F0]'
                }`}
              >
                {code}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onOpenAtelierModal('assurance')}
            className="hover:text-[#D9A79C] transition-colors"
          >
            Shipping &amp; Care
          </button>
          <button
            type="button"
            onClick={() => onOpenAtelierModal('provenance')}
            className="hover:text-[#D9A79C] transition-colors"
          >
            Materials &amp; Quality
          </button>
          <button
            type="button"
            onClick={() => onOpenAtelierModal('appointment')}
            className="hover:text-[#D9A79C] transition-colors"
          >
            Book Salon
          </button>
        </div>
      </div>
    </footer>
  );
}

