import Sketch from "react-p5";

export const HeroSketch = () => {
  // Community Statement on “NFT art” Logo
  /*
   * creator : Takawo Shunsuke (@takawo)
   * web : https://nft-art-statement.github.io/
   * License : CreativeCommons Attribution NonCommercial ShareAlike https://creativecommons.org/licenses/by-nc-sa/3.0/
   * release : 2022/02/20
   */

  let str = "Community Statement on “NFT art”".replace(/ /g, "");
  let _str = str;
  let font;
  let colors;
  let _p5;

  function preload(p5) {
    font = p5.loadFont("Montserrat-SemiBoldItalic.ttf");
  }

  function setup(p5, canvasParentRef) {
    _p5 = p5
    p5.createCanvas(800, 800).parent(canvasParentRef);
    p5.colorMode(p5.HSB, 360, 100, 100, 100);
    p5.angleMode(p5.DEGREES);
    p5.pixelDensity(2);

    colors = [p5.color(0, 0, 100), p5.color(0, 0, 90), p5.color(0, 0, 0)];
    p5.randomSeed(20220220);
  }

  function draw(p5) {
    p5.clear();

    let offset = p5.width / 6;
    let margin = 0;

    drawFrame(
      p5,
      offset / 2 - 1,
      offset / 2 - 1,
      p5.width - offset + 2,
      p5.height - offset + 2,
      offset / 2
    );

    p5.fill(colors[1]);
    p5.rect(offset, offset, p5.width - offset * 2, p5.height - offset * 2);

    let kMax = 5;
    let cellsMin = p5.ceil(p5.sqrt(str.length));
    let cellsMax = cellsMin * 1.5;
    let cells = p5.round(p5.random(cellsMin, cellsMax));

    let d = (p5.width - offset * 2 - margin * (cells - 1)) / cells;
    for (let k = 0; k < kMax; k++) {
      let arr = [];
      for (let i = 0; i < cells * cells; i++) {
        arr.push(p5.random());
      }
      let selected_arr = arr.concat();
      selected_arr.sort(function(a, b) {
        return b - a;
      });
      selected_arr.length = str.length;
      for (let i = 0; i < cells; i++) {
        for (let j = 0; j < cells; j++) {
          let n = i + j * cells;
          let num = arr[n];
          let x = offset + j * (d + margin) + d / 2;
          let y = offset + i * (d + margin) + d / 2;
          let rotate_num = p5.int(p5.random(4));
          if (k == kMax - 1 && selected_arr.includes(num)) {
            p5.push();
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.textSize(d / 1.2);
            p5.textStyle(p5.BOLD);
            p5.textFont(font);
            p5.push();
            p5.strokeWeight(d / 7);
            p5.strokeJoin(p5.ROUND);
            p5.stroke(colors[0]);
            p5.fill(colors[2]);
            p5.text(str.substr(0, 1), x, y - d / 7);
            p5.pop();
            str = str.slice(1);
            p5.pop();
          } else {
            p5.push();
            p5.translate(x, y);
            p5.rotate((rotate_num + k) * 360 / 4);
            p5.push();
            p5.translate(-d / 2, -d / 2);
            p5.noStroke();
            p5.pop();
            let v = 0;
            for (let e = d * 2; e > (d * 2) / 5; e -= (d * 2) / 5) {
              p5.fill(v++ % 2 == 0 ? colors[1] : colors[0]);
              p5.arc(-d / 2, -d / 2, p5.round(e), p5.round(e), 0, 90);
            }
            p5.pop();
          }
        }
      }
    }
    p5.noLoop();
  }

  function drawFrame(p5, x, y, w, h, o) {
    let bool = p5.random() > 0.5;
    drawSideRect(p5, x, y, o, o, bool);
    drawSideRect(p5,x + w - o, y, o, o + 0.01, bool);
    drawSideRect(p5,x, y + h - o, o, o + 0.01, bool);
    drawSideRect(p5,x + w, y + h, -o, -o, !bool);

    drawSideRect(p5,x + o, y, w - o * 2, o);
    drawSideRect(p5,x + o, y + h, w - o * 2, -o);

    drawSideRect(p5,x, y + o, o, h - o * 2);
    drawSideRect(p5,x + w - o, y + o, o, h - o * 2);
  }

  function drawSideRect(p5, x, y, w, h, isHorizontal = _p5.random() > 0.5) {
    p5.fill(colors[0]);
    p5.rect(x, y, w, h);
    p5.push();
    p5.translate(x, y);
    let o;
    let sep = p5.int(p5.random([2, 3, 4, 5]));
    let step = sep + (sep - 1) + 2;

    if (w == h) {
      if (h < 0) p5.scale(1, -1);
      if (w < 0) p5.scale(-1, 1);
      o = p5.abs(h / step);
      for (let i = 0; i < step; i++) {
        if (i % 2 == 1) {
          if (isHorizontal) {
            p5.fill(colors[i % 2]);
            p5.rect(o, o * i, p5.abs(w) - o * 2, o);
          } else {
            p5.fill(colors[i % 2]);
            p5.rect(o, o * i, p5.abs(w) - o * 2, o);
          }
        }
      }
    } else if (p5.abs(w) > p5.abs(h)) {
      if (h < 0) p5.scale(1, -1);
      o = p5.abs(h / step);
      for (let i = 0; i < step; i++) {
        if (i % 2 == 1) {
          p5.fill(colors[i % 2]);
          p5.rect(o, o * i, p5.abs(w) - o * 2, o);
        }
      }
    } else {
      if (w < 0) p5.scale(-1, 1);
      o = p5.abs(w / step);
      for (let i = 0; i < step; i++) {
        if (i % 2 == 1) {
          p5.fill(colors[i % 2]);
          p5.rect(o * i, o, o, p5.abs(h) - o * 2);
        }
      }
    }
    p5.pop();
  }

  // function keyPressed(p5){
  //   p5.save(_str+".png");
  // }
  return (
    <Sketch
      preload={preload}
      setup={setup}
      draw={draw}
    />
  )
}

export default HeroSketch