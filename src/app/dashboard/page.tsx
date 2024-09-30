"use client"
import { dashboardData } from "@/backendServices";
import AlgorantsChart from "@/components/Charts/AlgorantsChart";
import CollectiblesChart from "@/components/Charts/CollectiblesChart";
import DemographicsChart from "@/components/Charts/DemographicsChart";
import EventsChart from "@/components/Charts/EventsChart";
import GenderChart from "@/components/Charts/GenderChart";
import UsersChart from "@/components/Charts/UserCharts";
import UserTypeChart from "@/components/Charts/UserTypeChart";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [data, setData] = useState<any>({})

  useEffect(() => {
    fetchData()
  }, [])
  console.log(data, "d............")

  const fetchData = async () => {

    try {
      const dashData = await dashboardData()
      if(dashData?.status){
        setData(dashData?.data)
      } else {
        alert("Error fetching data")
      }
      return data;
    } catch (err: any) {
      return err;
    }
    
  }
  return (
    <DefaultLayout>
    <div className="p-4">
      {/* Header Section */}
      <div className="bg-gray-200 w-full text-center p-4">
        <h1 className="text-2xl font-bold">Admin Overview</h1>
      </div>
      <div className="w-full h-[45vh] mb-6">
        <AlgorantsChart dataAlgorant={data?.algorant}/>
      </div>
      {/* Main Grid Layout */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {/* Top Row Components */}
        <UsersChart dataUsers={data?.users} />
        <EventsChart dataEvent={data?.events}/>
        <CollectiblesChart dataCollectibles={data?.collectibles}/>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {/* Bottom Row Components */}
        
        <DemographicsChart dataDemographic={data?.demographics} />
        <GenderChart dataGender={data?.gender}/>
        {/* <UserTypeChart dataUserType={data?.userType}/> */}
      </div>
    </div>
    </DefaultLayout>
  );
};

export default Dashboard;
