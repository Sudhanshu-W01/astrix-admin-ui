import axios from "axios";
import toast from "react-hot-toast";
const DASHBOARD_API = process.env.NEXT_PUBLIC_BACKEND_URL;


export const dashboardData = async () => {
  try {
    const { data } = await axios.get(
      `${DASHBOARD_API}/combineddata`,
    );
    return data;
  } catch (error) {
    toast.error("Error Fetching Data")
  }
  
};

export const AllUsers = async (page: number = 1, items: number = 5000, viewEventDoc: any = true) => {
  console.log(viewEventDoc, "--------------")
  try {
    const { data } = await axios.get(
      `${DASHBOARD_API}/${viewEventDoc ? "users": "rolechange"}?page=${page}&items=${items}`,
      {headers : {"ngrok-skip-browser-warning": "69420",}}
    );
    return data.users;
  } catch (error) {
    toast.error("Error Fetching Data")
    // return error;
  }
  
};
// export const fetchRequestedUsers = async (page: number = 1, items: number = 5000) => {
//   try {
//     const { data } = await axios.get(
//       `${DASHBOARD_API}/rolechange?page=${page}&items=${items}`,
//       {headers : {"ngrok-skip-browser-warning": "69420",}}
//     );
//     return data.users;
//   } catch (error) {
//     toast.error("Error Fetching Data")
//     // return error;
//   }
  
// };

export const AllCollectibles = async (page: number = 1, items: number = 10) => {
  try {
    const { data } = await axios.get(
      `${DASHBOARD_API}/collectible?page=${page}&items=${items}`,
    );
    return data.collectibles;
  } catch (error) {
    toast.error("Error Fetching Data")
    // return error;
  }
  
};

export const AllEvents = async (page: number = 1, items: number = 10) => {
  try {
    const { data } = await axios.get(
      `${DASHBOARD_API}/events?page=${page}&items=${items}`,
      {headers : {"ngrok-skip-browser-warning": "69420",}}
    );
    return data.events;
  } catch (error) {
    toast.error("Error Fetching Data")
    // return error;
  }
};

export const AllPosts = async (page: number = 1, items: number = 5) => {
  try {
    const { data } = await axios.get(
      `${DASHBOARD_API}/posts?page=${page}&items=${items}`,
    );
    return data.posts;
  } catch (error) {
    toast.error("Error Fetching Data")
    // return error
  }
};

export const EditUsersRole = async (userName: string, role: string) => {
  try {
    const { data } = await axios.patch(
      `${DASHBOARD_API}/user/${userName}`,
      {
        role: role
      }
    );
    return data;
  } catch (error) {
    toast.error("Error Editing User")
    // return error
  }
};
export const EditViewDocStatus = async (userName: string, status: string) => {
  try {
    const { data } = await axios.post(
      `${DASHBOARD_API}/rolechange/approve`,
      
      {
        username: userName,
        status: status === "approve"
      },
      {headers : {"ngrok-skip-browser-warning": "69420",}}
    );
    return data;
  } catch (error) {
    toast.error("Error Updating Status")
    // return error
  }
};

export const EditReviewStatus = async (userName: string, status: string) => {
  try {
    const { data } = await axios.post(
      `${DASHBOARD_API}/rolechange/docs`,
      {
        username: userName,
        status: status === "approve"
      },
      {headers : {"ngrok-skip-browser-warning": "69420",}}
    );
    return data;
  } catch (error) {
    toast.error("Error Updating Status")
    // return error
  }
};

export const getUserDocs = async (userName: string) => {
  try {
    const { data } = await axios.get(
      `${DASHBOARD_API}/rolechange/${userName}`,
      {headers : {"ngrok-skip-browser-warning": "69420",}}
    );
    return data;
  } catch (error) {
    toast.error("Error Updating Status")
    // return error
  }
};


export const EditEventsAndTicketAddition = async (userName: string, eventId: string, payload: any) => {
  try{
  const { data } = await axios.patch(
    `${DASHBOARD_API}/event/${eventId}/${userName}`,
      payload
    ,
    {headers : {"ngrok-skip-browser-warning": "69420",}}
  );
  return data;
}
catch(err) {
  // toast.error("Error Fetching Data")
return err
}
  
};

export const getEventTickets = async (
  eventId: string,
  username: string,
  page: number = 1,
  items: number = 10,
) => {
  try {
    const { data } = await axios.get(
      `${DASHBOARD_API}/ticket/${eventId}/${username}?page=${page}&items=${items}`,
    );
    return data?.Tickets;
  } catch (error) {
    toast.error("Error Fetching Data")
    // return error
  }
  
};


export const getTicketsBuyers = async (
  ticketId: string,
  username: string,
  page: number = 1,
  items: number = 10,
) => {

  try {
    const { data } = await axios.get(
      `${DASHBOARD_API}/ticketbuyers/${ticketId}/${username}?page=${page}&items=${items}`,
    );
    return data.ticketBuyers;
  } catch (error) {
    toast.error("Error Fetching Data")
    // return error;
  }
  
};

export const getUserEvents = async (
  username: string,
  page: number = 1,
  items: number = 10,
) => {

  try {
    const { data } = await axios.get(
      `${DASHBOARD_API}/users/events/${username}?page=${page}&items=${items}`,
    );
    return data.usersEvents;
  } catch (error) {
    toast.error("Error Fetching Data")
    // return error 
  }
  
};

export const getUserCollectibles = async (username: string) => {
  try {
    const { data } = await axios.get(
      `${DASHBOARD_API}/users/collectibles/${username}`,
    );
    return data.userCollectibles;
  } catch (error) {
    toast.error("Error Fetching Data")
    // return error
  }
  
};

export const getCollectibleBuyers = async (
  cId: string,
  page: number = 1,
  items: number = 10,
) => {
  try {
    const { data } = await axios.get(
      `${DASHBOARD_API}/collectiblebuyers/${cId}&page=${page}&items=${items}`,
    );
    return data?.collectibleBuyers;
  } catch (error) {
    toast.error("Error Fetching Data")
    // return error
  }
  
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
