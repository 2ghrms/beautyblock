import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "@nextui-org/react";

import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";

function VideosInfo() {
  const [currentItems, setCurrentItems] = useState([]);

  const [postId, setPostId] = useState("");
  const [type, setType] = useState("post");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState([]);

  const [page, setPage] = useState(1);
  const rowsPerPage = 13;

  const pages = useMemo(
    () => Math.ceil(currentItems.length / rowsPerPage),
    [currentItems.length],
  );

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return currentItems.slice(start, end);
  }, [page, currentItems]);

  const getUsers = async () => {
    const itemsQuery = query(
      collection(db, "posts"),
      where("approve", "==", false),
    );
    const querySnapshot = await getDocs(itemsQuery);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCurrentItems(data);
  };

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const milliseconds =
      String(date.getMilliseconds()).padStart(3, "0") + "000";
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  const getPost = async (id) => {
    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setPostId(docSnap.id);
      setContent(data.title);
      setImage(data.thumbnail);
      setFromId(data.userId);
    }
  };

  const approveVideo = async (id) => {
    const docRef = doc(db, "posts", id);
    await updateDoc(docRef, { approve: true });
    setCurrentItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const getSubUserId = async () => {
    const items = query(
      collection(db, "subscriptions"),
      where("channelId", "==", fromId),
    );
    const querySnapshot = await getDocs(items);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setToId(data);
  };

  const createNotification = async (id) => {
    const docRef = doc(db, "notifications", id);
    await setDoc(docRef, {
      content: `Video uploaded from BeautyBlock: ${content}`,
      image: image,
      createdAt: formatDate(new Date()),
      postId: postId,
      fromId: fromId,
      type: type,
    });
  };

  const handleApprove = async (id) => {
    const isConfirmed = window.confirm("승인하시겠습니까?");
    if (isConfirmed) {
      await approveVideo(id);
      await getPost(id);
      await getSubUserId();
      for (let i = 0; i < toId.length; i++) {
        await createNotification(toId[i].userId);
      }
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="mx-auto mt-20 flex max-w-[1260px] flex-col gap-4 p-4">
      <Table
        isStriped
        aria-label="Example static collection table"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
      >
        <TableHeader>
          <TableColumn className="text-center">순서</TableColumn>
          <TableColumn className="text-center">제목</TableColumn>
          <TableColumn className="text-center">작성일</TableColumn>
          <TableColumn className="text-center">작성자ID</TableColumn>
          <TableColumn className="text-center">카테고리</TableColumn>
          <TableColumn className="text-center">영상링크</TableColumn>
          <TableColumn className="text-center">좋아요</TableColumn>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell className="text-center">
                {index + 1 + (page - 1) * rowsPerPage}
              </TableCell>
              <TableCell className="text-center">{item.title}</TableCell>
              <TableCell className="text-center">{item.createdAt}</TableCell>
              <TableCell className="text-center">{item.userId}</TableCell>
              <TableCell className="text-center">{item.category}</TableCell>
              <TableCell className="text-center">{item.video}</TableCell>
              <TableCell className="text-center">
                <Button color="primary" onClick={() => handleApprove(item.id)}>
                  영상승인
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default VideosInfo;
