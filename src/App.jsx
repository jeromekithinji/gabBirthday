import { useEffect, useRef, useState } from 'react'
import babyPic from './assets/puzzle/babypic.jpg'
import Balloon from './section/balloon/balloon'
import Landing from './section/landing/Landing'
import Paper from './section/paper/paper'
import {
  birthdayNoteParagraphs,
  birthdayNoteSignature,
  birthdayNoteTitle,
} from './content/birthdayNote'
import Puzzle from './section/puzzle/puzzle'
import './App.css'

function App() {
  const [puzzleDifficulty, setPuzzleDifficulty] = useState('hard')
  const [gameRevealProgress, setGameRevealProgress] = useState(0)
  const [puzzleRevealProgress, setPuzzleRevealProgress] = useState(0)
  const gameRevealRef = useRef(null)

  const puzzleImage = babyPic
  const difficultyConfig =
    puzzleDifficulty === 'easy'
      ? { rows: 2, columns: 3 }
      : puzzleDifficulty === 'hard'
        ? { rows: 4, columns: 5 }
        : { rows: 3, columns: 4 }
  const gamesScale = 1 + gameRevealProgress * 7
  const gamesOpacity = 1 - gameRevealProgress * 0.9
  const gamesBlur = gameRevealProgress * 3

  useEffect(() => {
    const updateRevealProgress = () => {
      if (!gameRevealRef.current) {
        return
      }

      const sectionRect = gameRevealRef.current.getBoundingClientRect()
      const sectionHeight = gameRevealRef.current.offsetHeight
      const sectionScroll = -sectionRect.top
      const clampedScroll = Math.min(Math.max(sectionScroll, 0), sectionHeight)
      const sectionProgress = clampedScroll / Math.max(sectionHeight, 1)

      // Delay zoom so it starts later in the section.
      const zoomStart = 0.38
      const zoomEnd = 0.78
      const zoomRaw = (sectionProgress - zoomStart) / (zoomEnd - zoomStart)
      const zoomProgress = Math.min(Math.max(zoomRaw, 0), 1)

      // Puzzle reveal begins as zoom gets close to complete.
      const puzzleStart = 0.62
      const puzzleEnd = 0.98
      const puzzleRaw = (sectionProgress - puzzleStart) / (puzzleEnd - puzzleStart)
      const revealProgress = Math.min(Math.max(puzzleRaw, 0), 1)

      setGameRevealProgress(zoomProgress)
      setPuzzleRevealProgress(revealProgress)
    }

    updateRevealProgress()
    window.addEventListener('scroll', updateRevealProgress, { passive: true })
    window.addEventListener('resize', updateRevealProgress)

    return () => {
      window.removeEventListener('scroll', updateRevealProgress)
      window.removeEventListener('resize', updateRevealProgress)
    }
  }, [])

  return (
    <>
      <Landing />

      <section className='game-reveal' ref={gameRevealRef}>
        <div className='game-reveal__sticky'>
          <div className='game-reveal__panel'>
            <p className='game-reveal__text'>since you’re competitive</p>
            <span
              className='game-reveal__games'
              style={{
                transform: `scale(${gamesScale})`,
                opacity: gamesOpacity,
                filter: `blur(${gamesBlur}px)`,
              }}
            >
              GAME TIME
            </span>
          </div>
        </div>
      </section>

      <div
        className='puzzle-reveal'
        style={{
          opacity: 0.05 + puzzleRevealProgress * 0.95,
          transform: `translateY(${56 - puzzleRevealProgress * 56}px)`,
        }}
      >
        <section className='puzzle-picker'>
          <h2 className='puzzle-picker__title'>Complete the Memory</h2>
          <p className='puzzle-picker__subtitle'>
            Rebuild the picture piece by piece to unlock a special birthday treat.
          </p>
          <div className='puzzle-picker__actions'>
            <button
              type='button'
              className={`puzzle-picker__button${
                puzzleDifficulty === 'easy' ? ' puzzle-picker__button--active' : ''
              }`}
              onClick={() => setPuzzleDifficulty('easy')}
            >
              Easy
            </button>
            <button
              type='button'
              className={`puzzle-picker__button${
                puzzleDifficulty === 'okay' ? ' puzzle-picker__button--active' : ''
              }`}
              onClick={() => setPuzzleDifficulty('okay')}
            >
              Okay
            </button>
            <button
              type='button'
              className={`puzzle-picker__button${
                puzzleDifficulty === 'hard' ? ' puzzle-picker__button--active' : ''
              }`}
              onClick={() => setPuzzleDifficulty('hard')}
            >
              Hard
            </button>
          </div>
          <p className='puzzle-picker__hint'>
            Drag and drop the pieces to complete the image.
          </p>
        </section>

        <Puzzle
          title={null}
          subtitle={null}
          imageSrc={puzzleImage}
          rows={difficultyConfig.rows}
          columns={difficultyConfig.columns}
        />
      </div>

      <Balloon />

      <Paper
        paragraphs={[birthdayNoteTitle, ...birthdayNoteParagraphs]}
        signature={birthdayNoteSignature}
      />
    </>
  )
}

export default App
