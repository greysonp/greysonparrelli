stylus = stylus stylus/*.styl --out css/

default: 
	$(stylus)

watch:
	$(stylus)
