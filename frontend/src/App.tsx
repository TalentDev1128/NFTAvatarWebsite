import { ChakraProvider, useDisclosure, Image } from "@chakra-ui/react";
import theme from "./theme";
import Layout from "./components/Layout";
import ConnectButton from "./components/ConnectButton";
// import AccountModal from "./components/AccountModal";
import Mint from "./components/Mint";
import "@fontsource/inter";

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Image src="/Blootelves_logo.png" alt="Blootelves_logo" width="200px" position="absolute" top="40px" left="20px"/>
        <ConnectButton handleOpenModal={onOpen} />
        {/* <AccountModal isOpen={isOpen} onClose={onClose} /> */}
        <Mint />
      </Layout>
    </ChakraProvider>
  );
}

export default App;
