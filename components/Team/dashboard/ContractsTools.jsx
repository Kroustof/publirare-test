import React, { useRef, useState } from 'react'
import { ChipIcon, DocumentSearchIcon } from "@heroicons/react/outline"
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid"
import ErrorMessage from "../../Alerts/ErrorMessage"
import FactoryInteractions from "./contracts-tools/FactoryInteractions"


const ContractsTools = ({ isDataLoading, setIsDataLoading, memberInfos }) => {

  //! STATES
  const [error, setError] = useState(null)
  const [displayActions, setDisplayActions] = useState({
    factory: {
      isDisplayed: false,
      functions: [
        { id: 1, title:"Change recipient address for Factory cut", functionName:"setCutReceiver", type:"write", authorized:"OPERATOR_ROLE" },
        { id: 2, title:"Change Factory cut percentage (in Bips)", functionName:"setCutInBips", type:"write", authorized:"OPERATOR_ROLE" },
        { id: 3, title:"Pause Factory Smart Contract", functionName:"pause", type:"write", authorized:"PAUSER_ROLE" },
        { id: 4, title:"UnPause Factory Smart Contract", functionName:"unpause", type:"write", authorized:"PAUSER_ROLE" },
        { id: 5, title:"Get Factory cut recipient address", functionName:"_CUT_RECEIVER", type:"read", authorized:"OPERATOR_ROLE" },
        { id: 6, title:"Get Factory cut percentage", functionName:"_CUT_IN_BIPS", type:"read", authorized:"OPERATOR_ROLE" },
      ]
    }
  })

  //! INPUTS REF
  const newAddressFactoryCutRef = useRef("")
  const newCutFeeFactoryRef = useRef("")


  //! HELP FUNCTIONS
  const switchOpen = (contract) => {
    const currentDisplayState = displayActions[contract].isDisplayed
    setDisplayActions(prevState => ({...prevState, ...prevState.factory.isDisplayed = !currentDisplayState}))
  }
  console.log(displayActions);
  return (
    <div className="mx-auto w-full max-w-7xl flex flex-col">
      
      {/* ::Error Message */}
      {error && <ErrorMessage error={error} setError={setError} />}


      {/* :TITLE */}
      <h2 className="text-2xl text-gray-700 font-bold">Contracts Actions</h2>


      {/* :ACCESS DENIED */}
      {memberInfos.role !== "MasterChief" &&
        <div className="pt-20 flex flex-col justify-center items-center">
          <h3 className="text-xl text-red-700 font-extrabold uppercase">Access Restricted</h3>
          <p className="mt-3 text-sm text-gray-500 font-medium">You do not have the necessary rights to access this space.</p>
        </div>
      }


      {/* :ACCESS GRANTED */}
      {memberInfos.role === "MasterChief" &&
        <>
          {/* ::Factory */}
          <div className="mt-10 flex justify-between items-center">
            <h3 className="text-lg text-gray-500 text-opacity-50 font-extrabold uppercase tracking-wide">FACTORY CONTRACT ACTIONS</h3>
            <button
              type="button"
              onClick={() => switchOpen("factory")}
              className="px-3 inline-flex items-center text-sm text-teal-500 font-bold tracking-wide hover:text-gray-700"
            >
              {displayActions.factory.isDisplayed
                ? <>
                    <EyeOffIcon className="mr-2 w-5 h-5" /> 
                    Hide
                  </>
                : <>
                    <EyeIcon className="mr-2 w-5 h-5" /> 
                    Show
                  </>
              }
            </button>
          </div>
          <div className="mt-5 py-3 px-2 w-full border border-gray-200 rounded">
            <div className={`${displayActions.factory.isDisplayed && !isDataLoading ? "block" : "hidden"}`}>
              <FactoryInteractions
                newAddressFactoryCutRef={newAddressFactoryCutRef}
                newCutFeeFactoryRef={newCutFeeFactoryRef}
                functionFactoryArr={displayActions.factory.functions}
              />
            </div>
            <ul className={`flex flex-col space-y-2 ${displayActions.factory.isDisplayed && !isDataLoading ? "hidden" : "block"}`} aria-label="list of actions available">
              {displayActions.factory.functions.map(action => (
                <li 
                  key={action.id} 
                  className={`
                    inline-flex items-center text-sm text-gray-500 font-semibold
                    ${action.type === "read" ? "text-sky-500" : "text-gray-500"}
                  `}
                >
                  {action.type === "read" 
                    ? <DocumentSearchIcon className="mr-2 w-5 h-5" />
                    : <ChipIcon className="mr-2 w-5 h-5" />
                  }
                  {action.title}
                </li>
              ))
              }
            </ul>
          </div>
        </>
      }

    </div>
  )
}

export default ContractsTools
