import React, { useState } from "react";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useHistory } from "react-router";

function SignUp() {
  const [Username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const toast = useToast();
  const history = useHistory();
  const [conPassword, setConPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState(null);

  const submitRegister = async (e) => {
    e.preventDefault();
    if (!Username || !email || !Password || !conPassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (Password !== conPassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(Username, email, Password, image);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "https://chat-app-qxlf.onrender.com/api/user",
        {
          username: Username,
          email,
          password: Password,
          image,
        },
        config
      );
      console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      history.push("/Chat");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const uploadImg = (pics) => {
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat_app");
      data.append("cloud_name", "dq8iol6rl");
      fetch("https://api.cloudinary.com/v1_1/dq8iol6rl/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setImage(data.url.toString());
          console.log(data.url.toString());
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toast({
        title: "Please handle an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form className="w-64 ">
      <h1 className="text-center mb-4 font-extrabold text-xl h-[40px] text-gray-500">
        SignUp User
      </h1>
      <input
        type="text"
        placeholder="Username"
        value={Username}
        onChange={(e) => setUsername(e.target.value)}
        className="  focus:outline-none block w-full my-2 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="  focus:outline-none block w-full my-2 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
      />
      <input
        type={showPassword ? "text" : "password"}
        placeholder="password"
        value={Password}
        onChange={(e) => setPassword(e.target.value)}
        className=" focus:outline-none block w-full my-2 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex items-center my-2">
        <input
          type="checkbox"
          checked={showPassword}
          onChange={toggleShowPassword}
          className="mr-2"
        />
        <label className="text-gray-500">Show Password</label>
      </div>
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Confirm password"
        value={conPassword}
        onChange={(e) => setConPassword(e.target.value)}
        className=" focus:outline-none block w-full my-2 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex items-center my-2">
        <input
          type="checkbox"
          checked={showPassword}
          onChange={toggleShowPassword}
          className="mr-2"
        />
        <label className="text-gray-500">Show Password</label>
      </div>
      <input
        type="file"
        onChange={(e) => uploadImg(e.target.files[0])}
        className="focus:outline-none block w-full my-2 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={submitRegister}
        className="block text-white text-center font-bold bg-blue-500 hover:bg-blue-800 w-full p-2 rounded-md "
      >
        SignUP
      </button>
    </form>
  );
}

export default SignUp;
