
import React, { useState, useEffect } from "react";
import { AlertTriangle, CloudLightning, User, ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface DisasterAlertsProps {
  location: {
    state: string;
    city: string;
    pincode: string;
  };
  activeDisaster: string | null;
}

const DisasterAlerts: React.FC<DisasterAlertsProps> = ({ location, activeDisaster }) => {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be a call to a disaster alert API
    const fetchAlerts = async () => {
      setIsLoading(true);
      try {
        // Simulated API response based on location
        const mockAlerts = getMockAlertsForLocation(location.state);
        
        setTimeout(() => {
          setAlerts(mockAlerts);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching disaster alerts", error);
        setIsLoading(false);
      }
    };

    fetchAlerts();
    // Set up regular checking for new alerts
    const interval = setInterval(fetchAlerts, 300000); // Every 5 minutes
    
    return () => clearInterval(interval);
  }, [location]);

  const getMockAlertsForLocation = (state: string) => {
    // Simulated disaster alerts based on the state
    const alertsByState = {
      "Assam": [
        { id: 1, type: "Flood Warning", severity: "high", description: "Heavy rainfall causing flooding in several districts. Avoid low-lying areas and stay prepared for evacuation.", date: "2023-07-12T10:00:00Z" },
        { id: 2, type: "Landslide Risk", severity: "medium", description: "Risk of landslides in hilly regions due to continuous rainfall.", date: "2023-07-11T14:30:00Z" }
      ],
      "Bihar": [
        { id: 3, type: "Flood Warning", severity: "high", description: "River Kosi and Gandak above danger levels. Alert for residents in riverside areas.", date: "2023-07-12T09:15:00Z" },
      ],
      "Delhi": [
        { id: 4, type: "Heat Wave", severity: "high", description: "Extreme temperature alert. Stay hydrated and avoid outdoor activities between 11 AM and 4 PM.", date: "2023-05-25T08:00:00Z" },
        { id: 5, type: "Air Quality Alert", severity: "medium", description: "Poor air quality. People with respiratory conditions advised to stay indoors.", date: "2023-11-05T17:45:00Z" }
      ],
      "Maharashtra": [
        { id: 6, type: "Heavy Rainfall", severity: "medium", description: "Heavy rainfall expected in Mumbai and surrounding areas. Potential waterlogging in low-lying areas.", date: "2023-06-30T16:20:00Z" }
      ],
      "Tamil Nadu": [
        { id: 7, type: "Cyclone Alert", severity: "high", description: "Cyclonic storm approaching coastal areas. Prepare for strong winds and heavy rainfall.", date: "2023-12-01T07:30:00Z" }
      ],
      // Default alerts for states without specific alerts
      "default": [
        { id: 8, type: "National Weather Update", severity: "low", description: "No immediate disaster threats in your area. Stay informed with regular updates.", date: new Date().toISOString() }
      ]
    };

    return alertsByState[state] || alertsByState.default;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-50 border-red-200 text-red-800";
      case "medium":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "low":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CloudLightning className="text-red-600" />
          Disaster Alerts
        </h2>
        {activeDisaster && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Active Alert
          </span>
        )}
      </div>

      <p className="text-gray-600">
        Real-time alerts and warnings for {location.city}, {location.state} and surrounding areas
      </p>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading alerts for your location...</p>
        </div>
      ) : alerts.length > 0 ? (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Alert key={alert.id} className={`${getSeverityColor(alert.severity)} border`}>
              <div className="flex items-start justify-between">
                <div>
                  <AlertTitle className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    {alert.type}
                    <span className="ml-2 text-xs font-normal">
                      {alert.severity === "high" ? "Urgent" : alert.severity === "medium" ? "Important" : "Advisory"}
                    </span>
                  </AlertTitle>
                  <AlertDescription className="mt-1">
                    {alert.description}
                  </AlertDescription>
                  <p className="mt-2 text-xs">
                    Issued: {formatDate(alert.date)}
                  </p>
                </div>
                <Button variant="outline" size="sm" className={`mt-2 ${getSeverityColor(alert.severity)}`}>
                  Details <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </Alert>
          ))}
          
          <Button className="w-full mt-4">Subscribe to Alert Notifications</Button>
        </div>
      ) : (
        <Alert className="bg-green-50 border-green-200">
          <AlertTitle className="text-green-800">All Clear</AlertTitle>
          <AlertDescription className="text-green-700">
            No active disaster alerts for your location at this time. Stay prepared!
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-medium text-blue-800 mb-2">How to Stay Safe</h3>
        <ul className="list-disc pl-5 text-blue-700 space-y-1">
          <li>Keep emergency contacts accessible</li>
          <li>Follow evacuation orders immediately</li>
          <li>Prepare an emergency kit using our checklist</li>
          <li>Stay updated through official channels</li>
        </ul>
      </div>
    </div>
  );
};

export default DisasterAlerts;
