import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";

const ExpandCollapse = ({
  open = true,
  value,
  className,
  setOpen,
  title,
}: {
  open: boolean | undefined;
  value: number;
  className: string;
  setOpen: (val: string | number) => void;
  title?: string;
}) => {
  const activeTheme: string = useSelector((state: any) => state.toggler.theme);
  return (
    <div
      onClick={() => setOpen(title != undefined ? title : value)}
      className={`${className} flex cursor-pointer items-center gap-2 rounded-md py-1  transition-all duration-300 hover:rounded-sm  tablet:px-5`}
    >
      <p className={` transition-all  duration-500  `}>
        {open ? "Collapse" : "Expand"}
      </p>
      <div className="w-[20px]">
        <Image
          width={20}
          height={20}
          src={
            activeTheme === "Dark"
              ? "https://astrix.blob.core.windows.net/cdn/icons/Theme=Dark, Type=Dropdown, Selected=Off.svg"
              : activeTheme === "Light"
                ? "https://astrix.blob.core.windows.net/cdn/icons/Theme=Light, Type=Dropdown, Selected=Off.svg"
                : "https://astrix.blob.core.windows.net/cdn/icons/Theme=Gradient, Type=Dropdown, Selected=Off.svg"
          }
          alt=""
          className={`${open ? "rotate-180" : ""} transition-all duration-500`}
        />
      </div>
    </div>
  );
};

export default ExpandCollapse;
