import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface EventModalProps {
  isModalOpen: any;
}

const PromoteButton: React.FC<EventModalProps> = ({ isModalOpen }) => {
  const [message, setMessage] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  // Function to handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedCheckboxes((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value) // Uncheck if already checked
        : [...prev, value] // Add to selection
    );
  };

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/events`,
        { headers: { "ngrok-skip-browser-warning": "69420" } }
      );
      console.log(data?.events, "-----------");
      if (data?.status) {
        setEvents(data?.events);
      } else {
        toast.error("Failed to fetch events");
      }
    } catch (error) {
      toast.error("Error fetching data");
    }
  };

  // Function to handle form submission
  const handleSubmit = () => {
    console.log("Message:", message);
    console.log("Content:", content);

    // Log selected events' username and eventId
    const selectedEvents = events.filter((event) =>
      selectedCheckboxes.includes(event.eventId)
    );
    selectedEvents.forEach((event) => {
      console.log(`Username: ${event.username}, EventId: ${event.eventId}`);
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg w-1/2">
          <h2 className="text-xl font-semibold mb-4">Promote</h2>

          {/* Message input */}
          <div className="mb-4">
            <label className="block text-gray-700">Message</label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border rounded mt-2"
            />
          </div>

          {/* Content textarea */}
          <div className="mb-4">
            <label className="block text-gray-700">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded mt-2"
              rows={4}
            />
          </div>

          {/* Checkbox list dropdown */}
          <div className="mb-4">
            <label className="block text-gray-700">Select Events</label>
            <div className="border rounded p-2 max-h-40 overflow-y-auto">
              {events.filter((event) => event.name.trim() !== "")
              .map((event, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    value={event.eventId}
                    onChange={handleCheckboxChange}
                    checked={selectedCheckboxes.includes(event.eventId)}
                    className="mr-2"
                  />
                  <label className="text-gray-700">{event.name}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              onClick={handleSubmit}
            >
              Save
            </button>
            <button
              className="bg-rose-400 text-white px-4 py-2 rounded"
              onClick={() => isModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoteButton;
