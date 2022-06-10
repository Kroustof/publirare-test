import React from 'react'


const InputTextSm = ({ name, id, placeholder, inputRef }) => {
  return (
    <>
      {/* ::Label */}
      <label htmlFor={id} className="px-1 text-xs text-gray-500 font-bold">{name}</label>
      {/* ::Input */}
      <input 
        type="text" 
        ref={inputRef}
        id={id} 
        name={id}
        placeholder={placeholder}
        className="form-input px-5 py-1 w-full block shadow-sm rounded-full border-gray-200 bg-gray-100 text-sm placeholder-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:bg-white"
      />
    </>
  )
}

export default InputTextSm
