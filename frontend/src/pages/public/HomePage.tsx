import { Link, useNavigate } from 'react-router-dom';
import { JSX, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../state/auth';
import { fetchTopProviders, type ProviderRecommendation } from '../../api/providers';
import SiteHeader from '../../components/layout/SiteHeader';
import SiteFooter from '../../components/layout/SiteFooter';
import AppAssistant from '../../components/assistant/AppAssistant';

function IconShield({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function IconBolt({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function IconCard({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}

function IconHeart({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

function IconStar({ className = 'h-5 w-5', fill = 'none' }: { className?: string; fill?: string }) {
  if (fill === 'currentColor') {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    );
  }
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

function IconClock({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default function HomePage({ onSwitchLang }: { onSwitchLang: (lng: 'en' | 'fr' | 'ar') => void }) {
  const { t } = useTranslation();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [topProviders, setTopProviders] = useState<ProviderRecommendation[]>([]);
  const [searchQ, setSearchQ] = useState('');
  const [zip, setZip] = useState('');

  useEffect(() => {
    fetchTopProviders()
      .then((data) => setTopProviders(data.slice(0, 6)))
      .catch(() => setTopProviders([]));
  }, []);

  const statsBanner = [
    { icon: IconShield, label: t('statBackgroundChecked', 'Background-checked pros'), value: '15,000+' },
    { icon: IconStar, label: t('statAvgProviderRating', 'Avg. provider rating'), value: '4.8 ★' },
    { icon: IconClock, label: t('statSameDayAvailability', 'Same-day availability'), value: '24/7' },
  ];

  const features = [
    { Icon: IconShield, title: t('featureVettedTitle', 'Vetted & Insured'), desc: t('featureVettedDesc', 'Every provider passes background checks and carries liability insurance.'), ring: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
    { Icon: IconBolt, title: t('featureInstantTitle', 'Instant Booking'), desc: t('featureInstantDesc', 'Book in under 60 seconds. No phone calls, no waiting for quotes.'), ring: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
    { Icon: IconCard, title: t('featureUpfrontTitle', 'Upfront Pricing'), desc: t('featureUpfrontDesc', 'See the exact price before you book. Zero hidden fees, ever.'), ring: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' },
    { Icon: IconHeart, title: t('featureGuaranteeTitle', 'Satisfaction Guarantee'), desc: t('featureGuaranteeDesc', "Not happy? We'll re-do the job or give you a full refund."), ring: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
  ];

  const categoriesGrid = [
    { nameKey: 'catCleaning', count: 1240, icon: 'leaf', borderColor: 'emerald', bgColor: 'emerald-50', textColor: 'emerald-600', darkBgColor: 'emerald-900/20', darkTextColor: 'emerald-400' },
    { nameKey: 'catPainting', count: 890, icon: 'paintbrush', borderColor: 'pink', bgColor: 'pink-50', textColor: 'pink-600', darkBgColor: 'pink-900/20', darkTextColor: 'pink-400' },
    { nameKey: 'catHvac', count: 760, icon: 'wind', borderColor: 'sky', bgColor: 'sky-50', textColor: 'sky-600', darkBgColor: 'sky-900/20', darkTextColor: 'sky-400' },
    { nameKey: 'catPlumbing', count: 980, icon: 'droplets', borderColor: 'blue', bgColor: 'blue-50', textColor: 'blue-600', darkBgColor: 'blue-900/20', darkTextColor: 'blue-400' },
    { nameKey: 'catCarpentry', count: 620, icon: 'hammer', borderColor: 'orange', bgColor: 'orange-50', textColor: 'orange-600', darkBgColor: 'orange-900/20', darkTextColor: 'orange-400' },
    { nameKey: 'catElectrical', count: 1120, icon: 'zap', borderColor: 'amber', bgColor: 'amber-50', textColor: 'amber-600', darkBgColor: 'amber-900/20', darkTextColor: 'amber-400' },
    { nameKey: 'catPest', count: 430, icon: 'bug', borderColor: 'red', bgColor: 'red-50', textColor: 'red-600', darkBgColor: 'red-900/20', darkTextColor: 'red-400' },
    { nameKey: 'catLandscaping', count: 680, icon: 'leaf', borderColor: 'green', bgColor: 'green-50', textColor: 'green-600', darkBgColor: 'green-900/20', darkTextColor: 'green-400' },
  ];

  const renderCategoryIcon = (iconName: string, className: string) => {
    const icons: Record<string, JSX.Element> = {
      leaf: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
      paintbrush: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
      wind: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
      droplets: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
      hammer: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      zap: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3l4 4-4 4m6-8l4 4-4 4" /></svg>,
      bug: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    };
    return icons[iconName] || icons.leaf;
  };

  const testimonialItems = [
    {
      quoteKey: 'testimonial1',
      nameKey: 'testimonial1Name',
      roleKey: 'testimonial1Role',
      locationKey: 'testimonial1Location',
      serviceKey: 'testimonial1Service',
      avatar: 'https://i.pravatar.cc/80?img=5',
      rating: 5,
    },
    {
      quoteKey: 'testimonial2',
      nameKey: 'testimonial2Name',
      roleKey: 'testimonial2Role',
      locationKey: 'testimonial2Location',
      serviceKey: 'testimonial2Service',
      avatar: 'https://i.pravatar.cc/80?img=12',
      rating: 5,
    },
    {
      quoteKey: 'testimonial3',
      nameKey: 'testimonial3Name',
      roleKey: 'testimonial3Role',
      locationKey: 'testimonial3Location',
      serviceKey: 'testimonial3Service',
      avatar: 'https://i.pravatar.cc/80?img=47',
      rating: 5,
    },
  ];

  const howSteps = [
    { n: 1, title: t('stepHow1Title', 'Search & Compare'), desc: t('stepHow1Desc', 'Enter your zip code and the service you need. Browse vetted providers with real reviews, ratings, and upfront pricing — no surprises.'), Icon: IconShield, tone: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
    { n: 2, title: t('stepHow2Title', 'Book Instantly'), desc: t('stepHow2Desc', 'Pick a date and time that works for you. Confirm your booking in under a minute with secure payment. Get an instant confirmation.'), Icon: IconBolt, tone: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
    { n: 3, title: t('stepHow3Title', 'Relax & Review'), desc: t('stepHow3Desc', 'Your pro arrives on time, gets the job done right. Rate your experience afterward to help the community find the best providers.'), Icon: IconHeart, tone: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400' },
  ];

  const popularTags = [t('catCleaning'), t('catPlumbing'), t('catElectrical'), t('catHvac'), t('catLandscaping')];

  const onSearch = () => {
    if (auth) {
      navigate('/client/services');
      return;
    }
    navigate('/login', { state: { from: '/client/services' } });
  };

  return (
    <div className="min-h-screen font-sans selection:bg-emerald-500 selection:text-white bg-mesh dark:bg-slate-900 transition-colors">
      <SiteHeader onSwitchLang={onSwitchLang} />

      <section id="hero" className="relative pt-20 pb-28 md:pt-32 md:pb-40 overflow-hidden">
        <div className="mx-auto max-w-screen-xl px-4 text-center lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-white cursor-default text-xs font-bold px-4 py-2 rounded-full mb-8 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {t('heroTrustBadge', 'Trusted by 200,000+ homeowners')}
            </div>
            <h1 className="text-5xl text-white sm:text-6xl md:text-7xl font-extrabold mb-6 tracking-tight leading-[1.1]">
              {t('heroHeadlineBefore', 'Book Trusted Home')} <br className="hidden sm:block" />
              <span className="text-emerald-400 drop-shadow-md">{t('heroHeadlineHighlight', 'Services Near You')}</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              {t('heroSub', 'Connect with vetted, background-checked professionals for cleaning, plumbing, electrical, and 40+ other home services. Upfront pricing, no surprises.')}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mx-auto max-w-4xl"
          >
            <div className="flex flex-col gap-2 rounded-2xl md:rounded-full border border-white/20 bg-white/95 dark:bg-slate-900/95 p-2 shadow-2xl shadow-blue-900/50 backdrop-blur-xl sm:flex-row sm:items-center">
              <div className="flex min-h-[56px] flex-1 items-center gap-3 border-b border-slate-200 dark:border-slate-800 px-5 sm:border-b-0 sm:border-r">
                <svg className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('allServiceTypes', 'All Services')}</span>
              </div>
              <div className="flex min-h-[56px] flex-[2] items-center gap-3 px-5">
                <svg className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder={t('searchWhatService', 'What do you need help with?')}
                  className="w-full border-0 bg-transparent text-sm font-medium text-slate-900 dark:text-white outline-none placeholder:text-slate-400 focus:ring-0"
                />
              </div>
              <div className="flex min-h-[56px] flex-1 items-center gap-3 border-t border-slate-200 dark:border-slate-800 px-5 sm:border-t-0 sm:border-l">
                <svg className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder={t('searchZip', 'Zip code')}
                  className="w-full border-0 bg-transparent text-sm font-medium text-slate-900 dark:text-white outline-none placeholder:text-slate-400 focus:ring-0"
                />
              </div>
              <Button type="button" onClick={onSearch} className="w-full shrink-0 rounded-xl md:rounded-full px-8 py-4 md:w-auto bg-blue-700 hover:bg-blue-800 text-white font-bold text-base transition-colors shadow-lg">
                {t('searchBtn', 'Search Pros')}
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 text-sm sm:justify-start px-2">
              <span className="text-blue-200 font-medium">{t('popular', 'Popular:')}</span>
              {popularTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer px-3.5 py-1.5 text-xs font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50/90 dark:to-slate-900/90 pointer-events-none"></div>
      </section>

      <section className="relative -mt-16 z-20">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {statsBanner.map(({ icon: Icon, label, value }, i) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                key={label}
                className="flex items-center gap-5 rounded-2xl border border-white dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-6 shadow-premium backdrop-blur-xl transition-all"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</div>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50/50 dark:bg-slate-900/50 py-24">
        <div className="mx-auto grid max-w-screen-xl gap-10 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {features.map(({ Icon, title, desc, ring }, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              key={title} 
              className="text-center sm:text-left flex flex-col sm:items-start items-center"
            >
              <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${ring}`}>
                <Icon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 font-medium">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="categories" className="scroll-mt-24 bg-white/50 dark:bg-slate-800/50 py-24 border-y border-slate-100 dark:border-slate-800 backdrop-blur-xl">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">{t('browseCategoryEyebrow', 'Browse by Category')}</p>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white md:text-4xl tracking-tight">{t('everyHomeService', 'Every Home Service, One Platform')}</h2>
              <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">{t('connectVettedPros', 'From routine maintenance to emergency repairs — find the right pro for any job.')}</p>
            </div>
            <Link to={auth ? '/client/services' : '/login'} className="group flex items-center gap-1 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              {t('viewAllServices', 'View all services')}
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
            {categoriesGrid.map((cat, i) => (
              <motion.a
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                key={cat.nameKey}
                className="group flex flex-col items-center gap-4 p-6 bg-slate-50/80 dark:bg-slate-900/80 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-premium hover:-translate-y-1 cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl bg-${cat.bgColor} dark:bg-${cat.darkBgColor} text-${cat.textColor} dark:text-${cat.darkTextColor} flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300`}>
                  {renderCategoryIcon(cat.icon, 'h-7 w-7')}
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-slate-900 dark:text-white">{t(cat.nameKey)}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{cat.count} {t('pros')}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 bg-slate-50/50 dark:bg-slate-900/50 py-24 relative overflow-hidden">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">{t('processEyebrow', 'Simple Process')}</p>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white md:text-4xl tracking-tight">{t('processTitle', 'Book a Pro in 3 Easy Steps')}</h2>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">{t('processSub', 'No phone tag, no unclear pricing. HomeServe makes home services as easy as ordering a ride.')}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 lg:gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-slate-200 dark:bg-slate-700"></div>
            {howSteps.map(({ n, title, desc, Icon, tone }, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                key={n} 
                className="relative bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300 z-10"
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl mb-6 shadow-sm ${tone}`}>
                  <Icon className="h-8 w-8" />
                </div>
                <span className="absolute -top-4 -right-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 dark:bg-white text-base font-black text-white dark:text-slate-900 shadow-lg border-4 border-white dark:border-slate-800">
                  {n}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-3">{title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link to={auth ? '/client/services' : '/register'}>
              <Button className="rounded-full px-8 py-4 text-base bg-blue-700 hover:bg-blue-800 shadow-xl shadow-blue-700/20">{t('bookFirstService', 'Book Your First Service')}</Button>
            </Link>
            <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">{t('noSubscription', 'No subscription required · Cancel anytime')}</p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white/50 dark:bg-slate-800/50 border-y border-slate-100 dark:border-slate-800 backdrop-blur-xl">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">{t('testimonialEyebrow', 'Customer Stories')}</p>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white md:text-4xl tracking-tight mb-4">{t('testimonialTitle', 'Trusted by 200K+ Homeowners')}</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">{t('testimonialSub', "Don't take our word for it — hear from real HomeServe customers.")}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-10 mb-16 p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-5xl font-black text-slate-900 dark:text-white tabular-nums">4.9</p>
              <div className="flex items-center justify-center gap-1 mt-2 mb-1">
                {[...Array(5)].map((_, i) => (
                  <IconStar key={i} className="h-5 w-5 fill-amber-400 text-amber-400" fill="currentColor" />
                ))}
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Average rating</p>
            </div>
            <div className="w-px h-16 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
            <div className="text-center">
              <p className="text-5xl font-black text-slate-900 dark:text-white tabular-nums">98%</p>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">Would recommend</p>
            </div>
            <div className="w-px h-16 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
            <div className="text-center">
              <p className="text-5xl font-black text-slate-900 dark:text-white tabular-nums">142K</p>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">Verified reviews</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialItems.map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card hover:shadow-card-hover transition-shadow duration-300 rounded-3xl p-8 relative flex flex-col">
                <svg className="w-8 h-8 text-blue-100 dark:text-blue-900/30 absolute top-6 right-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(item.rating)].map((_, i) => (
                    <IconStar key={i} className="h-4 w-4 fill-amber-400 text-amber-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-8 flex-1 z-10">"{t(item.quoteKey)}"</p>
                <div className="flex items-center gap-4 pt-5 border-t border-slate-100 dark:border-slate-700">
                  <img alt={t(item.nameKey)} className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700" src={item.avatar} />
                  <div>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white">{t(item.nameKey)}</p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t(item.roleKey)} · {t(item.locationKey)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 bg-transparent relative z-10">
  <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white shadow-2xl relative"
    >
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl"></div>
      
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 p-10 sm:p-16 lg:p-20 relative z-10 items-center">
        <div>
          <h2 className="text-3xl font-extrabold md:text-4xl lg:text-5xl tracking-tight leading-tight">
            {t('ctaClientTitle', 'Ready to Book Your First Service?')}
          </h2>
          <p className="mt-6 text-lg text-blue-100 leading-relaxed font-medium max-w-lg">
            {t('ctaClientSub', 'Join 200,000+ homeowners who trust HomeServe for every home maintenance need. Your first booking comes with a 15% discount.')}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link to={auth ? '/client/services' : '/login'} className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full rounded-full border-0 bg-white px-8 py-4 text-blue-800 font-bold shadow-xl hover:bg-slate-50 transition-transform hover:-translate-y-1 text-base">
                {t('ctaBookService', 'Book a Service')}
                <svg className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-white/20 bg-white/10 p-10 backdrop-blur-md shadow-2xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 mb-6">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-extrabold text-white">{t('ctaProviderTitle', 'For Providers')}</h3>
          <p className="mt-4 text-base text-blue-100 font-medium leading-relaxed">
            {t('ctaProviderSub', 'Join 15,000+ providers earning on HomeServe. Set your own schedule, choose your jobs, and grow your business.')}
          </p>
          <Link to="/register" className="mt-8 inline-block w-full">
            <Button className="w-full rounded-full border-0 bg-emerald-500 px-8 py-4 text-white font-bold shadow-lg hover:bg-emerald-400 transition-transform hover:-translate-y-1 text-base">
              {t('joinAsProvider', 'Join as a Provider')}
              <svg className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Button>
          </Link>
          <p className="mt-4 text-sm font-medium text-blue-200/80 text-center">{t('avgIncomeHint', 'Earn up to $1,500/week')}</p>
        </div>
      </div>
    </motion.div>
  </div>
</section>

<SiteFooter />
<AppAssistant role={auth ? auth.user.role : 'guest'} />
    </div>
  );
}