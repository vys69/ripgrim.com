// oneko.js: https://github.com/adryd325/oneko.js

const SPRITE_SIZE = 40; // New sprite size
const SPRITE_SCALE = 2; // Scale factor (32 * 2 = 64)
let isClicked = false;
let isDeathAnimationComplete = false;

(function oneko() {
  const isReducedMotion =
    window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

  if (isReducedMotion) {
    return;
  }

  const nekoEl = document.createElement("div");

  let nekoPosX = 32;
  let nekoPosY = 32;

  let mousePosX = 0;
  let mousePosY = 0;

  let frameCount = 0;
  let idleTime = 0;
  let idleAnimation = null;
  let idleAnimationFrame = 0;

  const nekoSpeed = 10 * SPRITE_SCALE;

  const spriteSets = {
    idle: [[-3, -3]], alert: [[-7, -3]],
    scratchSelf: [[-5, 0], [-6, 0], [-7, 0]],
    scratchWallN: [[0, 0], [0, -1]], scratchWallS: [[-7, -1], [-6, -2]],
    scratchWallE: [[-2, -2], [-2, -3]], scratchWallW: [[-4, 0], [-4, -1]],
    tired: [[-3, -2]], sleeping: [[-2, 0], [-2, -1]],
    N: [[-1, -2], [-1, -3]], NE: [[0, -2], [0, -3]], E: [[-3, 0], [-3, -1]],
    SE: [[-5, -1], [-5, -2]], S: [[-6, -3], [-7, -2]], SW: [[-5, -3], [-6, -1]],
    W: [[-4, -2], [-4, -3]], NW: [[-1, 0], [-1, -1]],
    death: [[0, -3], [-1, -3], [-2, -3]] // Add death animation frames
  };

  function init() {
    nekoEl.id = "oneko";
    nekoEl.ariaHidden = true;
    nekoEl.style.width = `${SPRITE_SIZE}px`;
    nekoEl.style.height = `${SPRITE_SIZE}px`;
    nekoEl.style.position = "fixed";
    nekoEl.style.imageRendering = "pixelated";
    nekoEl.style.left = `${nekoPosX - SPRITE_SIZE / 2}px`;
    nekoEl.style.top = `${nekoPosY - SPRITE_SIZE / 2}px`;
    nekoEl.style.zIndex = 2147483647;

    const style = document.createElement('style');
    style.textContent = `
      #oneko::after {
        content: '';
        position: absolute;
        top: -10px;
        left: -10px;
        right: -10px;
        bottom: -10px;
        z-index: 2147483647;
      }
    `;
    document.head.appendChild(style);

    let nekoFile = "./testbig.gif"
    const curScript = document.currentScript
    if (curScript && curScript.dataset.cat) {
      nekoFile = curScript.dataset.cat
    }
    nekoEl.style.backgroundImage = `url(${nekoFile})`;
    nekoEl.style.backgroundSize = `${SPRITE_SIZE * 8}px ${SPRITE_SIZE * 4}px`;

    document.body.appendChild(nekoEl);

    document.addEventListener("mousemove", function (event) {
      mousePosX = event.clientX;
      mousePosY = event.clientY;
    });

    nekoEl.addEventListener('click', handleClick);

    window.requestAnimationFrame(onAnimationFrame);
  }

  function handleClick(event) {
    if (!isClicked) {
      isClicked = true;
      playDeathAnimation();
    }
    event.stopPropagation();
  }

  function playDeathAnimation() {
    nekoEl.style.backgroundImage = 'url(./final.png)';
    nekoEl.style.backgroundSize = `${SPRITE_SIZE * 15}px ${SPRITE_SIZE}px`; // Assuming 3 frames horizontally

    let frame = 0;
    const deathInterval = setInterval(() => {
      if (frame < 15) { // 3 frames of death animation
        nekoEl.style.backgroundPosition = `-${frame * SPRITE_SIZE}px 0px`;
        frame++;
      } else {
        clearInterval(deathInterval);
        isDeathAnimationComplete = true;
        // Stay on the last frame
        nekoEl.style.backgroundPosition = `-${(frame - 1) * SPRITE_SIZE}px 0px`;
      }
    }, 100); // Change frame every 200ms
  }

  let lastFrameTimestamp;

  function onAnimationFrame(timestamp) {
    if (!nekoEl.isConnected) {
      return;
    }
    if (!lastFrameTimestamp) {
      lastFrameTimestamp = timestamp;
    }
    if (timestamp - lastFrameTimestamp > 100) {
      lastFrameTimestamp = timestamp
      frame()
    }
    window.requestAnimationFrame(onAnimationFrame);
  }

  function setSprite(name, frame) {
    const sprite = spriteSets[name][frame % spriteSets[name].length];
    nekoEl.style.backgroundPosition = `${sprite[0] * SPRITE_SIZE}px ${sprite[1] * SPRITE_SIZE}px`;
  }

  function resetIdleAnimation() {
    idleAnimation = null;
    idleAnimationFrame = 0;
  }

  function idle() {
    idleTime += 1;

    if (
      idleTime > 10 &&
      Math.floor(Math.random() * 200) == 0 &&
      idleAnimation == null
    ) {
      let avalibleIdleAnimations = ["sleeping", "scratchSelf"];
      if (nekoPosX < 32) {
        avalibleIdleAnimations.push("scratchWallW");
      }
      if (nekoPosY < 32) {
        avalibleIdleAnimations.push("scratchWallN");
      }
      if (nekoPosX > window.innerWidth - 32) {
        avalibleIdleAnimations.push("scratchWallE");
      }
      if (nekoPosY > window.innerHeight - 32) {
        avalibleIdleAnimations.push("scratchWallS");
      }
      idleAnimation =
        avalibleIdleAnimations[
        Math.floor(Math.random() * avalibleIdleAnimations.length)
        ];
    }

    switch (idleAnimation) {
      case "sleeping":
        if (idleAnimationFrame < 8) {
          setSprite("tired", 0);
          break;
        }
        setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
        if (idleAnimationFrame > 192) {
          resetIdleAnimation();
        }
        break;
      case "scratchWallN":
      case "scratchWallS":
      case "scratchWallE":
      case "scratchWallW":
      case "scratchSelf":
        setSprite(idleAnimation, idleAnimationFrame);
        if (idleAnimationFrame > 9) {
          resetIdleAnimation();
        }
        break;
      default:
        setSprite("idle", 0);
        return;
    }
    idleAnimationFrame += 1;
  }

  function frame() {
    if (isClicked) {
      if (isDeathAnimationComplete) {
        return; // Stop all movement after death animation is complete
      }
      // During death animation, don't update position but still call requestAnimationFrame
      window.requestAnimationFrame(onAnimationFrame);
      return;
    }

    frameCount += 1;
    const diffX = nekoPosX - mousePosX;
    const diffY = nekoPosY - mousePosY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    if (distance < nekoSpeed || distance < 48 * SPRITE_SCALE) {
      idle();
      return;
    }

    idleAnimation = null;
    idleAnimationFrame = 0;

    if (idleTime > 1) {
      setSprite("alert", 0);
      idleTime = Math.min(idleTime, 7);
      idleTime -= 1;
      return;
    }

    let direction;
    direction = diffY / distance > 0.5 ? "N" : "";
    direction += diffY / distance < -0.5 ? "S" : "";
    direction += diffX / distance > 0.5 ? "W" : "";
    direction += diffX / distance < -0.5 ? "E" : "";
    setSprite(direction, frameCount);

    nekoPosX -= (diffX / distance) * nekoSpeed;
    nekoPosY -= (diffY / distance) * nekoSpeed;

    nekoPosX = Math.min(Math.max(SPRITE_SIZE / 2, nekoPosX), window.innerWidth - SPRITE_SIZE / 2);
    nekoPosY = Math.min(Math.max(SPRITE_SIZE / 2, nekoPosY), window.innerHeight - SPRITE_SIZE / 2);

    nekoEl.style.left = `${nekoPosX - SPRITE_SIZE / 2}px`;
    nekoEl.style.top = `${nekoPosY - SPRITE_SIZE / 2}px`;
  }

  init();
})();