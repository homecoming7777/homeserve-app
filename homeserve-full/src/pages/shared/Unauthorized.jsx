import { Link } from 'react-router-dom';


const Unauthorized = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-red-600">403</h1>
      <p className="text-xl text-gray-600 mt-4">You do not have permission to view this page.</p>
      <Link to="/" className="mt-6 inline-block bg-blue-700 text-white px-6 py-2 rounded">Go Home</Link>
    </div>
  );
};
export default Unauthorized;