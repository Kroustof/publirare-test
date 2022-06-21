import styles from './previewComicLarge.module.css'
import coverExample from '../../../public/images/preview-books/example-comic-cover.png'
import bgExample from '../../../public/images/preview-books/example-comic-background.jpg'
import Image from 'next/image'


const previewComicLarge = ({ canvasBg, backgroundImg = bgExample, coverImg = coverExample, insideBack }) => {
  return (
    <div className="relative w-full max-w-[500px] h-[500px] flex justify-center items-center overscroll-x-auto">
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
      <div className={styles.pseudoCanvas}>
        <div className={`relative z-50 ${styles.canvas}`} style={{ "backgroundColor": `${canvasBg}` }}>
          <div className={styles.bookContainer}>
            <div className={styles.book}>
              {coverImg 
                ? <Image 
                    src={coverImg}
                    alt="Cover example"
                    width={281}
                    height={430}
                  />
                : <Image 
                    src={coverExample}
                    alt="Cover example"
                    width={281}
                    height={430}
                  />
              }
              <div className={styles.bookAfter} style={{ backgroundColor: `${insideBack}` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default previewComicLarge
