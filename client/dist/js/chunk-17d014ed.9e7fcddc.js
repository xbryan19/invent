(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-17d014ed"],{"0fd9":function(t,e,n){"use strict";n("99af"),n("4160"),n("caad"),n("13d5"),n("4ec9"),n("b64b"),n("d3b7"),n("ac1f"),n("2532"),n("3ca3"),n("5319"),n("159b"),n("ddb0");var a=n("ade3"),i=n("5530"),s=(n("4b85"),n("2b0e")),r=n("d9f7"),o=n("80d2"),c=["sm","md","lg","xl"],l=["start","end","center"];function d(t,e){return c.reduce((function(n,a){return n[t+Object(o["E"])(a)]=e(),n}),{})}var u=function(t){return[].concat(l,["baseline","stretch"]).includes(t)},h=d("align",(function(){return{type:String,default:null,validator:u}})),f=function(t){return[].concat(l,["space-between","space-around"]).includes(t)},p=d("justify",(function(){return{type:String,default:null,validator:f}})),b=function(t){return[].concat(l,["space-between","space-around","stretch"]).includes(t)},v=d("alignContent",(function(){return{type:String,default:null,validator:b}})),g={align:Object.keys(h),justify:Object.keys(p),alignContent:Object.keys(v)},m={align:"align",justify:"justify",alignContent:"align-content"};function C(t,e,n){var a=m[t];if(null!=n){if(e){var i=e.replace(t,"");a+="-".concat(i)}return a+="-".concat(n),a.toLowerCase()}}var x=new Map;e["a"]=s["a"].extend({name:"v-row",functional:!0,props:Object(i["a"])(Object(i["a"])(Object(i["a"])({tag:{type:String,default:"div"},dense:Boolean,noGutters:Boolean,align:{type:String,default:null,validator:u}},h),{},{justify:{type:String,default:null,validator:f}},p),{},{alignContent:{type:String,default:null,validator:b}},v),render:function(t,e){var n=e.props,i=e.data,s=e.children,o="";for(var c in n)o+=String(n[c]);var l=x.get(o);return l||function(){var t,e;for(e in l=[],g)g[e].forEach((function(t){var a=n[t],i=C(e,t,a);i&&l.push(i)}));l.push((t={"no-gutters":n.noGutters,"row--dense":n.dense},Object(a["a"])(t,"align-".concat(n.align),n.align),Object(a["a"])(t,"justify-".concat(n.justify),n.justify),Object(a["a"])(t,"align-content-".concat(n.alignContent),n.alignContent),t)),x.set(o,l)}(),t(n.tag,Object(r["a"])(i,{staticClass:"row",class:l}),s)}})},"169a":function(t,e,n){"use strict";n("7db0"),n("caad"),n("45fc"),n("a9e3"),n("2532"),n("498a");var a=n("5530"),i=n("2909"),s=n("ade3"),r=(n("368e"),n("480e")),o=n("4ad4"),c=n("b848"),l=n("75eb"),d=n("e707"),u=n("e4d3"),h=n("21be"),f=n("f2e7"),p=n("a293"),b=n("58df"),v=n("d9bd"),g=n("80d2"),m=Object(b["a"])(o["a"],c["a"],l["a"],d["a"],u["a"],h["a"],f["a"]);e["a"]=m.extend({name:"v-dialog",directives:{ClickOutside:p["a"]},props:{dark:Boolean,disabled:Boolean,fullscreen:Boolean,light:Boolean,maxWidth:{type:[String,Number],default:"none"},noClickAnimation:Boolean,origin:{type:String,default:"center center"},persistent:Boolean,retainFocus:{type:Boolean,default:!0},scrollable:Boolean,transition:{type:[String,Boolean],default:"dialog-transition"},width:{type:[String,Number],default:"auto"}},data:function(){return{activatedBy:null,animate:!1,animateTimeout:-1,isActive:!!this.value,stackMinZIndex:200,previousActiveElement:null}},computed:{classes:function(){var t;return t={},Object(s["a"])(t,"v-dialog ".concat(this.contentClass).trim(),!0),Object(s["a"])(t,"v-dialog--active",this.isActive),Object(s["a"])(t,"v-dialog--persistent",this.persistent),Object(s["a"])(t,"v-dialog--fullscreen",this.fullscreen),Object(s["a"])(t,"v-dialog--scrollable",this.scrollable),Object(s["a"])(t,"v-dialog--animated",this.animate),t},contentClasses:function(){return{"v-dialog__content":!0,"v-dialog__content--active":this.isActive}},hasActivator:function(){return Boolean(!!this.$slots.activator||!!this.$scopedSlots.activator)}},watch:{isActive:function(t){var e;t?(this.show(),this.hideScroll()):(this.removeOverlay(),this.unbind(),null==(e=this.previousActiveElement)||e.focus())},fullscreen:function(t){this.isActive&&(t?(this.hideScroll(),this.removeOverlay(!1)):(this.showScroll(),this.genOverlay()))}},created:function(){this.$attrs.hasOwnProperty("full-width")&&Object(v["e"])("full-width",this)},beforeMount:function(){var t=this;this.$nextTick((function(){t.isBooted=t.isActive,t.isActive&&t.show()}))},beforeDestroy:function(){"undefined"!==typeof window&&this.unbind()},methods:{animateClick:function(){var t=this;this.animate=!1,this.$nextTick((function(){t.animate=!0,window.clearTimeout(t.animateTimeout),t.animateTimeout=window.setTimeout((function(){return t.animate=!1}),150)}))},closeConditional:function(t){var e=t.target;return!(this._isDestroyed||!this.isActive||this.$refs.content.contains(e)||this.overlay&&e&&!this.overlay.$el.contains(e))&&this.activeZIndex>=this.getMaxZIndex()},hideScroll:function(){this.fullscreen?document.documentElement.classList.add("overflow-y-hidden"):d["a"].options.methods.hideScroll.call(this)},show:function(){var t=this;!this.fullscreen&&!this.hideOverlay&&this.genOverlay(),this.$nextTick((function(){t.$nextTick((function(){t.previousActiveElement=document.activeElement,t.$refs.content.focus(),t.bind()}))}))},bind:function(){window.addEventListener("focusin",this.onFocusin)},unbind:function(){window.removeEventListener("focusin",this.onFocusin)},onClickOutside:function(t){this.$emit("click:outside",t),this.persistent?this.noClickAnimation||this.animateClick():this.isActive=!1},onKeydown:function(t){if(t.keyCode===g["x"].esc&&!this.getOpenDependents().length)if(this.persistent)this.noClickAnimation||this.animateClick();else{this.isActive=!1;var e=this.getActivator();this.$nextTick((function(){return e&&e.focus()}))}this.$emit("keydown",t)},onFocusin:function(t){if(t&&this.retainFocus){var e=t.target;if(e&&![document,this.$refs.content].includes(e)&&!this.$refs.content.contains(e)&&this.activeZIndex>=this.getMaxZIndex()&&!this.getOpenDependentElements().some((function(t){return t.contains(e)}))){var n=this.$refs.content.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),a=Object(i["a"])(n).find((function(t){return!t.hasAttribute("disabled")}));a&&a.focus()}}},genContent:function(){var t=this;return this.showLazyContent((function(){return[t.$createElement(r["a"],{props:{root:!0,light:t.light,dark:t.dark}},[t.$createElement("div",{class:t.contentClasses,attrs:Object(a["a"])({role:"document",tabindex:t.isActive?0:void 0},t.getScopeIdAttrs()),on:{keydown:t.onKeydown},style:{zIndex:t.activeZIndex},ref:"content"},[t.genTransition()])])]}))},genTransition:function(){var t=this.genInnerContent();return this.transition?this.$createElement("transition",{props:{name:this.transition,origin:this.origin,appear:!0}},[t]):t},genInnerContent:function(){var t={class:this.classes,ref:"dialog",directives:[{name:"click-outside",value:{handler:this.onClickOutside,closeConditional:this.closeConditional,include:this.getOpenDependentElements}},{name:"show",value:this.isActive}],style:{transformOrigin:this.origin}};return this.fullscreen||(t.style=Object(a["a"])(Object(a["a"])({},t.style),{},{maxWidth:"none"===this.maxWidth?void 0:Object(g["g"])(this.maxWidth),width:"auto"===this.width?void 0:Object(g["g"])(this.width)})),this.$createElement("div",t,this.getContentSlot())}},render:function(t){return t("div",{staticClass:"v-dialog__container",class:{"v-dialog__container--attached":""===this.attach||!0===this.attach||"attach"===this.attach},attrs:{role:"dialog"}},[this.genActivator(),this.genContent()])}})},"1f4f":function(t,e,n){"use strict";n("a9e3");var a=n("5530"),i=(n("8b37"),n("80d2")),s=n("7560"),r=n("58df");e["a"]=Object(r["a"])(s["a"]).extend({name:"v-simple-table",props:{dense:Boolean,fixedHeader:Boolean,height:[Number,String]},computed:{classes:function(){return Object(a["a"])({"v-data-table--dense":this.dense,"v-data-table--fixed-height":!!this.height&&!this.fixedHeader,"v-data-table--fixed-header":this.fixedHeader,"v-data-table--has-top":!!this.$slots.top,"v-data-table--has-bottom":!!this.$slots.bottom},this.themeClasses)}},methods:{genWrapper:function(){return this.$slots.wrapper||this.$createElement("div",{staticClass:"v-data-table__wrapper",style:{height:Object(i["g"])(this.height)}},[this.$createElement("table",this.$slots.default)])}},render:function(t){return t("div",{staticClass:"v-data-table",class:this.classes},[this.$slots.top,this.genWrapper(),this.$slots.bottom])}})},"368e":function(t,e,n){},"62ad":function(t,e,n){"use strict";n("4160"),n("caad"),n("13d5"),n("45fc"),n("4ec9"),n("a9e3"),n("b64b"),n("d3b7"),n("ac1f"),n("3ca3"),n("5319"),n("2ca0"),n("159b"),n("ddb0");var a=n("ade3"),i=n("5530"),s=(n("4b85"),n("2b0e")),r=n("d9f7"),o=n("80d2"),c=["sm","md","lg","xl"],l=function(){return c.reduce((function(t,e){return t[e]={type:[Boolean,String,Number],default:!1},t}),{})}(),d=function(){return c.reduce((function(t,e){return t["offset"+Object(o["E"])(e)]={type:[String,Number],default:null},t}),{})}(),u=function(){return c.reduce((function(t,e){return t["order"+Object(o["E"])(e)]={type:[String,Number],default:null},t}),{})}(),h={col:Object.keys(l),offset:Object.keys(d),order:Object.keys(u)};function f(t,e,n){var a=t;if(null!=n&&!1!==n){if(e){var i=e.replace(t,"");a+="-".concat(i)}return"col"!==t||""!==n&&!0!==n?(a+="-".concat(n),a.toLowerCase()):a.toLowerCase()}}var p=new Map;e["a"]=s["a"].extend({name:"v-col",functional:!0,props:Object(i["a"])(Object(i["a"])(Object(i["a"])(Object(i["a"])({cols:{type:[Boolean,String,Number],default:!1}},l),{},{offset:{type:[String,Number],default:null}},d),{},{order:{type:[String,Number],default:null}},u),{},{alignSelf:{type:String,default:null,validator:function(t){return["auto","start","end","center","baseline","stretch"].includes(t)}},tag:{type:String,default:"div"}}),render:function(t,e){var n=e.props,i=e.data,s=e.children,o=(e.parent,"");for(var c in n)o+=String(n[c]);var l=p.get(o);return l||function(){var t,e;for(e in l=[],h)h[e].forEach((function(t){var a=n[t],i=f(e,t,a);i&&l.push(i)}));var i=l.some((function(t){return t.startsWith("col-")}));l.push((t={col:!i||!n.cols},Object(a["a"])(t,"col-".concat(n.cols),n.cols),Object(a["a"])(t,"offset-".concat(n.offset),n.offset),Object(a["a"])(t,"order-".concat(n.order),n.order),Object(a["a"])(t,"align-self-".concat(n.alignSelf),n.alignSelf),t)),p.set(o,l)}(),t(n.tag,Object(r["a"])(i,{class:l}),s)}})},"636c":function(t,e,n){"use strict";n("be5c")},"8b37":function(t,e,n){},a523:function(t,e,n){"use strict";n("99af"),n("4de4"),n("b64b"),n("2ca0"),n("20f6"),n("4b85");var a=n("e8f2"),i=n("d9f7");e["a"]=Object(a["a"])("container").extend({name:"v-container",functional:!0,props:{id:String,tag:{type:String,default:"div"},fluid:{type:Boolean,default:!1}},render:function(t,e){var n,a=e.props,s=e.data,r=e.children,o=s.attrs;return o&&(s.attrs={},n=Object.keys(o).filter((function(t){if("slot"===t)return!1;var e=o[t];return t.startsWith("data-")?(s.attrs[t]=e,!1):e||"string"===typeof e}))),a.id&&(s.domProps=s.domProps||{},s.domProps.id=a.id),t(a.tag,Object(i["a"])(s,{staticClass:"container",class:Array({"container--fluid":a.fluid}).concat(n||[])}),r)}})},a774:function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-container",{attrs:{fluid:""}},[n("v-card",{attrs:{outlined:""}},[n("v-card-title",[n("small",[t._v(t._s(t.userInfo.employeeCode))]),n("v-spacer"),n("small",[t._v(t._s(t.userInfo.fullName))])],1),n("v-card-text",[n("v-row",[n("v-col",{attrs:{cols:"12",sm:"5",xs:"12"}},[n("v-text-field",{attrs:{label:"CONSTRUCTION CODE",outlined:"",dense:""},model:{value:t.constructionCode,callback:function(e){t.constructionCode=e},expression:"constructionCode"}})],1),n("v-col",{attrs:{cols:"12",sm:"2",xs:"12"}},[n("v-btn",{attrs:{dark:"",color:"primary"},on:{click:function(e){return t.searchItems()}}},[t._v("FIND")])],1)],1)],1)],1),n("v-row",[n("v-col",[n("v-card",{attrs:{outlined:""}},[n("v-card-text",[n("v-simple-table",{staticStyle:{border:"1px solid grey"},attrs:{height:"590"}},[n("thead",[n("tr",[n("th",{staticStyle:{"background-color":"rgb(0, 128, 128)"}}),n("th",{staticClass:"text-center",staticStyle:{"background-color":"rgb(0, 128, 128)"}},[n("span",{staticStyle:{color:"#FFFFFF"}},[t._v("NAME CD")])]),n("th",{staticClass:"text-center",staticStyle:{"background-color":"rgb(0, 128, 128)"}},[n("span",{staticStyle:{color:"#FFFFFF"}},[t._v("CONSTRUCTION CODE")])])])]),n("tbody",t._l(t.searchingData,(function(e,a){return n("tr",{key:a,on:{click:function(n){return t.exportHinban(e)}}},[null!=e.picker&&null!=e.isFinished?n("td",{staticClass:"text-center",staticStyle:{"background-color":"rgb(153, 204, 0)"}},[t._v(t._s(a+1))]):n("td",{staticClass:"text-center"},[t._v(t._s(a+1))]),null!=e.picker&&null!=e.isFinished?n("td",{staticClass:"text-center",staticStyle:{"background-color":"rgb(153, 204, 0)"}},[t._v(t._s(e.HOUSECD))]):n("td",{staticClass:"text-center"},[t._v(t._s(e.HOUSECD))]),null!=e.picker&&null!=e.isFinished?n("td",{staticClass:"text-center",staticStyle:{"background-color":"rgb(153, 204, 0)"}},[t._v(t._s(e.codeNo))]):n("td",{staticClass:"text-center"},[t._v(t._s(e.codeNo))])])})),0)])],1)],1)],1)],1),n("v-row",{attrs:{justify:"center"}},[n("v-dialog",{attrs:{persistent:"","max-width":"500px"},model:{value:t.hinbanModal,callback:function(e){t.hinbanModal=e},expression:"hinbanModal"}},[n("v-card",[n("v-card-text",[n("v-row",[n("h5",[t._v(t._s(t.userInfo.employeeCode))]),n("v-spacer"),n("h5",[t._v(t._s(t.userInfo.fullName))])],1),n("v-row",[n("p",{staticClass:"headline mx-auto"},[t._v(" CUSTOMER ")])]),n("v-row",[n("h3",[t._v(t._s(t.hinbanMother.HOUSECD))]),n("v-spacer"),n("h3",[t._v(t._s(t.hinbanMother.codeNo))])],1),n("v-card",{attrs:{outlined:""}},[n("v-card-text",[n("v-simple-table",{attrs:{"fixed-header":"",height:"300px"},scopedSlots:t._u([{key:"default",fn:function(){return[n("thead",[n("tr",[n("th",{staticClass:"text-center",attrs:{colspan:"2"}},[t._v("EXPORT HINBAN")])])]),n("tbody",t._l(t.hinbanMother.HINBAN,(function(e,a){return n("tr",{key:a,on:{click:function(n){return t.partsHinban(e)}}},[n("td",[t._v(t._s(a+1))]),n("td",[t._v(t._s(e.hinbanData))])])})),0)]},proxy:!0}])})],1)],1)],1),n("v-card-actions",[n("v-btn",{attrs:{dark:"",color:"error"},on:{click:function(e){t.hinbanModal=!1}}},[t._v("BACK")])],1)],1)],1)],1),n("v-row",{attrs:{justify:"center"}},[n("v-dialog",{attrs:{persistent:"","max-width":"600px"},model:{value:t.partsModal,callback:function(e){t.partsModal=e},expression:"partsModal"}},[n("v-card",[n("v-card-text",[n("v-row",[n("h5",[t._v(t._s(t.userInfo.employeeCode))]),n("v-spacer"),n("h5",[t._v(t._s(t.userInfo.fullName))])],1),n("v-row",[n("p",{staticClass:"headline mx-auto"},[t._v(" CUSTOMER ")])]),n("v-row",[n("h3",[t._v(t._s(t.hinbanMother.HOUSECD))]),n("v-spacer"),n("h3",[t._v(t._s(t.hinbanMother.codeNo))])],1),n("v-row",[n("v-col",[n("span",[t._v("EXPORT HINBAN")]),n("v-text-field",{attrs:{outlined:"",dense:"",disabled:""},model:{value:t.txtExportHinban,callback:function(e){t.txtExportHinban=e},expression:"txtExportHinban"}})],1)],1),n("v-card",{attrs:{outlined:""}},[n("v-simple-table",{attrs:{"fixed-header":"",height:"300px"},scopedSlots:t._u([{key:"default",fn:function(){return[n("thead",[n("tr",[n("th",{staticClass:"text-center",attrs:{colspan:"2"}},[t._v("ITEM PARTS")]),n("th",{staticClass:"text-center"},[t._v("QTY")]),n("th",{staticClass:"text-center"},[t._v("RACK")]),n("th",{staticClass:"text-center"},[t._v("CABINET")]),n("th",{staticClass:"text-center"},[t._v("ACTION")])])]),n("tbody",t._l(t.parts,(function(e,a){return n("tr",{key:a},[n("td",[t._v(t._s(a+1))]),n("td",[t._v(t._s(e.HinbanPartCode))]),n("td",{staticClass:"text-center"},[t._v(t._s(e.TotalOrders))]),n("td",{staticClass:"text-center"},[t._v(t._s(e.RackCode))]),n("td",{staticClass:"text-center"},[t._v(t._s(e.CabinetCode))]),null!=e.isFinished?n("td",[n("v-btn",{attrs:{dense:"",color:"primary",disabled:""}},[t._v("PICK")])],1):n("td",[n("v-btn",{attrs:{dense:"",color:"primary"},on:{click:function(n){t.parte=e.HinbanPartCode,t.parteQty=e.TotalOrders,t.pickStatus=1,t.pickQuestion=!0}}},[t._v("PICK")])],1)])})),0)]},proxy:!0}])})],1)],1),n("v-card-actions",[n("v-btn",{attrs:{dense:"",color:"error"},on:{click:function(e){t.partsModal=!1,t.hinbanModal=!0}}},[t._v("BACK")]),n("v-spacer"),n("v-btn",{attrs:{dense:"",color:"primary",disabled:t.dsbldShowQR},on:{click:function(e){return t.showQR()}}},[t._v("SHOW QR CODE")]),n("v-btn",{attrs:{dense:"",color:"primary",disabled:t.dsbldComplete},on:{click:function(e){t.pickStatus=0,t.pickQuestion=!0}}},[t._v("COMPLETE")])],1)],1)],1)],1),n("v-row",{attrs:{justify:"center"}},[n("v-dialog",{attrs:{"max-width":"250"},model:{value:t.qrModal,callback:function(e){t.qrModal=e},expression:"qrModal"}},[n("v-card",[n("v-card-title"),n("v-card-text",[n("qr-code",{attrs:{text:t.qrText,size:t.qrSize,color:"black","bg-color":"white","error-level":"L"},on:{decode:function(e){return t.scan()}}})],1),n("v-card-actions")],1)],1)],1),n("v-row",{attrs:{justify:"center"}},[n("v-dialog",{attrs:{persistent:"","max-width":"290"},model:{value:t.pickQuestion,callback:function(e){t.pickQuestion=e},expression:"pickQuestion"}},[n("v-card",[n("v-card-title"),n("v-card-text",[1==t.pickStatus?n("p",{staticClass:"subtitle-1 font-weight-medium"},[t._v("Pick Item?")]):n("p",{staticClass:"subtitle-1 font-weight-medium"},[t._v("Pick All Items?")])]),n("v-card-actions",[n("v-spacer"),n("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:function(e){t.pickQuestion=!1}}},[t._v("CANCEL")]),0==t.pickStatus?n("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:function(e){return t.finished()}}},[t._v("OK")]):n("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:function(e){return t.finishedOne()}}},[t._v("OK")])],1)],1)],1)],1)],1)},i=[],s=(n("4de4"),n("bc3a")),r=n.n(s),o={data:function(){return{disband:0,dsbldTrap:0,dsbldComplete:!1,qrModal:!1,locationModal:!1,hinbanModal:!1,partsModal:!1,date:(new Date).toISOString().substr(0,10),constructionCode:"",searchingData:[],menu:!1,modal:!1,menu2:!1,pickQuestion:!1,assignedItems:[],hinbanMother:[],hinbanParts:[],txtExportHinban:"",txtExportHinbanA:"",year:"",week:"",parts:[],parte:"",parteQty:"",qrSize:200,qrText:"",qrText1:[],qrAllParts:"",pickStatus:"",focus:!1,trapCount:0,trappings:[],dsbldShowQR:!1,notificationSystem:{options:{success:{position:"bottomRight"},error:{position:"bottomRight"},info:{position:"bottomLeft"}}}}},created:function(){this.qrAllParts=this.qrText,this.date=null,this.getAssignItems(),this.trap()},methods:{scan:function(){console.log("test")},getAssignItems:function(){var t=this;r.a.post("".concat(this.url,"getAssignItems"),{pickerID:this.userInfo.employeeCode}).then((function(e){t.assignedItems=e.data,t.searchingData=t.assignedItems}))},exportHinban:function(t){this.hinbanMother=t,this.hinbanModal=!0},partsHinban:function(t){var e=this;this.dsbldTrap=0,this.hinbanParts=t,this.week=this.hinbanParts.week,this.year=this.hinbanParts.year,this.txtExportHinbanA=this.hinbanParts.hinban,this.txtExportHinban=this.hinbanParts.hinbanData,r.a.post("".concat(this.url,"pickerGetHinbanParts"),{motherHinban:this.txtExportHinban,customerCode:this.hinbanMother.codeNo}).then((function(t){e.parts=t.data,e.hinbanModal=!1;for(var n=0;n<e.parts.length;n++)null==e.parts[n].isFinished&&(e.dsbldTrap=1);0==e.dsbldTrap?e.dsbldComplete=!0:e.dsbldComplete=!1,0==e.parts.length?e.dsbldShowQR=!0:e.dsbldShowQR=!1,e.partsModal=!0}))},refreshParts:function(){var t=this;r.a.post("".concat(this.url,"pickerGetHinbanParts"),{motherHinban:this.txtExportHinban,customerCode:this.hinbanMother.codeNo}).then((function(e){t.parts=e.data,t.hinbanModal=!1;for(var n=0;n<t.parts.length;n++)null==t.parts[n].isFinished&&(t.dsbldTrap=1);0==t.dsbldTrap?t.dsbldComplete=!0:t.dsbldComplete=!1,0==t.parts.length?t.dsbldShowQR=!0:t.dsbldShowQR=!1,t.disbanded()}))},finished:function(){var t=this;r.a.post("".concat(this.url,"finishedOrder"),{week:this.week,year:this.year,houseCode:this.hinbanMother.HOUSECD,customerCode:this.hinbanMother.codeNo,hinban:this.txtExportHinbanA,motherHinban:this.txtExportHinban,itemParts:this.parts,finishedHinban:this.hinbanMother.HINBAN,picker:this.userInfo.employeeCode}).then((function(e){"error"!=e.data?(t.trap(),setTimeout((function(){t.qrText="";for(var e=0;e<t.parts.length;e++)""==t.qrText?t.qrText+=t.parts[e].HinbanPartCode:t.qrText+=","+t.parts[e].HinbanPartCode;for(var n=0;n<t.trappings.length;n++){var a=t.trappings[n].CustomerCode,i=t.trappings[n].HINBAN;if(a==t.hinbanMother.codeNo)for(var s=0;s<i.length;s++)for(var o=0;o<t.parts.length;o++)i[s].ExportHinbanCode==t.txtExportHinban&&i[s].HinbanPartCode==t.parts[o].HinbanPartCode&&(i[s].isFinished=1)}t.trapCount=0;for(var c=0;c<t.trappings.length;c++){t.trap();var l=t.trappings[c].CustomerCode,d=t.trappings[c].HINBAN;if(t.hinbanMother.codeNo==l)for(var u=0;u<d.length;u++)t.trap(),null==d[u].isFinished&&(t.trapCount=1),t.trap()}t.$toast.success("ITEM COMPLETED","Success!!",t.notificationSystem.options.success),t.pickQuestion=!1,0==t.trapCount&&r.a.post("".concat(t.url,"finishedStatus"),{week:t.week,year:t.year,houseCode:t.hinbanMother.HOUSECD,customerCode:t.hinbanMother.codeNo,hinban:t.txtExportHinban,trapCount:t.trapCount,finishedHinban:t.hinbanMother.HINBAN,picker:t.userInfo.employeeCode}).then((function(e){t.dsbldComplete=!0,t.$toast.success("ALL ITEMS COMPLETED","Success!!",t.notificationSystem.options.success),setTimeout((function(){t.getAssignItems()}),100)}))}))):console.log("error"),t.refreshParts()})),this.getAssignItems()},finishedOne:function(){var t=this;r.a.post("".concat(this.url,"finishedOne"),{week:this.week,year:this.year,houseCode:this.hinbanMother.HOUSECD,customerCode:this.hinbanMother.codeNo,hinban:this.txtExportHinbanA,motherHinban:this.txtExportHinban,itemParts:this.parte,itemQty:this.parteQty,finishedHinban:this.hinbanMother.HINBAN,picker:this.userInfo.employeeCode}).then((function(e){"error"!=e.data?(t.trap(),setTimeout((function(){for(var e=0;e<t.trappings.length;e++){var n=t.trappings[e].CustomerCode,a=t.trappings[e].HINBAN;if(n==t.hinbanMother.codeNo)for(var i=0;i<a.length;i++)a[i].ExportHinbanCode==t.txtExportHinban&&a[i].HinbanPartCode==t.parte&&(a[i].isFinished=1)}t.trapCount=0;for(var s=0;s<t.trappings.length;s++){t.trap();var o=t.trappings[s].CustomerCode,c=t.trappings[s].HINBAN;if(t.hinbanMother.codeNo==o)for(var l=0;l<c.length;l++)t.trap(),null==c[l].isFinished&&(t.trapCount=1),t.trap()}t.$toast.success("ITEM COMPLETED","Success!!",t.notificationSystem.options.success),t.pickQuestion=!1,0==t.trapCount&&r.a.post("".concat(t.url,"finishedStatus"),{week:t.week,year:t.year,houseCode:t.hinbanMother.HOUSECD,customerCode:t.hinbanMother.codeNo,hinban:t.txtExportHinban,trapCount:t.trapCount,finishedHinban:t.hinbanMother.HINBAN,picker:t.userInfo.employeeCode}).then((function(e){t.dsbldComplete=!0,t.$toast.success("ALL ITEMS COMPLETED","Success!!",t.notificationSystem.options.success),setTimeout((function(){t.getAssignItems()}),100)}))}))):console.log("error"),t.refreshParts()})),this.getAssignItems()},showQR:function(){this.qrText="",this.qrAllParts="";for(var t=0;t<this.parts.length;t++)""==this.qrText?this.qrText+=this.parts[t].HinbanPartCode:this.qrText+=","+this.parts[t].HinbanPartCode;for(var e=0;e<this.parts.length;e++)this.qrText1.push({name:this.parts[e].HinbanPartCode});console.log(this.qrText1),this.qrModal=!0},trap:function(){var t=this;r.a.get("".concat(this.url,"trappingFinish")).then((function(e){t.trappings=e.data}))},searchItems:function(){var t=this;this.searchingData=[],this.searchingData=this.assignedItems.filter((function(e){return""==t.constructionCode||t.constructionCode==e.codeNo?e:void 0}))},disbanded:function(){this.disband=0;for(var t=0;t<this.trappings.length;t++)for(var e=this.trappings[t].HINBAN,n=0;n<e.length;n++)for(var a=0;a<this.parts.length;a++)e[n].ExportHinbanCode==this.txtExportHinban&&e[n].HinbanPartCode==this.parts[a].HinbanPartCode&&null==this.parts[a].isFinished&&(this.disband=1);0==this.disband&&(this.dsbldComplete=!0)}}},c=o,l=(n("636c"),n("2877")),d=n("6544"),u=n.n(d),h=n("8336"),f=n("b0af"),p=n("99d9"),b=n("62ad"),v=n("a523"),g=n("169a"),m=n("0fd9"),C=n("1f4f"),x=n("2fa4"),y=n("8654"),k=Object(l["a"])(c,a,i,!1,null,null,null);e["default"]=k.exports;u()(k,{VBtn:h["a"],VCard:f["a"],VCardActions:p["a"],VCardText:p["b"],VCardTitle:p["c"],VCol:b["a"],VContainer:v["a"],VDialog:g["a"],VRow:m["a"],VSimpleTable:C["a"],VSpacer:x["a"],VTextField:y["a"]})},be5c:function(t,e,n){},e8f2:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));n("99af"),n("4de4"),n("a15b"),n("b64b"),n("2ca0"),n("498a");var a=n("2b0e");function i(t){return a["a"].extend({name:"v-".concat(t),functional:!0,props:{id:String,tag:{type:String,default:"div"}},render:function(e,n){var a=n.props,i=n.data,s=n.children;i.staticClass="".concat(t," ").concat(i.staticClass||"").trim();var r=i.attrs;if(r){i.attrs={};var o=Object.keys(r).filter((function(t){if("slot"===t)return!1;var e=r[t];return t.startsWith("data-")?(i.attrs[t]=e,!1):e||"string"===typeof e}));o.length&&(i.staticClass+=" ".concat(o.join(" ")))}return a.id&&(i.domProps=i.domProps||{},i.domProps.id=a.id),e(a.tag,i,s)}})}}}]);
//# sourceMappingURL=chunk-17d014ed.9e7fcddc.js.map