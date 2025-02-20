import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const GetStarted = () => {
  return (
    <div className="bg-orange-600 text-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Heart className="h-12 w-12 mx-auto mb-6" />
        <h2 className="startpage">
          Start Your Family History Journey Today
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join millions of people who have discovered their family story. Create your free account and start building your family tree.
        </p>
        <Link to="/user-dashboard" className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100">
          Search Your Family
        </Link>
      </div>
    </div>
  );
}

export default GetStarted;