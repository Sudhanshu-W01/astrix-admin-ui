"use client";
import {
  AllCollectibles,
  AllUsers,
  getCollectibleBuyers,
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

const Collectibles = () => {
  const [loading, setLoading] = useState(false);
  const [collectibles, setCollectibles] = useState([]);
  const [noData, setNoData] = useState(false);
  const [collectibleBuyers, setCollectibleBuyers] = useState([]);
  const [selectedRow, setSelectedRow] = useState<ISelected>({});
  const [page, setPage] = useState({
    collectibles: 1,
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
        await fetchData(() => AllCollectibles(newPage), setCollectibles, true);
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
          <div className="w-full overflow-scroll">
            <TableOne
              label={"Collectibles"}
              data={collectibles}
              type="collectible"
              page={page?.collectibles}
              fetchPaginated={fetchPaginated}
              selectedRow={selectedRow}
              handleClick={handleCollectibleClick}
            />
            {collectibleBuyers.length ? (
              <TableOne
                label={"Buyers"}
                data={collectibleBuyers}
                type="buyer"
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
