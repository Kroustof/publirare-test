import React, { useState } from 'react'
import { useMoralisDapp } from "../../../providers/MoralisDappProvider/MoralisDappProvider"
import { Moralis } from 'moralis'
import Image from 'next/image'
import loader from '../../../public/loader2.gif'
import ErrorMessage from "../../Alerts/ErrorMessage"
import TransactionMessage from "../../Alerts/TransactionMessage"


const FuncWriteCutReceiverFactory = ({ children, name, newReceiver, isDisabled, ...props }) => {

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

  const executeFunction = async () => {
    sendOptions.params = {
      _newReceiver: newReceiver.current.value
    }
    try {
      setIsFetching(true)
      setError(null)
      setIsModalOpen(false)
      const transaction = await Moralis.executeFunction(sendOptions)
      console.log(transaction.hash)
      const receipt = await transaction.wait()
      setData(receipt)
      setIsFetching(false)
      setIsModalOpen(true)
    } catch (error) {
      setError(error.message)
      setIsFetching(false)
    }
  }

  return (
    <>
      {error && <ErrorMessage error={error} setError={setError} />}
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

export default FuncWriteCutReceiverFactory
