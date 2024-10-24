import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { getUserDocs } from "@/backendServices";
interface EventModalProps {
  isModalOpen: (state: boolean) => void;
  setIsModalOpen: any;
  userData: any;
  handleViewDocStatus: any;
}

const ViewEventDocument: React.FC<EventModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  userData,
  handleViewDocStatus,
}) => {
  const [docData, setDocData] = useState<any>({});
  // accountType: "current",
  // bankName: "skjdsjadgj ",
  // bankBranch: "jhgjh gjgh",
  // pan: "eilpr1560m",
  // beneficiary: "gjhgjg ghg jgjh g j",
  // accountNumber: "9868236946329468",
  // ifsc: "gdjsgfjdsgf",
  // gst: "736826487264873",
  // companyName: "khdkhkjshd kjah dkjas",
  // companyAddress: "kdjhkas hdkjsa hd",
  // companyState: "mizoram",
  // documents: [
  //   {
  //     link: "https://astrix.blob.core.windows.net/astrix/rahul/collectibles/6849702f0f45d27eb44d/collectibleCount1.jpeg",
  //     name: "electricity_bill",
  //     type: "gst",
  //   },
  // ],

  useEffect(() => {
    getDocData();
  }, []);

  const getDocData = async () => {
    console.log(userData, "docData");
    const userId = userData?.userName;
    const data = await getUserDocs(userId);
    if (data?.status) {
      setDocData(data?.data);
    } else {
      toast.error("Error Fetching User Docs");
    }
  };

  return (
    <div
      onClick={() => setIsModalOpen(false)}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="bg-gray-800 fixed inset-0 flex items-center justify-center bg-opacity-50">
        <div className="mt-2 flex w-1/2 h-[70vh] flex-col gap-2 overflow-y-scroll my_custom_scrollbar rounded-lg bg-white p-4 px-3 pb-2 ">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Document</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 rounded-md px-2 py-1 font-semibold"
              >
                X
              </button>
            </div>
          </div>
          <div className="mb-3 flex h-full w-full flex-row items-start justify-evenly  gap-4 text-black">
            {/* Left Side Div */}
            <div className="tablet:w-[45%] flex w-full flex-col gap-2">
              <div className="text-xl font-normal">General Details</div>

              <div className="flex w-full items-center justify-between">
                <div className="w-[45%]">
                  <p className="px-1 text-[14px] font-extralight">GSTIN</p>
                  <input
                    className="w-full rounded-xl border p-2 text-sm outline-none"
                    type="number"
                    min="15"
                    max="15"
                    placeholder="GSTIN"
                    name="gst"
                    value={docData?.gst}
                    disabled
                  />
                </div>
                <div className="w-[45%]">
                  <p className="px-1 text-[14px] font-extralight">PAN</p>
                  <input
                    className="w-full rounded-xl border p-2 text-sm outline-none"
                    type="text"
                    placeholder="Pan"
                    name="pan"
                    value={docData?.pan}
                    disabled
                  />
                </div>
              </div>

              <div className="mb-4 w-full">
                <p className="px-1 text-[14px] font-extralight">
                  Registered Company Name/Organiser’s name
                </p>
                <input
                  className="w-full rounded-xl border p-2 text-sm outline-none"
                  type="text"
                  placeholder="Your Company Name Pvt. Ltd. or Your Company Name LLP"
                  name="companyName"
                  value={docData?.companyName}
                  disabled
                />
              </div>

              <div className="mb-4 w-full">
                <p className="px-1 text-[14px] font-extralight">
                  Registered Company Address
                </p>
                <input
                  className="w-full rounded-xl border p-2 text-sm outline-none"
                  type="text"
                  placeholder="Registered Address"
                  name="companyAddress"
                  value={docData?.companyAddress}
                  disabled
                />
              </div>

              <div className="mb-4 w-full">
                <div className="px-1 text-[14px] font-extralight">State/UT</div>
                <div className=" w-full rounded-xl border p-2 text-sm outline-none">
                  {docData?.companyState}
                </div>
              </div>
            </div>

            {/* Right Side Div */}
            <div className="tablet:w-[45%] flex w-full flex-col gap-2">
              <div>
                <div className="text-xl font-normal">Account Details</div>
                <div className="mt-4 w-full">
                  {/* Account Type */}
                  {/* <div className="mb-4 w-full">
                    <p className="mb-2 text-[14px]">Account Type</p>
                    <div className="w-full rounded-xl border p-2 outline-none">
                      {docData?.documents?.type}
                    </div>
                  </div> */}

                  {/* Bank Name and Branch */}
                  <div className="mb-4 flex w-full gap-4">
                    <div className="w-[50%]">
                      <p className="mb-2 text-[14px]">Bank Name</p>
                      <input
                        className="borderp-2 w-full rounded-xl outline-none"
                        type="text"
                        placeholder="Bank Name"
                        name="bankName"
                        value={docData?.bankName}
                        disabled
                      />
                    </div>
                    <div className="w-[50%]">
                      <p className="mb-2 text-[14px]">Bank Branch</p>
                      <input
                        className="w-full rounded-xl border p-2 outline-none"
                        type="text"
                        placeholder="Bank Branch"
                        name="bankBranch"
                        value={docData?.bankBranch}
                        required
                      />
                    </div>
                  </div>

                  {/* Beneficiary Name */}
                  <div className="mb-4 w-full">
                    <p className="mb-2 text-[14px]">Beneficiary Name</p>
                    <input
                      className="w-full rounded-xl border bg-opacity-50 p-2 outline-none"
                      type="text"
                      placeholder="Beneficiary Name"
                      name="beneficiary"
                      value={docData?.beneficiary}
                      required
                    />
                  </div>

                  {/* Account Number */}
                  <div className="mb-4 w-full">
                    <p className="mb-2 text-[14px]">Account Number</p>
                    <input
                      className="w-full rounded-xl border p-2 outline-none"
                      type="number"
                      placeholder="e.g. 424242424242"
                      name="accountNumber"
                      value={docData?.accountNumber}
                      required
                    />
                  </div>

                  {/* IFSC */}
                  <div className="mb-4 w-full">
                    <p className="mb-2 text-[14px]">IFSC</p>
                    <input
                      className="w-full rounded-xl border p-2 outline-none"
                      type="text"
                      placeholder="e.g. SBIN0010101"
                      name="ifsc"
                      value={docData?.ifsc}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            {docData?.documents?.length > 0 && (
              <div className=" rounded-md p-2">
                <p className="mb-2">Your Documents</p>
                <div className="flex items-center gap-2">
                  {docData?.documents?.map((data: any, idx: number) => {
                    return (
                      <div className="aspect-square" key={idx}>
                        <h2 className="text-sm">{data?.name}</h2>
                        <Image
                          src={
                            data?.link ??
                            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                          }
                          alt={data?.name + " image"}
                          className="h-full w-full rounded-md object-cover"
                          height={100}
                          width={100}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center gap-5">
            <button
              onClick={() =>
                handleViewDocStatus(
                  userData?.userId,
                  "approve",
                  userData?.key,
                )
              }
              className={` text-blue-400 hover:underline`}
            >
              Approve
            </button>
            <button
              onClick={() =>
                handleViewDocStatus(userData?.userId, "reject", userData?.key)
              }
              className={` text-blue-400 hover:underline`}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEventDocument;
