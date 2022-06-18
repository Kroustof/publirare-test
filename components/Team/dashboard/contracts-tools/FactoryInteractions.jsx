import React from 'react'
import { DocumentSearchIcon, ChipIcon, ExclamationIcon } from "@heroicons/react/outline"
import FuncWriteCutReceiverFactory from "../../../Functions/Factory/FuncWriteCutReceiverFactory"
import FuncWriteCutFeeFactory from "../../../Functions/Factory/FuncWriteCutFeeFactory"
import FunctionCallFactory from "../../../Functions/Factory/FunctionCallFactory"


const FactoryInteractions = ({ newAddressFactoryCutRef, newCutFeeFactoryRef, functionFactoryArr }) => {
  return (
    <div className="py-4 px-2 w-full grid grid-cols-2 gap-5 border border-gray-200 rounded">

      {/* ::Change Factory Cut Receiver Address */}
      <div className="col-span-full md:col-span-1 group relative">
        <h4 className="inline-flex items-center text-sm text-gray-500 font-semibold">
          <ChipIcon className="mr-2 w-5 h-5" />
          {functionFactoryArr[0].title}
        </h4>
        <div className="flex flex-col sm:flex-row sm:items-end">
          <span className="flex-grow">
            <label htmlFor="address-cut-receiver" className="sr-only">new factory cut address</label>
            <input
              type="text" id="address-cut-receiver" name="address-cut-receiver"
              ref={newAddressFactoryCutRef}
              placeholder="new address for Factory cut"
              className="form-input mt-0.5 w-full max-w-xs sm:max-w-none block shadow-sm rounded border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            />
          </span>
          <FuncWriteCutReceiverFactory
            name={functionFactoryArr[0].functionName}
            newReceiver={newAddressFactoryCutRef}
            className="flex-shrink-0 mt-1 sm:mt-0 sm:ml-3 relative min-w-[120px] max-w-xs inline-flex justify-center items-center px-3.5 py-2 shadow-sm rounded border border-transparent bg-red-100 text-sm text-red-700 font-medium hover:bg-red-700 hover:text-white"
          >
            <ExclamationIcon className="inline mr-2 w-5 h-5" />
            Change
          </FuncWriteCutReceiverFactory>
        </div>
        <span className="absolute -bottom-4 right-1/2 sm:right-4 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transform translate-x-1/2 sm:translate-x-0">{functionFactoryArr[0].authorized}</span>
      </div>

      {/* ::Change Factory Cut Fee Bips */}
      <div className="col-span-full md:col-span-1 group relative">
        <h4 className="inline-flex items-center text-sm text-gray-500 font-semibold">
          <ChipIcon className="mr-2 w-5 h-5" />
          {functionFactoryArr[1].title}
        </h4>
        <div className="flex flex-col sm:flex-row sm:items-end">
          <span className="flex-grow">
            <label htmlFor="cut-in-bips" className="sr-only">new cut fee in bips</label>
            <input 
              type="number" id="cut-in-bips" name="cut-in-bips"
              ref={newCutFeeFactoryRef}
              min={100} max={5000}
              placeholder="1% equal 100 Bips"
              className="form-input mt-0.5 w-full max-w-xs sm:max-w-none block shadow-sm rounded border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            />
          </span>
          <FuncWriteCutFeeFactory
            name={functionFactoryArr[1].functionName}
            cutInBips={newCutFeeFactoryRef}
            className="flex-shrink-0 mt-1 sm:mt-0 sm:ml-3 relative min-w-[120px] max-w-xs inline-flex justify-center items-center px-3.5 py-2 shadow-sm rounded border border-transparent bg-gray-400 text-sm text-gray-100 font-medium hover:bg-gray-700 hover:text-white"
          >
            Change
          </FuncWriteCutFeeFactory>
        </div>
        <span className="absolute -bottom-4 right-1/2 sm:right-4 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transform translate-x-1/2 sm:translate-x-0">{functionFactoryArr[1].authorized}</span>
      </div>

      {/* ::Pause Factory Smart Contract */}
      <div className="col-span-full md:col-span-1 group relative">
        <h4 className="inline-flex items-center text-sm text-gray-500 font-semibold">
          <DocumentSearchIcon className="mr-2 w-5 h-5" />
          {functionFactoryArr[2].title}
        </h4>
        <div className="mt-1 flex flex-col sm:flex-row sm:justify-end sm:items-end sm:bg-gray-50">
          <FunctionCallFactory
            name={functionFactoryArr[2].functionName}
            className="flex-shrink-0 relative min-w-[120px] max-w-xs inline-flex justify-center items-center px-3.5 py-2 shadow-sm rounded border border-transparent bg-red-100 text-sm text-red-700 font-medium hover:bg-red-700 hover:text-white"
          >
            <ExclamationIcon className="inline mr-2 w-5 h-5" />
            Pause
          </FunctionCallFactory>
        </div>
        <span className="absolute -bottom-4 right-1/2 sm:right-4 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transform translate-x-1/2 sm:translate-x-0">{functionFactoryArr[2].authorized}</span>
      </div>

      {/* ::Unpause Factory Smart Contract */}
      <div className="col-span-full md:col-span-1 group relative">
        <h4 className="inline-flex items-center text-sm text-gray-500 font-semibold">
          <DocumentSearchIcon className="mr-2 w-5 h-5" />
          {functionFactoryArr[3].title}
        </h4>
        <div className="mt-1 flex flex-col sm:flex-row sm:justify-end sm:items-end sm:bg-gray-50">
          <FunctionCallFactory
            name={functionFactoryArr[3].functionName}
            className="flex-shrink-0 relative min-w-[120px] max-w-xs inline-flex justify-center items-center px-3.5 py-2 shadow-sm rounded border border-transparent bg-gray-400 text-sm text-gray-50 font-medium hover:bg-gray-700 hover:text-white"
          >
            Unpause
          </FunctionCallFactory>
        </div>
        <span className="absolute -bottom-4 right-1/2 sm:right-4 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transform translate-x-1/2 sm:translate-x-0">{functionFactoryArr[3].authorized}</span>
      </div>

      {/* ::Get Factory Cut Recipient Address */}
      <div className="col-span-full md:col-span-1 group relative">
        <h4 className="inline-flex items-center text-base text-sky-500 text-opacity-70 font-semibold">
          <DocumentSearchIcon className="mr-2 w-5 h-5" />
          {functionFactoryArr[4].title}
        </h4>
        <div className="mt-1 flex flex-col sm:flex-row sm:justify-end sm:items-end sm:bg-gray-50">
          <FunctionCallFactory
            name={functionFactoryArr[4].functionName}
            className="flex-shrink-0 relative min-w-[120px] max-w-xs inline-flex justify-center items-center px-3.5 py-2 shadow-sm rounded border border-transparent bg-sky-100 text-sm text-sky-700 font-medium hover:bg-sky-700 hover:text-white"
          >
            Get Receiver
          </FunctionCallFactory>
        </div>
        <span className="absolute -bottom-4 right-1/2 sm:right-4 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transform translate-x-1/2 sm:translate-x-0">{functionFactoryArr[4].authorized}</span>
      </div>

      {/* ::Get Factory Cut Fee */}
      <div className="col-span-full md:col-span-1 group relative">
        <h4 className="inline-flex items-center text-base text-sky-500 text-opacity-70 font-semibold">
          <DocumentSearchIcon className="mr-2 w-5 h-5" />
          {functionFactoryArr[5].title}
        </h4>
        <div className="mt-1 flex flex-col sm:flex-row sm:justify-end sm:items-end sm:bg-gray-50">
          <FunctionCallFactory
            name={functionFactoryArr[5].functionName}
            className="flex-shrink-0 relative min-w-[120px] max-w-xs inline-flex justify-center items-center px-3.5 py-2 shadow-sm rounded border border-transparent bg-sky-100 text-sm text-sky-700 font-medium hover:bg-sky-700 hover:text-white"
          >
            Get Cut
          </FunctionCallFactory>
        </div>
        <span className="absolute -bottom-4 right-1/2 sm:right-4 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transform translate-x-1/2 sm:translate-x-0">{functionFactoryArr[5].authorized}</span>
      </div>

    </div>
  )
}

export default FactoryInteractions
