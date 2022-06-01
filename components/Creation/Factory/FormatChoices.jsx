import React, { useState } from 'react'
import { useRouter } from 'next/router'


const FormatChoices = ({ bookTypes }) => {

  const router = useRouter()

  const [selectedFormat, setSelectedFormat] = useState("roman")
  const [selectedExtension, setSelectedExtension] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)

  // const translateValue = bookTypes.findIndex(tab => tab.format === selectedFormat) / bookTypes.length * 100
  const translateValue = Object.keys(bookTypes).findIndex(key => key === selectedFormat) / Object.keys(bookTypes).length * 100

  const changeTab = (format) => {
    setSelectedFormat(format)
    setSelectedExtension(null)
    setSelectedSize(null)
  }

  const validation = () => {
    if (!selectedExtension || !selectedSize) return
    const format = selectedFormat
    const extension = selectedExtension
    const size = selectedSize
    router.push(`/creation/factory/new-collection/create?format=${format}&extension=${extension}&size=${size}`)
  }

  return (
    <div className="mx-auto max-w-7xl">

      {/* :TAB BOOK FORMATS */}
      <div className="mt-10 mx-auto w-full max-w-3xl">
        
        {/* ::Small Devices */}
        <div className="mx-auto w-full max-w-md sm:hidden rounded-lg border border-gray-300 overflow-hidden">
          <label htmlFor="current-tab" className="sr-only">Select a tab</label>
          <select format="current-tab" id="current-tab" defaultValue={bookTypes[selectedFormat].format}
            className="form-select w-full sm:w-auto block border-none text-sm text-gray-500 font-semibold cursor-pointer focus:ring-0"
          >
            {Object.keys(bookTypes).map(key => (
              <option 
                key={key} 
                value={bookTypes[key].format} 
                onClick={() => changeTab(bookTypes[key].format)}
              >
                {bookTypes[key].format}
              </option>
            ))
            }
          </select>
        </div>

        {/* ::Large Devices */}
        <div className="relative hidden sm:block  rounded-full sm:border-2 border-gray-100 sm:bg-white overflow-hidden">
          {/* :::navigation tabs */}
          <nav aria-label="Tabs">
            <ul className="grid grid-flow-col auto-cols-fr">
              {Object.keys(bookTypes).map(key => (
                <li key={bookTypes[key].format} className={`relative z-10 rounded-full text-base ${bookTypes[key].format === selectedFormat ? "transition duration-300 text-white" : "text-gray-400 hover:text-teal-500"}`}>
                  <button 
                    type="button" 
                    className="py-2 px-4 w-full inline-flex justify-center items-center text-center text-sm font-bold uppercase tracking-wide" 
                    onClick={() => changeTab(bookTypes[key].format)}
                  >
                    {bookTypes[key].format}
                  </button>
                </li>
              ))
              }
            </ul>
          </nav>
          {/* :::sliding background */}
          <div className="absolute inset-0 mx-auto w-full h-full rounded-full">
            <div className="relative h-full transition-all duration-300 ease-in" style={{ transform: `translateX(${translateValue}%)` }} >
              <div className="h-full rounded-full bg-teal-500" style={{ width: `${1 / (Object.keys(bookTypes).length) * 100}%` }} />
            </div>
          </div>
        </div>

      </div>


      {/* :CONTAINER */}
      <div className="flex justify-around">
        {/* ::Book Types */}
        <div className="mt-10">
          <h4 className="text-base text-gray-500 font-bold uppercase">1- Book Type</h4>
          <div className="mt-3 flex flex-wrap space-x-5">
            {Object
              .keys(bookTypes[selectedFormat].extensions)
              .map(key => {
                const extension = bookTypes[selectedFormat].extensions[key]
                return (
                  <button 
                    key={extension.name}
                    onClick={() => setSelectedExtension(extension.name)} 
                    className={`
                      ${extension.name === selectedExtension ? "bg-teal-50 border-teal-300" : "bg-transparent border-gray-200"}
                      aspect-square relative py-10 px-5 w-56 flex flex-col justify-center items-center border-2 border-gray-200 rounded-xl hover:border-teal-300
                    `}
                  >
                    <span className="absolute top-4 left-4 text-6xl text-teal-500 font-bold uppercase opacity-20">{extension.book}</span>
                    <span className="absolute bottom-2 right-2 text-xl text-gray-500 font-bold uppercase opacity-10">{selectedFormat}</span>
                    <p className="mb-5 text-base text-gray-500 font-semibold">NFT Book files type</p>
                    <ul className="relative list-inside list-disc text-left text-teal-500">
                      <li>
                        <span className="text-sm text-gray-400 font-semibold">background: </span>
                        <span className="text-base text-teal-500 font-bold">{`.${extension.background}`}</span>
                      </li>
                      <li>
                        <span className="text-sm text-gray-400 font-semibold">cover: </span>
                        <span className="text-base text-teal-500 font-bold">{`.${extension.book}`}</span>
                      </li>
                      <li>
                        <span className="text-sm text-gray-400 font-semibold">content: </span>
                        <span className="text-base text-teal-500 font-bold">{`.${extension.book}`}</span>
                      </li>
                    </ul>
                  </button>
                )
              })
            }
          </div>
        </div>
        {/* ::Book Size */}
        <div className="mt-10 flex-shrink-0">
          <h4 className="text-base text-gray-500 font-bold uppercase">2- Select book size</h4>
          <div className="mt-3 flex flex-col space-y-5">
            {bookTypes[selectedFormat]
              .sizes
              .map(size => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)} 
                  className={`
                    ${size === selectedSize ? "bg-teal-50 border-teal-300 text-teal-500" : "bg-transparent border-gray-200 text-gray-500"}
                    relative py-2 px-5 w-44 flex flex-col justify-center items-center border-2 border-gray-200 rounded-xl text-base uppercase hover:border-teal-300
                  `}
                >
                  {size}
                </button>
              ))
            }
          </div>
        </div>
      </div>


      {/* :VALIDATE BUTTON */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={validation}
          disabled={!selectedFormat || selectedExtension === null || selectedSize === null}
          className="relative mt-16 inline-flex items-center px-5 py-2.5 rounded border border-transparent bg-teal-500 text-lg text-white font-bold hover:bg-teal-600 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          Create NFT Book
        </button>
      </div>

    </div>
  )
}

export default FormatChoices
