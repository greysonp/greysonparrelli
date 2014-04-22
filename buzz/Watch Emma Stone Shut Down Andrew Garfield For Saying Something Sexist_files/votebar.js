var VoteBar = function() {

	this.CONFIG = {
		'cute': {
			action: 16,
			uri: 'cuteornot',
			message: 'Cute!'
		},
		'nom': {
			action: 147,
			uri: 'nomornot',
			message: 'Nom!'
		},
		'fab': {
			'super': {
				message: 'Fab!',
				action: 143
			},
			notsuper: {
				message: 'Drab!',
				action: 144
			},
			uri: 'fabordrab',
			source: 1,
			pinterest: 1,
			title_length: 95,
			thumb_shrunk: 1
		}
	};
	this.vote_type = 'cute';
	this.cute_reaction = false;
	this.sidebar = false;
	this.initialized = false;
	this.data = {};

	this.init = function(type, list, sidebar) {
		//console.log('votebar.init', type, sidebar);
		if (type) votebar.vote_type = type;
		votebar.data = votebar.CONFIG[votebar.vote_type];
		votebar.sidebar = sidebar ? true : false;

		this.current_pic, this.storageName = votebar.vote_type + 'Shown';
		this.ls = ('localStorage' in window) && window['localStorage'] !== null ? true : false;
		this.shown = (this.ls && localStorage.getItem(this.storageName) != null) ? localStorage.getItem(this.storageName) : "";

		if (list !== 'undefined') votebar.voting_list = list;

		this.vote_spinner = new bf_spinner('vote_spinner', {
			lines: 15,
			length: 30,
			width: 10,
			radius: 40,
			color: '#36D0F9',
			speed: 1.4,
			trail: 59,
			shadow: true,
			hwaccel: true
		} );

		this.load_following();

		//votes sidebar
		$('notsuper').observe('click', function(obj) {
			votebar.track_vote('not');
			if (typeof votebar.data.notsuper !== 'undefined') {
				votebar.vote_sidebar( obj );
			} else {
				votebar.vote_spinner.start();
				votebar.update_vote_count('Thank You For Your Vote!');
				if (votebar.sidebar) votebar.set_share_btns('prev', votebar.current_pic);
				votebar.next_pic();
			}
		});
		$('super').observe('click', function(obj) {
			votebar.cute_reaction = true;
			votebar.track_vote('super');
			votebar.vote_sidebar( obj );
		});

		//votes lists
		if (!votebar.sidebar) {
			$$( '.super' ).invoke( 'observe', 'click', function(obj) {
				votebar.cute_reaction = true;
				votebar.vote_lists(obj);
			});
			$$( '.notsuper' ).invoke('observe', 'click', function(obj) {
				if (typeof votebar.data.notsuper !== 'undefined') {
					votebar.vote_lists( obj );
				} else {
					var thumb = $(obj.target).up('div.item');
					var vote_data = {};
					if (thumb) vote_data = thumb.readAttribute('rel:vote_data').evalJSON();
					votebar.set_ls(vote_data);
					votebar.disable_thumb(obj);
				}
			});
		}

		if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
			$$('#cuteornot .button2').each(function(e){
				$(e).removeClassName('notouch');
			});
		}

		this.initialized = true;
		votebar.preload_next_pic();
	}

	this.load_following = function() {
		//console.log('votebar.load_following');
		if (votebar.voting_list.length > 0) {
			var vote_id = window.location.search.match(/[?&]id=(\d*)/);
			if (!votebar.sidebar && vote_id && vote_id[1]) {
				votebar.vote_spinner.start();
				var ajax = new BF_Request();
				var vote_controller = (BF_STATIC ? BF_STATIC.web_root : '') + '/' + votebar.data.uri + '/id/' + vote_id[1] + '.js';
				ajax.request(vote_controller, {
					method: 'post',
					parameters: {},
					onSuccess: function(r) {
						var resp = r.responseText.evalJSON();
						if (resp.success) {
							var init = resp.data.evalJSON();
							votebar.voting_list.unshift(init);
							votebar.next_pic(1);
						} else {
							votebar.next_pic();
						}
					},
					onError: function(r) {
						votebar.next_pic();
					}
				});
			} else {
				votebar.next_pic();
			}
		}
	}

	this.next_pic = function(initial, campaignid) {
		//console.log('votebar.next_pic', initial, campaignid)
		try {
			if ( votebar.vote_spinner.active() ) setTimeout( votebar.vote_spinner.stop, 500 );
			if ( !campaignid ) this.set_ls( this.current_pic );
			if ( !votebar.sidebar ) this.move_voted();
			if (votebar.voting_list.length > 0) {
				if ( campaignid && ( ! this.current_pic || this.current_pic && this.current_pic.campaignid != campaignid ) ) {
					var chosen_buzz = this.voting_list.filter( function( el ) { if ( el.campaignid == campaignid ) return true; else return false; } )
					this.current_pic = chosen_buzz.length ? chosen_buzz[0] : null;
					//console.log(chosen_buzz);
				}
				if ( !this.current_pic ) {
					this.current_pic = votebar.voting_list.shift();
					campaignid = null;
				}
				if (this.shown && !initial) {
					while (this.shown.match(this.current_pic.campaignid) == this.current_pic.campaignid) {
						if (votebar.voting_list.length > 0) {
							this.current_pic = votebar.voting_list.shift();
						} else {
							this.close_cute(!!votebar.sidebar);
							return;
						}
					}
				}
				$('thumb_img').setAttribute('src', BF_STATIC.image_root + this.current_pic.image);
				votebar.preload_next_pic();

				if (!votebar.sidebar && votebar.data.thumb_shrunk) {
					var new_width = 305;
					var new_height = 470;
					var image_style = '';
					if (this.current_pic.width / new_width  < this.current_pic.height / new_height ) {
						new_height = this.current_pic.height * (new_width / this.current_pic.width);
						image_style = "margin-top: -" + (new_height - 470) / 2 + "px; width: " + new_width + "px; height: " + new_height + "px;";
					} else {
						new_width  = this.current_pic.width * (new_height / this.current_pic.height);
						image_style = "margin-left: -" + (new_width - 305) / 2 + "px; height: " + new_height + "px; width: " + new_width + "px;";
					}
					$('thumb_img').setAttribute('style', image_style);
				}

				if (votebar.sidebar) {
					$('cute_posthref').setAttribute('href', 'http://' + BFWebPath() + '/' + votebar.data.uri + '?id=' + this.current_pic.campaignid);
				}

				var title_length = votebar.data.title_length ? votebar.data.title_length : 140;
				$('vote_name').update(this.current_pic.name.length > title_length ? this.current_pic.name.substring(0, title_length) + '...' : this.current_pic.name );
				if (this.current_pic.blurb.length >= 150) {
					var blurb = this.current_pic.blurb + ' ';
					var lastWord = blurb.substring(150, blurb.length).split(' ')[0];
					this.current_pic.blurb = blurb.substring(0, 150) + lastWord + "...<a href='http://" + this.full_path() + "' id='cute_more'>READ MORE&nbsp;&rsaquo;</a>";
				}

				if ($('thumb_blurb')) $('thumb_blurb').update(this.current_pic.blurb);
				if (votebar.data.source && $('thumb_source')) $('thumb_source').update(this.current_pic.source);

				if (votebar.sidebar) $('cute_ui').show();
				else this.set_share_btns('prev', this.current_pic);

				if ( campaignid ) document.fire( 'votebar.next_pic:' + campaignid );

			} else {
				this.close_cute(!!votebar.sidebar);
			}
		} catch (e) { console.error(e) }
	}

	this.preload_next_pic = function(campaignid) {
		//console.log('votebar.preload_next_pic', campaignid)
		var chosen_buzz = this.voting_list.filter( function( el ) { if ( el.campaignid == campaignid ) return true; else return false; } )
		var preload_pic = chosen_buzz.length ? chosen_buzz[0] : null;
		var i = 0;
		if ( !preload_pic) {
			preload_pic = votebar.voting_list[i];
		}
		if ( !preload_pic ) return false;

		if (this.shown) {
			while (this.shown.match(preload_pic.campaignid) == preload_pic.campaignid) {
				i++;
				preload_pic = votebar.voting_list[i];
				if ( !preload_pic ) return false;
			}
		}

		var tmp = new Image();
		tmp.src = BF_STATIC.image_root + preload_pic.image;
		//console.log('preloaded', BF_STATIC.image_root + preload_pic.image);
		return true;
	}

	this.set_ls = function(vote_data) {
		//console.log('votebar.set_ls', vote_data);
		try {
			if (vote_data) {
				if (this.ls) {
					this.lsArray = this.shown.split(',');
					while (this.lsArray.length > 50) {
						this.lsArray.shift();
					}
					this.lsArray.push(vote_data.campaignid);
					this.shown = this.lsArray.join(',');
					localStorage.setItem(this.storageName, this.shown);
				}
			}
		} catch (e) { console.error(e) }
	}

	this.move_voted = function() {
		//console.log('votebar.move_voted');
		if ($('thumb_img').src.match('\.jpg$')) $('voted_thumb_img').src = $('thumb_img').src;
		var cute_name = $('vote_name').textContent || $('vote_name').innerText;
		if (cute_name){
			$('voted_name').update(cute_name);
			var source = $('thumb_source').textContent || $('thumb_source').innerText;
			if (source && $('voted_source')) $('voted_source').update(source);
			$$('.cta').each(function(e){e.removeClassName('cta');});
		}
		if (votebar.current_pic) votebar.set_share_btns('voted', votebar.current_pic);
	}

	this.set_share_btns = function(type, vote_data) {
		if (votebar.sidebar) {
			$('cute_or_not_img_small').setAttribute('src', BF_STATIC.image_root + vote_data.image);
			$('recent_cute').setStyle({ display: 'block' });
			$(type + '-sharebtns').childElements().each(function(el) { $(el).remove(); });
		}

		var cute_message = '';
		if (!(!votebar.sidebar && type == 'prev')) {
			if (votebar.cute_reaction) cute_message = (votebar.data['super'] ? votebar.data['super'].message : votebar.data.message) + ' ';
			else if (votebar.data.notsuper) cute_message = votebar.data.notsuper.message + ' ';
		}

		var adtnl_btns = '';
		if (!votebar.sidebar && votebar.data.pinterest) {
			adtnl_btns = '<a class="shareBtn big" style="margin-left: 10px;" onclick="var sTop = window.screen.height/2-(218);var sLeft = window.screen.width/2-(313);window.open(\'http://pinterest.com/pin/create/button/?url=' + escape("http://" + BFWebPath() + '/' + votebar.data.uri + '?id=' + vote_data.campaignid) + '&description=' + encodeURIComponent(cute_message + vote_data.name.replaceAll("&#39;", "'")) + '&media=' + encodeURIComponent(BF_STATIC.big_image_root + vote_data.image) + '\',\'sharer\',\'toolbar=0,status=0,width=626,height=436,top=\'+sTop+\',left=\'+sLeft);return false;" data-pin-do="buttonPin" data-pin-config="none"> \
				<div class="pi_icon"></div> \
				<div class="label">Pin it</div> \
			</a>';
		}

		$(type + '-sharebtns').innerHTML = ' \
			<a class="shareBtn big darkblue" rel:gt_act="share/facebook/share" onclick="var sTop = window.screen.height/2-(218);var sLeft = window.screen.width/2-(313);window.open(\'http://www.facebook.com/sharer.php?s=100&p[summary]=' + (cute_message ? cute_message : encodeURIComponent(vote_data.blurb.replace(/(<([^>]+)>)/ig, '').replaceAll("&#39;", "\\'"))) + '&p[url]=' + escape("http://" + BFWebPath() + '/' + votebar.data.uri + '?id=' + vote_data.campaignid) + '&p[images][0]='+ BF_STATIC.big_image_root + vote_data.image +'&p[title]=' + escape(vote_data.name.replaceAll("&#39;", "'")) + '\',\'sharer\',\'toolbar=0,status=0,width=626,height=436,top=\'+sTop+\',left=\'+sLeft);return false;" href="javascript:;"> \
				<div class="fb_icon">&nbsp;</div> \
				<div class="label">Share</div> \
			</a> \
			<div class="tweet-btn"> \
				<a href="http://twitter.com/share" class="twitter-share-button" data-url="http://' + BFWebPath() + '/' + votebar.data.uri + '?id=' + vote_data.campaignid + '" data-text="' + cute_message + vote_data.name.replaceAll('"', '&quot;') + '" data-count="none" data-size="large" data-related="BuzzFeed">Tweet</a> \
			</div> \
			' + adtnl_btns +' \
		';

		if (votebar.sidebar && votebar.vote_type != 'fab') {
			$(type + '-sharebtns').insert("<a id='view_cute' href='http://" + BFWebPath() + "/" + votebar.data.uri + "'>See more and add yours &rsaquo;</a>");
		}

		if (typeof universal_dom !== 'undefined' && typeof BF_TWITTER2 != 'undefined') BF_TWITTER2.init();
		votebar.cute_reaction = false;
	}

	this.full_path = function(vote_data) {
		return BFWebPath() + '/' + (vote_data ? vote_data.username + '/' + vote_data.uri : this.current_pic.username + '/' + this.current_pic.uri);
	}


	this.disable_thumb = function(obj) {
		var block = document.createElement('DIV');
		var text = document.createElement('SPAN');
		$(text).update('Voted!');
		block.appendChild(text);
		block.setAttribute('class', 'thumb_voted');
		$(obj.target).up('div.item').insert(block);
	}

	this.vote_sidebar = function(ev) {
		//console.log('votebar.vote_sidebar')
		if ((new BF_User()).isLoggedIn()) {
			votebar.vote_pic();
		} else {
			ev.signin_type = 'initial'; ev.mode = 'voting'; ev.location = 'cuteornot';
			var cur_pic = votebar.current_pic;
			ev.reg_params = 'c&v' + votebar.data.action ? votebar.data.action : (votebar.cute_reaction ? votebar.data['super'].action : votebar.data.notsuper.action);
			ev.reg_params = ev.reg_params + '&b' + cur_pic.campaignid + '&l' + cur_pic.username + '/' + cur_pic.uri;
			if ( typeof BF_STATIC != 'undefined' && typeof BF_STATIC.country != 'undefined' ) ev.reg_params += '&u' + BF_STATIC.country;
			//console.log(ev.reg_params);
			bf_login.delayedLoggedInCallbacks = [];
			bf_login.delayedLoggedInCallbacks.push( { obj:'votebar',fn:'switch_and_vote', params: [ votebar.current_pic.campaignid, ev.target.id, 1 ] } );
			signin.open( ev );
		}
	};

	this.vote_lists = function(ev) {
		//console.log('votebar.vote_lists')
		var thumb = $(ev.target).up('div.item');
		var vote_data = {};
		if (thumb) vote_data = thumb.readAttribute('rel:vote_data').evalJSON();
		if ((new BF_User()).isLoggedIn()) {
			votebar.vote_pic(vote_data);
			votebar.disable_thumb(ev);
		} else {
			ev.signin_type = 'initial'; ev.mode = 'voting'; ev.location = 'cuteornot';
			ev.reg_params = 'c&v'+ votebar.data.action ? votebar.data.action : (votebar.cute_reaction ? votebar.data['super'].action : votebar.data.notsuper.action);
			ev.reg_params = ev.reg_params + '&b' + vote_data.campaignid + '&l' + vote_data.username + '/' + vote_data.uri;
			if ( typeof BF_STATIC != 'undefined' && typeof BF_STATIC.country != 'undefined' ) ev.reg_params += '&u' + BF_STATIC.country;
			//console.log(ev.reg_params);
			// ev.target.id is empty
			bf_login.delayedLoggedInCallbacks = [];
			bf_login.delayedLoggedInCallbacks.push( { obj:'votebar',fn:'switch_and_vote', params: [ vote_data.campaignid, ev.target.id, 0 ] } );
			signin.open(ev);
		}
	};

	this.track_vote = function(vote) {
		var act = 'vote/' + vote + "-" + votebar.vote_type
		var label = votebar.current_pic.username + '/' + votebar.current_pic.uri;

		gtrack.track_events('', act, label);
	}

	this.vote_pic = function(pic_data) {
		//console.log('votebar.vote_pic', pic_data);
		var cur_pic = {};
		if (pic_data) cur_pic = pic_data;
		else {
			cur_pic = this.current_pic;
			votebar.vote_spinner.start();
		}
		var params = {
			buzz_id: cur_pic.campaignid,
			category: 'badge',
			uri: cur_pic.username + '/' + cur_pic.uri,
			action: 'vote',
			badge_id: votebar.data.action ? votebar.data.action : (votebar.cute_reaction ? votebar.data['super'].action : votebar.data.notsuper.action)
		};

		votebar.preload_next_pic();

		badge_vote_manager.ajax.request(badge_vote_manager.VOTE_CONTROLLER, {
			method: 'get',
			parameters: params,
			onSuccess: function(r) {
				try {
					if (!pic_data) {
					if (votebar.vote_type == 'fab') {
						params.badge = votebar.cute_reaction ? 'fab' : 'drab';
						votebar.current_pic[params.badge + '_votes'] = Number(votebar.current_pic[params.badge + '_votes']) + 1;
						var fab_votes = Number(votebar.current_pic.fab_votes);
						var drab_votes = Number(votebar.current_pic.drab_votes);
						var total_votes = fab_votes + drab_votes;
						votebar.update_vote_count(Math.round((fab_votes/total_votes)*100) + '% Fab, ' + Math.round((drab_votes/total_votes)*100) + '% Drab');
					} else {
						if (cur_pic.count_votes > 1) {
							votebar.update_vote_count(cur_pic.count_votes + " People Agree With You!")
						} else {
							votebar.update_vote_count('Thank You For Your Vote!');
						}
					}
						if (votebar.sidebar) votebar.set_share_btns('prev', votebar.current_pic);
						votebar.next_pic();
					} else {
						votebar.set_ls(pic_data);
					}
				} catch (e) { console.error(e); }
			}
		});
	}

	this.share = function(obj) {
		var thumb = $(obj).up('div.item');
		var vote_data = thumb.readAttribute('rel:vote_data');
		vote_data = vote_data.evalJSON();
		var sTop = window.screen.height / 2 - (218);
		var sLeft = window.screen.width / 2 - (313);
		var url = 'http://' + BFWebPath() + '/' + votebar.data.uri + '?id=' + vote_data.campaignid;
		if ($(obj).hasClassName('facebook-share-item')) {
			window.open('http://www.facebook.com/sharer.php?s=100' + (vote_data.blurb ? '&p[summary]=' + encodeURIComponent(vote_data.blurb.replace(/(<([^>]+)>)/ig, '')) : '') + '&p[url]=' + url + '&p[title]=' + encodeURIComponent(vote_data.name), 'sharer', 'toolbar=0,status=0,width=626,height=436,top=' + sTop + ',left=' + sLeft);
		} else if ($(obj).hasClassName('twitter-share-item')) {
			window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(vote_data.name) + '&url=' + url, 'target', 'toolbar=0,status=0,width=626,height=436,top=' + sTop + ',left=' + sLeft);
		} else if ($(obj).hasClassName('pinterest-share-item')) {
			var ieheight = Prototype.Browser.IE ? 636 : 336;
			sTop = window.screen.height / 2 - ieheight;
			var media_src = '';
			$(thumb).select('img').each(function(el){
				media_src = $(el).readAttribute('src');
			});
            window.open('http://pinterest.com/pin/create/button/?media=' + media_src + '&url=' + url + '&description=' + encodeURIComponent(vote_data.name), 'target', 'toolbar=0,status=0,width=626,height=' + ieheight + ',top=' + sTop + ',left=' + sLeft);
		}
		return false;
	}

	this.fb_share = function(obj) {
		var thumb = $(obj).up('div.item');
		var vote_data = thumb.readAttribute('rel:vote_data');
		vote_data = vote_data.evalJSON();
		var sTop = window.screen.height / 2 - (218);
		var sLeft = window.screen.width / 2 - (313);
		window.open('http://www.facebook.com/sharer.php?s=100' + (vote_data.blurb ? '&p[summary]=' + vote_data.blurb : '') + '&p[url]=http://' + BFWebPath() + '/' + votebar.data.uri + '?id=' + vote_data.campaignid + '&p[title]=' + vote_data.name, 'sharer', 'toolbar=0,status=0,width=626,height=436,top=' + sTop + ',left=' + sLeft);
		return false;
	}

	this.update_vote_count = function(status) {
		$('vote_count').update(status);
	}

	this.switch_and_vote = function(campaignid, el, sidebar) {
		//console.log( 'votebar.switch_and_vote', campaignid, el, sidebar );
		if ( this.initialized && typeof badge_vote_manager.ajax != 'undefined' ) {
			if (sidebar) {
				//it's passing event data as first parameter, so i added anonymous function instead of just passing vote_pic in
				document.observe( 'votebar.next_pic:' + campaignid, function() { votebar.vote_pic() } );
				this.next_pic( false, campaignid );
			} else {
				if ( !el ) {
					var els = $$('.item[rel\\\:vote_data*="'+campaignid+'"] .super');
					if (els.length) el = els[0];
				}
				if ( el ) {
					el.scrollIntoView();
					var ev = el.fire('click');
					this.vote_lists(ev);
				}
			}
		} else {
			new PeriodicalExecuter(function(self, campaignid, el, sidebar) { return function(pe) {
				if ( self.initialized && typeof badge_vote_manager.ajax != 'undefined' ) {
					pe.stop();
					self.switch_and_vote.call( self, campaignid, el, sidebar );
				}
			} }(this, campaignid, el, sidebar), 0.5);
		}
	}

	this.close_cute = function(sidebar) {
		if ($('cute_ui') && $('cute_ui').visible()) {
			$('cute_ui').hide();
			$('cute_or_not_come_back_later').show();
		} else if(sidebar) {
			$('cute_or_not').hide();
		} else {
			$$('.voting_img, .right.descr').each(function(el) {
				el.addClassName('hidden');
			});
		}
		$('cute_or_not_out').removeClassName('hidden');
	}
};

var votebar = new VoteBar();
