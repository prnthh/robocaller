(self.webpackChunkrobocaller=self.webpackChunkrobocaller||[]).push([[193],{8193:function(t,e,n){var i,s=n(5735);"undefined"!==typeof window&&(i=window.AudioContext||window.webkitAudioContext);var a=null;t.exports=function(t,e){var n=new s;if(!i)return n;var c,o,l,r=(e=e||{}).smoothing||.1,h=e.interval||50,u=e.threshold,f=e.play,p=e.history||10,k=!0;a=e.audioContext||a||new i,(l=a.createAnalyser()).fftSize=512,l.smoothingTimeConstant=r,o=new Float32Array(l.frequencyBinCount),t.jquery&&(t=t[0]),t instanceof HTMLAudioElement||t instanceof HTMLVideoElement?(c=a.createMediaElementSource(t),"undefined"===typeof f&&(f=!0),u=u||-50):(c=a.createMediaStreamSource(t),u=u||-50),c.connect(l),f&&l.connect(a.destination),n.speaking=!1,n.suspend=function(){return a.suspend()},n.resume=function(){return a.resume()},Object.defineProperty(n,"state",{get:function(){return a.state}}),a.onstatechange=function(){n.emit("state_change",a.state)},n.setThreshold=function(t){u=t},n.setInterval=function(t){h=t},n.stop=function(){k=!1,n.emit("volume_change",-100,u),n.speaking&&(n.speaking=!1,n.emit("stopped_speaking")),l.disconnect(),c.disconnect()},n.speakingHistory=[];for(var g=0;g<p;g++)n.speakingHistory.push(0);return function t(){setTimeout((function(){if(k){var e=function(t,e){var n=-1/0;t.getFloatFrequencyData(e);for(var i=4,s=e.length;i<s;i++)e[i]>n&&e[i]<0&&(n=e[i]);return n}(l,o);n.emit("volume_change",e,u);var i=0;if(e>u&&!n.speaking){for(var s=n.speakingHistory.length-3;s<n.speakingHistory.length;s++)i+=n.speakingHistory[s];i>=2&&(n.speaking=!0,n.emit("speaking"))}else if(e<u&&n.speaking){for(s=0;s<n.speakingHistory.length;s++)i+=n.speakingHistory[s];0==i&&(n.speaking=!1,n.emit("stopped_speaking"))}n.speakingHistory.shift(),n.speakingHistory.push(0+(e>u)),t()}}),h)}(),n}},5735:function(t){function e(){}t.exports=e,e.mixin=function(t){var e=t.prototype||t;e.isWildEmitter=!0,e.on=function(t,e,n){this.callbacks=this.callbacks||{};var i=3===arguments.length,s=i?arguments[1]:void 0,a=i?arguments[2]:arguments[1];return a._groupName=s,(this.callbacks[t]=this.callbacks[t]||[]).push(a),this},e.once=function(t,e,n){var i=this,s=3===arguments.length,a=s?arguments[1]:void 0,c=s?arguments[2]:arguments[1];return this.on(t,a,(function e(){i.off(t,e),c.apply(this,arguments)})),this},e.releaseGroup=function(t){var e,n,i,s;for(e in this.callbacks=this.callbacks||{},this.callbacks)for(n=0,i=(s=this.callbacks[e]).length;n<i;n++)s[n]._groupName===t&&(s.splice(n,1),n--,i--);return this},e.off=function(t,e){this.callbacks=this.callbacks||{};var n,i=this.callbacks[t];return i?1===arguments.length?(delete this.callbacks[t],this):(-1!==(n=i.indexOf(e))&&(i.splice(n,1),0===i.length&&delete this.callbacks[t]),this):this},e.emit=function(t){this.callbacks=this.callbacks||{};var e,n,i,s=[].slice.call(arguments,1),a=this.callbacks[t],c=this.getWildcardCallbacks(t);if(a)for(e=0,n=(i=a.slice()).length;e<n&&i[e];++e)i[e].apply(this,s);if(c)for(n=c.length,e=0,n=(i=c.slice()).length;e<n&&i[e];++e)i[e].apply(this,[t].concat(s));return this},e.getWildcardCallbacks=function(t){this.callbacks=this.callbacks||{};var e,n,i=[];for(e in this.callbacks)n=e.split("*"),("*"===e||2===n.length&&t.slice(0,n[0].length)===n[0])&&(i=i.concat(this.callbacks[e]));return i}},e.mixin(e)}}]);
//# sourceMappingURL=193.f66dfdd2.chunk.js.map