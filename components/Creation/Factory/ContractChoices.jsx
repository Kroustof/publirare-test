import React, { useEffect, useState } from 'react'
import { Moralis } from "moralis";
import { useMoralis, useMoralisQuery } from "react-moralis";
import Image from "next/image";
import loader from '../../../public/loader2.gif'
import { getEllipsisTxt } from "../../../helpers/formatters";
import { CheckIcon, RefreshIcon } from "@heroicons/react/outline";


const ContractChoices = ({ selectedContract, setSelectedContract }) => {

  const { account } = useMoralis()

  const { fetch, data, error, isLoading } = useMoralisQuery(
    "FACTORYCreateNewContract",
    query =>
      query
        .equalTo("creator", account)
        .descending("contractName"),
    [],
    { autoFetch: true },
  )
  

  return (
    <div className="relative mt-3 mb-10 mx-auto w-full max-w-4xl max-h-64 border border-gray-200 rounded-md overflow-y-auto">

      {/* :DATA LOADING */}
      {isLoading &&
        <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
          <Image
            src={loader}
            alt="loading spinner"
          />
        </span>
      }


      {/* :ERROR */}
      {error && 
        <p className="absolute top-1/2 left-1/2 text-center text-base md:text-lg text-gray-400 font-bold tracking-wide transform -translate-y-1/2 -translate-x-1/2">
          <span className="block">Error data fetching!</span>
          <span className="text-sm text-gray-500">{error.message}</span>
          <span className="block">Change filter category or click refresh.</span>
        </p>
      }


      {/* :DATA FOUND */}
      {data
        ? <div className="py-2 h-full flex flex-col justify-between">
            <ul className="p-1">
              {data.map(collection => (
                <li 
                  key={collection.attributes.contractID} 
                  className={`
                    py-2 px-5 flex justify-between items-center space-x-4 text-sm 
                    ${selectedContract === collection.attributes.contractAddress
                        ? "bg-teal-50"
                        : "bg-transparent hover:bg-gray-100"
                    }
                  `}
                >
                  {/* ::Contract Name */}
                  <span className="w-52 flex items-center text-black font-semibold truncate">
                    {selectedContract === collection.attributes.contractAddress &&
                      <CheckIcon className="mr-2 w-6 h-6 text-teal-600" />
                    }
                    {collection.attributes.contractName}
                  </span>
                  {/* ::Contract Address */}
                  <span className="text-gray-500">{getEllipsisTxt(collection.attributes.contractAddress, 10, 5)}</span>
                  {/* ::Contract Type */}
                  <span className="text-teal-400">{collection.attributes.nftType}</span>
                  {/* ::Contract Creation */}
                  <span className="text-gray-500">{collection.attributes.createdAt.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  {/* ::Select Contract */}
                  <button
                    onClick={() => setSelectedContract(collection.attributes.contractAddress)}
                    className={`
                      relative inline-flex items-center px-2.5 py-1 rounded-full border border-transparent text-xs text-white font-medium
                      ${selectedContract === collection.attributes.contractAddress
                        ? "bg-gray-500"
                        : "bg-teal-500 hover:bg-teal-600"
                      }
                    `}
                  >
                    Select
                  </button>
                </li>
              ))
              }
            </ul>
            <span className="mt-8 flex justify-center">
              <button 
                onClick={() => fetch()}
                className="relative inline-flex items-center px-3.5 py-1 rounded-full border border-transparent bg-gray-400 text-sm text-white font-medium hover:bg-sky-500"
              >
                <RefreshIcon className="mr-2 w-3.5 h-3.5" />
                Refresh
              </button>
            </span>
          </div>
        : <p className="absolute top-1/2 left-1/2 text-center text-base md:text-lg text-gray-400 font-bold tracking-wide transform -translate-y-1/2 -translate-x-1/2">
            <span className="block">No contract found</span>
            <span className="block">Create a new contract or click refresh.</span>
          </p>
      }
    </div>
  )
}

export default ContractChoices
