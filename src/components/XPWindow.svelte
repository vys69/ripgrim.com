<script>
    import { scale } from "svelte/transition";
    import { quintOut } from "svelte/easing";

    export let id;
    export let icon;
    export let title;
    export let controls = ["Minimize", "Maximize", "Close"];
    export let description;
    export let buttonText;
    export let buttonUrl;
    export let disabled = false;
    export let styles = "";

    export let draggedWindow;
    export let startDragging;
    export let toggleWindow;
</script>

<div
    class="window"
    style="width: 300px; margin-bottom: 20px; position: relative; transform: translate({draggedWindow &&
    draggedWindow.id === id
      ? draggedWindow.x
      : 0}px, {draggedWindow &&
    draggedWindow.id === id
      ? draggedWindow.y
      : 0}px); {styles}"
    transition:scale={{duration: 300, start: 0.95, opacity: 0, easing: quintOut}}
>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="title-bar"
      on:mousedown={(e) => startDragging(id, e)}
    >
      <div class="title-bar-text">
        <img
          class="project-icon"
          src={icon}
          alt="{title} logo"
          style="width: 16px; height: 16px; margin-right: 5px;"
        />
        {title}
      </div>
      <div class="title-bar-controls">
        {#each controls as control}
          <button
            aria-label={control}
            on:click={() => control === "Close" && toggleWindow(id)}
          ></button>
        {/each}
      </div>
    </div>
    <div class="window-body">
      <p>{description}</p>
      <div
        class="field-row"
        style="justify-content: flex-end;"
      >
        <a
          href={disabled ? null : buttonUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          class="project-link"
          class:disabled
        >
          <button class="xp-button">{buttonText}</button>
        </a>
      </div>
    </div>
</div>