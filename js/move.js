

//01、函数的作用：获取或设置该元素的css样式
function css(obj, attr, value){
	if(arguments.length==2){//如果是两个实参
		if(attr!='opacity'){//如果不是透明度
			return parseInt(obj.currentStyle?obj.currentStyle[attr]:document.defaultView.getComputedStyle(obj, false)[attr]);//defaultView获取整个数据
		} else {
			return Math.round(100*parseFloat(obj.currentStyle?obj.currentStyle[attr]:document.defaultView.getComputedStyle(obj, false)[attr]));
		}
	} else if (arguments.length==3)
		switch(attr){
			case 'width':
			case 'height':
			case 'paddingLeft':
			case 'paddingTop':
			case 'paddingRight':
			case 'paddingBottom':
				value=Math.max(value,0);
			case 'left':
			case 'top':
			case 'marginLeft':
			case 'marginTop':
			case 'marginRight':
			case 'marginBottom':
				obj.style[attr]=value+'px';
				break;
			case 'opacity':
				obj.style.filter="alpha(opacity:"+value+")";
				obj.style.opacity=value/100;
				break;
			default:
				obj.style[attr]=value;
		}
	
	return function (attr_in, value_in){css(obj, attr_in, value_in)};
}

//02、缓冲运动的框架
function miaovDoMoveBuffer(obj, oTarget, fnCallBack, fnDuring){

	var bStop=true;
	var attr='';//空变量，在for in当中充当下标
	var speed=0;//速度
	var cur=0;
	
	for(attr in oTarget){
		cur=css(obj, attr);//利用上面封装的CSS函数获取目标点
		if(oTarget[attr]!=cur){//如果当json当中有任何一个值，不等于我们上面获取到的目标点
			bStop=false;
			 //缓冲运动，并取值
			speed=(oTarget[attr]-cur)/3;
			speed=speed>0?Math.ceil(speed):Math.floor(speed);
			//利用上面封装的CSS函数做具体运动
			css(obj, attr, cur+speed);
		}
	}
	
	if(fnDuring)fnDuring.call(obj);//如果函数执行过程中（即当前运动还未结束时），还有函数
	
	if(bStop){//如果所有值都到了目标点
		clearInterval(obj.timer);
		obj.timer=null;
		
		if(fnCallBack)fnCallBack.call(obj);//如果传递了回调函数，则此处执行
	}
}

//03、摩擦运动的框架
function miaovDoMoveFlex(obj, oTarget, fnCallBack, fnDuring){

	var bStop=true;
	var attr='';
	var speed=0;
	var cur=0;
	
	for(attr in oTarget){
	
		if(!obj.oSpeed)obj.oSpeed={};
		if(!obj.oSpeed[attr])obj.oSpeed[attr]=0;
		cur=css(obj, attr);
		if(Math.abs(oTarget[attr]-cur)>=1 || Math.abs(obj.oSpeed[attr])>=1){
		
			bStop=false;
			
			obj.oSpeed[attr]+=(oTarget[attr]-cur)/5;
			obj.oSpeed[attr]*=0.7;//摩擦运动
			
			css(obj, attr, cur+obj.oSpeed[attr]);
		}
	}
	
	if(fnDuring)fnDuring.call(obj);//call()方法的作用：在特定的作用域中调用函数
	
	if(bStop){
	
		clearInterval(obj.timer);
		obj.timer=null;
		
		if(fnCallBack)fnCallBack.call(obj);
	}
}//function miaovDoMoveFlex end/

//04、定义变量：变量中存储是可以是运动或摩擦运动
var MIAOV_MOVE_TYPE={//以下是两种不同的运动形式
	BUFFER: 1,//缓冲运动
	FLEX: 2//弹性运动
};

//05、运动框架函数
function startMove(obj, oTarget, iType, fnCallBack, fnDuring){
/*obj需要让哪个元素运动起来
oTarget运动的目标如透明度到80%
iType运动的形式，如上方44行处的两种运动形式
fnCallBack链式运动的函数（函数的后面是否还有函数，所有运动执行完以后，执行的函数）
fnDuring链式运动的函数（函数的过程中是否还有函数，在运动执行的过程中，执行的函数）
*/
	//05-1、清空所有运动
	var fnMove=null;
	//05-2、关定时器
	if(obj.timer){
		clearInterval(obj.timer);
	}
	
	//05-3、选择运动形式：与上面105行处有关联var MIAOV_MOVE_TYPE
	switch(iType){
		case MIAOV_MOVE_TYPE.BUFFER:
			fnMove=miaovDoMoveBuffer;
			break;
		case MIAOV_MOVE_TYPE.FLEX:
			fnMove=miaovDoMoveFlex;
			break;
	}
	
	//05-3、开定时器
	obj.timer=setInterval(function (){
		fnMove(obj, oTarget, fnCallBack, fnDuring);
	}, 30);
}//function miaovStartMove  end/


//06、关闭定时器的函数：
function miaovStopMove(obj){
	clearInterval(obj.timer);
}