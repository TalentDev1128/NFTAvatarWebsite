import { useState } from "react";
import {
  Image, AspectRatio, Box
} from "@chakra-ui/react";
import {
  GetDerivativeTokenOfOwnerByIndex,
  GetDerivativeTokenURI,
} from "../hooks";

import { getImageURI } from "../services/Metadata"

type Props = {
  account: any,
  index: any;
};

export default function ClaimImage({ account, index }: Props) {
  const [imageSrc, setImageSrc] = useState("");
  const tokenId = GetDerivativeTokenOfOwnerByIndex(account, index);
  const token_uri = GetDerivativeTokenURI(tokenId);
  getImageURI(token_uri).then(function(imageURI: string) {
    setImageSrc(imageURI);
  })

  return (
    <div>
      {imageSrc ? (
        imageSrc.includes("mp4") ? (
          <Box as="iframe" title="derivatives" src={imageSrc} allowFullScreen width="200px" height="200px" marginLeft="30px" marginRight="30px"/>
        ) : (
          <Image src={imageSrc} alt="Segun Adebayo" width="200px" height="200px" minWidth="200px" minHeight="200px" marginLeft="30px" marginRight="30px"/> 
        )
        ) : (
        <Image src="/emptyImg.png" alt="Segun Adebayo" width="200px" height="200px" marginLeft="30px" marginRight="30px"/>
      )}
      
    </div>
    
  )
}
