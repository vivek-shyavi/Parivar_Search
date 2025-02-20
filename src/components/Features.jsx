
import React from 'react';
import { Search, Users, Phone } from 'lucide-react';

const features = [
  {
    icon: <Search className="h-8 w-8 text-orange-600" />,
    title: "Search Indian Family Records",
    description: "Explore extensive records of Indian family histories, including ancestral villages, gotras, and family lineages across different states."
  },
  {
    icon: <Phone className="h-8 w-8 text-orange-600" />,
    title: "Connect with Family Pandits",
    description: "Consult with traditional family priests and genealogists who maintain ancestral records (Vahis) for expert guidance on your family history."
  },
  {
    icon: <Users className="h-8 w-8 text-orange-600" />,
    title: "Connect with Relatives",
    description: "Find and connect with living relatives who share your family history."
  }
];

const Features = () => {
  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Discover Your Heritage
          </h2>
          <p className="text-xl text-gray-600">
            Explore your family history with our comprehensive tools and resources
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;