import React, { useState } from 'react'
import { Moralis } from 'moralis';
import { DatabaseIcon } from "@heroicons/react/outline"
import SuccessMessage from "../../../Alerts/SuccessMessage";
import ErrorMessage from "../../../Alerts/ErrorMessage";


const StatusInteractions = ({ displayedData, inputRef }) => {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [successMsg, setSuccessMsg] = useState(null)
  const [error, setError] = useState(null)

  const clickChangeStatus = async (newStatus) => {
    setIsModalOpen(false)
    try {
      const Creator = Moralis.Object.extend("Creator")
      const queryCreator = new Moralis.Query(Creator)
  
      if (displayedData.creator.status === "pending") return setError("Cannot modified pending status. Please click on 'add creator to store whitelist' or 'factory whitelist' to change it to 'confirmed'.")
      if (displayedData.creator.status === "rejected") return setError("Cannot modified rejected status. Please click on 'add creator to store whitelist' or 'factory whitelist' to change it to 'confirmed'.")
      if (displayedData.creator.status === "banned") return setError("Cannot modified banned status. Please click on 'add creator to store whitelist' or 'factory whitelist' to change it to 'confirmed'.")
  
      const creator = await queryCreator.get(displayedData.id)
  
      if (newStatus === "certified") {
        creator.set("status", "certified")
        await creator.save()
        setSuccessMsg("Creator status has been changed to 'certified'")
        setIsModalOpen(true)
      }
      if (newStatus === "confirmed") {
        creator.set("status", "confirmed")
        await creator.save()
        setSuccessMsg("Creator status has been changed to 'confirmed'")
        setIsModalOpen(true)
      }
      if (newStatus === "banned") {
        const User = Moralis.Object.extend("_User")
        const queryUser = new Moralis.Query(User)
        const user = await queryUser.get(creator.attributes.parentUser.id)
  
        creator.set("status", "banned")
        user.set("isCreator", false)
        await creator.save()
        await user.save()
        setSuccessMsg("Creator status has been changed to 'banned' and 'isCreator' user status set to false")
        setIsModalOpen(true)
      }
    } catch (error) {
      console.log(error);
      setError(error)
    }
  }

  return (
    <div className="w-full grid grid-cols-2 gap-5">

      {/* ::Error Message */}
      {error && <ErrorMessage error={error} />}
      {/* ::Success Message */}
      {successMsg && <SuccessMessage isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} message={successMsg} />}
      

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
              ref={inputRef}
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
  )
}

export default StatusInteractions
