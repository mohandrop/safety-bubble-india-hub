
import React, { useState, useEffect } from "react";
import { Compass, CheckCircle, Circle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface PreparednessListProps {
  activeDisaster: string | null;
}

interface ChecklistItem {
  id: string;
  text: string;
  category: string;
  isChecked: boolean;
  priority: "high" | "medium" | "low";
}

const PreparednessList: React.FC<PreparednessListProps> = ({ activeDisaster }) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    // In a real app, this would be fetched from a backend API based on user location and active disasters
    const baseChecklist: ChecklistItem[] = [
      { id: "b1", text: "Store at least 3 liters of water per person per day", category: "water", isChecked: false, priority: "high" },
      { id: "b2", text: "Keep non-perishable food for at least 3 days", category: "food", isChecked: false, priority: "high" },
      { id: "b3", text: "First aid kit with essential medications", category: "medical", isChecked: false, priority: "high" },
      { id: "b4", text: "Flashlight and extra batteries", category: "equipment", isChecked: false, priority: "medium" },
      { id: "b5", text: "Mobile phone with charger and power bank", category: "communication", isChecked: false, priority: "high" },
      { id: "b6", text: "Important documents in waterproof container", category: "documents", isChecked: false, priority: "medium" },
      { id: "b7", text: "Emergency cash in small denominations", category: "financial", isChecked: false, priority: "medium" },
      { id: "b8", text: "Whistle to signal for help", category: "equipment", isChecked: false, priority: "low" },
      { id: "b9", text: "Dust masks and plastic sheeting for shelter", category: "equipment", isChecked: false, priority: "low" }
    ];
    
    // Add disaster-specific items based on the active disaster
    let disasterItems: ChecklistItem[] = [];
    
    if (activeDisaster) {
      switch (activeDisaster) {
        case "Flood Warning":
          disasterItems = [
            { id: "f1", text: "Move to higher ground immediately", category: "action", isChecked: false, priority: "high" },
            { id: "f2", text: "Turn off electricity at the main switch", category: "action", isChecked: false, priority: "high" },
            { id: "f3", text: "Store drinking water in clean containers", category: "water", isChecked: false, priority: "high" },
            { id: "f4", text: "Waterproof bag for valuables and electronics", category: "equipment", isChecked: false, priority: "medium" }
          ];
          break;
        case "Heat Wave":
          disasterItems = [
            { id: "h1", text: "Stay indoors during peak hours (11am-3pm)", category: "action", isChecked: false, priority: "high" },
            { id: "h2", text: "Keep extra water for hydration", category: "water", isChecked: false, priority: "high" },
            { id: "h3", text: "Have ORS packets ready", category: "medical", isChecked: false, priority: "medium" },
            { id: "h4", text: "Keep windows covered during day", category: "action", isChecked: false, priority: "medium" }
          ];
          break;
        case "Cyclone Alert":
          disasterItems = [
            { id: "c1", text: "Secure loose items outside your home", category: "action", isChecked: false, priority: "high" },
            { id: "c2", text: "Identify strongest part of house for shelter", category: "action", isChecked: false, priority: "high" },
            { id: "c3", text: "Keep battery-operated radio for updates", category: "communication", isChecked: false, priority: "medium" },
            { id: "c4", text: "Store extra water before cyclone hits", category: "water", isChecked: false, priority: "high" }
          ];
          break;
        default:
          disasterItems = [];
      }
    }
    
    // Combine base and disaster-specific checklists
    const combinedChecklist = [...baseChecklist, ...disasterItems];
    
    // Load saved checklist from localStorage or use the generated one
    const savedChecklist = localStorage.getItem("preparednessChecklist");
    if (savedChecklist) {
      const parsedChecklist = JSON.parse(savedChecklist);
      // Merge saved state with new items
      const mergedChecklist = combinedChecklist.map(item => {
        const savedItem = parsedChecklist.find((saved: ChecklistItem) => saved.id === item.id);
        return savedItem || item;
      });
      setChecklist(mergedChecklist);
    } else {
      setChecklist(combinedChecklist);
    }
  }, [activeDisaster]);

  // Save checklist state to localStorage whenever it changes
  useEffect(() => {
    if (checklist.length > 0) {
      localStorage.setItem("preparednessChecklist", JSON.stringify(checklist));
    }
  }, [checklist]);

  const handleCheckItem = (id: string) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

  const getCompletionPercentage = () => {
    if (checklist.length === 0) return 0;
    const checkedItems = checklist.filter(item => item.isChecked).length;
    return Math.round((checkedItems / checklist.length) * 100);
  };

  const filteredChecklist = filterCategory === "all" 
    ? checklist 
    : checklist.filter(item => item.category === filterCategory);

  // Group by priority
  const highPriorityItems = filteredChecklist.filter(item => item.priority === "high");
  const mediumPriorityItems = filteredChecklist.filter(item => item.priority === "medium");
  const lowPriorityItems = filteredChecklist.filter(item => item.priority === "low");

  // Get all unique categories
  const categories = ["all", ...new Set(checklist.map(item => item.category))];

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "all": return "All Items";
      case "water": return "Water";
      case "food": return "Food";
      case "medical": return "Medical";
      case "equipment": return "Equipment";
      case "communication": return "Communication";
      case "documents": return "Documents";
      case "financial": return "Financial";
      case "action": return "Action Items";
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-1">
          <Compass className="text-blue-600" />
          Disaster Preparedness Checklist
        </h2>
        
        {activeDisaster ? (
          <p className="text-red-600 font-medium flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            {activeDisaster} - Critical items highlighted
          </p>
        ) : (
          <p className="text-gray-600">
            Keep track of essential items and actions for emergency preparedness
          </p>
        )}
      </div>

      <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
        <div>
          <h3 className="font-medium text-blue-800">Your Preparedness Level</h3>
          <p className="text-blue-700 text-sm">Complete all high-priority items first</p>
        </div>
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mr-2 text-lg font-bold text-blue-800 border-4 border-blue-200">
            {getCompletionPercentage()}%
          </div>
          <div className="text-sm">
            <div className="text-blue-800 font-medium">{checklist.filter(item => item.isChecked).length} of {checklist.length}</div>
            <div className="text-blue-600">items completed</div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <Button 
            key={category}
            variant={filterCategory === category ? "default" : "outline"} 
            onClick={() => setFilterCategory(category)}
            size="sm"
          >
            {getCategoryLabel(category)}
          </Button>
        ))}
      </div>

      <div className="space-y-6">
        {highPriorityItems.length > 0 && (
          <div>
            <h3 className="text-red-600 font-medium mb-2 flex items-center gap-1">
              <AlertTriangle size={16} /> High Priority Items
            </h3>
            <div className="space-y-2">
              {highPriorityItems.map(item => (
                <div 
                  key={item.id} 
                  className={`p-3 rounded-lg border flex items-start gap-3 ${
                    item.isChecked 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200 hover:border-red-200'
                  }`}
                >
                  <Checkbox 
                    id={item.id} 
                    checked={item.isChecked}
                    onCheckedChange={() => handleCheckItem(item.id)}
                  />
                  <div className="flex-1">
                    <label 
                      htmlFor={item.id} 
                      className={`cursor-pointer ${
                        item.isChecked ? 'line-through text-green-800' : 'text-gray-800'
                      }`}
                    >
                      {item.text}
                    </label>
                    <div className="text-xs text-gray-500 mt-1">
                      Category: {getCategoryLabel(item.category)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {mediumPriorityItems.length > 0 && (
          <div>
            <h3 className="text-yellow-600 font-medium mb-2">Medium Priority Items</h3>
            <div className="space-y-2">
              {mediumPriorityItems.map(item => (
                <div 
                  key={item.id} 
                  className={`p-3 rounded-lg border flex items-start gap-3 ${
                    item.isChecked 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200 hover:border-yellow-200'
                  }`}
                >
                  <Checkbox 
                    id={item.id} 
                    checked={item.isChecked}
                    onCheckedChange={() => handleCheckItem(item.id)}
                  />
                  <div className="flex-1">
                    <label 
                      htmlFor={item.id} 
                      className={`cursor-pointer ${
                        item.isChecked ? 'line-through text-green-800' : 'text-gray-800'
                      }`}
                    >
                      {item.text}
                    </label>
                    <div className="text-xs text-gray-500 mt-1">
                      Category: {getCategoryLabel(item.category)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {lowPriorityItems.length > 0 && (
          <div>
            <h3 className="text-blue-600 font-medium mb-2">Additional Items</h3>
            <div className="space-y-2">
              {lowPriorityItems.map(item => (
                <div 
                  key={item.id} 
                  className={`p-3 rounded-lg border flex items-start gap-3 ${
                    item.isChecked 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <Checkbox 
                    id={item.id} 
                    checked={item.isChecked}
                    onCheckedChange={() => handleCheckItem(item.id)}
                  />
                  <div className="flex-1">
                    <label 
                      htmlFor={item.id} 
                      className={`cursor-pointer ${
                        item.isChecked ? 'line-through text-green-800' : 'text-gray-800'
                      }`}
                    >
                      {item.text}
                    </label>
                    <div className="text-xs text-gray-500 mt-1">
                      Category: {getCategoryLabel(item.category)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredChecklist.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Compass className="mx-auto h-10 w-10 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No checklist items</h3>
            <p className="mt-1 text-sm text-gray-500">Try selecting a different category.</p>
          </div>
        )}
      </div>

      <Button className="w-full">Download Complete Preparedness Guide</Button>
    </div>
  );
};

// Import the AlertTriangle icon for active disaster warnings
import { AlertTriangle } from "lucide-react";

export default PreparednessList;
