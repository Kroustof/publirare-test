import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'


const TransactionMessage = ({ isModalOpen, setIsModalOpen, data }) => {

  function closeModal() {
    setIsModalOpen(false)
  }

  return (
    <>
      <Transition appear show={isModalOpen} as={Fragment}>
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
            <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                <Dialog.Panel className="w-full max-w-xl overflow-hidden rounded-2xl bg-sky-50 p-6 text-left align-middle shadow-xl transform transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-sky-800"
                  >
                    Transaction details!
                  </Dialog.Title>
                  <div className="mt-2 py-5">
                    <ul className="text-sm text-sky-700 list-disc">
                      {typeof data === "object" ?
                        Object.keys(data)
                        .filter(key => key !== "events" && key !== "logsBloom" && key !== "logs")
                        .map(key => (
                          <li key={key} className="text-sm">
                            <span className="font-semibold capitalize">{key} : </span>
                            <span className="font-normal">{String(data[key])}</span>
                          </li>
                        ))
                        : <li className="list-none capitalize">
                            <span className="font-medium">Response:</span>
                            <span className="ml-2 text-black font-bold capitalize">{JSON.stringify(data)}</span>
                          </li>
                      }
                    </ul>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-sky-700 px-4 py-2 text-sm font-medium text-sky-100 hover:bg-sky-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Got it, thanks!
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

export default TransactionMessage
