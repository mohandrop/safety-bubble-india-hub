
import React, { useState, useEffect } from "react";
import { Phone, Plus, Trash2, User, AlertCircle, Building, MapPin, Hospital } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";

interface Contact {
  id: string;
  name: string;
  phone: string;
  type: string;
  isEmergency: boolean;
}

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("personal");
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  useEffect(() => {
    // Load contacts from localStorage or initialize with default emergency contacts
    const savedContacts = localStorage.getItem("emergencyContacts");
    
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    } else {
      // Default emergency service contacts for India
      const defaultContacts = [
        { id: "1", name: "Police Control Room", phone: "100", type: "police", isEmergency: true },
        { id: "2", name: "Ambulance", phone: "108", type: "medical", isEmergency: true },
        { id: "3", name: "Fire Control Room", phone: "101", type: "fire", isEmergency: true },
        { id: "4", name: "Women Helpline", phone: "1091", type: "emergency", isEmergency: true },
        { id: "5", name: "Disaster Management", phone: "1078", type: "emergency", isEmergency: true },
        { id: "6", name: "National Emergency Number", phone: "112", type: "emergency", isEmergency: true }
      ];
      setContacts(defaultContacts);
      localStorage.setItem("emergencyContacts", JSON.stringify(defaultContacts));
    }
  }, []);

  const saveContacts = (newContacts: Contact[]) => {
    localStorage.setItem("emergencyContacts", JSON.stringify(newContacts));
  };

  const handleAddContact = () => {
    if (!name || !phone) {
      toast("Please fill in both name and phone number");
      return;
    }

    // Simple phone validation for India (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone) && phone.length !== 3 && phone.length !== 4) {
      toast("Please enter a valid phone number");
      return;
    }

    const newContact: Contact = {
      id: Date.now().toString(),
      name,
      phone,
      type,
      isEmergency: false
    };

    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    saveContacts(updatedContacts);
    setName("");
    setPhone("");
    setType("personal");
    setIsOpenDialog(false);
    toast("Contact added successfully");
  };

  const handleDeleteContact = (id: string) => {
    // Prevent deletion of default emergency contacts
    const contact = contacts.find(c => c.id === id);
    if (contact?.isEmergency) {
      toast("Cannot delete emergency service contacts");
      return;
    }

    const updatedContacts = contacts.filter(contact => contact.id !== id);
    setContacts(updatedContacts);
    saveContacts(updatedContacts);
    toast("Contact deleted");
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case "medical":
        return <Hospital className="h-4 w-4 text-red-600" />;
      case "police":
        return <Building className="h-4 w-4 text-blue-600" />;
      case "fire":
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case "emergency":
        return <Phone className="h-4 w-4 text-purple-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  // Group contacts by type
  const emergencyServices = contacts.filter(contact => contact.isEmergency);
  const personalContacts = contacts.filter(contact => !contact.isEmergency);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Phone className="text-red-600" />
          Emergency Contacts
        </h2>
        
        <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} /> Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Emergency Contact</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter contact name"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter 10-digit number"
                  type="tel"
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Type
                </label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="personal">Personal</option>
                  <option value="family">Family</option>
                  <option value="work">Work</option>
                  <option value="neighbor">Neighbor</option>
                </select>
              </div>
              
              <Button className="w-full mt-2" onClick={handleAddContact}>
                Save Contact
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Emergency Services</h3>
        <div className="grid grid-cols-2 gap-3">
          {emergencyServices.map((contact) => (
            <div
              key={contact.id}
              className="p-3 border rounded-lg bg-red-50 border-red-200 flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="mr-3 bg-white p-2 rounded-full">
                  {getContactIcon(contact.type)}
                </div>
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-gray-700">{contact.phone}</p>
                </div>
              </div>
              <a
                href={`tel:${contact.phone}`}
                className="bg-red-100 hover:bg-red-200 text-red-800 p-2 rounded-full"
              >
                <Phone size={16} />
              </a>
            </div>
          ))}
        </div>

        <h3 className="font-semibold text-gray-700 mt-6">Personal Contacts</h3>
        {personalContacts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {personalContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-3 border rounded-lg bg-blue-50 border-blue-200 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="mr-3 bg-white p-2 rounded-full">
                    {getContactIcon(contact.type)}
                  </div>
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-gray-700">{contact.phone}</p>
                  </div>
                </div>
                <div className="flex">
                  <a
                    href={`tel:${contact.phone}`}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-2 rounded-full mr-2"
                  >
                    <Phone size={16} />
                  </a>
                  <button
                    onClick={() => handleDeleteContact(contact.id)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded-full"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <User className="mx-auto h-10 w-10 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No personal contacts</h3>
            <p className="mt-1 text-sm text-gray-500">Add contacts for quick access during emergencies.</p>
          </div>
        )}
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="font-medium text-yellow-800 mb-2">Important Tips</h3>
        <ul className="list-disc pl-5 text-yellow-700 space-y-1 text-sm">
          <li>Save ICE (In Case of Emergency) contacts on your phone</li>
          <li>Memorize key emergency numbers like 112 (National Emergency)</li>
          <li>Inform family members about your whereabouts during emergencies</li>
          <li>Keep a physical copy of important contacts in your emergency kit</li>
        </ul>
      </div>
    </div>
  );
};

export default EmergencyContacts;
