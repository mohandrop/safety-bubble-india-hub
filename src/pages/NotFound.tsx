
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-blue-100">
      <header className="py-6 px-4 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-700 flex items-center gap-2">
            <MapPin className="text-blue-600" /> 
            Survival Bubble India
          </h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-4xl font-bold text-red-600 mb-4">404</h2>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h3>
          <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild className="w-full">
            <Link to="/">Return to Safety</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
