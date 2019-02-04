function setColors(){
	$('.card-body,.navbar').css('background-color',V.opts.colors.MAINBG).css('color',V.opts.colors.MAINTXT);
	$('.btn-outline-secondary').css({'color':V.opts.colors.DARK,'border-color':V.opts.colors.DARK});	
	$('.btn-outline-primary').css({'color':V.opts.colors.DARKER,'border-color':V.opts.colors.DARKER});
    $('.btn-primary,.btn-toggle.active').css({'background-color':V.opts.colors.DARKER,'border-color':V.opts.colors.DARKER});
    $('h1,h2,h3,h4,h5,h6').css({'color':V.opts.colors.DARKER});
	$('.btn-outline-primary,.btn-outline-secondary').hover(function(){
		$(this).css({'background-color':'rgba(0,0,0,.05)'});
	},function(){
		$(this).css({'background-color':''});
	})

	Chart.defaults.global.defaultColor = V.opts.colors.MAINTXT;		
	var chart = $('.grid-item:has([data-chart])');
	chart.each(function(_i,ch){
		var c = $(ch).data('chart')
		if(c){c.update();}
	})
}

export {setColors};