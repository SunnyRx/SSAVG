// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({

    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        text : '<color=#00ff00>Rich</c><color=#ff0000>Text</color>',
        RichtextBox :
        {
            default: null,
            type: cc.RichText
        }

    },


    // LIFE-CYCLE CALLBACKS:

    ctor:function()
    {
        this.curr = 0;  //记录当前显示文字序号
        this.tmpTextA = '';//用来储存一开始就显示在富文本上的内容
        this.tmpTextB = [];//用来储存打字机开始后要添加到富文本上的内容,结构为[[文字,位置]]
    },

    // onLoad () {},

    start () {
        cc.log('即将传入字符串：' + this.text);
        this.printText();
    },

    // update (dt) {},
    
    showText:function(text)
    {
        this.text = text;
        this.printText();
    },

    printText:function()
    {
        //先把富文本处理一番
        this.processText();

        this.curr = 0;
        if (this.tmpTextB.length)
            this.schedule(this.printNextChar,0.2);
        
    },

    //把富文本处理成两个部分
    processText:function()
    {
        //初始化
        this.tmpTextA = '';
        this.tmpTextB = [];
        
        let i = 0;
        let AorB = true;//为true时，内容记录到tmpTextB
        cc.log('即将处理字符串：' + this.text);
        while (i < this.text.length)
        {
            cc.log('当前处理字符：' + this.text[i]);
            if(this.text[i] == '<') //如果遇到<，接下来的内容（包括这个）都储存到tmpTextA
            {
                AorB = false;
            }
            if(AorB)
            {
                let tmp = [this.text[i],i];
                this.tmpTextB.push(tmp);
            }
            else
            {
                this.tmpTextA += this.text[i];
            }
            if(this.text[i] == '>')
            {
                AorB = true;
            }
            i++;
        };
        cc.log(this.tmpTextA);
        cc.log(this.tmpTextB);
        
    },

    printNextChar:function()
    {
        //暴力插入、拼接！
        this.tmpTextA = this.tmpTextA.substr(0,this.tmpTextB[this.curr][1]) + this.tmpTextB[this.curr][0] + this.tmpTextA.substr(this.tmpTextB[this.curr][1],this.tmpTextA.length-this.tmpTextB[this.curr][1]);
        this.RichtextBox.string = this.tmpTextA;
        this.curr++;
        if (this.curr > this.tmpTextB.length-1)
        {
            this.unschedule(this.printNextChar);
        }
    }
});
