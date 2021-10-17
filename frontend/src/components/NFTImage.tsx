import { useState } from "react";
import {
  Image
} from "@chakra-ui/react";
import {
  GetElvesTokenOfOwnerByIndex,
  GetElvesTokenURI,
} from "../hooks";

import { getImageURI } from "../services/Metadata"

type Props = {
  account: any,
  index: any;
};

export default function NFTImage({ account, index }: Props) {
  const [imageSrc, setImageSrc] = useState("");
  const tokenId = GetElvesTokenOfOwnerByIndex(account, index);
  const token_uri = GetElvesTokenURI(tokenId);
  getImageURI(token_uri).then(function(imageURI: string) {
    setImageSrc(imageURI);
  })

  return (
    <Image src={imageSrc} alt="Segun Adebayo" width="150px" height="150px" marginLeft="20px" marginRight="20px"/>
  )
}
