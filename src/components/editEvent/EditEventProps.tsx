"use client";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Menu,
  MenuHandler,
  MenuList,
  Switch,
  useTheme,
  Button,
} from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import moment from "moment";
import Calendar from "./Calendar";

export default function EditEventPopup({
  data,
  show,
  handleEventEditPopup,
  // eventId,
  // setData,
}: {
  data: any;
  show: any;
  handleEventEditPopup: any;
  // eventId: string;
  // setData: (val: any) => void;
}) {
  const [openStartTime, setOpenStartTime] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [openEndTime, setOpenEndTime] = useState(false);
  const [openStartDate, setOpenstartDate] = useState(false);
  // const { event } = useSelector((state: any) => state.editEvent);
  const [event, setEvent] = useState({ ...data, tickets: [] });
  const [showPopup, setShowPopup] = useState(false);
  const placesAutoCompleteRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const [editEventLoading, setEditEventLoading] = useState(false);
  // const [prevEvent, setPrevEvent] = useState(event);

  // useEffect(() => {
  //   if (!prevEvent?.name) {
  //     setPrevEvent(event);
  //   }
  // }, [event]);

  const handleThumbnail = async (files: any) => {
    let errorType = false;
    let errorSize = false;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split("/")[0] != "image") errorType = true;
      if (files[i].size > 10 * 1048576) errorSize = true;
    }
    if (errorType) {
      toast.error("Only images are allowed");
      return;
    }
    if (errorSize) {
      toast.error("File size should not exceed 10 MB");
      return;
    }
    let urls = [...event.images];
    for (let i = 0; i < files.length; i++) {
      let formData = new FormData();
      formData.append("file", files[i]);

      // try {
      //   let res = await uploadFiles(formData, "collectibles", null);
      //   if (!res?.status) {
      //     // toast.error("Error Uploading collectible asset!");
      //     urls = [];
      //     return; // or continue; depending on your needs
      //   }
      //   urls.push(res?.content?.uploadedUrl);
      // } catch (error) {
      //   // Handle error if uploadFiles fails
      //   urls = [];
      //   return;
      // }
    }
    setEvent({ ...event, images: urls });
    //  handleReload();
  };

console.log(data, "Dat........")

  const handleEventInputChange = async (e: any) => {
    let { name, value, checked } = e.target;
    if (name === "image") {
      //todo : handle file upload here
      const files = Array.from(e.target.files);
      handleThumbnail(files);
    }
    if (name === "status") {
      value = checked ? "public" : "private";
    }
    if (name === "startDate" || name === "endDate") {
      setEvent({
        ...event,
        [name]: moment(value, "ddd MMM DD YYYY HH:mm:ss").format("YYYY-MM-DD"),
      });

     
      return;
    }
    setEvent({ ...event, [name]: value });
    // dispatch(setEditEvent({ ...event, [name]: value }));
  };

  // async function saveEventEditChanges() {
  //   const payload = {
  //     ...event,
  //     startDate: moment(event.startDate).format("YYYY-MM-DD"),
  //     endDate: moment(event.endDate).format("YYYY-MM-DD"),
  //   };

  //   if (data?.name === event?.name) delete payload?.name;
  //   if (data?.description === event?.description) delete payload?.description;
  //   if (data?.location === event?.location) delete payload?.location;
  //   if (data?.venue === event?.venue) delete payload?.venue;
  //   if (data?.startDate === event?.startDate) delete payload?.startDate;
  //   if (data?.endDate === event?.endDate) delete payload?.endDate;
  //   // if (data?.tickets?.length > 0) delete payload?.tickets;
  //   // let allTickets = [...data?.tickets, ...event?.tickets];
  //   delete payload?.promote;
  //   delete payload?.user;
  //   delete payload?.eventName;
  //   delete payload?.eventDetails;
  //   delete payload?.ticketDetails;
  //   // payload.tickets = allTickets;

  //   const anyIssue = shouldProceed();
  //   if (anyIssue) return;
  //   setEditEventLoading(true);
  //   const res = await editEventDetails(payload, eventId);
  //   setEditEventLoading(false);
  //   if (res?.status) {
  //     toast.success("Event updated succesfully.");
  //     let response_data = res?.data;
  //     let eventDetail = response_data?.eventData?.map((el: any) => {
  //       let temp: any = {
  //         dayNumber: el?.dayNumber,
  //         date: el?.dateTime,
  //         description: el?.Description,
  //         ...el,
  //       };
  //       let artistData = el?.ArtistDetails?.map((elm: any) => {
  //         return {
  //           ...elm,
  //           description: elm?.description,
  //         };
  //       });
  //       temp.artists = artistData;
  //       return temp;
  //     });
  //     let ticketDetails = response_data?.tickets?.map((el: any) => {
  //       let temp = {
  //         ...el,
  //         ticketName: el?.name,
  //       };
  //       let perks = el?.collectibles?.map((elm: any) => {
  //         let element = {
  //           createdAt: elm?.createdAt,
  //           collectible: elm?.collectible,
  //         };
  //         return element;
  //       });
  //       temp.perks = perks;
  //       return temp;
  //     });

  //     let allData = {
  //       ...response_data,
  //       eventName: response_data?.name,
  //       eventDetails: eventDetail,
  //       ticketDetails: ticketDetails,
  //     };
  //     setData(allData);
  //   } else {
  //     const errorMessage = res?.message?.split(":")[2] || "Some error occured";
  //     toast.error(errorMessage);
  //   }
  //   handleEventEditPopup();
  // }
  const handleAddTickets = () => {
    const temp = {
      ticketName: "",
      description: "",
      image: "",
      issue_qty: 0,
      price: 0,
      max_qty: 1,
      physicalRedeemable: true,
      resale_royality: 0,
      rsvp: false,
      resaleable: false,
      perks: [],
      transferable: false,
    };
    let newTicketDetails = [...event.tickets];
    newTicketDetails.push(temp);
    let newEvent = { ...event, tickets: newTicketDetails };
    // dispatch(setEditEvent(newEvent));
    setEvent(newEvent);
  };
  const shouldProceed = () => {
    toast.dismiss();

    if (event.name === "") {
      return toast.error("Event Name is required");
    }
    if (event.startDate === "") {
      return toast.error("Start Date is required");
    }
    if (event.endDate === "") {
      return toast.error("End Date is required");
    }
    if (event.venue === "") {
      return toast.error("Venue is required");
    }
    if (event.location === "") {
      return toast.error("Location is required");
    }
    if (event.images.length === 0) {
      return toast.error("Thumbnail is required");
    }
    if (event.description === "") {
      return toast.error("Description is required");
    }

    let el = event.tickets;
    for (let i = 0; i < el?.length; i++) {
      if (el[i].ticketName === "") {
        return toast.error("Ticket name is required");
      }
      if (el[i].image === "") {
        return toast.error("Thumbnail is required");
      }
      if (el[i].description === "") {
        return toast.error("Description is required");
      }
      if (el[i].issue_qty === 0) {
        return toast.error("Issue quantity is required");
      }
      if (!el[i]?.rsvp && el[i].price === 0) {
        return toast.error("Ticket price is required");
      }
    }
  };

  return (
    <>
      <Dialog
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        size="lg"
        placeholder=""
        open={show}
        handler={handleEventEditPopup}
        className={`tablet:px-4`}
      >
        <DialogHeader
          placeholder={""}
          className={`px-3 text-base pixel:py-3 tablet:pt-5`}
        >
          Edit Event
        </DialogHeader>
        <DialogBody
          placeholder=""
          className={`my_custom_scrollbar m-0 h-[85vh] w-full overflow-y-scroll p-0 pixel:text-sm `}
        >
          {/* Event details
           */}
          <div>
            <div
              className={`flex w-full flex-col gap-3 rounded-lg p-3`}
            >
              {/* <InputBox
                type="text"
                name={"name"}
                value={event?.name}
                onChange={handleEventInputChange}
                label="Event Name"
              /> */}
              <p>Input Box</p>
              <div className="flex flex-wrap items-center justify-start gap-3 overflow-hidden tablet:justify-between">
                <div
                  className={`flex-col gap-1 text-noble_black-600 pixel:hidden mobile:flex`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-[10px] w-[10px] rounded-full bg-noble_black-600  `}
                    ></div>
                    <p>Start</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-[10px] w-[10px] rounded-full bg-noble_black-600 `}
                    ></div>
                    <p>End</p>
                  </div>
                </div>
                <div
                  className={`flex flex-col gap-1 rounded-md p-2 pixel:w-full mobile:w-fit`}
                >
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2">
                      <div>
                        <Menu
                          open={openStartDate}
                          handler={() => setOpenstartDate(!openStartDate)}
                        >
                          <MenuHandler>
                            {/* <Image
                              width={20}
                              height={20}
                              src={`${activeTheme === "Dark" ? "https://astrix.blob.core.windows.net/cdn/icons/Theme=Dark, Type=Calendar, Selected=Off.svg" : activeTheme === "Light" ? "https://astrix.blob.core.windows.net/cdn/icons/Theme=Light, Type=Calendar, Selected=Off.svg" : "https://astrix.blob.core.windows.net/cdn/icons/Theme=Gradient, Type=Calendar, Selected=Off.svg"}`}
                              alt=""
                              className="cursor-pointer"
                              onClick={() => setOpenstartDate(!openStartDate)}
                            /> */}
                            <p onClick={() => setOpenstartDate(!openStartDate)} >Cal</p>
                          </MenuHandler>
                          <MenuList
                            placeholder={""}
                            className={`custom-z-index border-none `}
                          >
                            <Calendar
                              onChange={(val: any) => {
                                setOpenstartDate(false);
                                handleEventInputChange({
                                  target: {
                                    name: "startDate",
                                    value: val,
                                  },
                                });
                              }}
                              date={
                                event.startDate
                                  ? moment(event.startDate).format("YYYY-MM-DD")
                                  : moment(new Date()).format("YYYY-MM-DD")
                              }
                              min={moment(new Date()).format("YYYY-MM-DD")}
                            />
                          </MenuList>
                        </Menu>
                      </div>
                      <p
                        className="cursor-pointer text-sm"
                        onClick={() => setOpenstartDate(!openStartDate)}
                      >
                        {event.startDate
                          ? moment(
                              moment(event.startDate, "YYYY/MM/DD").toDate()
                            )
                              .format("llll")
                              .split(" ")
                              .slice(0, -2)
                              .join(" ")
                          : "Start Date"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2">
                      <div>
                        <Menu
                          open={openEndDate}
                          handler={() => setOpenEndDate(!openEndDate)}
                        >
                          <MenuHandler>
                            {/* <Image
                              width={20}
                              height={20}
                              src={`${activeTheme === "Dark" ? "https://astrix.blob.core.windows.net/cdn/icons/Theme=Dark, Type=Calendar, Selected=Off.svg" : activeTheme === "Light" ? "https://astrix.blob.core.windows.net/cdn/icons/Theme=Light, Type=Calendar, Selected=Off.svg" : "https://astrix.blob.core.windows.net/cdn/icons/Theme=Gradient, Type=Calendar, Selected=Off.svg"}`}
                              alt=""
                              className="cursor-pointer"
                              onClick={() => setOpenEndDate(!openEndDate)}
                            /> */}
                            <p>Cal</p>
                          </MenuHandler>
                          <MenuList
                            placeholder=""
                            className={`custom-z-index border-none`}
                          >
                            <Calendar
                              onChange={(val: any) => {
                                setOpenEndDate(false);
                                handleEventInputChange({
                                  target: {
                                    name: "endDate",
                                    value: val,
                                  },
                                });
                              }}
                              date={
                                event.endDate
                                  ? moment(event.endDate).format("YYYY-MM-DD")
                                  : moment(new Date()).format("YYYY-MM-DD")
                              }
                              min={moment(event?.startDate).format(
                                "YYYY-MM-DD"
                              )}
                            />
                          </MenuList>
                        </Menu>
                      </div>
                      <p
                        className="cursor-pointer text-sm"
                        onClick={() => setOpenEndDate(!openEndDate)}
                      >
                        {event.endDate
                          ? moment(moment(event.endDate, "YYYY/MM/DD").toDate())
                              .format("llll")
                              .split(" ")
                              .slice(0, -2)
                              .join(" ")
                          : "End Date"}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-3 rounded-md p-2 laptop:h-full`}
                >
                  <div>
                    {/* <Image
                      width={20}
                      height={20}
                      src={`${activeTheme === "Dark" ? "https://astrix.blob.core.windows.net/cdn/icons/Theme=Dark, Type=Globe, Selected=Off.svg" : activeTheme === "Light" ? "https://astrix.blob.core.windows.net/cdn/icons/Theme=Light, Type=Globe, Selected=Off.svg" : "https://astrix.blob.core.windows.net/cdn/icons/Theme=Gradient, Type=Globe, Selected=Off.svg"}`}
                      alt=""
                      className="cursor-pointer"
                    /> */}
                    <p>Cal</p>
                  </div>
                  <p className="text-sm">{"GMT +05:30 Delhi"}</p>
                </div>
              </div>
              <div className="flex gap-5 pixel:flex-col tablet:flex-row">
                <div className="w-full">
                  {/* <InputBox
                    type="text"
                    name={"venue"}
                    value={event?.venue}
                    onChange={handleEventInputChange}
                    label="Venue"
                  /> */}
                  <p>Input Box</p>
                </div>
                <div className="w-full">
                  {/* <InputBox
                    type="text"
                    name={"location"}
                    value={event.location}
                    onChange={handleEventInputChange}
                    label="Location"
                  /> */}
                  <p>Input Box</p>
                </div>
              </div>
              {/* Thumbnail */}
              {/* <InputBox
                type="file"
                id="files"
                htmlFor="files"
                name={"image"}
                accept="image/*"
                value={event?.images?.join(", ")}
                multiple={true}
                onChange={handleEventInputChange}
                label="Upload Thumbnail"
                condition={[
                  "Max file size: 10 MB.",
                  "Recommended aspect ratios:",
                  "16:9 (1920 X 1080)",
                ]}
              /> */}
              <p>Input Box</p>
              {/* <InputBox
                type="text"
                name={"description"}
                isTextArea={false}
                value={event?.description}
                onChange={handleEventInputChange}
                label="Description"
                condition={["Max 300 words."]}
                isEditing={true}
              /> */}
              <p>Input Box</p>
              <div>
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center gap-5">
                    <p
                      className={` font-medium `}
                    >
                      Public
                    </p>
                    <Switch
                      crossOrigin={""}
                      ripple={false}
                      checked={event?.status === "public"}
                      name="status"
                      className={`h-full w-full border bg-transparent  `}
                      // className="h-full w-full border border-noble_black-400 bg-transparent checked:border-noble_black-600 checked:bg-pac_man-200 dark:checked:bg-noble_black-500"
                      containerProps={{
                        className: "w-11 h-6 checked:border-red-500",
                      }}
                      onChange={(e: any) => {
                        handleEventInputChange(e);
                      }}
                      circleProps={{
                        className: `before:hidden left-0.5 border-none `,
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* <div className="mt-2 flex w-full flex-col gap-1">
                <div className="flex items-center gap-5">
                  <p className={`font-medium ${Themes?.editEventPopup?.dialogBody[activeTheme]}`}>RSVP</p>
                  <Switch
                    crossOrigin={""}
                    ripple={false}
                    checked={event?.rsvp}
                    name="rsvp"
                    className={`h-full w-full border ${Themes.editEventPopup.switch[activeTheme]}`}
                    containerProps={{
                      className: "w-11 h-6 checked:border-red-500",
                    }}
                    onChange={(e: any) => {
                      handleEventInputChange(e);
                    }}
                    circleProps={{
                      className: `before:hidden left-0.5 border-none  ${Themes.editEventPopup.switchCircle[activeTheme]} `,
                    }}
                  />
                </div>
                <p className="text-[11px] text-noble_black-400">
                  {"Select only if you want to host a free event."}
                </p>
              </div> */}
            </div>
          </div>
          {/* Add Ticket */}

          {event?.tickets?.map((el: any, i: number) => (
            <div key={i} className="transition-all duration-500">
              {/* <AddTicket el={el} i={i} event={event} setEvent={setEvent} /> */}
              <p>Add Ticket</p>
            </div>
          ))}
          <div>
            <button
              onClick={handleAddTickets}
              className={` mt-3 rounded-full px-3 py-2 font-medium `}
            >
              Add Ticket
            </button>
          </div>
          <DialogFooter placeholder={""}>
            <Button
              placeholder={""}
              variant="text"
              color="red"
              onClick={handleEventEditPopup}
              className={`mr-3 rounded-full px-4  py-2 `}
            >
              <span>Cancel</span>
            </Button>
            <Button
              disabled={editEventLoading}
              placeholder={""}
              className={`rounded-full px-4 py-2 `}
              // onClick={saveEventEditChanges}
            >
              <span>Save</span>
            </Button>
          </DialogFooter>
        </DialogBody>
      </Dialog>
    </>
  );
}
