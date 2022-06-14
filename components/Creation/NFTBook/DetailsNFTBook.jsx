import React, { useState } from 'react'
import InputNumber from "../../Forms/InputNumber"
import InputTextLg from "../../Forms/InputTextLg"
import { categories } from "../../../helpers/bookCategories"
import InputCombobox from "../../Forms/InputCombobox"
import { languageArray, languageISO } from "../../../helpers/languageISO"

const DetailsNFTBook = ({ format, size, titleRef, authorNameRef, editorNameRef, serieRef, tomeRef, descriptionRef, externalUrlRef, languageRef, category1Ref, category2Ref, specialEditionRef, publishingRights, setPublishingRights, amountRef, maxCopiesRef, royaltyFeeInBipsRef }) => {

  const [cut, setCut] = useState(0)
  const calculateCut = () => {
    if (!amountRef.current.value && !maxCopiesRef.current.value) {
      setCut(0)
    }
    if (maxCopiesRef.current.value !== "") {
      maxCopiesRef.current.value < 10
        ? setCut(0)
        : (maxCopiesRef.current.value >= 10 && maxCopiesRef.current.value < 50)
        ? setCut(1)
        : setCut(Math.floor(maxCopiesRef.current.value * 2 / 100))
    } else {
      amountRef.current.value < 10
        ? setCut(0)
        : (amountRef.current.value >= 10 && amountRef.current.value < 50)
        ? setCut(1)
        : setCut(Math.floor(amountRef.current.value * 2 / 100))
    }
  }

  return (
    <div className="relative py-5 grid grid-cols-1 sm:col-span-2 lg:grid-cols-10 gap-x-10 gap-y-10">

      <div className="col-span-full flex items-center space-x-10">
        {/* :BOOK FORMAT */}
        <span className="flex flex-col">
          <p className="px-1 text-sm text-gray-400 font-bold">Format</p>
          <span className="mt-2 px-5 py-1 w-full block shadow-sm rounded-2xl border-none bg-gray-100 text-base text-gray-500 capitalize">{format}</span>
        </span>
        {/* :BOOK SIZE */}
        <span className="flex flex-col">
          <p className="px-1 text-sm text-gray-400 font-bold">Size</p>
          <span className="mt-2 px-5 py-1 w-full block shadow-sm rounded-2xl border-none bg-gray-100 text-base text-gray-500 capitalize">{size}</span>
        </span>
      </div>

      {/* :COLLECTION NAME */}
      <span className="col-span-full lg:col-span-4 mx-auto lg:mx-0 w-full max-w-md">
        <InputTextLg 
          name="Book Title"
          id="book-title"
          inputRef={titleRef}
          placeholder="My Incredible #1 book"
          required={true}
          details="Title of your first NFT book in your new collection"
        />
      </span>

      {/* :AUTHOR NAME */}
      <span className="col-span-1 lg:col-span-3 mx-auto lg:mx-0 w-full max-w-md">
        <InputTextLg 
          name="Author Name"
          id="author-name"
          inputRef={authorNameRef}
          placeholder="Jane Doe"
          required={true}
          details="The author of the book"
        />
      </span>

      {/* :EDITOR NAME */}
      <span className="col-span-1 lg:col-span-3 mx-auto lg:mx-0 w-full max-w-md">
        <InputTextLg 
          name="Editor Name"
          id="editor-name"
          inputRef={editorNameRef}
          placeholder="Rare Editions"
          required={false}
          details="The author of the book"
        />
      </span>

      {/* :SERIE TITLE */}
      <span className="col-span-full lg:col-span-4 mx-auto lg:mx-0 w-full max-w-md">
        <InputTextLg 
          name="Serie Title"
          id="serie-title"
          inputRef={serieRef}
          placeholder="Harry Potter Serie"
          required={false}
          details="The serie to which the book belongs"
        />
      </span>

      {/* :TOME */}
      <span className="col-span-1 lg:col-span-3 mx-auto lg:mx-0 w-full max-w-md">
        <InputNumber 
          name="Tome"
          id="tome"
          inputRef={tomeRef}
          placeholder="Tome 1"
          required={false}
          defaultValue={0}
          min={0}
          max={20000}
          details="Tome number in the current serie"
        />
      </span>

      {/* :LANGUAGE */}
      <span className="col-span-1 lg:col-span-3 mx-auto lg:mx-0 w-full max-w-md">
        <InputCombobox 
          inputRef={languageRef}
          data={languageArray}
          label="Book Language"
          emptyValue="None"
          required={true}
          details="Language version of the book"
          maxLength="2"
          uppercase={true}
          language={true}
        />
      </span>

      {/* :NUMBER OF COPIES */}
      <span className="col-span-1 lg:col-span-3 mx-auto lg:mx-0 w-full max-w-md">
        <InputNumber 
          name="Number of copies"
          id="amount"
          inputRef={amountRef}
          placeholder="1000"
          required={true}
          min={2}
          max={25000000}
          calculateCut={calculateCut}
          details="Copies minted at NFT creation (2 up to 25M)"
        />
      </span>

      {/* :MAX COPIES */}
      <span className="col-span-1 lg:col-span-3 mx-auto lg:mx-0 w-full max-w-md">
        <InputNumber 
          name="Max copies"
          id="max-copies"
          inputRef={maxCopiesRef}
          placeholder=""
          required={false}
          min={2}
          max={25000000}
          calculateCut={calculateCut}
          details="Max number of NFT book copies you can mint."
        />
        <p className="text-xs text-gray-400 font-light italic">*Rarity based on max copies. Default value: copies minted at creation.</p>
      </span>

      {/* :PUBLIRARE CUT INFOS */}
      <span className="col-span-full lg:col-span-4 pl-3 mx-auto lg:mx-0 w-full max-w-sm border-l border-teal-200 bg-gradient-to-r from-teal-50">
        <p className="text-teal-500 font-bold">PubliRare Cut</p>
        <span className="mt-2 text-lg text-gray-700 font-bold">2%</span>
        <span className="ml-4 text-xs text-gray-500">(based on max copies)</span>
        <p className="mt-1 text-lg text-teal-400 font-semibold">{`${cut} copies`}</p>
      </span>

      {/* :ROYALTIES */}
      <span className="col-span-full relative mx-auto lg:mx-0 w-full max-w-xs">
        <InputNumber 
          name="Royalties"
          id="royalties"
          inputRef={royaltyFeeInBipsRef}
          placeholder=""
          required={false}
          min={0}
          max={50}
          details="Suggested: 0%, 10%, 20%, 30%. Maximum is 50%."
        />
        <span className="absolute bottom-2.5 right-16 text-lg text-gray-400 font-semibold">%</span>
      </span>

      {/* :EXTERNAL LINK TO WEB3 BOOK */}
      <span className="col-span-full mx-auto lg:mx-0 w-full max-w-3xl">
        <InputTextLg 
          name="External link (to your book)"
          id="external-link"
          inputRef={externalUrlRef}
          placeholder="https://web3-books.com/mybook/..."
          required={true}
          details="As you are building a NFT book this URL should be linked to the actual ebook and allow owners of the NFT to read the actual book. You are also welcome to link to your own webpage with more details."
        />
        <p className="mt-3 text-base text-gray-500 font-medium">
          Discover&#160;
          <a href="#link" target="__blank" className="text-sky-500 font-semibold underline hover:text-sky-600">Web3-Books</a>
          , a free solution to store your ebooks and linked them to your smart contracts to allow <b>ONLY owners of this NFT</b> to read your book.</p>
      </span>

      {/* :NFT BOOK DESCRIPTION */}
      <div className="col-span-full mx-auto lg:mx-0 w-full max-w-4xl">
        <span className="flex justify-start items-center space-x-4">
          <label htmlFor="book-description" className="px-1 text-sm text-gray-500 font-bold">NFT BOOK Description</label>
          <span className="text-xs text-gray-400 font-medium italic">(optional)</span>
        </span>
        <p className="my-2 text-xs text-gray-400 font-semibold">The description will be included on the item&apos;s detail page underneath its image. 0 of 1000 characters used.</p>
        <textarea 
          ref={descriptionRef} 
          name="book-description" 
          id="book-description" 
          cols="30" rows="8"
          maxLength={1000}
          placeholder="Provide a detailed description of your item."
          className="form-textarea resize-none w-full shadow-sm rounded border-gray-300 bg-gray-50 placeholder-gray-300 focus:border-teal-500 focus:ring-teal-500"
        ></textarea>
      </div>

      {/* :CATEGORY BOOK 1 */}
      <span className="col-span-1 lg:col-span-3 mx-auto lg:mx-0 w-full max-w-md">
        <InputCombobox 
          inputRef={category1Ref}
          data={categories}
          label="Book Category 1"
          emptyValue="None"
          required={true}
        />
      </span>

      {/* :CATEGORY BOOK 2 */}
      <span className="col-span-1 lg:col-span-3 mx-auto lg:mx-0 w-full max-w-md">
        <InputCombobox 
          inputRef={category2Ref}
          data={categories}
          label="Book Category 2"
          emptyValue="None"
          required={false}
        />
      </span>

      {/* :SPECIAL EDITION */}
      <span className="col-span-full lg:col-span-5 mx-auto lg:mx-0 w-full max-w-md">
        <InputTextLg 
          name="Special Edition?"
          id="special-edition"
          inputRef={specialEditionRef}
          placeholder="Gold Limited Edition"
          required={false}
          details="Is there anything special about this edition?"
        />
      </span>

      {/* :PUBLISHING RIGHTS */}
      <span className="col-span-full mx-auto lg:mx-0 w-full max-w-3xl">
        <span className="flex justify-start items-center space-x-4">
          <p className="px-1 text-sm text-gray-500 font-bold">Copyrights</p>
          <span className="text-xs text-red-600 font-medium italic">(required)</span>
        </span>
        <p className="my-2 text-xs text-gray-400 font-semibold">Important condition required before creating your NFT Book. <b>Please read carefully.</b></p>
        <div className="mt-2 flex flex-col space-y-3">
          {/* ::Own publishing rights */}
          <span className={`
            flex items-center px-3 mx-auto lg:mx-0 w-full max-w-3xl border rounded-2xl 
            ${publishingRights ? "bg-teal-50 border-teal-300" : "border-gray-100 hover:border-gray-300"}
          `}>
            <input 
              type="radio" 
              name="rights" 
              id="rights-owned"
              value={true}
              onChange={() => setPublishingRights(true)}
              required
              className="form-radio text-teal-500 focus:ring-teal-100" 
            />
            <label htmlFor="rights-owned" className={`ml-3 py-4 w-full flex items-center space-x-1 text-sm ${publishingRights ? "text-teal-500 font-semibold" : "text-gray-400 font-medium"}`} >
              I own the copyright and I hold the necessary publishing rights.&#160; 
              <p className="group relative ml-1 text-sky-600 font-medium hover:text-sky-500 hover:underline">
                What are publishing rights?
                <span className="z-50 absolute -bottom-16 right-0 p-3 w-[450px] hidden group-hover:block border border-gray-200 rounded bg-white text-left text-xs text-gray-500">Choose this option if your book is under copyright and you hold the necessary rights for the content being published. (Exception on Fan Art)</span>
              </p>
            </label>
          </span>
          {/* ::Public domain */}
          <span className={`
            flex items-center px-3 mx-auto lg:mx-0 w-full max-w-3xl border border-gray-100 rounded-2xl hover:border-gray-300
            ${publishingRights === false ? "bg-gray-100 border-gray-300" : "border-gray-100 hover:border-gray-300"}
          `}>
            <input 
              type="radio" 
              name="rights" 
              id="public-domain"
              value={false}
              onChange={() => setPublishingRights(false)}
              className="form-radio text-gray-500 focus:ring-gray-100" 
            />
            <label htmlFor="public-domain" className={`ml-3 py-4 w-full flex items-center space-x-1 text-sm ${publishingRights === false ? "text-gray-800 font-semibold" : "text-gray-400 font-medium"}`} >
              This is a public domain work or fan art work.&#160;
              <p className="group relative ml-1 text-sky-600 font-medium hover:text-sky-500 hover:underline">
                What is a public domain work?
                <span className="z-50 absolute -bottom-24 right-0 p-3 w-[450px] hidden group-hover:block border border-gray-200 rounded bg-white text-left text-xs text-gray-500">Select this option if the related book is in the public domain. Keep in mind that the duration of copyright varies between countries/regions. So, if your book is in the public domain in one country/region but not another, you must identify your territory rights accordingly.</span>
              </p>
            </label>
          </span>
        </div>
        <p className="mt-3 text-xs text-gray-500 font-medium">
          <span className="text-red-600 font-semibold">Attention!</span> Any violation of the copyrights may lead to prosecution on the part of the author and beneficiaries. PubliRare will ensure compliance with these conditions and will work with rights holders against those who violate copyrights. <b>DO NOT create NFT books if you don&apos;t have the author&apos;s consent.</b>
        </p>
      </span>

    </div>
  )
}

export default DetailsNFTBook
