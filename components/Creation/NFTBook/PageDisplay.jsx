import React from 'react'
import { TrashIcon } from "@heroicons/react/outline"


const PageDisplay = ({ file, name, index, images, setImages }) => {

  const deleteCurrentImg = () => {
    const newState = {...images}
    newState.pages.splice(index, 1)
    console.log(newState);
    setImages(newState)
  }

  return (
    <div className="group relative">
      
      {/* :INPUT LABEL & REQUIREMENT */}
      <p className="text-sm text-gray-700 font-semibold">{name}</p>


      {/* :INPUT CONTAINER */}
      <div className="relative mt-2 p-2 aspect-square w-full h-full border-2 border-gray-300 border-dashed rounded-md overflow-hidden">

          {/* ::Preview image */}
          {/* eslint-disable @next/next/no-img-element */}
          <img 
            src={URL.createObjectURL(file)} 
            alt="preview" 
            className="absolute inset-0 p-1 w-full h-full object-contain" 
          />

          {/* ::Delete image */}
          <button 
            type="button"
            onClick={deleteCurrentImg}
            aria-label="delete file"
            className="absolute top-3 right-3 w-7 h-7 flex justify-center items-center rounded-full bg-white bg-opacity-50 text-black text-opacity-70 hover:text-red-500 hover:bg-opacity-100 hover:text-opacity-100"
          >
            <TrashIcon className="w-5 h-5" />
          </button>

      </div>

    </div>
  )
}

export default PageDisplay
