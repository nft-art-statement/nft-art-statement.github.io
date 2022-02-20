import Head from "next/head";
import { useState, useEffect } from "react";
import { nftContractAddress } from "../config";
import { ethers } from "ethers";
import { abi } from "../utils/abi";
import tw from "twin.macro";
import fetch from "isomorphic-unfetch";
import { Markdown } from "../components/Markdown";
import { Button } from "../components/Button";
import { ChainId, useContractFunction, useEthers } from "@usedapp/core";

const Container = tw.div`mt-16 w-full tracking-wide leading-relaxed max-w-screen-lg mx-auto px-8 text-justify`;
const SignContainer = tw.div`w-full flex justify-center mt-10 mb-20`;
const SIGNER_AMOUNT_TO_DISPLAY = 10;

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
      <Head>
        <title>
          〈NFTアート〉への共同ステートメント | Community Statement on “NFT art”
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Container>
        <Markdown contents={data} />
        <SignContainer>
          {account == undefined ? (
            <Button onClick={activateBrowserWallet}>Connect Wallet</Button>
          ) : correctNetwork ? (
            // <Button onClick={() => sign()}>Sign Statement</Button>
            <Button onClick={() => signAndMint()}>Sign Statement</Button>
          ) : (
            <div tw="flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3">
              <div>----------------------------------------</div>
              <div>Please connect to the Rinkeby Testnet</div>
              <div>and reload the page</div>
              <div>----------------------------------------</div>
            </div>
          )}
        </SignContainer>
      </Container>
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
