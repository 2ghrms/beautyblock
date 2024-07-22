import React, { useEffect, useMemo, useState } from "react";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Select,
  SelectItem,
} from "@nextui-org/react";

import { db } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

function UsersInfo() {
  const [currentItems, setCurrentItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("전체");

  const [page, setPage] = useState(1);
  const rowsPerPage = 13;

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems]);

  const getUsers = async () => {
    const items = query(collection(db, "users"));
    const querySnapshot = await getDocs(items);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCurrentItems(data);
    setFilteredItems(data);
  };

  const FilteringItems = async () => {
    if (selectedCountry.currentKey == "전체") {
      setFilteredItems(currentItems);
    } else {
      const items = query(
        collection(db, "users"),
        where("interestCountry", "==", selectedCountry.currentKey),
      );
      const querySnapshot = await getDocs(items);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFilteredItems(data);
    }
  };

  let countryItems = new Set(["전체"]);

  currentItems.map((item) => {
    countryItems.add(item.interestCountry);
  });

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    FilteringItems();
  }, [selectedCountry]);

  return (
    <div className="mt-20 mx-auto flex max-w-[1260px] flex-col gap-4 p-4">
      <div className="flex w-full justify-end">
        <Select
          label="필터링할 나라를 선택해주세요."
          className="max-w-xs"
          selectedKeys={selectedCountry}
          onSelectionChange={setSelectedCountry}
        >
          {Array.from(countryItems).map((item) => (
            <SelectItem key={item}>{item}</SelectItem>
          ))}
        </Select>
      </div>
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
          <TableColumn className="text-center">아이디</TableColumn>
          <TableColumn className="text-center">회사</TableColumn>
          <TableColumn className="text-center">이메일</TableColumn>
          <TableColumn className="text-center">나라</TableColumn>
          <TableColumn className="text-center">닉네임</TableColumn>
          <TableColumn className="text-center">직군</TableColumn>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="text-center">
                {index + 1 + (page - 1) * rowsPerPage}
              </TableCell>
              <TableCell className="text-center">{item.id}</TableCell>
              <TableCell className="text-center">{item.company}</TableCell>
              <TableCell className="text-center">{item.email}</TableCell>
              <TableCell className="text-center">
                {item.interestCountry}
              </TableCell>
              <TableCell className="text-center">{item.nickName}</TableCell>
              <TableCell className="text-center">{item.position}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default UsersInfo;
