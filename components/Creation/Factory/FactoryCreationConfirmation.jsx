import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ColorSwatchIcon, ExclamationCircleIcon } from "@heroicons/react/outline"

const FactoryCreationConfirmation = ({ isOpen, setIsOpen, loadingState, start }) => {

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

                    {/* ::Infos */}
                    <div className="text-gray-500">
                      <p className="text-sm">
                        All required fields have been completed and we are now ready to create your new smart contract as well as your first NFT book in it. Make sure all the informations about your book and collection are corrects because once they are on the blockchain they will no longer be editable.
                        <br />
                        The creation process requires the completion of several steps that you will be able to track.
                      </p>
                      <p className="relative mt-2 text-sm text-gray-700 font-semibold">
                        <ExclamationCircleIcon className="float-left mr-2 w-5 h-5" />
                        It is very important that you do not close your browser tab during the process. At the step of creating your smart contract on the blockchain, you will have to validate the operation via your wallet on Metamask.
                      </p>
                      <p className="mt-3 text-center text-base text-teal-500 font-bold">If you are ready, click on &ldquo;Start&rdquo;.</p>
                    </div>


                  </div>

                  {/* :ACTIONS */}
                  <div className="mt-4 flex justify-center items-center space-x-4">
                    {/* ::Start */}
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-teal-500 px-4 py-2 text-sm font-semibold text-white tracking-wide hover:bg-teal-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:text-gray-700"
                      onClick={start}
                      disabled={loadingState >= 1}
                    >
                      START 
                    </button>
                    {/* ::Close modal */}
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Cancel
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

export default FactoryCreationConfirmation
