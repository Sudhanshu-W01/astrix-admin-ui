import TableOne from "@/components/Tables/TableOne";

export const renderNoDataMessage = (message: string) => (
  <div className="mt-2 flex items-center justify-center">
    <p className="mt-2 w-fit rounded-full bg-danger px-3 py-1 text-sm text-white">
      {message}
    </p>
  </div>
);


