import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ColorSwatchIcon, ExclamationCircleIcon } from "@heroicons/react/outline"

const FactoryCreationStatus = ({ isOpen, setIsOpen, steps, start, loadingState }) => {

  function closeModal() {
    setIsOpen(false)
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-80" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-teal-50 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-center text-xl font-semibold leading-6 text-teal-500"
                  >
                    Great, we are ready to create your new NFT Book!
                  </Dialog.Title>

                  {/* :MAIN CONTAINER */}
                  <div className="mt-2 py-5 text-gray-500">
                    
                    {/* ::Steps */}
                    <div className="mt-10 mx-auto pt-5 pb-10 px-4 w-full max-w-5xl flex items-center">
                      {/* :::Customization step */}
                      <div className="relative w-44 max-w-xs hidden sm:flex items-center">
                        <span className={`
                          absolute -top-5 flex items-center text-xs font-medium whitespace-nowrap
                          ${steps[0].status === "upcoming"
                            ? "text-teal-400"
                            : "text-gray-400"
                          }
                        `}>
                          <ColorSwatchIcon className="mr-2 w-4 h-4" />
                          Customization
                        </span>
                        <span className={`
                          inline-block h-0.5 w-full
                          ${steps[0].status === "upcoming"
                            ? "bg-teal-300"
                            : "bg-gray-300"
                          }
                        `} />
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
                                  ${step.status === "current" 
                                    ? "text-sky-500 animate-pulse"
                                    : step.status !== "upcoming" 
                                    ? "text-teal-400 hover:text-teal-500" 
                                    : "text-gray-300 hover:text-gray-400"
                                  }
                                `}>
                                  <span className={`${step.status !== "current" && "hidden md:inline-block"} absolute -top-7 text-xs font-semibold whitespace-nowrap`}>{step.title}</span>
                                  <span className={`
                                    p-1.5 inline-flex justify-center items-center rounded-full border-2 
                                    ${step.status === "current" 
                                      ? "border-sky-400"
                                      : step.status !== "upcoming" 
                                      ? "border-teal-400" 
                                      : "border-gray-300"
                                    }
                                  `}>
                                    <Icon className="w-5 h-5" />
                                  </span>
                                </div>
                              </li>
                            )}
                          )}
                        </ol>
                      </div>
                    </div>

                    {/* ::Infos */}
                    <div className="text-gray-500">
                      <p className="text-xs">
                        All required fields have been completed and we are now ready to create your new smart contract as well as your first NFT book in it. Make sure all the informations about your book and collection are corrects because once they are on-chain they will no longer be editable.
                        <br />
                        The creation process requires the completion of several steps that you can track above.
                      </p>
                      <p className="relative mt-2 text-sm text-gray-700 font-semibold">
                        <ExclamationCircleIcon className="float-left mr-2 w-5 h-5" />
                        It is very important that you do not close your browser tab during the process. At the step of creating your smart contract on the blockchain, you will have to validate the operation via your wallet on Metamask.
                      </p>
                      <p className="mt-3 text-base text-teal-500 font-bold">If you are ready, click on &ldquo;Start&rdquo;.</p>
                    </div>


                  </div>

                  {/* :ACTIONS */}
                  <div className="mt-4 flex justify-center items-center space-x-4">
                    {/* ::Start */}
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-teal-500 px-4 py-2 text-sm font-semibold text-white tracking-wide hover:bg-teal-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:text-gray-700"
                      onClick={start}
                      disabled={loadingState >= 2}
                    >
                      START 
                    </button>
                    {/* ::Close modal */}
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default FactoryCreationStatus
