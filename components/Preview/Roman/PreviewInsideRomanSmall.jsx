import React from 'react'
import bgExample from '../../../public/images/preview-books/example-roman-background.jpg'
import Image from 'next/image'


const PreviewInsideRomanSmall = ({ isFullWidth = false, canvasBg, backgroundImg = bgExample, insideCover, pagesColor, content }) => {
  return (
    <div className="relative w-full max-w-[500px] h-[500px] flex justify-center items-center overflow-hidden" style={{ "backgroundColor": `${canvasBg}` }}>
      {/* :Background */}
      <div className="absolute inset-0 w-[500px] h-full">
        {canvasBg === "transparent" && backgroundImg &&
          <Image
            src={backgroundImg}
            alt="Background example"
            width={500}
            height={500}
          />
        }
        {canvasBg === "transparent" && !backgroundImg &&
          <Image
            src={bgExample}
            alt="Background example"
            width={500}
            height={500}
          />
        }
      </div>

      {/* :Interactive book container */}
      <div className={`${
          isFullWidth 
            ? "absolute inset-0 w-full h-full" 
            : "relative py-[8px] pr-[15px] pl-[3px] w-[289px] h-[390px] overflow-hidden"
          } 
          rounded-l-sm rounded-r bg-white
      `}>
        {/* ::cover binding */}
        <div className="absolute top-0 left-0 w-[7%] h-full bg-[#f0f0f0]" style={{ boxShadow: "inset -2px 0px 5px 1px #b8b8b86e" }} />
        {/* ::inside cover */}
        <div className={`absolute top-0 right-0 w-[35%] h-full`} style={{ boxShadow: "-2px 1px 5px #494949", backgroundColor: insideCover }} />
        {/* ::book depth */}
        {/* eslint-disable-next-line */}
        <img className="absolute top-1/2 right-0.5 w-10 h-[386px] transform -translate-y-1/2" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAJNCAYAAABUeqdkAAAFEElEQVR4Xu3d60pqWxjG8SEs+qKE3kFZCWJ30Je88OgagkToYOmnSkEETTrhbsyde9tMbdpKWuz9WzBpLddMX59x+r/POMxc+EP+5P6QOIJA0iVBkd9S5OTkZLK5uRmur6/D1tbWPz/Pzs5CpVL58Hq8r16vZ1L905va7fbk/v4+jMfjMBgM3gUwDWhZILMBb29vL/y8pYHMBlEqleZ+4/hBWQMZDochn8+Hcrn84XMXBtLpdBIl4rVIiVUV+VIgr99yMhqNQrFYXKjE2gNptVpJEL1eb26dWKWyztaRfr8fCoVCrNjZiiaqEWX8rEhWVWTlQJrNZhJIvGa/UVqJtQfSaDSSoonXdwYSizoWTbVazVY0p6enSSCxxfwnA+l2u0k/UqvVflaRu7u7JJD9/X2BJHWNIul+hyIUWTQWTV9XR9QRdWRVQtNqtBqtRqv53UxPP6If0Y/oR/Qj3+0Y6Vn1rHpWPaueVc86nYtd1+yEscZYY6wx1hhrjDXGmlcF5q6oMfqm14RRhCIzCmg1mRZNajVajVZj+VdqbbQkXBIuCZeES8Il4ZJwSbh18W+ABIyAETACRsAIGAEjYASMgFHKO7MZbNHgCJ7BM3gGz+AZPINn8AyewTN4XnIM2eypP+AZPINn8AyewTN4Bs/gGTyDZ/C8wqnG0ollx6hKsCRYEiwJlgRLgiXBkmBJsCRYEiwJlgRrQSuAilARKkJFqAgVoSJUhIpQESqu6aFtZifMTpidkHJKOaWcUk4pp5RTyinllHJKOaWcUs7UIb5ONXaqsVONnWrsVONPBkeuIleRq8hV5CpyFbmKXEWuIleRq8hV5CpyFbmKXMV/FfA8Pc/Ti7vnOUYcI44Rx4hjxDHiGHGMOEYcI44Rx4hjxDHiGHGMOEZ3IZ/Ph31gBIyAETACRsAIGAEjYASMroMjuB3BHRU4A0bACBgBI2AEjIARMHqvgDVG1hhZY2SNkTVG1hhZY2QqzVSaqTSOEceIY8Qx4hhxjDhGHCOO0d8KmEpL+yQUochn/qk6oo6oIw6KdVCsg2IdFOugWAfFvikAjIARMAJGwAgYASNgBIyA0YI6ABWhIlSEilARKkJFqAgVoSJUvL9/t8vdJg6bOGzisInDJg6bOGzisInDJg6bOGzisInDJg6bOGzisInDJo75dcDkoslFk4smF00umlw0uWhy0eSiyUWTiyYX30ZDYASMgBEwAkbACBgBI2AEjELIpaEo/hsqQkWoCBWhIlSEilARKkJFqLj/gZXBc5qTKUKReMTuHXgGz+D5fwPPjUZjMhqNQryWPa937Y8oazabk+FwGOL1o4G8rsZMAhkMBj8bSKvVSoqm1+v9bCBxZIyqxGCKxWL4rrWK3W435PP5UKvVshFaDKTT6UziNtt4fVZEWRfWRoULhUKoVqvZA4nBtNvtJJjxeBxKpdJCZdYeSDqYRcpkDaTf7yeKVCqV1RSZUtRUmcfHx7C5uflBmSyBbGxsJL8b60i5XP5aIFNlHh4ewvPzc7i9vX3XmpYFksvlwmQyCd8WyFSdq6uryfTv09Z0fn4e9vb23in169ev8PLykgQQv0D8eXBwMBfW4/st/I95kwXp146Pjyex5724uAi7u7tzAzk8PMz0GZluWhZUVOjy8jLs7OwkCjw9PYWbm5tQr9dXeu+Vbl4U0NHR0eS1AiaBvCrzpff80i9lKbZV7xFIpkxvVVm/435Fk1bxL9bPk4UN09xqAAAAAElFTkSuQmCC" alt=""/>
        {/* ::page */}
        <div className={`${isFullWidth ? "absolute inset-0 w-full h-full" : "relative bottom-0.5 w-[270px] h-[378px]"}`} style={{ backgroundColor: pagesColor }}>
          {content &&
            <>
              {/* eslint-disable-next-line */}
              <img src={content} alt="" className={`${isFullWidth ? "object-contain" : "object-cover"} absolute inset-0 w-full h-full`} />
            </>
          }
        </div>
        {/* ::book spine */}
        {/* eslint-disable-next-line */}
        <img className={`${isFullWidth ? "h-full" : "h-[378px]"} z-10 absolute top-1/2 left-px transform -translate-y-1/2`} src="data:image/png;base64,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" alt="" />
      </div>

    </div>
  )
}

export default PreviewInsideRomanSmall
