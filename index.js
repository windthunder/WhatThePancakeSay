function renewList(record) {
  $('#records').html('');

  Object.keys(record).forEach((name) => {
    $('#records').append(`
      <div data-name="${name}" class="record">
        ${name}
        <span class="control play">撥放 <i class="fa-solid fa-play"></i></span>
        <span class="control export">匯出 <i class="fa-solid fa-file-export"></i></span>
      </div>
    `);
  });
}

$(() => {
  // 預先讀取所有mp3
  let keybinds = {};
  let sounds = [];
  // let progressCount = 0;

  $('.button').each(function() {
    let { sound, loop, keybind } = this.dataset;
    sound = new Audio(`./sounds/meow2/${sound}.mp3`);
    // 顯示音效長度
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

  $(document).keydown((e) => {
    let key = e.key.toLowerCase();
    let keybind = keybinds[key];

    if (keybind) {
      keybind.click();
    }
  })

  $('.button').click(function() {
    let loop = this.sound.loop;
    let keybind = this.dataset.keybind;
    keybind = keybind.toLowerCase();
    // 如果是loop模式且在播放中，則停止播放
    if (loop && !this.sound.paused) {
      // 移除class，讓按鈕恢復原狀
      this.classList.remove('active');
      this.sound.pause();
      return;
    }

    if(recording) {
      record.push({
        keybind,
        time: Date.now() - recordingStart
      });
    }

    // 加上class，讓按鈕有按下的感覺
    this.classList.add('active');

    setTimeout(() => {
      this.classList.remove('active');
    }, 50);

    this.sound.currentTime = 0;
    this.sound.play();
  });

  let records = {};
  let record = [];
  let recording = false;
  let recordingStart;
  // 錄製等相關功能
  // 錄製的是操作 按下錄製按鈕從 從第一次按下按鈕開始記錄
  $('#record').click(function() {
    if(recording) {
      this.classList.remove('active');
      // 詢問名稱
      let name = prompt('請輸入名稱');
      if(!name) {
        // 清空record
        record = [];
        return;
      }

      // 將record的時間全部減掉第一個時間
      let firstTime = record[0].time;
      record.forEach((data) => {
        data.time -= firstTime;
      });

      records[name] = record;

      // 清空record
      record = [];

      // 更新列表
      renewList(records);

      recording = false;
    } else {
      this.classList.add('active');
      recording = true;
      recordingStart = Date.now();
    }
  });

  // 撥放
  // .play會被更新洗掉 所以要用on
  $('#records').on('click', '.play', function() {
    console.log('play');
    let name = $(this).parent().data('name');
    let record = records[name];
    console.log(record);

    // 播放
    record.forEach((data) => {
      setTimeout(() => {
        keybinds[data.keybind].click();
      }, data.time);
    });
  });

  // 匯出
  // 匯出格式簡單一點 name|keybind:time|keybind:time|keybind:time
  $('#records').on('click', '.export', function() {
    let name = $(this).parent().data('name');
    let record = records[name];

    let text = name;
    record.forEach((data) => {
      text += `|${data.keybind}:${data.time}`;
    });

    // 複製到剪貼簿
    navigator.clipboard.writeText(text);
    alert('已複製到剪貼簿');
  });

  // 匯入
  $('#import').click(async function() {
    let text = prompt('請輸入匯入的內容');
    let [name, ...record] = text.split('|');
    record = record.map((data) => {
      let [keybind, time] = data.split(':');
      return { keybind, time: parseInt(time) };
    });

    records[name] = record;

    // 更新列表
    renewList(records);
  });

})
