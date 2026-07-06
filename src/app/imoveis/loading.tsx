import Header from "@/components/Header";
import Footer from "@/components/Footer";

function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.07)] animate-pulse">
      <div className="h-56 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-6 w-2/3 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-4 w-1/2 bg-gray-100 rounded" />
        <div className="h-10 w-full bg-gray-100 rounded-xl mt-4" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100 py-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="h-4 w-40 bg-gray-100 rounded animate-pulse mb-4" />
            <div className="h-9 w-72 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
