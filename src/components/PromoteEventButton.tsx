import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import { promoteEvent } from "../backendServices/index";
import Spinner from "./common/Spinner";

interface EventModalProps {
  isModalOpen: (open: boolean) => void;
}

const PromoteButton: React.FC<EventModalProps> = ({ isModalOpen }) => {
  const [message, setMessage] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [postImage, setPostImage] = useState<File | null>(null);
  const [postImagePreview, setPostImagePreview] = useState<string | null>(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<
    {
      owner: any; eventId: string; username: string; name: string 
}[]
  >([]);

  // Function to handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedCheckboxes(
      (prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value) // Uncheck if already checked
          : [...prev, value], // Add to selection
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
        { headers: { "ngrok-skip-browser-warning": "69420" } },
      );
      if (data?.status) {
        setEvents(data?.events);
      } else {
        toast.error("Failed to fetch events");
      }
    } catch (error) {
      toast.error("Error fetching data");
    }
  };

  // Function to handle image selection and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPostImage(file);
      setPostImagePreview(URL.createObjectURL(file));
    }
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    // Log selected events' username and eventId
    setLoading(true);
    const selectedEvents = events
      .filter((event) => selectedCheckboxes.includes(event.eventId))
      .map((event) => ({ eventId: event?.eventId, username: event?.owner }));

    // Prepare form data
    const formData = new FormData();
    formData.append("message", message);
    formData.append("content", content);
    formData.append("events", JSON.stringify(selectedEvents)); // Append selected events as objects
    if (postImage) {
      formData.append("postimage", postImage); // Adjust to "postimage" as specified in your request
    }

    const data = await promoteEvent(formData);

    // Send data
    console.log(data, "response");

    setLoading(false);

    if (data.status) {
      isModalOpen(false);
      toast.success("Promotion sent successfully!");
    } else {
      toast.error("Failed to send promotion");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 fixed inset-0 flex items-center justify-center bg-opacity-50">
        <div className="my_custom_scrollbar h-[90vh] w-1/2 overflow-y-auto rounded-lg bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Promote</h2>

          {/* Message input */}
          <div className="mb-4">
            <label className="text-gray-700 block">Message</label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-2 w-full rounded border p-2"
            />
          </div>

          {/* Content textarea */}
          <div className="mb-4">
            <label className="text-gray-700 block">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-2 w-full rounded border p-2"
              rows={4}
            />
          </div>

          {/* Add image input */}
          <div className="mb-4">
            <label className="text-gray-700 block">Add Image</label>
            <input
              type="file"
              className="mt-2 w-full rounded border p-2"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>

          {/* Image preview */}
          {postImagePreview && (
            <div className="mb-4">
              <label className="text-gray-700 block">Image Preview</label>
              <Image
                width={200}
                height={200}
                src={postImagePreview}
                alt="Selected"
                className="mt-2 h-auto w-full rounded"
              />
            </div>
          )}

          {/* Checkbox list dropdown */}
          <div className="mb-4">
            <label className="text-gray-700 block">Select Events</label>
            <div className="max-h-40 overflow-y-auto rounded border p-2">
              {events
                .filter((event) => event.name.trim() !== "")
                .map((event, index) => (
                  <div key={index} className="mb-2 flex items-center">
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
              className= {`mr-2 rounded bg-green-500 px-4 py-2 text-white ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={loading ? undefined : handleSubmit}
            >
              {loading ? <Spinner /> : "Send"}
            </button>
            <button
              className="rounded bg-rose-400 px-4 py-2 text-white"
              onClick={() => isModalOpen(false)}
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoteButton;
