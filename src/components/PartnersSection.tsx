import React from 'react';
const PartnersSection = () => {
  return <section className="py-16 bg-white" id="partners">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Partners</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We collaborate with leading technology companies to bring you the most innovative AI and blockchain solutions.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
          {/* ChatGPT */}
          <div className="flex items-center justify-center">
            <div className="bg-white shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 w-full max-w-[180px] h-[100px] flex items-center justify-center px-[32px] py-[44px] my-[3px] mx-[36px] rounded-2xl">
              <img alt="ChatGPT" className="max-h-10 max-w-full object-contain" src="/lovable-uploads/41f54b23-ba7c-443c-909b-316616ec8e5a.png" />
              <p className="ml-2 font-semibold text-gray-800">CHATGPT</p>
            </div>
          </div>

          {/* Microsoft */}
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 w-full max-w-[180px] h-[100px] flex items-center justify-center">
              <img alt="Microsoft" className="max-h-12 max-w-full" src="/lovable-uploads/4507aba7-dd12-4dee-b69a-458ecd495492.png" />
              <p className="ml-2 font-semibold text-gray-800">MICROSOFT</p>
            </div>
          </div>

          {/* IBM */}
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 w-full max-w-[180px] h-[100px] flex items-center justify-center">
              <img alt="IBM" className="max-h-12 max-w-full" src="/lovable-uploads/08086532-cbf0-460c-87ea-1e412b1ca5c4.png" />
              <p className="ml-2 font-semibold text-gray-800">IBM</p>
            </div>
          </div>

          {/* NASDAQ */}
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 w-full max-w-[180px] h-[100px] flex items-center justify-center">
              <img alt="NASDAQ" className="max-h-12 max-w-full" src="/lovable-uploads/0e10e9b9-7716-4e4a-be0b-8e2169f66f44.png" />
              <p className="ml-2 font-semibold text-gray-800">NASDAQ</p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default PartnersSection;