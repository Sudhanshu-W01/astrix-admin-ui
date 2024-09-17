"use client";
import {
  AllEvents,
  getEventTickets,
  getTicketsBuyers,
} from "@/backendServices";
import Loader from "@/components/common/Loader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableOne from "@/components/Tables/TableOne";
import { renderNoDataMessage } from "@/utils/helpers";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface ISelected {
  [key: string]: string;
}

const Event = () => {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [userData, setUserData] = useState<any>({});
  const [tickets, setTickets] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [noData, setNoData] = useState(false);
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
  ) => {
    setLoading(true);
    try {
      const data = await fetchFunction();
      setStateFunction(data);
      if (setDataFlag) setNoData(!data.length);
    } catch {
      if (setDataFlag) setNoData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(AllEvents, setEvents);
  }, []);

  const handleEventClick = async (key: string, data: any, label: string) => {
    setUserData({ username: data.owner });
    setBuyers([]);
    setSelectedRow({ [label.toLowerCase()]: key });
    await fetchData(
      () => getEventTickets(data?.eventId, data?.owner),
      setTickets,
      true,
    );
  };

  const handleTicketClick = async (key: string, data: any, label: string) => {
    setSelectedRow({ ...selectedRow, [label.toLowerCase()]: key });
    setUserData({ ...userData, ticketId: data?.ticketId });
    await fetchData(
      () => getTicketsBuyers(data?.ticketId, userData?.username),
      setBuyers,
      true,
    );
  };

  async function fetchPaginated(newPage: number, type: string) {
    setPage((prev: any) => {
      let newState = { ...prev, [type]: newPage };
      return newState;
    });

    switch (type) {
      case "event":
        setTickets([]);
        setBuyers([]);
        await fetchData(() => AllEvents(newPage), setEvents, true);
        break;
      case "ticket":
        setBuyers([]);
        await fetchData(
          () =>getEventTickets(evntParms?.data?.eventId,userData?.username,newPage,),
          setTickets,
          true,
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
          <div className="w-full overflow-scroll">
            <TableOne
              label={"Events"}
              data={events}
              type="event"
              selectedRow={selectedRow}
              handleClick={handleEventClick}
              fetchPaginated={fetchPaginated}
              page={page?.event}
            />

            {tickets.length ? (
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
                fetchPaginated={fetchPaginated}
                page={page?.ticket}
              />
            ) : noData ? (
              renderNoDataMessage("No Tickets Found!")
            ) : null}

            {buyers.length ? (
              <TableOne
                label={"Buyers"}
                data={buyers}
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
