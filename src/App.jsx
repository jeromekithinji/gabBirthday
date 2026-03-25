import { useState } from 'react'
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

  const puzzleImage = babyPic
  const difficultyConfig =
    puzzleDifficulty === 'easy'
      ? { rows: 2, columns: 3 }
      : puzzleDifficulty === 'medium'
        ? { rows: 3, columns: 4 }
        : { rows: 4, columns: 5 }

  return (
    <>
      <Landing />

      <section className='game-reveal' aria-label='Game time'>
        <div className='game-reveal__inner'>
          <div className='game-reveal__panel'>
            <p className='game-reveal__text'>since you’re competitive</p>
            <span className='game-reveal__games'>GAME TIME</span>
            <p className='game-reveal__scroll-hint'>
              Scroll down to the game below
            </p>
          </div>
        </div>
      </section>

      <div className='puzzle-reveal'>
        <section className='puzzle-picker'>
          <h2 className='puzzle-picker__title'>Complete the Puzzle</h2>
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
                puzzleDifficulty === 'medium'
                  ? ' puzzle-picker__button--active'
                  : ''
              }`}
              onClick={() => setPuzzleDifficulty('medium')}
            >
              Medium
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
          <p className='puzzle-picker__mobile-warning'>
            ⚠️May glitch on mobile phone, best is laptop⚠️
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
