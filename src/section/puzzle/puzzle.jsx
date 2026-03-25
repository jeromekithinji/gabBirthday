import React, { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { JigsawPuzzle } from 'react-jigsaw-puzzle/lib'
import 'react-jigsaw-puzzle/lib/jigsaw-puzzle.css'
import './puzzle.scss'

const MODAL_TITLE = 'Winner Winner 🥳🏅'
const MODAL_MESSAGE =
  'Ayyyyyyyyy you see how you\'re a cutieee from day 1!! Your prize is..... 🥁'
const MODAL_REWARD = 'A date night next week ✨'
const MODAL_REWARD_DETAILS = 'Thursday 6:30pm, B12 Burgers St Catherine'
const MODAL_EVENT_LOCATION = '1826 Rue Sainte-Catherine O\nMontreal, Quebec H3H 1M1'
const MODAL_EVENT_NOTES = 'Come suppaaaa hungry'
const MODAL_EVENT_FILENAME = 'birthdayDateNightSuprise.ics'

function pad2 (value) {
  return String(value).padStart(2, '0')
}

function formatIcsDateTime (date) {
  const year = date.getFullYear()
  const month = pad2(date.getMonth() + 1)
  const day = pad2(date.getDate())
  const hours = pad2(date.getHours())
  const minutes = pad2(date.getMinutes())
  const seconds = pad2(date.getSeconds())

  return `${year}${month}${day}T${hours}${minutes}${seconds}`
}

function getNextThursdayAtTime ({
  hour,
  minute,
}) {
  const now = new Date()
  const result = new Date(now)

  const day = result.getDay()
  const THURSDAY = 4
  let daysUntil = (THURSDAY - day + 7) % 7

  if (daysUntil === 0) {
    const hasPassedToday =
      now.getHours() > hour ||
      (now.getHours() === hour && now.getMinutes() >= minute)
    if (hasPassedToday) {
      daysUntil = 7
    }
  }

  result.setDate(result.getDate() + daysUntil)
  result.setHours(hour, minute, 0, 0)
  return result
}

function buildIcs ({
  startDate,
  endDate,
  title,
  description,
  location,
}) {
  const dtStamp = formatIcsDateTime(new Date())
  const dtStart = formatIcsDateTime(startDate)
  const dtEnd = formatIcsDateTime(endDate)
  const uid = `${dtStamp}-${Math.random().toString(16).slice(2)}@gbirthday`

  const escapeText = (text) =>
    String(text)
      .replaceAll('\\', '\\\\')
      .replaceAll('\n', '\\n')
      .replaceAll(',', '\\,')
      .replaceAll(';', '\\;')

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//gBirthday//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeText(title)}`,
    `DESCRIPTION:${escapeText(description)}`,
    `LOCATION:${escapeText(location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n')
}

function downloadIcs (icsText, filename) {
  const blob = new Blob([icsText], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  link.remove()

  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

const Puzzle = ({
  title = 'Puzzle Time',
  subtitle = 'Put the picture back together.',
  imageSrc = '/hero.png',
  rows = 3,
  columns = 4,
}) => {
  const [isSolvedModalOpen, setIsSolvedModalOpen] = useState(false)
  const [typedMessage, setTypedMessage] = useState('')
  const [isRewardVisible, setIsRewardVisible] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateWindowSize()
    window.addEventListener('resize', updateWindowSize)

    return () => {
      window.removeEventListener('resize', updateWindowSize)
    }
  }, [])

  const handleSolved = () => {
    setIsSolvedModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsSolvedModalOpen(false)
  }

  const handleClaimReward = () => {
    const start = getNextThursdayAtTime({ hour: 18, minute: 30 })
    const end = new Date(start)
    end.setHours(end.getHours() + 5)

    const ics = buildIcs({
      startDate: start,
      endDate: end,
      title: 'Date night ✨',
      description: `Reward unlocked!\n\n${MODAL_MESSAGE}\n\nNotes: ${MODAL_EVENT_NOTES}`,
      location: MODAL_EVENT_LOCATION,
    })

    downloadIcs(ics, MODAL_EVENT_FILENAME)
    handleCloseModal()
  }

  useEffect(() => {
    if (!isSolvedModalOpen) {
      setTypedMessage('')
      setIsRewardVisible(false)
      return undefined
    }

    let charIndex = 0
    let typingIntervalId
    let rewardTimeoutId

    const startTypingTimeoutId = window.setTimeout(() => {
      typingIntervalId = window.setInterval(() => {
        charIndex += 1
        setTypedMessage(MODAL_MESSAGE.slice(0, charIndex))

        if (charIndex >= MODAL_MESSAGE.length) {
          window.clearInterval(typingIntervalId)
          rewardTimeoutId = window.setTimeout(() => {
            setIsRewardVisible(true)
          }, 220)
        }
      }, 32)
    }, 2000)

    return () => {
      window.clearTimeout(startTypingTimeoutId)
      if (typingIntervalId) {
        window.clearInterval(typingIntervalId)
      }
      if (rewardTimeoutId) {
        window.clearTimeout(rewardTimeoutId)
      }
    }
  }, [isSolvedModalOpen])

  return (
    <section className='puzzle'>
      {isSolvedModalOpen ? (
        <div className='puzzle__celebration'>
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={350}
          />
          <div className='puzzle__modal-backdrop' onClick={handleCloseModal}>
            <div
              className='puzzle__modal'
              role='dialog'
              aria-modal='true'
              aria-labelledby='puzzle-modal-title'
              onClick={(event) => event.stopPropagation()}
            >
              <h3 className='puzzle__modal-title' id='puzzle-modal-title'>
                {MODAL_TITLE}
              </h3>
              <p className='puzzle__modal-text' aria-live='polite'>
                {typedMessage}
                {isSolvedModalOpen && typedMessage.length < MODAL_MESSAGE.length ? (
                  <span className='puzzle__typing-cursor'>|</span>
                ) : null}
              </p>
              {isRewardVisible ? (
                <>
                  <p className='puzzle__modal-reward'>{MODAL_REWARD}</p>
                  <p className='puzzle__modal-reward-details'>
                    {MODAL_REWARD_DETAILS}
                  </p>
                </>
              ) : null}
              <button
                type='button'
                className='puzzle__modal-button'
                onClick={handleClaimReward}
              >
                Claim it
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className='puzzle__content'>
        {title ? <h2 className='puzzle__title'>{title}</h2> : null}
        {subtitle ? (
          <span className='puzzle__subtitle'>{subtitle}</span>
        ) : null}
        <div className='puzzle__board'>
          <JigsawPuzzle
            imageSrc={imageSrc}
            rows={rows}
            columns={columns}
            onSolved={handleSolved}
          />
        </div>
      </div>
    </section>
  )
}

export default Puzzle
