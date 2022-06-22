import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import Web3Modal from 'web3modal'
import { ethers, Contract } from 'ethers';

let web3modal

if(typeof window !== "undefined"){
  web3modal = new Web3Modal({
    network: "goerli",
    providerOptions: {},
    disableInjectedProvider: false
  })
}

export default function Home() {

  const [walletConnected,setWalletConnected] = useState(false)

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
            
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        Made with &#10084; by Web3 Devs
      </footer>
    </div>
  )
}
