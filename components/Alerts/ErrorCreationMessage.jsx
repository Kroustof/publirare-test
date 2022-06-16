import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from "@heroicons/react/solid"


const ErrorCreationMessage = ({ error, setError, deleteAllFiles, loadingState }) => {

  const [isOpen, setIsOpen] = useState(true)

  function closeModalAndDeleteSafe() {
    if (loadingState > 1) {
      setIsOpen(false)
      setError(null)
      deleteAllFiles()
    }
  }

  function closeModal() {
    setIsOpen(false)
    setError(null)
    deleteAllFiles()
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModalAndDeleteSafe}>
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
                <Dialog.Panel className="group relative w-full max-w-md transform rounded-2xl bg-red-50 p-6 text-center align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-red-800"
                  >
                    Something went wrong!
                  </Dialog.Title>
                  <div className="mt-2 py-3">
                    <p className="text-sm text-red-700">
                      {error}
                    </p>
                  </div>

                  <div className="mt-4">
                    <button 
                      type="button"
                      onClick={closeModal}
                      className="absolute -top-2 -right-2 w-6 h-6 flex justify-center items-center opacity-0 rounded-full bg-gray-600 text-white group-hover:opacity-100 hover:bg-red-600"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={closeModalAndDeleteSafe}
                      disabled={loadingState < 1.9}
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:bg-gray-500 disabled:cursor-wait"
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

export default ErrorCreationMessage
