import { ChakraProvider, useDisclosure, Image } from "@chakra-ui/react";
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
        <Image src="/Blootelves_logo.png" alt="Blootelves_logo" width="200px" position="absolute" top="40px" left="20px"/>
        <ConnectButton handleOpenModal={onOpen} />
        <Mint />
      </Layout>
    </ChakraProvider>
  );
}

export default App;
