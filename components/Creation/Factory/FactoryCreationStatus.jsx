import { ClockIcon, ColorSwatchIcon } from "@heroicons/react/outline"
import { CheckCircleIcon } from "@heroicons/react/solid"

const FactoryCreationStatus = ({ steps, nftInfos, loadingState, isFatalError }) => {
  return (
    <div className="py-5 text-gray-500">
                  
      {/* :STEPS */}
      <div className="mt-10 mx-auto pt-5 pb-10 px-4 w-full max-w-5xl flex items-center">
        {/* :::Customization step */}
        <div className="relative w-44 max-w-xs hidden sm:flex items-center">
          <span className="absolute -top-5 flex items-center text-xs text-teal-400 font-medium whitespace-nowrap">
            <ColorSwatchIcon className="mr-2 w-4 h-4" />
            Customization
          </span>
          <span className="inline-block h-0.5 w-full bg-teal-300"/>
        </div>
        {/* :::Progress steps */}
        <div className="flex-1 w-full" aria-label="Progress steps">
          <ol className="flex items-center">
            {steps.map((step, index) => {
              const Icon = step.icon
              return(
                <li key={step.id} className={`${index === 0 ? "flex-grow-0" : "flex-grow"} relative flex justify-center items-center`}>
                  {/* ::::line connection */}
                  <span className={`inline-block h-0.5 w-full ${index === 0 && "hidden"} ${step.status !== "upcoming" ? "bg-teal-400" : "bg-gray-300"}`} />
                  {/* ::::step details */}
                  <div className={`
                    relative flex flex-col items-center 
                    ${(step.status === "current" && !isFatalError && loadingState <= 3)
                      ? "text-sky-500 animate-pulse"
                      : (step.status === "current" && !isFatalError && loadingState > 3)
                      ? "text-teal-500 animate-none"
                      : (step.status === "current" && isFatalError)
                      ? "text-red-600 animate-pulse"
                      : step.status !== "upcoming" 
                      ? "text-teal-400 hover:text-teal-500" 
                      : "text-gray-300 hover:text-gray-400"
                    }
                  `}>
                    <span className={`${step.status !== "current" && "hidden md:inline-block"} absolute -top-7 text-xs font-semibold whitespace-nowrap`}>{step.title}</span>
                    <span className={`
                      p-1.5 inline-flex justify-center items-center rounded-full border-2 
                      ${(step.status === "current" && !isFatalError && loadingState <= 3)
                        ? "border-sky-400"
                        : (step.status === "current" && !isFatalError && loadingState > 3)
                        ? "border-teal-400"
                        : (step.status === "current" && isFatalError)
                        ? "border-red-600 animate-pulse"
                        : step.status !== "upcoming" 
                        ? "border-teal-400" 
                        : "border-gray-300"
                      }
                    `}>
                      <Icon className="w-10 h-10" />
                    </span>
                    {index === 2 && loadingState > 3 && loadingState < 4 &&
                      <span className="absolute -bottom-10 text-sm text-sky-500 font-semibold">Transaction sent!</span>
                    }
                  </div>
                </li>
              )}
            )}
          </ol>
        </div>
      </div>


      {/* :INFOS */}
      <div className="flex flex-col items-start">
        <h3 className="text-base text-gray-500 font-bold">NFT Creation Infos:</h3>
        {isFatalError
          ? <p>
              <span className="mt-5 block text-sm text-gray-700 font-bold animate-pulse">Fatal Error at building. Click cancel and retry.</span>
              <span className="mt-2 block text-sm text-gray-500">If the problem persist, contact our support.</span>
            </p>
          : <ul className="mt-5 flex flex-col items-start space-y-2">
              {/* ::Contract URI */}
              <li className="text-xs text-gray-500 font-semibold">
                Contract URI:&#160;
                {nftInfos.contractMetadataCID
                  ? <span className="ml-1 inline-flex items-center text-xs text-gray-500 font-medium">
                      {nftInfos.contractMetadataCID}
                      <CheckCircleIcon className="ml-2 w-5 h-5 text-teal-500" />
                    </span>
                  : <span className="ml-1 inline-flex items-center text-xs text-gray-300 font-semibold">
                      Awaiting...
                      <ClockIcon className="ml-2 w-5 h-5 text-gray-300" />
                    </span>
                }
              </li>
              {/* ::NFT Metadata URI */}
              <li className="text-xs text-gray-500 font-semibold">
                NFT Metadata URI:&#160;
                {nftInfos.metadataCID
                  ? <span className="ml-1 inline-flex items-center text-xs text-gray-500 font-medium">
                      {nftInfos.metadataCID}
                      <CheckCircleIcon className="ml-2 w-5 h-5 text-teal-500" />
                    </span>
                  : <span className="ml-1 inline-flex items-center text-xs text-gray-300 font-semibold">
                      Awaiting...
                      <ClockIcon className="ml-2 w-5 h-5 text-gray-300" />
                    </span>
                }
              </li>
            </ul>
        }
      </div>

    </div>
  )
}

export default FactoryCreationStatus
