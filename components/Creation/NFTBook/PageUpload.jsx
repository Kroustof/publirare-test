import React, { useState } from 'react'
import { PlusIcon, TrashIcon } from "@heroicons/react/outline";


const PageUpload = ({ images, setImages, accept, details, id, maxSize = 150 }) => {
  
  const uploadToClient = (event) => {
    if (event.target.files[0].size > (maxSize * 1024)) {
      setCreateObjectURL(null)
      alert(`Error: File size is too big (${maxSize} Ko maximum)`)
      return
    }
    if (event.target.files && event.target.files[0]) {
      const newState = {...images}
      const img = event.target.files[0]
      newState.pages.push(img)
      setImages(newState)
    }
  }

  return (
    <div className="group relative mt-2 p-2 aspect-square w-full h-full border-2 border-gray-300 border-dashed rounded-md overflow-hidden hover:border-teal-500">
      <label
        htmlFor={`file-upload-${id}`}
        className="w-full h-full flex justify-center items-center rounded-sm bg-transparent cursor-pointer group-hover:bg-teal-50"
      >

        {/* ::Default display */}
        <span className="flex flex-col items-center space-y-3 text-gray-500 group-hover:text-emerald-600">
          <PlusIcon className="w-8 h-8 text-teal-500" />
          <span className="text-sm">Add a page</span>
          <span className="mt-1 text-center text-xs text-gray-500">{details}</span>
        </span>

        {/* ::Input */}
        <input
          id={`file-upload-${id}`} name={`file-upload-${id}`}
          type="file"
          accept={accept}
          onChange={uploadToClient}
          className="sr-only absolute inset-0 w-full h-full"
        />

      </label>
    </div>
  )
}

export default PageUpload
