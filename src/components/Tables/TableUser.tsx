"use client";
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
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "../common/Loader";
import InfiniteScrollLoader from "../common/infiniteScrollLoader";
import {
  AllUsers,
  EditReviewStatus,
  EditUsersRole,
  EditViewDocStatus,
} from "@/backendServices";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ViewEventDocument from "../ViewEventDocument";

async function downloadTable(label: string) {
  // Convert JSON to CSV

  const { data } = await axios.get(
    `https://dash-astrix.azurewebsites.net/users`,
  );

  const csvRows = [];
  const headers = Object?.keys(data?.users[0]);
  csvRows.push(headers.join(",")); // Add headers

  for (const row of data?.users) {
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
const RoleDropdown = ({
  user,
  onRoleChange,
}: {
  user: any;
  onRoleChange: any;
}) => {
  const [selectedRole, setSelectedRole] = useState(user?.role);

  const handleChange = async (event: any) => {
    const newRole = event.target.value;
    setSelectedRole(newRole);
    try {
      await axios.put(`/api/users/${user.username}/role`, { role: newRole });
      onRoleChange(user.username, newRole);
    } catch (error) {
      console.error("Failed to update role", error);
    }
  };
  return (
    <div className="mx-auto w-full max-w-xs">
      <select
        id={`role-${user?.username}`}
        name="role"
        value={selectedRole}
        onChange={handleChange}
        className="border-gray-300 mt-1 block w-full rounded-md py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      >
        <option value="organiser">Organiser</option>
        <option value="brand">Brand</option>
        <option value="artist">Artist</option>
        <option value="fan">Fan</option>
      </select>
    </div>
  );
};

const TableUser = ({
  label,
  data,
  setViewDoc,
  type,
  viewDoc,
  handleClick,
  selectedRow,
  hasMore,
  fetchPaginated,
  page,
}: {
  label: string;
  data: any;
  type: string;
  setViewDoc: any;
  viewDoc: any;
  hasMore: boolean;
  selectedRow?: any;
  handleClick?: any;
  fetchPaginated?: any;
  page?: number;
}) => {
  const dispatch = useDispatch();
  const [filteredData, setFilteredData] = useState(data || []);
  const { filterText, tags } = useSelector((state: RootState) => state.filter);
  const [editIndex, setEditIndex] = useState<any>("");
  const [editValue, setEditValue] = useState<any>("");
  const [viewDocument, setViewDocument] = useState<any>(false);
  const [viewRequestedUsers, setViewRequestedUsers] = useState<any>(true);
  const [currentPage, setCurrentPage] = useState(page || 1);
  const [requestedUserId, setRequestedUserId] = useState<any>({});

  const router = useRouter();
  useEffect(() => {
    dispatch(clearTags());
  }, []);

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

  useEffect(() => {
    let updatedData = data;

    // Filter by tags
    if (filterText) {
      if (tags?.length > 0 && filteredData) {
        updatedData = data.filter((row: any) =>
          tags.some((key: string) => {
            const value = row[key];
            return (
              value &&
              String(value).toLowerCase().includes(filterText?.toLowerCase())
            );
          }),
        );
      } else {
        updatedData = data?.filter((row: any) =>
          Object.keys(row).some((keys: any) => {
            const value = row[keys];
            return (
              value &&
              keys !== "avatar" &&
              keys !== "coverImg" &&
              String(value).toLowerCase().includes(filterText?.toLowerCase())
            );
          }),
        );
      }
    }
    setFilteredData(updatedData);
  }, [filterText, tags, data]);

  const fetchMoreData = () => {
    filterText?.length < 1 ? fetchPaginated(currentPage + 1, type) : null;
  };

  const highlightText = (text: string, search: string) => {
    if (!search) return text;
    const parts = text.split(new RegExp(`(${search})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={index} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };
  const handleUpSort = () => {
    const sortedUsers = [...filteredData].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    setFilteredData(sortedUsers);
  };
  const handlednSort = () => {
    const sortedUsers = [...filteredData].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    sortedUsers.reverse();
    setFilteredData(sortedUsers);
  };

  const handleDateSortReverse = (date: any) => {
    console.log(date, "date...");
    const sorted = [...filteredData].sort(
      (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
    );
    setFilteredData(sorted);
  };
  const handleDateSort = (date: any) => {
    const sorted = [...filteredData].sort(
      (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
    );
    sorted.reverse();
    setFilteredData(sorted);
  };

  const handleEditSave = async (index: any) => {
    const data = await EditUsersRole(filteredData[index]?.username, editValue);
    console.log(data, "dat1.........");
    if (data?.status) {
      let updatedData = [...filteredData];

      updatedData[index] = {
        ...updatedData[index],
        role: editValue,
      };
      console.log(updatedData, "up..");
      console.log(updatedData[index], "upIndex..");
      setFilteredData(updatedData);
      setEditIndex("");
      setEditValue("");
    } else {
      console.log(data, "dat.........");
    }
  };

  const handlePendingStatus = async (
    username: any,
    status: string,
    index: any,
  ) => {
    const data = await EditViewDocStatus(username, status);

    if (data?.status) {
      toast.success("Status Updated succesfully");
      const updatedStatus = [...filteredData];
      updatedStatus[index] = {
        ...updatedStatus[index],
        roleChangeStatus: data?.data?.status,
      };
      setFilteredData(updatedStatus);
    } else {
      toast.error("Error Updating Status");
    }
  };

  const handleViewDocStatus = async (
    username: any,
    status: string,
    index: any,
  ) => {
    const data = await EditReviewStatus(username, status);

    if (data?.status) {
      toast.success("Status Updated succesfully");
      const updatedStatus = [...filteredData];
      if (status === "approve") {
        updatedStatus.splice(index, 1);
      } else {
        updatedStatus[index] = {
          ...updatedStatus[index],
          roleChangeStatus: data?.data?.status,
        };
      }
      setFilteredData(updatedStatus);
    } else {
      toast.error("Error Updating Status");
    }
  };

  console.log(filteredData, "filteredData...");

  const handleRequestedUsers = async () => {
    // const data = await fetchRequestedUsers();
    setViewDoc(!viewDoc);
    setViewRequestedUsers(!viewRequestedUsers);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 ">
      <h4 className="mb-6 flex items-center justify-between text-xl font-semibold text-black dark:text-white">
        {label ?? "Table User"}
        <div className="flex gap-2">
          <span
            className="cursor-pointer rounded-full border bg-boxdark px-2 py-1 text-sm text-white"
            onClick={handleRequestedUsers}
          >
            View Requested Users
          </span>
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
        </div>
      </h4>

      {viewDocument && (
        <ViewEventDocument
          isModalOpen={viewDocument}
          setIsModalOpen={setViewDocument}
          userData={requestedUserId}
          handleViewDocStatus={handleViewDocStatus}
        />
      )}
      {viewRequestedUsers ? (
        <div className="w-full">
          <div
            id="table-scrollable"
            className="my_custom_scrollbar flex max-h-[80vh] w-full flex-col overflow-scroll"
          >
            <InfiniteScroll
              dataLength={filteredData?.length > 0 ? filteredData?.length : 0}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={
                filteredData?.length < 1 ? (
                  <p className="flex h-[80vh] items-center justify-center">
                    No data Found
                  </p>
                ) : filteredData?.length < 1 ? (
                  <InfiniteScrollLoader />
                ) : null
              }
              endMessage={
                <p className="flex h-[20vh] w-full items-center justify-center">
                  No more data to load.
                </p>
              }
              scrollableTarget="table-scrollable"
            >
              <table className="divide-gray-200 min-w-full divide-y ">
                <thead className="bg-gray-50 ">
                  <tr>
                    {filteredData?.length > 0 && filteredData != null && (
                      <>
                        <th className="text-gray-500 px-6 py-3 text-left  text-xs font-semibold uppercase tracking-wider">
                          Name
                        </th>
                        <th className="text-gray-500 px-6 py-3 text-left  text-xs font-semibold uppercase tracking-wider">
                          Role
                        </th>
                        {!viewDoc && (
                          <>
                            <th className="text-gray-500 px-6 py-3 text-left  text-xs font-semibold uppercase tracking-wider">
                              Status
                            </th>
                            <th className="text-gray-500 px-6 py-3 text-left  text-xs font-semibold uppercase tracking-wider">
                              View Docs
                            </th>
                          </>
                        )}
                      </>
                    )}
                    {filteredData &&
                      filteredData[0] != null &&
                      Object.keys(filteredData[0])?.map(
                        (key: any, index: number) =>
                          key !== "name" &&
                          key !== "role" &&
                          key !== "roleChangeStatus" ? (
                            <th
                              key={index}
                              className="text-gray-500 px-6 py-3 text-left  text-xs font-semibold uppercase tracking-wider"
                            >
                              {key === "name" ? (
                                <span className="flex gap-2">
                                  {key}
                                  <p onClick={handleUpSort}>
                                    <Image
                                      className="rotate-180 cursor-pointer rounded-full"
                                      src="/images/icon/icon-arrow-down.svg"
                                      alt="avatar"
                                      width={16}
                                      height={16}
                                    />
                                  </p>
                                  <p onClick={handlednSort}>
                                    <Image
                                      className="cursor-pointer rounded-full"
                                      src="/images/icon/icon-arrow-down.svg"
                                      alt="avatar"
                                      width={16}
                                      height={16}
                                    />
                                  </p>{" "}
                                </span>
                              ) : key === "createdAt" ? (
                                <span className="flex gap-2">
                                  {key}
                                  <p onClick={() => handleDateSortReverse(key)}>
                                    <Image
                                      className="rotate-180 cursor-pointer rounded-full"
                                      src="/images/icon/icon-arrow-down.svg"
                                      alt="avatar"
                                      width={16}
                                      height={16}
                                    />
                                  </p>
                                  <p onClick={() => handleDateSort(key)}>
                                    <Image
                                      className="cursor-pointer rounded-full"
                                      src="/images/icon/icon-arrow-down.svg"
                                      alt="avatar"
                                      width={16}
                                      height={16}
                                    />
                                  </p>{" "}
                                </span>
                              ) : (
                                key
                              )}
                            </th>
                          ) : null,
                      )}
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
                    <th className="text-gray-500 whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-gray-200 divide-y bg-white">
                  {filteredData?.length > 0 &&
                    filteredData?.map((item: any, key: number) => {
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
                                  updateUser({
                                    index: key,
                                    filteredData: item,
                                    label,
                                  }),
                                );
                              } else if (type == "event") {
                                dispatch(
                                  updateEvents({
                                    index: key,
                                    filteredData: item,
                                    label,
                                  }),
                                );
                              } else if (type === "ticket") {
                                dispatch(
                                  updateTickets({
                                    index: key,
                                    filteredData: item,
                                    label,
                                  }),
                                );
                              } else if (type === "collectible") {
                                dispatch(
                                  updateBuyers({
                                    index: key,
                                    filteredData: item,
                                    label,
                                  }),
                                );
                              } else if (type === "buyer") {
                                dispatch(
                                  updateBuyers({
                                    index: key,
                                    filteredData: item,
                                    label,
                                  }),
                                );
                              } else if (type === "post") {
                                dispatch(
                                  updatePosts({
                                    index: key,
                                    filteredData: item,
                                    label,
                                  }),
                                );
                              }
                            }
                          }}
                        >
                          <td
                            className={`text-gray-900 relative whitespace-nowrap px-6 text-sm font-medium`}
                          >
                            {highlightText(item?.name, filterText)}
                          </td>
                          <td
                            className={`text-gray-900 relative whitespace-nowrap px-6 text-sm font-medium`}
                          >
                            <span onClick={(e) => e.stopPropagation()}>
                              {
                                <span className="flex justify-between gap-1">
                                  {editIndex === key ? (
                                    <input
                                      className={`mx-2 rounded border-[1px]`}
                                      type="text"
                                      placeholder={item?.role}
                                      onChange={(e) =>
                                        setEditValue(e.target.value)
                                      }
                                      value={editValue}
                                    />
                                  ) : (
                                    <p>
                                      {highlightText(
                                        String(item?.role),
                                        filterText,
                                      )}
                                    </p>
                                  )}

                                  {editIndex === key ? (
                                    <button onClick={() => handleEditSave(key)}>
                                      save
                                    </button>
                                  ) : (
                                    <Image
                                      onClick={() => {
                                        setEditIndex(key);
                                      }}
                                      className="cursor-pointer"
                                      src="/images/icon/pencil-edit.svg"
                                      alt="avatar"
                                      height={16}
                                      width={16}
                                    />
                                  )}
                                </span>
                              }
                            </span>
                          </td>
                          {!viewDoc && (
                            <>
                              <td
                                className={`text-gray-900 relative whitespace-nowrap px-6 text-sm font-medium`}
                              >
                                {item?.roleChangeStatus}
                              </td>
                              <td
                                className={`text-gray-900 relative h-full items-center gap-2 whitespace-nowrap px-6 text-center text-sm font-medium`}
                              >
                                {item?.roleChangeStatus === "pending" && (
                                  <>
                                    <div
                                      onClick={(e) => e.stopPropagation()}
                                      className="flex gap-2"
                                    >
                                      <div className="flex gap-4">
                                        <button
                                          onClick={() =>
                                            item?.roleChangeStatus === "pending"
                                              ? handlePendingStatus(
                                                  item?.username,
                                                  "approve",
                                                  key,
                                                )
                                              : null
                                          }
                                          className={`${item?.roleChangeStatus === "pending" ? "cursor-pointer" : "cursor-default"} text-blue-400 hover:underline`}
                                        >
                                          Approve
                                        </button>
                                        <button
                                          onClick={() =>
                                            item?.roleChangeStatus === "pending"
                                              ? handlePendingStatus(
                                                  item?.username,
                                                  "reject",
                                                  key,
                                                )
                                              : null
                                          }
                                          className={`${item?.roleChangeStatus === "pending" ? "cursor-pointer" : "cursor-default"} text-blue-400 hover:underline`}
                                        >
                                          Reject
                                        </button>
                                      </div>
                                    </div>
                                  </>
                                )}
                                {item?.roleChangeStatus ===
                                  "upload_documents" && (
                                  <div className="relative flex h-full cursor-default items-center justify-center px-1 text-black">
                                    Pending Documentation
                                  </div>
                                )}
                                {item?.roleChangeStatus === "in_review" && (
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setRequestedUserId({
                                          userName: item?.username,
                                          key: key,
                                        });
                                        setViewDocument(true);
                                      }}
                                      className="px-1 text-black hover:underline"
                                    >
                                      View Docs
                                    </button>
                                    <div
                                      onClick={(e) => e.stopPropagation()}
                                      className="flex gap-2"
                                    >
                                      <div className="flex flex-col gap-1">
                                        <button
                                          onClick={() =>
                                            handleViewDocStatus(
                                              item?.username,
                                              "approve",
                                              key,
                                            )
                                          }
                                          className={`${item?.roleChangeStatus === "pending" ? "cursor-pointer" : "cursor-default"} text-blue-400 hover:underline`}
                                        >
                                          Approve
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleViewDocStatus(
                                              item?.username,
                                              "reject",
                                              key,
                                            )
                                          }
                                          className={`${item?.roleChangeStatus === "pending" ? "cursor-pointer" : "cursor-default"} text-blue-400 hover:underline`}
                                        >
                                          Reject
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {item?.roleChangeStatus === "rejected" && (
                                  <div className="cursor-default px-1 text-black">
                                    Rejected
                                  </div>
                                )}
                              </td>
                            </>
                          )}

                          {Object.keys(item)?.map((values: any, ind: number) =>
                            values !== "name" &&
                            values !== "role" &&
                            values !== "roleChangeStatus" ? (
                              <td
                                key={ind}
                                className={`text-gray-900 relative ${values === "avatar" ? "py-0" : "py-4"} whitespace-nowrap px-6 text-sm font-medium`}
                              >
                                {values === "avatar" ? (
                                  <>
                                    {item[values] !== null && (
                                      <Image
                                        className="relative left-[50%] aspect-square translate-x-[-50%] rounded-full object-cover"
                                        src={item[values]}
                                        alt="avatar"
                                        width={38}
                                        height={38}
                                      />
                                    )}
                                  </>
                                ) : values === "coverImg" ? (
                                  <>
                                    {item[values] !== null && (
                                      <Image
                                        className=""
                                        src={item[values]}
                                        alt="avatar"
                                        fill
                                      />
                                    )}
                                  </>
                                ) : values === "createdAt" ? (
                                  moment(item[values]).format("lll")
                                ) : item[values] === null ? (
                                  <span className="text-gray-500"></span>
                                ) : tags.includes(values) ? (
                                  highlightText(
                                    String(item[values]),
                                    filterText,
                                  )
                                ) : tags.length < 1 ? (
                                  highlightText(
                                    String(item[values]),
                                    filterText,
                                  )
                                ) : (
                                  item[values]
                                )}
                              </td>
                            ) : null,
                          )}
                          {/* <td className=" px-4 text-white">
                      <p className="rounded-md bg-slate-500 px-2 py-1">
                        Suspend
                      </p>
                    </td> */}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </InfiniteScroll>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div
            id="table-scrollable"
            className="my_custom_scrollbar flex max-h-[80vh] w-full flex-col overflow-scroll"
          >
            <InfiniteScroll
              dataLength={filteredData?.length > 0 ? filteredData?.length : 0}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={
                !filteredData ? (
                  <p className="flex h-[80vh] items-center justify-center">
                    No data Found
                  </p>
                ) : filteredData?.length < 1 ? (
                  <InfiniteScrollLoader />
                ) : null
              }
              endMessage={
                <p className="flex h-[20vh] w-full items-center justify-center">
                  No more data to load.
                </p>
              }
              scrollableTarget="table-scrollable"
            >
              <table className="divide-gray-200 min-w-full divide-y ">
                <thead className="bg-gray-50 ">
                  <tr>
                    {filteredData && filteredData[0] != null && (
                      <>
                        <th className="text-gray-500 px-6 py-3 text-left  text-xs font-semibold uppercase tracking-wider">
                          Name
                        </th>
                        <th className="text-gray-500 px-6 py-3 text-left  text-xs font-semibold uppercase tracking-wider">
                          Role
                        </th>
                      </>
                    )}
                    {filteredData &&
                      filteredData[0] != null &&
                      Object.keys(filteredData[0])?.map(
                        (key: any, index: number) =>
                          key !== "name" &&
                          key !== "role" &&
                          key !== "viewDocs" &&
                          key !== "status" ? (
                            <th
                              key={index}
                              className="text-gray-500 px-6 py-3 text-left  text-xs font-semibold uppercase tracking-wider"
                            >
                              {key === "name" ? (
                                <span className="flex gap-2">
                                  {key}
                                  <p onClick={handleUpSort}>
                                    <Image
                                      className="rotate-180 cursor-pointer rounded-full"
                                      src="/images/icon/icon-arrow-down.svg"
                                      alt="avatar"
                                      width={16}
                                      height={16}
                                    />
                                  </p>
                                  <p onClick={handlednSort}>
                                    <Image
                                      className="cursor-pointer rounded-full"
                                      src="/images/icon/icon-arrow-down.svg"
                                      alt="avatar"
                                      width={16}
                                      height={16}
                                    />
                                  </p>{" "}
                                </span>
                              ) : key === "createdAt" ? (
                                <span className="flex gap-2">
                                  {key}
                                  <p onClick={() => handleDateSortReverse(key)}>
                                    <Image
                                      className="rotate-180 cursor-pointer rounded-full"
                                      src="/images/icon/icon-arrow-down.svg"
                                      alt="avatar"
                                      width={16}
                                      height={16}
                                    />
                                  </p>
                                  <p onClick={() => handleDateSort(key)}>
                                    <Image
                                      className="cursor-pointer rounded-full"
                                      src="/images/icon/icon-arrow-down.svg"
                                      alt="avatar"
                                      width={16}
                                      height={16}
                                    />
                                  </p>{" "}
                                </span>
                              ) : (
                                key
                              )}
                            </th>
                          ) : null,
                      )}
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
                    <th className="text-gray-500 whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-gray-200 divide-y bg-white">
                  {filteredData?.length > 0 &&
                    filteredData?.map((item: any, key: number) => {
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
                                  updateUser({
                                    index: key,
                                    filteredData: item,
                                    label,
                                  }),
                                );
                              } else if (type == "event") {
                                dispatch(
                                  updateEvents({
                                    index: key,
                                    filteredData: item,
                                    label,
                                  }),
                                );
                              } else if (type === "ticket") {
                                dispatch(
                                  updateTickets({
                                    index: key,
                                    filteredData: item,
                                    label,
                                  }),
                                );
                              } else if (type === "collectible") {
                                dispatch(
                                  updateBuyers({
                                    index: key,
                                    filteredData: item,
                                    label,
                                  }),
                                );
                              } else if (type === "buyer") {
                                dispatch(
                                  updateBuyers({
                                    index: key,
                                    filteredData: item,
                                    label,
                                  }),
                                );
                              } else if (type === "post") {
                                dispatch(
                                  updatePosts({
                                    index: key,
                                    filteredData: item,
                                    label,
                                  }),
                                );
                              }
                            }
                          }}
                        >
                          <td
                            className={`text-gray-900 relative whitespace-nowrap px-6 text-sm font-medium`}
                          >
                            {item?.name}
                          </td>
                          <td
                            className={`text-gray-900 relative whitespace-nowrap px-6 text-sm font-medium`}
                          >
                            <span onClick={(e) => e.stopPropagation()}>
                              {
                                <span className="flex justify-between gap-1">
                                  {editIndex === key ? (
                                    <input
                                      className={`mx-2 rounded border-[1px]`}
                                      type="text"
                                      placeholder={item?.role}
                                      onChange={(e) =>
                                        setEditValue(e.target.value)
                                      }
                                      value={editValue}
                                    />
                                  ) : (
                                    <p>
                                      {highlightText(
                                        String(item?.role),
                                        filterText,
                                      )}
                                    </p>
                                  )}

                                  {editIndex === key ? (
                                    <button onClick={() => handleEditSave(key)}>
                                      save
                                    </button>
                                  ) : (
                                    <Image
                                      onClick={() => {
                                        setEditIndex(key);
                                      }}
                                      className="cursor-pointer"
                                      src="/images/icon/pencil-edit.svg"
                                      alt="avatar"
                                      height={16}
                                      width={16}
                                    />
                                  )}
                                </span>
                              }
                            </span>
                          </td>

                          {Object.keys(item)?.map((values: any, ind: number) =>
                            values !== "name" && values !== "role" ? (
                              <td
                                key={ind}
                                className={`text-gray-900 relative ${values === "avatar" ? "py-0" : "py-4"} whitespace-nowrap px-6 text-sm font-medium`}
                              >
                                {values === "avatar" ? (
                                  <>
                                    {item[values] !== null && (
                                      <Image
                                        className="relative left-[50%] aspect-square translate-x-[-50%] rounded-full object-cover"
                                        src={item[values]}
                                        alt="avatar"
                                        width={38}
                                        height={38}
                                      />
                                    )}
                                  </>
                                ) : values === "coverImg" ? (
                                  <>
                                    {item[values] !== null && (
                                      <Image
                                        className=""
                                        src={item[values]}
                                        alt="avatar"
                                        fill
                                      />
                                    )}
                                  </>
                                ) : values === "createdAt" ? (
                                  moment(item[values]).format("lll")
                                ) : item[values] === null ? (
                                  <span className="text-gray-500"></span>
                                ) : tags.includes(values) ? (
                                  highlightText(
                                    String(item[values]),
                                    filterText,
                                  )
                                ) : tags.length < 1 ? (
                                  highlightText(
                                    String(item[values]),
                                    filterText,
                                  )
                                ) : (
                                  item[values]
                                )}
                              </td>
                            ) : null,
                          )}
                          {/* <td className=" px-4 text-white">
                    <p className="rounded-md bg-slate-500 px-2 py-1">
                      Suspend
                    </p>
                  </td> */}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </InfiniteScroll>
          </div>
        </div>
      )}
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

export default TableUser;
