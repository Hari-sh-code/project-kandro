import React, { useEffect, useState } from "react";

const Home = () => {
  const [text, setText] = useState("");
  const fullText =
    "Our platform leverages blockchain technology to provide a secure marketplace for buying and selling datasets.";

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      setText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="w-full px-6 bg-gray-50">
      <div className="flex justify-center w-full">
        <div className="bg-white text-black rounded-lg w-full max-w-5xl p-8 mb-12 mt-12 slide-in-bottom">
          <div className="flex items-center justify-between mb-10 slide-in-left gap-9">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">
                Welcome to Our Platform!
              </h1>
              <p className="text-lg mb-6 h-12 leading-relaxed">
                {text}
                {text.length < fullText.length && (
                  <span className="border-r-2 border-black animate-pulse"></span>
                )}
              </p>
            </div>

            <img
              src="/dataset.png"
              alt="Kandro Logo"
              className="object-contain ml-4 h-96 w-96"
            />
          </div>

          <div className="bg-gray-100 rounded-lg p-8 slide-in-bottom">
            <h2 className="text-2xl font-semibold mb-8 text-center">
              Who's on Kandro?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="p-6 bg-white  hover:bg-slate-100 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">

             

                <h3 className="text-xl font-medium mb-3">Learners</h3>
                <p className="text-base">
                  Access courses, competitions, and forums to deepen your
                  knowledge.
                </p>
              </div>
              <div className="p-6 bg-white hover:bg-slate-100 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
                <h3 className="text-xl font-medium mb-3">Developers</h3>
                <p className="text-base">
                  Explore models, notebooks, and datasets for your projects.
                </p>
              </div>
              <div className="p-6 bg-white hover:bg-slate-100 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
                <h3 className="text-xl font-medium mb-3">Researchers</h3>
                <p className="text-base">
                  Utilize pre-trained models and datasets to advance ML
                  research.
                </p>
              </div>
              <div className="p-6 bg-white hover:bg-slate-100 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
                <h3 className="text-xl font-medium mb-3">Data Providers</h3>
                <p className="text-base">
                  Securely share datasets and earn by contributing to
                  innovations.
                </p>
              </div>
              <div className="p-6 bg-white hover:bg-slate-100 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
                <h3 className="text-xl font-medium mb-3">Enterprises</h3>
                <p className="text-base">
                  Get tailored solutions for data needs and collaborate within
                  our network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
