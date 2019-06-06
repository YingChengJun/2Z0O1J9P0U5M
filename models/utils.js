//util.js用来存放一些公共的处理函数

let utils = {};

//解决数据库时区问题，得到东8区的时间（原时区0）
utils.formatDate = (date) => {
	let  y  =  date.getFullYear();      
	let  m  =  date.getMonth()  +  1;      
	m  =  m  <  10  ?  ('0'  +  m)  :  m;      
	let  d  =  date.getDate();      
	d  =  d  <  10  ?  ('0'  +  d)  :  d;      
	let  h  =  date.getHours();      
	let  minute  =  date.getMinutes();
	let second = date.getSeconds(); 
	minute  = minute  < 10  ? ('0'  + minute)  :  minute;
	second = second < 10 ? ('0' + second) : second;
	return  y  +  '-'  +  m  +  '-'  +  d + ' ' + h + ':' + minute + ":" + second;
}

module.exports = utils;