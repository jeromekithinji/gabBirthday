import React, { useMemo, useState } from 'react'
import './balloon.scss'

const COLORS = ['#ef4444', '#3b82f6', '#a855f7', '#f97316', '#e11d48', '#0ea5e9']
const MESSAGES = [
	'You’re genuinely caring',
	'You make everyone feel cared for',
	'You’re thoughtful in little ways',
	'You’re the Facebook Marketplace king',
	'You’re always honest',
	'You’re kind to everyone',
	'You’re very dependable',
	'You listen so well',
	'You’re so affectionate',
	'You snore on max volume',
	'You’re so genuine',
	'You’re my safe place',
	'You’re so intentional',
	'You’re sweet without trying',
	'You’re always considerate',
	'You always keep it real',
	'You care so deeply',
	'You love so purely',
	'You’re funny and smart',
	'You’re an interior designaaa',
	'You always show up',
	'You make me a better person',
	'You’re so handsome and segzy',
	'You’re the best photographer',
	'You make cooking feel special',
	'You push me to grow',
	'You’re my favorite adventure',
	'You give the warmest hugs',
	'Your smile is contagious',
	'You look segsy when you reversing and look back',
	'You have really nice eyes',
	'You make life feel lighter',
	'You’re my partner in crime',
	'You’re so respectful',
	'You’re very selfless',
]

const BALLOONS = Array.from({ length: MESSAGES.length }, (_, index) => ({
	id: index + 1,
	color: COLORS[index % COLORS.length],
	message: MESSAGES[index % MESSAGES.length],
}))

const Balloon = ({
	title = 'Pop the Balloon: Birthday Edition🎈📌',
	subtitle = 'Each balloon is hiding a reason why you’re that guyyyy.',
}) => {
	const [poppedId, setPoppedId] = useState(null)

	const balloons = useMemo(() => BALLOONS, [])

	const handleBalloonClick = (balloonId) => {
		setPoppedId(balloonId)
	}

	const handleOutsideClick = () => {
		setPoppedId(null)
	}

	return (
		<section className='balloon' onClick={handleOutsideClick}>
			<div className='balloon__content'>
				<h2 className='balloon__title'>{title}</h2>
				<p className='balloon__love-prompt'>Loveee or poppp</p>
				<p className='balloon__subtitle'>{subtitle}</p>

				<div className='balloon__grid'>
					{balloons.map((balloon) => {
						const isPopped = poppedId === balloon.id

						return (
							<div className='balloon__item' key={balloon.id}>
								<button
									type='button'
									className={`balloon__bubble${
										isPopped ? ' balloon__bubble--popped' : ''
									}`}
									style={{ '--balloon-color': balloon.color }}
									onClick={(event) => {
										event.stopPropagation()
										handleBalloonClick(balloon.id)
									}}
									aria-label={`Pop balloon ${balloon.id}`}
								>
									<span className='balloon__number'>{balloon.id}</span>
									<span className='balloon__knot' />
								</button>

								<p
									className={`balloon__message${
										isPopped ? ' balloon__message--visible' : ''
									}`}
								>
									{balloon.message}
								</p>
							</div>
						)
					})}
				</div>
			</div>
		</section>
	)
}

export default Balloon
