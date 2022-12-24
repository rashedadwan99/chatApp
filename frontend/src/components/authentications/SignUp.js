import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { signUp } from "../../services/userService";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

function SignUp() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [picture, setPicture] = useState();
  const toast = useToast();
  const handleClick = () => {
    setShow(!show);
  };

  const postDetails = (pic) => {
    setLoading(true);
    if (pic === undefined) {
      toast({
        title: "Please Select an Image.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pic.type === "image/jpeg" || pic.type === "image/png ") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat app");
      data.append("cloud_name", "dgbat9cg8");
      fetch("https://api.cloudinary.com/v1_1/dgbat9cg8/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPicture(data.url);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please Fill all Fields",
        statue: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setLoading(false);
      return;
    }
    const emailRegex =
      new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm");

    const isValidEmail = emailRegex.test(email);
    if (!isValidEmail) {
      toast({
        title: "please enter a valid email",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const { data } = await signUp({
        name, email: email.trim(), password, picture
      });
      toast({
        title: "Registeration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("user", JSON.stringify(data));
      setLoading(false);
      window.location = "/chats";
    } catch (error) {
      toast({
        title: "Error occoured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  const readNameAndEmail = ({ currentTarget }) => {
    currentTarget.value = currentTarget.value.trimLeft()
    let { value, name } = currentTarget
    name === "name" ? setName(value) : setEmail(value)
  }

  return (
    <VStack spacing="4px">
      <FormControl id="first-name" isRequired>
        <FormLabel>name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          name="name"
          onChange={(e) => readNameAndEmail(e)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>email</FormLabel>
        <Input
          placeholder="Enter Your email"
          name="email"

          onChange={(e) => readNameAndEmail(e)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement>
            <Button
              h="1.75rem"
              size="sm"
              bg="white"
              margin="0 5px 0 0"
              onClick={handleClick}
            >
              {show ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirmPassword" isRequired>
        <FormLabel>confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement>
            <Button
              h="1.75rem"
              size="sm"
              bg="white"
              margin="0 5px 0 0"
              onClick={handleClick}
            >
              {show ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="picture" m="10px 0 10px 0">
        <FormLabel>upload your picture</FormLabel>
        <InputGroup>
          <Input
            type="file"
            accept="image/*"
            p={1.5}
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: "15px" }}
        isLoading={loading}
        onClick={submitHandler}
      >
        Sign Up
      </Button>

    </VStack>
  );
}

export default SignUp;
