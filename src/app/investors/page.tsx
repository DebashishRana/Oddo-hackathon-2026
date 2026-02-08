import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import Navigation from "@/components/landing/navigation";
import Footer from "@/components/landing/footer";

const InvestorPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="bg-white text-black">
        {/* Hero Section */}
        <div className="relative h-[50vh] w-full text-white">
          <Image
            src="/invesotr.jpg"
            alt="Investor Relations"
            layout="fill"
            objectFit="cover"
            className="brightness-50"
          />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
            <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
              Updates 
            </h1>
          </div>
        </div>

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Investor Updates Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold tracking-tight mb-8">
            Investor Updates
          </h2>
          <div className="space-y-12 border-l-2 border-gray-200 pl-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold">FY26 First Quarter Results</h3>
              <p className="text-gray-600">
                Apple announced results and business updates for the quarter ended December 27, 2025.
              </p>
              <Link href="#" className="text-blue-600 hover:underline flex items-center">
                View the press release <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold">2026 Annual Meeting of Shareholders</h3>
              <p className="text-gray-600">
                Apple will host the 2026 Annual Meeting of Shareholders on February 24, 2026, at 8:00 am PT, in a virtual format.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold">2026 Proxy Materials</h3>
               <Link href="#" className="text-blue-600 hover:underline flex items-center">
                View the Proxy Statement
              </Link>
               <Link href="#" className="text-blue-600 hover:underline flex items-center">
                View the 2025 10-K
              </Link>
            </div>
          </div>
        </section>

        {/* Newsroom Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold tracking-tight mb-8">
            Newsroom
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="group flex items-start space-x-6">
              <div className="flex-shrink-0">
                <Newspaper className="h-12 w-12 text-gray-400 group-hover:text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">February 4, 2026</p>
                <h3 className="text-xl font-semibold mt-1">Apple Sports adds golf to its lineup</h3>
                <p className="text-gray-600 mt-2">
                  Apple Sports - the free app for iPhone - today added golf to its growing list of supported sports.
                </p>
                <Link href="#" className="text-blue-600 hover:underline flex items-center mt-2">
                  Read more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            {/* Add more news items here */}
          </div>
        </section>

        {/* Financial Data Section */}
        <section>
          <h2 className="text-4xl font-bold tracking-tight mb-8">
            Financial Data
          </h2>
          <div className="space-y-10">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Quarterly Earnings Reports</h3>
              <div className="flex space-x-8 border-b pb-2 mb-4">
                <button className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-2">2026</button>
                <button className="text-gray-500 hover:text-black">2025</button>
                <button className="text-gray-500 hover:text-black">2024</button>
                <button className="text-gray-500 hover:text-black">2023</button>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Q1</p>
                <Link href="#" className="text-blue-600 hover:underline block">Press Release</Link>
                <Link href="#" className="text-blue-600 hover:underline block">Financial Statements</Link>
                <Link href="#" className="text-blue-600 hover:underline block">10-Q</Link>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Annual Reports on Form 10-K</h3>
               <div className="flex space-x-6">
                <Link href="#" className="text-blue-600 hover:underline">2025 10-K</Link>
                <Link href="#" className="text-blue-600 hover:underline">2024 10-K</Link>
                <Link href="#" className="text-blue-600 hover:underline">2023 10-K</Link>
                <Link href="#" className="text-blue-600 hover:underline">2022 10-K</Link>
              </div>
            </div>
             <div>
              <h3 className="text-2xl font-semibold mb-4">Additional Reports</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="#" className="text-blue-600 hover:underline">Net Sales by Category</Link>
                <Link href="#" className="text-blue-600 hover:underline">Capital Return History</Link>
                <Link href="#" className="text-blue-600 hover:underline">Dividend History</Link>
                <Link href="#" className="text-blue-600 hover:underline">Green Bond Report</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default InvestorPage;
