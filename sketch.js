var flappyBird;
var flappyImg, flappyImgUp;
var ground;
var obstacleUp,obstacleUpImg, obstacleDown,obstacleDownImg;
var groundImg, backgroundImg;
var obstacleUpGroup, obstacleDownGroup;
var message, messageImg;

var gameState = 1;
var Start = 1 , Play = 2, End = 3;

var score = 0;

var gameOver, gameOverImg;

var youLost, bgSound;

function preload(){

  flappyImg = loadImage("sprites/bluebird-downflap.png");
  flappyImgUp = loadImage("sprites/bluebird-upflap.png")

  obstacleUpImg = loadImage("images/obstacle_top.png");
  obstacleDownImg = loadImage("images/obstacle_bottom.png");

  backgroundImg = loadImage("sprites/FlappyBackDrop.png");

  groundImg = loadAnimation("sprites/base.png")

  gameOverImg = loadImage("sprites/gameover.png");
  messageImg = loadImage("sprites/message.png");

  youLost = loadSound("Sounds/flappyLoses.mp3");
  //bgSound = loadSound("Sounds/theme.mp3");
}
 
function setup() {
  createCanvas(600,600);
  
  gameOver = createSprite(300,300,400,400);
  gameOver.addImage("reset", gameOverImg)
  gameOver.visible = false;

  message = createSprite(300,300,400,400);
  message.addImage("start", messageImg);
  message.visible = false;
    
  flappyBird = createSprite(100,300,30,30);
  flappyBird.shapeColor = "blue";
  flappyBird.addImage("flappy",flappyImg);
  flappyBird.addImage("flappyUp", flappyImgUp);
  flappyBird.scale = 1.5;
  flappyBird.setCollider("circle",0,0,10);
 
  ground = createSprite(400,height - 20,1200,10);
  ground.x = ground.width/2;
  ground.shapeColor = "blue";
  ground.addAnimation("base", groundImg);
  
  obstacleUpGroup = createGroup();
  obstacleDownGroup  = createGroup();
}

function draw() {
  background(backgroundImg);
 
  flappyBird.collide(ground);

  if(gameState === Start){

    message.visible = true;

    if(keyDown("s")){
      gameState = Play;
    }

    if(mousePressedOver(message)){
        gameState = Play;
    }
  }

  if(gameState === Play){

    message.visible = false;

    /*if(gameState === Play){
    bgSound.play();
    }*/

    if(keyDown("space") || keyDown("up_arrow")){

        flappyBird.velocityY = -5;
        flappyBird.changeImage("flappyUp");
        //flappyBird.scale = 2.;
    }else{

      flappyBird.velocityY = 5;
      flappyBird.changeImage("flappy");
      //flappyBird.scale = 1.5;
    }

    ground.velocityX = -10;
    if(ground.x < 0){
      ground.x = ground.width/2;
    }

    if(frameCount% 5 === 0){

      score = score+1;
    }

    
   
    obstaclesSummon();

    //console.log(getFrameRate());

    if(flappyBird.isTouching(obstacleDownGroup) || flappyBird.isTouching(obstacleUpGroup)){
      
      //flappyBird.velocityY = 0;
      console.log("bugFix");
      gameState = End;
      youLost.play();
    }
}

if(gameState === End){

  message.visible = false;

  stroke(4);
  text("Score: " + score, 100, 100);

  gameOver.visible = true;
  flappyBird.velocityX = 0;
  flappyBird.velocityY = 0;
  ground.velocityX = 0

  obstacleDownGroup.setVelocityXEach(0);
  obstacleDownGroup.setLifetimeEach(-1);

  obstacleUpGroup.setVelocityXEach(0);
  obstacleUpGroup.setLifetimeEach(-1);

  gameOver.visible = true;

  stroke(4);
  text("Press R to Reset",250, 350);
  
  if(keyDown("r")){
    obstacleDownGroup.destroyEach();
    obstacleUpGroup.destroyEach();
    gameState = Start;
    gameOver.visible = false;
    score = 0;
  }

}

  drawSprites();
  stroke(4);
  text("Score: " + score, 100, 100);
  }

  function obstaclesSummon(){

    if(frameCount % 30 === 0){

      obstacleDown = createSprite(width-10,random(500,450), 50, 20);
      obstacleDown.addImage("pillarBottom", obstacleDownImg);
      obstacleDown.velocityX = -10;
      obstacleDown.lifetime = 300;
      obstacleDown.depth = flappyBird.depth;
      obstacleDown.depth = ground.depth;
      obstacleDown.depth = gameOver.depth;
     // obstacleDown.debug = true;
      obstacleDownGroup.add(obstacleDown);

      obstacleUp = createSprite(width-10,random(-100, height-550), 50, 20);
      obstacleUp.addImage("pillarUp", obstacleUpImg);
      obstacleUp.velocityX = -10;
      obstacleUp.lifetime = 300;
      obstacleUp.depth = flappyBird.depth;
      obstacleUp.depth = ground.depth;
      obstacleUp.depth = gameOver.depth;
     // obstacleUp.debug = true;
      obstacleUpGroup.add(obstacleUp);

      flappyBird.depth = flappyBird.depth+1;
      ground.depth = ground.depth+1;
      gameOver.depth = gameOver.depth+1;
    }
  }