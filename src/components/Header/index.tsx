import Link from "next/link";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownMessage from "./DropdownMessage";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";
import Image from "next/image";
import { useEffect, useState } from "react";
import { addTag, removeTag, setFilterText } from "@/app/reducers/filterReducers";
import { useDispatch } from "react-redux";
import { usePathname } from "next/navigation";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const pathname = usePathname();

  const keyTags: any = {
    "/": [
      "username",
      "name",
      "location",
      "gender",
      "role",
      "dob",
      "email",
      "preferences",
      "socials",
      "phone",
      "description",
      "createdAt",
      "address",
      "isOnboarded",
      "verified",
      "followerCount",
      "followingCount",
    ],
    "/event": [
      "eventId",
      "name",
      "startDate",
      "endDate",
      "venue",
      "location",
      "description",
      "tags",
      "createdAt",
      "commentCount",
      "likeCount",
      "userEngagementCount",
      "status",
      "state",
      "owner",
    ],
    "/collectible": [
      "name",
      "description",
      "issueQty",
      "price",
      "resaleRoyalty",
      "redeemable",
      "transferable",
      "redeemStatus",
      "createdAt",
      "hash",
      "cId",
      "showcase",
      "availableQty",
      "resale",
      "maxQty",
      "freeCollectible",
      "freeze",
    ],
    "/posts": [
      "postId",
      "content",
      "commentCount",
      "likeCount",
      "isDeleted",
      "createdAt",
      "owner",
    ],
  };

  const dispatch = useDispatch();
  const handleAddTag = () => {
    if (selectedTag !== "" && !tags.includes(selectedTag)) {
      setTags((prevTags) => [...prevTags, selectedTag]);
      const updatedTags = [...tags, selectedTag];
      setTags(updatedTags);
      // Dispatch the inputValue as filterText and updatedTags as tags
      updatedTags.forEach((tag) => dispatch(addTag(tag)));
    }
  };

  useEffect(() => {
    dispatch(setFilterText(inputValue));
  }, [inputValue]);

  const handleTagChange = (e: any) => {
    setSelectedTag(e.target.value);
  };

  const handleDeleteTag = (indexToRemove: number) => {
    setTags((prevTags) =>
      prevTags.filter((_, index) => index !== indexToRemove),
    );
    dispatch(removeTag(tags[indexToRemove]))

  };
  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!w-full delay-300"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "delay-400 !w-full"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!w-full delay-500"
                  }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!h-0 !delay-[0]"
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!h-0 !delay-200"
                  }`}
                ></span>
              </span>
            </span>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}

          <Link className="block flex-shrink-0 lg:hidden" href="/">
            <Image
              width={32}
              height={32}
              src={"/images/logo/astrix.png"}
              alt="Logo"
            />
          </Link>
        </div>

        <div className="hidden sm:block">
          <form action="https://formbold.com/s/unique_form_id" method="POST">
            <div className="relative">
              <button className="absolute left-0 top-1/2 -translate-y-1/2">
                <svg
                  className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                    fill=""
                  />
                </svg>
              </button>

              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type to search..."
                className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-125"
              />
            </div>

            <div
              className={`flex ${tags?.length > 0 && "mt-4"} flex-wrap space-x-1`}
            >
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="bg-gray-200 flex items-center space-x-2 rounded-md bg-slate-200 px-2 py-1"
                >
                  <span className="">{tag}</span>
                  <button
                    onClick={() => handleDeleteTag(index)}
                    className="hover:text-red-700 text-rose-400"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </form>
        </div>

        <div className="flex  gap-3 2xsm:gap-7">
          <ul className="flex gap-2 2xsm:gap-4">
            {/* <!-- Dark Mode Toggler --> */}
            <select
              className="border-gray-300 h-fit rounded-md border p-2"
              value={selectedTag}
              onChange={handleTagChange}
            >
              <option value="">Select a tag</option>
              {keyTags[pathname]?.map((tag: any) => {
                return <option value={tag}>{tag}</option>;
              })}
            </select>

            <button
              onClick={handleAddTag}
              className=" h-fit rounded-md bg-blue-500 px-3 py-[7.6px] text-white"
            >
              Add Tag
            </button>
            <DarkModeSwitcher />
            {/* <!-- Dark Mode Toggler --> */}

            {/* <!-- Notification Menu Area --> */}
            {/* <DropdownNotification /> */}
            {/* <!-- Notification Menu Area --> */}

            {/* <!-- Chat Notification Area --> */}
            {/* <DropdownMessage /> */}
            {/* <!-- Chat Notification Area --> */}
          </ul>

          {/* <!-- User Area --> */}
          {/* <DropdownUser /> */}
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
