import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import Image from "next/image";
import { EditEventsAndTicketAddition } from "@/backendServices";

interface EventData {
  eventId: string;
  name: string;
  startDate: string;
  endDate: string;
  venue: string;
  location: string;
  images: string;
  description: string;
  tags: string;
  createdAt: string;
  commentCount: number;
  likeCount: number;
  userEngagementCount: number;
  status: string;
  state: string;
  owner: string;
}


interface EventModalProps {
  eventData: EventData;
  isOpen: any;
  setEditEventData:any;
}

const EventModal: React.FC<EventModalProps> = ({ eventData, isOpen, setEditEventData }) => {
  const [formData, setFormData] = useState<EventData>(eventData);
  const [selectedImage, setSelectedImage] = useState(formData?.images);
  const [tickets, setTickets] = useState<any[]>([]); // Array to store tickets
  const [ticketImage, setTicketImage] = useState<string>(""); // Image for the current ticket

  const [perksInput, setPerksInput] = useState({
    collectionName: "",
    collectibleName: "",
    ownerName: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    const data = await EditEventsAndTicketAddition(
      eventData?.owner,
      eventData?.eventId,
      tickets,
      formData,
    );
    if (data?.status) {
    }
    console.log(data, "updated Event");
    console.log("Updated Event Data:", formData);
    setEditEventData(formData)
    console.log("Tickets Data:", tickets);
  };
  console.log(eventData, "evennnnnnnn");

  const addTicket = () => {
    setTickets([
      ...tickets,
      { ticketName: "", description: "", image: "", issueQty: 0, price: 0, maxQty: 0, resale_royality: 0, perks: [], transferable: false, state: "", rsvp: false },
    ]);
  };

  const handleTicketChange = (index: number, field: string, value: any) => {
    const updatedTickets = [...tickets];
    updatedTickets[index] = { ...updatedTickets[index], [field]: value };
    setTickets(updatedTickets);
  };

  const handleTicketImageChange = async (
    index: number,
    field: string,
    file: any,
  ) => {
    if (file) {
      const reader: any = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader?.result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch(
          "https://astrix-upload-staging.azurewebsites.net",
          {
            method: "POST",
            body: formData,
          },
        );
        const data = await response.json();
        console.log("Image uploaded successfully:", data);
        const updatedTickets = [...tickets];
        updatedTickets[index] = { ...updatedTickets[index], [field]: data };
        setTickets(updatedTickets);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handlePerksChange = (index: number, field: string, value: any) => {
    const updatedTickets = [...tickets];
    const updatedPerks = {
      ...updatedTickets[index].perks[0], // Assume only one object per ticket in perks array
      [field]: value,
    };

    updatedTickets[index] = {
      ...updatedTickets[index],
      perks: [updatedPerks], // Save the object in the perks array
    };
    setTickets(updatedTickets);
  };


  const handleImageUpload = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader: any = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader?.result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(
          "https://astrix-upload.azurewebsites.net/upload/:uploadType",
          {
            method: "POST",
            body: formData,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjMyNzUsInVzZXJOYW1lIjoidG9ybnV6IiwiaXNPbmJvYXJkZWQiOnRydWUsInR5cGUiOiJhY2Nlc3MiLCJleHAiOjE3MjgzMDM5NDh9.4opbxHxnyR2U_Y5JI7WLXu41mOg6C-1kAZWd3nJBmOs",
            }
          },
          
        );
        const data = await response.json();
        console.log("Image uploaded successfully:", data);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="my_custom_scrollbar relative max-h-screen w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-8 shadow-lg">
        <h2 className="text-gray-800 mb-6 text-2xl font-semibold">
          Edit Event
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="text-gray-700 block text-sm font-medium">
                Event Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border-gray-300 mt-1 block w-full rounded-md border p-2"
              />
            </div>
            {/* Location */}
            <div>
              <label className="text-gray-700 block text-sm font-medium">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="border-gray-300 mt-1 block w-full rounded-md border p-2"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="text-gray-700 block text-sm font-medium">
                Start Date
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate.slice(0, 16)} // Adjust for datetime-local input
                onChange={handleChange}
                className="border-gray-300 mt-1 block w-full rounded-md border p-2"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="text-gray-700 block text-sm font-medium">
                End Date
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate.slice(0, 16)} // Adjust for datetime-local input
                onChange={handleChange}
                className="border-gray-300 mt-1 block w-full rounded-md border p-2"
              />
            </div>
          </div>

          {/* Image */}
          {formData?.images && (
            <div className="relative h-[250px] w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                id="fileInput"
                className="hidden"
              />
              <label htmlFor="fileInput">
                <Image
                  className="cursor-pointer object-cover"
                  src={selectedImage || formData?.images}
                  alt="images"
                  fill
                />
              </label>
            </div>
          )}

          {/* Venue */}
          <div>
            <label className="text-gray-700 block text-sm font-medium">
              Venue
            </label>
            <textarea
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              className="border-gray-300 mt-1 block w-full rounded-md border p-2"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-gray-700 block text-sm font-medium">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border-gray-300 mt-1 block w-full rounded-md border p-2"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-gray-700 block text-sm font-medium">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="border-gray-300 mt-1 block w-full rounded-md border p-2"
            />
          </div>

          {/* Add Ticket Button */}
          <div className="mt-6 flex justify-end space-x-2">
            <button
              className="rounded-md bg-green-600 px-4 py-2 text-white shadow transition hover:bg-green-700"
              onClick={addTicket}
            >
              Add Ticket
            </button>
          </div>
          <div className="">
            {tickets.map((ticket, index) => (
              <div
                key={index}
                className="mt-4 space-y-4 rounded-lg border p-4 shadow-md"
              >
                <div>
                  <label className="text-gray-700 block text-sm font-medium">
                    Ticket Name
                  </label>
                  <input
                    type="text"
                    name="ticketName"
                    value={ticket.ticketName}
                    onChange={(e) =>
                      handleTicketChange(index, "ticketName", e.target.value)
                    }
                    className="border-gray-300 mt-1 block w-full rounded-md border p-2"
                  />
                </div>

                <div>
                  <label className="text-gray-700 block text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={ticket.description}
                    onChange={(e) =>
                      handleTicketChange(index, "description", e.target.value)
                    }
                    className="border-gray-300 mt-1 block w-full rounded-md border p-2"
                  />
                </div>

                {/* Image upload for each ticket */}
                <div>
                  <label className="text-gray-700 block text-sm font-medium">
                    Ticket Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleTicketImageChange(
                        index,
                        "image",
                        e.target.files?.[0],
                      )
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-700 block text-sm font-medium">
                      Issue Quantity
                    </label>
                    <input
                      type="number"
                      name="issueQty"
                      value={ticket.issueQty}
                      onChange={(e) =>
                        handleTicketChange(
                          index,
                          "issueQty",
                          Number(e.target.value),
                        )
                      }
                      className="border-gray-300 mt-1 block w-full rounded-md border p-2"
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 block text-sm font-medium">
                      Max. Quantity
                    </label>
                    <input
                      type="number"
                      name="maxQty"
                      value={ticket.maxQty}
                      onChange={(e) =>
                        handleTicketChange(
                          index,
                          "maxQty",
                          Number(e.target.value),
                        )
                      }
                      className="border-gray-300 mt-1 block w-full rounded-md border p-2"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-700 block text-sm font-medium">
                      Resale Royalty
                    </label>
                    <input
                      type="number"
                      name="resale_royality"
                      value={ticket.issueQty}
                      onChange={(e) =>
                        handleTicketChange(
                          index,
                          "resale_royality",
                          Number(e.target.value),
                        )
                      }
                      className="border-gray-300 mt-1 block w-full rounded-md border p-2"
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 block text-sm font-medium">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={ticket.price}
                      onChange={(e) =>
                        handleTicketChange(
                          index,
                          "price",
                          Number(e.target.value),
                        )
                      }
                      className="border-gray-300 mt-1 block w-full rounded-md border p-2"
                    />
                  </div>
                </div>

                <p>Perks</p>
                <div className="grid grid-cols-3 gap-4">
              <div>
                <label>Collection Name</label>
                <input
                  type="text"
                  value={ticket.perks?.[0]?.collectionName || ""}
                  onChange={(e) =>
                    handlePerksChange(index, "collectionName", e.target.value)
                  }
                  className="border-gray-300 mt-1 block w-full rounded-md border p-2"
                />
              </div>
              <div>
                <label>Collectible Name</label>
                <input
                  type="text"
                  value={ticket.perks?.[0]?.collectibleName || ""}
                  onChange={(e) =>
                    handlePerksChange(index, "collectibleName", e.target.value)
                  }
                  className="border-gray-300 mt-1 block w-full rounded-md border p-2"
                />
              </div>
              <div>
                <label>Owner Name</label>
                <input
                  type="text"
                  value={ticket.perks?.[0]?.ownerName || ""}
                  onChange={(e) =>
                    handlePerksChange(index, "ownerName", e.target.value)
                  }
                  className="border-gray-300 mt-1 block w-full rounded-md border p-2"
                />
              </div>
            </div>


                <div className="grid grid-cols-3 gap-4">
                
                  {/* Ticket State Dropdown */}
                <div>
                  <label className="text-gray-700 block text-sm font-medium">
                    State
                  </label>
                  <select
                    value={ticket.state}
                    onChange={(e) =>
                      handleTicketChange(index, "state", e.target.value)
                    }
                    className="border-gray-300 mt-1 block w-full rounded-md border p-2"
                  >
                    <option value="">Select State</option>
                    <option value="Deleted">Deleted</option>
                    <option value="Freezed">Freezed</option>
                    <option value="Active">Active</option>
                    <option value="Hidden">Hidden</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-gray-700 block text-sm font-medium">
                    Transferable
                  </label>
                  <input
                    type="checkbox"
                    checked={ticket.transferable}
                    onChange={(e) =>
                      handleTicketChange(index, "transferable", e.target.checked)
                    }
                  />
                </div>
                  <div className="flex items-center space-x-2">
                  <label className="text-gray-700 block text-sm font-medium">
                    RSVP
                  </label>
                  <input
                    type="checkbox"
                    checked={ticket.rsvp}
                    onChange={(e) =>
                      handleTicketChange(index, "rsvp", e.target.checked)
                    }
                  />
                </div>
                </div>
              </div>
            ))}
          </div>
          {/* Buttons */}
          <div className="mt-6 flex justify-end space-x-2">
            <button
              className="rounded-md bg-blue-600 px-4 py-2 text-white shadow transition hover:bg-blue-700"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 rounded-md px-4 py-2 text-black shadow transition"
              onClick={() => isOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
