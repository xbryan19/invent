(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3c03a271"],{"0fd9":function(t,e,a){"use strict";a("99af"),a("4160"),a("caad"),a("13d5"),a("4ec9"),a("b64b"),a("d3b7"),a("ac1f"),a("2532"),a("3ca3"),a("5319"),a("159b"),a("ddb0");var n=a("ade3"),i=a("5530"),r=(a("4b85"),a("2b0e")),s=a("d9f7"),o=a("80d2"),l=["sm","md","lg","xl"],c=["start","end","center"];function u(t,e){return l.reduce((function(a,n){return a[t+Object(o["E"])(n)]=e(),a}),{})}var d=function(t){return[].concat(c,["baseline","stretch"]).includes(t)},p=u("align",(function(){return{type:String,default:null,validator:d}})),h=function(t){return[].concat(c,["space-between","space-around"]).includes(t)},v=u("justify",(function(){return{type:String,default:null,validator:h}})),f=function(t){return[].concat(c,["space-between","space-around","stretch"]).includes(t)},g=u("alignContent",(function(){return{type:String,default:null,validator:f}})),b={align:Object.keys(p),justify:Object.keys(v),alignContent:Object.keys(g)},m={align:"align",justify:"justify",alignContent:"align-content"};function y(t,e,a){var n=m[t];if(null!=a){if(e){var i=e.replace(t,"");n+="-".concat(i)}return n+="-".concat(a),n.toLowerCase()}}var x=new Map;e["a"]=r["a"].extend({name:"v-row",functional:!0,props:Object(i["a"])(Object(i["a"])(Object(i["a"])({tag:{type:String,default:"div"},dense:Boolean,noGutters:Boolean,align:{type:String,default:null,validator:d}},p),{},{justify:{type:String,default:null,validator:h}},v),{},{alignContent:{type:String,default:null,validator:f}},g),render:function(t,e){var a=e.props,i=e.data,r=e.children,o="";for(var l in a)o+=String(a[l]);var c=x.get(o);return c||function(){var t,e;for(e in c=[],b)b[e].forEach((function(t){var n=a[t],i=y(e,t,n);i&&c.push(i)}));c.push((t={"no-gutters":a.noGutters,"row--dense":a.dense},Object(n["a"])(t,"align-".concat(a.align),a.align),Object(n["a"])(t,"justify-".concat(a.justify),a.justify),Object(n["a"])(t,"align-content-".concat(a.alignContent),a.alignContent),t)),x.set(o,c)}(),t(a.tag,Object(s["a"])(i,{staticClass:"row",class:c}),r)}})},"169a":function(t,e,a){"use strict";a("7db0"),a("caad"),a("45fc"),a("a9e3"),a("2532"),a("498a");var n=a("5530"),i=a("2909"),r=a("ade3"),s=(a("368e"),a("480e")),o=a("4ad4"),l=a("b848"),c=a("75eb"),u=a("e707"),d=a("e4d3"),p=a("21be"),h=a("f2e7"),v=a("a293"),f=a("58df"),g=a("d9bd"),b=a("80d2"),m=Object(f["a"])(o["a"],l["a"],c["a"],u["a"],d["a"],p["a"],h["a"]);e["a"]=m.extend({name:"v-dialog",directives:{ClickOutside:v["a"]},props:{dark:Boolean,disabled:Boolean,fullscreen:Boolean,light:Boolean,maxWidth:{type:[String,Number],default:"none"},noClickAnimation:Boolean,origin:{type:String,default:"center center"},persistent:Boolean,retainFocus:{type:Boolean,default:!0},scrollable:Boolean,transition:{type:[String,Boolean],default:"dialog-transition"},width:{type:[String,Number],default:"auto"}},data:function(){return{activatedBy:null,animate:!1,animateTimeout:-1,isActive:!!this.value,stackMinZIndex:200,previousActiveElement:null}},computed:{classes:function(){var t;return t={},Object(r["a"])(t,"v-dialog ".concat(this.contentClass).trim(),!0),Object(r["a"])(t,"v-dialog--active",this.isActive),Object(r["a"])(t,"v-dialog--persistent",this.persistent),Object(r["a"])(t,"v-dialog--fullscreen",this.fullscreen),Object(r["a"])(t,"v-dialog--scrollable",this.scrollable),Object(r["a"])(t,"v-dialog--animated",this.animate),t},contentClasses:function(){return{"v-dialog__content":!0,"v-dialog__content--active":this.isActive}},hasActivator:function(){return Boolean(!!this.$slots.activator||!!this.$scopedSlots.activator)}},watch:{isActive:function(t){var e;t?(this.show(),this.hideScroll()):(this.removeOverlay(),this.unbind(),null==(e=this.previousActiveElement)||e.focus())},fullscreen:function(t){this.isActive&&(t?(this.hideScroll(),this.removeOverlay(!1)):(this.showScroll(),this.genOverlay()))}},created:function(){this.$attrs.hasOwnProperty("full-width")&&Object(g["e"])("full-width",this)},beforeMount:function(){var t=this;this.$nextTick((function(){t.isBooted=t.isActive,t.isActive&&t.show()}))},beforeDestroy:function(){"undefined"!==typeof window&&this.unbind()},methods:{animateClick:function(){var t=this;this.animate=!1,this.$nextTick((function(){t.animate=!0,window.clearTimeout(t.animateTimeout),t.animateTimeout=window.setTimeout((function(){return t.animate=!1}),150)}))},closeConditional:function(t){var e=t.target;return!(this._isDestroyed||!this.isActive||this.$refs.content.contains(e)||this.overlay&&e&&!this.overlay.$el.contains(e))&&this.activeZIndex>=this.getMaxZIndex()},hideScroll:function(){this.fullscreen?document.documentElement.classList.add("overflow-y-hidden"):u["a"].options.methods.hideScroll.call(this)},show:function(){var t=this;!this.fullscreen&&!this.hideOverlay&&this.genOverlay(),this.$nextTick((function(){t.$nextTick((function(){t.previousActiveElement=document.activeElement,t.$refs.content.focus(),t.bind()}))}))},bind:function(){window.addEventListener("focusin",this.onFocusin)},unbind:function(){window.removeEventListener("focusin",this.onFocusin)},onClickOutside:function(t){this.$emit("click:outside",t),this.persistent?this.noClickAnimation||this.animateClick():this.isActive=!1},onKeydown:function(t){if(t.keyCode===b["x"].esc&&!this.getOpenDependents().length)if(this.persistent)this.noClickAnimation||this.animateClick();else{this.isActive=!1;var e=this.getActivator();this.$nextTick((function(){return e&&e.focus()}))}this.$emit("keydown",t)},onFocusin:function(t){if(t&&this.retainFocus){var e=t.target;if(e&&![document,this.$refs.content].includes(e)&&!this.$refs.content.contains(e)&&this.activeZIndex>=this.getMaxZIndex()&&!this.getOpenDependentElements().some((function(t){return t.contains(e)}))){var a=this.$refs.content.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),n=Object(i["a"])(a).find((function(t){return!t.hasAttribute("disabled")}));n&&n.focus()}}},genContent:function(){var t=this;return this.showLazyContent((function(){return[t.$createElement(s["a"],{props:{root:!0,light:t.light,dark:t.dark}},[t.$createElement("div",{class:t.contentClasses,attrs:Object(n["a"])({role:"document",tabindex:t.isActive?0:void 0},t.getScopeIdAttrs()),on:{keydown:t.onKeydown},style:{zIndex:t.activeZIndex},ref:"content"},[t.genTransition()])])]}))},genTransition:function(){var t=this.genInnerContent();return this.transition?this.$createElement("transition",{props:{name:this.transition,origin:this.origin,appear:!0}},[t]):t},genInnerContent:function(){var t={class:this.classes,ref:"dialog",directives:[{name:"click-outside",value:{handler:this.onClickOutside,closeConditional:this.closeConditional,include:this.getOpenDependentElements}},{name:"show",value:this.isActive}],style:{transformOrigin:this.origin}};return this.fullscreen||(t.style=Object(n["a"])(Object(n["a"])({},t.style),{},{maxWidth:"none"===this.maxWidth?void 0:Object(b["g"])(this.maxWidth),width:"auto"===this.width?void 0:Object(b["g"])(this.width)})),this.$createElement("div",t,this.getContentSlot())}},render:function(t){return t("div",{staticClass:"v-dialog__container",class:{"v-dialog__container--attached":""===this.attach||!0===this.attach||"attach"===this.attach},attrs:{role:"dialog"}},[this.genActivator(),this.genContent()])}})},"17b3":function(t,e,a){},"1f4f":function(t,e,a){"use strict";a("a9e3");var n=a("5530"),i=(a("8b37"),a("80d2")),r=a("7560"),s=a("58df");e["a"]=Object(s["a"])(r["a"]).extend({name:"v-simple-table",props:{dense:Boolean,fixedHeader:Boolean,height:[Number,String]},computed:{classes:function(){return Object(n["a"])({"v-data-table--dense":this.dense,"v-data-table--fixed-height":!!this.height&&!this.fixedHeader,"v-data-table--fixed-header":this.fixedHeader,"v-data-table--has-top":!!this.$slots.top,"v-data-table--has-bottom":!!this.$slots.bottom},this.themeClasses)}},methods:{genWrapper:function(){return this.$slots.wrapper||this.$createElement("div",{staticClass:"v-data-table__wrapper",style:{height:Object(i["g"])(this.height)}},[this.$createElement("table",this.$slots.default)])}},render:function(t){return t("div",{staticClass:"v-data-table",class:this.classes},[this.$slots.top,this.genWrapper(),this.$slots.bottom])}})},"210b":function(t,e,a){},"368e":function(t,e,a){},"62ad":function(t,e,a){"use strict";a("4160"),a("caad"),a("13d5"),a("45fc"),a("4ec9"),a("a9e3"),a("b64b"),a("d3b7"),a("ac1f"),a("3ca3"),a("5319"),a("2ca0"),a("159b"),a("ddb0");var n=a("ade3"),i=a("5530"),r=(a("4b85"),a("2b0e")),s=a("d9f7"),o=a("80d2"),l=["sm","md","lg","xl"],c=function(){return l.reduce((function(t,e){return t[e]={type:[Boolean,String,Number],default:!1},t}),{})}(),u=function(){return l.reduce((function(t,e){return t["offset"+Object(o["E"])(e)]={type:[String,Number],default:null},t}),{})}(),d=function(){return l.reduce((function(t,e){return t["order"+Object(o["E"])(e)]={type:[String,Number],default:null},t}),{})}(),p={col:Object.keys(c),offset:Object.keys(u),order:Object.keys(d)};function h(t,e,a){var n=t;if(null!=a&&!1!==a){if(e){var i=e.replace(t,"");n+="-".concat(i)}return"col"!==t||""!==a&&!0!==a?(n+="-".concat(a),n.toLowerCase()):n.toLowerCase()}}var v=new Map;e["a"]=r["a"].extend({name:"v-col",functional:!0,props:Object(i["a"])(Object(i["a"])(Object(i["a"])(Object(i["a"])({cols:{type:[Boolean,String,Number],default:!1}},c),{},{offset:{type:[String,Number],default:null}},u),{},{order:{type:[String,Number],default:null}},d),{},{alignSelf:{type:String,default:null,validator:function(t){return["auto","start","end","center","baseline","stretch"].includes(t)}},tag:{type:String,default:"div"}}),render:function(t,e){var a=e.props,i=e.data,r=e.children,o=(e.parent,"");for(var l in a)o+=String(a[l]);var c=v.get(o);return c||function(){var t,e;for(e in c=[],p)p[e].forEach((function(t){var n=a[t],i=h(e,t,n);i&&c.push(i)}));var i=c.some((function(t){return t.startsWith("col-")}));c.push((t={col:!i||!a.cols},Object(n["a"])(t,"col-".concat(a.cols),a.cols),Object(n["a"])(t,"offset-".concat(a.offset),a.offset),Object(n["a"])(t,"order-".concat(a.order),a.order),Object(n["a"])(t,"align-self-".concat(a.alignSelf),a.alignSelf),t)),v.set(o,c)}(),t(a.tag,Object(s["a"])(i,{class:c}),r)}})},"891e":function(t,e,a){"use strict";a("99af"),a("d81d"),a("a9e3"),a("d3b7"),a("25f0");var n=a("2909"),i=a("5530"),r=(a("17b3"),a("9d26")),s=a("dc22"),o=a("a9ad"),l=a("de2c"),c=a("7560"),u=a("58df");e["a"]=Object(u["a"])(o["a"],Object(l["a"])({onVisible:["init"]}),c["a"]).extend({name:"v-pagination",directives:{Resize:s["a"]},props:{circle:Boolean,disabled:Boolean,length:{type:Number,default:0,validator:function(t){return t%1===0}},nextIcon:{type:String,default:"$next"},prevIcon:{type:String,default:"$prev"},totalVisible:[Number,String],value:{type:Number,default:0},pageAriaLabel:{type:String,default:"$vuetify.pagination.ariaLabel.page"},currentPageAriaLabel:{type:String,default:"$vuetify.pagination.ariaLabel.currentPage"},previousAriaLabel:{type:String,default:"$vuetify.pagination.ariaLabel.previous"},nextAriaLabel:{type:String,default:"$vuetify.pagination.ariaLabel.next"},wrapperAriaLabel:{type:String,default:"$vuetify.pagination.ariaLabel.wrapper"}},data:function(){return{maxButtons:0,selected:null}},computed:{classes:function(){return Object(i["a"])({"v-pagination":!0,"v-pagination--circle":this.circle,"v-pagination--disabled":this.disabled},this.themeClasses)},items:function(){var t=parseInt(this.totalVisible,10);if(0===t)return[];var e=Math.min(Math.max(0,t)||this.length,Math.max(0,this.maxButtons)||this.length,this.length);if(this.length<=e)return this.range(1,this.length);var a=e%2===0?1:0,i=Math.floor(e/2),r=this.length-i+1+a;if(this.value>i&&this.value<r){var s=this.value-i+2,o=this.value+i-2-a;return[1,"..."].concat(Object(n["a"])(this.range(s,o)),["...",this.length])}if(this.value===i){var l=this.value+i-1-a;return[].concat(Object(n["a"])(this.range(1,l)),["...",this.length])}if(this.value===r){var c=this.value-i+1;return[1,"..."].concat(Object(n["a"])(this.range(c,this.length)))}return[].concat(Object(n["a"])(this.range(1,i)),["..."],Object(n["a"])(this.range(r,this.length)))}},watch:{value:function(){this.init()}},mounted:function(){this.init()},methods:{init:function(){var t=this;this.selected=null,this.$nextTick(this.onResize),setTimeout((function(){return t.selected=t.value}),100)},onResize:function(){var t=this.$el&&this.$el.parentElement?this.$el.parentElement.clientWidth:window.innerWidth;this.maxButtons=Math.floor((t-96)/42)},next:function(t){t.preventDefault(),this.$emit("input",this.value+1),this.$emit("next")},previous:function(t){t.preventDefault(),this.$emit("input",this.value-1),this.$emit("previous")},range:function(t,e){var a=[];t=t>0?t:1;for(var n=t;n<=e;n++)a.push(n);return a},genIcon:function(t,e,a,n,i){return t("li",[t("button",{staticClass:"v-pagination__navigation",class:{"v-pagination__navigation--disabled":a},attrs:{type:"button","aria-label":i},on:a?{}:{click:n}},[t(r["a"],[e])])])},genItem:function(t,e){var a=this,n=e===this.value&&(this.color||"primary"),i=e===this.value,r=i?this.currentPageAriaLabel:this.pageAriaLabel;return t("button",this.setBackgroundColor(n,{staticClass:"v-pagination__item",class:{"v-pagination__item--active":e===this.value},attrs:{type:"button","aria-current":i,"aria-label":this.$vuetify.lang.t(r,e)},on:{click:function(){return a.$emit("input",e)}}}),[e.toString()])},genItems:function(t){var e=this;return this.items.map((function(a,n){return t("li",{key:n},[isNaN(Number(a))?t("span",{class:"v-pagination__more"},[a.toString()]):e.genItem(t,a)])}))},genList:function(t,e){return t("ul",{directives:[{modifiers:{quiet:!0},name:"resize",value:this.onResize}],class:this.classes},e)}},render:function(t){var e=[this.genIcon(t,this.$vuetify.rtl?this.nextIcon:this.prevIcon,this.value<=1,this.previous,this.$vuetify.lang.t(this.previousAriaLabel)),this.genItems(t),this.genIcon(t,this.$vuetify.rtl?this.prevIcon:this.nextIcon,this.value>=this.length,this.next,this.$vuetify.lang.t(this.nextAriaLabel))];return t("nav",{attrs:{role:"navigation","aria-label":this.$vuetify.lang.t(this.wrapperAriaLabel)}},[this.genList(t,e)])}})},"8b37":function(t,e,a){},"8cd0":function(t,e,a){},c1db:function(t,e,a){},f40d:function(t,e,a){"use strict";var n=a("2b0e");e["a"]=n["a"].extend({name:"transitionable",props:{mode:String,origin:String,transition:String}})},f416:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",[a("div",{staticClass:"steady"},[a("v-card",{attrs:{outlined:""}},[a("v-card-text",[a("v-row",{attrs:{dense:""}},[a("v-col",{attrs:{cols:"12",lg:"4",md:"4",sm:"12"}},[a("v-select",{staticClass:"txtboxHead",attrs:{dense:"",outlined:"",label:"FILTER BY","prepend-inner-icon":"mdi-filter",items:t.sort,"item-value":"id","item-text":"name"},model:{value:t.filterValue,callback:function(e){t.filterValue=e},expression:"filterValue"}})],1),a("v-col",{attrs:{cols:"12",lg:"4",md:"4",sm:"12"}},[a("v-text-field",{staticClass:"txtboxHead",attrs:{dense:"","x-small":"","append-icon":"mdi-magnify",label:t.labelCondition,outlined:""},model:{value:t.serKeyGroup,callback:function(e){t.serKeyGroup=e},expression:"serKeyGroup"}})],1),a("v-col",{attrs:{cols:"12",lg:"2",md:"2",sm:"12"}},[a("v-btn",{staticClass:"txtboxHead btnHead",attrs:{dark:"",color:"primary"},on:{click:function(e){return t.searchFilterGroup()}}},[a("v-icon",{attrs:{left:""}},[t._v("mdi-card-search-outline")]),t._v("SEARCH ")],1)],1),a("v-col",{attrs:{cols:"12",lg:"2",md:"2",sm:"12"}},[a("v-btn",{staticClass:"txtboxHead btnHead",attrs:{dark:"",color:"primary"},on:{click:function(e){return t.refresh()}}},[a("v-icon",{attrs:{left:""}},[t._v("mdi-database-refresh-outline")]),t._v("REFRESH ")],1)],1)],1)],1)],1),a("v-card",{attrs:{outlined:""}},[a("v-card-text",[a("v-row",{attrs:{dense:""}},[a("v-col",{attrs:{cols:"12",lg:"8",md:"8",sm:"12"}},[[a("div",{staticClass:"text-center"},[a("v-pagination",{attrs:{length:t.pageLength,"total-visible":t.totalShow},model:{value:t.page,callback:function(e){t.page=e},expression:"page"}})],1)]],2),a("v-col",{attrs:{cols:"12",lg:"2",md:"2",sm:"6",xs:"6"}},[a("h4",{staticClass:"total"},[t._v("Total Record(s): "+t._s(t.groupHolder.length))])]),a("v-col",{attrs:{cols:"12",lg:"2",md:"2",sm:"6",xs:"6"}},[a("v-btn",{staticClass:"total",attrs:{dark:"",color:"primary"},on:{click:function(e){t.addFlag="GROUP",t.setGroup=!0,t.groupNameRead=!1,t.groupName="",t.groupID=""}}},[a("v-icon",{attrs:{left:""}},[t._v("mdi-table-plus")]),t._v("NEW GROUP ")],1)],1)],1)],1)],1)],1),a("v-row",[a("v-col",[a("span",{staticStyle:{"font-size":"25px"}},[a("b",[t._v("GROUP ID")])])]),a("v-col",[a("span",{staticStyle:{"font-size":"25px"}},[a("b",[t._v("GROUP NAME")])])]),a("v-col",[a("span",{staticStyle:{"font-size":"25px"}},[a("b",[t._v("PARTS")])])])],1),a("v-expansion-panels",{attrs:{accordion:"",inset:""}},t._l(t.filterGroup,(function(e,n){return a("v-expansion-panel",{key:n,attrs:{flat:""}},[a("v-expansion-panel-header",{staticClass:"grey lighten-2",attrs:{dense:""}},[a("v-col",[t._v(" Group - "+t._s(e.GroupID)+" ")]),a("v-col",[t._v(" "+t._s(e.GroupName)+" ")]),a("v-col",[t._v(" "+t._s(e.Part.length)+" ")])],1),a("v-expansion-panel-content",[a("v-row",[a("v-col",{attrs:{cols:"10"}},t._l(e.Part,(function(n,i){return a("v-row",{key:i,attrs:{dense:""}},[a("v-col",{attrs:{cols:"6"}},[t._v(t._s(n.Child))]),a("v-col",{attrs:{cols:"3"}},[t._v(t._s(n.Quantity))]),a("v-col",{attrs:{cols:"3"}},[e.Part.length>1?a("v-btn",{staticClass:"mt-0",attrs:{small:"",text:"",color:"#EF5350"},on:{click:function(a){t.groupID=e.GroupID,t.deleteFlag="PART",t.hinbanPart=n.Child,t.deleteGroupQ=!0}}},[a("v-icon",{staticStyle:{color:"#EF5350"}},[t._v("mdi-delete")])],1):t._e()],1)],1)})),1),a("v-col",{attrs:{cols:"2"}},[a("v-card",{attrs:{id:"create"}},[a("v-speed-dial",{attrs:{center:"center",right:"right",direction:"left","open-on-hover":"",transition:"scale-transition"},scopedSlots:t._u([{key:"activator",fn:function(){return[a("v-btn",{staticClass:"mt-0",attrs:{center:"",color:"blue darken-2",dark:"",fab:""},model:{value:e.fab,callback:function(a){t.$set(e,"fab",a)},expression:"item.fab"}},[e.fab?a("v-icon",[t._v("mdi-close")]):a("v-icon",[t._v("mdi-dots-horizontal")])],1)]},proxy:!0}],null,!0),model:{value:e.fab,callback:function(a){t.$set(e,"fab",a)},expression:"item.fab"}},[a("v-btn",{attrs:{fab:"",dark:"",small:"",color:"green"},on:{click:function(a){t.groupID=e.GroupID,t.getEditPart(),t.addFlag="EDIT",t.editAllPart=!0}}},[a("v-icon",[t._v("mdi-pencil")])],1),a("v-btn",{attrs:{fab:"",dark:"",small:"",color:"indigo"},on:{click:function(a){t.groupID=e.GroupID,t.getCurrentPart(),t.addFlag="PART",t.groupName=e.GroupName,t.groupNameRead=!0,t.setGroup=!0}}},[a("v-icon",[t._v("mdi-plus")])],1),a("v-btn",{attrs:{fab:"",dark:"",small:"",color:"red"},on:{click:function(a){t.groupID=e.GroupID,t.deleteFlag="GROUP",t.deleteGroupQ=!0}}},[a("v-icon",[t._v("mdi-delete")])],1)],1)],1)],1)],1)],1)],1)})),1),a("v-dialog",{attrs:{persistent:"","max-width":"550"},model:{value:t.setGroup,callback:function(e){t.setGroup=e},expression:"setGroup"}},[a("v-card",[a("v-card-title",[t._v(" SET GROUP "),a("v-spacer"),a("v-btn",{attrs:{rounded:"",dark:"",color:"primary"},on:{click:function(e){return t.back()}}},[a("v-icon",[t._v("mdi-close")])],1)],1),a("v-card-title",[a("v-text-field",{attrs:{dense:"",outlined:"",label:"GROUP NAME",readonly:t.groupNameRead},model:{value:t.groupName,callback:function(e){t.groupName=e},expression:"groupName"}})],1),a("v-card-text",[a("v-card",[a("v-card-title",{attrs:{dense:""}},[a("span",[t._v("SELECT PARTS")]),a("v-spacer"),a("v-text-field",{staticClass:"searchSetGroup",attrs:{"append-icon":"mdi-magnify",label:"Search",outlined:"",dense:"",clearable:""},on:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.searchSelectPart()},"click:clear":function(e){return t.clearSelect()}},model:{value:t.searchPartAdd,callback:function(e){t.searchPartAdd=e},expression:"searchPartAdd"}})],1),a("v-card-text",[a("v-simple-table",{attrs:{dense:"","fixed-header":"",height:"200px"}},[a("thead",[a("tr",[a("th",{staticClass:"text-center"},[t._v("Item Part")]),a("th",{staticClass:"text-center"},[t._v("Select")])])]),a("tbody",t._l(t.filterAllPart,(function(e,n){return a("tr",{key:n},[a("td",[t._v(t._s(e.HinbanPartCode))]),a("td",{staticClass:"text-center"},[a("v-btn",{attrs:{"x-small":"",color:"primary",dark:""},on:{click:function(a){t.qtyPart=e.HinbanPartCode,t.setQty=!0}}},[t._v(">>>")])],1)])})),0)])],1),a("v-card-actions",[a("v-spacer"),[a("div",{staticClass:"text-center"},[a("v-pagination",{attrs:{length:t.selectPageLength,"total-visible":t.totalShow,"prev-icon":"mdi-menu-left","next-icon":"mdi-menu-right"},model:{value:t.pageSelectPart,callback:function(e){t.pageSelectPart=e},expression:"pageSelectPart"}})],1)],a("v-spacer")],2)],1),a("v-card",[a("v-card-title",[t._v(" SELECTED PARTS "),a("v-spacer"),a("v-text-field",{staticClass:"searchSetGroup",attrs:{"append-icon":"mdi-magnify",label:"Search",outlined:"",dense:"",clearable:""},on:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.searchSelectedPart()},"click:clear":function(e){return t.clearSelected()}},model:{value:t.searchCurrentPart,callback:function(e){t.searchCurrentPart=e},expression:"searchCurrentPart"}})],1),a("v-card-text",[a("v-simple-table",{attrs:{dense:"","fixed-header":"",height:"180px"}},[a("thead",[a("tr",[a("th",{staticClass:"text-center"},[t._v("Item Part")]),a("th",{staticClass:"text-center"},[t._v("Quantity")])])]),a("tbody",t._l(t.filterCurrentPart,(function(e,n){return a("tr",{key:n},[a("td",[t._v(t._s(e.HinbanPartCode))]),a("td",{staticClass:"text-center"},[t._v(t._s(e.Quantity))])])})),0)])],1)],1)],1)],1)],1),a("v-dialog",{attrs:{"max-width":"550"},model:{value:t.editAllPart,callback:function(e){t.editAllPart=e},expression:"editAllPart"}},[a("v-card",[a("v-card-title",[t._v(" EDIT PART "),a("v-spacer"),a("v-text-field",{attrs:{"append-icon":"mdi-magnify",label:"Search","single-line":"","hide-details":""},model:{value:t.searchEditAllPart,callback:function(e){t.searchEditAllPart=e},expression:"searchEditAllPart"}})],1),a("v-card-text",[a("v-simple-table",{attrs:{dense:"","fixed-header":"",height:"300"}},[a("thead",[a("tr",[a("th",{staticClass:"text-center"},[t._v("ITEM PART")]),a("th",{staticClass:"text-center"},[t._v("QUANTITY")]),a("th",{staticClass:"text-center"},[t._v("EDIT")])])]),a("tbody",t._l(t.filterGetEditPart,(function(e,n){return a("tr",{key:n,attrs:{in:""}},[a("td",[t._v(t._s(e.HinbanPartCode))]),a("td",{staticClass:"text-center"},[t._v(t._s(e.Quantity))]),a("td",{staticClass:"text-center"},[a("v-btn",{attrs:{"x-small":"",color:"primary"},on:{click:function(a){t.qtyPart=e.HinbanPartCode,t.qty=e.Quantity,t.setQty=!0}}},[t._v(">>>")])],1)])})),0)])],1)],1)],1),a("v-dialog",{attrs:{"max-width":"250"},model:{value:t.addGroupQ,callback:function(e){t.addGroupQ=e},expression:"addGroupQ"}},[a("v-card",[a("v-card-title",["EDIT"==t.addFlag?a("span",[t._v("UPDATE PART?")]):a("span",[t._v("ADD PART?")])]),a("v-card-text"),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{color:"red",dark:""},on:{click:function(e){t.addGroupQ=!1}}},[t._v("CANCEL")]),"GROUP"==t.addFlag?a("v-btn",{attrs:{color:"primary",dark:""},on:{click:function(e){return t.addGroup()}}},[t._v("OK")]):"PART"==t.addFlag?a("v-btn",{attrs:{color:"primary",dark:""},on:{click:function(e){return t.addPart()}}},[t._v("OK")]):a("v-btn",{attrs:{color:"primary",dark:""},on:{click:function(e){return t.updatePart()}}},[t._v("OK")])],1)],1)],1),a("v-dialog",{attrs:{"max-width":"250"},model:{value:t.deleteGroupQ,callback:function(e){t.deleteGroupQ=e},expression:"deleteGroupQ"}},[a("v-card",[a("v-card-title",["GROUP"==t.deleteFlag?a("span",[t._v("DELETE GROUP?")]):a("span",[t._v("DELETE PART")])]),a("v-card-text"),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{color:"red",dark:""},on:{click:function(e){t.deleteGroupQ=!1}}},[t._v("CANCEL")]),"GROUP"==t.deleteFlag?a("v-btn",{attrs:{color:"primary",dark:""},on:{click:function(e){return t.deleteGroup()}}},[t._v("OK")]):a("v-btn",{attrs:{color:"primary",dark:""},on:{click:function(e){return t.deletePart()}}},[t._v("OK")])],1)],1)],1),a("v-dialog",{attrs:{"max-width":"300"},model:{value:t.setQty,callback:function(e){t.setQty=e},expression:"setQty"}},[a("v-card",[a("v-card-title",[t._v(" SET QUANTITY ")]),a("v-card-text",[a("v-text-field",{attrs:{outlined:"",readonly:"",dense:""},model:{value:t.qtyPart,callback:function(e){t.qtyPart=e},expression:"qtyPart"}}),a("v-text-field",{attrs:{outlined:"",dense:""},model:{value:t.qty,callback:function(e){t.qty=e},expression:"qty"}})],1),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{dark:"",color:"red"},on:{click:function(e){t.setQty=!1}}},[t._v("CANCEL")]),a("v-btn",{attrs:{dark:"",color:"primary"},on:{click:function(e){return t.addGroupTrap()}}},[t._v("OK")])],1)],1)],1),a("v-dialog",{attrs:{"max-width":"100"},model:{value:t.test,callback:function(e){t.test=e},expression:"test"}},[a("v-card",[a("v-card-title",[t._v(" TAE ")])],1)],1)],1)},i=[],r=(a("4de4"),a("caad"),a("fb6a"),a("ac1f"),a("2532"),a("466d"),a("bc3a")),s=a.n(r),o={data:function(){return{test:!1,serKeyGroup:"",searchPartAdd:"",searchCurrentPart:"",searchEditAllPart:"",groupID:"",addFlag:"",deleteFlag:"",hinbanPart:"",qtyPart:"",qty:"",groupName:"",filterValue:0,page:1,pageSelectPart:1,perPage:100,totalShow:7,setGroup:!1,addGroupQ:!1,deleteGroupQ:!1,setAddPartGroup:!1,setQty:!1,editAllPart:!1,groupNameRead:!1,group:[],allPart:[],allPartCopy:[],partAdd:[],partAddCopy:[],partCond:[],editPart:[],groupHolder:[],filterAllPartHolder:[],groupCopy:[],notificationSystem:{options:{success:{position:"bottomRight"},error:{position:"bottomRight"},info:{position:"bottomRight"}}},sort:[{id:0,name:"GROUP NAME"},{id:1,name:"GROUP PART"}]}},created:function(){this.getGroup(),this.getAllPart()},computed:{filterGroup:function(){return this.groupHolder=this.groupCopy,this.groupHolder.slice((this.page-1)*this.perPage,(this.page-1)*this.perPage+this.perPage)},filterAllPart:function(){return this.filterAllPartHolder=this.allPartCopy,this.filterAllPartHolder.slice((this.pageSelectPart-1)*this.perPage,(this.pageSelectPart-1)*this.perPage+this.perPage)},filterCurrentPart:function(){return this.partAddCopy},filterGetEditPart:function(){var t=this;return this.editPart.filter((function(e){return e.HinbanPartCode.toLowerCase().includes(t.searchEditAllPart.toLowerCase())}))},pageLength:function(){var t=parseInt(this.groupCopy.length/this.perPage),e=parseInt(this.groupCopy.length%this.perPage);return 0!=e&&(t+=1),t},selectPageLength:function(){var t=parseInt(this.allPartCopy.length/this.perPage),e=parseInt(this.allPartCopy.length%this.perPage);return 0!=e&&(t+=1),t},labelCondition:function(){return 0==this.filterValue?"Search Group":"Search Part"}},methods:{getGroup:function(){var t=this;s.a.get("".concat(this.url,"getGroup")).then((function(e){t.page=1,t.totalShow=7,t.group=e.data,t.groupCopy=t.group}))},filterGetPart:function(){var t=this;s.a.post("".concat(this.url,"filterGetPart"),{id:this.groupID,part:this.partCond}).then((function(e){t.allPart=e.data,t.allPartCopy=t.allPart}))},getAllPart:function(){var t=this;s.a.get("".concat(this.url,"getAllPart")).then((function(e){t.allPart=e.data,t.allPartCopy=t.allPart}))},getCurrentPart:function(){var t=this;s.a.post("".concat(this.url,"getCurrentPart"),{id:this.groupID}).then((function(e){t.partAdd=e.data,t.partCond=[];for(var a=0;a<t.partAdd.length;a++)t.partCond.push(t.partAdd[a].HinbanPartCode);t.partAddCopy=t.partAdd,t.filterGetPart()}))},getEditPart:function(){var t=this;s.a.post("".concat(this.url,"getCurrentPart"),{id:this.groupID}).then((function(e){t.editPart=e.data}))},addGroupTrap:function(){var t=this;return 0==this.qty||""==this.qty?(this.$toast.error("Please set quantity!","Invalid",this.notificationSystem.options.error),!1):""==this.groupName||null==this.groupName?(this.$toast.error("Please set group name!","Invalid",this.notificationSystem.options.error),!1):void(this.partAdd.length?this.addGroupQ=!0:s.a.post("".concat(this.url,"compareName"),{name:this.groupName}).then((function(e){if(e.data.length>0)return t.$toast.error("Group name already exists!","Invalid",t.notificationSystem.options.error),!1;t.addGroupQ=!0})))},addGroup:function(){var t=this;null==this.groupID||""==this.groupID?s.a.get("".concat(this.url,"getMax")).then((function(e){null==e.data[0].id?t.groupID=1:t.groupID=e.data[0].id+1,s.a.post("".concat(t.url,"addGroup"),{id:t.groupID,groupName:t.groupName,part:t.qtyPart,qty:t.qty}).then((function(e){t.$toast.success("GROUP ADDED","Success",t.notificationSystem.options.success),t.groupNameRead=!0,t.qty="",t.addGroupQ=!1,t.setQty=!1,t.getGroup(),t.getCurrentPart()}))})):s.a.post("".concat(this.url,"addGroup"),{id:this.groupID,groupName:this.groupName,part:this.qtyPart,qty:this.qty}).then((function(e){t.$toast.success("GROUP ADDED","Success",t.notificationSystem.options.success),t.qty="",t.addGroupQ=!1,t.setQty=!1,t.getGroup(),t.getCurrentPart()}))},addPart:function(){var t=this;s.a.post("".concat(this.url,"addPartGroup"),{id:this.groupID,groupName:this.groupName,part:this.qtyPart,qty:this.qty}).then((function(e){t.$toast.success("PART ADDED TO GROUP","Success",t.notificationSystem.options.success),t.addGroupQ=!1,t.setQty=!1,t.qty="",t.getGroup(),t.getCurrentPart()}))},updatePart:function(){var t=this;s.a.post("".concat(this.url,"updatePartGroup"),{id:this.groupID,part:this.qtyPart,qty:this.qty}).then((function(e){t.$toast.success("PART UPDATED!","Success",t.notificationSystem.options.success),t.qtyPart="",t.qty="",t.addGroupQ=!1,t.setQty=!1,t.getGroup(),t.getEditPart()}))},deleteGroup:function(){var t=this;s.a.post("".concat(this.url,"deleteGroup"),{id:this.groupID}).then((function(e){t.$toast.success("GROUP DELETED","Success",t.notificationSystem.options.success),t.deleteGroupQ=!1,t.getGroup()}))},deletePart:function(){var t=this;s.a.post("".concat(this.url,"deleteHinbanPartGroup"),{id:this.groupID,part:this.hinbanPart}).then((function(e){t.$toast.success("PART DELETED","Success",t.notificationSystem.options.success),t.getGroup(),t.deleteGroupQ=!1}))},back:function(){this.qtyPart="",this.partAdd=[],this.partAddCopy=[],this.setGroup=!1},searchFilterGroup:function(){var t=this;if(this.page=1,this.groupCopy=[],1==this.filterValue)for(var e=0;e<this.group.length;e++){for(var a=0,n=0;n<this.group[e].Part.length;n++)for(var i=0;i<this.group[e].Part[n].Child.length;i++)this.group[e].Part[n].Child.toLowerCase().match(this.serKeyGroup.toLowerCase(),".*/")&&(a=1);1==a&&this.groupCopy.push(this.group[e])}else this.groupCopy=this.group.filter((function(e){return e.GroupName.toLowerCase().includes(t.serKeyGroup.toLowerCase())}));this.totalShow=7,console.log(this.groupCopy)},refresh:function(){this.totalShow=7,this.getGroup(),this.getAllPart(),this.serKeyGroup=""},searchSelectPart:function(){var t=this;this.allPartCopy=[],this.allPartCopy=this.allPart.filter((function(e){return e.HinbanPartCode.toLowerCase().includes(t.searchPartAdd.toLowerCase())})),this.pageSelectPart=1,this.totalShow=7},clearSelect:function(){this.pageSelectPart=1,this.totalShow=7,this.allPartCopy=this.allPart},searchSelectedPart:function(){var t=this;this.partAddCopy=[],this.partAddCopy=this.partAdd.filter((function(e){return e.HinbanPartCode.toLowerCase().includes(t.searchCurrentPart.toLowerCase())}))},clearSelected:function(){this.partAddCopy=this.partAdd}}},l=o,c=(a("f4cb"),a("2877")),u=a("6544"),d=a.n(u),p=a("8336"),h=a("b0af"),v=a("99d9"),f=a("62ad"),g=a("a523"),b=a("169a"),m=a("5530"),y=a("4e82"),x=a("3206"),P=a("80d2"),C=a("58df"),A=Object(C["a"])(Object(y["a"])("expansionPanels","v-expansion-panel","v-expansion-panels"),Object(x["b"])("expansionPanel",!0)).extend({name:"v-expansion-panel",props:{disabled:Boolean,readonly:Boolean},data:function(){return{content:null,header:null,nextIsActive:!1}},computed:{classes:function(){return Object(m["a"])({"v-expansion-panel--active":this.isActive,"v-expansion-panel--next-active":this.nextIsActive,"v-expansion-panel--disabled":this.isDisabled},this.groupClasses)},isDisabled:function(){return this.expansionPanels.disabled||this.disabled},isReadonly:function(){return this.expansionPanels.readonly||this.readonly}},methods:{registerContent:function(t){this.content=t},unregisterContent:function(){this.content=null},registerHeader:function(t){this.header=t,t.$on("click",this.onClick)},unregisterHeader:function(){this.header=null},onClick:function(t){t.detail&&this.header.$el.blur(),this.$emit("click",t),this.isReadonly||this.isDisabled||this.toggle()},toggle:function(){var t=this;this.content&&(this.content.isBooted=!0),this.$nextTick((function(){return t.$emit("change")}))}},render:function(t){return t("div",{staticClass:"v-expansion-panel",class:this.classes,attrs:{"aria-expanded":String(this.isActive)}},Object(P["r"])(this))}}),k=a("0789"),O=a("9d65"),S=a("a9ad"),_=Object(C["a"])(O["a"],S["a"],Object(x["a"])("expansionPanel","v-expansion-panel-content","v-expansion-panel")),G=_.extend().extend({name:"v-expansion-panel-content",computed:{isActive:function(){return this.expansionPanel.isActive}},created:function(){this.expansionPanel.registerContent(this)},beforeDestroy:function(){this.expansionPanel.unregisterContent()},render:function(t){var e=this;return t(k["a"],this.showLazyContent((function(){return[t("div",e.setBackgroundColor(e.color,{staticClass:"v-expansion-panel-content",directives:[{name:"show",value:e.isActive}]}),[t("div",{class:"v-expansion-panel-content__wrap"},Object(P["r"])(e))])]})))}}),w=a("9d26"),E=a("5607"),j=Object(C["a"])(S["a"],Object(x["a"])("expansionPanel","v-expansion-panel-header","v-expansion-panel")),I=j.extend().extend({name:"v-expansion-panel-header",directives:{ripple:E["a"]},props:{disableIconRotate:Boolean,expandIcon:{type:String,default:"$expand"},hideActions:Boolean,ripple:{type:[Boolean,Object],default:!1}},data:function(){return{hasMousedown:!1}},computed:{classes:function(){return{"v-expansion-panel-header--active":this.isActive,"v-expansion-panel-header--mousedown":this.hasMousedown}},isActive:function(){return this.expansionPanel.isActive},isDisabled:function(){return this.expansionPanel.isDisabled},isReadonly:function(){return this.expansionPanel.isReadonly}},created:function(){this.expansionPanel.registerHeader(this)},beforeDestroy:function(){this.expansionPanel.unregisterHeader()},methods:{onClick:function(t){this.$emit("click",t)},genIcon:function(){var t=Object(P["r"])(this,"actions")||[this.$createElement(w["a"],this.expandIcon)];return this.$createElement(k["c"],[this.$createElement("div",{staticClass:"v-expansion-panel-header__icon",class:{"v-expansion-panel-header__icon--disable-rotate":this.disableIconRotate},directives:[{name:"show",value:!this.isDisabled}]},t)])}},render:function(t){var e=this;return t("button",this.setBackgroundColor(this.color,{staticClass:"v-expansion-panel-header",class:this.classes,attrs:{tabindex:this.isDisabled?-1:null,type:"button"},directives:[{name:"ripple",value:this.ripple}],on:Object(m["a"])(Object(m["a"])({},this.$listeners),{},{click:this.onClick,mousedown:function(){return e.hasMousedown=!0},mouseup:function(){return e.hasMousedown=!1}})}),[Object(P["r"])(this,"default",{open:this.isActive},!0),this.hideActions||this.genIcon()])}}),$=(a("0481"),a("4069"),a("210b"),a("604c")),D=a("d9bd"),T=$["a"].extend({name:"v-expansion-panels",provide:function(){return{expansionPanels:this}},props:{accordion:Boolean,disabled:Boolean,flat:Boolean,hover:Boolean,focusable:Boolean,inset:Boolean,popout:Boolean,readonly:Boolean,tile:Boolean},computed:{classes:function(){return Object(m["a"])(Object(m["a"])({},$["a"].options.computed.classes.call(this)),{},{"v-expansion-panels":!0,"v-expansion-panels--accordion":this.accordion,"v-expansion-panels--flat":this.flat,"v-expansion-panels--hover":this.hover,"v-expansion-panels--focusable":this.focusable,"v-expansion-panels--inset":this.inset,"v-expansion-panels--popout":this.popout,"v-expansion-panels--tile":this.tile})}},created:function(){this.$attrs.hasOwnProperty("expand")&&Object(D["a"])("expand","multiple",this),Array.isArray(this.value)&&this.value.length>0&&"boolean"===typeof this.value[0]&&Object(D["a"])(':value="[true, false, true]"',':value="[0, 2]"',this)},methods:{updateItem:function(t,e){var a=this.getValue(t,e),n=this.getValue(t,e+1);t.isActive=this.toggleMethod(a),t.nextIsActive=this.toggleMethod(n)}}}),R=a("132d"),L=a("891e"),N=a("0fd9"),B=a("b974"),Q=a("1f4f"),H=a("2fa4"),q=(a("d81d"),a("b0c0"),a("c7cd"),a("ade3")),V=(a("8cd0"),a("f2e7")),F=a("fe6c"),M=a("f40d"),U=a("a293"),K=Object(C["a"])(F["a"],V["a"],M["a"]).extend({name:"v-speed-dial",directives:{ClickOutside:U["a"]},props:{direction:{type:String,default:"top",validator:function(t){return["top","right","bottom","left"].includes(t)}},openOnHover:Boolean,transition:{type:String,default:"scale-transition"}},computed:{classes:function(){var t;return t={"v-speed-dial":!0,"v-speed-dial--top":this.top,"v-speed-dial--right":this.right,"v-speed-dial--bottom":this.bottom,"v-speed-dial--left":this.left,"v-speed-dial--absolute":this.absolute,"v-speed-dial--fixed":this.fixed},Object(q["a"])(t,"v-speed-dial--direction-".concat(this.direction),!0),Object(q["a"])(t,"v-speed-dial--is-active",this.isActive),t}},render:function(t){var e=this,a=[],n={class:this.classes,directives:[{name:"click-outside",value:function(){return e.isActive=!1}}],on:{click:function(){return e.isActive=!e.isActive}}};if(this.openOnHover&&(n.on.mouseenter=function(){return e.isActive=!0},n.on.mouseleave=function(){return e.isActive=!1}),this.isActive){var i=0;a=(this.$slots.default||[]).map((function(e,a){return!e.tag||"undefined"===typeof e.componentOptions||"v-btn"!==e.componentOptions.Ctor.options.name&&"v-tooltip"!==e.componentOptions.Ctor.options.name?(e.key=a,e):(i++,t("div",{style:{transitionDelay:.05*i+"s"},key:a},[e]))}))}var r=t("transition-group",{class:"v-speed-dial__list",props:{name:this.transition,mode:this.mode,origin:this.origin,tag:"div"}},a);return t("div",n,[this.$slots.activator,r])}}),z=a("8654"),W=Object(c["a"])(l,n,i,!1,null,"51dbe56f",null);e["default"]=W.exports;d()(W,{VBtn:p["a"],VCard:h["a"],VCardActions:v["a"],VCardText:v["b"],VCardTitle:v["c"],VCol:f["a"],VContainer:g["a"],VDialog:b["a"],VExpansionPanel:A,VExpansionPanelContent:G,VExpansionPanelHeader:I,VExpansionPanels:T,VIcon:R["a"],VPagination:L["a"],VRow:N["a"],VSelect:B["a"],VSimpleTable:Q["a"],VSpacer:H["a"],VSpeedDial:K,VTextField:z["a"]})},f4cb:function(t,e,a){"use strict";a("c1db")}}]);
//# sourceMappingURL=chunk-3c03a271.c43cc959.js.map