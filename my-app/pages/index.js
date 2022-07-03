import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import Web3Modal from 'web3modal'
import { ethers, Contract, BigNumber } from 'ethers';
import {Token_Contact_Address,Token_Contract_ABI,NFT_Contract_Address,NFT_Contract_ABI} from '../constants/index'

let web3modal

if(typeof window !== "undefined"){
  web3modal = new Web3Modal({
    network: "goerli",
    providerOptions: {},
    disableInjectedProvider: false
  })
}

export default function Home() {

  const zero = BigNumber.from(0)

  const [walletConnected,setWalletConnected] = useState(false)
  const [tokensMinted, setTokensMinted] = useState(zero)
  const [balanceOfAddress,setBalanceOfAddress] = useState(zero)
  const [tokenAmount,setTokenAmount] = useState(zero)
  const [loading,setLoading] = useState(false)

  const mintTokens = async (amount) => {
    try {
      const signer = await connectWallet(true)
      const tokenContract = new Contract(Token_Contact_Address,Token_Contract_ABI,signer)
      const value = 0.001*amount
      const txn = await tokenContract.mint(amount,{value:ethers.utils.parseEther(value.toString())})
      setLoading(true)
      await txn.wait()
      setLoading(false)
      window.alert("successfully minted")
    } catch (error) {
      console.log(error)
    }
  }
  const renderButton = () => {
    return(
      <div style={{display:'flex-col'}} >
        <div>
          <input type="number" placeholder="amount of tokens" onChnage={(e)=>setTokenAmount(BigNumber.from(e.target.value))} />
          <button className={styles.button} disabled={!(tokenAmount>0)} onClick={()=>mintTokens(tokenAmount)} >
            Mint Tokens
          </button>
        </div>
      </div>
    )
  }

  const connectWallet = async (needSigner = false) => {
    try{
      const instance = await web3modal.connect()
      const provider = new ethers.providers.Web3Provider(instance)
      const {chainId} = await provider.getNetwork()
      if(chainId !== 5 ){
        window.alert("connect with goerli network")
        throw new Error("inncorrect network")
      }
      if(needSigner){
        const signer = provider.getSigner()
        setWalletConnected(true)
        return signer
      }
      setWalletConnected(true)
      return provider
    }
    catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    if(!walletConnected){
      connectWallet()
    }
  },[])

  return (
    <div>
      <Head>
        <title>Web3 Devs</title>
        <meta name="description" content="ICO-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main} >
        <div>
          <h1 className={styles.title} >Welcome to Web3 Devs ICO</h1>
          <div className={styles.description} >
            You can claim or mint yor Web3 Dev Token here!
          </div>
          <div>
            {
              walletConnected ? (
              <div>
                <div className={styles.description} >
                  You have minted {ethers.utils.formatEther(balanceOfAddress)} Web3 Devs tokens
                </div>
                <div className={styles.description} >
                  {ethers.utils.formatEther(tokensMinted)}/1000 have been minted
                </div>
                {renderButton}
              </div>
              ) : (<button onClick={connectWallet} >Connect Wallet</button>)
            }
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        Made with &#10084; by Web3 Devs
      </footer>
    </div>
  )
}
