/* 公共的方法引用 */
var baseConfig = {
	server: "http://test-manage.vk520.com",
	requestUrl: "/ydlManage/server/index.php",
	sourceServer: "http://dianliaotools.oss-cn-shenzhen.aliyuncs.com",
	recruitShareIcon: "http://dianliaotools.oss-cn-shenzhen.aliyuncs.com/common/logo.png",//推荐主播分享icon地址
	serverStatus: false,
    // 正常删除、正常其它的信息提示
    normalTipMsg(obj, content) {
        obj.$message({
			message: content,
			type: 'info',
			showClose: true, // 显示关闭按钮
			duration: 3000, // 3s后自动消失
        });
	},
	successTipMsg(obj, content) {
		obj.$message({
			message: content,
			type: 'success',
			showClose: true, // 显示关闭按钮
			duration: 3000, // 3s后自动消失
		});
	},
    // 警告提示,传警告内容，进行显示(用于用户没有进行选择框选择)
    warningTipMsg(obj, content) {
        obj.$notify({
			message: content,
			type: 'warning',
            showClose: true, // 显示关闭按钮
			duration: 3000, // 3s后自动消失
        });
    },
    // 服务器传回的错误消息提示，进行error错误信息显示(用于服务端返回状态ret==0、code==0)
    errorTipMsg(obj, content) {
        obj.$notify({
			message: content,
			type: 'error',
            showClose: true, // 显示关闭按钮
			duration: 0, // 设置为0，让用户自己去关闭掉
        });
	},
	// 每一次进入到页面要自身加上判断进行相应的切换
	// 进行的搜索条件框高度的自适应一行还是二行
	// 正常的拥有了当前的直接写在el-form写在最上面第一个
	// 或者直接没有直接进行return出去的
	lineNumber(num) {
		var formHeight;
		if(document.getElementsByClassName('el-form')[0]) {
			formHeight = document.getElementsByClassName('el-form')[0].offsetHeight;
		} else {
			return num;
		}
		if(formHeight<80) {
			return num;
        } else {
            return  num - 50;
        }
	},
    // 设置cookie
	setCookie(name, value, expireDay) {
		expireDay = expireDay || 1;
		var exp = new Date();
	    exp.setTime(exp.getTime() + this.cookieExpire*24*60*60*1000);
	    document.cookie = name + "="+ encodeURI (value) + ";expires=" + exp.toGMTString() + "; path=/";
	},
	// 获得cookie
	getCookie(cookie_name) {
		if (document.cookie.length>0) {
			var c_start = document.cookie.indexOf(cookie_name + "=");
			var c_end;
			if (c_start != -1) {
				c_start = c_start + cookie_name.length + 1;
				c_end = document.cookie.indexOf(";", c_start);
				if (c_end == -1) c_end = document.cookie.length;
				return decodeURI(document.cookie.substring(c_start, c_end));
			}
		}
		return "";
	},
	// 设置本地存储key, value, type--(true->localStorage, false->sessionStorage)
	setStorage(key, value, type) {
		if (typeof(key)!='string'&&typeof(value)!='string') {
			alert('存储必须是字符串');
		}
		if (type) {
			localStorage.setItem(key,value);
		}else {
			sessionStorage.setItem(key,value);
		}
	},
	// 取出本地存储key, type--(true->localStorage, false->sessionStorage)
	getStorage(key, type) {
		if (type) {
			return localStorage.getItem(key);
		}else {
			return sessionStorage.getItem(key);
		}
	},
	// 获取链接地址后面的参数情况，传入key得value
	getReq(name) {
		var url = location.search;
		if (url.indexOf("?") != -1) {
			var str = url.substr(1);
			strs = str.split("&");
			for(var i = 0; i < strs.length; i++) {
				this[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
			}
			return this[name];
	   }
	   return null;
	},
	/*
		获取间隔前的时间
		startDate->传入目前的日期(new Date()格式的日期形式),days->间隔的时间
		得到对象beforeTime->之前的时间,currentlyTime->目前的时间
	*/ 
	getDateInterval(startDate, days) {
		var start;
		var end;
		if (startDate instanceof Date) {
			start = startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate();
			var startAfterDays = startDate.setDate(startDate.getDate() - days);
			startAfterDays = new Date(startAfterDays);
			end = startAfterDays.getFullYear() + "-" + (startAfterDays.getMonth() + 1) + "-" + startAfterDays.getDate();
		}
		return {
			beforeTime: end,
			currentlyTime: start 
		};
	},
	/*
		传入时间获取到时分秒(对应十位、个位)
		timeSeconds->传入时间单位为秒
		hourTen->小时的十位，hourBit->小时的个位...
	*/ 
	changeHourMinSecond(timeSeconds) {
		var hour = parseInt(timeSeconds/3600);
		var minter = parseInt(timeSeconds/60%60);
		var second = parseInt(timeSeconds%60);
		//对时、分、秒位数位数少于十位进行处理
		hour = hour>9 ? hour : "0"+hour;
		minter = minter>9 ? minter : "0"+minter;
		second = second>9 ? second : "0"+second;
		var one = (hour+"").substring(0,1);
		var two = (hour+"").substring(1,2);
		var three = (minter+"").substring(0,1);
		var four = (minter+"").substring(1,2);
		var five = (second+"").substring(0,1);
		var six = (second+"").substring(1,2);
		return {
			hourTen: one,
			hourBit: two,
			minterTen: three,
			minterBit: four,
			secondTen: five,
			secondBit: six
		};
	},
	// 对象的深拷贝
	deepCopy(obj) {
		var _this = this;
		if(typeof obj !='object') {
			return obj;
		}
		var newobj = {};
		for(var attr in obj) {
			newobj[attr] = _this.deepCopy(obj[attr]);
		}
		return newobj;
	},
	// 数组的深拷贝
	copyArr(arr) {
		let res = [];
		for (let i=0; i<arr.length; i++) {
		 	res.push(arr[i]);
		}
		return res;
	},
	// 对日期时间的格式进行转换时间格式化，type==0->日期，type==1->日期时间,type==2->（年-月）
	changeDateTime(data, type) {
		var date = new Date(data);
		var sign1 = "-";
		var sign2 = ":";
		var year = date.getFullYear(); // 年
		var month = date.getMonth() + 1; // 月
		var day  = date.getDate(); // 日
		var hour = date.getHours(); // 时
		var minutes = date.getMinutes(); // 分
		var seconds = date.getSeconds(); //秒
		if(month>=1 && month<=9) { month = "0" + month; }
		if(day>=0 && day<=9) { day = "0" + day; }
		if(hour>=0 && hour<=9) { hour = "0" + hour; }
		if(minutes>=0 && minutes<=9) { minutes = "0" + minutes; }
		if(seconds>=0 && seconds<=9) { seconds = "0" + seconds; }
		var currentDate = year+sign1+month+sign1+day;
		var currentMonth = year+sign1+month;  // 新增（年-月）格式转换
		var currentDateTime = year+sign1+month+sign1+day+" "+hour+sign2+minutes+sign2+seconds;
		if(type==0) { return currentDate; }
		else if(type==1) { return currentDateTime; }
		else if(type==2) {return currentMonth;}
	},
	// 时间转换 毫秒-> 天 时 分 秒
	changeTime(time) {
		var minute = Math.floor(time/60%60); // 分
		var hour = Math.floor(time/60/60%24); // 时
		var second = Math.floor(time%60); // 秒
		var day = Math.floor(time/60/60/24); 
		var timeString = null;
		// 如果 天为0 就不显示
		if(day==0){
			if(hour==0){
				if(minute==0){
					timeString = second + "秒";
				}else{
					timeString = minute + "分" + second + "秒";
				}
			}else{
				timeString = hour + "时" + minute + "分" + second + "秒";
			}
		}else {
			timeString = day + "天" + hour + "时" + minute + "分" + second + "秒";
		}
		return timeString;
	 },
	//  获取两个日期之间相应之间的日期数组
	getAllDate(begin, end) {
		var arr = [];
		var ab = begin.split("-");
		var ae = end.split("-");
		var db = new Date();
		db.setUTCFullYear(ab[0], ab[1]-1, ab[2]);
		var de = new Date();
		de.setUTCFullYear(ae[0], ae[1]-1, ae[2]);
		var unixDb = db.getTime();
		var unixDe = de.getTime();
		for(var k=unixDb; k<=unixDe;) {
			arr.push((new Date(parseInt(k))).format());
			k = k + 24 * 60 * 60 * 1000;
		}
		return arr;
	},
};
// 给加上一个日期格式的原型方法
Date.prototype.format = function() {
	var s = '';
	var mouth = (this.getMonth() + 1) >= 10 ? (this.getMonth() + 1) : ('0' + (this.getMonth() + 1));
	var day = this.getDate() >= 10 ? this.getDate() : ('0' + this.getDate());
	s += this.getFullYear() + '-';  
	s += mouth + "-";
	s += day;
	return(s);
};
// 进行正式服、测试服区分
if (location.href.indexOf('http://new-manage.vk520.com')=='0') {
	baseConfig.serverStatus = true;
	baseConfig.server = 'http://manage.vk520.com';
} else {
	// 不进行处理
}