import { useState, useEffect } from "react";

export const DetailsTable = ({ data, selectedKey }:any) => {
  const [selectedNestedDetails, setSelectedNestedDetails] = useState({
    key: "",
    array: null,
  });

  useEffect(() => {
    setSelectedNestedDetails({ key: "", array: null });
  }, [data]);

  if (data.length === 0) {
    return null;
  }

  const headers = Object.keys(data[0]);

  const handleNestedArrayClick = (key:any, array:any) => {
    setSelectedNestedDetails({ key, array });
  };

  return (
    <div className="overflow-x-scroll rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h2 className="my-3 mb-6 text-xl  font-semibold text-black dark:text-white">
        {selectedKey}
      </h2>
      <table className="divide-gray-200 min-w-full divide-y">
        <thead className="bg-gray-50">
          <tr className="text-gray-500 px-6 py-3 text-left  text-xs font-semibold uppercase tracking-wider">
            {headers.map((header, index) => (
              <th
                className="text-gray-500 px-6 py-3 text-left  text-xs font-semibold uppercase tracking-wider"
                key={index}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-gray-200 divide-y bg-white">
          {data.map((item: any, index: number) => (
            <tr
              className="text-gray-500 cursor-pointer px-6 py-3 text-left  text-xs font-semibold  tracking-wider"
              key={index}
            >
              {headers.map((header, subIndex) => (
                <td
                  className="text-gray-900 whitespace-nowrap px-6 py-4 text-sm font-medium"
                  key={subIndex}
                  onClick={() => handleNestedArrayClick(header, item[header])}
                >
                  {Array.isArray(item[header])
                    ? `View ${header}`
                    : item[header].toString()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {selectedNestedDetails.array && (
        <div>
          <DetailsTable
            data={selectedNestedDetails.array}
            selectedKey={selectedNestedDetails.key}
          />
        </div>
      )}
    </div>
  );
};
