

//01�����������ã���ȡ�����ø�Ԫ�ص�css��ʽ
function css(obj, attr, value){
	if(arguments.length==2){//���������ʵ��
		if(attr!='opacity'){//�������͸����
			return parseInt(obj.currentStyle?obj.currentStyle[attr]:document.defaultView.getComputedStyle(obj, false)[attr]);//defaultView��ȡ��������
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

//02�������˶��Ŀ��
function miaovDoMoveBuffer(obj, oTarget, fnCallBack, fnDuring){

	var bStop=true;
	var attr='';//�ձ�������for in���г䵱�±�
	var speed=0;//�ٶ�
	var cur=0;
	
	for(attr in oTarget){
		cur=css(obj, attr);//���������װ��CSS������ȡĿ���
		if(oTarget[attr]!=cur){//�����json�������κ�һ��ֵ�����������������ȡ����Ŀ���
			bStop=false;
			 //�����˶�����ȡֵ
			speed=(oTarget[attr]-cur)/3;
			speed=speed>0?Math.ceil(speed):Math.floor(speed);
			//���������װ��CSS�����������˶�
			css(obj, attr, cur+speed);
		}
	}
	
	if(fnDuring)fnDuring.call(obj);//�������ִ�й����У�����ǰ�˶���δ����ʱ�������к���
	
	if(bStop){//�������ֵ������Ŀ���
		clearInterval(obj.timer);
		obj.timer=null;
		
		if(fnCallBack)fnCallBack.call(obj);//��������˻ص���������˴�ִ��
	}
}

//03��Ħ���˶��Ŀ��
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
			obj.oSpeed[attr]*=0.7;//Ħ���˶�
			
			css(obj, attr, cur+obj.oSpeed[attr]);
		}
	}
	
	if(fnDuring)fnDuring.call(obj);//call()���������ã����ض����������е��ú���
	
	if(bStop){
	
		clearInterval(obj.timer);
		obj.timer=null;
		
		if(fnCallBack)fnCallBack.call(obj);
	}
}//function miaovDoMoveFlex end/

//04����������������д洢�ǿ������˶���Ħ���˶�
var MIAOV_MOVE_TYPE={//���������ֲ�ͬ���˶���ʽ
	BUFFER: 1,//�����˶�
	FLEX: 2//�����˶�
};

//05���˶���ܺ���
function startMove(obj, oTarget, iType, fnCallBack, fnDuring){
/*obj��Ҫ���ĸ�Ԫ���˶�����
oTarget�˶���Ŀ����͸���ȵ�80%
iType�˶�����ʽ�����Ϸ�44�д��������˶���ʽ
fnCallBack��ʽ�˶��ĺ����������ĺ����Ƿ��к����������˶�ִ�����Ժ�ִ�еĺ�����
fnDuring��ʽ�˶��ĺ����������Ĺ������Ƿ��к��������˶�ִ�еĹ����У�ִ�еĺ�����
*/
	//05-1����������˶�
	var fnMove=null;
	//05-2���ض�ʱ��
	if(obj.timer){
		clearInterval(obj.timer);
	}
	
	//05-3��ѡ���˶���ʽ��������105�д��й���var MIAOV_MOVE_TYPE
	switch(iType){
		case MIAOV_MOVE_TYPE.BUFFER:
			fnMove=miaovDoMoveBuffer;
			break;
		case MIAOV_MOVE_TYPE.FLEX:
			fnMove=miaovDoMoveFlex;
			break;
	}
	
	//05-3������ʱ��
	obj.timer=setInterval(function (){
		fnMove(obj, oTarget, fnCallBack, fnDuring);
	}, 30);
}//function miaovStartMove  end/


//06���رն�ʱ���ĺ�����
function miaovStopMove(obj){
	clearInterval(obj.timer);
}