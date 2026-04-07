import React from "react";
import { useTranslation } from "react-i18next";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: string;
}

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose, role }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const faqs = [
    { q: "How do I book a session?", a: "Go to the Bookings page, select a teacher and a time slot, then click 'Book Now'." },
    { q: "Where can I find lost items?", a: "Visit the 'Lost & Found' section in your sidebar to see all reported items." },
    { q: "How do I update my profile?", a: "Click on your profile avatar in the top bar to upload a new image." }
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-in fade-in duration-300 pointer-events-auto">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-900">{t("support_center")}</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100 transition-colors">
            <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <a 
              href="https://wa.me/25261XXXXXXX" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-center transition-transform hover:scale-105"
            >
              <div className="rounded-full bg-emerald-600 p-2 text-white text-xs font-bold">WA</div>
              <div>
                <p className="text-sm font-bold text-emerald-900">WhatsApp</p>
                <p className="text-[10px] text-emerald-600">Fast Response</p>
              </div>
            </a>
            <a 
              href="mailto:support@simad.edu.so" 
              className="flex flex-col items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-center transition-transform hover:scale-105"
            >
              <div className="rounded-full bg-blue-600 p-2 text-white">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-blue-900">Email</p>
                <p className="text-[10px] text-blue-600">Official Support</p>
              </div>
            </a>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-slate-800">{t("frequently_asked_questions")}</h3>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-bold text-slate-800">{faq.q}</p>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="mt-8 w-full rounded-2xl bg-slate-900 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          {t("close")}
        </button>
      </div>
    </div>
  );
};

export default SupportModal;
