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
        <Image src="/Blootelves_logo website.png" alt="Blootelves_logo" width="200px" marginBottom="5px"/>
        <ConnectButton handleOpenModal={onOpen} />
        <Mint />
      </Layout>
    </ChakraProvider>
  );
}

export default App;
