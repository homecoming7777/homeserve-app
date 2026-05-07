import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/Card';
import Button from '../ui/Button';

export default function QuickStartBanner({ role }: { role: 'client' | 'provider' }) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hidden = localStorage.getItem(`hideQuickStart_${role}`);
    if (!hidden) {
      setVisible(true);
    }
  }, [role]);

  if (!visible) return null;

  const dismiss = () => {
    localStorage.setItem(`hideQuickStart_${role}`, 'true');
    setVisible(false);
  };

  const clientSteps = [
    {
      title: t('quickFindPro', '1. Find a Pro'),
      desc: t('quickFindProDesc', 'Search your city and compare vetted professionals.'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      )
    },
    {
      title: t('quickBook', '2. Book Instantly'),
      desc: t('quickBookDesc', 'Select a service and book it in under 60 seconds.'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      )
    },
    {
      title: t('quickApprove', '3. Approve & Review'),
      desc: t('quickApproveDesc', 'Once the job is done, approve the work to release payment.'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      )
    }
  ];

  const providerSteps = [
    {
      title: t('quickList', '1. List Services'),
      desc: t('quickListDesc', 'Create attractive service listings with clear pricing.'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
      )
    },
    {
      title: t('quickAccept', '2. Accept Requests'),
      desc: t('quickAcceptDesc', 'Get notified instantly when clients book you.'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
      )
    },
    {
      title: t('quickEarn', '3. Complete & Earn'),
      desc: t('quickEarnDesc', 'Mark the job as done to receive your earnings.'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      )
    }
  ];

  const steps = role === 'provider' ? providerSteps : clientSteps;

  return (
    <div className="mb-8 animate-in slide-in-from-top-4 fade-in duration-500">
      <Card className="border-0 bg-gradient-to-br from-blue-600 to-indigo-800 dark:from-blue-900 dark:to-slate-900 overflow-hidden relative shadow-premium">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-emerald-400/20 blur-2xl"></div>

        <div className="relative z-10 p-6 sm:p-8">
          <div className="flex flex-wrap gap-4 items-start justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                👋 {t('welcomeGettingStarted', 'Welcome! Getting Started is Easy')}
              </h2>
              <p className="text-blue-100 font-medium mt-1">
                {t('quickStartSub', 'Follow these three simple steps to make the most out of your account.')}
              </p>
            </div>
            <button
              onClick={dismiss}
              className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              title={t('dismiss', 'Dismiss')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 hover:bg-white/20 transition-colors">
                <div className="bg-white/20 text-white w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">{step.title}</h3>
                <p className="text-blue-100 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
            <Button onClick={dismiss} className="bg-white text-blue-900 hover:bg-slate-50 border-0 font-bold px-6 shadow-lg shadow-black/10">
              {t('gotItThanks', 'Got it, thanks!')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
