var global_today_date;

function show_calender(){
    var offset_calender = cur_dayobj.offset();                                     
    $(".calender_msg").css({"display":"block","left":offset_calender.left-22,"top":offset_calender.top+33});
    mycalender("","");
}

function mychangecal(action,year,month)
{    
	var strcal;
	var tempmonth = month;
	switch(action)
	{      
	case "nextmonth":
	        if(month==11)
	        {
	              month = 1;
	              year = year*1 + 1;
	        }else{
	              month = month*1 + 2;
	        }       
	        strcal = "<span class='arow_right_calendar'  onclick='mycalender(" + year + "," + month +")' title='下一个月'></span>";
	        break;
	case "premonth":
	        if(month==0)
	        {
	              month = 12;
	              year = year*1 - 1;
	        }
	        strcal = "<span class='arow_left_calendar' onclick='mycalender(" + year + "," + month +")' title='上一个月'></span>";
	        break;
	default:;
	}
	strcal = " " + strcal + " ";
	return(strcal);
}

function mycalender(cyear,cmonth) {
	var qmonth, qyear;
	if((cyear=="" )||(cmonth=="")) {
	qmonth=mythisday.getMonth();
	qyear=mythisday.getFullYear();
	qmonth=qmonth*1+1;
	} else {
		qyear=cyear;
		qmonth=cmonth;
	}
	
	var d, d_date, d_day, d_month;
	//定义每月天数数组
	var monthdates=["31","28","31","30","31","30","31","31","30","31","30","31"];
	d=new Date();
	d_year=d.getYear();
	//获取年份
	//判断闰月，把monthdates的二月改成29
	if(((d_year%4==0)&&(d_year%100!=0))||(d_year%400==0))
		monthdates[1]="29";
	if((cyear!="" )||(cmonth!="")) {
	//如果用户选择了月份和年份，则当前的时间改为用户设定
		d.setYear(cyear);
		d.setMonth(cmonth-1,1);
		d.setDate(1);
	}
	d_month=d.getMonth();
	//获取当前是第几个月
	d_year=d.getYear();
	//获取年份
	d_date=d.getDate();
	//获取日期
	//d_day = d.getDay();
	//修正19XX年只显示两位的错误
	if(d_year<2000) {
		d_year=d_year+1900
	}
	
	//===========输出日历===========
	var str;
	str="<table cellspacing='0' cellpadding='0' id='mycalender'>";
	str+="<tr><td id='cal_title' colspan='7' >"
	str+=mychangecal("premonth",d_year,d_month)
	str+="<span class='date_content' id='date_content' ym="+d_year+"-"+add_zero((d_month*1+1))+">"+d_year+"年 "+add_zero((d_month*1+1))+"月</span>"
	str+=mychangecal("nextmonth",d_year,d_month)
	str+="</td></tr>";
	str+="<tr id='week'><th class='l_line'>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th class='r_line'>六</th></tr>";
	str+="<tr>";
	var firstday, lastday, totalcounts, firstspace, lastspace, monthdays;
	//需要显示的月份共有几天，可以用已定义的数组来获取
	monthdays=monthdates[d.getMonth()];
	//设定日期为月份中的第一天
	d.setDate(1);
	//需要显示的月份的第一天是星期几
	firstday=d.getDay();
	//1号前面需要补足的的空单元格的数
	firstspace=firstday;
	//设定日期为月份的最后一天
	d.setDate(monthdays);
	//需要显示的月份的最后一天是星期几
	lastday=d.getDay();
	//最后一天后面需要空单元格数
	lastspace=6-lastday;
	//前空单元格+总天数+后空单元格，用来控制循环
	totalcounts=firstspace*1+monthdays*1+lastspace*1;
	//count：大循环的变量;f_space:输出前空单元格的循环变量;l_space:用于输出后空单元格的循环变量
	var count, flag, f_space, l_space;
	//flag：前空单元格输完后令flag=1不再继续做这个小循环
	flag=0;
	for( count=1;count<=totalcounts;count++) {
	//一开始flag=0，首先输出前空单元格，输完以后flag=1，以后将不再执行这个循环
	if(flag==0) {
	if(firstspace!=0) {
	for( f_space=1;f_space<=firstspace;f_space++) {
		str+="<td>&nbsp;</td>";
		if(f_space!=firstspace)
			count++;
		}
		flag=1;
		continue;
		}
	}
	if((count-firstspace)<=monthdays) {
		//str += "<td class='have_day'>" + (count - firstspace) + "</td>";
		if(global_today_date==(count-firstspace)) {
			str+="<td class='have_day set'>"+(count-firstspace)+"</td>";
		} else {
			str+="<td class='have_day'>"+(count-firstspace)+"</td>";
		}
		if(count%7==0) {
			if(count<totalcounts) {
				str+="</tr><tr>";
			} else {
				str+="</tr>";
			}	
		}
	} else {
		//如果已经输出了月份中的最后一天，就开始输出后空单元格补足
		for( l_space=1;l_space<=lastspace;l_space++) {
			str+="<td>&nbsp;</td>";
			if(l_space!=lastspace)
				count++;
			}
			continue;
		}
	}
	str+="</table>"
	$("#mycalenderdiv").html(str);
	$("#mycalender td.have_day").click(function(e) {
		e.preventDefault();
		var nowtoday=add_zero($(this).html());
		if(nowtoday) {
			var assign_day=$("#date_content").attr("ym")+"-"+nowtoday;
			if(!check_timeRange(assign_day)) {
				alert("抱歉，查询时间不能超过3个月,请重新选择。");
				return;
			}
			cur_dayobj.val(assign_day);
			$("#mycalender td.have_day").removeClass("set");
			$(this).addClass("set");
		}
		$(".calender_msg").css("display","none");
	});
}

function add_zero(temp) 
{
    if(temp<10) return "0"+temp;
    else return temp;
}

function check_timeRange(asd) {
    var start_time = $("#start_day").val();
    var end_time = $("#end_day").val();

    if(cur_dayobj && cur_dayobj.attr("name") == "start_day" && asd) start_time = asd;
    if(cur_dayobj && cur_dayobj.attr("name") == "end_day" && asd) end_time = asd;

    var d_start_time = newDate(start_time);
    var d_end_time = newDate(end_time);
    d_start_time.setMonth(d_start_time.getMonth() + 3);
    return d_end_time <= d_start_time ? true : false;
}
// ie didn't accept params in new Date();

function newDate(datestr) {
	alert(datestr);
    var ymd = datestr.split("-");
    var date = new Date();
    date.setUTCFullYear(ymd[0], ymd[1] - 1, ymd[2]);
    return date;
}
