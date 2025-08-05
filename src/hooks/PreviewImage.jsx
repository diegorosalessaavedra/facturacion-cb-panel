import { useState } from "react";

const ViewSelectImg = ({ idElementImg }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFileImg, setSelectedFileImg] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
    setSelectedFileImg(file);
  };

  const handleOnClickImg = () => {
    document.getElementById(idElementImg).click();
  };

  const deleteSelectImgClick = () => {
    setSelectedImage(null);
    setSelectedFileImg(null);
  };

  return {
    selectedImage,
    selectedFileImg,
    handleImageChange,
    handleOnClickImg,
    deleteSelectImgClick,
  };
};

export default ViewSelectImg;
