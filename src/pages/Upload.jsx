import React, { useState } from "react";

import { Button, Input, Select, SelectItem } from "@nextui-org/react";

import { db } from "../firebase/firebase";

import { collection, addDoc } from "firebase/firestore";
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

function Upload() {
  const [inputGroups, setInputGroups] = useState([
    { input1: "", input2: "", input3: "", input4: "", input5: "", input6: "" },
  ]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const newInputGroups = [...inputGroups];
    newInputGroups[index][name] = value;
    setInputGroups(newInputGroups);
  };

  const addInputGroup = () => {
    setInputGroups([
      ...inputGroups,
      {
        input1: "",
        input2: "",
        input3: "",
        input4: "",
        input5: "",
        input6: "",
      },
    ]);
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

  const uploadPosts = async () => {
    try {
      const storage = getStorage();

      for (const group of inputGroups) {
        const imageFile = group.input5;
        const videoFile = group.input6;

        if (!imageFile || !videoFile) {
          throw new Error("File inputs cannot be empty.");
        }

        const imageRef = ref(storage, `images/${imageFile.name}`);
        const videoRef = ref(storage, `videos/${videoFile.name}`);

        await uploadBytesResumable(imageRef, imageFile);
        await uploadBytesResumable(videoRef, videoFile);

        const imageDownloadURL = await getDownloadURL(imageRef);
        const videoDownloadURL = await getDownloadURL(videoRef);

        const post = {
          title: group.input1,
          category: group.input2,
          content: group.input3,
          videoLength: group.input4,
          thumbnail: imageDownloadURL,
          video: videoDownloadURL,
          id: "000162.a1f88ad5ca114e5a8efcff9f7e7a3124.1059",
          approve: true,
          commentCnt: 0,
          createdAt: formatDate(new Date()),
          likes: [],
          tags: [],
          userId: "userId",
          viewCnt: 0,
        };
        await addDoc(collection(db, "posts"), post);
      }

      setInputGroups([
        {
          input1: "",
          input2: "",
          input3: "",
          input4: "",
          input5: "",
          input6: "",
        },
      ]);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="mx-auto mt-20 flex max-w-[1240px] flex-col gap-4 p-4">
      <div className="flex justify-end gap-3">
        <Button onClick={uploadPosts} color="success" variant="ghost">
          업로드
        </Button>
        <Button onClick={addInputGroup} color="primary">
          추가하기
        </Button>
      </div>
      <div>
        {inputGroups.map((group, index) => (
          <div
            key={index}
            className="mb-6 grid gap-2 rounded-xl border border-divider p-4 md:grid-cols-2 lg:grid-cols-3"
          >
            <Input
              type="text"
              name="input1"
              value={group.input1}
              placeholder="제목을 입력해주세요 ."
              onChange={(e) => handleChange(index, e)}
            />
            <Select
              type="text"
              name="input2"
              value={group.input2}
              placeholder="카테고리를 선택해주세요 ."
              onChange={(e) => handleChange(index, e)}
            >
              <SelectItem key="ODM / OBM">ODM / OBM</SelectItem>
              <SelectItem key="Brand">Brand</SelectItem>
              <SelectItem key="Others">Others</SelectItem>
              <SelectItem key="Distributor">Distributor</SelectItem>
            </Select>
            <Input
              type="text"
              name="input3"
              value={group.input3}
              placeholder="content를 입력해주세요 ."
              onChange={(e) => handleChange(index, e)}
            />
            <Input
              type="text"
              name="input4"
              value={group.input4}
              placeholder="영상 길이를 적어주세요 ."
              onChange={(e) => handleChange(index, e)}
            />
            <div>
              <p className="text-sm text-default-500">
                썸내일을 업로드해주세요 .
              </p>
              <input
                type="file"
                name="input5"
                value={group.input5}
                onChange={(e) => handleChange(index, e)}
                className="text-sm"
                accept="image/*"
              />
            </div>
            <div>
              <p className="text-sm text-default-500">
                영상을 업로드해주세요 .
              </p>
              <input
                type="file"
                name="input6"
                value={group.input6}
                onChange={(e) => handleChange(index, e)}
                className="text-sm"
                accept="video/*"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Upload;
