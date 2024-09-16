<script>
	import { onMount } from "svelte";
	import XPTaskbar from "./XPTaskbar.svelte";
	import { fade, scale } from "svelte/transition";
	import { quintOut } from "svelte/easing";
	import { writable } from "svelte/store";
	import "../public/xp.css";
	import Device from "svelte-device-info";
	import XPWindow from "./components/XPWindow.svelte";
    import Emoji from "./components/Emoji.svelte";
    import { flip } from 'svelte/animate';
	

	const projects = [
		{
			id: "grim_project",
			name: "grim's lab",
			url: "grimlabs.co",
			taskbar_icon: "/labs.png",
			icon: "/labs.png",
			description:
				"web development agency without the bullshit. we innovate. that's it. none of this stupid marketing trickery. what you see is what you get.",
			disabled: false,
		},
		{
			id: "graveyard_project",
			name: "graveyard",
			url: "graveyard.rip",
			taskbar_icon: "/graveyard.png",
			icon: "/graveyard.png",
			description:
				"free and open source client management dashboard with a seamless discord integration. clients can browse premade projects, your portfolio, or fill out a form for whatever the fuck u want. also it's just a really pretty website.",
			disabled: true,
		},
		{
			id: "playground_project",
			name: "playground",
			url: "playground.rip",
			taskbar_icon: "/playground.png",
			icon: "/playground.png",
			description: "mess around with our themes without spending a dime",
			disabled: true,
		},
	];

	const emojis = [
		{
			name: "reaper",
			url: "https://attic.sh/j3wq2ew1c02jhynbaa2nrj94te9q",
			size: "3rem",
		},
		{
			name: "reaper2",
			url: "https://attic.sh/6osk5yjba6kbznkyr2jlfdrrxyep",
			size: "3rem",
		},
		{
			name: "skull",
			url: "https://attic.sh/6osk5yjba6kbznkyr2jlfdrrxyep",
			size: "3rem",
		},
	];

	// Function to load window states from local storage
	function loadWindowStates() {
		const savedStates = localStorage.getItem("windowStates");
		if (savedStates) {
			const parsedStates = JSON.parse(savedStates);
			// Filter out any saved states that don't correspond to current projects
			return parsedStates.filter((state) =>
				projects.some((p) => p.id === state.id),
			);
		}
		// If no saved states, return all windows as open
		return projects.map((project) => ({
			id: project.id,
			isOpen: true,
		}));
	}

	const windowStore = writable(loadWindowStates());

	// Save window states to local storage whenever they change
	$: {
		localStorage.setItem("windowStates", JSON.stringify($windowStore));
	}

	let draggedWindow = null;
	let highestZIndex = 1;

	function toggleWindow(id) {
		windowStore.update((windows) => {
			const windowIndex = windows.findIndex((w) => w.id === id);
			if (windowIndex !== -1) {
				windows[windowIndex].isOpen = !windows[windowIndex].isOpen;
			} else if (projects.some((p) => p.id === id)) {
				// If the window doesn't exist in the store but exists in projects, add it
				windows.push({ id, isOpen: true });
			}
			return windows;
		});
	}

	function startDragging(id, event) {
		const targetWindow = $windowStore.find((w) => w.id === id);
		if (targetWindow) {
			highestZIndex++;
			draggedWindow = {
				id,
				startX: event.clientX,
				startY: event.clientY,
				x: 0,
				y: 0,
				zIndex: highestZIndex
			};
			
			// Update the window's z-index in the store
			windowStore.update(windows => 
				windows.map(w => w.id === id ? {...w, zIndex: highestZIndex} : w)
			);
		}
	}

	function stopDragging() {
		if (draggedWindow) {
			// Reset the z-index to a base value when dragging stops
			windowStore.update(windows => 
				windows.map(w => w.id === draggedWindow.id ? {...w, zIndex: 1} : w)
			);
			draggedWindow = null;
		}
	}

	function drag(event) {
		if (draggedWindow) {
			const easeFactor = 0.1; // Adjust this to change the easing strength

			const rawX = event.clientX - draggedWindow.startX;
			const rawY = event.clientY - draggedWindow.startY;

			// Apply easing function
			const easeFunction = (x) => Math.sign(x) * Math.log(1 + Math.abs(x) * easeFactor) / easeFactor;

			draggedWindow.x = easeFunction(rawX);
			draggedWindow.y = easeFunction(rawY);
		}
	}

	let currentTime = new Date();
	let showInfoWindow = false;

	onMount(() => {
		const timer = setInterval(() => {
			currentTime = new Date();
		}, 1000);

		// Add this part to initialize oneko
		const script = document.createElement("script");
		script.src = "/oneko.js"; // Assuming you placed oneko.js in the public folder
		script.onload = function () {
			console.log("Oneko script loaded");
		};
		document.head.appendChild(script);

		return () => {
			clearInterval(timer);
			// Optionally, you can remove the script when the component is destroyed
			document.head.removeChild(script);
		};
	});

	function toggleInfoWindow() {
		showInfoWindow = !showInfoWindow;
	}

	const desktopDontClickGrim =
		"whatever u do DONT click on grim 🙁 (the skeleton)";

	$: openWindows = $windowStore.filter((w) => w.isOpen);

  let flipDuration = 300;
</script>

<svelte:head>
	<link rel="stylesheet" href="https://unpkg.com/xp.css" />
</svelte:head>

<svelte:window on:mousemove={drag} on:mouseup={stopDragging} />

<div class="xp-container winxp-background">
	<div id="scroll-container" class="center">
		<div id="body-content">
			<section id="introduction" class="section row">
				<div id="introduction-top">
					<div class="paragraph">
						<div class="title">hi lol, i'm grim</div>
						<div class="body">
							i yap, code cool shit, and push breaking changes to
							prod on fridays.
							<br /><br />
							i fuck around and sometimes it ends up looking nice
							<br /><br />
							{Device.isMobile ? "" : desktopDontClickGrim}
						</div>
					</div>
					<div id="contacts">
						<a
							class="button contact-button"
							href="mailto:grimstudioss@gmail.com"
							aria-label="email"
							target="_blank"
							rel="noopener noreferrer nofollow"
						>
							<svg
								width="24"
								height="24"
								stroke="currentColor"
								stroke-width="1.5"
								class="tabler-icon tabler-icon-mail"
								viewBox="0 0 24 24"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path
									d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"
								></path>
								<path d="M3 7l9 6l9 -6"></path>
							</svg>
						</a>
						<a
							class="button contact-button"
							href="https://github.com/vys69"
							aria-label="github"
							target="_blank"
							rel="noopener noreferrer nofollow"
						>
							<svg
								width="24"
								height="24"
								stroke="currentColor"
								stroke-width="1.5"
								class="tabler-icon tabler-icon-brand-github"
								viewBox="0 0 24 24"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path
									d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"
								></path>
							</svg>
						</a>
						<a
							class="button contact-button"
							href="https://x.com/fuckgrimlabs"
							aria-label="twitter"
							target="_blank"
							rel="noopener noreferrer nofollow"
						>
							<svg
								width="24"
								height="24"
								stroke="currentColor"
								stroke-width="1.5"
								class="tabler-icon tabler-icon-brand-twitter"
								viewBox="0 0 24 24"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path
									d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c0 -.249 1.51 -2.772 1.818 -4.013z"
								></path>
							</svg>
						</a>
					</div>
				</div>
				<div id="projects">
					<div id="project-card-area">
						{#each openWindows as window (window.id)}
							<div animate:flip={{duration: flipDuration}}>
								{#if projects.some((p) => p.id === window.id)}
									{@const project = projects.find(
										(p) => p.id === window.id,
									)}
									<XPWindow
										id={window.id}
										icon={project.icon}
										title={project.name}
										description={project.description}
										buttonText={project.disabled ? "Coming Soon" : project.url}
										buttonUrl={project.disabled ? null : `https://${project.url}`}
										disabled={project.disabled}
										{draggedWindow}
										{startDragging}
										{toggleWindow}
										zIndex={window.zIndex}
									/>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			</section>
		</div>
	</div>
</div>

<XPTaskbar>
	<svelte:fragment slot="taskbar-icons">
		{#each projects as project (project.id)}
			<button
				class="taskbar-icon {$windowStore.find(
					(w) => w.id === project.id,
				)?.isOpen
					? 'opened'
					: ''}"
				on:click={() => toggleWindow(project.id)}
			>
				<img src={project.taskbar_icon} alt={project.name} />
				<span class="taskbar-icon-text">
					{$windowStore.find((w) => w.id === project.id)?.isOpen
						? project.name
						: ""}
				</span>
			</button>
		{/each}
	</svelte:fragment>
</XPTaskbar>

<style>
	:global(*) {
		box-sizing: border-box;
		user-select: none;
	}

	.xp-container {
		font-family: "Pixelated MS Sans Serif", Arial;
		-webkit-font-smoothing: none;
		font-smooth: never;
		padding-bottom: 30px;
	}

	.winxp-background {
		background-image: url("/bg.jpg");
		background-size: cover;
		background-position: center;
		background-attachment: fixed;
		min-height: 100vh;
		background-color: #000;
		color: white;
	}

	.winxp-background::before{
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.25);
	}

	#scroll-container {
		display: flex;
		justify-content: center;
		width: 100%;
		gap: 2.5rem;
	}

	#scroll-container.center {
		align-items: center;
		min-height: 100vh;
	}

	#body-content {
		display: flex;
		flex-direction: column;
		width: 90%;
		max-width: 1200px;
		margin-top: 2rem;
		position: relative;
		padding: 20px;
		border-radius: 8px;
	}

	.section {
		display: flex;
		flex-direction: column;
		position: relative;
		gap: 1rem;
	}

	.section.row {
		flex-direction: row;
		justify-content: space-around;
	}

	#introduction-top {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		justify-content: center;
	}

	.paragraph {
		display: flex;
		width: 100%;
		max-width: 22rem;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.8rem;
	}

	.title {
		font-size: 1.75rem;
		line-height: 120%;
		font-weight: bold;
		color: white;
		mix-blend-mode: difference;
	}

	.body {
		font-size: 1rem;
		line-height: 140%;
		/* white-space: pre-wrap; */
		color: #ece9d8;
		text-shadow: 1px 1px 1px black;
	}

	#contacts {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
	}

	.contact-button {
		font-family: "Pixelated MS Sans Serif", Arial;
		-webkit-font-smoothing: antialiased;
		font-size: 11px;
		box-sizing: border-box;
		border: 1px solid #000000;
		background: linear-gradient(180deg, #3b3b3b, #000000 86%, #4f4f4f);
		box-shadow: none;
		border-radius: 3px;
		min-height: 0;
		height: 27px;
		padding: 3px 10px;
	}

	.contact-button:hover svg {
		stroke: white;
	}

	.contact-button svg {
		height: 100%;
		stroke: #7b7b7b;
	}

	#projects {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	#project-card-area {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 22rem;
	}

	@media (max-width: 830px) {
		.section.row {
			flex-direction: column;
			justify-content: normal;
		}

		#scroll-container.center {
			align-items: normal;
			height: initial;
		}

		#body-content {
			margin-top: 1rem;
		}

		#introduction {
			padding-top: 0;
		}
	}

	@media (max-width: 500px) {
		.paragraph,
		#project-card-area {
			width: 100%;
		}
	}

	.taskbar-icon {
		background: none;
		border: none;
		cursor: pointer;
		padding: 2px;
		margin: 0 2px;
		min-width: 0;
	}

	.taskbar-icon.opened {
		display: flex;
		align-items: center;
		height: 30px;
		width: 100px;
		gap: 5px;
	}

	.taskbar-icon.opened {
		background-color: rgb(0 0 0 / 64%);
		border: 1px solid rgba(255, 255, 255, 0.3);
		color: white;
		backdrop-filter: blur(2px);
	}

	.taskbar-icon img {
		width: 20px;
		height: 20px;
	}
</style>
