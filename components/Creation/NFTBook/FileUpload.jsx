import React, { useState } from 'react'
import { TrashIcon } from "@heroicons/react/outline";


const FileUpload = ({ images, setImages, inputName, required, accept, details, id, maxSize = 150 }) => {
  
  const [createObjectURL, setCreateObjectURL] = useState(null);
  
  const uploadToClient = (event) => {
    if (event.target.files[0].size > (maxSize * 1024)) {
      setCreateObjectURL(null)
      alert(`Error: File size is too big (${maxSize} Ko maximum)`)
      return
    }
    if (event.target.files && event.target.files[0]) {
      const newState = {...images}
      const img = event.target.files[0]
      newState[id] = img
      setCreateObjectURL(URL.createObjectURL(img))
      setImages(newState)
    }
  }

  const deleteCurrentImg = () => {
    const newState = {...images}
    newState[id] = null
    setCreateObjectURL(null)
    setImages(newState)
  }

  return (
    <div className="group relative">
      
      {/* :INPUT LABEL & REQUIREMENT */}
      <p className="flex justify-between">
        <span className="text-xs text-gray-700 font-extrabold uppercase">{inputName}</span>
        <span className={`${required ? "text-red-700" : "text-gray-400"} text-xs font-medium`}>
          {required ? "(required)" : "(optional)"}
        </span>
      </p>


      {/* :INPUT CONTAINER */}
      <div className="relative mt-2 p-2 aspect-square w-full h-full border-2 border-gray-300 border-dashed rounded-md overflow-hidden group-hover:border-teal-500">
        <label
          htmlFor={`file-upload-${id}`}
          className="w-full h-full flex justify-center items-center rounded-sm bg-transparent cursor-pointer group-hover:bg-teal-50"
        >

          {/* ::Preview image */}
          {/* eslint-disable @next/next/no-img-element */}
          <img 
            src={createObjectURL} 
            alt="preview" 
            className={createObjectURL ? "absolute inset-0 p-1 w-full h-full object-contain" : "hidden"} 
          />

          {/* ::Default display */}
          <span className={`
            ${createObjectURL ? "hidden" : ""}
            flex flex-col items-center space-y-2 text-gray-500 group-hover:text-teal-600`}
          >
            <svg className="h-11 w-11 fill-transparent stroke-current text-teal-500" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span className="text-xs">Upload a file</span>
            <p className="mt-1 text-center text-xs text-gray-500">{details}</p>
          </span>

          {/* ::Input */}
          <input
            id={`file-upload-${id}`} name={`file-upload-${id}`}
            type="file"
            accept={accept}
            onChange={uploadToClient}
            className="sr-only absolute inset-0 w-full h-full"
          />

          {/* ::Delete image */}
          <button 
            type="button"
            onClick={deleteCurrentImg}
            aria-label="delete file"
            className={createObjectURL ? "absolute top-3 right-3 w-7 h-7 flex justify-center items-center rounded-full bg-white bg-opacity-50 text-black text-opacity-70 hover:text-red-500 hover:bg-opacity-100 hover:text-opacity-100" : "hidden"} 
          >
            <TrashIcon className="w-5 h-5" />
          </button>

        </label>
      </div>

    </div>
  )
}

export default FileUpload
