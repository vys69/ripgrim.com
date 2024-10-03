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
	import { flip } from "svelte/animate";

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
			social_links: [
				{
					name: "twitter",
					url: "https://x.com/fuckgrimlabs",
					icon: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/x-social-media-black-icon.png",
				},
				{
					name: "github",
					url: "https://github.com/vys69",
					icon: "https://github.com/favicon.ico",
				},
			],
		},
		{
			id: "graveyard_project",
			name: "graveyard",
			url: "graveyard.rip",
			taskbar_icon: "/favi.png",
			icon: "/favi.png",
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
			disabled: false,
			social_links: [
				{
					name: "twitter",
					url: "https://x.com/fuckgrimlabs",
					icon: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/x-social-media-black-icon.png",
				},
				{
					name: "repo link",
					url: "https://github.com/vys69/grim-playground",
					icon: "https://github.com/favicon.ico",
				},
			],
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

	let flashingIcons = new Set();

	function toggleWindow(id) {
		windowStore.update((windows) => {
			const windowIndex = windows.findIndex((w) => w.id === id);
			if (windowIndex !== -1) {
				windows[windowIndex].isOpen = !windows[windowIndex].isOpen;
				if (windows[windowIndex].isOpen) {
					flashingIcons.add(id);
					setTimeout(() => {
						flashingIcons.delete(id);
						flashingIcons = flashingIcons; // trigger reactivity
					}, 3000);
				}
			} else if (projects.some((p) => p.id === id)) {
				windows.push({ id, isOpen: true });
				flashingIcons.add(id);
				setTimeout(() => {
					flashingIcons.delete(id);
					flashingIcons = flashingIcons; // trigger reactivity
				}, 3000);
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
				startX: event.type.includes("mouse")
					? event.clientX
					: event.touches[0].clientX,
				startY: event.type.includes("mouse")
					? event.clientY
					: event.touches[0].clientY,
				x: 0,
				y: 0,
				zIndex: highestZIndex,
			};

			// Update the window's z-index in the store
			windowStore.update((windows) =>
				windows.map((w) =>
					w.id === id ? { ...w, zIndex: highestZIndex } : w,
				),
			);
		}
	}

	function stopDragging() {
		if (draggedWindow) {
			// Reset the z-index to a base value when dragging stops
			windowStore.update((windows) =>
				windows.map((w) =>
					w.id === draggedWindow.id ? { ...w, zIndex: 1 } : w,
				),
			);
			draggedWindow = null;
		}
	}

	function drag(event) {
		if (draggedWindow) {
			const clientX = event.type.includes("mouse")
				? event.clientX
				: event.touches[0].clientX;
			const clientY = event.type.includes("mouse")
				? event.clientY
				: event.touches[0].clientY;

			const easeFactor = 0.2;
			const rawX = clientX - draggedWindow.startX;
			const rawY = clientY - draggedWindow.startY;

			const easeFunction = (x) =>
				(Math.sign(x) * Math.log(1 + Math.abs(x) * easeFactor)) /
				easeFactor;

			draggedWindow.x = easeFunction(rawX);
			draggedWindow.y = easeFunction(rawY);

			// Prevent default to stop scrolling on mobile
			event.preventDefault();
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

	const desktopDontClickGrim =
		"whatever u do DONT click on grim 🙁 (the skeleton)";

	$: openWindows = $windowStore.filter((w) => w.isOpen);

	let flipDuration = 300;
</script>

<svelte:head>
	<link rel="stylesheet" href="https://unpkg.com/xp.css" />
</svelte:head>

<svelte:window
	on:mousemove={drag}
	on:touchmove={drag}
	on:mouseup={stopDragging}
	on:touchend={stopDragging}
/>

<div class="xp-container winxp-background">
	<div id="scroll-container" class="center">
		<div id="body-content">
			<section id="introduction" class="section row">
				<div id="introduction-top">
					<div class="paragraph">
						<div class="title">
							<span class="wiggle">hi </span> lol, i'm grim
						</div>
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
							<div animate:flip={{ duration: flipDuration }}>
								{#if projects.some((p) => p.id === window.id)}
									{@const project = projects.find(
										(p) => p.id === window.id,
									)}
									<XPWindow
										id={window.id}
										icon={project.icon}
										title={project.name}
										description={project.description}
										buttonText={project.disabled
											? "Coming Soon"
											: project.name}
										buttonUrl={project.disabled
											? null
											: `https://${project.url}`}
										social_links={project.social_links}
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
					: ''} {flashingIcons.has(project.id) ? 'flashing' : ''}"
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
