$(() => {
  // 預先讀取所有mp3
  let keybinds = {};
  let sounds = [];
  // let progressCount = 0;

  $('.button').each(function() {
    let { sound, loop, keybind } = this.dataset;
    sound = new Audio(`./sounds/meow2/${sound}.mp3`);
    // sound.addEventListener('loadedmetadata', () => {
    //   let sound = this.sound;
    //   this.innerHTML = `${this.innerHTML} <span style="color: green; font-size: 0.8em">${sound.duration.toFixed(1)}s</span>`;
    // });
    sounds.push(sound);

    sound.loop = typeof loop !== 'undefined';
    sound.volume = 0.5;
    this.sound = sound;

    if (keybind) {
      keybinds[keybind.toLowerCase()] = this;
    }
  });

  $(document).keyup((e) => {
    let key = e.key.toLowerCase();
    let keybind = keybinds[key];

    if (keybind) {
      keybind.click();
    }
  })

  $('.button').click(async function() {
    let loop = this.sound.loop;
    // 如果是loop模式且在播放中，則停止播放
    if (loop && !this.sound.paused) {
      // 移除class，讓按鈕恢復原狀
      this.classList.remove('active');
      this.sound.pause();
      return;
    }

    // 加上class，讓按鈕有按下的感覺
    this.classList.add('active');

    this.sound.currentTime = 0;
    await this.sound.play();

    if(!loop) {
      this.classList.remove('active');
    }
  })

})
