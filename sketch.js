let backgroundImage; // 儲存全螢幕背景圖片。
let character1Idle; // 儲存角色 1 的待機精靈圖。
let character1Run; // 儲存角色 1 的跑步精靈圖。
let character2Idle; // 儲存角色 2 的待機精靈圖。
let character2Jump; // 儲存角色 2 答對時的跳躍精靈圖。
let character2Angry; // 儲存角色 2 答錯時的生氣精靈圖。
let character1X; // 儲存角色 1 的水平位置。
let character1Y; // 儲存角色 1 的垂直位置。
let character1Facing = -1; // 設定角色 1 初始面向左方的方向。
let character2Facing = 1; // 設定角色 2 初始面向右方的方向。
let character1Speed = 4; // 設定角色 1 每一影格的移動速度。
let quizVisible = false; // 記錄選擇題是否正在顯示。
let character2Action = null; // 儲存角色 2 的答題反應，null 代表待機。
let actionStartFrame = 0; // 記錄角色 2 開始答題反應動畫的影格。
let frameDuration = 8; // 設定動畫每隔幾個畫面切換一張影格。
let character1IdleFrames = 5; // 設定角色 1 待機動畫的影格數量。
let character1RunFrames = 6; // 設定角色 1 跑步動畫的影格數量。
let character2IdleFrames = 14; // 設定角色 2 待機動畫的影格數量。
let character2JumpFrames = 13; // 設定角色 2 跳躍動畫的影格數量。
let character2AngryFrames = 9; // 設定角色 2 生氣動畫的影格數量。
let characterScale = 2; // 設定角色圖片相對於原始影格尺寸放大的倍數。
let quizQuestion = ""; // 儲存目前隨機產生的加減法題目。
let quizOptions = []; // 儲存目前題目的四個答案選項。
let correctChoice = -1; // 儲存正確答案在選項陣列中的位置。

function preload() { // 在程式開始前載入背景與所有角色圖片。
  backgroundImage = loadImage("bg/bg1.png"); // 載入全螢幕背景圖片。
  character1Idle = loadImage("1/stop/stop.png"); // 載入角色 1 的待機圖片精靈。
  character1Run = loadImage("1/run/run.png"); // 載入角色 1 的跑步圖片精靈。
  character2Idle = loadImage("2/stop/stop.png"); // 載入角色 2 的待機圖片精靈。
  character2Jump = loadImage("2/jump/jump.png"); // 載入角色 2 答對時使用的跳躍圖片精靈。
  character2Angry = loadImage("2/angry/angry.png"); // 載入角色 2 答錯時使用的生氣圖片精靈。
} // 結束圖片載入函式。

function setup() { // 設定畫布與兩個角色的初始位置。
  createCanvas(windowWidth, windowHeight); // 建立填滿瀏覽器視窗的畫布。
  imageMode(CENTER); // 設定圖片以指定位置為中心繪製。
  character1X = width * 2 / 3; // 將角色 1 初始位置設在畫布寬度的三分之二處。
  character1Y = height * 0.65; // 將角色 1 放在畫布高度的 65% 處。
  frameRate(60); // 將動畫更新速度設定為每秒 60 張畫面。
} // 結束畫布設定函式。

function draw() { // 每一影格更新背景、角色位置、動畫與選擇題。
  drawCoverBackground(); // 繪製填滿畫布且不變形的背景圖片。
  let character2X = width / 3; // 將角色 2 放在畫布寬度的三分之一處。
  let moving = false; // 預設角色 1 目前沒有移動。
  if (!quizVisible && keyIsDown(RIGHT_ARROW)) { // 選擇題關閉且按住右方向鍵時移動角色 1。
    character1X += character1Speed; // 讓角色 1 向右移動。
    character1Facing = 1; // 讓角色 1 面向右方。
    moving = true; // 設定角色 1 播放跑步動畫。
  } // 結束右方向鍵的移動判斷。
  if (!quizVisible && keyIsDown(LEFT_ARROW)) { // 選擇題關閉且按住左方向鍵時移動角色 1。
    character1X -= character1Speed; // 讓角色 1 向左移動。
    character1Facing = -1; // 讓角色 1 面向左方。
    moving = true; // 設定角色 1 播放跑步動畫。
  } // 結束左方向鍵的移動判斷。
  let character1Sprite = moving ? character1Run : character1Idle; // 依角色 1 的移動狀態選擇動畫圖片。
  let character1Frames = moving ? character1RunFrames : character1IdleFrames; // 依角色 1 的移動狀態選擇動畫影格數。
  let character1FrameWidth = character1Sprite.width / character1Frames; // 計算角色 1 每一格精靈圖的寬度。
  let character1FrameHeight = character1Sprite.height; // 取得角色 1 每一格精靈圖的高度。
  let character1DrawWidth = character1FrameWidth * characterScale; // 計算角色 1 放大後的顯示寬度。
  let character1DrawHeight = character1FrameHeight * characterScale; // 計算角色 1 放大後的顯示高度。
  character1X = constrain(character1X, character1DrawWidth / 2, width - character1DrawWidth / 2); // 限制角色 1 不會移出畫布左右邊界。
  let nearDistance = character1Idle.width / character1IdleFrames * characterScale / 2 + character2Idle.width / character2IdleFrames * characterScale / 2 + 40; // 計算角色 1 接近角色 2 時觸發互動的距離。
  let nearby = abs(character1X - character2X) <= nearDistance; // 判斷角色 1 是否已經接近角色 2。
  if (!nearby) { // 角色 1 離開互動範圍時重設角色 2 的狀態。
    quizVisible = false; // 關閉尚未回答的選擇題。
    character2Action = null; // 讓角色 2 回到待機動畫。
  } else if (character2Action === null && !quizVisible) { // 角色 1 剛進入互動範圍且角色 2 尚無答題反應時產生新題目。
    generateQuizQuestion(); // 隨機產生一道加減法題目與四個選項。
    quizVisible = true; // 開啟選擇題視窗。
  } // 結束角色接近狀態判斷。
  character2Facing = character1X >= character2X ? 1 : -1; // 讓角色 2 面向角色 1。
  drawCharacter(character1Sprite, character1FrameWidth, character1FrameHeight, character1Frames, character1X, character1Y, character1Facing, character1DrawWidth, character1DrawHeight, frameCount); // 繪製角色 1 目前的動畫影格。
  drawCharacter2(character2X); // 依角色 2 的狀態繪製待機、跳躍或生氣動畫。
  drawAnswerFeedback(character2X); // 在角色 2 頭上顯示目前的答題結果標記。
  if (quizVisible) { // 選擇題開啟時繪製題目視窗。
    drawQuizPanel(); // 顯示題目與可點選的選項。
  } // 結束選擇題繪製判斷。
} // 結束每一影格的繪製函式。

function drawCharacter(sprite, frameWidth, frameHeight, totalFrames, x, y, direction, drawWidth, drawHeight, animationFrame) { // 繪製指定精靈圖的單一動畫影格。
  let currentFrame = floor(animationFrame / frameDuration) % totalFrames; // 計算目前要顯示的循環動畫影格。
  push(); // 暫存畫布的繪圖狀態。
  translate(x, y); // 將繪圖原點移至角色目前的位置。
  scale(direction, 1); // 依照角色朝向水平翻轉圖片。
  image(sprite, 0, 0, drawWidth, drawHeight, currentFrame * frameWidth, 0, frameWidth, frameHeight); // 繪製角色精靈圖的目前影格。
  pop(); // 還原畫布的繪圖狀態。
} // 結束單一角色影格繪製函式。

function drawCharacter2(x) { // 依角色 2 的答題結果繪製對應的循環動畫。
  let sprite = character2Idle; // 預設角色 2 使用待機精靈圖。
  let totalFrames = character2IdleFrames; // 預設角色 2 使用待機動畫影格數。
  let animationFrame = frameCount; // 預設待機動畫從目前的畫面影格計算。
  if (character2Action === "jump") { // 答對時選擇角色 2 的跳躍動畫。
    sprite = character2Jump; // 使用角色 2 的跳躍精靈圖。
    totalFrames = character2JumpFrames; // 使用跳躍動畫的影格數。
    animationFrame = frameCount - actionStartFrame; // 從開始答對的影格起算跳躍動畫。
  } // 結束答對動畫判斷。
  if (character2Action === "angry") { // 答錯時選擇角色 2 的生氣動畫。
    sprite = character2Angry; // 使用角色 2 的生氣精靈圖。
    totalFrames = character2AngryFrames; // 使用生氣動畫的影格數。
    animationFrame = frameCount - actionStartFrame; // 從開始答錯的影格起算生氣動畫。
  } // 結束答錯動畫判斷。
  let frameWidth = sprite.width / totalFrames; // 計算角色 2 每一格精靈圖的寬度。
  let frameHeight = sprite.height; // 取得角色 2 每一格精靈圖的高度。
  drawCharacter(sprite, frameWidth, frameHeight, totalFrames, x, character1Y, character2Facing, frameWidth * characterScale, frameHeight * characterScale, animationFrame); // 以角色 1 的垂直位置繪製角色 2 的動畫。
} // 結束角色 2 動畫繪製函式。

function drawAnswerFeedback(x) { // 在角色 2 頭上繪製綠色通過標記或紅色答錯叉號。
  if (character2Action === null) { // 尚未作答或角色 1 已離開時不顯示結果標記。
    return; // 結束沒有答題結果時的繪製處理。
  } // 結束答題結果狀態檢查。
  let feedbackX = x; // 將答題結果標記水平置中於角色 2 頭上。
  let feedbackY = character1Y - character2Idle.height * characterScale / 2 - 32; // 將答題結果標記放在角色 2 頭部上方。
  push(); // 暫存畫布的繪圖狀態。
  if (character2Action === "jump") { // 答對時繪製綠色圓形通過標記。
    fill(35, 185, 75); // 設定通過標記為綠色。
    stroke(255); // 設定通過標記的白色外框。
    strokeWeight(3); // 設定通過標記的外框寬度。
    ellipse(feedbackX, feedbackY, 46, 46); // 在角色 1 頭上繪製綠色圓圈。
    noFill(); // 設定勾號只繪製外框線條。
    stroke(255); // 設定圓圈內的勾號為白色。
    strokeWeight(5); // 設定勾號線條寬度。
    line(feedbackX - 11, feedbackY, feedbackX - 3, feedbackY + 8); // 繪製勾號左側短線。
    line(feedbackX - 3, feedbackY + 8, feedbackX + 13, feedbackY - 10); // 繪製勾號右側長線。
  } else { // 答錯時繪製紅色叉號。
    stroke(255); // 先繪製白色外框以便叉號在背景上清楚顯示。
    strokeWeight(10); // 設定白色外框線條寬度。
    line(feedbackX - 13, feedbackY - 13, feedbackX + 13, feedbackY + 13); // 繪製叉號第一條白色外框線。
    line(feedbackX + 13, feedbackY - 13, feedbackX - 13, feedbackY + 13); // 繪製叉號第二條白色外框線。
    stroke(220, 35, 45); // 設定叉號本身為紅色。
    strokeWeight(6); // 設定紅色叉號線條寬度。
    line(feedbackX - 13, feedbackY - 13, feedbackX + 13, feedbackY + 13); // 繪製紅色叉號第一條斜線。
    line(feedbackX + 13, feedbackY - 13, feedbackX - 13, feedbackY + 13); // 繪製紅色叉號第二條斜線。
  } // 結束答題結果標記判斷。
  pop(); // 還原畫布的繪圖狀態。
} // 結束答題結果標記繪製函式。

function drawQuizPanel() { // 繪製半透明黃色的選擇題面板與選項按鈕。
  let layout = getQuizLayout(); // 取得選擇題視窗與選項按鈕的位置尺寸。
  rectMode(CORNER); // 設定矩形以左上角座標繪製。
  stroke(90, 70, 0); // 設定選擇題面板的深色外框。
  strokeWeight(2); // 設定選擇題面板外框寬度。
  fill(255, 230, 0, 204); // 設定黃色背景並使用約 80% 不透明度。
  rect(layout.x, layout.y, layout.width, layout.height, 12); // 在畫布中央繪製四分之一大小的圓角題目面板。
  noStroke(); // 關閉文字與選項按鈕的外框。
  fill(20); // 設定題目與選項文字為深色。
  textAlign(CENTER, CENTER); // 設定題目與答案文字置中對齊。
  textSize(constrain(layout.width * 0.055, 12, 24)); // 依視窗寬度調整題目字體大小。
  text("選擇題：" + quizQuestion, width / 2, layout.y + layout.height * 0.28); // 顯示隨機產生的加減法題目。
  for (let choice = 0; choice < quizOptions.length; choice++) { // 逐一繪製四個答案按鈕。
    let buttonX = layout.firstButtonX + choice * (layout.buttonWidth + layout.gap); // 計算目前答案按鈕的水平位置。
    fill(255, 255, 255, 225); // 設定答案按鈕的淺色背景。
    rect(buttonX, layout.buttonY, layout.buttonWidth, layout.buttonHeight, 6); // 繪製目前答案的圓角按鈕。
    fill(20); // 設定答案選項文字為深色。
    textSize(constrain(layout.width * 0.045, 11, 20)); // 依視窗寬度調整答案字體大小。
    text((choice + 1) + ". " + quizOptions[choice], buttonX + layout.buttonWidth / 2, layout.buttonY + layout.buttonHeight / 2); // 以數字加句點的格式顯示答案選項。
  } // 結束答案按鈕繪製迴圈。
  fill(40); // 設定作答提示文字為深色。
  textSize(constrain(layout.width * 0.032, 10, 14)); // 依視窗寬度調整作答提示字體大小。
  text("按 1、2、3、4 或點擊答案", width / 2, layout.y + layout.height * 0.9); // 提示學生可用鍵盤或滑鼠選擇答案。
} // 結束選擇題面板繪製函式。

function generateQuizQuestion() { // 隨機產生簡單加減法題目與四個答案選項。
  let firstNumber = floor(random(1, 11)); // 隨機產生第一個 1 到 10 的整數。
  let secondNumber = floor(random(1, 11)); // 隨機產生第二個 1 到 10 的整數。
  let operator = random() < 0.5 ? "+" : "−"; // 隨機選擇加法或減法運算。
  if (operator === "−" && firstNumber < secondNumber) { // 減法題若第一個數較小就交換數字。
    let temporaryNumber = firstNumber; // 暫存第一個數字以便交換。
    firstNumber = secondNumber; // 將較大的數字放到減號前方。
    secondNumber = temporaryNumber; // 將原本較小的數字放到減號後方。
  } // 結束減法數字順序調整。
  let correctAnswer = operator === "+" ? firstNumber + secondNumber : firstNumber - secondNumber; // 計算這道題目的正確答案。
  quizQuestion = firstNumber + " " + operator + " " + secondNumber + " = ？"; // 組合目前要顯示的加減法題目。
  let possibleDistractors = []; // 建立可供挑選的錯誤答案清單。
  for (let option = max(0, correctAnswer - 5); option <= correctAnswer + 5; option++) { // 建立正確答案附近的不重複整數選項。
    if (option !== correctAnswer) { // 排除正確答案以避免重複。
      possibleDistractors.push(option); // 將此錯誤答案加入候選清單。
    } // 結束正確答案排除判斷。
  } // 結束錯誤答案候選清單建立。
  quizOptions = shuffle(possibleDistractors).slice(0, 3); // 隨機挑選三個不同的錯誤答案。
  quizOptions.push(correctAnswer); // 將正確答案加入四個選項。
  quizOptions = shuffle(quizOptions); // 隨機排列四個答案選項。
  correctChoice = quizOptions.indexOf(correctAnswer); // 記錄正確答案隨機排列後的位置。
} // 結束題目產生函式。

function getQuizLayout() { // 計算題目面板與答案按鈕的響應式位置尺寸。
  let panelWidth = width / 4; // 設定題目面板寬度為視窗寬度的四分之一。
  let panelHeight = height / 4; // 設定題目面板高度為視窗高度的四分之一。
  let panelX = (width - panelWidth) / 2; // 計算畫面中央面板的左側座標。
  let panelY = height * 0.05; // 將題目面板放在畫布上方 5% 處，避免遮住下方角色。
  let buttonWidth = panelWidth * 0.19; // 設定四個答案按鈕的個別寬度。
  let gap = panelWidth * 0.03; // 設定四個答案按鈕之間的間距。
  let firstButtonX = width / 2 - (buttonWidth * 4 + gap * 3) / 2; // 計算第一個答案按鈕的水平座標。
  let buttonY = panelY + panelHeight * 0.48; // 計算答案按鈕的垂直座標。
  let buttonHeight = panelHeight * 0.3; // 設定答案按鈕高度。
  return { x: panelX, y: panelY, width: panelWidth, height: panelHeight, buttonWidth: buttonWidth, buttonHeight: buttonHeight, gap: gap, firstButtonX: firstButtonX, buttonY: buttonY }; // 回傳繪製面板與答案按鈕所需的位置尺寸。
} // 結束題目面板版面計算函式。

function submitAnswer(choice) { // 根據學生選取的選項設定題目結果。
  if (!quizVisible) { // 選擇題沒有顯示時不接受作答。
    return; // 結束這次沒有有效題目的作答處理。
  } // 結束題目顯示狀態檢查。
  character2Action = choice === correctChoice ? "jump" : "angry"; // 答對播放跳躍動畫，答錯播放生氣動畫。
  actionStartFrame = frameCount; // 記錄角色 2 答題反應動畫的起始影格。
  quizVisible = false; // 作答後立即關閉題目面板。
} // 結束作答處理函式。

function keyPressed() { // 讓學生可使用數字鍵 1、2、3、4 回答選擇題。
  if (key === "1") { // 檢查學生是否按下數字鍵 1。
    submitAnswer(0); // 提交第一個答案選項。
  } // 結束數字鍵 1 判斷。
  if (key === "2") { // 檢查學生是否按下數字鍵 2。
    submitAnswer(1); // 提交第二個答案選項。
  } // 結束數字鍵 2 判斷。
  if (key === "3") { // 檢查學生是否按下數字鍵 3。
    submitAnswer(2); // 提交第三個答案選項。
  } // 結束數字鍵 3 判斷。
  if (key === "4") { // 檢查學生是否按下數字鍵 4。
    submitAnswer(3); // 提交第四個答案選項。
  } // 結束數字鍵 4 判斷。
} // 結束鍵盤作答函式。

function mousePressed() { // 讓學生可用滑鼠點擊答案按鈕作答。
  if (!quizVisible) { // 選擇題沒有顯示時忽略滑鼠點擊。
    return; // 結束這次沒有題目的點擊處理。
  } // 結束題目顯示狀態檢查。
  let layout = getQuizLayout(); // 取得目前答案按鈕的位置尺寸。
  for (let choice = 0; choice < quizOptions.length; choice++) { // 逐一檢查滑鼠是否點中任一答案按鈕。
    let buttonX = layout.firstButtonX + choice * (layout.buttonWidth + layout.gap); // 計算目前答案按鈕的水平位置。
    let insideButton = mouseX >= buttonX && mouseX <= buttonX + layout.buttonWidth && mouseY >= layout.buttonY && mouseY <= layout.buttonY + layout.buttonHeight; // 判斷滑鼠座標是否在目前答案按鈕內。
    if (insideButton) { // 滑鼠點中答案按鈕時提交作答。
      submitAnswer(choice); // 提交目前點選的答案。
      return; // 作答後結束按鈕檢查。
    } // 結束目前答案按鈕的點擊判斷。
  } // 結束答案按鈕點擊檢查迴圈。
} // 結束滑鼠作答函式。

function drawCoverBackground() { // 以等比例裁切方式讓背景填滿畫布。
  let scaleFactor = max(width / backgroundImage.width, height / backgroundImage.height); // 計算填滿畫布所需的等比例縮放倍率。
  let sourceWidth = width / scaleFactor; // 計算背景圖片需要裁切的來源寬度。
  let sourceHeight = height / scaleFactor; // 計算背景圖片需要裁切的來源高度。
  let sourceX = (backgroundImage.width - sourceWidth) / 2; // 計算背景圖片中央裁切區域的水平起點。
  let sourceY = (backgroundImage.height - sourceHeight) / 2; // 計算背景圖片中央裁切區域的垂直起點。
  imageMode(CORNER); // 設定背景圖片從畫布左上角開始繪製。
  image(backgroundImage, 0, 0, width, height, sourceX, sourceY, sourceWidth, sourceHeight); // 裁切並繪製填滿畫布的背景。
  imageMode(CENTER); // 設定角色圖片以中心點繪製。
} // 結束背景繪製函式。

function windowResized() { // 瀏覽器視窗尺寸改變時重新調整畫布。
  resizeCanvas(windowWidth, windowHeight); // 讓畫布持續填滿瀏覽器視窗。
  character1X = constrain(character1X, 0, width); // 將角色 1 的水平位置限制在新的畫布範圍內。
  character1Y = constrain(character1Y, 0, height); // 將兩個角色的垂直位置限制在新的畫布範圍內。
} // 結束視窗尺寸調整函式。
