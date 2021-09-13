import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import theme from "./theme";
import Layout from "./components/Layout";
import ConnectButton from "./components/ConnectButton";
import Mint from "./components/Mint";
import "@fontsource/inter";

function App() {
  const { onOpen } = useDisclosure();
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <ConnectButton handleOpenModal={onOpen} />
        <Mint />
      </Layout>
    </ChakraProvider>
  );
}

export default App;
