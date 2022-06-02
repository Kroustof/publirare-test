import React, { useEffect, useState } from 'react'
import FileUpload from "./NFTBook/FileUpload"
import { bookTypes } from "../../helpers/bookTypes"
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon, RefreshIcon } from "@heroicons/react/outline"
import PageUpload from "./NFTBook/PageUpload"
import PageDisplay from "./NFTBook/PageDisplay"
import { bookPreviews, insideBookPreviews } from "../../helpers/bookPreviews"
import InputText from "../Forms/InputText"


const CreateNFTBook = ({ format, extension, size, images, setImages, canvasBgRef, insideCoverRef, insideBackRef, pagesColorRef }) => {
  
  const extensions = bookTypes[format].extensions[extension]
  const coverExt = extensions.cover
  const backgroundExt = extensions.background
  const pagesExt = extensions.book
  const BookPreview = bookPreviews[format][size]
  const InsidePreview = insideBookPreviews[format][size]

  const [showInside, setShowInside] = useState(false)
  const [isFullWidth, setIsFullWidth] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [previewSetting, setPreviewSetting] = useState({
    canvasBg: null,
    insideCover: null,
    insideBack: null,
    pagesColor: null
  })

  const updatePreview = () => {
    const settings = {
      canvasBg: canvasBgRef.current.value,
      insideCover: insideCoverRef.current.value,
      insideBack: insideBackRef.current.value,
      pagesColor: pagesColorRef.current.value
    }
    setPreviewSetting(settings)
  }

  const previousPage = () => {
    const currentTotalPages = images.pages.length
    if (currentTotalPages <= 0) return
    currentPage > 0 ? setCurrentPage(currentPage - 1) : false
  }

  const nextPage = () => {
    const currentTotalPages = images.pages.length
    if (currentTotalPages === 0) return
    currentPage < (currentTotalPages - 1) ? setCurrentPage(currentPage + 1)  : false
  }

  useEffect(() => {
    updatePreview()
    {/* eslint-disable-next-line */}
  }, [])

  useEffect(() => {
    setCurrentPage(0)
  }, [images.pages.length])


  return (
    <div className="relative mx-auto max-w-7xl flex flex-col lg:flex-row">

      {/* :BOOK SETTINGS */}
      <div className="w-full grid grid-cols-3 gap-x-2 gap-y-5">

        {/* ::UPLOAD Background & Cover images */}
        <div className="col-span-full sm:col-span-2 flex flex-wrap justify-around">
          {/* :::background image nft */}
          <div className="relative m-2 w-44">
            <FileUpload
              id="background"
              images={images}
              setImages={setImages}
              inputName="Background"
              required={false}
              accept={`.${backgroundExt}`}
              details={`${backgroundExt.toUpperCase()} only (500 Ko MAX)`}
              maxSize={500} // in Ko
            />
          </div>
          {/* :::cover image nft */}
          <div className="relative m-2 w-44">
            <FileUpload
              id="cover"
              images={images}
              setImages={setImages}
              inputName="Book Cover"
              required={true}
              accept={`.${pagesExt}`}
              details={`${coverExt.toUpperCase()} only (250 Ko MAX)`}
              maxSize={250} // in Ko
            />
          </div>
        </div>

        {/* ::SET Structure Colors */}
        <div className="col-span-full sm:col-span-1 flex flex-row sm:flex-col flex-wrap justify-start items-start space-y-2 space-x-2">
          <span className="w-full text-xs text-gray-700 font-extrabold uppercase">Setting Details</span>
          <InputText 
            inputRef={canvasBgRef}
            name="background color (HEX)"
            id="canvas-bg"
            placeholder="#fffff"
          />
          <InputText 
            inputRef={insideCoverRef}
            name="inside cover color (HEX)"
            id="inside-cover"
            placeholder="#3d3d3d"
          />
          <InputText 
            inputRef={insideBackRef}
            name="inside back color (HEX)"
            id="inside-back"
            placeholder="#000"
          />
          <InputText 
            inputRef={pagesColorRef}
            name="pages color (HEX)"
            id="pages-color"
            placeholder="#fbfbf8"
          />
          <span className="w-full">
            <button
              type="button"
              onClick={updatePreview}
              className="relative inline-flex items-center px-3.5 py-1 rounded border border-transparent bg-teal-500 text-sm text-white font-medium whitespace-nowrap hover:bg-teal-600"
            >
              <RefreshIcon className="mr-2 w-4 h-4" />
              Apply to Preview
            </button>
          </span>
        </div>

        {/* ::UPLOAD Book Pages*/}
        <div className="col-span-full py-5 border-t-2 border-gray-200">
          <h3 className="text-xs text-gray-700 font-bold uppercase">Book Pages (max 10)</h3>
          <p className="text-xs text-gray-500 font-medium">{`${pagesExt.toUpperCase()} only (150 Ko MAX)`}</p>
          <div className="flex flex-wrap items-end">
            {images.pages.map((page, index) => (
              <div key={index} className="relative m-2 w-24">
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
              <div className="relative m-2 w-28">
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




      {/* :PREVIEW NFT BOOK */}
      <div className="relative sm:p-4 flex-nowrap mx-auto w-full max-w-lg">

        {/* ::BUTTONS Switch Book & Flip Book */}
        <span className="pb-2 flex space-x-4">
          <span className="mr-auto text-sm text-gray-700 font-extrabold uppercase">Preview Book</span>
          {!showInside
            ? null
            :  <>
                {isFullWidth
                  ? <button 
                      type="button"
                      onClick={() => setIsFullWidth(false)}
                      className="text-gray-400 hover:text-teal-500"
                    >
                      <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.586 19.414l-2.586 2.586v-8h8l-2.586 2.586 4.586 4.586-2.828 2.828-4.586-4.586zm-13.758-19.414l-2.828 2.828 4.586 4.586-2.586 2.586h8v-8l-2.586 2.586-4.586-4.586zm16.586 7.414l2.586 2.586h-8v-8l2.586 2.586 4.586-4.586 2.828 2.828-4.586 4.586zm-19.414 13.758l2.828 2.828 4.586-4.586 2.586 2.586v-8h-8l2.586 2.586-4.586 4.586z"/></svg>
                    </button>
                  : <button 
                      type="button"
                      onClick={() => setIsFullWidth(true)}
                      className="text-gray-400 hover:text-teal-500"
                    >
                      <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16 16h-8v-8h8v8zm-10-7.172v-2.828h2.828l-3.414-3.414 2.586-2.586h-8v8l2.586-2.586 3.414 3.414zm2.828 9.172h-2.828v-2.828l-3.414 3.414-2.586-2.586v8h8l-2.586-2.586 3.414-3.414zm9.172-2.828v2.828h-2.828l3.414 3.414-2.586 2.586h8v-8l-2.586 2.586-3.414-3.414zm-2-15.172l2.586 2.586-3.414 3.414h2.828v2.828l3.414-3.414 2.586 2.586v-8h-8z"/></svg>
                    </button>
                }
              </>
          }
          <button 
            type="button"
            onClick={() => setShowInside(!showInside)}
            className="relative inline-flex justify-center items-center py-0.5 w-32 rounded border-2 border-gray-500 bg-transparent text-sm text-gray-600 font-medium"
          >
            { showInside ? "Outside Preview" : "Inside Preview" }
          </button>
        </span>


        {/* ::DISPLAY Container */}
        <div className="relative mx-auto w-full max-w-[500px] min-h-[500px] aspect-square border-2 border-gray-200 bg-gray-50 overflow-hidden">
          {/* :::BUTTONS previous & next page */}
          {showInside &&
            <div className="z-50 absolute top-0 right-0 flex space-x-4 bg-white bg-opacity-80">
              <button className="p-3 text-gray-400 bg-white hover:bg-teal-50 hover:text-teal-500" onClick={previousPage}>
                <ArrowLeftIcon className="w-8 h-8" />
              </button>
              <button className="p-3 text-gray-400 bg-white hover:bg-teal-50 hover:text-teal-500" onClick={nextPage}>
                <ArrowRightIcon className="w-8 h-8" />
              </button>
            </div>
          }
          {/* :::BOOK Preview */}
          {showInside
            ? <div>
                <InsidePreview 
                  isFullWidth={isFullWidth}
                  backgroundImg={images.background && URL.createObjectURL(images.background)}
                  canvasBg={(previewSetting.canvasBg === "" && previewSetting.canvasBg !== null) ? "transparent" : previewSetting.canvasBg}
                  insideCover={previewSetting.insideCover !== "" && previewSetting.insideCover !== null ? previewSetting.insideCover : "#3d3d3d"}
                  pagesColor={previewSetting.pagesColor !== "" && previewSetting.pagesColor !== null ? previewSetting.pagesColor : "#fbfbf8"}
                  content={images.pages.length > 0 && URL.createObjectURL(images.pages[currentPage])}
                />
              </div>
            : <div>
                <BookPreview 
                  backgroundImg={images.background && URL.createObjectURL(images.background)}
                  coverImg={images.cover && URL.createObjectURL(images.cover)}
                  canvasBg={(previewSetting.canvasBg === "" && previewSetting.canvasBg !== null) ? "transparent" : previewSetting.canvasBg}
                  insideBack={previewSetting.insideBack !== "" && previewSetting.insideBack !== null ? `after:bg-[${previewSetting.insideBack}]` : "after:bg-[#000]"}
                />
              </div>
          }
        </div>

      </div>

      
    </div>
  )
}

export default CreateNFTBook
