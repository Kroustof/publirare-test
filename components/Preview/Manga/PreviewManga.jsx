import React from 'react'
import styles from './previewManga.module.css'
import coverExample from '../../../public/example-cover.png'
import bgExample from '../../../public/images/example-background.jpg'


const PreviewManga = ({ backgroundColor = "transparent", backgroundImg = bgExample, coverImg = coverExample, insideback = "#3d3d3d",  }) => {
  return (
    <div className="relative">
      <div className={styles.pseudoCanvas}>
        {/* eslint-disable-next-line */}
        <img src={backgroundImg} alt="" className="absolute inset-0 w-full h-full object-cover"/>
        <div className={styles.canvas} style={{ "backgroundColor": `${backgroundColor}` }}>
          <div className={styles.bookContainer} style={{ "backgroundColor": `${insideback}` }}>
            <div className={styles.book}>
              {/* eslint-disable-next-line */}
              <img alt="Test Book" src={coverImg} id={styles.bookCover}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreviewManga
