import {
  updateBuyers,
  updateEvents,
  updatePosts,
  updateTickets,
  updateUser,
} from "@/app/reducers/tableReducers";
import { BRAND } from "@/types/brand";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { useDispatch } from "react-redux";

function downloadTable(label: string, data: any) {
  // Convert JSON to CSV
  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(",")); // Add headers

  for (const row of data) {
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
const TableOne = ({
  label,
  data,
  type,
  handleClick,
  selectedRow,
  fetchPaginated,
  page,
}: {
  label: string;
  data: any;
  type: string;
  selectedRow?: any;
  handleClick?: any;
  fetchPaginated?: any;
  page?: number;
}) => {
  const dispatch = useDispatch();
  const [users, setusers] = useState(data);
  const handleRoleChange = (username: string, newRole: string) => {
    setusers((prevUsers: any) =>
      prevUsers.map((user: any) =>
        user.username === username ? { ...user, role: newRole } : user,
      ),
    );
  };

  function showNext(page: number, type: string) {
    const newPage = page + 1;
    fetchPaginated(newPage, type);
  }
  function showPrev(page: number, type: string) {
    if (page == 1) {
      fetchPaginated(page, type);
      return;
    }
    const newPage = page - 1;
    fetchPaginated(newPage, type);
  }
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 ">
      <h4 className="mb-6 flex items-center justify-between text-xl font-semibold text-black dark:text-white">
        {label ?? "Table One"}
        {data.length ? (
          <span
            className="cursor-pointer rounded-full border bg-boxdark px-2 py-1 text-sm text-white"
            onClick={() => {
              downloadTable(label, data);
            }}
          >
            Download
          </span>
        ) : (
          ""
        )}
      </h4>

      <div className="w-full ">
        <div className="flex w-full flex-col overflow-scroll">
          <table className="divide-gray-200 min-w-full divide-y ">
            <thead className="bg-gray-50 ">
              <tr>
                {data &&
                  data[0] != null &&
                  Object.keys(data[0])?.map((key: any, index: number) => (
                    <th
                      key={index}
                      className="text-gray-500 px-6 py-3 text-left  text-xs font-semibold uppercase tracking-wider"
                    >
                      {key}
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
              </tr>
            </thead>
            <tbody className="divide-gray-200 divide-y bg-white">
              {data?.map((item: any, key: number) => {
                const isSelected =
                  selectedRow && selectedRow[label.toLowerCase()] === key;
                return (
                  <tr
                    key={key}
                    className={`cursor-pointer ${isSelected ? "bg-blue-200" : ""} ${
                      key === data.length
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
                            updateUser({ index: key, data: item, label }),
                          );
                        } else if (type == "event") {
                          dispatch(
                            updateEvents({ index: key, data: item, label }),
                          );
                        } else if (type === "ticket") {
                          dispatch(
                            updateTickets({ index: key, data: item, label }),
                          );
                        } else if (type === "collectible") {
                          dispatch(
                            updateBuyers({ index: key, data: item, label }),
                          );
                        } else if (type === "buyer") {
                          dispatch(
                            updateBuyers({ index: key, data: item, label }),
                          );
                        } else if (type === "post") {
                          dispatch(
                            updatePosts({ index: key, data: item, label }),
                          );
                        }
                      }
                    }}
                  >
                    {Object.keys(item)?.map((values: any, ind: number) =>
                      label === "Events" ? (
                        values === "status" ? (
                          <td
                            key={ind}
                            className={`text-gray-900 whitespace-nowrap px-6 py-4 text-sm font-medium ${item[values] === "upcoming" ? "text-orange-500" : item[values] === "ongoing" ? "text-yellow-500" : item[values] === "completed" ? "text-green-500" : "text-black"}`}
                          >
                            {`${item[values]}`}
                          </td>
                        ) : (
                          <td
                            key={ind}
                            className="text-gray-900 whitespace-nowrap px-6 py-4 text-sm font-medium"
                          >
                            {`${item[values]}`}
                          </td>
                        )
                      ) : (
                        <td
                          key={ind}
                          className="text-gray-900 whitespace-nowrap px-6 py-4 text-sm font-medium"
                        >
                          {`${item[values]}`}
                        </td>
                      ),
                    )}
                    {type !== "user" &&
                      label != "Events" &&
                      label != "Comments" &&
                      label != "Tickets" &&
                      label != "Buyers" &&
                      label != "Collectibles" && (
                        <td className="text-gray-900 whitespace-nowrap px-6 py-4 text-sm font-medium">
                          <RoleDropdown
                            user={item}
                            onRoleChange={handleRoleChange}
                          />
                        </td>
                      )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* pagination */}
      <div className=" flex items-center justify-end">
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
      </div>
    </div>
  );
};

export default TableOne;
