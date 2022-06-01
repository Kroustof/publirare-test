import React, { useState } from 'react'
import FileUpload from "./NFTBook/FileUpload"
import { bookTypes } from "../../helpers/bookTypes"
import { PlusIcon, RefreshIcon } from "@heroicons/react/outline"
import PageUpload from "./NFTBook/PageUpload"
import PageDisplay from "./NFTBook/PageDisplay"
import { bookPreviews } from "../../helpers/bookPreviews"


const CreateNFTBook = ({ format, extension, size }) => {
  
  const extensions = bookTypes[format].extensions[extension]
  const coverExt = extensions.cover
  const backgroundExt = extensions.background
  const pagesExt = extensions.book

  const [images, setImages] = useState({
    previewImage: null,
    cover: null,
    background: null,
    pages: []
  })
  const [previewInside, setPreviewInside] = useState(false)


  return (
    <div className="mx-auto max-w-6xl flex flex-col space-y-10">

      {/* :NFT BOOK SETTING */}
      <div className="relative w-full flex flex-col lg:flex-row">

        {/* ::Images Upload */}
        <div className="order-last lg:order-first w-full">
          {/* :::Background & Book Cover */}
          <div className="flex flex-wrap justify-around">
            {/* ::::background image nft */}
            <div className="relative m-2 w-52">
              <FileUpload
                id="background"
                images={images}
                setImages={setImages}
                inputName="Background Image"
                required={false}
                accept={`.${backgroundExt}`}
                details={`${backgroundExt.toUpperCase()} only (500 Ko MAX)`}
                maxSize={500} // in Ko
              />
            </div>
            {/* ::::cover image nft */}
            <div className="relative m-2 w-52">
              <FileUpload
                id="cover"
                images={images}
                setImages={setImages}
                inputName="Book Cover Image"
                required={true}
                accept={`.${pagesExt}`}
                details={`${coverExt.toUpperCase()} only (250 Ko MAX)`}
                maxSize={250} // in Ko
              />
            </div>
          </div>
          {/* :::Book Pages - large devices */}
          <div className="py-5 border-t-2 border-gray-200">
            <h3 className="text-xs text-gray-700 font-bold uppercase">Book Pages (max 10)</h3>
            <div className="flex flex-wrap items-end">
              {images.pages.map((page, index) => (
                <div key={index} className="relative m-2 w-40">
                  <PageDisplay 
                    file={page}
                    name={`Page N°${index + 1}`}
                    index={index}
                    images={images}
                    setImages={setImages}
                  />
                </div>
              ))
              }
              {images.pages.length < 10 &&
                <div className="relative m-2 w-40">
                  <PageUpload
                    id="new-page"
                    images={images}
                    setImages={setImages}
                    accept={`.${pagesExt}`}
                    details={`${pagesExt.toUpperCase()} only (150 Ko MAX)`}
                    maxSize={150} // in Ko
                  />
                </div>
              }
            </div>
          </div>
        </div>

        {/* ::Preview Nft Book */}
        <div className="relative p-4 flex-nowrap">
          {/* :::Switch Book & Flip Book */}
          <span className="pb-2 flex space-x-4">
            <button 
              type="button" 
              className="relative inline-flex items-center px-3.5 py-0.5 rounded border border-transparent bg-teal-500 text-sm text-white font-medium hover:bg-teal-600"
            >
              <RefreshIcon className="mr-1 w-4 h-4" />
              Refresh
            </button>
            <button 
              type="button"
              onClick={() => setPreviewInside(!previewInside)}
              className="relative inline-flex justify-center items-center py-0.5 w-32 rounded border-2 border-teal-500 bg-transparent text-sm text-teal-500 font-medium"
            >
              { previewInside ? "Outside Preview" : "Inside Preview" }
            </button>
          </span>
          <div className="mx-auto w-[500px] aspect-square border-2 border-gray-200 bg-gray-50">
            { bookPreviews.manga.standard }
          </div>
        </div>

      </div>
      




    </div>
  )
}

export default CreateNFTBook
