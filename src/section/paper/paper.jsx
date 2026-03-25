import React, { useRef, useState } from 'react'
import './paper.scss'
import birthdayAudioSrc from '../../content/The Main Ingredient - Let Me Prove My Love To You.mp3'

const Paper = ({
	message = '',
	paragraphs = null,
	signature = '',
}) => {
	const audioRef = useRef(null)
	const [isPlaying, setIsPlaying] = useState(false)
	const [hasStarted, setHasStarted] = useState(false)

	const handlePlayFromTwenty = () => {
		const audio = audioRef.current

		if (!audio) {
			return
		}

		// Toggle between play and pause.
		if (!audio.paused) {
			audio.pause()
			return
		}

		audio.currentTime = 20
		audio
			.play()
			.then(() => {
				setHasStarted(true)
				setIsPlaying(true)
			})
			.catch(() => {
				setIsPlaying(false)
			})
	}

	return (
		<section className='paper-section'>
			<div className='paper-section__content'>
				<div className='paper-section__heading-row'>
					<h2 className='paper-section__heading'>a likkol note.....</h2>
					<button
						type='button'
						className='paper-section__play-button'
						onClick={handlePlayFromTwenty}
						aria-label='Play birthday note from 20 seconds'
					>
							{isPlaying
								? 'Playing'
								: hasStarted
									? 'Paused'
									: 'Play'}
					</button>
					<audio
						ref={audioRef}
						src={birthdayAudioSrc}
						preload='none'
							onPlay={() => {
								setHasStarted(true)
								setIsPlaying(true)
							}}
							onPause={() => setIsPlaying(false)}
							onEnded={() => setIsPlaying(false)}
					/>
				</div>
				<article className='paper-letter'>
					<div className='paper-letter__inner'>
						<div className='paper-letter__body'>
							{paragraphs && paragraphs.length > 0
								? paragraphs.map((para, index) => (
										<p key={index} className='paper-letter__paragraph'>
											{para}
										</p>
									))
								: message
									? <p className='paper-letter__paragraph'>{message}</p>
									: null}
							{signature ? (
								<p className='paper-letter__signature'>{signature}</p>
							) : null}
						</div>
					</div>
				</article>
			</div>
		</section>
	)
}

export default Paper
