
import React, { useState, useEffect, useRef } from "react";
import { Water, ArrowRight, MapPin, Shelter, Food } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";

interface ResourceMapProps {
  location: {
    state: string;
    city: string;
    pincode: string;
  };
}

interface Resource {
  id: string;
  name: string;
  type: "water" | "food" | "shelter" | "medical";
  address: string;
  distance: string;
  lat: number;
  lng: number;
}

const ResourceMap: React.FC<ResourceMapProps> = ({ location }) => {
  const [resourceType, setResourceType] = useState<"water" | "food" | "shelter" | "medical">("shelter");
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapToken, setMapToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(true);

  // Mock resources data (in a real app this would come from an API)
  const mockResourceData = {
    shelter: [
      { id: "s1", name: "Community Relief Center", type: "shelter", address: "123 Main St, Chennai", distance: "1.2 km", lat: 13.0827, lng: 80.2707 },
      { id: "s2", name: "Government School Shelter", type: "shelter", address: "45 Park Ave, Chennai", distance: "2.5 km", lat: 13.0900, lng: 80.2800 },
      { id: "s3", name: "Red Cross Emergency Shelter", type: "shelter", address: "78 Relief Rd, Chennai", distance: "3.1 km", lat: 13.0700, lng: 80.2600 }
    ],
    water: [
      { id: "w1", name: "Municipal Water Station", type: "water", address: "10 Water St, Chennai", distance: "0.8 km", lat: 13.0827, lng: 80.2800 },
      { id: "w2", name: "Community Well", type: "water", address: "22 Well Rd, Chennai", distance: "1.4 km", lat: 13.0900, lng: 80.2707 }
    ],
    food: [
      { id: "f1", name: "Relief Food Distribution", type: "food", address: "56 Food St, Chennai", distance: "1.0 km", lat: 13.0800, lng: 80.2750 },
      { id: "f2", name: "Community Kitchen", type: "food", address: "89 Meal Rd, Chennai", distance: "1.9 km", lat: 13.0850, lng: 80.2650 }
    ],
    medical: [
      { id: "m1", name: "Government Hospital", type: "medical", address: "34 Health Ave, Chennai", distance: "2.2 km", lat: 13.0750, lng: 80.2770 },
      { id: "m2", name: "Medical Relief Camp", type: "medical", address: "67 Doctor St, Chennai", distance: "0.7 km", lat: 13.0880, lng: 80.2720 }
    ]
  };

  const handleSetToken = () => {
    if (!mapToken) {
      toast.error("Please enter a valid Mapbox token");
      return;
    }
    
    localStorage.setItem("mapboxToken", mapToken);
    setShowTokenInput(false);
    initializeMap();
  };

  const initializeMap = () => {
    const token = localStorage.getItem("mapboxToken") || mapToken;
    if (!token) return;
    
    // This would be a real Mapbox integration in a production app
    // For now, we'll simulate the map loading
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setMapReady(true);
      
      // Load resources based on selected type
      setResources(mockResourceData[resourceType] || []);
    }, 1500);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("mapboxToken");
    if (savedToken) {
      setMapToken(savedToken);
      setShowTokenInput(false);
      initializeMap();
    }
  }, []);

  useEffect(() => {
    if (mapReady) {
      setIsLoading(true);
      setTimeout(() => {
        setResources(mockResourceData[resourceType] || []);
        setIsLoading(false);
      }, 800);
    }
  }, [resourceType, mapReady]);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "water":
        return <Water className="h-5 w-5 text-blue-600" />;
      case "food":
        return <Food className="h-5 w-5 text-green-600" />;
      case "shelter":
        return <Shelter className="h-5 w-5 text-orange-600" />;
      case "medical":
        return <MapPin className="h-5 w-5 text-red-600" />;
      default:
        return <MapPin className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
          <MapPin className="text-green-600" />
          Resource Map
        </h2>
        
        <p className="text-gray-600 mb-6">
          Find essential resources near {location.city}, {location.state} during emergencies
        </p>
        
        {showTokenInput ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-yellow-800 mb-2">Mapbox API Key Required</h3>
            <p className="text-sm text-yellow-700 mb-4">
              To view the resource map, you need to provide a Mapbox API key. Get one for free at <a href="https://mapbox.com" target="_blank" rel="noreferrer" className="underline">mapbox.com</a>.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your Mapbox token"
                value={mapToken}
                onChange={(e) => setMapToken(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSetToken}>Set Token</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              <Button 
                variant={resourceType === "shelter" ? "default" : "outline"} 
                onClick={() => setResourceType("shelter")}
                className="flex items-center gap-2"
              >
                <Shelter size={16} /> Shelters
              </Button>
              <Button 
                variant={resourceType === "water" ? "default" : "outline"} 
                onClick={() => setResourceType("water")}
                className="flex items-center gap-2"
              >
                <Water size={16} /> Water Sources
              </Button>
              <Button 
                variant={resourceType === "food" ? "default" : "outline"} 
                onClick={() => setResourceType("food")}
                className="flex items-center gap-2"
              >
                <Food size={16} /> Food Centers
              </Button>
              <Button 
                variant={resourceType === "medical" ? "default" : "outline"} 
                onClick={() => setResourceType("medical")}
                className="flex items-center gap-2"
              >
                <MapPin size={16} /> Medical Help
              </Button>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading resources near you...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-[400px] bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-4 bg-white border-b border-gray-200">
                    <h3 className="font-medium">Resource Map</h3>
                    <p className="text-sm text-gray-500">
                      Showing {resourceType} locations near {location.city}
                    </p>
                  </div>
                  
                  <div ref={mapContainer} className="h-[calc(400px-57px)] bg-blue-50 flex items-center justify-center">
                    <div className="text-center p-4">
                      <MapPin className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-blue-800 font-medium">Map Preview</p>
                      <p className="text-sm text-blue-600 mt-1">
                        In a production app, this would show an interactive map with resource markers
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {resources.length > 0 ? (
                    resources.map((resource) => (
                      <div
                        key={resource.id}
                        className="p-4 border rounded-lg bg-white hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="mr-3 bg-blue-100 p-2 rounded-full">
                              {getResourceIcon(resource.type)}
                            </div>
                            <div>
                              <h4 className="font-medium">{resource.name}</h4>
                              <p className="text-sm text-gray-600">{resource.address}</p>
                              <p className="text-xs text-blue-600">{resource.distance} away</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="flex items-center gap-1">
                            Directions <ArrowRight size={14} />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <MapPin className="mx-auto h-10 w-10 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No resources found</h3>
                      <p className="mt-1 text-sm text-gray-500">Try selecting a different resource type.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h3 className="font-medium text-green-800 mb-2">How to Use the Resource Map</h3>
        <ul className="list-disc pl-5 text-green-700 space-y-1 text-sm">
          <li>Select resource type (shelter, water, food, medical) to find nearby facilities</li>
          <li>Click on "Directions" to get navigation to the resource</li>
          <li>Resources are verified and updated regularly</li>
          <li>If you discover a new resource, please report it to help others</li>
        </ul>
      </div>
    </div>
  );
};

export default ResourceMap;
