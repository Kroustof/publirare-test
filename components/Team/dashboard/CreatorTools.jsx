import React, { useRef, useState } from 'react'
import { AdjustmentsIcon, CheckIcon, RefreshIcon, StarIcon, UserAddIcon, XIcon } from "@heroicons/react/solid"
import { Moralis } from 'moralis'
import Image from 'next/image'
import loader from '../../../public/loader2.gif'
import { getEllipsisTxt } from "../../../helpers/formatters"
import { ChipIcon, DatabaseIcon, DocumentSearchIcon, EyeIcon, EyeOffIcon } from "@heroicons/react/outline"
import FuncWriteWhitelistStore from "../../Functions/Store/FuncWriteWhitelistStore"
import FuncReadWhitelistStore from "../../Functions/Store/FuncReadWhitelistStore"
import FuncWriteWhitelistFactory from "../../Functions/Factory/FuncWriteWhitelistFactory"
import FuncReadWhitelistFactory from "../../Functions/Factory/FuncReadWhitelistFactory"


const CreatorTools = ({ isDataLoading, setIsDataLoading }) => {

  //! Status = pending | confirmed | certified | rejected | banned

  const filters = [
    { id: 1, value: "isPending", label: "Pending", dataKey: "status", dataValue: "pending" },
    { id: 2, value: "isConfirmed", label: "Confirmed", dataKey: "status", dataValue: "confirmed" },
    { id: 3, value: "isCertified", label: "Certified", dataKey: "status", dataValue: "certified" },
    { id: 4, value: "isRejected", label: "Rejected", dataKey: "status", dataValue: "rejected" },
    { id: 5, value: "isProcessing", label: "Processing", dataKey: "status", dataValue: "processing" },
    { id: 6, value: "isPremium", label: "Premium", dataKey: "isPremium", dataValue: true },
    { id: 7, value: "isStoreBlacklisted", label: "Store blacklisted", dataKey: "isBlacklistedStore", dataValue: true },
    { id: 8, value: "isFactoryWhitelisted", label: "Factory whitelisted", dataKey: "isWhitelistedFactory", dataValue: true },
    { id: 9, value: "onlyEditors", label: "Only Editors", dataKey: "isEditor", dataValue: true },
    { id: 10, value: "onlyAuthors", label: "Only Authors", dataKey: "isEditor", dataValue: false },
    { id: 11, value: "isEmailNotVerified", label: "Email Not Verified", dataKey: "emailVerified", dataValue: false },
    { id: 12, value: "all", label: "All" },
  ]

  const [filterSelected, setFilterSelected] = useState(-1)
  const [countResults, setCountResults] = useState(null)
  const [creatorResults, setCreatorResults] = useState(null)
  const [displayedData, setDisplayedData] = useState(null)
  const [showDetails, setShowDetails] = useState(true)
  const [error, setError] = useState(null)

  const addressToAddSWRef = useRef("")
  const addressToRemoveSWRef = useRef("")
  const addressToCheckSWRef = useRef("")
  const addressToAddFWRef = useRef("")
  const addressToRemoveFWRef = useRef("")
  const addressToCheckFWRef = useRef("")
  const addressToStatusRef = useRef("")

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

  const selectCreator = async (creatorId, index) => {
    resetInputs()
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
    setDisplayedData(data)
    addressToAddSWRef.current.value = data.creator.mainAccount
    addressToRemoveSWRef.current.value = data.creator.mainAccount
    addressToCheckSWRef.current.value = data.creator.mainAccount
    addressToCheckFWRef.current.value = data.creator.mainAccount
    addressToRemoveFWRef.current.value = data.creator.mainAccount
    if (data.creator.isPremium) {
      addressToAddFWRef.current.value = data.creator.mainAccount
    }
    addressToStatusRef.current.value = data.creator.mainAccount
  }

  const resetInputs = () => {
    addressToAddSWRef.current.value = ""
    addressToRemoveSWRef.current.value = ""
    addressToCheckSWRef.current.value = ""
    addressToAddFWRef.current.value = ""
    addressToRemoveFWRef.current.value = ""
    addressToCheckFWRef.current.value = ""
  }

  const clickChangeStatus = async (newStatus) => {

    const Creator = Moralis.Object.extend("Creator")
    const queryCreator = new Moralis.Query(Creator)

    if (displayedData.creator.status === "pending") return setError("Cannot modified pending status. Please click on 'add creator to store whitelist' or 'factory whitelist' to change it to 'confirmed'.")
    if (displayedData.creator.status === "rejected") return setError("Cannot modified rejected status. Please click on 'add creator to store whitelist' or 'factory whitelist' to change it to 'confirmed'.")
    if (displayedData.creator.status === "banned") return setError("Cannot modified banned status. Please click on 'add creator to store whitelist' or 'factory whitelist' to change it to 'confirmed'.")

    const creator = await queryCreator.get(displayedData.id)

    if (newStatus === "certified") {
      creator.set("status", "certified")
      await creator.save()
      console.log("Creator status changed to 'certified'");
    }
    if (newStatus === "confirmed") {
      creator.set("status", "confirmed")
      await creator.save()
      console.log("Creator status changed to 'confirmed'");
    }
    if (newStatus === "banned") {
      const User = Moralis.Object.extend("_User")
      const queryUser = new Moralis.Query(User)
      const user = await queryUser.get(creator.attributes.parentUser.id)

      creator.set("status", "banned")
      user.set("isCreator", false)
      await creator.save()
      await user.save()
      console.log("Creator status changed to 'banned' and 'isCreator' user status set to false");
    }
  }


  return (
    <div className="mx-auto w-full max-w-7xl flex flex-col">

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
              className="form-select w-56 rounded border border-gray-200 bg-gray-100 text-sm text-gray-600 focus:border-sky-500 focus:ring-sky-500"
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
          <CheckIcon className="mr-2 w-5 text-sky-500 group-hover:text-sky-200"/>
          Update
        </button>
        {/* ::Refresh Button */}
        <button 
          type="button"
          disabled={creatorResults === null}
          onClick={updateData}
          className="ml-3 text-sky-500 cursor-pointer hover:text-sky-700"
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
          <thead className="min-w-full bg-sky-600 text-left text-white">
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
                      <StarIcon className={`w-5 h-5 ${creator.get("isPremium") ? "text-sky-500" : "text-gray-300"}`} />
                    </td>
                    <td className="py-3 px-4 text-base text-gray-700 font-medium">
                      <span className="flex justify-center items-center space-x-4">
                        {/* ::::display details */}
                        <button type="button" onClick={() => selectCreator(creator.id, index)} >
                          <AdjustmentsIcon className="w-5 h-5 text-gray-400 hover:text-sky-600" />
                        </button>
                        {/* ::::quick confirm account */}
                        <button 
                          type="button" 
                          onClick={() => confirmCreator(creator.id)} 
                          disabled={creator.get("status") !== "pending"} 
                          className="text-gray-400 hover:text-sky-600 disabled:hover:text-gray-400"
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
      <h3 className="mt-10 text-lg text-gray-500 text-opacity-50 font-extrabold uppercase tracking-wide">Creator Details</h3>
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
                              ? <span className="text-black font-semibold">{creator[key].toString()}</span>
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
                              ? <span className="text-black font-semibold">{user[key].toString()}</span>
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


      {/* :CREATOR STATUS  */}
      <h3 className="mt-10 text-lg text-gray-500 text-opacity-50 font-extrabold uppercase tracking-wide">CREATOR CERTIFICATION</h3>
      <div className="py-3 px-2 w-full grid grid-cols-2 gap-5 border border-gray-200 rounded">

        {/* ::Change Creator Status */}
        <div className="col-span-full">
          <h4 className="inline-flex items-center text-sm text-gray-500 font-semibold">
            <DatabaseIcon className="mr-2 w-5 h-5" />
            Cerified creator status
          </h4>
          <div className="flex flex-col sm:flex-row sm:items-end">
            <span className="flex-grow">
              <label htmlFor="address" className="sr-only">address</label>
              <input
                type="text" id="address" name="address"
                ref={addressToStatusRef}
                disabled={displayedData && !displayedData.creator.isEditor}
                placeholder="user account address"
                className="form-input mt-0.5 w-full block shadow-sm rounded border-gray-200 bg-gray-50 text-sm text-gray-400 placeholder-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              />
            </span>
            <button 
              type="button"
              onClick={() => clickChangeStatus("certified")}
              className="flex-shrink-0 mt-1 sm:mt-0 sm:ml-3 relative min-w-[120px] max-w-xs inline-flex justify-center items-center px-3.5 py-2 shadow-sm rounded border border-transparent bg-gray-400 text-sm text-gray-100 font-medium hover:bg-gray-700 hover:text-white"
            >
              Certify
            </button>
            <button 
              type="button"
              onClick={() => clickChangeStatus("confirmed")} 
              className="flex-shrink-0 mt-1 sm:mt-0 sm:ml-3 relative min-w-[120px] max-w-xs inline-flex justify-center items-center px-3.5 py-2 shadow-sm rounded border border-transparent bg-gray-400 text-sm text-gray-100 font-medium hover:bg-gray-700 hover:text-white"
            >
              Confirm
            </button>
            <button 
              type="button" 
              onClick={() => clickChangeStatus("banned")}
              className="flex-shrink-0 mt-1 sm:mt-0 sm:ml-3 relative min-w-[120px] max-w-xs inline-flex justify-center items-center px-3.5 py-2 shadow-sm rounded border border-transparent bg-red-100 text-sm text-red-700 font-medium hover:bg-red-700 hover:text-white"
            >
              Ban
            </button>
          </div>
        </div>

      </div>

      {/* :STORE INTERACTIONS */}
      <h3 className="mt-10 text-lg text-gray-500 text-opacity-50 font-extrabold uppercase tracking-wide">STORE INTERACTIONS</h3>
      <div className="py-3 px-2 w-full grid grid-cols-2 gap-5 border border-gray-200 rounded">

        {/* ::Add to Store Whitelisted */}
        <div className="col-span-full md:col-span-1">
          <h4 className="inline-flex items-center text-sm text-gray-500 font-semibold">
            <ChipIcon className="mr-2 w-5 h-5" />
            Add creator to Store whitelist
          </h4>
          <div className="flex flex-col sm:flex-row sm:items-end">
            <span className="flex-grow">
              <label htmlFor="address" className="sr-only">address</label>
              <input
                type="text" id="address" name="address"
                ref={addressToAddSWRef}
                disabled={displayedData && !displayedData.creator.isEditor}
                placeholder="user account address"
                className="form-input mt-0.5 w-full block shadow-sm rounded border-gray-200 bg-gray-50 text-sm text-gray-400 placeholder-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              />
            </span>
            <FuncWriteWhitelistStore
              name="addToWhitelist"
              userAddress={addressToAddSWRef}
              isDisabled={displayedData && displayedData.user.isBlacklisted}
              className="flex-shrink-0 mt-1 sm:mt-0 sm:ml-3 relative min-w-[120px] max-w-xs inline-flex justify-center items-center px-3.5 py-2 shadow-sm rounded border border-transparent bg-gray-400 text-sm text-gray-100 font-medium hover:bg-gray-700 hover:text-white"
            >
              Add
            </FuncWriteWhitelistStore>
          </div>
        </div>

        {/* ::Remove from Store Whitelisted */}
        <div className="col-span-full md:col-span-1">
          <h4 className="inline-flex items-center text-sm text-gray-500 font-semibold">
            <ChipIcon className="mr-2 w-5 h-5" />
            Remove creator from Store whitelist
          </h4>
          <div className="flex flex-col sm:flex-row sm:items-end">
            <span className="flex-grow">
              <label htmlFor="address" className="sr-only">address</label>
              <input
                type="text" id="address" name="address"
                ref={addressToRemoveSWRef}
                disabled={displayedData && !displayedData.creator.isEditor}
                placeholder="user account address"
                className="form-input mt-0.5 w-full block shadow-sm rounded border-gray-200 bg-gray-50 text-sm text-gray-400 placeholder-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              />
            </span>
            <FuncWriteWhitelistStore
              name="removeFromWhitelist"
              userAddress={addressToRemoveSWRef}
              className="flex-shrink-0 mt-1 sm:mt-0 sm:ml-3 relative min-w-[120px] max-w-xs inline-flex justify-center items-center px-3.5 py-2 shadow-sm rounded border border-transparent bg-gray-400 text-sm text-gray-100 font-medium hover:bg-gray-700 hover:text-white"
            >
              Remove
            </FuncWriteWhitelistStore>
          </div>
        </div>

        {/* ::Check creator is Whitelisted on Store */}
        <div className="col-span-full md:col-span-1">
          <h4 className="inline-flex items-center text-base text-sky-500 text-opacity-70 font-semibold">
            <DocumentSearchIcon className="mr-2 w-5 h-5" />
            Is address whitelisted on Store ?
          </h4>
          <div className="flex flex-col sm:flex-row sm:items-end">
            <span className="flex-grow">
              <label htmlFor="address" className="sr-only">address</label>
              <input
                type="text" id="address" name="address"
                ref={addressToCheckSWRef}
                placeholder="user account address"
                className="form-input mt-0.5 w-full block shadow-sm rounded border-gray-200 bg-gray-50 text-sm text-gray-400 placeholder-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </span>
            <FuncReadWhitelistStore
              name="isWhitelisted"
              userAddress={addressToCheckSWRef}
              className="flex-shrink-0 mt-1 sm:mt-0 sm:ml-3 relative min-w-[120px] max-w-xs inline-flex justify-center items-center px-3.5 py-2 shadow-sm rounded border border-transparent bg-sky-100 text-sm text-sky-700 font-medium hover:bg-sky-700 hover:text-white"
            >
              Check
            </FuncReadWhitelistStore>
          </div>
        </div>

      </div>


      {/* :FACTORY INTERACTIONS */}
      <h3 className="mt-10 text-lg text-gray-500 text-opacity-50 font-extrabold uppercase tracking-wide">FACTORY INTERACTIONS</h3>
      <div className="py-3 px-2 w-full grid grid-cols-2 gap-5 border border-gray-200 rounded">

        {/* ::Add to Factory Whitelisted */}
        <div className="col-span-full md:col-span-1">
          <h4 className="inline-flex items-center text-sm text-gray-500 font-semibold">
            <ChipIcon className="mr-2 w-5 h-5" />
            Add creator to Factory whitelist
          </h4>
          <div className="flex flex-col sm:flex-row sm:items-end">
            <span className="flex-grow">
              <label htmlFor="address" className="sr-only">address</label>
              <input
                type="text" id="address" name="address"
                ref={addressToAddFWRef}
                disabled={displayedData && !displayedData.creator.isPremium}
                placeholder="user account address"
                className="form-input mt-0.5 w-full block shadow-sm rounded border-gray-200 bg-gray-50 text-sm text-gray-400 placeholder-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              />
            </span>
            <FuncWriteWhitelistFactory
              name="addToWhitelist"
              userAddress={addressToAddFWRef}
              isDisabled={displayedData && (displayedData.user.isBlacklisted || !displayedData.creator.isPremium)}
              className="flex-shrink-0 mt-1 sm:mt-0 sm:ml-3 relative min-w-[120px] max-w-xs inline-flex justify-center items-center px-3.5 py-2 shadow-sm rounded border border-transparent bg-gray-400 text-sm text-gray-100 font-medium hover:bg-gray-700 hover:text-white"
            >
              Add
            </FuncWriteWhitelistFactory>
          </div>
        </div>

        {/* ::Remove from Factory Whitelisted */}
        <div className="col-span-full md:col-span-1">
          <h4 className="inline-flex items-center text-sm text-gray-500 font-semibold">
            <ChipIcon className="mr-2 w-5 h-5" />
            Remove creator from Factory whitelist
          </h4>
          <div className="flex flex-col sm:flex-row sm:items-end">
            <span className="flex-grow">
              <label htmlFor="address" className="sr-only">address</label>
              <input
                type="text" id="address" name="address"
                ref={addressToRemoveFWRef}
                placeholder="user account address"
                disabled={displayedData && !displayedData.creator.isEditor}
                className="form-input mt-0.5 w-full block shadow-sm rounded border-gray-200 bg-gray-50 text-sm text-gray-400 placeholder-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              />
            </span>
            <FuncWriteWhitelistFactory
              name="removeFromWhitelist"
              userAddress={addressToRemoveFWRef}
              className="flex-shrink-0 mt-1 sm:mt-0 sm:ml-3 relative min-w-[120px] max-w-xs inline-flex justify-center items-center px-3.5 py-2 shadow-sm rounded border border-transparent bg-gray-400 text-sm text-gray-100 font-medium hover:bg-gray-700 hover:text-white"
            >
              Remove
            </FuncWriteWhitelistFactory>
          </div>
        </div>

        {/* ::Check creator is Whitelisted on Factory */}
        <div className="col-span-full md:col-span-1">
          <h4 className="inline-flex items-center text-base text-sky-500 text-opacity-70 font-semibold">
            <DocumentSearchIcon className="mr-2 w-5 h-5" />
            Is address whitelisted on Factory ?
          </h4>
          <div className="flex flex-col sm:flex-row sm:items-end">
            <span className="flex-grow">
              <label htmlFor="address" className="sr-only">address</label>
              <input
                type="text" id="address" name="address"
                ref={addressToCheckFWRef}
                placeholder="user account address"
                className="form-input mt-0.5 w-full block shadow-sm rounded border-gray-200 bg-gray-50 text-sm text-gray-400 placeholder-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </span>
            <FuncReadWhitelistFactory
              name="isWhitelisted"
              userAddress={addressToCheckFWRef}
              className="flex-shrink-0 mt-1 sm:mt-0 sm:ml-3 relative min-w-[120px] max-w-xs inline-flex justify-center items-center px-3.5 py-2 shadow-sm rounded border border-transparent bg-sky-100 text-sm text-sky-700 font-medium hover:bg-sky-700 hover:text-white"
            >
              Check
            </FuncReadWhitelistFactory>
          </div>
        </div>

      </div>

    </div>
  )
}

export default CreatorTools
