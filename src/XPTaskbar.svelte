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
            <button on:click={toggleInfoWindow}>Close</button>
        </div>
    {/if}
</div>

<style>

    .taskbar-icon-container {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        min-width: min-content; /* Ensures container doesn't shrink smaller than its content */
        padding: 0 5px;
    }

    .xp-footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 40px;
        /* background: linear-gradient(
            to bottom,
            #2584e1 0%,
            #3c81f3 9%,
            #3c81f3 91%,
            #2584e1 100%
        ); */
        background-image: url("/titlebar.jpg");
        background-size: cover;
        display: flex;
        align-items: center;
        padding: 0 2px;
        box-shadow: inset 0 1px 0 0 #000000;
    }

    /* .xp-footer::before {
        content: "";
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: -1;
        height: 40px;
    } */

    .xp-footer-inner {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 40px;
    }

    .xp-footer-start {
        display: flex;
        align-items: center;
    }

    .start-button {
        align-items: center;
        background: radial-gradient(circle, #272727 0, #000000 100%) 50% / cover
            no-repeat;
        border: none;
        border-radius: 0 10px 15px 0;
        box-shadow: inset 0 5px 10px #3b3b3b;
        color: #fff;
        display: flex;
        font-size: 18px;
        font-style: italic;
        left: -5px;
        padding: 10px 25px 10px 15px;
        position: relative;
        text-shadow: 1px 1px 1px #333;
        transform: skewX(-3deg);
        height: 100%;
        cursor: pointer;
        margin: 0;
    }

    .start-button img {
        width: 20px;
        height: 20px;
        margin-right: 5px;
        transform: skewX(3deg);
        filter: saturate(0) contrast(1.5);
    }

    .xp-footer-end {
        align-items: center;
        background: linear-gradient(
            180deg,
            #2f2f2f 0,
            #1a1a1a 9%,
            #232323 18%,
            #212121 92%,
            #333
        );
        box-shadow:
            inset 1px 0 #000000,
            inset 2px 0 #3b3b3b;
        display: flex;
        height: 100%;
        padding: 0 10px;
    }

    .info-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        min-width: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0px 10px 0 0;
    }

    .info-button img {
        width: 16px;
        height: 16px;
        filter: saturate(0);
    }

    .time-display {
        color: white;
        font-size: 12px;
        font-family: "Tahoma", sans-serif;
    }

    .info-window {
        position: absolute;
        bottom: 30px;
        right: 0;
        background-color: #fffbf0;
        border: 1px solid #000;
        padding: 10px;
        font-family: "Tahoma", sans-serif;
        font-size: 11px;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
    }

    .info-window button {
        background-color: #d4d0c8;
        border: 1px solid #000;
        padding: 2px 5px;
        font-family: "Tahoma", sans-serif;
        font-size: 11px;
        margin-top: 5px;
        cursor: pointer;
    }

    .xp-footer-middle {
        flex: 1;
        
        overflow-y: auto;
        
    }

    .xp-footer-middle::-webkit-scrollbar {
        display: none; /* WebKit */
    }
</style>
