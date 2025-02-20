// export default AboutUs;
import React from 'react';
import { Scroll, Users, Search, BookOpen, Heart, Landmark, HandHeart } from 'lucide-react';

const AboutUs = () => {
  const features = [
    {
      icon: <Scroll className="h-8 w-8 text-orange-600" />,
      title: "Digital Preservation",
      description: "Converting traditional handwritten records into secure digital formats for future generations."
    },
    {
      icon: <Search className="h-8 w-8 text-orange-600" />,
      title: "Easy Search",
      description: "Simple and efficient search system to help families locate their ancestral records."
    },
    {
      icon: <Landmark className="h-8 w-8 text-orange-600" />,
      title: "Sacred Sites",
      description: "Working with Pandiths at Kashi, Gaya, Haridwar, Prayagraj, and Dehradun."
    },
    {
      icon: <HandHeart className="h-8 w-8 text-orange-600" />,
      title: "Community Support",
      description: "A non-profit initiative driven by community support and charitable contributions."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to Parivar Research
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Discover Your Ancestors, Embrace Your Heritage
          </p>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Parivar Research is a non-profit organization dedicated to helping Hindu families reconnect with their ancestral roots. Our mission is to bridge the gap between traditional knowledge and modern technology, making it easier for families to trace their lineage and understand their cultural heritage.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Why Parivar Research */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Parivar Research?</h2>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              For centuries, Hindu families have performed sacred rituals such as Pinda Pradanam (Pind Daan), Tarpan, and Shraadh, offering prayers and food to their deceased ancestors to ensure their peaceful journey to heaven. These rituals are conducted at spiritually significant places like Kashi, Gaya, Haridwar, Prayagraj, and Dehradun by knowledgeable Pandits (priests), who document family details in handwritten registers.
            </p>
            <p>
              However, over time, retrieving this information has become increasingly difficult. When future generations visit these holy sites seeking information about their ancestors, Pandiths often struggle to locate old records, making it challenging for families to reconnect with their heritage.
            </p>
          </div>
        </div>

        {/* Our Solution */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Solution</h2>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              Parivar Research provides a digital platform that allows Pandiths to record and maintain ancestral records securely. This initiative benefits both Pandiths and families by:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Preserving traditional records in an organized, accessible manner</li>
              <li>Helping families trace their ancestry with ease when they revisit sacred sites</li>
              <li>Supporting Pandiths in managing their extensive records efficiently</li>
              <li>Enhancing cultural awareness by educating families about their lineage and traditions</li>
            </ul>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 inline-block mb-4">
                <BookOpen className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pandiths Register Data</h3>
              <p className="text-gray-600">We collaborate with Pandiths at sacred sites to digitize and store family details.</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 inline-block mb-4">
                <Search className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Families Search</h3>
              <p className="text-gray-600">Individuals can search for their family history using details like last names or known ancestors.</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 inline-block mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Revisits</h3>
              <p className="text-gray-600">Quick record retrieval when families return for rituals, ensuring a seamless experience.</p>
            </div>
          </div>
        </div>

        {/* Join Us */}
       {/* Join Us */}
       <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Join Us in Preserving Heritage</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Parivar Research is a community-driven initiative, and we welcome charitable contributions to support this noble cause. Your donations help us digitize and maintain ancestral records, provide resources for Pandiths, and offer families an invaluable connection to their roots.
          </p>
          <div className="max-w-2xl mx-auto text-gray-600">
            <p>
              If you're eager to learn about your ancestors or if you're a Pandith willing to contribute to this mission, we would love to hear from you. Together, we can preserve traditions, honor our ancestors, and strengthen family bonds.
            </p>
            <p className="mt-4 text-orange-600 font-semibold">
              Parivar Research – Bridging Generations Through Sacred Traditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;