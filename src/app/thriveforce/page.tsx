"use client";

import Image from "next/image";

const Thriveforce = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-orange-900/20"></div>
        <div className="relative z-10 mx-auto max-w-6xl px-8">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-6xl font-bold uppercase tracking-wider text-white md:text-8xl">
                  WHO ARE WE?
                </h1>
                <div className="h-1 w-20 bg-red-500"></div>
              </div>
              <div className="space-y-4 text-lg text-gray-300">
                <p>
                  We are Team Thrive Force, the combat robotics team from BPHC 
                </p>
                <p>
                  We make and <span className="text-red-500 font-bold">break</span> bots! 
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-3xl opacity-40 animate-pulse"></div>
              <div className="relative z-10 flex justify-center">
                <div className="w-96 h-96 flex items-center justify-center">
                  <Image
                    src="/thriveforce/logo.png" // Assuming logo.png is the snake image
                    alt="Thriveforce Snake Logo"
                    width={400}
                    height={400}
                    className="object-contain animate-breathing"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 bg-black">
        <div className="mx-auto max-w-6xl px-8">
          <h2 className="text-6xl font-bold uppercase tracking-wider text-white mb-16">
            WHAT DO WE DO?
          </h2>
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <Image
                src="/thriveforce/design_software.png" // Assuming this is the image from page 3 of the PDF
                alt="Robot design software"
                width={700}
                height={400}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-6 text-lg text-gray-300">
              <p>
                At Team ThriveForce, we specialize in building battlebots. We compete in robowars competitions all over the country. 
              </p>
              <p>
                Most of our hours are spent doing the following: [cite: 21]
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Design and Engineering </li>
                <li>Fabrication and Assembly </li>
                <li>Testing and Iteration </li>
                <li>Competing! </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey Section (Achievements) */}
      <section className="py-20 bg-gray-900/50">
        <div className="mx-auto max-w-6xl px-8">
          <h2 className="text-6xl font-bold uppercase tracking-wider text-white mb-16">
            OUR JOURNEY
          </h2>
          <div className="text-center mb-12">
            <Image
              src="/thriveforce/trophies.png" // Assuming this is the image from page 4 of the PDF
              alt="Team Achievements and Trophies"
              width={900}
              height={500}
              className="mx-auto rounded-lg shadow-xl"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-white text-center">
            <div className="bg-gray-800/70 p-6 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold uppercase mb-2">Techfest [cite: 47]</h3>
              <p className="text-lg">27th - 29th December, 2023 [cite: 48]</p>
              <p className="text-xl font-semibold mt-2">1<sup>st</sup> Place [cite: 55]</p>
              <p className="text-lg">Best Design [cite: 61]</p>
            </div>
            <div className="bg-gray-800/70 p-6 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold uppercase mb-2">ATMOS 23 [cite: 35]</h3>
              <p className="text-xl font-semibold mt-2">3<sup>rd</sup> Place [cite: 39]</p>
              <p className="text-lg">Best Design [cite: 41]</p>
            </div>
            <div className="bg-gray-800/70 p-6 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold uppercase mb-2">IIT HYD [cite: 36]</h3>
              <p className="text-xl font-semibold mt-2">2<sup>nd</sup> Place [cite: 40]</p>
            </div>
            <div className="bg-gray-800/70 p-6 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold uppercase mb-2">BITS GOA [cite: 42]</h3>
              <p className="text-xl font-semibold mt-2">2<sup>nd</sup> Place [cite: 44]</p>
            </div>
            <div className="bg-gray-800/70 p-6 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold uppercase mb-2">IIT D [cite: 43]</h3>
              <p className="text-xl font-semibold mt-2">1<sup>st</sup> Place [cite: 45]</p>
            </div>
          </div>
        </div>
      </section>

      {/* Robots Showcase Section */}
      <section className="py-20 bg-black">
        <div className="mx-auto max-w-6xl px-8">
          <h2 className="text-6xl font-bold uppercase tracking-wider text-white mb-16">
            SOME OF OUR BOTS
          </h2>
          
          <div className="grid gap-12 md:grid-cols-3">
            {/* 1.3KG BUGAWHO */}
            <div className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gray-900/50 p-8 rounded-lg border border-gray-800">
                  <Image
                    src="/thriveforce/bugawho-3d.png" // Placeholder - update with actual 3D render if available
                    alt="1.3KG BUGAWHO Robot 3D Model"
                    width={300}
                    height={200}
                    className="w-full h-48 object-contain rounded mb-4"
                  />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold uppercase tracking-wide text-white">
                  1.3KG BUGAWHO 
                </h3>
                <div className="mt-4 bg-gray-900/50 p-4 rounded border border-gray-800">
                  <Image
                    src="/thriveforce/bugawho-real.jpg" // Placeholder - update with actual image
                    alt="1.3KG BUGAWHO Real Robot"
                    width={200}
                    height={150}
                    className="w-full h-32 object-contain rounded"
                  />
                </div>
              </div>
            </div>

            {/* 15KG SLIPKNUT */}
            <div className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gray-900/50 p-8 rounded-lg border border-gray-800">
                  <Image
                    src="/thriveforce/slipknut-3d.png" // Placeholder - update with actual 3D render if available
                    alt="15KG SLIPKNUT Robot 3D Model"
                    width={300}
                    height={200}
                    className="w-full h-48 object-contain rounded mb-4"
                  />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold uppercase tracking-wide text-white">
                  15KG SLIPKNUT 
                </h3>
                <div className="mt-4 bg-gray-900/50 p-4 rounded border border-gray-800">
                  <Image
                    src="/thriveforce/slipknut-real.jpg" // Placeholder - update with actual image
                    alt="15KG SLIPKNUT Real Robot"
                    width={200}
                    height={150}
                    className="w-full h-32 object-contain rounded"
                  />
                </div>
              </div>
            </div>

            {/* 1.3KG MNM */}
            <div className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gray-900/50 p-8 rounded-lg border border-gray-800">
                  <Image
                    src="/thriveforce/mnm-3d.png" // Placeholder - update with actual 3D render if available
                    alt="1.3KG MNM Robot 3D Model"
                    width={300}
                    height={200}
                    className="w-full h-48 object-contain rounded mb-4"
                  />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold uppercase tracking-wide text-white">
                  1.3KG MNM 
                </h3>
                <div className="mt-4 bg-gray-900/50 p-4 rounded border border-gray-800">
                  <Image
                    src="/thriveforce/mnm-real.jpg" // Placeholder - update with actual image
                    alt="1.3KG MNM Real Robot"
                    width={200}
                    height={150}
                    className="w-full h-32 object-contain rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Plans Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="mx-auto max-w-6xl px-8">
          <h2 className="text-6xl font-bold uppercase tracking-wider text-white mb-16">
            FUTURE PLANS
          </h2>
          
          <div className="grid gap-8 md:grid-cols-3 justify-items-center">
            {/* Future Robot - SENTINEL */}
            <div className="relative group md:col-span-1"> {/* Adjusted to take 1 column for SENTINEL, assuming it's the main future bot */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                <Image
                  src="/thriveforce/sentinel.png" // Assuming this is the image for SENTINEL
                  alt="SENTINEL Future Robot Design"
                  width={600} // Increased width for better visibility
                  height={480} // Increased height
                  className="w-full h-96 object-contain rounded" // Adjusted height for a larger image
                />
              </div>
              <div className="text-center mt-4">
                <h3 className="text-2xl font-bold uppercase tracking-wide text-white">
                  SENTINEL 
                </h3>
              </div>
            </div>

            {/* Placeholder for other future robot designs if available */}
            {/* Currently, the PDF only explicitly mentions "SENTINEL" for future plans with an image.
                If there are other named future designs, you would add them here.
                I've kept the original placeholders for "future-1.png", "future-2.png", "future-3.png"
                from your template but these might need to be removed or updated if they don't correspond
                to specific future bots in the PDF.
            */}
            {/* You had 3 placeholders in the original template, but only one explicit future bot (SENTINEL)
                is shown with an image in the PDF. I'm adapting based on what's available.
                If you have other images for "future-1.png" and "future-2.png" that are generic
                future designs, you can uncomment and adjust these.
            */}
            {/*
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                <Image
                  src="/thriveforce/future-1.png"
                  alt="Future Robot Design 1"
                  width={300}
                  height={240}
                  className="w-full h-60 object-contain rounded"
                />
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-red-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                <Image
                  src="/thriveforce/future-2.png"
                  alt="Future Robot Design 2"
                  width={300}
                  height={240}
                  className="w-full h-60 object-contain rounded"
                />
              </div>
            </div>
            */}
          </div>

          {/* Call to Action */}
          <div className="mt-20 text-center">
            <div className="inline-block bg-gradient-to-r from-red-500 to-orange-500 p-1 rounded-lg">
              <div className="bg-black px-8 py-4 rounded-lg">
                <h3 className="text-2xl font-bold text-white mb-4">
                  INDUCTING SOON 
                </h3>
                <p className="text-gray-300 mb-6">
                  Ready to build the future of combat robotics?
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 text-sm">
                    Mechanical Design
                  </span>
                  <span className="px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 text-sm">
                    Electronics
                  </span>
                  <span className="px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 text-sm">
                    Programming
                  </span>
                  <span className="px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 text-sm">
                    Strategy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Thriveforce;
