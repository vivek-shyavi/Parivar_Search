
import React from 'react';
import { Search } from 'lucide-react';

const Hero = () => {
  return (
    <>
      <div className="relative h-[60vh]">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: 'url("https://images.pexels.com/photos/11511789/pexels-photo-11511789.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
            filter: 'brightness(0.5)'
          }}
        />
        <div className="relative z-10 h-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Your Family Story
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Connect with your roots and explore your family's history through our vast collection of records and tools.
          </p>
        </div>
      </div>
    </>
  );
}

export default Hero;