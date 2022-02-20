import { SEO } from "../components/SEO";
import dynamic from "next/dynamic";
import {Heading3, Heading4, Leading1} from "../components/Typography";
import { useState, useEffect } from "react";
import { nftContractAddress } from "../config";
import { ethers } from "ethers";
import { abi } from "../utils/abi";
import tw from "twin.macro";
import fetch from "isomorphic-unfetch";
import { Markdown } from "../components/Markdown";
import { Button, ButtonLink } from "../components/Button";
import { Footer } from "../components/Footer";
import { ChainId, useContractFunction, useEthers } from "@usedapp/core";
import { mdiTwitter } from "@mdi/js";
import Icon from "@mdi/react";
import LogoImg from '../assets/logo_CommunityStatementonNFTart.png'

const HeroContainer = tw.div`flex justify-center`;
// const Hero = dynamic(() => import("../components/Sketch"), { ssr: false });
const HeroLink = tw.a``;
const HeroImg = tw.img`w-full max-w-[800px] mx-auto`
const Container = tw.div`w-full tracking-wide leading-relaxed md:px-8 px-6`;
const StatementDownloadButton = tw.div`fixed top-8 right-8`;
const StatementContainer = tw.div`border-b border-gray-900 md:pb-16 pb-8`;
const StatementInner = tw.div`max-w-screen-lg mx-auto text-justify`;
const SignerContainer = tw.div`border-b border-gray-900 md:pb-16 pb-8 md:pt-10 pt-8`;
const SignerInner = tw.div`max-w-screen-lg mx-auto`
const Signer = tw.p`mt-3 truncate`
const SignContainer = tw.div`max-w-screen-lg mx-auto text-justify md:pb-16 pb-8 md:pt-10 pt-8`;
const SignButtonContainer = tw.div`w-full flex justify-center mt-10 mb-20`;
const SIGNER_AMOUNT_TO_DISPLAY = 10;
const ShareContainer = tw.div`flex justify-center gap-x-2`;
const TwitterShareLink = tw.a`inline-flex rounded-full px-4 py-2 shadow`

const Home = ({ data }) => {
  const { account, activateBrowserWallet, chainId, library } = useEthers();
  const [mintedNFT, setMintedNFT] = useState(null);
  const [miningStatus, setMiningStatus] = useState(null);
  const [loadingState, setLoadingState] = useState(0);
  const [txError, setTxError] = useState(null);
  const [signerList, setSignerList] = useState([]);
  const [signerListWithENS, setSignerListWithENS] = useState([]);

  // TODO switch to mainnet
  const correctNetwork = chainId === ChainId.Rinkeby;
  const nftContract = new ethers.Contract(
    nftContractAddress,
    new ethers.utils.Interface(abi),
    library
  );
  const { state: signState, send: sign } = useContractFunction(
    nftContract,
    "signToStatement"
  );
  const { state: signAndMintState, send: signAndMint } = useContractFunction(
    nftContract,
    "signToStatementAndMintBadge"
  );

  console.log(
    account,
    chainId,
    signState,
    signAndMintState,
    signerList,
    signerListWithENS
  );

  // Fetch all signer address list by Sign events
  useEffect(() => {
    if (library === undefined) {
      return;
    }
    const f = async () => {
      try {
        const signEvents = await nftContract.queryFilter("Sign");
        const signerAddresses = signEvents
          .sort((a, b) => b.blockNumber - a.blockNumber)
          .map((e) => e.args.signer);
        setSignerList(signerAddresses);
        setSignerListWithENS(
          signerAddresses.slice(0, SIGNER_AMOUNT_TO_DISPLAY)
        );
      } catch (error) {
        console.log("Error minting character", error);
        setTxError(error.message);
      }
    };
    f();
  }, [library]);

  // map ens name to signer addresses of first specified amount
  useEffect(() => {
    if (library === undefined) {
      return;
    }
    const f = async () => {
      const nameList = await Promise.all(
        signerList.slice(0, SIGNER_AMOUNT_TO_DISPLAY).map(async (signer) => {
          const name = await library.lookupAddress(signer);
          return name == null ? signer : name;
        })
      );
      setSignerListWithENS(nameList);
    };
    f();
  }, [library, signerList]);

  return (
    <>
      <SEO />
      <StatementDownloadButton>
        <ButtonLink href="https://gateway.pinata.cloud/ipfs/Qmbuc7FMZ2qsUjSMtTG6FoD6sAigCzS9AyJUtQF2cMX4Qe" target={"_blank"} rel={"noreferrer noopener"}>Download</ButtonLink>
      </StatementDownloadButton>
      <HeroContainer>
        {/*<Hero />*/}
        <HeroLink href={'https://openprocessing.org/sketch/1491110'}>
          <HeroImg src={LogoImg.src} alt={"The community statement drafting team"} />
        </HeroLink>
      </HeroContainer>
      <Container>
        <StatementContainer>
          <StatementInner>
            <Markdown contents={data} />
          </StatementInner>
        </StatementContainer>
        <SignerContainer>
          <SignerInner>
            <Heading3 tw={"mb-8"}>ステートメントの署名者 - Signers of the statement</Heading3>
            {
              signerListWithENS?.map(signer => (
                <Signer key={`signer-${signer}`}>{signer}</Signer>
              ))
            }
          </SignerInner>
        </SignerContainer>
        <SignContainer>
          <Heading3>本ステートメントへの署名について</Heading3>
          <Leading1>イーサリアムのウォレットを接続することにより、本ステートメントに署名できます。その際、署名のみ実行する、署名と同時に本ステートメントのNFTをmintする、の2つから選択できます。なお、1つのウォレットにつき署名できるのは1回だけです。</Leading1>
          <Heading4>本ステートメントのNFTについて</Heading4>
          <Leading1>各署名者が受け取るNFTの内容は全て同一です</Leading1>
          <Leading1>mint後に譲渡やburnをすることはできません</Leading1>
          <hr tw={"mt-8"} />
          <Heading3>Signing to this statement</Heading3>
          <Leading1>You can sign this statement by connecting your Ethereum wallet. You can choose to sign only or to sign and mint the NFT for this statement simultaneously. Please note that you can only sign this statement once per wallet.</Leading1>
          <Heading4>Regarding the NFT for this statement</Heading4>
          <Leading1>All contents are the same</Leading1>
          <Leading1>No transfer or burn is allowed after the mint</Leading1>
          <SignButtonContainer>
            {account === undefined || account === null ? (
              <Button onClick={activateBrowserWallet}>Connect Wallet</Button>
            ) : correctNetwork ? (
              <div tw={"flex flex-col justify-center gap-y-6"}>
                <Button onClick={() => sign()}>署名する<br />Sign</Button>
                <Button onClick={() => signAndMint()}>署名してNFTをmintする<br />Sign and mint an NFT</Button>
              </div>
            ) : (
              <Leading1 tw={"text-red-500 font-bold"}>Please connect to the Ethereum Mainnet and reload the page</Leading1>
            )}
          </SignButtonContainer>
          <ShareContainer>
            <TwitterShareLink
              href="https://twitter.com/share?url=https://nft-art-statement.github.io/&text=私はこの〈NFTアート〉への共同ステートメントに賛同いたします。%20%23NFTアートのステートメント%20"
              target={"_blank"}
            >
              <Icon path={mdiTwitter} size={1} color={'#1DA1F2'} />
              <span>このステートメントに賛同する</span>
            </TwitterShareLink>
          </ShareContainer>
        </SignContainer>
      </Container>
      <Footer />
    </>
  );
};

export const getStaticProps = async (context) => {
  const res = await fetch(
    "https://raw.githubusercontent.com/nft-art-statement/statement/main/statement.md"
  );
  const text = await res.text();
  return {
    props: {
      data: text,
    },
  };
};

export default Home;
