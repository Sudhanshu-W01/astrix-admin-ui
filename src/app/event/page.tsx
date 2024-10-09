"use client";
import {
  AllEvents,
  getEventTickets,
  getTicketsBuyers,
} from "@/backendServices";
import Loader from "@/components/common/Loader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableEvents from "@/components/Tables/TableEvents";
import TableOne from "@/components/Tables/TableOne";
import { renderNoDataMessage } from "@/utils/helpers";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface ISelected {
  [key: string]: string;
}

const Event = () => {
  const [loading, setLoading] = useState(false);
  const [buyerLoading, setBuyerLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [userData, setUserData] = useState<any>({});
  const [tickets, setTickets] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [noData, setNoData] = useState(false);
  const [hasEventNext, setHasEventNext] = useState<boolean>(true)
  const [hasNext, setHasNext] = useState<boolean>(true)
  const [page, setPage] = useState({
    event: 1,
    ticket: 1,
    buyers: 1,
  });
  const {
    user,
    events: evntParms,
    buyers: buyersParms,
    tickets: ticketParams,
  } = useSelector((state: any) => state.tableParams);
  const [selectedRow, setSelectedRow] = useState<ISelected>({});

  const fetchData = async (
    fetchFunction: () => Promise<any>,
    setStateFunction: React.Dispatch<React.SetStateAction<any>>,
    setDataFlag = false,
    type: any
  ) => {
    type === "buyer" ? setBuyerLoading(true) : setLoading(true);
    try {
      const data = await fetchFunction();
      console.log(data, "Error fetching data")
      if(type === "event"){
        if(data?.length < 10){
          setHasEventNext(false)
        }
        setStateFunction([...events,...data]);
      }else {
        if(data?.length<10){
          setHasNext(false)
        }
        setStateFunction(data);
      }
      if (setDataFlag) setNoData(!data.length);
    } catch {
      if (setDataFlag) setNoData(true);
    } finally {
      setBuyerLoading(false)
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(AllEvents, setEvents, false, "");
  }, []);

  const handleEventClick = async (key: string, data: any, label: string) => {
    setUserData({ username: data.owner });
    setBuyers([]);
    setSelectedRow({ [label.toLowerCase()]: key });
    await fetchData(
      () => getEventTickets(data?.eventId, data?.owner),
      setTickets,
      true,
      ""
    );
  };

  const handleTicketClick = async (key: string, data: any, label: string) => {
    setSelectedRow({ ...selectedRow, [label.toLowerCase()]: key });
    setUserData({ ...userData, ticketId: data?.ticketId });
    await fetchData(
      () => getTicketsBuyers(data?.ticketId, userData?.username),
      setBuyers,
      true,
      "buyer"
    );
  };

  console.log()
  async function fetchPaginated(newPage: number, type: string) {
    setPage((prev: any) => {
      let newState = { ...prev, [type]: newPage };
      return newState;
    });

    switch (type) {
      case "event":
        setTickets([]);
        setBuyers([]);
        await fetchData(() => AllEvents(newPage), setEvents, true, type);
        break;
      case "ticket":
        setBuyers([]);
        await fetchData(
          () =>getEventTickets(evntParms?.data?.eventId,userData?.username,newPage),
          setTickets,
          true,
          ""
        );
        break;
      case "buyer":
           await fetchData(
             () =>
               getTicketsBuyers(
                 ticketParams?.data?.ticketId,
                 userData?.username,
                 newPage,
               ),
             setBuyers,
             true,
             ""
           );
        break;
      default:
        return;
    }
  }

  return (
    <DefaultLayout>
      {loading ? (
        <Loader />
      ) : (
        <div className="grid">
          <div className="w-full flex flex-col gap-8 overflow-scroll my_custom_scrollbar">
            <TableEvents
              label={"Events"}
              data={events}
              type="event"
              hasMore={hasEventNext}
              selectedRow={selectedRow}
              handleClick={handleEventClick}
              fetchPaginated={fetchPaginated}
              page={page?.event}
            />

            {tickets?.length ? (
              <TableOne
                label={"Tickets"}
                data={tickets?.map((el: any) => {
                  return {
                    name: el?.name,
                    issueQty: el?.issueQty,
                    soldQty: el?.issueQty - el?.availableQty,
                    availableQty: el?.availableQty,
                    maxQty: el?.maxQty,
                    ...el
                  }
                })}
                type="ticket"
                handleClick={handleTicketClick}
                selectedRow={selectedRow}
                hasMore={hasNext}
                fetchPaginated={fetchPaginated}
                page={page?.ticket}
              />
            ) : noData ? (
              renderNoDataMessage("No Tickets Found!")
            ) : null}

            {buyerLoading ? <Loader /> : buyers.length ? (
              <TableOne
                label={"Buyers"}
                data={buyers}
                hasMore={hasNext}
                type="buyer"
                handleClick={(key: string, data: any, label: string) => {
                  setSelectedRow({
                    ...selectedRow,
                    [label.toLowerCase()]: key,
                  });
                }}
                fetchPaginated={fetchPaginated}
                page={page?.buyers}
              />
            ) : noData ? (
              renderNoDataMessage("No Buyers Found!")
            ) : null}
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default Event;
