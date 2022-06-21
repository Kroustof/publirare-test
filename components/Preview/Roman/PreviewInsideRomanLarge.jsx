import React from 'react'
import bgExample from '../../../public/images/preview-books/example-roman-background.jpg'
import Image from 'next/image'


const PreviewInsideRomanLarge = ({ isFullWidth = false, canvasBg, backgroundImg = bgExample, insideCover, pagesColor, content }) => {
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
            : "relative py-[8px] pr-[30px] pl-[3px] w-[303px] h-[386px] overflow-hidden"
          } 
          rounded-l-sm rounded-r bg-white
      `}>
        {/* ::cover binding */}
        <div className="absolute top-0 left-0 w-[7%] h-full bg-[#f0f0f0]" style={{ boxShadow: "inset -2px 0px 5px 1px #b8b8b86e" }} />
        {/* ::inside cover */}
        <div className={`absolute top-0 right-0 w-[35%] h-full`} style={{ boxShadow: "-2px 1px 5px #494949", backgroundColor: insideCover }} />
        {/* ::book depth */}
        {/* eslint-disable-next-line */}
        <img className="absolute top-1/2 right-1 w-10 h-[381px] transform -translate-y-1/2" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAJOCAYAAADWGwX3AAAEkklEQVR4Xu3WS08iXRSF4Y0IykUQMU5FURpFQY1D/74jYxw5cALBEZAAhqhcpbpXJXyxFQRsKAffW4mRcKm9zrP3OeCzH758P1zfCDBR4Pb21mm327a1tWX9ft98Pp+trq5ao9Gwq6urhcmNvVG5XHYqlYp1Oh1LJpPW6/XcAIFAwOr1uiUSCfe5YDBo+Xz+n8KM/XCpVHKq1ap1u92pAfx+v+VyuW+HGPvBYrHo1Gq1mQJoF0nn9PT0WyEWEkDt2N7etlQqNXeIhQXQPOgvm83OFWJhATSgmoeTk5OfC6BZGAwGdnFxMXOIhQoowLzzsJQAOifS6fRMCksJEIvFrNVq2eXl5dQQSwkQjUbdI3tnZ8cODg6+DLGUAJFIxJrNpkliOBx+eVwvJUA4HHYDxONx94vs/Px8ooInARzHmbg1PQmgNkhj3Dx4FkDzcHh4+KmeZwG0M3RQZTKZv2p6FkCDqVZ8/O3gaQDtiI+/oDwLEAqF3C1ZKBR+pgUKoC+qs7MzAiCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIDA/1ig3+9boVD4OYHBYGD5fN77ACr89vZmGxsblsvlvA3Q6/VsOBya4zgWj8ctk8l4F2Bzc9Pq9boFAgGLRCKf+O3P9VcaPaGrWCw6tVrNut2uJZNJ0yp8Pp97I90wkUi4zwWDQff9eqzX9B49DofD1mw23RU/PT1ZKBRy+T+ufqkBGo2GG0ghtfrj4+Oxi12awPPzsxtgfX3dYrGY7e7uehPg5eXF/H6/u3L9VzvS6fTY4hNbUCqVnGq1OtcMqKAmvd1uu8W18rW1tS+LTwxQLpedSqVinU5n5iFUUQ2eCkejUbfvqVRq4spHAz/xDTc3N87r6+vEAKMbiFwr16X/Kqye7+/vTy0+UUAv3N3dOa1Wa2oAnXI6aEaXttuvX79mKv5lgIeHB0f9VB8lsbKy8ukc0A20/zVs7s3+TP3Ho/a/ZBMeTEz6+PjoBtCfzvFZAqj3s/T9fZYvqRRCq1cAnYoatPcn4XsB9X5vb29m+qlD+D7l/f29Ow/qrwLojNe0jwYvm83OXXimANfX187om0wTrh7rGu1znfXfWfVcLdCBNCqsD2rgtPqjo6Nvr3rmANMmeBGvL2QV/xLkNyMMvx3cxA0eAAAAAElFTkSuQmCC" alt=""/>
        {/* ::page */}
        <div className={`${isFullWidth ? "absolute inset-0 w-full h-full" : "relative bottom-1 w-[270px] h-[378px]"}`} style={{ backgroundColor: pagesColor }}>
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

export default PreviewInsideRomanLarge
