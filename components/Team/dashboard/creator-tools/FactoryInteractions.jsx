import React from 'react'
import { DocumentSearchIcon, ChipIcon } from "@heroicons/react/outline"
import FuncWriteWhitelistFactory from "../../../Functions/Factory/FuncWriteWhitelistFactory"
import FuncReadWhitelistFactory from "../../../Functions/Factory/FuncReadWhitelistFactory"


const FactoryInteractions = ({ addressToAddFWRef, addressToRemoveFWRef, addressToCheckFWRef, displayedData }) => {
  return (
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
  )
}

export default FactoryInteractions
