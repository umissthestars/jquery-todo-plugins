!function(){
    function _MD() {
        
        /**
        * @description 提示块
        * @author pu.g rtx160930
        * @plugin in jquery
        * @param {String} type .号分割, 后缀close 代表关闭按钮
        * @param {Object} data
        * @param {Function|Number} cb|time
        * @example $.tips( 'succes.close', { title:'', body: 'success!!!!!!!!' }, function($t){$t.remove()} )
        * @example $.tips( 'warning.close', { title:'null' }, 3 )
        */ 
        $.tips = function ( type, data, cb ){

        	if( typeof type !== 'string' ){

        		throw new Error( '请给点正规参，参见注释' );
        	}

        	function toHover ( wrap, dom ){

        		var $w = $( wrap );
        		var $d = $( dom );
        		$d.on('mousemove', function(e){

        			var offset = $w.offset()
        			
        			var x = e.pageX - offset.left;
        			var y = e.pageY - offset.top;
        			
        			var centerX = $w.outerWidth() /3;
        			var centerY = $w.outerHeight() /3;
        			
        			var deltaX = x - centerX;
        			var deltaY = y - centerY;
        			
        			var percentX = deltaX / centerX;
        			var percentY = deltaY / centerY;
        			
        			var deg = 10;
        			
        			$d.css({
        			  	transform: 'rotateX('+deg*-percentY + 'deg)'+
        			  	' rotateY('+deg*percentX+'deg)'
        			});
        		});

        		$d.on('mouseleave', function(){
        		  	$d.css({
        		    	transform: ''
        		  	});
        		});
        	}

        	var types = type.split( '.' );
        	var _html_ = '<div class="jq-tips-wrap"></div>';
        	var _html = [
        					'<div class="jq-tips jq-tips-in '					//0
        					,'"><h2 class="jq-tips-title">'		//1
        					,'</h2><textarea readonly onfocus="this.blur()" class="jq-tips-body">'	//2
        					,'</textarea>'								//3
        					,'</div>'							//4
        				];
        	var html_ = '<i class="jq-tips-close icon-close"></i>';
        	var html = ''; 
        	var className = '';
        	var skip_len = data.skip_len || 400;
        	var cssSkip = [ '-webkit-mask-image: -webkit-gradient(radial, 0 100, ', ', 0 0, ', ', from(rgb(0, 0, 0)), color-stop(0.7, rgba(0, 0, 0, 0.1)), to(rgb(0, 0, 0)));' ];

        	switch( types[ 0 ] ){

        		case 'success': {

        			className = 'jq-tips-success';
        			break;
        		}
        		case 'warning': {

        			className = 'jq-tips-warning';
        			break;
        		}

        		default: {

        			className = 'jq-tips-default';
        		}
        	}

        	html = _html[ 0 ] + className + _html[ 1 ] +  ( data.title || '' ) + _html[ 2 ] + ( data.body || '' ) + _html[ 3 ] + ( types[ 1 ] ? html_ : '' ) + _html[ 4 ];

        	var $wrap;
        	var $_t;
        	var $_wrap = $( '.jq-tips-wrap' );
        	var $html = $( html );

        	if( $_wrap[ 0 ] ){

        		$wrap = $_wrap;
        	}else{

        		$_t = $( _html_ );
        		$( 'body' ).append( $_t );
        		$wrap = $_t;
        	}

        	$wrap.append( $html );
        	toHover( $wrap, $html );

        	var i = 0 ; 

            if( $( window ).width() < 450 ){

                $wrap.css( 'width', '30%' );
            }else{

                var interval = window.setInterval(function(){

                    if( i >= skip_len )
                        window.clearInterval( interval );

                    i += 4;

                    $html.attr( 'style', cssSkip[ 0 ] + ( i - 15 ) + cssSkip[ 1 ] + i + cssSkip[ 2 ] );
                    
                }, 15);
            }

        	var height = $( window ).height();
        	var $body = $html.find( '.jq-tips-body' );
        	var innerHeight = $body[0].scrollHeight;
        	if( innerHeight < height / 2 ){

        		$body.css( { 'height': innerHeight } );
        	}else{

        		$body.css( { 'height': height / 2 } );
        	}
        	

        	$( 'body' ).on( 'click', '.jq-tips i.jq-tips-close', function ( e ){

        		$( this ).parents( '.jq-tips' ).remove();
        	} );

        	if( typeof cb === 'function' ){

        		cb( $html, $wrap );
        	}else if( parseInt( cb, 10 ) ){

        		setTimeout( function(){ 

        			$html.removeClass( 'jq-tips-in' ).addClass( 'jq-tips-out' );
        			setTimeout( function(){

        				$html.remove();
        			}, 300 )
        		}, cb * 1000 );
        	}
        }

        /**
        * @description 为小屏重置table格式
        * @author pu.g rtx160930
        * @plugin in jquery
        * @param {boolean} isOpen 是否开启 默认true 这个值作为是否需要自动判断屏幕宽度运行
        * @param {element|JQueryInstance|Array} host 宿主元素|jq实例|[host,thead,tbody]
        * @param {Function} cb
        * @onlySpecialParam {String} symbol 句柄
        * @return {Number} symbol 标志 作为返回句柄
        * @example 
        	0,var a = $.fn.table_transformer([$('table'),$('table thead')],function(){})
        	1,var a = $.fn.table_transformer(document.getElementsByTagName('table')[0],function(){})
        	2,var a = $.fn.table_transformer(false,$('table'),function(){})
        	3,var a = $.fn.table_transformer(false,$('table'))
        	4,var a = $.fn.table_transformer($('table'))
        	5,var a = $( 'table' ).table_transformer()
        	* $.fn.table_transformer(a) // 可以通过之前拿到的句柄 来还原状态
        * @TODO 我直接拿this不就得了...当我差不多写完参数调对才想起来.........add:现这样吧当0参的时候走this
        */ 
        if( !$.fn.table_transformer ) //TODO: 为保证$.fn.table_transformer命名空间中的 symbol不被覆盖。但也许放在另外地方也是个好选择。
        $.fn.table_transformer = function ( isOpen, host, cb ){

        	var $host;
        	var $thead;
        	var $tbody;

        	function isPass ( what ){

        		if( Object.prototype.toString.call( what ) === '[object Array]' ){
        			if( ( what[ 0 ].nodeType || what[ 0 ].append ) && ( !what[ 1 ] || what[ 1 ].nodeType || what[ 1 ].append ) && ( !what[ 2 ] || what[ 2 ].nodeType || what[ 2 ].append ) ){

        				$host = $( what[ 0 ] );
        				$thead = $( what[ 1 ] );
        				$tbody = $( what[ 2 ] );
        				return true;
        			}else
        				return false;
        		}else if( what.nodeType || what.append ){

        			$host = $( what );
        			return true;
        		}	

        		return false;
        	}

        	function getStyle(obj, name) {

        		if( obj.currentStyle ) { 
        			return obj.currentStyle[ name ]; 
        		}else{ 
        			return getComputedStyle( obj, false )[ name ]; 
        		} 
        	} 

        	switch( arguments.length ){

        		case 0: {
        			if( !isPass( this ) )
        				throw new Error( '年轻人啊！' );
        			break;
        		}

        		case 1: {

        			if( Object.prototype.toString.call( isOpen ) !== '[object Array]' ){

        				if( typeof isOpen !== 'object' && isOpen in $.fn.table_transformer.symbol ){

        					$( $.fn.table_transformer.symbol[ isOpen ].host ).replaceWith( $.fn.table_transformer.symbol[ isOpen ].html );
        					delete $.fn.table_transformer.symbol[ isOpen ];

        					return void 0;
        				}

        				if( !isPass( isOpen ) )
        					throw new Error( '好好活着不好吗！' );
        			}else{

        				if( !isPass( isOpen ) )
        					throw new Error( '好好活着不好吗！' );
        			}
        			break;
        		}

        		case 2: {

        			if( typeof host === 'function' ){
        				
        				if( !isPass( isOpen ) )
        					throw new Error( '不要动不动就想搞个大新闻！' );

        				cb = host;
        			}else{

        				if( !isPass( host ) )
        					throw new Error( '不要动不动就想搞个大新闻！' );
        			}
        			break;
        		}

        		case 3: {

        			if( !isPass( host ) )
        				throw new Error( 'sometimes simple!' );
        			if( typeof cb !== 'function' )
        				throw new Error( 'sometimes simple!' );

        			if( Object.prototype.toString.call( host ) !== '[object Array]' ){

        				isPass( host );
        			}

        			break;
        		}

        		default: {

        			if( !isPass( host ) )
        				throw new Error( 'sometimes naive!' );
        			if( typeof cb !== 'function' )
        				throw new Error( 'sometimes naive!' );

        			if( Object.prototype.toString.call( host ) !== '[object Array]' ){

        				isPass( host );
        			}
        		}
        	}

        	if( !$host )
        		return void 0;

        	if( isOpen !== false && $( window ).width() > 450 )
        		return void 0;

        	$thead = $thead || $host.find( 'thead th' );
        	$tbody = $tbody || $host.find( 'tbody tr' );

        	if( !$thead || !$tbody )
        		throw new Error( '不要搞得像钦定一样!' )

        	var symbol = +new Date();
        	
        	if( !$.fn.table_transformer.symbol )
        		$.fn.table_transformer.symbol = {};
        	$.fn.table_transformer.symbol[ symbol ] = {

        		host: '#jq_' + symbol,
        		html: $host.clone( true )
        	};

        	var head = [];
        	var body = [];

        	$thead.each( function ( i, v, a ){
        		var $v = $( v );
        		if( $v.children().length ){

        			head.push( $v.children().clone( true ) );
        		}else{

        			head.push( $v.html() );
        		}
        		
        	} );

        	$tbody.each( function ( i, v, a ){

        		body.push( [] );
        		$( v ).find( 'td' ).each( function ( ind, val, arr ){

        			var $val = $( val );
        			if( $val.children().length ){

        				body[ i ].push( $val.children().clone( true ) );
        			}else{

        				body[ i ].push( '<!--background-color:' + getStyle( val, 'background-color' ) + ';color:' + getStyle( val, 'color' ) + ';-->' + $val.html() );
        			}

        		} );
        	} );
        	//为模板留出接口 //TODO
        	var html,$html;
        	var html_wrap = [ '<div class="jq-table-transformer" id="jq_' + symbol + '">', '</div>' ];
        	var html_content = [ '<ul>', '</ul>' ];
        	var html_list = [ '<li>', '</li>' ];

        	html += html_wrap[ 0 ] + html_content[ 0 ];
        	$( body ).each( function ( i, v, a ){//一律copy,防止事件绑定，可优化到配置；一律连接字符串，可优化压缩
        		
        		html += html_list[ 0 ];

        		$( v ).each( function ( ind, val, arr ){

        			html += '<p><span class="jq-table-transformer-name"></span><i>:&nbsp</i>';
        			html += '<span class="jq-table-transformer-value"></span></p>';
        		} );

        		html += html_list[ 1 ];
        	} );

        	html += html_content[ 1 ] + html_wrap[ 1 ];

        	$html = $( html );
        	$html.find( 'ul li' ).each( function ( i, v, a ){

        		$( v ).find( 'p' ).each( function ( ind, val, arr ){

        			if( head[ ind ] && head[ ind ][ 0 ] && head[ ind ][ 0 ].nodeType ){
        				$( val ).children( '*:eq(0)' ).append( $( head[ ind ] ).clone( true ) );
        			}else{

        				$( val ).children( '*:eq(0)' ).append( head[ ind ] );
        			}

        			if( typeof body[ i ][ ind ] === "string" ){

        				$( val ).children( '*:eq(2)' ).append( body[ i ][ ind ].replace( /^\<\!\-\-(.*?)\-\-\>([\W\w]*)$/gi , '<font style="word-break:break-all;word-wrap:break-word;display:block;$1" >$2</font>') );
        			}else{

        				$( val ).children( '*:eq(2)' ).append( body[ i ][ ind ] );
        			}
        			
        			
        		} );
        	} );

        	$host.replaceWith( $html );

        	try{

        		cb && cb( $html, symbol, '大哥,第一个参是jq实例,[0]指向host{HTMLElement};第二个参是symbol,即在插件symbol空间里的当前宿主的标志。请接好棒，别搞error出来' );
        	}catch(e){

        		console.log( '%c 大哥，你回调有error啊！', 'color: green', e );
        		console.info( '%c 大哥，你回调有error啊！', 'color: blue', e );
        		console.error( '%c 大哥，你回调有error啊！', 'color: red;font-size: 30px', e );

        		alert( '大哥，你回调有error啊！' );

        		throw new Error( '大哥，你回调有error啊！' );
        	}

        	return symbol;
        }

        /**
        * @description 表格转换状态开关
        * @description html: <div id="jq-switcher-wrap"><a class="jq-table-switch on" id="table_switch"><i></i></a></div>
        * @param {String|HTMLelement|JQueryInstance} switcher
        * @param {String|HTMLelement|JQueryInstance} host
        * @param {function} trigger 开启table_transformer的函数
        * @return {boolean} state 状态
        */ 

        $.fn.table_switch = function ( switcher, host, trigger ){

        	var $switcher = $( switcher );
        	var $host = $( host );

        	if( !$switcher[ 0 ] || typeof trigger !== 'function' ){

        		throw new Error( '参数有误', switcher, host );
        		return void 0;
        	}

        	var state = !!$( '.jq-table-transformer' )[ 0 ];
        	
        	var $html = $( '<a title="' + ( state ? '显示行列信息' : '显示单条信息' ) + '" class="table_switch ' + ( state ? 'on' : '' ) + '" id="table_switch"><i></i></a>' );

        	$switcher.html( $html );

        	$html.on( 'click', function ( e ){

        		var state = !!$( '.jq-table-transformer' )[ 0 ];
        		
        		if( state ){

        			$html.removeClass( 'on' ).addClass( 'off' );
        			$html.attr( 'title', '显示单条信息' );
        			$.fn.table_transformer( window.symbol );
        		}else{

        			$html.removeClass( 'off' ).addClass( 'on' );
        			$html.attr( 'title', '显示行列信息' );
        			trigger();
        		}
        			
        	} );

        	window.toResizeTable && window.toResizeTable();
        	return state;
        }
    }

    // 加个兼容包裹，等下注册/重置功可能要打包common的tips...
    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = _MD;
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function() { return _MD; });
    } else {
        _MD();
    }
}()