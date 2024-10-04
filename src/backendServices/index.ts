import axios from "axios";
const DASHBOARD_API = "https://dash-astrix.azurewebsites.net";
// const DASHBOARD_API = "https://965b-2401-4900-8841-3999-7675-ec1-8d87-f2cf.ngrok-free.app";


export const dashboardData = async () => {
  const { data } = await axios.get(
    `${DASHBOARD_API}/combineddata`,
  );
  return data;
};

export const AllUsers = async (page: number = 1, items: number = 5000) => {
  const { data } = await axios.get(
    `${DASHBOARD_API}/users?page=${page}&items=${items}`,
    {headers : {"ngrok-skip-browser-warning": "69420",}}
  );
  return data.users;
};

export const AllCollectibles = async (page: number = 1, items: number = 10) => {
  const { data } = await axios.get(
    `${DASHBOARD_API}/collectible?page=${page}&items=${items}`,
  );
  return data.collectibles;
};

export const AllEvents = async (page: number = 1, items: number = 10) => {
  const { data } = await axios.get(
    `${DASHBOARD_API}/events?page=${page}&items=${items}`,
    {headers : {"ngrok-skip-browser-warning": "69420",}}
  );
  return data.events;
};

export const AllPosts = async (page: number = 1, items: number = 5) => {
  const { data } = await axios.get(
    `${DASHBOARD_API}/posts?page=${page}&items=${items}`,
  );
  return data.posts;
};

export const EditUsersRole = async (userName: string, role: string) => {
  const { data } = await axios.patch(
    `${DASHBOARD_API}/user/${userName}`,
    {
      role: role
    }
  );
  return data;
};

export const EditEventsAndTicketAddition = async (userName: string, eventId: string, ticketData: any[any], eventData: any) => {
  const { data } = await axios.post(
    `${DASHBOARD_API}/event/${eventId}/${userName}`,
    {
      event: eventData,
      tickets: ticketData
    }
  );
  return data;
};

export const getEventTickets = async (
  eventId: string,
  username: string,
  page: number = 1,
  items: number = 10,
) => {
  const { data } = await axios.get(
    `${DASHBOARD_API}/ticket/${eventId}/${username}?page=${page}&items=${items}`,
  );
  return data?.Tickets;
};
export const getTicketsBuyers = async (
  ticketId: string,
  username: string,
  page: number = 1,
  items: number = 10,
) => {
  const { data } = await axios.get(
    `${DASHBOARD_API}/ticketbuyers/${ticketId}/${username}?page=${page}&items=${items}`,
  );
  return data.ticketBuyers;
};

export const getUserEvents = async (
  username: string,
  page: number = 1,
  items: number = 10,
) => {
  const { data } = await axios.get(
    `${DASHBOARD_API}/users/events/${username}?page=${page}&items=${items}`,
  );
  return data.usersEvents;
};

export const getUserCollectibles = async (username: string) => {
  const { data } = await axios.get(
    `${DASHBOARD_API}/users/collectibles/${username}`,
  );
  return data.userCollectibles;
};

export const getCollectibleBuyers = async (
  cId: string,
  page: number = 1,
  items: number = 10,
) => {
  const { data } = await axios.get(
    `${DASHBOARD_API}/collectiblebuyers/${cId}&page=${page}&items=${items}`,
  );
  return data?.collectibleBuyers;
};
// /post/comment/:postId/:username
export const getUserCommentOnPost = async (
  postId: string,
  username: string,
  page: number = 1,
  items: number = 10,
) => {
  const { data } = await axios.get(
    `${DASHBOARD_API}/post/comment/${postId}/${username}?page=${page}&items=${items}`,
  );
  return data?.UserDetails;
};

export const getUserTickets = async (eventId:any, username:any, newPage:any)=>{
  try {
    
  } catch (error:any) {
    throw new Error(error);
  }
}
