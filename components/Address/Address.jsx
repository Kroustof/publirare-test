import React, { useState, useEffect } from 'react'
import { CheckIcon, DocumentDuplicateIcon } from "@heroicons/react/outline"
import { useMoralis } from "react-moralis"
import Blockie from "../Blockie"
import { getEllipsisTxt } from "../../helpers/formatters"


const Address = (props) => {

  const { account, isAuthenticated } = useMoralis()
  const [address, setAddress] = useState()
  const [isClicked, setIsClicked] = useState(false)

  useEffect(() => {
    setAddress(props?.address || (isAuthenticated && account))
  }, [account, isAuthenticated, props])

  const Copy = () => (
    <button 
      type="button"
      className="group relative text-sky-500 hover:text-sky-600"
      onClick={() => {
        navigator.clipboard.writeText(address)
        setIsClicked(true)
        setTimeout(() => setIsClicked(false), 3000)
      }}
    >
      <DocumentDuplicateIcon className="w-6 h-6" />
      <title className="absolute -top-5 text-sm text-black font-semibold">Copy Address</title>
    </button>
  ) 



  if (!address) {
    return (
      <span className="relative w-10 h-10 shadow rounded-full bg-slate-400 overflow-hidden" />
    )
  }

  return (
    <div className="flex items-center">
      {/* ::Avatar - left side option */}
      {props.avatar === "left" &&
        <span className="flex-shrink-0 relative w-10 h-10 flex justify-center items-center shadow rounded-full bg-slate-400 overflow-hidden">
          <Blockie currentWallet scale={5} />
        </span>
      }
      {/* ::Address */}
      <p className="mx-4">
        {props.sizeLeft && props.sizeRight 
          ? getEllipsisTxt(address, props.sizeLeft, props.sizeRight) 
          : address
        }
      </p>
      {/* ::Avatar - right side option */}
      {props.avatar === "right" &&
        <span className="flex-shrink-0 relative w-10 h-10 flex justify-center items-center shadow rounded-full bg-slate-400 overflow-hidden">
          <Blockie currentWallet scale={5} />
        </span>
      }
      {/* ::Copy clipboard */}
      {props.copyable && (
        isClicked 
          ? <p className="flex items-center">
              <CheckIcon className="w-5 h-5 text-green-500" /> 
              <span className="text-sm text-black font-bold">copied!</span>
            </p>
          : <Copy />
      )}
    </div>
  )
}

export default Address
