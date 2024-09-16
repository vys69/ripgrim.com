<script>
    import { onMount } from "svelte";

    let currentTime = new Date();
    let showInfoWindow = false;

    onMount(() => {
        const timer = setInterval(() => {
            currentTime = new Date();
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    });

    function toggleInfoWindow() {
        showInfoWindow = !showInfoWindow;
    }
</script>

<div class="xp-footer">
    <div class="xp-footer-inner">
        <div class="xp-footer-start">
            <button class="start-button">
                <img
                    src="https://github.com/vys69/FM-Stalker/blob/914f93cec4985ce2e7c30a31c3f1097faff0209f/public/winicon.png?raw=true"
                    alt="Windows Logo"
                />
                Start
            </button>
        </div>
        <div class="xp-footer-middle">
            <div class="taskbar-icon-container">
                <slot name="taskbar-icons"></slot>
            </div>
        </div>
        <div class="xp-footer-end">
            <button on:click={toggleInfoWindow} class="info-button">
                <img
                    src="https://fmstalker.com/icons/question.png"
                    alt="Info"
                />
            </button>
            <div class="time-display">
                {currentTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </div>
        </div>
    </div>
    {#if showInfoWindow}
        <div class="info-window">
            <p>hi lol</p>
            <a href="https://github.com/vys69/ripgrim.com">repo</a>
            <button on:click={toggleInfoWindow}>Close</button>
        </div>
    {/if}
</div>

<style>
    
</style>
