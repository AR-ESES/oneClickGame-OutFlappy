var c;

var sprite_passaro;
var sprite_cano;
var sprite_fundo;
var sprite_chao;
var sprite_titulo;

var sound_point;
var sound_wing;
var sound_hit;
var sound_die;
var sound_sweetwing;

var font_flappy;

//EVENTS
var mousePress = false;
var mousePressEvent = false;
var mouseReleaseEvent = false;
var keyPress = false;
var keyPressEvent = false;
var keyReleaseEvent = false;

var canos = [];

var score = 0;
var hightscore = 0;
var speed = 3;
var gap = 80;

var gameover = false;
var page = "MENU";

var overflowX = 0;

var startgame = false;

var passaro = {
  
  x : 100,
  y : 0,
  
  target : 0,
  
  velocityY : 0,
  
  fly : false,
  
  angle : 0,
  
  falls : false,
  flashAnim : 0,
  flashReturn : false,
  kinematicAnim : 0,
  
  display : function() {
    
    if((!mousePress) || this.falls) {
      push();
        translate(this.x,this.y);
        rotate(radians(this.angle));
        image(sprite_passaro,0,0, sprite_passaro.width*1.5,sprite_passaro.height*3, 0,0 ,sprite_passaro.width/2,sprite_passaro.height*3);
      pop();
    }
    else {
      push();
        translate(this.x,this.y);
        rotate(radians(this.angle));
        image(sprite_passaro,0,0, sprite_passaro.width*1.5,sprite_passaro.height*3, sprite_passaro.width/2,0 ,sprite_passaro.width/2,sprite_passaro.height*3);
      pop();
    }
  },
  
  update : function() {
    if(this.falls) {
      if(this.flashAnim>255) {
        this.flashReturn = true;
      }
      
      if(this.flashReturn) {
        this.flashAnim -=60;
      }
      else {
        this.flashAnim +=60;
      }
      
      if(this.flashReturn && this.flashAnim === 0) {
        gameover = true;
        menu_gameover.easein();
        try { sound_die.play(); } catch(e) {}
        
        if(score > hightscore) { hightscore = score; }
      }
      
      this.y += this.velocityY;
      this.velocityY += 0.4;
      this.angle += 4;
      
      if(speed > 0) {
        speed = 0;
      }
      
      if(this.angle > 90) {
        this.angle = 90;
      }
    }
    else {
      this.y += this.velocityY;
      this.angle += 2.5;
    
      if(this.angle > 90) {
        this.angle = 90;
      }
    
      if(mousePressEvent || (keyPressEvent && key == ' ') ) {
        try { sound_wing.play(); } catch(e) {}
        
        this.velocityY = 0;
        this.fly = true;
        this.target = clamp(this.y - 60,-19,height);
        this.angle = -45;
      }
    
    
      if(this.y < this.target) {
        this.fly = false;
        this.target = 10000;
      }
    
    
      if(!this.fly) {
        this.velocityY+=0.4;
      }
      else {
        this.y -= 5;
      }
      
      if(this.y > height-49) {
        if(!passaro.falls) { try { sound_hit.play(); } catch(e) {} }
        this.falls = true;
      }
    }
    this.y = clamp(this.y,-20,height-50);
  },
  
  kinematicMove : function() {
    if(gameover) {
      this.x = width/2;
      this.y = height/2;
      
      gameover = false;
      score = 0;
      gap = 90;
    }
    

    this.y = height/2 + map( sin(frameCount*0.1),0,1,-2,2 );

    
    push();
      translate(this.x,this.y);
      image(sprite_passaro,0,0, sprite_passaro.width*1.5,sprite_passaro.height*3, 0,0 ,sprite_passaro.width/2,sprite_passaro.height*3);
    pop();
  }
}

function setup() {
  if(mobile()) {
    c = createCanvas(windowWidth,windowHeight);
  }
  else {
    c = createCanvas(400,600);
  }
  
  imageMode(CENTER);
  rectMode(CENTER);
  ellipseMode(CENTER);
  textAlign(CENTER,CENTER);
  
  
  noSmooth();
  
  canos[0] = new Cano();
  
  
  
  //load
  sprite_passaro = loadImage('passaro.png');
  sprite_cano = loadImage('cano.png');
  sprite_fundo = loadImage('fundo.png');
  sprite_chao = loadImage('chao.png');
  sprite_titulo = loadImage('titulo.png');
  
  
  sound_point = loadSound('sfx_point.wav');
  sound_hit = loadSound('sfx_hit.wav');
  sound_die = loadSound('sfx_die.wav');
  sound_wing = loadSound('sfx_wing.wav');
  sound_sweetwing = loadSound('sfx_swooshing.wav');
  
  
  font_flappy = loadFont('flappy-font.ttf');

  
  passaro.y = height/2;
  
  try { textFont(font_flappy); } catch(e) {}
}

function ss(data) {
  console.log(data);
}

function draw() {
  background(123,196,208);
  
  switch(page) {
    case 'GAME':
      page_game();
      break;
    case 'MENU':
      page_menu();
      break;
  }
  
  mousePressEvent = false;
  mouseReleaseEvent = false;
  keyPressEvent = false;
  keyReleaseEvent = false;
}

//EVENT
function mousePressed() {
  mousePress = true;
  mousePressEvent = true;
}
function mouseReleased() {
  mousePress = false;
  mouseReleaseEvent = true;
}
function keyPressed() {
  keyPress = true;
  keyPressEvent = true;
}
function keyReleased() {
  keyPress = false;
  keyReleaseEvent = true;
}

function page_game() {
  
  overflowX += speed;
  if(overflowX > sprite_fundo.width/2) {
    overflowX = 0;
  }
  
  
  image(sprite_fundo, sprite_fundo.width/2/2 ,height-sprite_fundo.height/2/2-40,sprite_fundo.width/2,sprite_fundo.height/2);

  
  //creator
  if(!passaro.falls) {
    if(parseInt(frameCount)%70 === 0) {
      canos.push(new Cano());
    }
  }
  
  for(var i=0; i<canos.length; i++) {
    if(canos[i].x < -50) {
      canos.splice(i,1);
    }
    
    try {
      canos[i].display();
      canos[i].update();
    } catch(e) {}
  }
  
  
  image(sprite_chao,sprite_chao.width-overflowX,height-sprite_chao.height ,sprite_chao.width*2,sprite_chao.height*2);
  image(sprite_chao,sprite_chao.width+sprite_chao.width-overflowX,height-sprite_chao.height ,sprite_chao.width*2,sprite_chao.height*2);
  image(sprite_chao,sprite_chao.width+sprite_chao.width*2-overflowX,height-sprite_chao.height ,sprite_chao.width*2,sprite_chao.height*2);
  
  
  passaro.display();
  passaro.update();
  passaro.x = smoothMove(passaro.x,90,0.02);
  
 
  if(!gameover) {
    push();
      stroke(0);
      strokeWeight(5);
      fill(255);
      textSize(30);
      text(score,width/2,50);
    pop();
  }
  
  push();
    noStroke();
    fill(255,passaro.flashAnim);
    rect(width/2,height/2,width,height);
  pop();
  
  if(gameover) {
    menu_gameover.display();
    menu_gameover.update();
  }
}

function page_menu() {
  speed = 1;
  overflowX += speed;
  if(overflowX > sprite_fundo.width/2) {
    overflowX = 0;
  }
  
  
  image(sprite_fundo, sprite_fundo.width/2/2 ,height-sprite_fundo.height/2/2-40,sprite_fundo.width/2,sprite_fundo.height/2);
  
  
  image(sprite_chao,sprite_chao.width-overflowX,height-sprite_chao.height ,sprite_chao.width*2,sprite_chao.height*2);
  image(sprite_chao,sprite_chao.width+sprite_chao.width-overflowX,height-sprite_chao.height ,sprite_chao.width*2,sprite_chao.height*2);
  image(sprite_chao,sprite_chao.width+sprite_chao.width*2-overflowX,height-sprite_chao.height ,sprite_chao.width*2,sprite_chao.height*2);
  
  image(sprite_titulo,width/2,150,sprite_titulo.width/4,sprite_titulo.height/4);
  
  passaro.kinematicMove();
  
  push();
    fill(132,172,174);
    stroke(47, 68, 76);
    strokeWeight(3);
    text('TOCA PRA JOGAR',width/2,height/2-50);
  pop();

  if(mousePressEvent || (keyPressEvent && key == ' ') ) {
  	page = "GAME";
    resetGame();
  	
  	passaro.velocityY = 0;
    passaro.fly = true;
    passaro.target = clamp(this.y - 60,-19,height);
    passaro.angle = -45;
    passaro.update();
  }
  passaro.x = width/2;
	
}

function Cano() {
  
  this.gapSize = gap;
  this.y = random(150,height-150);
  this.x = width + 50;
  this.potential = true;
  
  this.display = function() {
    push();
      translate(this.x,this.y+this.gapSize+sprite_cano.height/2/2);
      image(sprite_cano, 0,0 ,sprite_cano.width/2,sprite_cano.height/2);
    pop();
    
    push();
      translate(this.x,this.y-this.gapSize-sprite_cano.height/2/2);
      rotate(radians(180));
      scale(-1,1);
      image(sprite_cano,0,0,sprite_cano.width/2,sprite_cano.height/2);
    pop();
    
    
    if(this.potential && (passaro.x > this.x-25 && passaro.x < this.x+25)) {
      score++;
      try { sound_point.play(); } catch(e) {}
      
      if(gap > 60) { gap--; }
      
      
      this.potential = false;
    }
    
    if( ( 
        (passaro.x+20 > this.x-25 && passaro.x-20 < this.x+25) && 
        (passaro.y+20 > (this.y-this.gapSize-sprite_cano.height/2/2)-200 && passaro.y-20 < (this.y-this.gapSize-sprite_cano.height/2/2)+200)
        )
        
        ||
        
        ( 
        (passaro.x+20 > this.x-25 && passaro.x-20 < this.x+25) && 
        (passaro.y+20 > (this.y+this.gapSize+sprite_cano.height/2/2)-200 && passaro.y-20 < (this.y+this.gapSize+sprite_cano.height/2/2)+200)
        )
        
        ) {
      
      if(!passaro.falls) { try { sound_hit.play(); } catch(e) {} }
      passaro.falls = true;
    }
  }
  this.update = function() {
    this.x-= speed;
  }
}

function clamp(value,min,max) {
  
  if(value < min) {
    value = min;
  }
  if(value > max) {
    value = max;
  }
  
  return value;
}

function resetGame() {
  gameover = false;
  gap = 80;
  speed = 3;
  score = 0;
  passaro.y = height/2
  passaro.falls = false;
  passaro.velocityY = 0;
  passaro.angle = 0;
  passaro.flashAnim = 0;
  passaro.flashReturn = false;
  canos = [];
  passaro.target = 10000;
  menu_gameover.ease = 0;
}

var menu_gameover = {
  
  ease : 0,
  easing : false,
  open : false,
  
  display : function() {
    
    push();
      translate(width/2,height/2);
      scale(this.ease);
      
      stroke(47,68,76);
      strokeWeight(3);
      fill(132,172,174);
      rect(0,0,200,200);
      
      noStroke();
      fill(47,68,76);
      text('FIM DO JOGO',0,-50);
      
    
      textSize(20);
      strokeWeight(5);
      stroke(47,68,76);
      fill(255);
      text('OutFlappy',0,-80);
      
    
      push();
        textAlign(LEFT,CENTER);
        textSize(12);
        noStroke();
        fill(47,68,76);
        text('RESULTADO : ',-80,0);
        text('RECORDE : ',-80,30);
        
        stroke(0);
        strokeWeight(3);
        fill(255);
        text(score,20,0);
        text(hightscore,20,30);
      pop();
      
      if(press('TENTAR DE NOVO',0,140,width/2,height/2)) { 
        resetGame();
      }
      
      if(press(' INICIO ',0,190,width/2,height/2)) { page = 'MENU'; }
    pop();
  },
  
  update : function() {
    if(this.easing) {
      this.ease += 0.1;
      if(this.ease > 1) {
        this.open = true;
        this.ease = 1;
        this.easing = false;
      }
    }
  },
  
  easein : function() {
    this.easing = true;
  }
}

function press(txt,x,y,tX,tY) {
  var this_h = false;
  
  if(mouseX > tX+x-textWidth(txt)/2-10 && mouseX < tX+x+textWidth(txt)/2+10 && mouseY > tY+y-textAscent()/2-10 && mouseY < tY+y+textAscent()/2+10) {
    this_h = true;
  }
  
  push();
    textSize(16);
    
    if(this_h && mousePress) {
      noStroke();
      fill(83,56,71);
      rect(x,y+3,textWidth(txt)+25+10,textAscent()+10+10);
      
      fill(47,68,76);
      stroke(255);
      strokeWeight(3);
      rect(x,y+2,textWidth(txt)+25,textAscent()+10);
    
      noStroke();
      fill(255);
      text(txt,x,y+2);
    }
    else {
    noStroke();
    fill(47,68,76);
    rect(x,y+2,textWidth(txt)+25+10,textAscent()+10+12);
    
    if(this_h) {
      fill(67,94,104);
    }
    else {
      fill(47,68,76);
    }
    stroke(255);
    strokeWeight(3);
    rect(x,y,textWidth(txt)+25,textAscent()+10);
    
    noStroke();
    fill(255);
    text(txt,x,y);
    }
  pop();
  
  if(this_h && mouseReleaseEvent) { try { sound_sweetwing.play(); } catch(e) {} }
  
  return (this_h && mouseReleaseEvent);
}

function smoothMove(pos,target,speed) {
	return pos + (target-pos) * speed;
}

function mobile() { 
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ){
    return true;
  }
 else {
    return false;
  }
}


