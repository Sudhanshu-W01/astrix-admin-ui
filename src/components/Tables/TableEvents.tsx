"use client"
import { clearTags } from "@/app/reducers/filterReducers";
import {
  updateBuyers,
  updateEvents,
  updatePosts,
  updateTickets,
  updateUser,
} from "@/app/reducers/tableReducers";
import { RootState } from "@/app/store";
import { BRAND } from "@/types/brand";
import axios from "axios";
import moment from "moment";
import Image from "next/image";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScrollLoader from "../common/infiniteScrollLoader";
import EditEventPopup from "../editEvent/EditEventProps";
import EventModal from "../editEvent/EventModal";

async function downloadTable(label: string) {
  const { data } = await axios.get(
    `https://dash-astrix.azurewebsites.net/events`,
  );


  // Convert JSON to CSV
  const csvRows = [];
  const headers = Object.keys(data?.events[0]);
  csvRows.push(headers.join(",")); // Add headers

  for (const row of data?.events) {
    const values = headers.map((header) => {
      const val = row[header];
      if (Array.isArray(val)) {
        // Join array items with line breaks and wrap the whole cell in quotes
        return `"${val.map((item) => String(item).replace(/"/g, '""')).join("\n")}"`;
      }
      return typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : val;
    });
    csvRows.push(values.join(","));
  }

  const csvData = csvRows.join("\n");

  // Create a Blob from the CSV data
  const blob = new Blob([csvData], { type: "text/csv" });

  // Create a temporary anchor element to trigger the download
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${label}.csv`;
  document.body.appendChild(a);
  a.click();

  // Clean up
  document.body.removeChild(a);
}

const TableEvents = ({
  label,
  data,
  type,
  handleClick,
  selectedRow,
  hasMore,
  fetchPaginated,
  page,
}: {
  label: string;
  data: any;
  type: string;
  hasMore: boolean;
  selectedRow?: any;
  handleClick?: any;
  fetchPaginated?: any;
  page?: number;
}) => {
  const dispatch = useDispatch();
  const [filteredData, setFilteredData] = useState(data)
  const [editEventData, setEditEventData] = useState<any>("")
  const { filterText, tags } = useSelector((state: RootState) => state.filter);
  const [isEditEvent, setIsEditEvent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(page || 1)
  const [editPropModal, setEditPropModal] = useState(false)

  // function showNext(page: number, type: string) {
  //   const newPage = page + 1;
  //   fetchPaginated(newPage, type);
  // }
  // function showPrev(page: number, type: string) {
  //   if (page == 1) {
  //     fetchPaginated(page, type);
  //     return;
  //   }
  //   const newPage = page - 1;
  //   fetchPaginated(newPage, type);
  // }

  const handleDateSortReverse = (date : any) => {
    console.log(date, "date...")
    const sorted = [...filteredData].sort(
      (a, b) => {
        const dateA = date === "startDate" 
          ? Date.parse(a.startDate) 
          : date === "endDate" 
          ? Date.parse(a.endDate) 
          : Date.parse(a.createdAt);
          
        const dateB = date === "startDate" 
          ? Date.parse(b.startDate) 
          : date === "endDate" 
          ? Date.parse(b.endDate) 
          : Date.parse(b.createdAt);
        
        return dateA - dateB;
      });
    setFilteredData(sorted);
  }
  const handleDateSort = (date : any) => {
    const sorted = [...filteredData].sort(
      (a, b) => {
        const dateA = date === "startDate" 
          ? Date.parse(a.startDate) 
          : date === "endDate" 
          ? Date.parse(a.endDate) 
          : Date.parse(a.createdAt);
          
        const dateB = date === "startDate" 
          ? Date.parse(b.startDate) 
          : date === "endDate" 
          ? Date.parse(b.endDate) 
          : Date.parse(b.createdAt);
        
        return dateA - dateB;
      })
      sorted.reverse();
    setFilteredData(sorted);
  }



  useEffect(() => {
    dispatch(clearTags())
  }, [])

  useEffect(() => {
    let updatedData = data;

    // Filter by tags
    if (filterText) {
      if (tags.length > 0) {
        updatedData = data.filter((row: any) =>
          tags.some((key: string) => {
            const value = row[key];
            return (
              value && String(value).toLowerCase().includes(filterText.toLowerCase())
            );
          })
        );
      } else {
        updatedData = data.filter((row: any) =>
          Object.keys(row).some((keys: any) =>{
            const value = row[keys];
            return (
              value && keys!== "avatar" && keys!== "coverImg" && String(value).toLowerCase().includes(filterText.toLowerCase())
            )
          }
          )
        );
      }
    }

    setFilteredData(updatedData);
  }, [filterText, tags, data]);

  const highlightText = (text: string, search: string) => {
    if (!search) return text;
    const parts = text.split(new RegExp(`(${search})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={index} className="bg-yellow-200">{part}</span>
      ) : (
        part
      )
    );
  };

  const fetchMoreData = () => {
    filterText?.length < 1 ? 
    fetchPaginated(currentPage + 1, type)
    : null
  };  

  const handleEditEvent = (index: any) => {
    setEditEventData(filteredData[index])
    setIsModalOpen(true)
  }
console.log(editEventData, "..........")
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 ">
      <h4 className="mb-6 flex items-center justify-between text-xl font-semibold text-black dark:text-white">
        {label ?? "Table One"}
        {filteredData?.length ? (
          <span
            className="cursor-pointer rounded-full border bg-boxdark px-2 py-1 text-sm text-white"
            onClick={() => {
              downloadTable(label);
            }}
          >
            Download
          </span>
        ) : (
          ""
        )}
      </h4>

      {/* {isModalOpen && 
      <EventModal
        eventData={editEventData}
        isOpen={setIsModalOpen}
        setEditEventData={setEditEventData}
      />
      } */}

      <div className="w-full ">
        <div id="table-scrollable" className="flex w-full max-h-[80vh] flex-col my_custom_scrollbar overflow-scroll">
        <InfiniteScroll
          dataLength={filteredData ? filteredData.length : null} 
          next={fetchMoreData} 
          hasMore={hasMore}
          loader={filterText?.length < 1 ? <InfiniteScrollLoader /> : null}
          endMessage={<p className="h-[20vh] flex w-full items-center justify-center">No more data to load.</p>} 
          scrollableTarget="table-scrollable"
        >
          <table className="divide-gray-200 min-w-full divide-y ">
            <thead className="bg-gray-50 ">
              <tr>
                {filteredData &&
                  filteredData[0] != null &&
                  Object.keys(filteredData[0])?.map((key: any, index: number) => (
                    <th
                      key={index}
                      className="text-gray-500 px-6 py-3 text-left  text-xs font-semibold uppercase tracking-wider"
                    >
                      {key === "startDate" ? <span className="flex gap-2">{key}<p onClick={() => handleDateSortReverse(key)}><Image
                                className="rounded-full rotate-180 cursor-pointer"
                                src="/images/icon/icon-arrow-down.svg"
                                alt="avatar"
                                width={16}
                                height={16}
                              /></p><p onClick={() => handleDateSort(key)}><Image
                              className="rounded-full cursor-pointer"
                              src="/images/icon/icon-arrow-down.svg"
                              alt="avatar"
                              width={16}
                              height={16}
                            /></p> </span> : 
                            key === "endDate" ? <span className="flex gap-2">{key}<p onClick={() => handleDateSortReverse(key)}><Image
                                className="rounded-full rotate-180 cursor-pointer"
                                src="/images/icon/icon-arrow-down.svg"
                                alt="arrowUp"
                                width={16}
                                height={16}
                              /></p><p onClick={() => handleDateSort(key)}><Image
                              className="rounded-full cursor-pointer"
                              src="/images/icon/icon-arrow-down.svg"
                              alt="arrowDown"
                              width={16}
                              height={16}
                            /></p> </span> : key === "endDate" ? <span className="flex gap-2">{key}<p onClick={() => handleDateSortReverse(key)}><Image
                            className="rounded-full rotate-180 cursor-pointer"
                            src="/images/icon/icon-arrow-down.svg"
                            alt="arrowUp"
                            width={16}
                            height={16}
                          /></p><p onClick={() => handleDateSort(key)}><Image
                          className="rounded-full cursor-pointer"
                          src="/images/icon/icon-arrow-down.svg"
                          alt="arrowDown"
                          width={16}
                          height={16}
                        /></p> </span> : key === "endDate" ? <span className="flex gap-2">{key}<p onClick={() => handleDateSortReverse(key)}><Image
                        className="rounded-full rotate-180 cursor-pointer"
                        src="/images/icon/icon-arrow-down.svg"
                        alt="arrowUp"
                        width={16}
                        height={16}
                      /></p><p onClick={() => handleDateSort(key)}><Image
                      className="rounded-full cursor-pointer"
                      src="/images/icon/icon-arrow-down.svg"
                      alt="arrowDown"
                      width={16}
                      height={16}
                    /></p> </span> : key === "createdAt" ? <span className="flex gap-2">{key}<p onClick={() => handleDateSortReverse(key)}><Image
                    className="rounded-full rotate-180 cursor-pointer"
                    src="/images/icon/icon-arrow-down.svg"
                    alt="arrowUp"
                    width={16}
                    height={16}
                  /></p><p onClick={() => handleDateSort(key)}><Image
                  className="rounded-full cursor-pointer"
                  src="/images/icon/icon-arrow-down.svg"
                  alt="arrowDown"
                  width={16}
                  height={16}
                /></p> </span> : key}
                    </th>
                  ))}
                {type !== "user" &&
                  label != "Events" &&
                  label != "Collectibles" &&
                  label != "Comments" &&
                  label != "Buyers" &&
                  label != "Tickets" && (
                    <th className="text-gray-500 whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      {"Change Role"}
                    </th>
                  )}
                  <th>Edit</th>
              </tr>
            </thead>
            <tbody className="divide-gray-200 divide-y bg-white">
              {filteredData?.map((item: any, key: number) => {
                const isSelected =
                  selectedRow && selectedRow[label.toLowerCase()] === key;
                return (
                  <tr
                    key={key}
                    className={`cursor-pointer ${isSelected ? "bg-blue-200" : ""} ${
                      key === filteredData?.length
                        ? ""
                        : "border-b border-stroke dark:border-strokedark"
                    }`}
                    onClick={() => {
                      if (
                        type === "event" ||
                        type == "user" ||
                        type === "ticket" ||
                        type === "post" ||
                        type === "collectible" ||
                        type === "buyer"
                      ) {
                        handleClick(key, item, label);
                        if (type === "user") {
                          dispatch(
                            updateUser({ index: key, filteredData: item, label }),
                          );
                        } else if (type == "event") {
                          dispatch(
                            updateEvents({ index: key, filteredData: item, label }),
                          );
                        } else if (type === "ticket") {
                          dispatch(
                            updateTickets({ index: key, filteredData: item, label }),
                          );
                        } else if (type === "collectible") {
                          dispatch(
                            updateBuyers({ index: key, filteredData: item, label }),
                          );
                        } else if (type === "buyer") {
                          dispatch(
                            updateBuyers({ index: key, filteredData: item, label }),
                          );
                        } else if (type === "post") {
                          dispatch(
                            updatePosts({ index: key, filteredData: item, label }),
                          );
                        }
                      }
                    }}
                  >
                    {Object.keys(item)?.map((values: any, ind: number) =>
                        values === "status" ? (
                          <td
                            key={ind}
                            className={`text-gray-900 whitespace-nowrap px-6 py-4 text-sm font-medium ${item[values] === "upcoming" ? "text-orange-500" : item[values] === "ongoing" ? "text-yellow-500" : item[values] === "completed" ? "text-green-500" : "text-black"}`}
                          >
                            {`${item[values]}`}
                          </td>
                        ) : values === "images" ?
                        <td
                            key={ind}
                            className={`text-gray-900 relative h-12 w-32 whitespace-nowrap px-6 py-4 text-sm font-medium`}
                          >
                            {item[values] !== null && <Image
                            className="object-cover"
                            src={item[values]}
                            alt="images"
                            fill
                          />}
                          </td>
                            : values === "startDate" || values === "endDate" || values === "createdAt" ? 
                            <td
                            key={ind}
                            className="text-gray-900 whitespace-nowrap px-6 py-4 text-sm font-medium"
                          >
                            {moment(item[values]).format('lll')}
                          </td>
                            : (
                          <td
                            key={ind}
                            className="text-gray-900 whitespace-nowrap px-6 py-4 text-sm font-medium"
                          >
                            {item[values] === null ? (
                              <span className="text-gray-500"></span>
                            ) : tags.includes(values) ? 
                             highlightText(String(item[values]), filterText)
                             : tags.length < 1 ? 
                             highlightText(String(item[values]), filterText) 
                             :
                             item[values]}
                          </td>
                        )
                      
                    )}
                    <td onClick={(e) => {e.stopPropagation();handleEditEvent(key)}} className="p-2 text-blue-400 cursor-pointer hover:underline">
                      Edit</td>
                  </tr>
                );
              })}
              
            </tbody>
          </table>
          </InfiniteScroll>
        </div>
      </div>
      {/* pagination */}
      {/* <div className=" flex items-center justify-end">
        <div className="mt-3 flex items-center gap-3 p-2">
          <button
            className="rounded-full border px-3 py-1 shadow-lg"
            onClick={() => {
              showPrev(page!, type);
            }}
          >
            Prev
          </button>
          <button
            className="rounded-full border px-3 py-1 shadow-lg"
            onClick={() => {
              showNext(page!, type);
            }}
          >
            Next
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default TableEvents;
