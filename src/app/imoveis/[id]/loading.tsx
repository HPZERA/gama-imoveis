import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Loading() {
  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-4 h-[22px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 items-start animate-pulse">
            <div className="aspect-[4/3] md:aspect-auto md:h-[480px] bg-gray-200 rounded-2xl" />
            <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-6 sm:p-7 space-y-4">
              <div className="h-5 w-24 bg-gray-100 rounded-full" />
              <div className="h-10 w-40 bg-gray-200 rounded" />
              <div className="h-7 w-3/4 bg-gray-200 rounded" />
              <div className="grid grid-cols-2 gap-3 pt-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded-xl" />
                ))}
              </div>
              <div className="h-14 w-full bg-gray-100 rounded-xl mt-4" />
              <div className="h-12 w-full bg-gray-100 rounded-xl" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
