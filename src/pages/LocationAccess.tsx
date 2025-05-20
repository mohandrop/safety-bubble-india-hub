
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

const LocationAccess = () => {
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const navigate = useNavigate();

  // Indian states for the dropdown
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];
  
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const handleGetCurrentLocation = () => {
    setIsGettingLocation(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, we would reverse geocode these coordinates to get the address
          // For now, we'll simulate a successful geolocation
          setIsGettingLocation(false);
          toast("Location detected successfully!");
          
          // Simulate setting location data - in a real app this would come from reverse geocoding
          setState("Delhi"); // Example state
          setCity("New Delhi"); // Example city
          setPincode("110001"); // Example pincode
        },
        (error) => {
          setIsGettingLocation(false);
          toast("Failed to get location. Please enter manually.");
          console.error("Error getting location:", error);
        }
      );
    } else {
      setIsGettingLocation(false);
      toast("Geolocation is not supported by this browser. Please enter manually.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Store location information
    const locationData = {
      state,
      city,
      pincode
    };

    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, this would be stored in Firebase or another database
      localStorage.setItem("userLocation", JSON.stringify(locationData));
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-blue-100">
      <header className="py-6 px-4 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto flex items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-700 flex items-center gap-2">
            <MapPin className="text-blue-600" /> 
            Survival Bubble India
          </h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Set Your Location</h2>
            <p className="text-gray-600">
              We need your location to provide disaster alerts and resources specific to your area
            </p>
          </div>

          <Button 
            onClick={handleGetCurrentLocation} 
            variant="outline" 
            className="w-full mb-6 flex items-center justify-center gap-2"
            disabled={isGettingLocation}
          >
            {isGettingLocation ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
            {isGettingLocation ? "Getting Location..." : "Use Current Location"}
          </Button>

          <div className="text-center my-4">
            <span className="text-gray-500">OR</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              >
                <option value="">Select State</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City/District
              </label>
              <Input
                id="city"
                type="text"
                placeholder="Enter your city or district"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                PIN Code
              </label>
              <Input
                id="pincode"
                type="text"
                placeholder="Enter your 6-digit PIN code"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full"
                pattern="[0-9]{6}"
                maxLength={6}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                "Continue to Dashboard"
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LocationAccess;
