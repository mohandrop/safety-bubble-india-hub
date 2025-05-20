
import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Users, Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { toast } from "@/components/ui/sonner";

interface CommunitySyncProps {
  location: {
    state: string;
    city: string;
    pincode: string;
  };
}

interface Message {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
  isCurrentUser: boolean;
}

const CommunitySync: React.FC<CommunitySyncProps> = ({ location }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentUsername, setCurrentUsername] = useState("User_" + Math.floor(Math.random() * 1000));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In a real app, this would fetch messages from a backend API
    const fetchMessages = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockMessages = getMockMessagesForLocation(location.state);
        setMessages(mockMessages);
        setIsLoading(false);
      }, 1200);
    };

    fetchMessages();
  }, [location]);

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getMockMessagesForLocation = (state: string) => {
    // Default set of messages for the community
    const commonMessages: Message[] = [
      {
        id: "1",
        user: {
          name: "Emergency Response Team",
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=ERT"
        },
        text: "Welcome to the Community Sync channel for your area. Share updates about local conditions here.",
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
        isCurrentUser: false
      },
      {
        id: "2",
        user: {
          name: "Disaster Management Authority",
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=DMA"
        },
        text: "We're closely monitoring the situation in your area. Stay safe and follow official guidelines.",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        isCurrentUser: false
      }
    ];

    // State-specific messages
    const stateMessages: { [key: string]: Message[] } = {
      "Kerala": [
        {
          id: "k1",
          user: {
            name: "Local Volunteer",
            avatar: "https://api.dicebear.com/7.x/initials/svg?seed=LV"
          },
          text: "Heavy rainfall expected in Idukki and Wayanad districts. Take precautions if you're in low-lying areas.",
          timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
          isCurrentUser: false
        }
      ],
      "Tamil Nadu": [
        {
          id: "t1",
          user: {
            name: "Chennai Weather Updates",
            avatar: "https://api.dicebear.com/7.x/initials/svg?seed=CWU"
          },
          text: "Cyclonic circulation over Bay of Bengal. Heavy rainfall expected in coastal areas.",
          timestamp: new Date(Date.now() - 3600000 * 1.2).toISOString(),
          isCurrentUser: false
        }
      ],
      "Delhi": [
        {
          id: "d1",
          user: {
            name: "Air Quality Monitor",
            avatar: "https://api.dicebear.com/7.x/initials/svg?seed=AQM"
          },
          text: "Air quality index (AQI) has reached 'Very Poor' category. Wear masks if going outdoors.",
          timestamp: new Date(Date.now() - 3600000 * 1.3).toISOString(),
          isCurrentUser: false
        }
      ]
    };

    return [...commonMessages, ...(stateMessages[state] || [])];
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      user: {
        name: currentUsername,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${currentUsername}`
      },
      text: newMessage,
      timestamp: new Date().toISOString(),
      isCurrentUser: true
    };

    setMessages([...messages, userMessage]);
    setNewMessage("");

    // In a real app, this would send the message to a backend API
    // Simulate a response after a short delay
    if (Math.random() > 0.5) {
      setTimeout(() => {
        const responseMessage: Message = {
          id: Date.now().toString(),
          user: {
            name: "Response Team",
            avatar: "https://api.dicebear.com/7.x/initials/svg?seed=RT"
          },
          text: "Thank you for the update. Our volunteer team has been notified.",
          timestamp: new Date().toISOString(),
          isCurrentUser: false
        };
        setMessages((prev) => [...prev, responseMessage]);
      }, 5000);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <MessageSquare className="text-purple-600" />
          Community Sync
        </h2>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{location.city}, {location.state}</span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
            Online
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading community messages...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg border border-gray-200 p-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.isCurrentUser ? 'justify-end' : ''}`}
              >
                <div className={`flex ${message.isCurrentUser ? 'flex-row-reverse' : ''} items-start max-w-[80%]`}>
                  <div 
                    className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden flex-shrink-0 mx-2"
                    style={{ backgroundImage: `url(${message.user.avatar})`, backgroundSize: 'cover' }}
                  >
                    {!message.user.avatar && message.user.name.charAt(0)}
                  </div>
                  <div>
                    <div className={`rounded-lg p-3 ${
                      message.isCurrentUser 
                        ? 'bg-blue-100 text-blue-900' 
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}>
                      <div className="flex items-center mb-1">
                        <span className={`font-medium text-sm ${
                          message.isCurrentUser ? 'text-blue-800' : 'text-gray-700'
                        }`}>
                          {message.user.name}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">{formatTimestamp(message.timestamp)}</span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} className="flex items-center gap-1">
              <Send size={16} /> Send
            </Button>
          </div>
        </>
      )}

      <div className="mt-4 bg-purple-50 p-3 rounded-lg border border-purple-200 text-sm">
        <h4 className="font-medium text-purple-800 mb-1">Community Guidelines</h4>
        <ul className="list-disc pl-5 text-purple-700 space-y-0.5 text-xs">
          <li>Share factual information only, avoid rumors</li>
          <li>Be respectful and supportive of other community members</li>
          <li>Report emergencies through official channels (100, 101, 108)</li>
          <li>Share updates about local conditions, blocked roads, and available resources</li>
        </ul>
      </div>
    </div>
  );
};

export default CommunitySync;
