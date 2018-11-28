<template>
    <canvas class="layer" id="circleCanvas" :style="{zIndex:zIndex}"></canvas>
</template>

<script>
    export default {
        name: "circlefence",
        data(){
            return{
                width:0,
                height: 0,
                markerCanvas:{},
                ctx:{},
                clickPointX:0,
                clickPointY:0,
                zIndex:100
            }
        },
        props:{
            areas:{
                type:Array,
                default:function () {
                    return []
                }
            },
            editAble:{//编辑
                type:Boolean,
                default:false,
            },
            createAble:{//添加圆
                type:Boolean,
                default:false
            }

        },
        mounted(){
            let self = this;
            this.circleCanvas = document.getElementById('circleCanvas')
            this.ctx = this.circleCanvas.getContext('2d');
            this.circleCanvas.addEventListener('mousemove',this.circleHover,false);//绑定鼠标滑过圆边框
            /*this.circleCanvas.addEventListener('click',this.circleClick,false);//点击*/
            setTimeout(()=>{
                self.height = self.$parent.height;
                self.width = self.$parent.width;
                self.circleCanvas.width = self.width;
                self.circleCanvas.height = self.height;
                self.circleCanvas.style.width = self.width+'px';
                self.circleCanvas.style.height = self.height+'px';
                self.initCircle()
            },300)
            /*if(!this.editAble){}
            this.init()*/

        },
        methods:{
            initCircle(){
                this.areas.forEach((cicle)=>{
                    /*圆名称*/
                    this.ctx.beginPath();
                    this.ctx.fillStyle = '#fff'
                    this.ctx.font="14px 微软雅黑";
                    this.ctx.fillText(cicle.label,cicle.center[0]-this.ctx.measureText(cicle.label).width/2,  cicle.center[1]+5)
                    this.ctx.fill()
                    this.ctx.closePath()
                    /*绘制圆*/
                    this.ctx.beginPath()
                    this.ctx.fillStyle = 'rgba(0,0,0,.4)';
                    this.ctx.strokeStyle = cicle.strokecolor
                    this.ctx.arc(cicle.center[0],  cicle.center[1], cicle.radius, 0, 2 * Math.PI);
                    this.ctx.fill()
                    this.ctx.stroke()
                    this.ctx.closePath()
                })
            },
            circleHover(event){
                let self = this;
                let isAllowDrawLine = false
                this.clickPointX=event.clientX-this.circleCanvas.getBoundingClientRect().left;
                this.clickPointY=event.clientY-this.circleCanvas.getBoundingClientRect().top;
                this.ctx.clearRect(this.circleCanvas.offsetLeft,this.circleCanvas.offsetTop,this.width,this.height);
                this.areas.forEach((cicle)=>{
                    /*圆名称*/
                    this.ctx.beginPath();
                    this.ctx.fillStyle = '#fff'
                    this.ctx.font="14px 微软雅黑";
                    this.ctx.fillText(cicle.label,cicle.center[0]-this.ctx.measureText(cicle.label).width/2,  cicle.center[1]+5)
                    this.ctx.fill()
                    this.ctx.closePath()
                    /*绘制圆*/
                    this.ctx.beginPath()
                    this.ctx.fillStyle = 'rgba(0,0,0,.4)';
                    this.ctx.strokeStyle = cicle.strokecolor;
                    this.ctx.lineWidth = 2
                    this.ctx.arc(cicle.center[0],  cicle.center[1], cicle.radius, 0, 2 * Math.PI);

                    if(this.ctx.isPointInPath(this.clickPointX, this.clickPointY)){//选中该区域
                        this.ctx.lineWidth = 5
                        this.ctx.strokeStyle = 'red';

                    }
                     this.ctx.fill()
                    this.ctx.stroke()
                    this.ctx.closePath()
                })




            },
            circleDrag(event){

            },
            init(){
                function windowToCanvas(canvas, x, y){
                    let rect = canvas.getBoundingClientRect();
                    return {
                        x: x - rect.left * (canvas.width/rect.width),
                        y: y - rect.top * (canvas.height/rect.height)
                    }
                }
                let theCanvas = document.querySelector('#canvas')
                if (!theCanvas || !theCanvas.getContext) {
                    return false
                } else {
                    let context = theCanvas.getContext('2d')
                    let isAllowDrawLine = false
                    theCanvas.onmousedown = function(e) {
                        isAllowDrawLine = true
                        let ele = windowToCanvas(theCanvas, e.clientX, e.clientY)
                        let { x, y } = ele
                        self.center = ele

                        theCanvas.onmousemove = (e) => {
                            if (isAllowDrawLine) {

                                context.clearRect(0,0,theCanvas.width,theCanvas.height);
                                let ele = windowToCanvas(theCanvas, e.clientX, e.clientY)
                                let { x, y } = ele;
                                var dx = Math.abs(self.center.x - x);
                                var dy = Math.abs(self.center.y - y);
                                var dis = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
                                context.beginPath()
                                context.fillStyle = '#000'
                                context.arc(self.center.x,  self.center.y, 4, 0, 2 * Math.PI);
                                context.fill()
                                context.closePath()

                                context.beginPath()
                                context.fillStyle='rgba(234,75,56,.5)'
                                context.strokeStyle = '#000'
                                context.arc(self.center.x,  self.center.y, dis, 0, 2 * Math.PI);
                                context.fill()
                                context.stroke()
                                context.closePath()
                            }
                        }
                    }
                    theCanvas.onmouseup = function() {
                        isAllowDrawLine = false
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
