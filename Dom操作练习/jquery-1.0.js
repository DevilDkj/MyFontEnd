/*
 * jQuery的 - 新浪潮的Javascript
 *
 *	版权所有（c）2006约翰Resig的（jquery.com）
 *	在麻省理工学院（MIT-LICENSE.TXT）授权的双
 *	和GPL（GPL-LICENSE.TXT）许可证。
 *
 * $日期：2006-10-2723时14分48秒-0400（周五，2006年10月27日）$
 * $启：$509
 */

// 全局未定义的变量
//这个写法结果是为了兼容IE5以下的浏览器没有undefind时使用window.undefined时产生代码错误导致后续代码不进行的问题。
//因没有找到IE5以下的浏览器故看不到效果..删除后任然有效
window.undefined = window.undefined;
//jquery方法需传人两个值
//传人值a是$("#text")函数内的值为string
//传入值c是undefined;
function jQuery(a,c) {
	// $()中的内容是对象才进入判断返回jquery(document).ready(a);
	if ( a && a.constructor == Function && jQuery.fn.ready )
		return jQuery(document).ready(a);
	// $()中没有内容就使用document
	a = a || jQuery.context || document;
	// 当观看一个jQuery对象传递作为选择器
	if ( a.jquery )
		return $( jQuery.merge( a, [] ) );

	// 当观看一个jQuery对象传递的上下文
	if ( c && c.jquery )
		return $( c ).find(a);

	// 正常调用一个函数this是指向window变量的，这里将重新创建对象并返回后this将指向新创建的对象即(new jQuery(ac))。
	if ( window == this )
		return new jQuery(a,c);

	// 处理HTML字符串
	var m = /^[^<]*(<.+>)[^>]*$/.exec(a);
	if ( m ) a = jQuery.clean( [ m[1] ] );

	// 当观看一个数组中传递的
	this.get( a.constructor == Array || a.length && !a.nodeType && a[0] != undefined && a[0].nodeType ?
		// 假定它是DOM元素的数组
		jQuery.merge( a, [] ) :
		// Find the matching elements and save them for later
		jQuery.find( a, c ) );
  //找到匹配的元素，并将它们保存供以后
	var fn = arguments[ arguments.length - 1 ];
	// 如果是这样，在上下文中执行它
	if ( fn && fn.constructor == Function )
		this.each(fn);
}
//jquery函数 END

// 地图在美元的情况下，覆盖
if ( $ )
	jQuery._$ = $;

// 地图jQuery的命名空间为“$”一
var $ = jQuery;

//.fn .prototype 函数
jQuery.fn = jQuery.prototype = {
	//版本号之类的
	jquery: "$Rev: 509 $",
	//size函数
	size: function() {
		return this.length;
	},
	//get函数
	get: function( num ) {
		// 当观看一个数组（元素）传递为
		if ( num && num.constructor == Array ) {

			// 使用一个棘手的黑客，使jQuery对象
			// 外观和感觉像一个数组
			this.length = 0;
			[].push.apply( this, num );
			return this;
		} else
			return num == undefined ?
				//返回一个“干净”的阵
				jQuery.map( this, function(a){ return a } ) :
				// 仅返回对象
				this[num];
	},
	//each函数
	each: function( fn, args ) {
		return jQuery.each( this, fn, args );
	},
	//index函数
	index: function( obj ) {
		var pos = -1;
		this.each(function(i){
			if ( this == obj ) pos = i;
		});
		return pos;
	},
	//attr函数
	attr: function( key, value, type ) {
		// 检查看看，如果我们设置样式值
		return key.constructor != String || value != undefined ?
			this.each(function(){
				// 看看我们设置样式散列
				if ( value == undefined )
					// 将所有的样式
					for ( var prop in key )
						jQuery.attr(
							type ? this.style : this,
							prop, key[prop]
						);
				
				// 看看我们设置一个键/值的风格
				else
					jQuery.attr(
						type ? this.style : this,
						key, value
					);
			}) :
			
			// 寻找我们在访问样式值的情况下
			jQuery[ type || "attr" ]( this[0], key );
	},
	//css函数
	css: function( key, value ) {
		return this.attr( key, value, "curCSS" );
	},
	//text函数
	text: function(e) {
		e = e || this;
		var t = "";
		for ( var j = 0; j < e.length; j++ ) {
			var r = e[j].childNodes;
			for ( var i = 0; i < r.length; i++ )
				t += r[i].nodeType != 1 ?
					r[i].nodeValue : jQuery.fn.text([ r[i] ]);
		}
		return t;
	},
	//wrap函数
	wrap: function() {
		// T他周围的元素来包装目标
		var a = jQuery.clean(arguments);
		
		//单独包装的每一个匹配的元素
		return this.each(function(){
			// 克隆我们使用包装结构
			var b = a[0].cloneNode(true);
			
			// 将它包裹的元素之前
			this.parentNode.insertBefore( b, this );
			
			// 查找他最深点的包装结构
			while ( b.firstChild )
				b = b.firstChild;
			
			//移动匹配元件到卷绕结构内
			b.appendChild( this );
		});
	},
	//append函数
	append: function() {
		return this.domManip(arguments, true, 1, function(a){
			this.appendChild( a );
		});
	},
	//prepend函数
	prepend: function() {
		return this.domManip(arguments, true, -1, function(a){
			this.insertBefore( a, this.firstChild );
		});
	},
	//before函数
	before: function() {
		return this.domManip(arguments, false, 1, function(a){
			this.parentNode.insertBefore( a, this );
		});
	},
	//after函数
	after: function() {
		return this.domManip(arguments, false, -1, function(a){
			this.parentNode.insertBefore( a, this.nextSibling );
		});
	},
	//end函数
	end: function() {
		return this.get( this.stack.pop() );
	},
	//find函数
	find: function(t) {
		return this.pushStack( jQuery.map( this, function(a){
			return jQuery.find(t,a);
		}), arguments );
	},
	//clone函数
	clone: function(deep) {
		return this.pushStack( jQuery.map( this, function(a){
			return a.cloneNode( deep != undefined ? deep : true );
		}), arguments );
	},
	//filter函数
	filter: function(t) {
		return this.pushStack(
			t.constructor == Array &&
			jQuery.map(this,function(a){
				for ( var i = 0; i < t.length; i++ )
					if ( jQuery.filter(t[i],[a]).r.length )
						return a;
			}) ||

			t.constructor == Boolean &&
			( t ? this.get() : [] ) ||

			t.constructor == Function &&
			jQuery.grep( this, t ) ||

			jQuery.filter(t,this).r, arguments );
	},
	//not函数
	not: function(t) {
		return this.pushStack( t.constructor == String ?
			jQuery.filter(t,this,false).r :
			jQuery.grep(this,function(a){ return a != t; }), arguments );
	},
	//add函数
	add: function(t) {
		return this.pushStack( jQuery.merge( this, t.constructor == String ?
			jQuery.find(t) : t.constructor == Array ? t : [t] ), arguments );
	},
	//is函数
	is: function(expr) {
		return expr ? jQuery.filter(expr,this).r.length > 0 : this.length > 0;
	},
	//demMainp函数
	domManip: function(args, table, dir, fn){
		var clone = this.size() > 1;
		var a = jQuery.clean(args);
		
		return this.each(function(){
			var obj = this;
			
			if ( table && this.nodeName == "TABLE" && a[0].nodeName != "THEAD" ) {
				var tbody = this.getElementsByTagName("tbody");

				if ( !tbody.length ) {
					obj = document.createElement("tbody");
					this.appendChild( obj );
				} else
					obj = tbody[0];
			}

			for ( var i = ( dir < 0 ? a.length - 1 : 0 );
				i != ( dir < 0 ? dir : a.length ); i += dir ) {
					fn.apply( obj, [ clone ? a[i].cloneNode(true) : a[i] ] );
			}
		});
	},
	//pushStack函数
	pushStack: function(a,args) {
		var fn = args && args[args.length-1];

		if ( !fn || fn.constructor != Function ) {
			if ( !this.stack ) this.stack = [];
			this.stack.push( this.get() );
			this.get( a );
		} else {
			var old = this.get();
			this.get( a );
			if ( fn.constructor == Function )
				return this.each( fn );
			this.get( old );
		}

		return this;
	}
};
//jquery.fn结束

jQuery.extend = jQuery.fn.extend = function(obj,prop) {
	if ( !prop ) { prop = obj; obj = this; }
	for ( var i in prop ) obj[i] = prop[i];
	return obj;
};
//jqueyr.extend

jQuery.extend({
	//init函数
	init: function(){
		jQuery.initDone = true;
		
		jQuery.each( jQuery.macros.axis, function(i,n){
			jQuery.fn[ i ] = function(a) {
				var ret = jQuery.map(this,n);
				if ( a && a.constructor == String )
					ret = jQuery.filter(a,ret).r;
				return this.pushStack( ret, arguments );
			};
		});
		//each函数
		jQuery.each( jQuery.macros.to, function(i,n){
			jQuery.fn[ i ] = function(){
				var a = arguments;
				return this.each(function(){
					for ( var j = 0; j < a.length; j++ )
						$(a[j])[n]( this );
				});
			};
		});
		//each函数
		jQuery.each( jQuery.macros.each, function(i,n){
			jQuery.fn[ i ] = function() {
				return this.each( n, arguments );
			};
		});
		//each函数
		jQuery.each( jQuery.macros.filter, function(i,n){
			jQuery.fn[ n ] = function(num,fn) {
				return this.filter( ":" + n + "(" + num + ")", fn );
			};
		});
		//each函数
		jQuery.each( jQuery.macros.attr, function(i,n){
			n = n || i;
			jQuery.fn[ i ] = function(h) {
				return h == undefined ?
					this.length ? this[0][n] : null :
					this.attr( n, h );
			};
		});
		//each函数
		jQuery.each( jQuery.macros.css, function(i,n){
			jQuery.fn[ n ] = function(h) {
				return h == undefined ?
					( this.length ? jQuery.css( this[0], n ) : null ) :
					this.css( n, h );
			};
		});
	
	},
	//each函数
	each: function( obj, fn, args ) {
		if ( obj.length == undefined )
			for ( var i in obj )
				fn.apply( obj[i], args || [i, obj[i]] );
		else
			for ( var i = 0; i < obj.length; i++ )
				fn.apply( obj[i], args || [i, obj[i]] );
		return obj;
	},
	//className函数
	className: {
		//add函数
		add: function(o,c){
			if (jQuery.className.has(o,c)) return;
			o.className += ( o.className ? " " : "" ) + c;
		},
		//remove函数
		remove: function(o,c){
			o.className = !c ? "" :
				o.className.replace(
					new RegExp("(^|\\s*\\b[^-])"+c+"($|\\b(?=[^-]))", "g"), "");
		},
		has: function(e,a) {
			if ( e.className != undefined )
				e = e.className;
			return new RegExp("(^|\\s)" + a + "(\\s|$)").test(e);
		}
	},
	swap: function(e,o,f) {
		for ( var i in o ) {
			e.style["old"+i] = e.style[i];
			e.style[i] = o[i];
		}
		f.apply( e, [] );
		for ( var i in o )
			e.style[i] = e.style["old"+i];
	},
	
	css: function(e,p) {
		if ( p == "height" || p == "width" ) {
			var old = {}, oHeight, oWidth, d = ["Top","Bottom","Right","Left"];
	
			for ( var i in d ) {
				old["padding" + d[i]] = 0;
				old["border" + d[i] + "Width"] = 0;
			}
	
			jQuery.swap( e, old, function() {
				if (jQuery.css(e,"display") != "none") {
					oHeight = e.offsetHeight;
					oWidth = e.offsetWidth;
				} else {
					e = $(e.cloneNode(true)).css({
						visibility: "hidden", position: "absolute", display: "block"
					}).prependTo("body")[0];

					oHeight = e.clientHeight;
					oWidth = e.clientWidth;
					
					e.parentNode.removeChild(e);
				}
			});
	
			return p == "height" ? oHeight : oWidth;
		} else if ( p == "opacity" && jQuery.browser.msie )
			return parseFloat( jQuery.curCSS(e,"filter").replace(/[^0-9.]/,"") ) || 1;

		return jQuery.curCSS( e, p );
	},

	curCSS: function(elem, prop, force) {
		var ret;
	
		if (!force && elem.style[prop]) {

			ret = elem.style[prop];

		} else if (elem.currentStyle) {

			var newProp = prop.replace(/\-(\w)/g,function(m,c){return c.toUpperCase()}); 
			ret = elem.currentStyle[prop] || elem.currentStyle[newProp];

		} else if (document.defaultView && document.defaultView.getComputedStyle) {

			prop = prop.replace(/([A-Z])/g,"-$1").toLowerCase();
			var cur = document.defaultView.getComputedStyle(elem, null);

			if ( cur )
				ret = cur.getPropertyValue(prop);
			else if ( prop == 'display' )
				ret = 'none';
			else
				jQuery.swap(elem, { display: 'block' }, function() {
					ret = document.defaultView.getComputedStyle(this,null).getPropertyValue(prop);
				});

		}
		
		return ret;
	},
	
	clean: function(a) {
		var r = [];
		for ( var i = 0; i < a.length; i++ ) {
			if ( a[i].constructor == String ) {

				var table = "";
	
				if ( !a[i].indexOf("<thead") || !a[i].indexOf("<tbody") ) {
					table = "thead";
					a[i] = "<table>" + a[i] + "</table>";
				} else if ( !a[i].indexOf("<tr") ) {
					table = "tr";
					a[i] = "<table>" + a[i] + "</table>";
				} else if ( !a[i].indexOf("<td") || !a[i].indexOf("<th") ) {
					table = "td";
					a[i] = "<table><tbody><tr>" + a[i] + "</tr></tbody></table>";
				}
	
				var div = document.createElement("div");
				div.innerHTML = a[i];
	
				if ( table ) {
					div = div.firstChild;
					if ( table != "thead" ) div = div.firstChild;
					if ( table == "td" ) div = div.firstChild;
				}
	
				for ( var j = 0; j < div.childNodes.length; j++ )
					r.push( div.childNodes[j] );
				} else if ( a[i].jquery || a[i].length && !a[i].nodeType )
					for ( var k = 0; k < a[i].length; k++ )
						r.push( a[i][k] );
				else if ( a[i] !== null )
					r.push(	a[i].nodeType ? a[i] : document.createTextNode(a[i].toString()) );
		}
		return r;
	},
	
	expr: {
		"": "m[2]== '*'||a.nodeName.toUpperCase()==m[2].toUpperCase()",
		"#": "a.getAttribute('id')&&a.getAttribute('id')==m[2]",
		":": {
			// Position Checks
			lt: "i<m[3]-0",
			gt: "i>m[3]-0",
			nth: "m[3]-0==i",
			eq: "m[3]-0==i",
			first: "i==0",
			last: "i==r.length-1",
			even: "i%2==0",
			odd: "i%2",
			
			// Child Checks
			"first-child": "jQuery.sibling(a,0).cur",
			"last-child": "jQuery.sibling(a,0).last",
			"only-child": "jQuery.sibling(a).length==1",
			
			// Parent Checks
			parent: "a.childNodes.length",
			empty: "!a.childNodes.length",
			
			// Text Check
			contains: "(a.innerText||a.innerHTML).indexOf(m[3])>=0",
			
			// Visibility
			visible: "a.type!='hidden'&&jQuery.css(a,'display')!='none'&&jQuery.css(a,'visibility')!='hidden'",
			hidden: "a.type=='hidden'||jQuery.css(a,'display')=='none'||jQuery.css(a,'visibility')=='hidden'",
			
			// Form elements
			enabled: "!a.disabled",
			disabled: "a.disabled",
			checked: "a.checked",
			selected: "a.selected"
		},
		".": "jQuery.className.has(a,m[2])",
		"@": {
			"=": "z==m[4]",
			"!=": "z!=m[4]",
			"^=": "!z.indexOf(m[4])",
			"$=": "z.substr(z.length - m[4].length,m[4].length)==m[4]",
			"*=": "z.indexOf(m[4])>=0",
			"": "z"
		},
		"[": "jQuery.find(m[2],a).length"
	},
	
	token: [
		"\\.\\.|/\\.\\.", "a.parentNode",
		">|/", "jQuery.sibling(a.firstChild)",
		"\\+", "jQuery.sibling(a).next",
		"~", function(a){
			var r = [];
			var s = jQuery.sibling(a);
			if ( s.n > 0 )
				for ( var i = s.n; i < s.length; i++ )
					r.push( s[i] );
			return r;
		}
	],
	find: function( t, context ) {
		// Make sure that the context is a DOM Element
		if ( context && context.nodeType == undefined )
			context = null;
	
		// Set the correct context (if none is provided)
		context = context || jQuery.context || document;
	
		if ( t.constructor != String ) return [t];

		if ( !t.indexOf("//") ) {
			context = context.documentElement;
			t = t.substr(2,t.length);
		} else if ( !t.indexOf("/") ) {
			context = context.documentElement;
			t = t.substr(1,t.length);
			// FIX Assume the root element is right :(
			if ( t.indexOf("/") >= 1 )
				t = t.substr(t.indexOf("/"),t.length);
		}
		var ret = [context];
		var done = [];
		var last = null;

		while ( t.length > 0 && last != t ) {
			var r = [];
			last = t;

			t = jQuery.trim(t).replace( /^\/\//i, "" );
			var foundToken = false;

			for ( var i = 0; i < jQuery.token.length; i += 2 ) {
				var re = new RegExp("^(" + jQuery.token[i] + ")");
				var m = re.exec(t);
				
				if ( m ) {
					r = ret = jQuery.map( ret, jQuery.token[i+1] );
					t = jQuery.trim( t.replace( re, "" ) );
					foundToken = true;
				}
			}

			if ( !foundToken ) {
				if ( !t.indexOf(",") || !t.indexOf("|") ) {
					if ( ret[0] == context ) ret.shift();
					done = jQuery.merge( done, ret );
					r = ret = [context];
					t = " " + t.substr(1,t.length);
				} else {
					var re2 = /^([#.]?)([a-z0-9\\*_-]*)/i;
					var m = re2.exec(t);

					if ( m[1] == "#" ) {
						// 嗯，应该使这项工作在所有的XML文档
						var oid = document.getElementById(m[2]);
						r = ret = oid ? [oid] : [];
						t = t.replace( re2, "" );
					} else {
						if ( !m[2] || m[1] == "." ) m[2] = "*";
					
						for ( var i = 0; i < ret.length; i++ )
							r = jQuery.merge( r,
								m[2] == "*" ?
									jQuery.getAll(ret[i]) :
									ret[i].getElementsByTagName(m[2])
							);
					}
				}
			}
			if ( t ) {
				var val = jQuery.filter(t,r);
				ret = r = val.r;
				t = jQuery.trim(val.t);
			}
		}
		alert(t);
		if ( ret && ret[0] == context ) ret.shift();
		done = jQuery.merge( done, ret );
		return done;
	},
	
	getAll: function(o,r) {
		r = r || [];
		var s = o.childNodes;
		for ( var i = 0; i < s.length; i++ )
			if ( s[i].nodeType == 1 ) {
				r.push( s[i] );
				jQuery.getAll( s[i], r );
			}
		return r;
	},
	
	attr: function(elem, name, value){
		var fix = {
			"for": "htmlFor",
			"class": "className",
			"float": "cssFloat",
			innerHTML: "innerHTML",
			className: "className"
		};

		if ( fix[name] ) {
			if ( value != undefined ) elem[fix[name]] = value;
			return elem[fix[name]];
		} else if ( elem.getAttribute ) {
			if ( value != undefined ) elem.setAttribute( name, value );
			return elem.getAttribute( name, 2 );
		} else {
			name = name.replace(/-([a-z])/ig,function(z,b){return b.toUpperCase();});
			if ( value != undefined ) elem[name] = value;
			return elem[name];
		}
	},

	// The regular expressions that power the parsing engine
	parse: [
		// Match: [@value='test'], [@foo]
		[ "\\[ *(@)S *([!*$^=]*) *Q\\]", 1 ],

		// Match: [div], [div p]
		[ "(\\[)Q\\]", 0 ],

		// Match: :contains('foo')
		[ "(:)S\\(Q\\)", 0 ],

		// Match: :even, :last-chlid
		[ "([:.#]*)S", 0 ]
	],
	
	filter: function(t,r,not) {
		// Figure out if we're doing regular, or inverse, filtering
		var g = not !== false ? jQuery.grep :
			function(a,f) {return jQuery.grep(a,f,true);};
		
		while ( t && /^[a-z[({<*:.#]/i.test(t) ) {

			var p = jQuery.parse;

			for ( var i = 0; i < p.length; i++ ) {
				var re = new RegExp( "^" + p[i][0]

					// Look for a string-like sequence
					.replace( 'S', "([a-z*_-][a-z0-9_-]*)" )

					// Look for something (optionally) enclosed with quotes
					.replace( 'Q', " *'?\"?([^'\"]*?)'?\"? *" ), "i" );

				var m = re.exec( t );

				if ( m ) {
					// Re-organize the match
					if ( p[i][1] )
						m = ["", m[1], m[3], m[2], m[4]];

					// Remove what we just matched
					t = t.replace( re, "" );

					break;
				}
			}
	
			// :not() is a special case that can be optomized by
			// keeping it out of the expression list
			if ( m[1] == ":" && m[2] == "not" )
				r = jQuery.filter(m[3],r,false).r;
			
			// Otherwise, find the expression to execute
			else {
				var f = jQuery.expr[m[1]];
				if ( f.constructor != String )
					f = jQuery.expr[m[1]][m[2]];
					
				// Build a custom macro to enclose it
				eval("f = function(a,i){" + 
					( m[1] == "@" ? "z=jQuery.attr(a,m[3]);" : "" ) + 
					"return " + f + "}");
				
				// Execute it against the current filter
				r = g( r, f );
			}
		}
	
		// Return an array of filtered elements (r)
		// and the modified expression string (t)
		return { r: r, t: t };
	},
	trim: function(t){
		return t.replace(/^\s+|\s+$/g, "");
	},
	parents: function( elem ){
		var matched = [];
		var cur = elem.parentNode;
		while ( cur && cur != document ) {
			matched.push( cur );
			cur = cur.parentNode;
		}
		return matched;
	},
	sibling: function(elem, pos, not) {
		var elems = [];

		var siblings = elem.parentNode.childNodes;
		for ( var i = 0; i < siblings.length; i++ ) {
			if ( not === true && siblings[i] == elem ) continue;

			if ( siblings[i].nodeType == 1 )
				elems.push( siblings[i] );
			if ( siblings[i] == elem )
				elems.n = elems.length - 1;
		}

		return jQuery.extend( elems, {
			last: elems.n == elems.length - 1,
			cur: pos == "even" && elems.n % 2 == 0 || pos == "odd" && elems.n % 2 || elems[pos] == elem,
			prev: elems[elems.n - 1],
			next: elems[elems.n + 1]
		});
	},
	merge: function(first, second) {
		var result = [];
		// b移动到新阵列（这有助于避免
		// StaticNodeList实例）
		for ( var k = 0; k < first.length; k++ )
			result[k] = first[k];
		// 现在检查a和b与仅仅之间重复
		// 加上独特的项目
		for ( var i = 0; i < second.length; i++ ) {
			var noCollision = true;
			
			// 碰撞检查过程
			for ( var j = 0; j < first.length; j++ )
				if ( second[i] == first[j] )
					noCollision = false;
				
			// 如果该项目是独一无二的，它添加
			if ( noCollision )
				result.push( second[i] );
		}
		return result;
	},
	grep: function(elems, fn, inv) {
		// If a string is passed in for the function, make a function
		// for it (a handy shortcut)
		if ( fn.constructor == String )
			fn = new Function("a","i","return " + fn);
			
		var result = [];
		
		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0; i < elems.length; i++ )
			if ( !inv && fn(elems[i],i) || inv && !fn(elems[i],i) )
				result.push( elems[i] );
		
		return result;
	},
	map: function(elems, fn) {
		// If a string is passed in for the function, make a function
		// for it (a handy shortcut)
		if ( fn.constructor == String )
			fn = new Function("a","return " + fn);
		
		var result = [];
		
		// Go through the array, translating each of the items to their
		// new value (or values).
		for ( var i = 0; i < elems.length; i++ ) {
			var val = fn(elems[i],i);

			if ( val !== null && val != undefined ) {
				if ( val.constructor != Array ) val = [val];
				result = jQuery.merge( result, val );
			}
		}

		return result;
	},
	
	/*
	 * A number of helper functions used for managing events.
	 * Many of the ideas behind this code orignated from Dean Edwards' addEvent library.
	 */
	event: {
	
		// Bind an event to an element
		// Original by Dean Edwards
		add: function(element, type, handler) {
			// For whatever reason, IE has trouble passing the window object
			// around, causing it to be cloned in the process
			if ( jQuery.browser.msie && element.setInterval != undefined )
				element = window;
		
			// Make sure that the function being executed has a unique ID
			if ( !handler.guid )
				handler.guid = this.guid++;
				
			// Init the element's event structure
			if (!element.events)
				element.events = {};
			
			// Get the current list of functions bound to this event
			var handlers = element.events[type];
			
			// If it hasn't been initialized yet
			if (!handlers) {
				// Init the event handler queue
				handlers = element.events[type] = {};
				
				// Remember an existing handler, if it's already there
				if (element["on" + type])
					handlers[0] = element["on" + type];
			}

			// Add the function to the element's handler list
			handlers[handler.guid] = handler;
			
			// And bind the global event handler to the element
			element["on" + type] = this.handle;
	
			// Remember the function in a global list (for triggering)
			if (!this.global[type])
				this.global[type] = [];
			this.global[type].push( element );
		},
		
		guid: 1,
		global: {},
		
		// Detach an event or set of events from an element
		remove: function(element, type, handler) {
			if (element.events)
				if (type && element.events[type])
					if ( handler )
						delete element.events[type][handler.guid];
					else
						for ( var i in element.events[type] )
							delete element.events[type][i];
				else
					for ( var j in element.events )
						this.remove( element, j );
		},
		
		trigger: function(type,data,element) {
			// Touch up the incoming data
			data = data || [];
	
			// Handle a global trigger
			if ( !element ) {
				var g = this.global[type];
				if ( g )
					for ( var i = 0; i < g.length; i++ )
						this.trigger( type, data, g[i] );
	
			// Handle triggering a single element
			} else if ( element["on" + type] ) {
				// Pass along a fake event
				data.unshift( this.fix({ type: type, target: element }) );
	
				// Trigger the event
				element["on" + type].apply( element, data );
			}
		},
		
		handle: function(event) {
			if ( typeof jQuery == "undefined" ) return;

			event = event || jQuery.event.fix( window.event );
	
			// If no correct event was found, fail
			if ( !event ) return;
		
			var returnValue = true;

			var c = this.events[event.type];
		
			for ( var j in c ) {
				if ( c[j].apply( this, [event] ) === false ) {
					event.preventDefault();
					event.stopPropagation();
					returnValue = false;
				}
			}
			
			return returnValue;
		},
		
		fix: function(event) {
			if ( event ) {
				event.preventDefault = function() {
					this.returnValue = false;
				};
			
				event.stopPropagation = function() {
					this.cancelBubble = true;
				};
			}
			
			return event;
		}
	
	}
});

new function() {
	var b = navigator.userAgent.toLowerCase();

	// Figure out what browser is being used
	jQuery.browser = {
		safari: /webkit/.test(b),
		opera: /opera/.test(b),
		msie: /msie/.test(b) && !/opera/.test(b),
		mozilla: /mozilla/.test(b) && !/compatible/.test(b)
	};

	// Check to see if the W3C box model is being used
	jQuery.boxModel = !jQuery.browser.msie || document.compatMode == "CSS1Compat";
};

jQuery.macros = {
	to: {
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after"
	},

	
	css: "width,height,top,left,position,float,overflow,color,background".split(","),

	filter: [ "eq", "lt", "gt", "contains" ],

	attr: {

		val: "value",

		html: "innerHTML",

		id: null,

		title: null,

		name: null,

		href: null,

		src: null,

		rel: null
	},
	
	axis: {

		parent: "a.parentNode",

		ancestors: jQuery.parents,

		parents: jQuery.parents,

		next: "jQuery.sibling(a).next",

		prev: "jQuery.sibling(a).prev",

		siblings: jQuery.sibling,

		children: "a.childNodes"
	},

	each: {

		removeAttr: function( key ) {
			this.removeAttribute( key );
		},
		show: function(){
			this.style.display = this.oldblock ? this.oldblock : "";
			if ( jQuery.css(this,"display") == "none" )
				this.style.display = "block";
		},
		hide: function(){
			this.oldblock = this.oldblock || jQuery.css(this,"display");
			if ( this.oldblock == "none" )
				this.oldblock = "block";
			this.style.display = "none";
		},
		toggle: function(){
			$(this)[ $(this).is(":hidden") ? "show" : "hide" ].apply( $(this), arguments );
		},
		addClass: function(c){
			jQuery.className.add(this,c);
		},
		removeClass: function(c){
			jQuery.className.remove(this,c);
		},
		toggleClass: function( c ){
			jQuery.className[ jQuery.className.has(this,c) ? "remove" : "add" ](this,c);
		},

		remove: function(a){
			if ( !a || jQuery.filter( [this], a ).r )
				this.parentNode.removeChild( this );
		},
		empty: function(){
			while ( this.firstChild )
				this.removeChild( this.firstChild );
		},
		bind: function( type, fn ) {
			if ( fn.constructor == String )
				fn = new Function("e", ( !fn.indexOf(".") ? "$(this)" : "return " ) + fn);
			jQuery.event.add( this, type, fn );
		},

		unbind: function( type, fn ) {
			jQuery.event.remove( this, type, fn );
		},
		trigger: function( type, data ) {
			jQuery.event.trigger( type, data, this );
		}
	}
};

jQuery.init();jQuery.fn.extend({

	// We're overriding the old toggle function, so
	// remember it for later
	_toggle: jQuery.fn.toggle,
	toggle: function(a,b) {
		// If two functions are passed in, we're
		// toggling on a click
		return a && b && a.constructor == Function && b.constructor == Function ? this.click(function(e){
			// Figure out which function to execute
			this.last = this.last == a ? b : a;
			
			// Make sure that clicks stop
			e.preventDefault();
			
			// and execute the function
			return this.last.apply( this, [e] ) || false;
		}) :
		
		// Otherwise, execute the old toggle function
		this._toggle.apply( this, arguments );
	},

	hover: function(f,g) {
		
		// A private function for haandling mouse 'hovering'
		function handleHover(e) {
			// Check if mouse(over|out) are still within the same parent element
			var p = (e.type == "mouseover" ? e.fromElement : e.toElement) || e.relatedTarget;
	
			// Traverse up the tree
			while ( p && p != this ) p = p.parentNode;
			
			// If we actually just moused on to a sub-element, ignore it
			if ( p == this ) return false;
			
			// Execute the right function
			return (e.type == "mouseover" ? f : g).apply(this, [e]);
		}
		
		// Bind the function to the two event listeners
		return this.mouseover(handleHover).mouseout(handleHover);
	},
	ready: function(f) {
		// 如果DOM已准备就绪
		if ( jQuery.isReady )
			// 立即执行该功能
			f.apply( document );
			
		//否则，记住功能后
		else {
			// 功能添加到等待名单
			jQuery.readyList.push( f );
		}
	
		return this;
	}
});

jQuery.extend({
	/*
	 * 所有这一切使DOM准备工作很好的代码。
	 */
	isReady: false,
	readyList: [],
	
	// 处理时，DOM就绪
	ready: function() {
		// 确保DOM尚未加载
		if ( !jQuery.isReady ) {
			// 请记住，DOM是准备就绪
			jQuery.isReady = true;
			
			// 如果存在功能约束，以执行
			if ( jQuery.readyList ) {
				// 执行所有的人
				for ( var i = 0; i < jQuery.readyList.length; i++ )
					jQuery.readyList[i].apply( document );
				
				// 复位功能列表
				jQuery.readyList = null;
			}
		}
	}
});

new function(){

	var e = ("blur,focus,load,resize,scroll,unload,click,dblclick," +
		"mousedown,mouseup,mousemove,mouseover,mouseout,change,reset,select," + 
		"submit,keydown,keypress,keyup,error").split(",");

	// Go through all the event names, but make sure that
	// it is enclosed properly
	for ( var i = 0; i < e.length; i++ ) new function(){
			
		var o = e[i];
		
		// Handle event binding
		jQuery.fn[o] = function(f){
			return f ? this.bind(o, f) : this.trigger(o);
		};
		
		// Handle event unbinding
		jQuery.fn["un"+o] = function(f){ return this.unbind(o, f); };
		
		// Finally, handle events that only fire once
		jQuery.fn["one"+o] = function(f){
			// Attach the event listener
			return this.each(function(){

				var count = 0;

				// Add the event
				jQuery.event.add( this, o, function(e){
					// If this function has already been executed, stop
					if ( count++ ) return;
				
					// And execute the bound function
					return f.apply(this, [e]);
				});
			});
		};
			
	};
	
	// If Mozilla is used
	if ( jQuery.browser.mozilla || jQuery.browser.opera ) {
		// Use the handy event callback
		document.addEventListener( "DOMContentLoaded", jQuery.ready, false );
	
	// If IE is used, use the excellent hack by Matthias Miller
	// http://www.outofhanwell.com/blog/index.php?title=the_window_onload_problem_revisited
	} else if ( jQuery.browser.msie ) {
	
		// Only works if you document.write() it
		document.write("<scr" + "ipt id=__ie_init defer=true " + 
			"src=//:><\/script>");
	
		// Use the defer script hack
		var script = document.getElementById("__ie_init");
		script.onreadystatechange = function() {
			if ( this.readyState == "complete" )
				jQuery.ready();
		};
	
		// Clear from memory
		script = null;
	
	// If Safari  is used
	} else if ( jQuery.browser.safari ) {
		// Continually check to see if the document.readyState is valid
		jQuery.safariTimer = setInterval(function(){
			// loaded and complete are both valid states
			if ( document.readyState == "loaded" || 
				document.readyState == "complete" ) {
	
				// If either one are found, remove the timer
				clearInterval( jQuery.safariTimer );
				jQuery.safariTimer = null;
	
				// and execute any waiting functions
				jQuery.ready();
			}
		}, 10);
	} 

	// A fallback to window.onload, that will always work
	jQuery.event.add( window, "load", jQuery.ready );
	
};
jQuery.fn.extend({

	// overwrite the old show method
	_show: jQuery.fn.show,

	show: function(speed,callback){
		return speed ? this.animate({
			height: "show", width: "show", opacity: "show"
		}, speed, callback) : this._show();
	},
	
	// Overwrite the old hide method
	_hide: jQuery.fn.hide,

	hide: function(speed,callback){
		return speed ? this.animate({
			height: "hide", width: "hide", opacity: "hide"
		}, speed, callback) : this._hide();
	},

	slideDown: function(speed,callback){
		return this.animate({height: "show"}, speed, callback);
	},

	slideUp: function(speed,callback){
		return this.animate({height: "hide"}, speed, callback);
	},

	slideToggle: function(speed,callback){
		return this.each(function(){
			var state = $(this).is(":hidden") ? "show" : "hide";
			$(this).animate({height: state}, speed, callback);
		});
	},

	fadeIn: function(speed,callback){
		return this.animate({opacity: "show"}, speed, callback);
	},

	fadeOut: function(speed,callback){
		return this.animate({opacity: "hide"}, speed, callback);
	},

	fadeTo: function(speed,to,callback){
		return this.animate({opacity: to}, speed, callback);
	},
	animate: function(prop,speed,callback) {
		return this.queue(function(){
		
			this.curAnim = prop;
			
			for ( var p in prop ) {
				var e = new jQuery.fx( this, jQuery.speed(speed,callback), p );
				if ( prop[p].constructor == Number )
					e.custom( e.cur(), prop[p] );
				else
					e[ prop[p] ]( prop );
			}
			
		});
	},
	queue: function(type,fn){
		if ( !fn ) {
			fn = type;
			type = "fx";
		}
	
		return this.each(function(){
			if ( !this.queue )
				this.queue = {};
	
			if ( !this.queue[type] )
				this.queue[type] = [];
	
			this.queue[type].push( fn );
		
			if ( this.queue[type].length == 1 )
				fn.apply(this);
		});
	}

});

jQuery.extend({

	setAuto: function(e,p) {
		if ( e.notAuto ) return;

		if ( p == "height" && e.scrollHeight != parseInt(jQuery.curCSS(e,p)) ) return;
		if ( p == "width" && e.scrollWidth != parseInt(jQuery.curCSS(e,p)) ) return;

		// Remember the original height
		var a = e.style[p];

		// Figure out the size of the height right now
		var o = jQuery.curCSS(e,p,1);

		if ( p == "height" && e.scrollHeight != o ||
			p == "width" && e.scrollWidth != o ) return;

		// Set the height to auto
		e.style[p] = e.currentStyle ? "" : "auto";

		// See what the size of "auto" is
		var n = jQuery.curCSS(e,p,1);

		// Revert back to the original size
		if ( o != n && n != "auto" ) {
			e.style[p] = a;
			e.notAuto = true;
		}
	},
	
	speed: function(s,o) {
		o = o || {};
		
		if ( o.constructor == Function )
			o = { complete: o };
		
		var ss = { slow: 600, fast: 200 };
		o.duration = (s && s.constructor == Number ? s : ss[s]) || 400;
	
		// Queueing
		o.oldComplete = o.complete;
		o.complete = function(){
			jQuery.dequeue(this, "fx");
			if ( o.oldComplete && o.oldComplete.constructor == Function )
				o.oldComplete.apply( this );
		};
	
		return o;
	},
	
	queue: {},
	
	dequeue: function(elem,type){
		type = type || "fx";
	
		if ( elem.queue && elem.queue[type] ) {
			// Remove self
			elem.queue[type].shift();
	
			// Get next function
			var f = elem.queue[type][0];
		
			if ( f ) f.apply( elem );
		}
	},

	/*
	 * I originally wrote fx() as a clone of moo.fx and in the process
	 * of making it small in size the code became illegible to sane
	 * people. You've been warned.
	 */
	
	fx: function( elem, options, prop ){
	
		var z = this;
	
		// The users options
		z.o = {
			duration: options.duration || 400,
			complete: options.complete,
			step: options.step
		};
	
		// The element
		z.el = elem;
	
		// The styles
		var y = z.el.style;
	
		// Simple function for setting a style value
		z.a = function(){
			if ( options.step )
				options.step.apply( elem, [ z.now ] );

			if ( prop == "opacity" ) {
				if (z.now == 1) z.now = 0.9999;
				if (window.ActiveXObject)
					y.filter = "alpha(opacity=" + z.now*100 + ")";
				else
					y.opacity = z.now;

			// My hate for IE will never die
			} else if ( parseInt(z.now) )
				y[prop] = parseInt(z.now) + "px";
				
			y.display = "block";
		};
	
		// Figure out the maximum number to run to
		z.max = function(){
			return parseFloat( jQuery.css(z.el,prop) );
		};
	
		// Get the current size
		z.cur = function(){
			var r = parseFloat( jQuery.curCSS(z.el, prop) );
			return r && r > -10000 ? r : z.max();
		};
	
		// Start an animation from one number to another
		z.custom = function(from,to){
			z.startTime = (new Date()).getTime();
			z.now = from;
			z.a();
	
			z.timer = setInterval(function(){
				z.step(from, to);
			}, 13);
		};
	
		// Simple 'show' function
		z.show = function( p ){
			if ( !z.el.orig ) z.el.orig = {};

			// Remember where we started, so that we can go back to it later
			z.el.orig[prop] = this.cur();

			z.custom( 0, z.el.orig[prop] );

			// Stupid IE, look what you made me do
			if ( prop != "opacity" )
				y[prop] = "1px";
		};
	
		// Simple 'hide' function
		z.hide = function(){
			if ( !z.el.orig ) z.el.orig = {};

			// Remember where we started, so that we can go back to it later
			z.el.orig[prop] = this.cur();

			z.o.hide = true;

			// Begin the animation
			z.custom(z.el.orig[prop], 0);
		};
	
		// IE has trouble with opacity if it does not have layout
		if ( jQuery.browser.msie && !z.el.currentStyle.hasLayout )
			y.zoom = "1";
	
		// Remember  the overflow of the element
		if ( !z.el.oldOverlay )
			z.el.oldOverflow = jQuery.css( z.el, "overflow" );
	
		// Make sure that nothing sneaks out
		y.overflow = "hidden";
	
		// Each step of an animation
		z.step = function(firstNum, lastNum){
			var t = (new Date()).getTime();
	
			if (t > z.o.duration + z.startTime) {
				// Stop the timer
				clearInterval(z.timer);
				z.timer = null;

				z.now = lastNum;
				z.a();

				z.el.curAnim[ prop ] = true;
				
				var done = true;
				for ( var i in z.el.curAnim )
					if ( z.el.curAnim[i] !== true )
						done = false;
						
				if ( done ) {
					// Reset the overflow
					y.overflow = z.el.oldOverflow;
				
					// Hide the element if the "hide" operation was done
					if ( z.o.hide ) 
						y.display = 'none';
					
					// Reset the property, if the item has been hidden
					if ( z.o.hide ) {
						for ( var p in z.el.curAnim ) {
							y[ p ] = z.el.orig[p] + ( p == "opacity" ? "" : "px" );
	
							// set its height and/or width to auto
							if ( p == 'height' || p == 'width' )
								jQuery.setAuto( z.el, p );
						}
					}
				}

				// If a callback was provided, execute it
				if( done && z.o.complete && z.o.complete.constructor == Function )
					// Execute the complete function
					z.o.complete.apply( z.el );
			} else {
				// Figure out where in the animation we are and set the number
				var p = (t - this.startTime) / z.o.duration;
				z.now = ((-Math.cos(p*Math.PI)/2) + 0.5) * (lastNum-firstNum) + firstNum;
	
				// Perform the next step of the animation
				z.a();
			}
		};
	
	}

});
// AJAX Plugin
// Docs Here:
// http://jquery.com/docs/ajax/
jQuery.fn.loadIfModified = function( url, params, callback ) {
	this.load( url, params, callback, 1 );
};

jQuery.fn.load = function( url, params, callback, ifModified ) {
	if ( url.constructor == Function )
		return this.bind("load", url);

	callback = callback || function(){};

	// Default to a GET request
	var type = "GET";

	// If the second parameter was provided
	if ( params ) {
		// If it's a function
		if ( params.constructor == Function ) {
			// We assume that it's the callback
			callback = params;
			params = null;
			
		// Otherwise, build a param string
		} else {
			params = jQuery.param( params );
			type = "POST";
		}
	}
	
	var self = this;
	
	// Request the remote document
	jQuery.ajax( type, url, params,function(res, status){
		
		if ( status == "success" || !ifModified && status == "notmodified" ) {
			// Inject the HTML into all the matched elements
			self.html(res.responseText).each( callback, [res.responseText, status] );
			
			// Execute all the scripts inside of the newly-injected HTML
			$("script", self).each(function(){
				if ( this.src )
					$.getScript( this.src );
				else
					eval.call( window, this.text || this.textContent || this.innerHTML || "" );
			});
		} else
			callback.apply( self, [res.responseText, status] );

	}, ifModified);
	
	return this;
};

// If IE is used, create a wrapper for the XMLHttpRequest object
if ( jQuery.browser.msie )
	XMLHttpRequest = function(){
		return new ActiveXObject(
			navigator.userAgent.indexOf("MSIE 5") >= 0 ?
			"Microsoft.XMLHTTP" : "Msxml2.XMLHTTP"
		);
	};

// Attach a bunch of functions for handling common AJAX events
new function(){
	var e = "ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess".split(',');
	
	for ( var i = 0; i < e.length; i++ ) new function(){
		var o = e[i];
		jQuery.fn[o] = function(f){
			return this.bind(o, f);
		};
	};
};

jQuery.extend({
	get: function( url, data, callback, type, ifModified ) {
		if ( data.constructor == Function ) {
			type = callback;
			callback = data;
			data = null;
		}
		
		if ( data ) url += "?" + jQuery.param(data);
		
		// Build and start the HTTP Request
		jQuery.ajax( "GET", url, null, function(r, status) {
			if ( callback ) callback( jQuery.httpData(r,type), status );
		}, ifModified);
	},

	getIfModified: function( url, data, callback, type ) {
		jQuery.get(url, data, callback, type, 1);
	},

	getScript: function( url, data, callback ) {
		jQuery.get(url, data, callback, "script");
	},
	post: function( url, data, callback, type ) {
		// Build and start the HTTP Request
		jQuery.ajax( "POST", url, jQuery.param(data), function(r, status) {
			if ( callback ) callback( jQuery.httpData(r,type), status );
		});
	},
	
	// timeout (ms)
	timeout: 0,

	ajaxTimeout: function(timeout) {
		jQuery.timeout = timeout;
	},

	// Last-Modified header cache for next request
	lastModified: {},
	ajax: function( type, url, data, ret, ifModified ) {
		// If only a single argument was passed in,
		// assume that it is a object of key/value pairs
		if ( !url ) {
			ret = type.complete;
			var success = type.success;
			var error = type.error;
			data = type.data;
			url = type.url;
			type = type.type;
		}
		
		// Watch for a new set of requests
		if ( ! jQuery.active++ )
			jQuery.event.trigger( "ajaxStart" );

		var requestDone = false;
	
		// Create the request object
		var xml = new XMLHttpRequest();
	
		// Open the socket
		xml.open(type || "GET", url, true);
		
		// Set the correct header, if data is being sent
		if ( data )
			xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		
		// Set the If-Modified-Since header, if ifModified mode.
		if ( ifModified )
			xml.setRequestHeader("If-Modified-Since",
				jQuery.lastModified[url] || "Thu, 01 Jan 1970 00:00:00 GMT" );
		
		// Set header so calling script knows that it's an XMLHttpRequest
		xml.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	
		// Make sure the browser sends the right content length
		if ( xml.overrideMimeType )
			xml.setRequestHeader("Connection", "close");
		
		// Wait for a response to come back
		var onreadystatechange = function(istimeout){
			// The transfer is complete and the data is available, or the request timed out
			if ( xml && (xml.readyState == 4 || istimeout == "timeout") ) {
				requestDone = true;

				var status = jQuery.httpSuccess( xml ) && istimeout != "timeout" ?
					ifModified && jQuery.httpNotModified( xml, url ) ? "notmodified" : "success" : "error";
				
				// Make sure that the request was successful or notmodified
				if ( status != "error" ) {
					// Cache Last-Modified header, if ifModified mode.
					var modRes = xml.getResponseHeader("Last-Modified");
					if ( ifModified && modRes ) jQuery.lastModified[url] = modRes;
					
					// If a local callback was specified, fire it
					if ( success ) success( xml, status );
					
					// Fire the global callback
					jQuery.event.trigger( "ajaxSuccess" );
				
				// Otherwise, the request was not successful
				} else {
					// If a local callback was specified, fire it
					if ( error ) error( xml, status );
					
					// Fire the global callback
					jQuery.event.trigger( "ajaxError" );
				}
				
				// The request was completed
				jQuery.event.trigger( "ajaxComplete" );
				
				// Handle the global AJAX counter
				if ( ! --jQuery.active )
					jQuery.event.trigger( "ajaxStop" );
	
				// Process result
				if ( ret ) ret(xml, status);
				
				// Stop memory leaks
				xml.onreadystatechange = function(){};
				xml = null;
				
			}
		};
		xml.onreadystatechange = onreadystatechange;
		
		// Timeout checker
		if(jQuery.timeout > 0)
			setTimeout(function(){
				// Check to see if the request is still happening
				if (xml) {
					// Cancel the request
					xml.abort();

					if ( !requestDone ) onreadystatechange( "timeout" );

					// Clear from memory
					xml = null;
				}
			}, jQuery.timeout);
		
		// Send the data
		xml.send(data);
	},
	
	// Counter for holding the number of active queries
	active: 0,
	
	// Determines if an XMLHttpRequest was successful or not
	httpSuccess: function(r) {
		try {
			return !r.status && location.protocol == "file:" ||
				( r.status >= 200 && r.status < 300 ) || r.status == 304 ||
				jQuery.browser.safari && r.status == undefined;
		} catch(e){}

		return false;
	},

	// Determines if an XMLHttpRequest returns NotModified
	httpNotModified: function(xml, url) {
		try {
			var xmlRes = xml.getResponseHeader("Last-Modified");

			// Firefox always returns 200. check Last-Modified date
			return xml.status == 304 || xmlRes == jQuery.lastModified[url] ||
				jQuery.browser.safari && xml.status == undefined;
		} catch(e){}

		return false;
	},
	
	// Get the data out of an XMLHttpRequest.
	// Return parsed XML if content-type header is "xml" and type is "xml" or omitted,
	// otherwise return plain text.
	httpData: function(r,type) {
		var ct = r.getResponseHeader("content-type");
		var data = !type && ct && ct.indexOf("xml") >= 0;
		data = type == "xml" || data ? r.responseXML : r.responseText;

		// If the type is "script", eval it
		if ( type == "script" ) eval.call( window, data );

		return data;
	},
	
	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function(a) {
		var s = [];
		
		// If an array was passed in, assume that it is an array
		// of form elements
		if ( a.constructor == Array ) {
			// Serialize the form elements
			for ( var i = 0; i < a.length; i++ )
				s.push( a[i].name + "=" + encodeURIComponent( a[i].value ) );
			
		// Otherwise, assume that it's an object of key/value pairs
		} else {
			// Serialize the key/values
			for ( var j in a )
				s.push( j + "=" + encodeURIComponent( a[j] ) );
		}
		
		// Return the resulting serialization
		return s.join("&");
	}

});
