import { ChakraProvider, useDisclosure, Image, Tab, Tabs, TabList, TabPanels, TabPanel, Text } from "@chakra-ui/react";
import theme from "./theme";
import Layout from "./components/Layout";
import ConnectButton from "./components/ConnectButton";
import Mint from "./components/Mint";
import Migrate from "./components/Migrate";
import Guide from "./components/Guide";
import "@fontsource/inter";

function App() {
  const { isOpen, onOpen } = useDisclosure()

  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Tabs width="100%" height="100%">
          <TabList>
            <Tab width="33%" style={{boxShadow: "none", color: "#2bb04f"}}><Text color="#04ff00" fontSize="2xl">Mint</Text></Tab>
            <Tab width="33%" style={{boxShadow: "none", color: "#2bb04f"}}><Text color="#04ff00" fontSize="2xl">Migrate</Text></Tab>
            <Tab width="34%" style={{boxShadow: "none", color: "#2bb04f"}}><Text color="#04ff00" fontSize="2xl">Guide</Text></Tab>
          </TabList>

          <TabPanels backgroundColor="#1a202c">
            <TabPanel>
              <Image src="/Blootelves_logo website.png" alt="Blootelves_logo" style={{margin:"auto auto 5px", width: "200px"}}/>
              <div style={{width: '100', display: 'flex', justifyContent: 'center'}}>
                <ConnectButton handleOpenModal={onOpen} />
              </div>
              <Mint />
            </TabPanel>
            <TabPanel>
              <Image src="/Blootelves_logo website.png" alt="Blootelves_logo" style={{margin:"auto auto 5px", width: "200px"}}/>
              <div style={{width: '100', display: 'flex', justifyContent: 'center'}}>
                <ConnectButton handleOpenModal={onOpen} />
              </div>
              <Migrate />
            </TabPanel>
            <TabPanel>
              <Guide />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Layout>
    </ChakraProvider>
  );
}

export default App;
