import React from 'react'


const InputText = ({ name, id, placeholder, inputRef }) => {
  return (
    <span>
      {/* ::Label */}
      <label htmlFor={id} className="px-1 text-xs text-gray-500 font-bold">{name}</label>
      {/* ::Input */}
      <input 
        type="text" 
        ref={inputRef}
        id={id} 
        name={id}
        placeholder={placeholder}
        className="form-input px-5 py-1 w-full block shadow-sm rounded border-gray-300 bg-transparent text-sm placeholder-gray-400 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
      />
    </span>
  )
}

export default InputText
