import Sprite   from '../base/sprite'
// import Bullet   from './bullet'
import DataBus  from '../databus'
import Animation from '../base/animation'

const screenWidth    = window.innerWidth
const screenHeight   = window.innerHeight


// 玩家相关常量设置
const PLAYER_IMG_SRC = 'images/npc.png'
const PLAYER_WIDTH   = 90 
const PLAYER_HEIGHT  = 40

var starty =  PLAYER_WIDTH / 2 +30;
var startx = screenWidth *2/ 3;
var speed
var upvy = 0;

let databus = new DataBus()

export default class Player extends Animation {
  constructor(ctx) {
    super(PLAYER_IMG_SRC, PLAYER_WIDTH, PLAYER_HEIGHT)
    starty = PLAYER_WIDTH / 2 + 30;
    // 玩家默认处于屏幕底部居中位置
    this.x = screenWidth / 3 - this.width / 2
    this.y =  this.height + 30
    this.initExplosionAnimation()
    upvy = 0;
    speed = 0.2
    // 用于在手指移动的时候标识手指是否已经在飞机上了

    // this.bullets = []

    // 初始化事件监听
    this.initEvent(ctx)
  }

  /**
   * 当手指触摸屏幕的时候
   * 判断手指是否在飞机上
   * @param {Number} x: 手指的X轴坐标
   * @param {Number} y: 手指的Y轴坐标
   * @return {Boolean}: 用于标识手指是否在飞机上的布尔值
   */
  checkIsFingerOnAir(x, y) {
    const deviation = 30

    return !!(   x >= this.x - deviation
              && y >= this.y - deviation
              && x <= this.x + this.width + deviation
              && y <= this.y + this.height + deviation  )
  }

  /**
   * 根据手指的位置设置飞机的位置
   * 保证手指处于飞机中间
   * 同时限定飞机的活动范围限制在屏幕中
   */
  setAirPosAcrossFingerPosZ(x, y) {
    let disX = x - this.width / 2
    let disY = y - this.height / 2

    if ( disX < 0 )
      disX = 0

    else if ( disX > screenWidth - this.width )
      disX = screenWidth - this.width

    if ( disY <= 0 )
      disY = 0

    else if ( disY > screenHeight - this.height )
      disY = screenHeight - this.height

    this.x = disX
    this.y = disY
  }

  /**
   * 玩家响应手指的触摸事件
   * 改变战机的位置
   */
  initEvent(ctx) {
    canvas.addEventListener('touchstart', ((e) => {
        e.preventDefault()
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        upvy = 0;
        speed = - 0.2
    }).bind(this))

    canvas.addEventListener('touchend', ((e) => {
      e.preventDefault()
      speed = 0.2
      upvy = 0;
    }).bind(this))
  }

 
  // 预定义爆炸的帧动画
  initExplosionAnimation() {
    let frames = []

    const EXPLO_IMG_PREFIX = 'images/explosion'
    const EXPLO_FRAME_COUNT = 19

    for (let i = 0; i < EXPLO_FRAME_COUNT; i++) {
      frames.push(EXPLO_IMG_PREFIX + (i + 1) + '.png')
    }

    this.initFrames(frames)
  }



  update(ctx) {
      upvy += speed
      starty = starty + upvy
      this.setAirPosAcrossFingerPosZ(startx, starty)
      if (starty >= screenHeight - PLAYER_WIDTH / 2 || starty <= PLAYER_HEIGHT / 2 ) {
        upvy = 0
        databus.gameOver = true
      }
  }
}
