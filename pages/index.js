import Head from 'next/head'
import { useState, useEffect } from 'react'
import { nftContractAddress } from '../config'
import { ethers } from 'ethers'
import { abi } from '../utils/abi'
import tw from 'twin.macro'
import fetch from 'isomorphic-unfetch'
import axios from 'axios'
import { Markdown } from "../components/Markdown"

const Container = tw.div`w-full tracking-wide leading-relaxed max-w-screen-lg mx-auto px-8 text-justify`

const Home = ({data}) => {
  const [mintedNFT, setMintedNFT] = useState(null)
  const [miningStatus, setMiningStatus] = useState(null)
  const [loadingState, setLoadingState] = useState(0)
  const [txError, setTxError] = useState(null)
  const [currentAccount, setCurrentAccount] = useState('')
  const [correctNetwork, setCorrectNetwork] = useState(false)

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
        {currentAccount === '' ? (
          <button
            tw='text-2xl text-white font-bold py-3 px-12 bg-black shadow-lg shadow-[#6FFFE9] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        ) : correctNetwork ? (
          <button
            tw='text-2xl text-white font-bold py-3 px-12 bg-black shadow-lg shadow-[#6FFFE9] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
            onClick={mintCharacter}
          >
            Mint Character
          </button>
        ) : (
          <div tw='flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3'>
            <div>----------------------------------------</div>
            <div>Please connect to the Rinkeby Testnet</div>
            <div>and reload the page</div>
            <div>----------------------------------------</div>
          </div>
        )}

        <Markdown contents={data} />
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
