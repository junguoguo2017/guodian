<template>
    <canvas class="layer"  id="canvas" :style="{zIndex:zIndex}"></canvas>
</template>

<script>
    export default {
        name: "Gmarker",
        props:{
            coords:{
                type:Array,
                default:function () {
                    return []
                }
            },
        },
        data(){
            return{
                width:0,
                height: 0,
                markerCanvas:{},
                ctx:{},
                clickPointX:0,
                clickPointY:0,
                zIndex:99
            }
        },

        mounted(){
            this.markerCanvas = document.getElementById('canvas')
            this.ctx = this.markerCanvas.getContext('2d');
            this.markerCanvas.addEventListener('click',this.markerClick,false);//绑
            let self = this;
            setTimeout(()=>{
                self.height = self.$parent.height;
                self.width = self.$parent.width;
                self.init(self.coords);
            },300)

        },
        methods:{
            init(coords) {

                this.markerCanvas.width = this.width;
                this.markerCanvas.height = this.height;
                this.markerCanvas.style.width = this.width+'px';
                this.markerCanvas.style.height = this.height+'px';

                coords.forEach((coord)=>{
                    this.ctx.beginPath();
                    this.ctx.fillStyle =coord.color
                    this.ctx.arc(coord.x,coord.y,8,0,Math.PI*2)
                    this.ctx.fill()
                    this.ctx.closePath();
                    if(coord.label){
                        this.ctx.beginPath()
                        this.ctx.font="10px 微软雅黑";
                        this.ctx.fillStyle = '#fff'
                        this.ctx.fillText(coord.label,coord.x-this.ctx.measureText(coord.label).width/2,coord.y+16);
                        this.ctx.fill()
                        this.ctx.closePath();
                    }
                });
            },
            updateMarker(coords){//更新数据

                this.ctx.clearRect(this.markerCanvas.offsetLeft,this.markerCanvas.offsetTop,this.width,this.height)
                coords.forEach((coord)=>{
                    this.ctx.beginPath();
                    this.ctx.fillStyle =coord.color
                    this.ctx.arc(coord.x,coord.y,8,0,Math.PI*2)
                    this.ctx.fill()
                    this.ctx.closePath();
                    if(coord.label){
                        this.ctx.beginPath()
                        this.ctx.font="10px 微软雅黑";
                        this.ctx.fillStyle = '#fff'
                        this.ctx.fillText(coord.label,coord.x-this.ctx.measureText(coord.label).width/2,coord.y+16);
                        this.ctx.fill()
                        this.ctx.closePath();
                    }
                });
            },
            markerClick(event){
                this.clickPointX=event.clientX-this.markerCanvas.getBoundingClientRect().left;
                this.clickPointY=event.clientY-this.markerCanvas.getBoundingClientRect().top;
                this.ctx.clearRect(this.markerCanvas.offsetLeft,this.markerCanvas.offsetTop,this.width,this.height)
                this.coords.forEach((coord)=>{
                    this.ctx.beginPath();
                    this.ctx.fillStyle =coord.color
                    this.ctx.arc(coord.x,coord.y,8,0,Math.PI*2);
                    if(this.ctx.isPointInPath(this.clickPointX, this.clickPointY)){//点击选中该区域
                        this.ctx.fillStyle ='red';
                        this.$emit('markerClick',coord)
                    }

                    this.ctx.fill()
                    this.ctx.closePath();

                    if(coord.label){
                        this.ctx.beginPath()
                        this.ctx.font="10px 微软雅黑";
                        this.ctx.fillStyle = '#fff'
                        this.ctx.fillText(coord.label,coord.x-this.ctx.measureText(coord.label).width/2,coord.y+16);
                        this.ctx.fill()
                        this.ctx.closePath();
                    }
                });
            }
        },
        watch:{
            'coords':function (val) {
                this.updateMarker(val)
            }
        }
    }
</script>

<style >

</style>
