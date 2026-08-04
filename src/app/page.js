import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-100">
      {/* Navbar */}
      <nav className="flex items-center justify-between md:px-8 px-2 py-2 bg-white shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Image
            src="/logoo.webp"
            alt="Logo"
            width={120}
            height={40}
            className="object-contain"
          />
        </div>

        <button className="rounded-xl bg-orange-500 px-6 py-3 flex items-center gap-1 font-semibold text-white transition hover:bg-orange-600">
          Book a Demo <ArrowRight size={18} />
        </button>
      </nav>

      {/* Hero */}
      <section className="grid grid-cols-1 items-center gap-5 px-8 py-10 lg:grid-cols-2">
        {/* Left */}
        <div className="lg:px-5">
          <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700">
            India's #1 Lead Engagement CRM
          </span>

          <h1 className="mt-8 text-6xl font-bold leading-tight">
            <span className="text-blue-600">CRM.</span>{" "}
            <span className="text-gray-900">Call Tracking.</span>
            <br />
            <span className="text-green-500">WhatsApp.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-gray-600">
            Auto-capture leads, track mobile calls with recordings, and
            auto-reply on WhatsApp. One CRM built for the Indian sales
            process.
          </p>

          <div className="mt-5 flex gap-5 justify-center lg:justify-start">
            <button className="rounded-xl bg-orange-500 px-8 py-4 text-lg font-semibold text-white hover:bg-orange-600">
              Book a Demo
            </button>
          </div>
        </div>

        {/* Right Stats */}
        <div className="flex lg:flex-nowrap flex-wrap justify-center gap-4 text-gray-600">
          {/* CRM Card */}
          <div className="w-72 rounded-3xl bg-white shadow-2xl">
            <div className="rounded-t-3xl bg-blue-600 px-6 py-4 font-semibold text-white">
              CRM
            </div>

            <div className="space-y-5 p-4">
              <div>
                <p className="text-sm text-gray-500">Pipeline Value</p>
                <h2 className="mt-2 text-4xl font-bold">₹18,42,500</h2>
                <p className="mt-1 text-green-600">▲ +23% WoW</p>
              </div>

              <div className="space-y-3">
                {[
                  ["New", "90%"],
                  ["Qualified", "70%"],
                  ["Demo", "45%"],
                  ["Won", "25%"],
                ].map(([label, width]) => (
                  <div key={label}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>{label}</span>
                    </div>

                    <div className="h-2 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-blue-600"
                        style={{ width }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Call Tracking */}
          <div className="w-72 rounded-3xl bg-white shadow-2xl">
            <div className="rounded-t-3xl bg-black px-6 py-4 font-semibold text-white">
              Call Tracking
            </div>

            <div className="space-y-8 p-4">
              <div>
                <p className="text-sm text-gray-500">Today's Calls</p>
                <h2 className="mt-2 text-5xl font-bold">2,478</h2>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span>Connected Calls</span>
                  <span className="font-semibold">1,476</span>
                </div>

                <div className="flex justify-between">
                  <span>Connection Rate</span>
                  <span className="font-semibold">59.6%</span>
                </div>

                <div className="flex justify-between">
                  <span>Avg Duration</span>
                  <span className="font-semibold">2m 48s</span>
                </div>

                <div className="flex justify-between">
                  <span>Avg Calls / Agent</span>
                  <span className="font-semibold">42</span>
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="w-72 rounded-3xl bg-white shadow-2xl">
            <div className="rounded-t-3xl bg-green-500 px-6 py-4 font-semibold text-white">
              WhatsApp
            </div>

            <div className="space-y-4 p-4 text-sm">
              <div className="inline-block rounded-full bg-green-100 px-2 py-2 text-sm text-green-700">
                ✓ Auto Follow-up Sent
              </div>

              <div className="rounded-2xl bg-gray-100 p-2">
                Namaste! Saw your query for 2BHK in HSR...
              </div>

              <div className="ml-auto w-fit rounded-2xl bg-green-100 p-2">
                Yes, share brochure 📎
              </div>

              <div className="rounded-2xl bg-gray-100 p-2">
                Sending. Free to visit Saturday 11 AM?
              </div>

              <div className="ml-auto w-fit rounded-2xl bg-green-100 px-2 py-2">
                Yes ✓✓
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}