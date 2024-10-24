"use client";
import {
  AllUsers,
  getTicketsBuyers,
  getUserEvents,
  getEventTickets,
} from "@/backendServices";
import Loader from "@/components/common/Loader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableOne from "@/components/Tables/TableOne";
import TableUser from "@/components/Tables/TableUser";
import { renderNoDataMessage } from "@/utils/helpers";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface IUser {
  username: string;
  eventId: string;
}

interface ISelected {
  [key: string]: string;
}

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const {
    user,
    events: evntParms,
    buyers,
    tickets: ticketParams
  } = useSelector((state: any) => state.tableParams);
  const [page, setPage] = useState({
    event: 1,
    ticket: 1,
    buyers: 1,
    user: 1
  });
  const [selectedRow, setSelectedRow] = useState<ISelected>({});
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [ticketBuyers, setTicketBuyers] = useState([]);
  const [noData, setNoData] = useState(false);
  const [hasUserMore, setHasUserMore] = useState<boolean>(true)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [viewEventDoc, setViewEventDoc] = useState<any>(true)
  const [userData, setUserData] = useState<IUser>({
    username: "",
    eventId: "",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await AllUsers(1, 5000, viewEventDoc);
      setUsers(data);
      setLoading(false);
      return data;
    } catch (err: any) {
      setLoading(false);
      return err;
    }
  };

  const fetchData = async (
    fetchFunction: () => Promise<any>,
    setStateFunction: React.Dispatch<React.SetStateAction<any>>,
    setDataFlag = false,
    type?: any
  ) => {
    setLoading(true);
    try {
      const data = await fetchFunction();
      if(type === "user") {
        if(data?.length < 10){
          setHasUserMore(false)
        }
        setStateFunction([...users, ...data]);
      }else {
        if(data?.length < 10){
          setHasMore(false)
        }
        setStateFunction(data);
      }
      if (setDataFlag) setNoData(!data.length);
    } catch {
      if (setDataFlag) setNoData(true);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, [viewEventDoc]);
  

  const handleUserClick = async (
    index: any,
    data: any,
    label: string,
    page: number,
  ) => {
    setSelectedRow({ [label.toLowerCase()]: index });
    setUserData({ username: data.username, eventId: "" });
    setEvents([]);
    setTicketBuyers([]);
    setTickets([]);
    await fetchData(() => getUserEvents(data.username, page), setEvents, true);
  };

  const handleEventClick = async (index: any, data: any, label: string) => {
    setSelectedRow((prev: any) => {
      let obj = { ...prev, [label.toLowerCase()]: index };
      delete obj.tickets;
      return obj;
    });
    setUserData((prev: any) => {
      return { ...prev, eventId: data?.eventId };
    });
    setTicketBuyers([]);
    setTickets([]);
    await fetchData(
      () => getEventTickets(data?.eventId, userData?.username),
      setTickets,
      true,
    );
  };
  const handleTicketClick = async (index: any, data: any, label: string) => {
    setTicketBuyers([]);
    setSelectedRow((prev: any) => {
      let obj = { ...prev, [label.toLowerCase()]: index };
      return obj;
    });
    await fetchData(
      () => getTicketsBuyers(data?.ticketId, userData?.username),
      setTicketBuyers,
      true,
    );
  };

  async function fetchPaginated(newPage: number, type: string) {
    setPage((prev: any) => {
      let newState = { ...prev, [type]: newPage };
      return newState;
    });
    switch (type) {
      case "user":
        await fetchData(() => AllUsers(newPage, 10, viewEventDoc), setUsers, true, type);
        setTicketBuyers([]);
        setEvents([]);
        setTicketBuyers([]);
        break;
      case "event":
        setTicketBuyers([]);
        setTickets([]);
        await fetchData(
          () => getUserEvents(userData.username, newPage),
          setEvents,
          true,
          type
        );
        break;
      case "ticket":
        setTicketBuyers([]);
        await fetchData(
          () => getEventTickets(userData?.eventId, userData?.username, newPage),
          setTickets,
          true,
          type
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
          setTicketBuyers,
          true,
          type
        );
        break;
    }
  }


  return (
    <DefaultLayout>
      {loading ? (
        <Loader />
      ) : (
        <div className="grid">
          <div className="w-full overflow-scroll my_custom_scrollbar ">
            <TableUser
              label={"Users"}
              data={users}
              type="user"
              viewDoc={viewEventDoc}
              setViewDoc={setViewEventDoc}
              hasMore={hasUserMore}
              fetchPaginated={fetchPaginated}
              page={page?.user}
              selectedRow={selectedRow}
              handleClick={(
                index: any,
                data: any,
                label: string,
                page: number,
              ) => handleUserClick(index, data, label, page)}
            />

            {events?.length ? (
              <TableOne
                label={"Events"}
                data={events}
                fetchPaginated={fetchPaginated}
                page={page.event}
                hasMore={hasMore}
                type="event"
                selectedRow={selectedRow}
                handleClick={(index: any, data: any, label: string) =>
                  handleEventClick(index, data, label)
                }
              />
            ) : noData ? (
              renderNoDataMessage("No Events Found!")
            ) : null}

            {tickets.length ? (
              <TableOne
                label={"Tickets"}
                data={tickets}
                type="ticket"
                hasMore={hasMore}
                fetchPaginated={fetchPaginated}
                page={page?.ticket}
                selectedRow={selectedRow}
                handleClick={handleTicketClick}
              />
            ) : noData ? (
              renderNoDataMessage("No Tickets Found!")
            ) : null}

            {ticketBuyers.length ? (
              <TableOne
                label={"Buyers"}
                data={ticketBuyers}
                type="buyer"
                hasMore={hasMore}
                fetchPaginated={fetchPaginated}
                page={page?.buyers}
                selectedRow={selectedRow}
                handleClick={() => {}}
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

export default Home;
