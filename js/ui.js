var UI = {
        /**
         * tab切换效果
         * @param {String} ulID   tab项的外层ID
         * @param {String} infoID 显示内容项的ID
         * @param {String} cName  选中样式名称
         */
        tab: function (ulID,infoID,cName){
            var lst = document.getElementById(ulID).getElementsByTagName("li");
            for(var i=0; i<lst.length; i++){
                lst[i].index = i+1;
                lst[i].onclick =function(){
                    for(var j=1; j<=lst.length; j++){
                        lst[j-1].className = "";
                        document.getElementById(infoID+j).style.display = "none" ;
                    }
                    this.className = cName;
                    document.getElementById(infoID+this.index).style.display = "block" ; 
                }
            }
        },
        /**
         * 创建loading
         * @param {String} id     loading创建在对应id的dom元素内容
         * @param {String} text   需要修改的文字
         * @param {String} state("success" | "false")  判断是否操作成功/失败，显示对应样式
         */
        loading: function(id, text, state){
            var str = '', 
                text = text ? text : "正在加载...",
                iconCls = 'loading-icon',
                obj = "body",
                loadCls = "loading";
            // 判断是否已经有loading
            var isload = document.getElementById("loading");
            if(isload){
                return;
            }
            if(id){
                obj = "#"+id;
                height = $(obj).height();
                loadCls = "loading-abs";
            }else{
                height = $(window).height();
            }
            if(state){
                iconCls = state === "success"? "loading-success" : "loading-false";
            }
            str += '<div id="loading" class="' + loadCls + '"><div class="loading-con"><div class="loading-img"><i class='+ iconCls +'></i></div>';
            str += '<p>' + text + '</p>';
            str += '</div></div>';
            $(obj).append(str);
            $("#loading").css("top", height/2-62);
            if(state){
                var _this = this;
                setTimeout(function(){
                    _this.removeLoading()
                },3000);
            }
        },
        /**
         * 删除loading
         */
        removeLoading: function(){
            $("#loading").remove();
        },
        //操作成功提示
        showSucTip:function(msg){
            msg = msg || "操作成功";
            this.loading(null,msg,"success");
        },
        //操作失败提示
        showErrTip:function(msg){
            msg = msg || "操作失败";
            this.loading(null,msg,"error");
        },
        /**
         * 全选、取消全选
         */
        checkToggle: function (allCheckboxName, checkboxName) {
            var o = document.getElementsByName(allCheckboxName);
            this.checkAll(checkboxName,o[0].checked);
        },
        /**
         * 全选
         */
        checkAll: function (checkboxName,state) {
            var o = document.getElementsByName(checkboxName);
            for (var i = 0, len = o.length; i < len; i++) {
                o[i].checked = state;
            }
        },
        /**
         * 修改tips里小箭头的位置, 指向对应的项
         * @param {Object} obj     点击的标签
         */
        changeTipsArrow: function (obj) {
            var left = $(obj).position().left;
            var width = $(obj).width();
            left = left + width/2;
            $(".tips-arrow").css("margin-left",left);
        },
        /**
         * 绑定开关控件的事件
         * @param {type} el 开关控件id
         * @param {type} callBack 切换状态的回调方法
         * @param {type} context 回调方法上下文对象
         * @returns {undefined}
         */
        initSwitch:function(el,callBack,context){
            $(el).off().bind("click",function(e){
                var $el = $(this);
                var data = {};
                if($el.hasClass("switch-off")){
                    $el.removeClass("switch-off").addClass("switch-on");
                    $el.find(".switch-text").text("开");
                    data = {
                        value:1,
                        text:"开"
                    };
                }else{
                    $el.removeClass("switch-on").addClass("switch-off");
                    $el.find(".switch-text").text("关");
                    data = {
                        value:0,
                        text:"关"
                    }
                }
                if(typeof callBack == "function"){
                    context = context || this;
                    callBack.call(context,data);
                }
            });
        },

        // 初始化计数控件
        initCount: function(el){
            var el = $("#"+el);
            var input = el.find("input").eq(0),
                up = el.find(".count-up").eq(0),
                down = el.find(".count-down").eq(0),
                reg = /^-?(0|[1-9]*\d*)(\.\d{1,2})?$/,  
                new_value = '',
                old_value = input.val();

            // 过滤输入的错误数据
            input.on("blur",function(){
                new_value = $(this).val(); 
                if($.trim(new_value)===''){
                    $(this).val(old_value);
                    return;
                }
                // 匹配格式是否正确
                if(!reg.test(new_value)){
                    // 去掉不合法的字符
                    new_value = $(this).val().replace(/[^-.\d]/g,"");
                    // 去掉第一个小数点之后多的小数点和数字
                    new_value = new_value.match(/^-?\d+(\.\d{1,2})?/)[0];
                    $(this).val(new_value);
                }
            });
            up.on("click",function(){
                countNum();
            });
            down.on("click",function(){
                countNum(true);
            });
            // 计算数字
            function countNum(bool){
                var add_num = bool ? -1 : 1;
                var input_val = input.val();
                if(input_val.indexOf(".") > 0){
                    var number_arr = input_val.split(".");
                    var num_0 = Number(number_arr[0]);
                    var count_val = (num_0 + add_num) + "." +number_arr[1];
                    input.val(count_val);
                }else{
                    var add_value = parseInt(input_val,10)+add_num;
                    input.val(add_value);
                }
            }
        },
        
        /**
         * 初始化控件
         */
        init: function (){
            this.bindEvent();
        },

        /**
         * 绑定事件
         */
        bindEvent: function (){
            $(function(){

                // 下拉框选择
                $(".js-select").on("click",function(e){
                    $(".select").removeClass("select-on"); 
                    //var text = $(this).find(".select-text");
                    $(this).parent().addClass("select-on");
                    e.stopPropagation();
                });
                $(".select-sub a").click(function(){
                    var input = $(this).parent().prev().find("input");
                    input.val($(this).text());
                    $(this).parent().parent().removeClass("select-on");
                });

                //点击桌面隐藏弹层
                $(document).click(function(e){
                    $(".select").removeClass("select-on"); 
                });

                //单选开关
                $(".switch").on("click",function(){
                    var text = $(this).find(".switch-text"),
                        cls = $(this).attr("class");
                    if(cls.indexOf("switch-on") > 0){
                        $(this).removeClass("switch-on").addClass("switch-off");
                        text.text("关");
                    }else{
                        $(this).removeClass("switch-off").addClass("switch-on");
                        text.text("开");
                    }
                });
            });
        }
    };