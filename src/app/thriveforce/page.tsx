"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

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
                  We are Team ThriveForce,
                  <br />
                  the combat robotics team from BPHC
                </p>
                <p>
                  We make and <span className="text-red-500 font-bold">break</span> bots!
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-30"></div>
              <div className="relative z-10 flex justify-center">
                <div className="w-80 h-80 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Image
                    src="/phoenix-logo.svg"
                    alt="Thriveforce Dragon Logo"
                    width={200}
                    height={200}
                    className="object-contain filter brightness-0"
                  />
                </div>
              </div>
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
                    src="/thriveforce/bugawho-3d.png"
                    alt="1.3KG BUGAWHO Robot 3D Model"
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold uppercase tracking-wide text-white">
                  1.3KG BUGAWHO
                </h3>
                <div className="mt-4 bg-gray-900/50 p-4 rounded border border-gray-800">
                  <Image
                    src="/thriveforce/bugawho-real.jpg"
                    alt="1.3KG BUGAWHO Real Robot"
                    width={200}
                    height={150}
                    className="w-full h-32 object-cover rounded"
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
                    src="/thriveforce/slipknut-3d.png"
                    alt="15KG SLIPKNUT Robot 3D Model"
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold uppercase tracking-wide text-white">
                  15KG SLIPKNUT
                </h3>
                <div className="mt-4 bg-gray-900/50 p-4 rounded border border-gray-800">
                  <Image
                    src="/thriveforce/slipknut-real.jpg"
                    alt="15KG SLIPKNUT Real Robot"
                    width={200}
                    height={150}
                    className="w-full h-32 object-cover rounded"
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
                    src="/thriveforce/mnm-3d.png"
                    alt="1.3KG MNM Robot 3D Model"
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold uppercase tracking-wide text-white">
                  1.3KG MNM
                </h3>
                <div className="mt-4 bg-gray-900/50 p-4 rounded border border-gray-800">
                  <Image
                    src="/thriveforce/mnm-real.jpg"
                    alt="1.3KG MNM Real Robot"
                    width={200}
                    height={150}
                    className="w-full h-32 object-cover rounded"
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
            {/* Future Robot 1 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                <Image
                  src="/thriveforce/future-1.png"
                  alt="Future Robot Design 1"
                  width={300}
                  height={240}
                  className="w-full h-60 object-cover rounded"
                />
              </div>
            </div>

            {/* Future Robot 2 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                <Image
                  src="/thriveforce/future-2.png"
                  alt="Future Robot Design 2"
                  width={300}
                  height={240}
                  className="w-full h-60 object-cover rounded"
                />
              </div>
            </div>

            {/* Future Robot 3 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-red-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                <Image
                  src="/thriveforce/future-3.png"
                  alt="Future Robot Design 3"
                  width={300}
                  height={240}
                  className="w-full h-60 object-cover rounded"
                />
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-20 text-center">
            <div className="inline-block bg-gradient-to-r from-red-500 to-orange-500 p-1 rounded-lg">
              <div className="bg-black px-8 py-4 rounded-lg">
                <h3 className="text-2xl font-bold text-white mb-4">
                  JOIN THE REVOLUTION
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
