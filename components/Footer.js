import tw from "twin.macro";
import Icon from "@mdi/react"
import { mdiEthereum, mdiGithub } from "@mdi/js";
import { nftContractAddress } from "../config";

const Container = tw.footer`bg-gray-300 px-8 py-10`;
const LinksContainer = tw.div`flex justify-center gap-x-10`;
const Link = tw.a`text-gray-700 flex gap-x-1`;
const CopyContainer = tw.div`flex justify-center mt-10`;
const Copyright = tw.p``;

export const Footer = () => {
  return (
    <Container>
      <LinksContainer>
        <Link href={"https://github.com/nft-art-statement"}>
          <Icon path={mdiGithub} size={1} /><span>Github</span>
        </Link>
        <Link href={`https://etherscan.io/address/${nftContractAddress}`}>
          <Icon path={mdiEthereum} size={1} /><span>Etherscan</span>
        </Link>
        {/*FIXME: 本番用のOpenseaCollectionに変更*/}
        {/*<Link href={'https://testnets.opensea.io/collection/community-statement-on-nft-art-thzmebc118'}>*/}
        {/*  OpenSea*/}
        {/*</Link>*/}
      </LinksContainer>
      <CopyContainer>
        <Copyright>&copy;{new Date().getFullYear()} The community statement drafting team</Copyright>
      </CopyContainer>
    </Container>
  )
};