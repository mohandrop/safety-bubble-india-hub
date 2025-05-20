
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, AlertTriangle, Phone, Users, Compass, MessageSquare } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLocation } from "react-router-dom";
import DisasterAlerts from "@/components/DisasterAlerts";
import EmergencyContacts from "@/components/EmergencyContacts";
import ResourceMap from "@/components/ResourceMap";
import CommunitySync from "@/components/CommunitySync";
import PreparednessList from "@/components/PreparednessList";

const Dashboard = () => {
  const [userLocation, setUserLocation] = useState({ state: "", city: "", pincode: "" });
  const [activeDisaster, setActiveDisaster] = useState<string | null>(null);
  
  useEffect(() => {
    // Get user location from localStorage
    const storedLocation = localStorage.getItem("userLocation");
    if (storedLocation) {
      setUserLocation(JSON.parse(storedLocation));
    }
    
    // Simulate checking for active disasters in the area
    const checkForDisasters = () => {
      // This would be a real API call in a production app
      const disasters = [
        { type: "Flood Warning", affected: ["Assam", "Bihar", "West Bengal"] },
        { type: "Heat Wave", affected: ["Rajasthan", "Delhi", "Uttar Pradesh"] },
        { type: "Cyclone Alert", affected: ["Tamil Nadu", "Andhra Pradesh", "Odisha"] }
      ];
      
      const userState = JSON.parse(localStorage.getItem("userLocation") || '{}').state;
      const activeDisaster = disasters.find(disaster => 
        disaster.affected.includes(userState)
      );
      
      if (activeDisaster) {
        setActiveDisaster(activeDisaster.type);
      } else {
        setActiveDisaster(null);
      }
    };
    
    checkForDisasters();
    const interval = setInterval(checkForDisasters, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-blue-100">
      <header className="py-4 px-4 bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-blue-700 flex items-center gap-2">
            <MapPin className="text-blue-600" /> 
            Survival Bubble India
          </h1>
          <div className="flex items-center text-sm bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            <MapPin className="h-3 w-3 text-blue-600 mr-1" />
            <span className="text-blue-800">
              {userLocation.city}, {userLocation.state}
            </span>
          </div>
        </div>
      </header>

      {activeDisaster && (
        <div className="bg-red-500 text-white p-2 text-center">
          <AlertTriangle className="inline-block mr-2" size={16} />
          <span className="font-medium">ALERT: {activeDisaster} in your area. Stay safe!</span>
        </div>
      )}

      <main className="flex-1 container mx-auto p-4">
        <Tabs defaultValue="alerts" className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <AlertTriangle size={16} /> Alerts
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Phone size={16} /> Emergency
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <Water size={16} /> Resources
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <MessageSquare size={16} /> Community
            </TabsTrigger>
            <TabsTrigger value="preparedness" className="flex items-center gap-2">
              <Compass size={16} /> Checklist
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="alerts" className="bg-white p-4 rounded-lg shadow-md">
            <DisasterAlerts location={userLocation} activeDisaster={activeDisaster} />
          </TabsContent>
          
          <TabsContent value="contacts" className="bg-white p-4 rounded-lg shadow-md">
            <EmergencyContacts />
          </TabsContent>
          
          <TabsContent value="resources" className="bg-white p-4 rounded-lg shadow-md">
            <ResourceMap location={userLocation} />
          </TabsContent>
          
          <TabsContent value="community" className="bg-white p-4 rounded-lg shadow-md">
            <CommunitySync location={userLocation} />
          </TabsContent>
          
          <TabsContent value="preparedness" className="bg-white p-4 rounded-lg shadow-md">
            <PreparednessList activeDisaster={activeDisaster} />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="py-4 text-center text-gray-600 text-sm border-t border-gray-200 bg-white/50">
        <p>© {new Date().getFullYear()} Survival Bubble India - Disaster Preparedness Solutions</p>
      </footer>
    </div>
  );
};

export default Dashboard;
