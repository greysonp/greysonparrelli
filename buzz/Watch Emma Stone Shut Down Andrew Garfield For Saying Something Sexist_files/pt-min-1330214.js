
/* pt.js 1330214 */ (function(){var d={base:{}},f={base:{}},c={timeout:3000,path:"/__perf/b.gif?",host:"",console:false,logOnly:false},e=[],j=[],b=0,m;function a(){var n,z,t,C,v,s,x,w=0,p="",u="",B=f.base,o=B.site||"",y=B.region||"",A=B.colo||"",r=B.device||"";while(e.length>0){C=[];v=[];mod=e.shift();n=d[mod];z=f[mod];if(!n){continue}for(t in n){s=l(mod,t);if(s!==null){C.push(t+"|"+(n[t].end-s))}}for(t in z){v.push(t+"|"+z[t])}if(c.console){u+=k(mod,C,v)}else{p+="&m"+w+"="+mod+"&t"+w+"="+C.join(",")+"&d"+w+"="+v.join(",")}delete d[mod];w++}if(c.console){h(u)}else{p+="&n="+w+"&s="+o+"&r="+y+"&d="+r+"&c="+A;x=new Image();x.id="perfbeacon"+b++;j[x.id]=x;x.onload=x.onerror=function(){delete j[this.id]};if(c.logOnly){c.path="/__perf_log_only/b.gif";c.logOnly=false}else{c.path="/__perf/b.gif"}x.src=((c.host)?"http://":"")+c.host+c.path+p}m=null}function k(n,o,p){return"--------------------\nmodule: "+n+"\ntimers:\n"+o.join("\n")+"\n"+(p.length>0?("data:\n"+p.join("\n")+"\n"):"")}function h(n){try{console.log(n)}catch(o){}}function g(n){return((parseFloat(n)==parseInt(n))&&!isNaN(n))}function l(o,u){var t,s,n,p,v,r;try{s=d[o][u]||{};n=s.start||u;if(g(n)){t=n}else{p=n.split(".");v=p.pop();r=p[0]||o;t=l(r,v)}}catch(q){t=null}return t}window.MediaPerfTiming={startTimer:function(p,o,r){if(!p||!o){return this}var q=typeof r,n;if(q==="undefined"){r=new Date().getTime()}else{if(q==="string"){n=l(p,r);if(g(n)){r=n}}}if(!d[p]){d[p]={}}d[p][o]={start:r};return this},endTimer:function(o,n,p){if(!o||!n||!d[o]||!d[o][n]){return this}if(typeof(p)==="undefined"){p=new Date().getTime()}d[o][n].end=p;return this},cancelTimer:function(o,n){if(d[o]){delete d[o][n]}return this},record:function(o,p){if(o&&p){if(!f[o]){f[o]={}}for(var n in p){f[o][n]=p[n]}}return this},done:function(n){if(n&&d[n]){e.push(n);if(m){clearTimeout(m)}m=setTimeout(a,c.timeout)}return this},config:function(n){for(i in n){c[i]=n[i]}return this},getTimer:function(q,p){if(!q||!p||!d[q]||!d[q][p]){return this}var o=d[q][p],s=o.start,r=typeof s,n;if(r==="string"){n=l(q,s);if(g(n)){s=n;o.start=s}}return o}}})();