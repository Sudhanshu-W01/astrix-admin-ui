"use client";
import { AllPosts, getUserCommentOnPost } from "@/backendServices";
import Loader from "@/components/common/Loader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableOne from "@/components/Tables/TableOne";
import TablePosts from "@/components/Tables/TablePosts";
import { renderNoDataMessage } from "@/utils/helpers";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
interface ISelected {
  [key: string]: string;
}

const Post = () => {
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [posts, setPosts] = useState<any>(false);
  const [helperData, setHelperData] = useState<any>();
  const [postComments, setPostComments] = useState([]);
  const [selectedRow, setSelectedRow] = useState<ISelected>({});
  const [hasNext, setHasNext] = useState<boolean>(true)
  const [page, setPage] = useState({
    post: 1,
    commentUser: 1,
  });
  const { posts: postParams } = useSelector((state: any) => state.tableParams);
  const fetchData = async (
    fetchFunction: () => Promise<any>,
    setStateFunction: React.Dispatch<React.SetStateAction<any>>,
    setDataFlag = false,
    type?:any
  ) => {
    setLoading(true);
    try {
      const data = await fetchFunction();
      if(type === "post"){
        if(data?.length < 5) {
          setHasNext(false)
        }
        setStateFunction([...posts,...data]);
      }else {
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
    fetchData(AllPosts, setPosts);
  }, []);

  const handlePostClick = async (index: any, data: any, label: String) => {
    setSelectedRow({ [label.toLowerCase()]: index });
    setPostComments([]);
    setHelperData({ owner: data?.owner });
    await fetchData(
      () => getUserCommentOnPost(data?.postId, data?.owner),
      setPostComments,
      true,
    );
  };
  async function fetchPaginated(newPage: number, type: string) {
    setPage((prev: any) => {
      let newState = { ...prev, [type]: newPage };
      return newState;
    });
    switch (type) {
      case "post":
        setPostComments([]);
        setPage((prev: any) => {
          let newState = { ...prev, commentUser: 1 };
          return newState;
        });
        await fetchData(() => AllPosts(newPage), setPosts, true, type);
        break;
      case "commentUser":
        await fetchData(
          () =>
            getUserCommentOnPost(
              postParams?.data?.postId,
              helperData?.owner,
              newPage,
            ),
          setPostComments,
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
            {posts && posts?.length ? (
              <TablePosts
                label={"Posts"}
                data={posts}
                type="post"
                hasMore={hasNext}
                selectedRow={selectedRow}
                handleClick={(index: any, data: any, label: string) =>
                  handlePostClick(index, data, label)
                }
                page={page?.post}
                fetchPaginated={fetchPaginated}
              />
            ) : (
              ""
            )}

            {postComments?.length > 0 ? (
              <TableOne
                label={"Comments"}
                data={postComments}
                type="commentUser"
                selectedRow={selectedRow}
                page={page?.commentUser}
                fetchPaginated={fetchPaginated}
              />
            ) : noData ? (
              renderNoDataMessage("No Comments Found!")
            ) : null}
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default Post;
