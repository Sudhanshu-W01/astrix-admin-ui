import axios from "axios";
const DASHBOARD_API = "https://dash-astrix.azurewebsites.net";

export const dashboardData = async () => {
  const { data } = await axios.get(
    `${DASHBOARD_API}/combineddata`,
  );
  return data;
};

export const AllUsers = async (page: number = 1, items: number = 10) => {
  const { data } = await axios.get(
    `${DASHBOARD_API}/users?page=${page}&items=${items}`,
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
  );
  return data.events;
};

export const AllPosts = async (page: number = 1, items: number = 5) => {
  const { data } = await axios.get(
    `${DASHBOARD_API}/posts?page=${page}&items=${items}`,
  );
  return data.posts;
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
