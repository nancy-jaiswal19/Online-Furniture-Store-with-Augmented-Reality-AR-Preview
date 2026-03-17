import React from "react";
import { Link } from "react-router-dom";

const PremiumPrivacyPolicy = () => {
  const sections = [
    {
      id: "01",
      title: "Information Inventory",
      content:
        "We curate a limited selection of data including your identity details, delivery coordinates, and transaction history to ensure a seamless Homespace experience.",
    },
    {
      id: "02",
      title: "Data Stewardship",
      content:
        "Your information is never 'used'; it is protected. We utilize data solely to refine our craftsmanship and bridge the gap between our products and your home.",
    },
    {
      id: "03",
      title: "Digital Security",
      content:
        "Architecture for the digital age. Our systems employ industry-grade encryption protocols, ensuring your personal data remains as private as your home.",
    },
    {
      id: "04",
      title: "Client Relations",
      content:
        "Our privacy concierge is available for personalized inquiries regarding your data rights. Direct communications to support@homespace.com.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f6f4ef] text-[#1A1816] font-sans pt-30 ">
      
      

      <main className="max-w-7xl mx-auto px-8  pb-32">

        {/* HEADER */}
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 items-end">
          <div className="lg:col-span-8">
            <h2 className="text-[11px] uppercase tracking-[0.5em] text-[#8a8177] mb-6">
              Legal Protocol
            </h2>

            <h1 className="text-[42px] sm:text-[64px] md:text-[84px] font-light leading-[0.9] tracking-tighter">
              Privacy <br />
              <span className="italic font-serif pl-6 sm:pl-20 text-[#3f3a33]">
                Standards
              </span>
            </h1>
          </div>

          <p className="lg:col-span-4 text-[14px] text-[#8a8177] leading-relaxed border-l border-[#E7DFD4] pl-8">
            Reliability and transparency are the foundations of luxury. We treat
            your data with the same precision as our artisanal furniture.
          </p>
        </header>

        {/* CONTENT */}
        <section className="border-t border-[#E7DFD4]">
          {sections.map((section) => (
            <article
              key={section.id}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-8 py-12 border-b border-[#E7DFD4] hover:bg-[#F3F2F0] transition-all duration-700 ease-in-out px-4"
            >
              <div className="lg:col-span-4 flex items-baseline gap-6">
                <span className="text-[13px] font-serif italic text-[#8a8177]">
                  {section.id}
                </span>

                <h3 className="text-[18px] uppercase tracking-[0.15em] font-medium transition-transform duration-500 group-hover:translate-x-1">
                  {section.title}
                </h3>
              </div>

              <div className="lg:col-span-6">
                <p className="text-[16px] text-[#5A544D] leading-[1.8] font-light group-hover:text-[#1A1816] transition-colors duration-500">
                  {section.content}
                </p>
              </div>

              <div className="lg:col-span-2 flex justify-end items-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="h-[1px] w-12 bg-[#8a8177]" />
              </div>
            </article>
          ))}
        </section>

        

            

      </main>
    </div>
  );
};

export default PremiumPrivacyPolicy;
