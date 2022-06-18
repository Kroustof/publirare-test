import React, { useState } from 'react'
import ErrorMessage from "../../Alerts/ErrorMessage"


const FactoryTools = ({ isDataLoading, setIsDataLoading }) => {

  const [error, setError] = useState(null)

  return (
    <div className="mx-auto w-full max-w-7xl flex flex-col">
      
      {/* ::Error Message */}
      {error && <ErrorMessage error={error} setError={setError} />}

      {/* :TITLE */}
      <h2 className="text-2xl text-gray-700 font-bold">Factory Actions</h2>

    </div>
  )
}

export default FactoryTools
