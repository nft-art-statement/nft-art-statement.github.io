import Head from 'next/head'
import { useState, useEffect } from 'react'
import { nftContractAddress } from '../config'
import { ethers } from 'ethers'
import { abi } from '../utils/abi'
import tw from 'twin.macro'
import fetch from 'isomorphic-unfetch'
import axios from 'axios'
import { Markdown } from '../components/Markdown'
import { Button } from '../components/Button'

const Container = tw.div`mt-16 w-full tracking-wide leading-relaxed max-w-screen-lg mx-auto px-8 text-justify`
const SignContainer = tw.div`w-full flex justify-center mt-10 mb-20`

const Home = ({data}) => {
  const [mintedNFT, setMintedNFT] = useState(null)
  const [miningStatus, setMiningStatus] = useState(null)
  const [loadingState, setLoadingState] = useState(0)
  const [txError, setTxError] = useState(null)
  const [currentAccount, setCurrentAccount] = useState('')
  const [correctNetwork, setCorrectNetwork] = useState(false)
  const [signerList, setSignerList] = useState([]);
  const [signerListWithENS, setSignerListWithENS] = useState([]);
  const SIGNER_AMOUNT_TO_DISPLAY = 10;

  // Checks if wallet is connected
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window
    if (ethereum) {
      console.log('Got the ethereum obejct: ', ethereum)
    } else {
      console.log('No Wallet found. Connect Wallet')
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' })

    if (accounts.length !== 0) {
      console.log('Found authorized Account: ', accounts[0])
      setCurrentAccount(accounts[0])
    } else {
      console.log('No authorized account found')
    }
  }

  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log('Metamask not detected')
        return
      }
      let chainId = await ethereum.request({ method: 'eth_chainId' })
      console.log('Connected to chain:' + chainId)

      const rinkebyChainId = '0x4'

      const devChainId = 1337
      const localhostChainId = `0x${Number(devChainId).toString(16)}`

      if (chainId !== rinkebyChainId && chainId !== localhostChainId) {
        alert('You are not connected to the Rinkeby Testnet!')
        return
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      console.log('Found account', accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log('Error connecting to metamask', error)
    }
  }

  // Checks if wallet is connected to the correct network
  const checkCorrectNetwork = async () => {
    const { ethereum } = window
    let chainId = await ethereum.request({ method: 'eth_chainId' })
    console.log('Connected to chain:' + chainId)

    const rinkebyChainId = '0x4'

    const devChainId = 1337
    const localhostChainId = `0x${Number(devChainId).toString(16)}`

    if (chainId !== rinkebyChainId && chainId !== localhostChainId) {
      setCorrectNetwork(false)
    } else {
      setCorrectNetwork(true)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
    checkCorrectNetwork()
  }, [])

  // Fetch all signer address list by Sign events
  useEffect(() => {
    const f = async () => {
      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const nftContract = new ethers.Contract(
            nftContractAddress,
            abi,
            provider
          );

          const signEvents = await nftContract.queryFilter("Sign");
          const signerAddresses = signEvents
            .sort((a, b) => b.blockNumber - a.blockNumber)
            .map((e) => e.args.signer);
          setSignerList(signerAddresses);
          setSignerListWithENS(
            signerAddresses.slice(0, SIGNER_AMOUNT_TO_DISPLAY)
          );
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log("Error minting character", error);
        setTxError(error.message);
      }
    };
    f();
  }, []);

  // map ens name to signer addresses of first specified amount
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const f = async () => {
      const nameList = await Promise.all(
        signerList.slice(0, SIGNER_AMOUNT_TO_DISPLAY).map(async (signer) => {
          const name = await provider.lookupAddress(signer);
          return name == null ? signer : name;
        })
      );
      setSignerListWithENS(nameList);
    };
    f();
  }, [signerList]);

  // Creates transaction to mint NFT on clicking Mint Character button
  const mintCharacter = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const nftContract = new ethers.Contract(
          nftContractAddress,
          abi,
          signer
        )

        let nftTx = await nftContract.signToStatementAndMintBadge()
        console.log('Mining....', nftTx.hash)
        setMiningStatus(0)

        let tx = await nftTx.wait()
        setLoadingState(1)
        console.log('Mined!', tx)
        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber()

        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTx.hash}`
        )

        getMintedNFT(tokenId)
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log('Error minting character', error)
      setTxError(error.message)
    }
  }

  // Gets the minted NFT data
  const getMintedNFT = async (tokenId) => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const nftContract = new ethers.Contract(
          nftContractAddress,
          abi,
          signer
        )

        let tokenUri = await nftContract.tokenURI(tokenId)
        let data = await axios.get(tokenUri)
        let meta = data.data

        setMiningStatus(1)
        setMintedNFT(meta.image)
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
      setTxError(error.message)
    }
  }
  return (
    <>
      <Head>
        <title>〈NFTアート〉への共同ステートメント | Community Statement on “NFT art”</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Container>
        <Markdown contents={data} />
        <SignContainer>
          {currentAccount === '' ? (
            <Button onClick={connectWallet}>Connect Wallet</Button>
          ) : correctNetwork ? (
            <Button onClick={mintCharacter}>Sign Statement</Button>
          ) : (
            <div tw='flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3'>
              <div>----------------------------------------</div>
              <div>Please connect to the Rinkeby Testnet</div>
              <div>and reload the page</div>
              <div>----------------------------------------</div>
            </div>
          )}
        </SignContainer>
      </Container>
    </>
  )
}

export const getStaticProps = async (context) => {
  const res = await fetch('https://raw.githubusercontent.com/nft-art-statement/statement/main/statement.md')
  const text = await res.text()
  return {
    props: {
      data: text
    }
  }
}

export default Home
