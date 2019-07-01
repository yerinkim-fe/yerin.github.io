const $step1 = document.querySelector('.step1');
const $len = document.querySelector('.len');
const $start = document.querySelector('.start');
const $step2 = document.querySelector('.step2');
const $user = document.querySelector('.step2 .user');
const $case = document.querySelector('.step2 .case');
const $reset = document.querySelector('.step2 .reset');
const $next = document.querySelector('.step2 .next');
const $result = document.querySelector('.step2 .result');
const $winner = document.querySelector('.step2 .winner');
const $winCont = $winner.querySelector('.cont');
const $ladder = document.getElementById('ladder');
const ctx = $ladder.getContext('2d');
const ctxResult = document.getElementById('ladder-result').getContext('2d');
const ctxWidth = $ladder.offsetWidth;
const ctxHeight = $ladder.offsetHeight;
const space = 100;
const times = 5;
const baseColor1 = '#bdbdbf';
const baseColor2 = '#566270';
let arrX = [];
let arrY = [];
let count = 2;
let startX;
let startY;
let endX;
let endY;
let isVertical = true;
let win = [];
let a;
let userIdx;
let isLoop = false;

// user 카운트 설정
$step1.addEventListener('click', ev => {
  if (ev.target.classList.contains('minus')) {
    if (Number($len.textContent) > 2) {
      $len.textContent = Number($len.textContent) - 1;
    } else {
      alert('최소 2명 이상입니다.')
    }
  } else if (ev.target.classList.contains('plus')) {
    if (Number($len.textContent) < 10) {
      $len.textContent = Number($len.textContent) + 1;
    } else {
      alert('최대 10명 이하입니다.')
    }
  }

  count = Number($len.textContent);
});

// 시작
$start.addEventListener('click', ev => {
  // step2 화면전환
  $step1.classList.add('hide');
  $reset.classList.remove('hide');
  $next.classList.remove('hide');
  
  let startX = (ctxWidth - (count - 1) * space) / 2;

  // user&case 생성, 사다리 세로라인
  for (let i = 0; i < count; i++) {
    const $input1 = document.createElement('input');
    $input1.setAttribute('type', 'text');

    const $input2 = document.createElement('input');
    $input1.setAttribute('type', 'text');

    $user.appendChild($input1);
    $case.appendChild($input2);
  
    ctx.beginPath();
    ctx.moveTo(startX + (i * space), 0);
    ctx.lineTo(startX + (i * space), ctxHeight);
    ctx.strokeStyle = baseColor1;
    ctx.stroke();
    ctx.closePath();

    // arrX x값 저장
    arrX.push(startX + (i * space));

    $user.firstElementChild.focus();
  }
});

// 사다리 결과 라인
function draw (i, j, dir = 'start', stroke = false) {
  if (j === 0) {
    userIdx = i;
  }

  if (isVertical) { // 세로라인
    startX = arrX[i];
    endX = arrX[i];

    if (i === 0) { // 처음 라인은 start포인트만 있음
      dir = 'start';
      startY = arrY[i][dir][j];
      j++;
    } else if (i === count - 1) { // 마지막 라인은 end포인트만 있음
      dir = 'end';
      startY = arrY[i][dir][j];
      j++;
    } else { // 가운데 라인일 경우 endY의 방향(dir) 설정
      startY = arrY[i][dir][j];

      // 현재 j의 Y가 max일 경우 j를 증가시켜 다음 인덱스에서 방향 및 j 설정
      if (dir === 'end') {
        if (startY >= arrY[i].start[j]) {
          j++;
          dir = (arrY[i].start[j] < arrY[i].end[j]) ? 'start' : 'end';
        } else {
          dir = 'start';
        }
      } else {
        if (startY >= arrY[i].end[j]) {
          j++;
          dir = (arrY[i].start[j] < arrY[i].end[j]) ? 'start' : 'end';
        } else {
          dir = 'end';
        }
      }
    }

    endY = (j === times + 1) ? ctxHeight : arrY[i][dir][j];

  } else { // 가로라인
    startX = arrX[i];
    startY = arrY[i][dir][j];

    if (dir === 'start') {
      i++;
      endX = arrX[i];
      endY = arrY[i].end[j];
      dir = 'end';
    } else {
      i--;
      endX = arrX[i];
      endY = arrY[i].start[j];
      dir = 'start';
    }
  }

  if (stroke) {
    ctxResult.beginPath();
    ctxResult.moveTo(startX, startY);
    ctxResult.lineTo(endX, endY);
    ctxResult.strokeStyle = baseColor2;
    ctxResult.stroke();
    ctxResult.closePath();
  }

  isVertical = !isVertical;

  if (j < times + 1) {
    if (stroke) {
      requestAnimationFrame(function () {
        draw(i, j, dir, true);
      });
      
    } else {
      draw(i, j, dir, false);
    }
  } else {
    if (stroke) {
      $case.children[i].classList.add('active');
    }
    win[userIdx] = i;
    return;
  }
}

// 캔버스 초기화
function ctxReset () {
  startX = 0;
  startY = 0;
  endX = 0;
  endY = 0;
  isVertical = true;

  ctxResult.clearRect(0, 0, ctxWidth, ctxHeight);

  $user.childNodes.forEach($el => {
    $el.classList.remove('active');
  });

  $case.childNodes.forEach($el => {
    $el.classList.remove('active');
  });
}

// input 검증
function validation () {
  const $inp = $step2.querySelectorAll('input');
  for (let i = 0; i < $inp.length; i++) {
    if ($inp[i].value === '') {
      alert('빈칸을 입력하세요.');
      $inp[i].focus();
      return false;
    }
  }

  return true;
}

// 사다리타기 시작
$next.addEventListener('click', function () {

  if (validation()) {

    let prevRandom;

    // 사다리 y값 랜덤 생성
    function getRandom (gap) {
      let min = (ctxHeight / times) * gap + 10;
      let max = (ctxHeight / times) * (gap + 1) - 10;

      let random = Math.floor(Math.random() * (max - min)) + min;

      if (!random || random === prevRandom) {
        // if (!random) {
        //   console.log(gap);
        //   debugger;
        // }
        getRandom(gap);
      } else {
        prevRandom = random;
        return random;
      }
    }
    
    // arrY 초기화
    for (let i = 0; i < count; i++) {
      arrY[i] = {
        'start': [0],
        'end': [0]
      }
    }

    // 사다리 가로라인
    for (let i = 0; i < times; i++) {
      for (let j = 0; j < count - 1; j++) {
        let startY = getRandom(i);
        let endY = getRandom(i);

        arrY[j].start.push(startY);
        arrY[j + 1].end.push(endY);

        ctx.beginPath();
        ctx.moveTo(arrX[j], startY);
        ctx.lineTo(arrX[j + 1], endY);
        ctx.strokeStyle = baseColor1;
        ctx.stroke();
        ctx.closePath();
      }
    }

    // user의 input 설정 및 이벤트핸들러 등록
    $user.querySelectorAll('input').forEach(function ($el, index) {
      $el.classList.add('clickable');
      $el.setAttribute('readonly', 'true');

      $el.addEventListener('click', ev => {
        ctxReset();

        $el.classList.add('active');
        
        // 선택한 인덱스로 draw호출
        requestAnimationFrame(function () {
          draw(index, 0, 'start', true);
        });
      });
    });

    // case input 설정
    $case.querySelectorAll('input').forEach($el => {
      $el.classList.add('readonly');
      $el.setAttribute('readonly', 'true');
    });

    $next.classList.add('hide');
    $result.classList.remove('hide');
  }
});

// 전체 결과보기
$result.addEventListener('click', ev => {
  $winner.classList.remove('hide');

  $winner.addEventListener('click', ev => {
    if (ev.target.className === 'winner') {
      $winner.classList.add('hide');
    }
  });

  if (!isLoop) {
    for (let i = 0; i < count; i++) {
      isLoop = true;
      ctxReset();
      draw(i, 0);

      const $p = document.createElement('p');
      const $winText = document.createTextNode(`${$user.children[i].value} → ${$case.children[win[i]].value}`);

      $p.appendChild($winText);
      $winCont.appendChild($p);
    }
  }
  
});

// step2 초기화
$reset.addEventListener('click', ev => {
  $user.querySelectorAll('input').forEach($el => {
    $el.remove();
    ctxReset();
  });

  $case.querySelectorAll('input').forEach($el => {
    $el.remove();
  });
  
  ctx.clearRect(0, 0, ctxWidth, ctxHeight);
  ctxResult.clearRect(0, 0, ctxWidth, ctxHeight);
  arrX = [];
  arrY = [];

  isLoop = false;

  while ($winCont.firstElementChild) {
    $winCont.removeChild($winCont.firstElementChild);
  }

  $step1.classList.remove('hide');
  $reset.classList.add('hide');
  $next.classList.add('hide');
  $result.classList.add('hide');
});
