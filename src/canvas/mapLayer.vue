<template>
    <div style="position: relative;">
        <canvas style="position: absolute;left: 0;top: 0;" id='mapDefault'></canvas>
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
                height: 0
            }
        },
        mounted(){
		    this.$nextTick(()=>{
                this.layerInit(this.mapDefault,document.getElementById('mapDefault'))
            })
        },
        methods:{
		    layerInit(image,canvas){
                var ctx = canvas.getContext('2d')
                var img = new Image();
                img.src = image;
                var self =this
                img.onload = function(){
                    canvas.style.width = img.width+'px'
                    canvas.style.height = img.height+'px';
                    self.height = img.height;
                    self.width = img.width
                    console.log(self.height)
                    canvas.height = img.height;
                    canvas.width = img.width;
                    //ctx.drawImage(img, 0, 0);  //在指定点绘制图像(原始大小)
                    ctx.drawImage(img, 0, 0, img.width, img.height); // 在指定点绘制图像(使用指定的宽和高)
                };


            }
        }
	}
</script>

<style scoped>

</style>
