import React, { useEffect, useMemo, useRef, useState } from 'react'
import Confetti from 'react-confetti'
import { motion, useReducedMotion } from 'framer-motion'
import heroImg from '../../assets/hero.png'
import babyPic from '../../assets/puzzle/babypic.jpg'
import './landing.scss'

const HEADLINE = 'Happy 30th Burthdayyyy'

// One glob per extension avoids Vite/glob edge cases with mixed brace patterns.
const LANDING_PAGE_PIC_MODULES = {
	...import.meta.glob('../../assets/landingPagepics/*.jpg', {
		eager: true,
		import: 'default',
	}),
	...import.meta.glob('../../assets/landingPagepics/*.jpeg', {
		eager: true,
		import: 'default',
	}),
	...import.meta.glob('../../assets/landingPagepics/*.JPG', {
		eager: true,
		import: 'default',
	}),
	...import.meta.glob('../../assets/landingPagepics/*.JPEG', {
		eager: true,
		import: 'default',
	}),
	...import.meta.glob('../../assets/landingPagepics/*.png', {
		eager: true,
		import: 'default',
	}),
	...import.meta.glob('../../assets/landingPagepics/*.PNG', {
		eager: true,
		import: 'default',
	}),
	...import.meta.glob('../../assets/landingPagepics/*.webp', {
		eager: true,
		import: 'default',
	}),
	...import.meta.glob('../../assets/landingPagepics/*.WEBP', {
		eager: true,
		import: 'default',
	}),
	...import.meta.glob('../../assets/landingPagepics/*.gif', {
		eager: true,
		import: 'default',
	}),
	...import.meta.glob('../../assets/landingPagepics/*.GIF', {
		eager: true,
		import: 'default',
	}),
}

const LANDING_PAGE_IMAGES = Object.entries(LANDING_PAGE_PIC_MODULES)
	.sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
	.map(([path, src]) => {
		const rawName = path.split('/').pop() || 'memory'
		const cleanName = rawName.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ')
		return {
			src,
			alt: cleanName || 'memory',
		}
	})

const BASE_IMAGES =
	LANDING_PAGE_IMAGES.length > 0
		? LANDING_PAGE_IMAGES
		: [
			{ src: babyPic, alt: 'Baby memory' },
			{ src: heroImg, alt: 'Celebration' },
		]

function Landing () {
	const sectionRef = useRef(null)
	const [burstKey, setBurstKey] = useState(1)
	const [sectionSize, setSectionSize] = useState({ width: 0, height: 0 })
	const [confettiEnabled, setConfettiEnabled] = useState(true)
	const prefersReducedMotion = useReducedMotion()

	const marqueeImages = useMemo(() => {
		const repeated = []
		for (let i = 0; i < 6; i += 1) {
			repeated.push(...BASE_IMAGES)
		}
		return repeated
	}, [])

	useEffect(() => {
		const element = sectionRef.current

		if (!element) {
			return undefined
		}

		const updateSize = () => {
			setSectionSize({
				width: element.offsetWidth,
				height: element.offsetHeight,
			})
		}

		updateSize()

		if (typeof ResizeObserver === 'undefined') {
			window.addEventListener('resize', updateSize)
			return () => {
				window.removeEventListener('resize', updateSize)
			}
		}

		const observer = new ResizeObserver(updateSize)
		observer.observe(element)

		return () => {
			observer.disconnect()
		}
	}, [])

	useEffect(() => {
		const reducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)',
		).matches

		if (reducedMotion) {
			return undefined
		}

		const id = window.setInterval(() => {
			setBurstKey((key) => key + 1)
		}, 9000)

		return () => {
			window.clearInterval(id)
		}
	}, [])

	return (
		<section className='landing' aria-label='Birthday greeting' ref={sectionRef}>
			<div className='landing__confetti' aria-hidden='true'>
				{confettiEnabled && sectionSize.width > 0 ? (
					<Confetti
						key={burstKey}
						width={sectionSize.width}
						height={sectionSize.height}
						recycle={false}
						numberOfPieces={320}
						gravity={0.28}
						initialVelocityY={18}
						colors={[
							'#f472b6',
							'#a78bfa',
							'#fcd34d',
							'#fb7185',
							'#38bdf8',
							'#4ade80',
							'#fff',
						]}
					/>
				) : null}
			</div>

			<div className='landing__glow landing__glow--one' aria-hidden='true' />
			<div className='landing__glow landing__glow--two' aria-hidden='true' />

			<div className='landing__inner'>
				<div className='landing__hero-text'>
					<motion.p
						className='landing__eyebrow'
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
					>
						🎂 ✨ 🎉
					</motion.p>

					<motion.h1
						className='landing__title'
						initial={{ opacity: 0, y: 28 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
					>
						<motion.span
							className='landing__title-text'
							initial={{ scale: 1 }}
							animate={prefersReducedMotion ? { scale: 1 } : { scale: [1, 1.12, 1] }}
							transition={
								prefersReducedMotion
									? { duration: 0 }
									: {
										duration: 0.8,
										times: [0, 0.45, 1],
										ease: [0.22, 1, 0.36, 1],
										repeat: Infinity,
										repeatDelay: 1.2,
									}
							}
						>
							{HEADLINE}
						</motion.span>
					</motion.h1>

				</div>

				<motion.div
					className='landing__carousel-wrap'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.7, delay: 0.45 }}
				>
					<div className='landing__carousel' role='list'>
						<div className='landing__track'>
							{marqueeImages.map((item, index) => (
								<div
									className='landing__slide'
									key={`a-${index}`}
									role='listitem'
								>
									<img
										className='landing__img'
										src={item.src}
										alt={item.alt}
										loading={index < 3 ? 'eager' : 'lazy'}
										draggable={false}
									/>
								</div>
							))}
						</div>
						<div className='landing__track landing__track--clone' aria-hidden='true'>
							{marqueeImages.map((item, index) => (
								<div className='landing__slide' key={`b-${index}`}>
									<img
										className='landing__img'
										src={item.src}
										alt=''
										loading='lazy'
										draggable={false}
									/>
								</div>
							))}
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	)
}

export default Landing
