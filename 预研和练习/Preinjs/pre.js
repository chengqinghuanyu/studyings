/***
    *
    *author:尹鹏孝
    *year:2017.10.17
    *descrip:前端js防止攻击
    *使用js面向对象组合模式
***/
;(function(window,document){
    //"use strict" //使用js严格模式检查，使语法更规范
    var Preinjs = function (obj,obj2){
        //建立关键词黑名单
        this.keywordBlackList = typeof obj == 'undefined' ? [] : obj;
        this.whiteList =  typeof obj == 'undefined' ? [] : obj2;
        this.vaersion = 1.0;
        this.init();
    }
    Preinjs.prototype = {
        contstructor:Preinjs,/*防止被覆盖*/
        init:function(){/**
            *插件执行
            **/
            this.resetDocumentWrite(window);
            this.installHook(window);
        },
        resetDocumentWrite:function(window){
            /*防止页面写入*/
            var old_write = window.document.write;
            var that = this;
            window.document.write = function(string) {
                if (that.blackListMatch(that.keywordBlackList, string)) {
                    console.log('拦截可疑模块:', string);
                    return;
                }
                // 调用原始接口
                old_write.apply(document, arguments);
            }
        },
        whileListMatch:function(whileList, value){
            /*白名单域名放行*/
             var length = whileList.length,
                 i = 0;
                for (var i=0; i < length; i++) {
                    // 建立白名单正则
                    var reg = new RegExp(whiteList[i], 'i');

                    // 存在白名单中，放行
                    if (reg.test(value)) {
                        return true;
                    }
                }
                return false;
        },
        blackListMatch:function(blackList, value){
                /**黑名单*/
            var length = blackList.length,
                i = 0;
                for (var i=0; i < length; i++) {
                    // 建立黑名单正则
                    var reg = new RegExp(blackList[i], 'i');

                    // 存在黑名单中，拦截
                    if (reg.test(value)) {
                        return true;
                    }
                }
                return false;
        },
        installHook:function(window){
            // 重写单个 window 窗口的 setAttribute 属性
            this.resetSetAttribute(window);
            var that = this;
            // MutationObserver 的不同兼容性写法
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

                // 该构造函数用来实例化一个新的 Mutation 观察者对象
            // Mutation 观察者对象能监听在某个范围内的 DOM 树变化
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                        // 返回被添加的节点,或者为null.
                        var nodes = mutation.addedNodes;
                        // 逐个遍历
                        for (var i = 0; i < nodes.length; i++) {
                            var node = nodes[i];
                            // 给生成的 iframe 里环境也装上重写的钩子
                            if (node.tagName == 'IFRAME') {
                                that.installHook(node.contentWindow);
                            }
                        }
                    });
                });

            observer.observe(document, {
                    subtree: true,
                    childList: true
                });
        },
        resetSetAttribute:function(window){
            // 保存原有接口
            var old_setAttribute = window.Element.prototype.setAttribute;
            var that = this;
            // 重写 setAttribute 接口
            window.Element.prototype.setAttribute = function(name, value) {
                // 匹配到 <script src='xxx' > 类型
                if (this.tagName == 'SCRIPT' && /^src$/i.test(name)) {
                    // 白名单匹配
                    if (!this.whileListMatch(this.whiteList, value)) {
                        console.log('拦截可疑模块:', value);
                        return;
                    }
                }
                // 调用原始接口
                old_setAttribute.apply(this, arguments);
            };
        }
    }
    // 锁住 call
    window.Object.defineProperty(Function.prototype, 'call', {
        value: Function.prototype.call,
        // 当且仅当仅当该属性的 writable 为 true 时，该属性才能被赋值运算符改变
        writable: false,
        // 当且仅当该属性的 configurable 为 true 时，该属性才能够被改变，也能够被删除
        configurable: false,
        enumerable: true
    });
    // 锁住 apply
    window.Object.defineProperty(Function.prototype, 'apply', {
        value: Function.prototype.apply,
        writable: false,
        configurable: false,
        enumerable: true
    });
    /****
    *支持模块化引入
    *
    */

    if(typeof module != 'undefined' && module.exports) {
      module.exports = Preinjs;
    }else if(typeof define == 'function' && define.amd) {
       define( function () { return Preinjs; } );
    }else{
       window.Preinjs = Preinjs;
    }

})(window,document);