import React, { useRef, useState } from 'react'
import { AdjustmentsIcon, CheckIcon, RefreshIcon, StarIcon, UserAddIcon, XIcon } from "@heroicons/react/solid"
import { Moralis } from 'moralis'
import Image from 'next/image'
import loader from '../../../public/loader2.gif'
import { getEllipsisTxt } from "../../../helpers/formatters"
import { ChipIcon, EyeIcon, EyeOffIcon } from "@heroicons/react/outline"
import { useWeb3ExecuteFunction } from "react-moralis"
import { useMoralisDapp } from '../../../providers/MoralisDappProvider/MoralisDappProvider'
import WriteFunctionStore from "../../Functions/WriteFunctionStore"


const CreatorTools = ({ isDataLoading, setIsDataLoading }) => {

  //! Status = pending | confirmed | certified | rejected

  const filters = [
    { id: 1, value: "isPending", label: "Pending", dataKey: "status", dataValue: "pending" },
    { id: 2, value: "isConfirmed", label: "Confirmed", dataKey: "status", dataValue: "confirmed" },
    { id: 3, value: "isCertified", label: "Certified", dataKey: "status", dataValue: "certified" },
    { id: 4, value: "isRejected", label: "Rejected", dataKey: "status", dataValue: "rejected" },
    { id: 5, value: "isPremium", label: "Premium", dataKey: "isPremium", dataValue: true },
    { id: 6, value: "isStoreBlacklisted", label: "Store blacklisted", dataKey: "isBlacklistedStore", dataValue: true },
    { id: 7, value: "isFactoryWhitelisted", label: "Factory whitelisted", dataKey: "isWhitelistedFactory", dataValue: true },
    { id: 8, value: "onlyEditors", label: "Only Editors", dataKey: "isEditor", dataValue: true },
    { id: 9, value: "onlyAuthors", label: "Only Authors", dataKey: "isEditor", dataValue: false },
    { id: 10, value: "isEmailNotVerified", label: "Email Not Verified", dataKey: "emailVerified", dataValue: false },
    { id: 11, value: "all", label: "All" },
  ]

  const [filterSelected, setFilterSelected] = useState(-1)
  const [countResults, setCountResults] = useState(null)
  const [creatorResults, setCreatorResults] = useState(null)
  const [displayedData, setDisplayedData] = useState(null)
  const [showDetails, setShowDetails] = useState(true)
  const [txData, setTxData] = useState({})

  const handleCreatorFilterChange = (e) => {
    const categoryIndex = filters.findIndex(category => category.value.toString() === e.target.value)
    console.log(e.target.value);
    console.log(categoryIndex);
    setFilterSelected(categoryIndex)
  }
  
  const updateData = async () => {
    setIsDataLoading(true)
    setDisplayedData(null)
    setCountResults(null)
    setCreatorResults(null)
    let searchKey = filters[filterSelected].dataKey
    let searchValue = filters[filterSelected].dataValue
    let isFetchAll = filterSelected === filters.findIndex(category => category.value === "all")

    const Creator = Moralis.Object.extend("Creator")
    const queryCreator = new Moralis.Query(Creator)
    
    if (isFetchAll) {
      const results = await queryCreator.find()
      const totalResults = await queryCreator.count()
      setCountResults(totalResults)
      setCreatorResults(results)
    } else {
      queryCreator.equalTo(searchKey, searchValue)
      const results = await queryCreator.find()
      const totalResults = await queryCreator.count()
      setCountResults(totalResults)
      setCreatorResults(results)
    }
    setIsDataLoading(false)
    // console.log("total results:", countResults);
  }
  
  const confirmCreator = async (creatorId) => {
    console.log(creatorId);
    const Creator = Moralis.Object.extend("Creator")
    const User = Moralis.Object.extend("_User")
    const queryCreator = new Moralis.Query(Creator)
    const queryUser = new Moralis.Query(User)

    const creator = await queryCreator.get(creatorId)
    const user = await queryUser.get(creator.attributes.parentUser.id)

    creator.set("status", "confirmed")
    user.set("isCreator", true)
    await creator.save()
    await user.save()
    alert(`Creator ${creatorId} status has been modified`);
  }

  const selectCreator = async (creatorId, index) => {
    const data = {}
    const selectedCreator = creatorResults[index]
    const Creator = Moralis.Object.extend("Creator")
    const User = Moralis.Object.extend("_User")
    const queryUser = new Moralis.Query(User)
    const queryCreator = new Moralis.Query(Creator)

    queryUser.get(selectedCreator.attributes.parentUser.id)
    queryCreator.get(creatorId)

    const user = await queryUser.first()
    const updatedCreator = await queryCreator.first()
    
    data.id = creatorId
    data.creator = updatedCreator.attributes
    data.user = user.attributes
    console.log(data.user);
    setDisplayedData(data)
  }

  const { contractABIs, contractAddrs } = useMoralisDapp()
  console.log(contractAddrs.store);
  const { data, error, fetch, isFetching, isLoading } = useWeb3ExecuteFunction({
    abi: contractABIs.store,
    contractAddress: contractAddrs.store,
    functionName: "addToWhitelist",
    params: {
      userAddress: "0x292c6313cb77a4810c2ba5f0fe6e2d7ad16c534d"
    }
  })
  const inputRef = useRef("")

  return (
    <div className="mx-auto px-1 sm:px-4 w-full max-w-7xl flex flex-col">

      {/* :TITLE */}
      <h2 className="text-2xl text-gray-700 font-bold">Creators List</h2>


      {/* :FILTERS BOX */}
      <div className="self-start my-4 py-2 sm:py-0 sm:pr-4 flex flex-wrap justify-center sm:justify-start items-center shadow rounded-md border border-gray-200 bg-white">
        {/* ::Title */}
        <div className="py-4 px-6 hidden sm:block h-full border-b border-gray-200 bg-gray-100">
          <h3 className="text-base text-gray-400 font-bold font-oswald tracking-wide">Filter</h3>
        </div>
        {/* ::Category Select */}
        <div className="mb-2 sm:mb-0 px-3 sm:px-6 flex items-center justify-center">
          <div>
            <label htmlFor="creators" className="sr-only">Creators filter</label>
            <select 
              name="creators"
              onChange={handleCreatorFilterChange}
              className="form-select w-56 rounded border border-gray-300 bg-gray-100 text-sm text-gray-600 focus:border-teal-500 focus:ring-teal-500"
            >
              <option value="" className="font-semibold">Select a filter category</option>
              {filters.map(category => (
                <option key={category.id} value={category.value}>{category.label}</option>
              ))
              }
            </select>
          </div>
        </div>
        {/* ::Update Button */}
        <button 
          type="button"
          disabled={filterSelected === -1}
          onClick={updateData}
          className="group relative inline-flex items-center px-5 py-2 shadow rounded-full border-2 border-gray-400 bg-white text-sm text-gray-600 font-semibold cursor-pointer hover:bg-gray-400 hover:text-white"
        >
          <CheckIcon className="mr-2 w-5 text-teal-500 group-hover:text-teal-200"/>
          Update
        </button>
        {/* ::Refresh Button */}
        <button 
          type="button"
          disabled={creatorResults === null}
          onClick={updateData}
          className="ml-3 text-teal-500 cursor-pointer hover:text-teal-700"
        >
          <RefreshIcon className="w-8 h-8" />
        </button>
      </div>


      {/* :TOTAL COUNT */}
      <p className={`mt-3 text-base font-semibold ${countResults ? "text-gray-700" : "text-gray-400"}`}>
        {countResults
          ? `Total result: ${countResults}` 
          : `Please launch your research`
        }
      </p>


      {/* :RESULT TABLE */}
      <div className="relative min-h-[200px] flex items-start rounded-md border border-gray-200 overflow-auto">

        {/* ::Table */}
        <table className="min-w-full overflow-hidden">
          {/* :::Table Head */}
          <thead className="min-w-full bg-teal-600 text-left text-white">
            <tr>
              {/* ::::number */}
              <th className="py-3 px-4 text-sm text-white font-semibold tracking-wide" scope="col">#</th>
              {/* ::::status */}
              <th className="py-3 px-4 text-sm text-white font-semibold tracking-wide" scope="col">Status</th>
              {/* ::::author or editor */}
              <th className="py-3 px-4 text-sm text-white font-semibold tracking-wide" scope="col">Type</th>
              {/* ::::account */}
              <th className="py-3 px-4 text-sm text-white font-semibold tracking-wide" scope="col">Account</th>
              {/* ::::name */}
              <th className="py-3 px-4 text-sm text-white font-semibold tracking-wide" scope="col">Name</th>
              {/* ::::editor */}
              <th className="py-3 px-4 text-sm text-white font-semibold tracking-wide" scope="col">Editor</th>
              {/* ::::email */}
              <th className="py-3 px-4 text-sm text-white font-semibold tracking-wide" scope="col">Email</th>
              {/* ::::blacklistsore | whitelistfactory | premium */}
              <th title="Store Whitelisted | Factory Whitelisted | Premium Account" className="py-3 px-4 text-center text-sm text-white font-semibold tracking-wide whitespace-nowrap" scope="col">S | F | P</th>
              {/* ::::actions */}
              <th className="py-3 px-4 text-center text-sm text-white font-semibold tracking-wide" scope="col">Actions</th>
            </tr>
          </thead>
          {/* :::Table Body */}
          <>
            {creatorResults && countResults > 0 && !isDataLoading &&
              <tbody>
                {creatorResults.map((creator, index) => (
                  <tr key={creator.id} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"} whitespace-nowrap`}>
                    <td className="py-3 px-4 text-base text-gray-700 font-medium">{index + 1}</td>
                    <td className="py-3 px-4 text-base text-gray-700 font-medium capitalize">{creator.get("status")}</td>
                    <td className="py-3 px-4 text-base text-gray-700 font-medium">
                      {`${creator.get("isEditor") ? "Editor" : "Author"}`}
                    </td>
                    <td className="py-3 px-4 text-base text-gray-700 font-medium" title={creator.get("mainAccount")}>{getEllipsisTxt(creator.get("mainAccount"), 4, 3)}</td>
                    <td className="py-3 px-4 text-base text-gray-700 font-medium capitalize">{`${creator.get("firstName")} ${creator.get("lastName")}`}</td>
                    <td className="py-3 px-4 text-base text-gray-700 font-medium">{creator.get("editorName")}</td>
                    <td className="py-3 px-4 text-base text-gray-700 font-medium">{creator.get("email")}</td>
                    <td className="py-3 px-4 flex justify-center items-center space-x-1 text-base text-gray-700 font-medium">
                      <CheckIcon className={`w-5 h-5 ${creator.get("isWhitelistedStore") ? "text-green-600" : "text-gray-300"}`} />
                      <span>|</span>
                      <CheckIcon className={`w-5 h-5 ${creator.get("isWhitelistedFactory") ? "text-green-600" : "text-gray-300"}`} />
                      <span>|</span>
                      <StarIcon className={`w-5 h-5 ${creator.get("isPremium") ? "text-teal-500" : "text-gray-300"}`} />
                    </td>
                    <td className="py-3 px-4 text-base text-gray-700 font-medium">
                      <span className="flex justify-center items-center space-x-4">
                        {/* ::::display details */}
                        <button type="button" onClick={() => selectCreator(creator.id, index)} >
                          <AdjustmentsIcon className="w-5 h-5 text-gray-400 hover:text-teal-600" />
                        </button>
                        {/* ::::quick confirm account */}
                        <button 
                          type="button" 
                          onClick={() => confirmCreator(creator.id)} 
                          disabled={creator.get("status") !== "pending"} 
                          className="text-gray-400 hover:text-teal-600 disabled:hover:text-gray-400"
                        >
                          <UserAddIcon className="w-5 h-5" />
                        </button>
                      </span>
                    </td>
                  </tr>
                ))
                }
              </tbody>
            }
          </>
        </table>

        {/* ::No Data Exceptions */}
        <div>
          {creatorResults === null && !isDataLoading
            ? <p className="absolute top-1/2 left-1/2 text-center text-base md:text-lg text-gray-400 font-bold tracking-wide transform -translate-y-1/2 -translate-x-1/2">Please select a filter category and update data</p>
            : isDataLoading
            ? <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                <Image
                  src={loader}
                  alt="loading spinner"
                />
              </div>
            : countResults === 0 && !isDataLoading
            
            ?  <p className="absolute top-1/2 left-1/2 text-center text-base md:text-lg text-gray-400 font-bold tracking-wide transform -translate-y-1/2 -translate-x-1/2">
                <span className="block">No data found.</span>
                <span className="block">Change filter category or click refresh.</span>
              </p>
            : null
          }
        </div>

      </div>

      
      {/* :CREATOR DETAILS */}
      <h3 className="mt-10 text-xl text-teal-500 text-opacity-50 font-extrabold uppercase tracking-wide">Creator Details</h3>
      <div className="py-3 px-2 w-full border border-gray-200 rounded">
        {displayedData && !isDataLoading
          ? <>
              <div className="flex flex-col">
                <div className="flex justify-between">
                  {/*:: User Ids */}
                  <p className="space-y-0.5 text-xs text-gray-700">
                    <span className="block"><b>Creator Id: </b>{displayedData.id}</span>
                    <span className="block"><b>User Id: </b>{displayedData.creator.parentUser.id}</span>
                  </p>
                  {/* ::Show or Hide details */}
                  <button 
                    type="button"
                    onClick={() => setShowDetails(!showDetails)}
                  >
                    {showDetails
                      ? <EyeOffIcon className="w-6 h-6 text-gray-500" />
                      : <EyeIcon className="w-6 h-6 text-gray-500" />
                    }
                  </button>
                </div>
                {/* ::Creator Infos  */}
                <div className={`${showDetails ? "block" : "hidden"}`}>
                  <h3 className="mt-3 text-base text-gray-500 font-semibold">Creator Infos</h3>
                  <div className="mt-1.5 flex flex-wrap basis-1/4">
                    {Object.keys(displayedData.creator)
                      .filter(key => key !== "parentUser")
                      .map(key => {
                        const creator = displayedData.creator
                        return (
                          <div key={key} className="my-1.5 mx-3 text-sm space-x-2">
                            <span className="text-gray-400">{key}:</span>
                            {(key === "createdAt") || (key === "updatedAt")
                              ? <span className="text-gray-700">{creator[key].toString().split(" ").slice(0, 5).join(" ")}</span>
                              : key === "accounts"
                              ? <ul className="inline-flex">
                                  {creator[key].map((account, index) => (
                                    <li key={index} className="mx-3 list-item list-disc text-gray-500">{account}</li>
                                  ))
                                  }
                                </ul>
                              : key === "mainAccount"
                              ? <span className="text-sky-600 font-semibold">{creator[key].toString()}</span>
                              : key === "status"
                              ? <span className="text-black font-bold">{`"${creator[key].toString()}"`}</span>
                              : <span className="text-gray-700">{`"${creator[key].toString()}"`}</span>
                            }
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
                {/* ::User Infos */}
                <div className={`${showDetails ? "block" : "hidden"}`}>
                  <h3 className="mt-3 text-base text-gray-500 font-semibold">User Infos</h3>
                  <div className="mt-1.5 flex flex-wrap basis-1/4">
                    {Object.keys(displayedData.user)
                      .filter(key => (key !== "childCreator") && (key !== "sessionToken") && (key !== "ACL") && (key !== "authData"))
                      .map(key => {
                        const user = displayedData.user
                        return (
                          <div key={key} className="my-1.5 mx-3 text-sm space-x-2">
                            <span className="text-gray-400">{key}:</span>
                            {(key === "createdAt") || (key === "updatedAt")
                              ? <span className="text-gray-700">{user[key].toString().split(" ").slice(0, 5).join(" ")}</span>
                              : key === "accounts"
                              ? <ul className="inline-flex">
                                  {user[key].map((account, index) => (
                                    <li key={index} className="mx-3 list-item list-disc text-gray-500">{account}</li>
                                  ))
                                  }
                                </ul>
                              : key === "ethAddress"
                              ? <span className="text-sky-600 font-semibold">{user[key].toString()}</span>
                              : <span className="text-gray-700">{`"${user[key].toString()}"`}</span>
                            }
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            </>

          : <p className="text-base text-gray-400 font-medium">No user data loaded</p>
        }
      </div>


      {/* :CONTRACTS INTERACTIONS */}
      <h3 className="mt-10 text-xl text-teal-500 text-opacity-50 font-extrabold uppercase tracking-wide">CONTRACTS INTERACTIONS</h3>
      <div className="py-3 px-2 w-full grid grid-cols-2 space-y-5 border border-gray-200 rounded">

        {/* ::Add Store Whitelisted */}
        <div className="col-span-1">
          <h4 className="inline-flex items-center text-base text-gray-500 font-semibold">
            <ChipIcon className="mr-2 w-5 h-5" />
            Add creator to Store whitelist
          </h4>
          <div className="flex items-end">
            <span className="flex-grow">
              <label htmlFor="address" className="text-sm text-gray-400 font-medium">address</label>
              <input
                type="text" id="address" name="address"
                ref={inputRef}
                defaultValue={displayedData && displayedData.creator.mainAccount}
                placeholder="Enter your name"
                className="form-input mt-0.5 w-full block shadow-sm rounded border-gray-300 bg-gray-50 text-sm placeholder-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </span>
            <WriteFunctionStore
              name="addToWhitelist"
              params={{ userAddress: inputRef.current.value }}
              setData={setTxData}
              className="flex-shrink-0 ml-3 relative inline-flex items-center px-3.5 py-2 shadow-sm rounded border border-transparent bg-teal-100 text-sm text-teal-700 font-medium hover:bg-teal-700 hover:text-white"
            >
              Add to whitelist
            </WriteFunctionStore>
          </div>
        </div>

      </div>

    </div>
  )
}

export default CreatorTools
