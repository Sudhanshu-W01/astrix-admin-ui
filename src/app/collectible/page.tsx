"use client";
import {
  AllCollectibles,
  AllUsers,
  getCollectibleBuyers,
} from "@/backendServices";
import Loader from "@/components/common/Loader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableCollectibles from "@/components/Tables/TableCollectibles";
import TableOne from "@/components/Tables/TableOne";
import { renderNoDataMessage } from "@/utils/helpers";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface ISelected {
  [key: string]: string;
}

const Collectibles = () => {
  const [loading, setLoading] = useState(false);
  const [collectibles, setCollectibles] = useState([]);
  const [noData, setNoData] = useState(false);
  const [collectibleBuyers, setCollectibleBuyers] = useState([]);
  const [selectedRow, setSelectedRow] = useState<ISelected>({});
  const [hasNext, setHasNext] = useState<boolean>(true)
  const [hasCollectibleNext, setHasCollectibleNext] = useState<boolean>(true)
  const [page, setPage] = useState({
    collectible: 1,
    buyers: 1,
  });
  const {
    user,
    events: evntParams,
    buyers: buyersParams,
    tickets: ticketParams,
  } = useSelector((state: any) => state.tableParams);


  const fetchData = async (
    fetchFunction: () => Promise<any>,
    setStateFunction: React.Dispatch<React.SetStateAction<any>>,
    setDataFlag = false,
    type?: any
  ) => {
    setLoading(true);
    try {
      const data = await fetchFunction();
      if(type === "collectible"){
         if(data?.length < 10){
          setHasCollectibleNext(false)
         }
        setStateFunction([...collectibles,...data]);
      } else {
        if(data?.length < 10){
          setHasNext(false)
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

  const handleCollectibleClick = async (
    key: string,
    data: any,
    label: string,
  ) => {
    setSelectedRow({ ...selectedRow, [label.toLowerCase()]: key });
    setCollectibleBuyers([]);
    await fetchData(
      () => getCollectibleBuyers(data?.cId),
      setCollectibleBuyers,
      true,
    );
  };
  useEffect(() => {
    fetchData(AllCollectibles, setCollectibles);
  }, []);

  async function fetchPaginated(newPage: number, type: string) {
    setPage((prev: any) => {
      let newState = { ...prev, [type]: newPage };
      return newState;
    });
    switch (type) {
      case "collectible":
        setCollectibleBuyers([]);
        await fetchData(() => AllCollectibles(newPage), setCollectibles, true, type);
        break;
      case "buyer":
        await fetchData(
          () => getCollectibleBuyers(buyersParams?.data?.cId, newPage),
          setCollectibleBuyers,
          true,
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
          <div className="w-full overflow-scroll my_custom_scrollbar">
            <TableCollectibles
              label={"Collectibles"}
              data={collectibles}
              type="collectible"
              hasMore={hasCollectibleNext}
              page={page?.collectible}
              fetchPaginated={fetchPaginated}
              selectedRow={selectedRow}
              handleClick={handleCollectibleClick}
            />
            {collectibleBuyers.length ? (
              <TableOne
                label={"Buyers"}
                data={collectibleBuyers}
                type="buyer"
                hasMore={hasNext}
                fetchPaginated={fetchPaginated}
                page={page?.buyers}
              />
            ) : noData ? (
              renderNoDataMessage("No Buyers Found!")
            ) : null}
          </div>
        </div>
      )}
      {/* <div></div> */}
    </DefaultLayout>
  );
};

export default Collectibles;
