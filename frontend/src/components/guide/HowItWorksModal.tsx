import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';

export default function HowItWorksModal({ open, onClose, role }: { open: boolean; onClose: () => void; role: 'client' | 'provider' | 'admin' }) {
  const { t } = useTranslation();

  if (!open) return null;

  const clientSteps = [
    {
      title: t('quickFindPro', '1. Find a Pro'),
      desc: t('quickFindProDesc', 'Search your city and compare vetted professionals.'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      )
    },
    {
      title: t('quickBook', '2. Book Instantly'),
      desc: t('quickBookDesc', 'Select a service and book it in under 60 seconds.'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      )
    },
    {
      title: t('quickApprove', '3. Approve & Review'),
      desc: t('quickApproveDesc', 'Once the job is done, approve the work to release payment.'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      )
    }
  ];

  const providerSteps = [
    {
      title: t('quickList', '1. List Services'),
      desc: t('quickListDesc', 'Create attractive service listings with clear pricing.'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
      )
    },
    {
      title: t('quickAccept', '2. Accept Requests'),
      desc: t('quickAcceptDesc', 'Get notified instantly when clients book you.'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
      )
    },
    {
      title: t('quickEarn', '3. Complete & Earn'),
      desc: t('quickEarnDesc', 'Mark the job as done to receive your earnings.'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      )
    }
  ];

  const steps = role === 'provider' ? providerSteps : clientSteps;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden relative z-10 animate-in zoom-in-95 fade-in duration-200">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-900 dark:to-slate-800"></div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/10 hover:bg-black/20 p-2 rounded-full transition-colors z-20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="relative pt-12 px-8 pb-8 text-center z-10">
          <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6 rotate-3 border border-slate-100 dark:border-slate-700">
            <svg className="w-10 h-10 text-blue-600 dark:text-blue-400 -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">{t('howItWorks', 'How It Works')}</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto font-medium">
            {role === 'provider' 
              ? t('providerGuideSub', 'Growing your business on our platform is simple.') 
              : t('clientGuideSub', 'Getting the help you need is easier than ever.')}
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center">
                {idx !== steps.length - 1 && (
                  <div className="hidden sm:block absolute top-10 left-[60%] w-full h-0.5 bg-slate-200 dark:bg-slate-700 -z-10"></div>
                )}
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6 shadow-sm ring-8 ring-white dark:ring-slate-900">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
            <Button onClick={onClose} className="px-8 shadow-blue-600/20 shadow-lg">
              {t('gotIt', 'Got It')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
