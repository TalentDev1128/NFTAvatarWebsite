import { Box, Stack, Text } from "@chakra-ui/react";

export default function Guide() {

  return (
    <Box border="none">
      <Stack direction="row" h="100%" p={4} style={{marginTop: "100px", width: "80%", margin: "auto"}}>
        <Text color="#ffffff" fontSize="3xl" style={{borderLeft: '1px solid #9197a1', paddingLeft: '4px'}}>Title</Text>
        <Text color="#ffffff" fontSize="1xl" marginLeft="50px">
          <p style={{marginLeft: "50px", lineHeight: "40px"}}>
            Some text here Some text here Some text here Some text here Some text
            Some text here Some text here Some text here Some text here Some text
            Some text here Some text here Some text here Some text here Some text
            Some text here Some text here Some text here Some text here Some text
          </p>
        </Text>
      </Stack>
      <Stack direction="row" h="100%" p={4} style={{marginTop: "100px", width: "80%", margin: "auto"}}>
      <Text color="#ffffff" fontSize="3xl" style={{borderLeft: '1px solid #9197a1', paddingLeft: '4px'}}>Title</Text>
        <Text color="#ffffff" fontSize="1xl" marginLeft="50px">
        <p style={{marginLeft: "50px", lineHeight: "40px"}}>
            Some text here Some text here Some text here Some text here Some text
            Some text here Some text here Some text here Some text here Some text
            Some text here Some text here Some text here Some text here Some text
            Some text here Some text here Some text here Some text here Some text
          </p>
        </Text>
      </Stack>
    </Box>
  );
}
