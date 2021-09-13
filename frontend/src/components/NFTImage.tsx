import { useState } from "react";
import {
  Image
} from "@chakra-ui/react";
import {
  GetTokenOfOwnerByIndex,
  GetTokenURI,
} from "../hooks";

import { getImageURI } from "../services/Metadata"

type Props = {
  account: any,
  index: any;
};

export default function NFTImage({ account, index }: Props) {
  const [imageSrc, setImageSrc] = useState("");
  const tokenId = GetTokenOfOwnerByIndex(account, index);
  const token_uri = GetTokenURI(tokenId);

  getImageURI(token_uri).then(function(imageURI: string) {
    setImageSrc(imageURI);
  })

  return (
    <Image src={imageSrc} alt="Segun Adebayo" width="150px" marginRight="20px"/>
  )
}
