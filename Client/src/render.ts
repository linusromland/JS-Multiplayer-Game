let playerX = 0;
let playerY = 0;

let windowWidth = 0;
let windowHeight = 0;

let areaW = 0;
let areaH = 0;

let xMult = 0;
let yMult = 0;


function onWindowResize () {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
};

//Render canvas from JSON from server
function render(message: string) {
  //Parse message into JSON
  let jsonMessage = JSON.parse(message);

  //Get canvas from HTML
  var c = <HTMLCanvasElement>document.getElementById("mainCanvas");

  //Get sizes from JSON
  c.width = windowWidth;
  c.height = windowHeight;
  let pWidth = jsonMessage.info.playerW;
  let pHeight = jsonMessage.info.playerH;

  xMult = window.innerWidth / jsonMessage.info.areaW;
  yMult = window.innerHeight / jsonMessage.info.areaH;

  //Draw if canvas exists
  var ctx = c.getContext("2d");
  if (ctx) {
    //Disable antialiasing on images
    ctx.imageSmoothingEnabled = false;

    //Clear canvas
    ctx.clearRect(0, 0, c.width, c.height);

    //Draw game or lobby depending on game state
    if (jsonMessage.info.inGame) {
      ctx.font = "30px Arial";
      ctx.textAlign = "center";

      //Draw timer
      ctx.fillText(
        (jsonMessage.info.time / 1000).toFixed().toString(),
        c.width / 2,
        30
      );

      //Loop through list of players and draw everyone
      for (let i = 0; i < jsonMessage.players.length; i++) {
        let player = jsonMessage.players[i];

        if (!player.dead) {
          let name = player.name;

          if (name == username && !spectator) {
            playerX = player.x;
            playerY = player.y;

            //Draw stamina bar
            drawRect(ctx, 10, 10, 150, 25, false, "black");
            drawRect(
              ctx,
              10,
              10,
              150 * (player.stamina / 100),
              25,
              true,
              "green"
            );
          }

          drawPlayer(
            ctx,
            player,
            player.x * xMult,
            player.y * yMult,
            pWidth * xMult,
            pHeight * yMult,
            "res/guy.png",
            true,
            true
          );

          //Limit name to 15 characters
          if (name.length > 15) name = name.substr(0, 15);
        } else {
          drawPlayer(
            ctx,
            player,
            player.x,
            player.y,
            pHeight,
            pWidth,
            "res/deadGuy.png",
            false,
            false
          );
        }
      }

      for (let i = 0; i < jsonMessage.bullets.length; i++) {
        let bullet = jsonMessage.bullets[i];

        const image = new Image();
        image.src = "res/bullet.gif";

        ctx.save();
        ctx.translate(bullet.x * xMult, bullet.y * yMult);
        ctx.translate(
          (jsonMessage.info.bulletW * xMult) / 2,
          (jsonMessage.info.bulletH * yMult) / 2
        );
        ctx.rotate(bullet.angle);
        ctx.translate(
          (-jsonMessage.info.bulletW * xMult) / 2,
          (-jsonMessage.info.bulletH * yMult) / 2
        );
        ctx.drawImage(
          image,
          0,
          0,
          jsonMessage.info.bulletW * xMult,
          jsonMessage.info.bulletH * yMult
        );
        ctx.restore();
      }
    } else {
      //In lobby
      ctx.font = "30px Arial";
      ctx.textAlign = "left";

      //Draw timer
      ctx.fillText("Winner: " + jsonMessage.info.winner, 30, 60);
      //Loop through list of players and draw everyone
      for (let i = 0; i < jsonMessage.players.length; i++) {
        let player = jsonMessage.players[i];
        drawPlayer(
          ctx,
          player,
          i * (pWidth + 50) + 50,
          200,
          pWidth,
          pHeight,
          "res/guy.png",
          true,
          false
        );
      }
    }
  }
}

//Draw player
function drawPlayer(
  ctx: CanvasRenderingContext2D,
  player: any,
  x: number,
  y: number,
  width: number,
  height: number,
  src: string,
  drawName: boolean,
  drawHealth: boolean
) {
  //Draw name
  if (drawName) {
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(player.name, x + width / 2, y - 10);
  }

  //Draw health bar
  if (drawHealth) {
    drawRect(ctx, x, y - 6, width, 4, false, "black");
    drawRect(ctx, x, y - 6, width * (player.health / 100), 4, true, "red");
  }

  //Draw player as image
  const image = new Image();
  image.src = src;
  ctx.drawImage(image, x, y, width, height);
}

//Draw rectangle
function drawRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  filled: boolean,
  color: string
) {
  let defaultColor = "black";

  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  if (filled) ctx.fill();
  else ctx.stroke();

  ctx.strokeStyle = defaultColor;
  ctx.fillStyle = defaultColor;
}
