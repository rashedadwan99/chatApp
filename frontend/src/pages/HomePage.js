import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  Box,
  Text,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import SignUp from "../components/authentications/SignUp";
import Login from "../components/authentications/Login";
function HomePage({ location }) {
  const history = useHistory();
  const userInfo = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (userInfo) {
      history.push("/chats");
    }

  }, [history]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        alignItems="center"
        textAlign="center"
        p={3}
        bg="white"
        width="100%"
        borderRadius="10px"
        m="10px 0 10px 0"
      >
        {/**trbl */}
        <Text fontSize="4xl" fontFamily="work sans" color="black">
          Talk-A-Tive
        </Text>
      </Box>
      <Box bg="white" width="100%" p={4} borderRadius="10px" color="black">
        <Tabs variant="soft-rounded">
          <TabList mb="0em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login location={location} />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default HomePage;
