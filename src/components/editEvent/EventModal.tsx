import React, { useState } from "react";
import Image from "next/image";
import { EditEventsAndTicketAddition } from "@/backendServices";
import toast from 'react-hot-toast';
import Loader from "../common/Loader";


interface EventData {
  eventId: string;
  name: string;
  startDate: any;
  endDate: any;
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
  const [tickets, setTickets] = useState<any[any]>([]); // Array to store tickets
const [loading, setLoading] = useState<boolean>(false)
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
    setLoading(true)
  const startDateObj = new Date(eventData?.startDate);
  const endDateObj = new Date(eventData?.endDate);

  let modifiedFields: any = {};
  
  Object.keys(formData).forEach((key) => {
    if (formData[key as keyof EventData] !== eventData[key as keyof EventData]) {
      modifiedFields[key as keyof EventData] = formData[key as keyof EventData];
    }
  });

  if (
    new Date(formData?.startDate).toISOString() !==
    new Date(eventData?.startDate).toISOString()
  ) {
    modifiedFields.startDate = startDateObj.toISOString().split("T")[0];
    modifiedFields.startTime = startDateObj.toISOString().split("T")[1].slice(0, 5);
  }

  if (
    new Date(formData?.endDate).toISOString() !==
    new Date(eventData?.endDate).toISOString()
  ) {
    modifiedFields.endDate = endDateObj.toISOString().split("T")[0];
    modifiedFields.endTime = endDateObj.toISOString().split("T")[1].slice(0, 5);
  }

  
  const ticketPayload = tickets?.map((ticket: any) => ({
      ticketName: ticket?.ticketName,
      description: ticket?.description,
       image: ticket?.image,
        issue_qty: +ticket?.issue_qty,
         price: +ticket?.price,
          max_qty: +ticket?.max_qty,
           perks: [],
            resale_royality: +ticket?.resale_royality,
             transferable: ticket?.transferable,
              state: ticket?.state,
               rsvp: ticket?.rsvp
  }))
  
if(modifiedFields?.images){
  const updated = {...modifiedFields, images: [modifiedFields?.images]}
  modifiedFields = updated;
}
  const payload = {
    ...modifiedFields,
    tickets: tickets.length < 1 ? [] : ticketPayload
    // images: modifiedFields?.images ? [modifiedFields.images] : eventData?.images, // Include images if modified
  };
  const data = await EditEventsAndTicketAddition(
    eventData?.owner,
    eventData?.eventId,
    payload
  );
  console.log(data, "err.........")
  if (data?.status) {
    setLoading(false)
    console.log("Event updated successfully:", data);
    setEditEventData(formData);
    isOpen(false)
    toast.success("Event Updated succesfully")
  }else {
    toast.error("Error" + data?.response?.data?.message)
    setLoading(false)
    isOpen(false)
  }

  setLoading(false)
};

  const addTicket = () => {
    setTickets([
      ...tickets,
      { ticketName: "", description: "", image: "", issue_qty: "", price: "", max_qty: "", perks: [], resale_royality: "", transferable: false, state: "", rsvp: false },
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
      const formDataImage = new FormData();
      formDataImage.append("file", file);

      try {
        const response = await fetch(
          "http://localhost:8001/upload/eTickets",
          {
            method: "POST",
            body: formDataImage,
            headers: {
              'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEwOCwidXNlck5hbWUiOiJnb3VyYXZmb3JldmVyIiwiaXNPbmJvYXJkZWQiOnRydWUsInR5cGUiOiJhY2Nlc3MiLCJleHAiOjE3Mjg2NTQwMjB9.rDUw_OR5yeA7mXxY3IUaDaU4QVGmJA6ovJqL4QROk8g",
            }
          },
          
        );
        const data = await response.json();
        console.log("Image uploaded successfully:", data);
        if(data?.status){
          const updatedTickets = [...tickets];
          updatedTickets[index] = { ...updatedTickets[index], image: data?.content?.uploadedUrl};
          setTickets(updatedTickets);
          toast.success("Image Uploaded succesfully")
        }else {
          toast.error("Error uploading image")
        }
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
    // setTickets(updatedTickets);
  };


  const handleImageUpload = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader: any = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader?.result);
      };
      reader.readAsDataURL(file);

      const formDataImage = new FormData();
      formDataImage.append("file", file);

      try {
        const response = await fetch(
          "http://localhost:8001/upload/eTickets",
          {
            method: "POST",
            body: formDataImage,
            headers: {
              'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEwOCwidXNlck5hbWUiOiJnb3VyYXZmb3JldmVyIiwiaXNPbmJvYXJkZWQiOnRydWUsInR5cGUiOiJhY2Nlc3MiLCJleHAiOjE3Mjg2NTQwMjB9.rDUw_OR5yeA7mXxY3IUaDaU4QVGmJA6ovJqL4QROk8g",
            }
          },
          
        );
        const data = await response.json();
        if(data?.status){
          console.log(data?.content?.uploadedUrl)
          let updatedImage: any = {
            ...formData,
            images: data?.content?.uploadedUrl
          };
         setFormData(updatedImage)
          toast.success("Image Uploaded succesfully")
        }else {
          toast.error("Error uploading image")
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999]  flex items-center justify-center bg-black bg-opacity-50">
      <div className="my_custom_scrollbar max-h-[80vh] relative  w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-8 shadow-lg">
        <h2 className="text-gray-800 mb-6 text-2xl font-semibold">
          Edit Event
        </h2>
        {loading ? <Loader /> : <div className="space-y-4">
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
                value={formData?.startDate?.slice(0, 16)} // Adjust for datetime-local input
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
                value={formData?.endDate?.slice(0, 16)} // Adjust for datetime-local input
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
            {tickets.map((ticket: any, index: any) => (
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
                      name="issue_qty"
                      value={ticket.issue_qty}
                      onChange={(e) =>
                        handleTicketChange(
                          index,
                          "issue_qty",
                          (e.target.value),
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
                      name="max_qty"
                      value={ticket.max_qty}
                      onChange={(e) =>
                        handleTicketChange(
                          index,
                          "max_qty",
                          (e.target.value),
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
                      value={ticket.resale_royality}
                      onChange={(e) =>
                        handleTicketChange(
                          index,
                          "resale_royality",
                          (e.target.value),
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
                          (e.target.value),
                        )
                      }
                      className="border-gray-300 mt-1 block w-full rounded-md border p-2"
                    />
                  </div>
                </div>

                {/*<p>Perks</p>
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
            </div> */}


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
                    <option value="deleted">Deleted</option>
                    <option value="freezed">Freezed</option>
                    <option value="active">Active</option>
                    <option value="hidden">Hidden</option>
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
        </div>}
      </div>
    </div>
  );
};

export default EventModal;
