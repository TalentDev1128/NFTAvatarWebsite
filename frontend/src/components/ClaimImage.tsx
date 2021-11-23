import { useState, useEffect } from "react";
import { Image, Box } from "@chakra-ui/react";
import {
  GetDerivativeTokenOfOwnerByIndex,
  GetDerivativeTokenURI,
} from "../hooks";

import { getImageURI } from "../services/Metadata";

type Props = {
  account: any;
  index: any;
  onFoundValidTokenID: Function;
};

export default function ClaimImage({
  account,
  index,
  onFoundValidTokenID,
}: Props) {
  const tokenId = GetDerivativeTokenOfOwnerByIndex(account, index);
  const token_uri = GetDerivativeTokenURI(tokenId);

  const [imageSrc, setImageSrc] = useState("");
  const [tokenIdValue, setTokenIdValue] = useState(0);

  useEffect(() => {
    setTokenIdValue(tokenId ? tokenId.toNumber() : 0);
    if (tokenIdValue > 0 && tokenIdValue <= 10000) {
      onFoundValidTokenID(tokenIdValue);
    }
  }, [tokenId]);

  getImageURI(token_uri).then(function (imageURI: string) {
    setImageSrc(imageURI);
  });

  return (
    <div>
      {tokenIdValue > 0 && tokenIdValue <= 10000 ? (
        imageSrc ? (
          imageSrc.includes("mp4") ? (
            <Box
              as="iframe"
              title="derivatives"
              src={imageSrc}
              allowFullScreen
              width="200px"
              height="200px"
              marginLeft="30px"
              marginRight="30px"
            />
          ) : (
            <Image
              src={imageSrc}
              alt="Segun Adebayo"
              width="200px"
              height="200px"
              minWidth="200px"
              minHeight="200px"
              marginLeft="30px"
              marginRight="30px"
            />
          )
        ) : (
          <Image
            src="/emptyImg.png"
            alt="Segun Adebayo"
            width="200px"
            height="200px"
            marginLeft="30px"
            marginRight="30px"
          />
        )
      ) : (
        <Box display="none" />
      )}
    </div>
  );
}
