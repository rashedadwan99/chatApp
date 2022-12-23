import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { login } from "../../services/userService";

function Login() {
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const toast = useToast();
  const history = useHistory()
  const handleClick = () => {
    setShow(!show);
  };
  const handleSubmit = async () => {
    if (!email || !password) {
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
    setLoading(true);
    try {
      const { data } = await login({ email, password });
      toast({
        title: "Login Successful",
        statue: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);

      localStorage.setItem("user", JSON.stringify(data));
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

  return (
    <VStack spacing="4px">
      <FormControl id="email" isRequired>
        <FormLabel>email</FormLabel>
        <Input
          placeholder="Enter Your email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <InputRightElement>
            <Button
              h="1.75rem"
              size="sm"
              bg="white"
              margin="0 5px 0 0"
              onClick={handleClick}
            >
              {show ? "hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: "10px" }}
        onClick={handleSubmit}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        style={{ marginTop: "10px" }}
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("1234");
        }}
      >
        Get Guest User Credianls
      </Button>
    </VStack>
  );
}

export default Login;
