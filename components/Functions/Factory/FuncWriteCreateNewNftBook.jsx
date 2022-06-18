import React, { useState } from 'react'
import { useMoralisDapp } from "../../../providers/MoralisDappProvider/MoralisDappProvider"
import { Moralis } from 'moralis'
import Image from 'next/image'
import loader from '../../../public/loader2.gif'
import ErrorMessage from "../../Alerts/ErrorMessage"
import TransactionMessage from "../../Alerts/TransactionMessage"


const FuncWriteCreateNewNftBook = ({ children, name, amount, maxCopies, uri, royaltyFeesInBips, contractURI, collectionName, isDisabled, setLoadingState, updateSteps, setCreationStatus, setIsFatalError, ...props }) => {
  
  const { contractAddrs, contractABIs } = useMoralisDapp()
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const sendOptions = {
    abi: contractABIs.factory1155,
    contractAddress: contractAddrs.factory1155,
    functionName: name,
  }

  // const executeFunction = async () => {
  //   sendOptions.params = {
  //     amount: amount,
  //     maxCopies: maxCopies,
  //     uri: uri,
  //     royaltyFeesInBips: royaltyFeesInBips,
  //     contractURI: contractURI,
  //     collectionName: collectionName
  //   }
  //   try {
  //     setIsFetching(true)
  //     setError(null)
  //     setIsModalOpen(false)
  //     const transaction = await Moralis.executeFunction(sendOptions)
  //     loadingState(3.1)
  //     setCreationStatus("Transaction on blockchain: Contract creation and token #1 minting...")
  //     console.log(transaction.hash)
  //     const receipt = await transaction.wait()
  //     setData(receipt)
  //     setCreationStatus("Contract successfully created and NFT Book #1 minted !")
  //     setLoadingState(4)
  //     updateSteps(4)
  //     setIsFetching(false)
  //     setIsModalOpen(true)
  //   } catch (error) {
  //     setError(error.message)
  //     // setIsFatalError(true)
  //     loadingState(3)
  //     setIsFetching(false)
  //   }
  // }

  const executeFunction = async () => {
    try {
      const ethers = Moralis.web3Library;
      const web3Provider = await Moralis.enableWeb3()
      const gasPrice = await web3Provider.getGasPrice()
  
      const signer = web3Provider.getSigner()
  
      const contract = new ethers.Contract(contractAddrs.factory1155, contractABIs.factory1155, signer)
      console.log(gasPrice);
      const transaction = await contract.createNewNFTBook(amount, maxCopies, uri, royaltyFeesInBips, contractURI, collectionName, {
        gasLimit: 15000000,
        gasPrice: gasPrice,
        // baseFeePerGas: 9,
        // maxPriorityFeePerGas: 2,
        // maxFeePerGas: 10000000
      })
  
      console.log(transaction.hash)
      const receipt = await transaction.wait()
  
      console.log(receipt);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <>
      {error && <ErrorMessage error={error} setError={setError}  />}
      {data && <TransactionMessage isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} data={data} />}
      <button
        type="button"
        onClick={executeFunction}
        disabled={isFetching || isDisabled}
        {...props}
      >
        {isFetching
          ? <span>
              <Image
                src={loader}
                alt="loading spinner"
                width={40}
                height={40}
              />
            </span>
          : <span>{children}</span>
        }
      </button>
    </>
  )
}

export default FuncWriteCreateNewNftBook
