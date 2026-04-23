import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const Landing = () => {
  const { t } = useLanguage();
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white">
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-800">Find Trusted Home Services</h1>
        <p className="mt-4 text-xl text-gray-600">Connect with local professionals for plumbing, cleaning, repairs and more.</p>
        <div className="mt-8 space-x-4">    
        <Link to="/register" className="bg-blue-700 text-white px-6 py-3 rounded-lg">Get Started</Link>
        <Link to="/browse-services" className="border border-blue-700 text-blue-700 px-6 py-3 rounded-lg">Browse Services</Link>
      </div>
    </section>
    </div>
  );
};
export default Landing;