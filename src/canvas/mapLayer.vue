<template>
    <div style="position: relative;" id="map">
        <canvas style="position: absolute;left: 0;top: 0;" id='mapDefault'></canvas>
        <canvas class="layer"  id="mapCanvas" :style="{zIndex:99}"></canvas>
        <slot></slot>
    </div>

</template>

<script>
	export default {
		name: "mapLayer",
        data(){
		    return{
                mapDefault:require('@/assets/images/ditu.jpg'),
                width:0,
                height: 0,
                mapCanvas:{}
            }
        },
        props:{
		    markers:{//marker点
		        type:Array,
                default:function () {
                    return []
                }
            },
            lines:{//线
                type:Array,
                default:function () {
                    return []
                }
            },
            fences:{//围栏
                type:Array,
                default:function () {
                    return []
                }
            },
            tracks:{//轨迹
                type:Array,
                default:function () {
                    return []
                }
            },

        },
        mounted(){
		    this.$nextTick(()=>{
                this.layerInit(this.mapDefault,document.getElementById('mapDefault'))
            })
        },
        watch:{

        },
        methods:{
		    layerInit(image,canvas){//地图渲染
                var ctx = canvas.getContext('2d')
                var img = new Image();
                img.src = image;
                var self =this
                img.onload = function(){
                    canvas.style.width = img.width+'px'
                    canvas.style.height = img.height+'px';
                    self.height = img.height;
                    self.width = img.width
                    canvas.height = img.height;
                    canvas.width = img.width;
                    //ctx.drawImage(img, 0, 0);  //在指定点绘制图像(原始大小)
                    ctx.drawImage(img, 0, 0, img.width, img.height); // 在指定点绘制图像(使用指定的宽和高)
                    self.mapInit('mapCanvas',img.width,img.height)

                };
            },
            mapInit(canvasId,W,H){
                this.mapCanvas = document.getElementById(canvasId)
                this.ctx = this.mapCanvas.getContext('2d');
                this.mapCanvas.addEventListener('click',this.markerClick,false);
                this.mapCanvas.width = W;
                this.mapCanvas.height = H;
                this.mapCanvas.style.width = W+'px';
                this.mapCanvas.style.height = H+'px';
                this.ctx.save();
                /*marker*/
                this.markers.forEach((marker)=>{
                    this.ctx.beginPath();
                    this.ctx.fillStyle =marker.color
                    this.ctx.arc(marker.x,marker.y,8,0,Math.PI*2)
                    this.ctx.fill()
                    this.ctx.closePath();
                    if(marker.label){
                        this.ctx.beginPath()
                        this.ctx.font="10px 微软雅黑";
                        this.ctx.fillStyle = '#fff'
                        this.ctx.fillText(marker.label,marker.x-this.ctx.measureText(marker.label).width/2,marker.y+16);
                        this.ctx.fill()
                        this.ctx.closePath();
                    }
                });
                /*line*/
                this.lines.forEach((line)=>{
                    /*线段两端*/
                    this.ctx.beginPath();
                    this.ctx.fillStyle =line.color||'#000'
                    this.ctx.arc(line.start[0],line.start[1],2,0,Math.PI*2)
                    this.ctx.fill()
                    this.ctx.closePath();
                    this.ctx.beginPath();
                    this.ctx.arc(line.end[0],line.end[1],2,0,Math.PI*2)
                    this.ctx.fill()
                    this.ctx.closePath();
                    /*画线*/
                    this.ctx.beginPath();
                    this.ctx.fillStyle =line.color||'#000'
                    this.ctx.moveTo(line.start[0],line.start[1])
                    this.ctx.lineTo(line.end[0],line.end[1])
                    this.ctx.stroke()
                    this.ctx.closePath();
                    /*文字*/
                    if(line.label){
                        this.ctx.beginPath()
                        this.ctx.font="10px 微软雅黑";
                        this.ctx.fillStyle = '#fff'
                        this.ctx.fillText(line.label,line.x-this.ctx.measureText(line.label).width/2,line.y+16);
                        this.ctx.fill()
                        this.ctx.closePath();
                    }
                });
                /*多边形*/
                this.fences.forEach((fence)=>{

                })
                this.ctx.restore();
            },
        }
	}
</script>

<style scoped>

</style>
