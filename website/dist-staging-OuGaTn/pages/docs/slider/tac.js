var AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;var TY_INTERNAL_FIELDS=new Set(["props","tac","__ty_bound_persistent_fields__","__ty_bound_reactive_fields__"]),ty_camelCasePropName=(name)=>name.replace(/-([a-zA-Z0-9])/g,(_match,char)=>char.toUpperCase()),ty_decodeProps=(props)=>{let withCamelAliases=(propBag)=>{for(let key of Object.keys(propBag)){if(!key.includes("-"))continue;let camelKey=ty_camelCasePropName(key);if(camelKey!==key&&!Object.prototype.hasOwnProperty.call(propBag,camelKey))propBag[camelKey]=propBag[key]}return propBag};if(typeof props==="string")try{return withCamelAliases(JSON.parse(decodeURIComponent(props)))}catch{return{}}return props&&typeof props==="object"?withCamelAliases(props):{}},ty_createScope=(controller,props)=>{let state=Object.create(null),propBag=props&&typeof props==="object"?props:{},proxy;return proxy=new Proxy(state,{has(_target,key){if(key===Symbol.unscopables||typeof key!=="string")return!1;return Object.prototype.hasOwnProperty.call(state,key)||(controller?key in controller:!1)||key in propBag},get(_target,key){if(key===Symbol.unscopables)return;if(key==="__ty_controller__")return controller;if(key==="__ty_props__")return propBag;if(typeof key!=="string")return;if(Object.prototype.hasOwnProperty.call(state,key))return state[key];if(controller&&key in controller){let value=controller[key];return typeof value==="function"?value.bind(controller):value}return propBag[key]},set(_target,key,value){if(typeof key!=="string")return!0;if(controller&&key in controller)return controller[key]=value,!0;if(key in propBag)return propBag[key]=value,!0;return state[key]=value,!0},ownKeys(){let keys=new Set(Object.keys(state));if(controller&&typeof controller==="object")for(let key of Object.keys(controller))keys.add(key);for(let key of Object.keys(propBag))keys.add(key);return[...keys]},getOwnPropertyDescriptor(_target,key){if(typeof key!=="string")return;return{configurable:!0,enumerable:!0,writable:!0,value:proxy[key]}}}),proxy},__ty_isBrowserEnv=()=>typeof window<"u"&&!globalThis.__ty_prerender__,__ty_openFetchCache=async()=>{if(!__ty_isBrowserEnv()||typeof indexedDB>"u")return null;if(window.__ty_fetch_cache_db__)return window.__ty_fetch_cache_db__??null;return window.__ty_fetch_cache_db__=await new Promise((resolve)=>{let request=indexedDB.open("tachyon-fetch-cache",1);request.onupgradeneeded=()=>{request.result.createObjectStore("responses",{keyPath:"key"})},request.onsuccess=()=>resolve(request.result),request.onerror=()=>resolve(null)}),window.__ty_fetch_cache_db__??null},__ty_readCachedResponse=async(cacheKey)=>{let db=await __ty_openFetchCache();if(!db)return null;return await new Promise((resolve)=>{let request=db.transaction("responses","readonly").objectStore("responses").get(cacheKey);request.onsuccess=()=>{let entry=request.result;if(!entry){resolve(null);return}resolve(new Response(entry.body?new Uint8Array(entry.body):null,{status:entry.status,statusText:entry.statusText,headers:entry.headers}))},request.onerror=()=>resolve(null)})},__ty_writeCachedResponse=async(cacheKey,response)=>{let db=await __ty_openFetchCache();if(!db)return;let body=await response.arrayBuffer();await new Promise((resolve)=>{let tx=db.transaction("responses","readwrite");tx.oncomplete=()=>resolve(void 0),tx.onerror=()=>resolve(void 0),tx.objectStore("responses").put({key:cacheKey,status:response.status,statusText:response.statusText,headers:Object.fromEntries(response.headers.entries()),body,updatedAt:Date.now()})})},__ty_deleteCachedResponse=async(cacheKey)=>{let db=await __ty_openFetchCache();if(!db)return;await new Promise((resolve)=>{let tx=db.transaction("responses","readwrite");tx.oncomplete=()=>resolve(void 0),tx.onerror=()=>resolve(void 0),tx.objectStore("responses").delete(cacheKey)})},localFirstFetch=async(input,init)=>{let request=new Request(input,init),method=request.method.toUpperCase(),browserEnv=__ty_isBrowserEnv(),sharedCache=globalThis.__ty_browser_cache__;if(browserEnv&&typeof sharedCache?.fetch==="function"){let canCacheRead=(method==="GET"||method==="HEAD")&&request.cache!=="no-store";return await sharedCache.fetch(input,init,{key:canCacheRead?`${method}:${request.url}`:null,invalidateKeys:method==="GET"||method==="HEAD"?[]:[`GET:${request.url}`,`HEAD:${request.url}`]})}let cacheKey=browserEnv&&(method==="GET"||method==="HEAD")&&request.cache!=="no-store"?`${method}:${request.url}`:null;if(cacheKey&&request.cache!=="reload"){let cached=await __ty_readCachedResponse(cacheKey);if(cached)return cached}try{let response=await(globalThis.__ty_native_fetch__??fetch)(input,init);if(cacheKey&&response.ok)__ty_writeCachedResponse(cacheKey,response.clone());if(!cacheKey&&response.ok&&browserEnv)Promise.all([__ty_deleteCachedResponse(`GET:${request.url}`),__ty_deleteCachedResponse(`HEAD:${request.url}`)]);return response}catch(error){if(cacheKey){let cached=await __ty_readCachedResponse(cacheKey);if(cached)return cached}throw error}};if(__ty_isBrowserEnv()){let g=globalThis;if(!g.__ty_fetch_installed__)g.__ty_fetch_installed__=!0,g.__ty_native_fetch__=globalThis.fetch.bind(globalThis),globalThis.fetch=(input,init)=>localFirstFetch(input,init)}var ty_createHelpers=(modulePath)=>{let renderContext={componentRootId:null,elemId:null,event:void 0},isBrowser=typeof window<"u"&&!globalThis.__ty_prerender__,isServer=!isBrowser,rerenderScheduled=!1,suppressReactiveRerender=!1,scheduleRerender=()=>{if(!isBrowser||suppressReactiveRerender||renderContext.elemId)return;if(rerenderScheduled)return;rerenderScheduled=!0,queueMicrotask(()=>{rerenderScheduled=!1,window.__ty_rerender?.()})},onMount=(fn)=>{if(!isBrowser)return;if(!window.__ty_onMount_queue__)window.__ty_onMount_queue__=[];window.__ty_onMount_queue__.push(fn)},rerender=()=>{if(isBrowser)window.__ty_rerender?.()},inject=(key,fallback=void 0)=>{if(!isBrowser)return fallback;return window.__ty_context__?.get(key)??fallback},env=(key,fallback=void 0)=>{if(!isBrowser)return fallback;let publicEnv=window.__ty_public_env__;if(!publicEnv||!(key in publicEnv))return fallback;return publicEnv[key]},fylo=(()=>{let noopCollection={find:async()=>({error:"Fylo browser not enabled"}),list:async()=>({error:"Fylo browser not enabled"}),get:async()=>({error:"Fylo browser not enabled"}),events:async()=>({error:"Fylo browser not enabled"}),patch:async()=>({error:"Fylo browser not enabled"}),del:async()=>({error:"Fylo browser not enabled"}),rebuild:async()=>({error:"Fylo browser not enabled"})},noop=new Proxy({enabled:!1,root:void 0,setCredentials(){},clearCredentials(){},sql:async()=>({error:"Fylo browser not enabled"}),collections:async()=>({root:"",collections:[]}),meta:async()=>null},{get(target,prop){if(typeof prop==="string"&&!(prop in target))return noopCollection;return Reflect.get(target,prop)}});return new Proxy(noop,{get(_,prop){let live=(typeof window<"u"?window.fylo:void 0)??noop;return Reflect.get(live,prop)}})})(),provide=(key,value)=>{if(isBrowser)window.__ty_context__?.set(key,value)},resolvePersistScope=(props)=>{let rawScope=props.__ty_persist_id__??(isBrowser?window.location.pathname||"/":modulePath||"server");return`${modulePath||"module"}:${String(rawScope)}`},emit=(name,detail)=>{let eventName=String(name||"").replace(/^@/,""),targetId=renderContext.componentRootId;if(!eventName||!targetId||typeof document>"u")return!1;let target=document.getElementById(targetId);if(!target||typeof CustomEvent>"u")return!1;return target.dispatchEvent(new CustomEvent(eventName,{detail,bubbles:!0,composed:!0}))},readSessionValue=(storageKey,fallback=void 0)=>{if(!isBrowser)return fallback;try{let stored=sessionStorage.getItem(storageKey);return stored===null?fallback:JSON.parse(stored)}catch{return fallback}},writeSessionValue=(storageKey,value)=>{if(!isBrowser)return;try{if(value===void 0){sessionStorage.removeItem(storageKey);return}sessionStorage.setItem(storageKey,JSON.stringify(value))}catch{}},readLocalValue=(storageKey,fallback=void 0)=>{if(!isBrowser)return fallback;try{let stored=globalThis.localStorage.getItem(storageKey);return stored===null?fallback:JSON.parse(stored)}catch{return fallback}},writeLocalValue=(storageKey,value)=>{if(!isBrowser)return;try{if(value===void 0){globalThis.localStorage.removeItem(storageKey);return}globalThis.localStorage.setItem(storageKey,JSON.stringify(value))}catch{}},bindPersistentFields=(controller,props)=>{let boundFields=controller.__ty_bound_persistent_fields__ instanceof Set?controller.__ty_bound_persistent_fields__:new Set;controller.__ty_bound_persistent_fields__=boundFields;let persistScope=resolvePersistScope(props);for(let fieldName of Object.keys(controller)){if(boundFields.has(fieldName))continue;if(fieldName.startsWith("$$")){let storageKey2=`tac:${persistScope}:${fieldName}`,currentValue2=readLocalValue(storageKey2,controller[fieldName]);Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:!0,get(){return currentValue2},set(nextValue){currentValue2=nextValue,writeLocalValue(storageKey2,nextValue)}}),controller[fieldName]=currentValue2,boundFields.add(fieldName);continue}if(!fieldName.startsWith("$"))continue;let storageKey=`tac:${persistScope}:${fieldName}`,currentValue=readSessionValue(storageKey,controller[fieldName]);Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:!0,get(){return currentValue},set(nextValue){currentValue=nextValue,writeSessionValue(storageKey,nextValue)}}),controller[fieldName]=currentValue,boundFields.add(fieldName)}},bindReactiveFields=(controller)=>{let boundFields=controller.__ty_bound_reactive_fields__ instanceof Set?controller.__ty_bound_reactive_fields__:new Set;controller.__ty_bound_reactive_fields__=boundFields;for(let fieldName of Object.keys(controller)){if(TY_INTERNAL_FIELDS.has(fieldName)||boundFields.has(fieldName))continue;let descriptor=Object.getOwnPropertyDescriptor(controller,fieldName);if(!descriptor||descriptor.configurable===!1)continue;if("value"in descriptor){let currentValue=descriptor.value;Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:descriptor.enumerable,get(){return currentValue},set(nextValue){if(Object.is(currentValue,nextValue))return;currentValue=nextValue,scheduleRerender()}}),boundFields.add(fieldName);continue}if(typeof descriptor.get==="function"&&typeof descriptor.set==="function")Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:descriptor.enumerable,get(){return descriptor.get?.call(controller)},set(nextValue){let previousValue=descriptor.get?.call(controller);descriptor.set?.call(controller,nextValue);let currentValue=descriptor.get?.call(controller);if(!Object.is(previousValue,currentValue))scheduleRerender()}}),boundFields.add(fieldName)}};return{createTacHelpers:(props)=>({get isBrowser(){return isBrowser},get isServer(){return isServer},bindPersistentFields(controller){bindPersistentFields(controller,props)},env,props,emit,fetch:(input,init)=>localFirstFetch(input,init),inject,onMount,provide,rerender}),bindCompanion:(instance,props,tac)=>{instance.props=props,instance.tac=tac,suppressReactiveRerender=!0;try{if(props){let propBag=props;for(let fieldName of Object.keys(instance)){if(fieldName==="props"||fieldName==="tac")continue;if(Object.prototype.hasOwnProperty.call(propBag,fieldName)){instance[fieldName]=propBag[fieldName];continue}if(fieldName.startsWith("$$")){let stripped=fieldName.slice(2);if(Object.prototype.hasOwnProperty.call(propBag,stripped))instance[fieldName]=propBag[stripped];continue}if(fieldName.startsWith("$")){let stripped=fieldName.slice(1);if(Object.prototype.hasOwnProperty.call(propBag,stripped))instance[fieldName]=propBag[stripped]}}}bindPersistentFields(instance,props),bindReactiveFields(instance)}finally{suppressReactiveRerender=!1}},createScope:ty_createScope,decodeProps:ty_decodeProps,env,emit,inject,isBrowser,isServer,onMount,provide,rerender,fylo,loadTacModule:async(modulePath2)=>{let tacGlobal=typeof window<"u"?window.Tac:void 0;if(tacGlobal?.load)return tacGlobal.load(modulePath2);let resolved=new URL(import.meta.url);resolved.pathname=resolved.pathname.replace(/\/(?:pages|components)\/.*$/,modulePath2);let module=await import(resolved.href);if(typeof module.default==="function")return module.default;throw Error(`Tac module "${modulePath2}" did not export a renderer`)},matchSwitchCase(switchValue,caseValue){return Array.isArray(caseValue)?caseValue.some((value)=>Object.is(value,switchValue)):Object.is(caseValue,switchValue)},setRenderContext(context){renderContext.componentRootId=context.componentRootId??null,renderContext.elemId=context.elemId??null,renderContext.event=context.event}}},__ty_module_imports__={},__ty_compiled_factory__=new AsyncFunction("__ty_helpers__","__ty_module_imports__","props",`
const __ty_props__ = __ty_helpers__.decodeProps(props);

const __ty_companion__ = null;
const __ty_scope__ = __ty_helpers__.createScope(__ty_companion__, __ty_props__);

with (__ty_scope__) {
    const emit = __ty_helpers__.emit;
    const fetch = __ty_helpers__.fetch;
    const isBrowser = __ty_helpers__.isBrowser;
    const isServer = __ty_helpers__.isServer;
    const onMount = __ty_helpers__.onMount;
    const rerender = __ty_helpers__.rerender;
    const inject = __ty_helpers__.inject;
    const provide = __ty_helpers__.provide;
    const env = __ty_helpers__.env;
    const fylo = __ty_helpers__.fylo;

    const demo_compare = await __ty_helpers__.loadTacModule('/components/demo/compare/tac.js')
    

    if (__ty_props__) {
        for (const __k__ of Object.keys(__ty_props__)) {
            if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(__k__) && !__k__.startsWith('__ty_')) {
                const __v__ = __ty_props__[__k__];
                try { eval(\`\${__k__} = __v__\`) } catch {}
            }
        }
    }

    const compRenders = new Map();
    const compRenderProps = new Map();

    return async function(elemId, event, compId) {
        const counters = { id: {}, ev: {}, bind: {}, persist: {} };
        const ty_componentRootId = compId
            ? (String(compId).startsWith('ty-') ? String(compId) : 'ty-' + compId + '-0')
            : null;

        __ty_helpers__.setRenderContext({ componentRootId: ty_componentRootId, elemId, event });

        const ty_generateId = (hash, source, displayHash = hash) => {
            const key = compId ? hash + '-' + compId : hash;
            const map = counters[source];
            const displayKey = compId ? displayHash + '-' + compId : displayHash;

            if (key in map) {
                return 'ty-' + displayKey + '-' + map[key]++;
            }

            map[key] = 1;
            return 'ty-' + displayKey + '-0';
        };

        const ty_invokeEvent = async (hash, action, targetHash = hash) => {
            if (elemId === ty_generateId(hash, 'ev', targetHash)) {
                if (typeof action === 'function') await action(event);
                else {
                    const toCall = (event && !action.endsWith(')')) ? action + "('" + event + "')" : action;
                    await eval(toCall);
                }
            }
            return '';
        };

        const ty_assignValue = (hash, variable, currentValue) => {
            let nextValue = currentValue;
            if (elemId === ty_generateId(hash, 'bind') && event) {
                if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(variable)) {
                    const __val__ = event.value;
                    try { eval(\`\${variable} = __val__\`) } catch {}
                    nextValue = __val__;
                }
            }
            return nextValue ?? '';
        };

        const ty_escapeHtml = (value) => {
            if (value === null || value === undefined) return '';
            return String(value)
                .replaceAll('&', '&amp;')
                .replaceAll('<', '&lt;')
                .replaceAll('>', '&gt;')
                .replaceAll('"', '&quot;')
                .replaceAll("'", '&#39;');
        };

        const ty_escapeText = ty_escapeHtml;
        const ty_escapeAttr = ty_escapeHtml;

        let elements = '';
        let render;

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('c9387a4a', 'id'))}">\`
elements+=\`Slider\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('0657cfbb', 'id'))}">\`
elements+=\`A control for choosing a value along a track. Use the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e0142fe7', 'id'))}">\`
elements+=\`.w-slider\`
elements+=\`</code>\`
elements+=\` class on a native \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('61c63090', 'id'))}">\`
elements+=\`&lt;input type="range"&gt;\`
elements+=\`</code>\`
elements+=\` for the minimal version, or the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ce18984c', 'id'))}">\`
elements+=\`&lt;w-slider&gt;\`
elements+=\`</code>\`
elements+=\` web component for labels, ticks, value bubbles, theming, and vertical orientation. For two thumbs, see the \`
elements+=\`<a href="/docs/range-sliders" id="\${ty_escapeAttr(ty_generateId('493adfa9', 'id'))}">\`
elements+=\`range slider\`
elements+=\`</a>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('31c9e6e0', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('543525a4', 'id'))}">\`
elements+=\`
    \`
elements+=\`<input class="w-slider" type="range" min="0" max="100" value="40" style="--w-slider-pct:40%" id="\${ty_escapeAttr(ty_generateId('b5f9e68a', 'id'))}" />\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('3dd9cdc4', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slider min="0" max="100" value="40" id="\${ty_escapeAttr(ty_generateId('730f8328', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('9fce2f51', 'id'))}">\`
elements+=\`Label\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('09356e4a', 'id'))}">\`
elements+=\`Add a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('90e57b3b', 'id'))}">\`
elements+=\`label\`
elements+=\`</code>\`
elements+=\`; the current value shows below the track.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('6c059897', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-slider-field" id="\${ty_escapeAttr(ty_generateId('32d71221', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('7312b29d', 'id'))}">\`
elements+=\`Volume\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-slider-control" style="--value:60%" id="\${ty_escapeAttr(ty_generateId('60ba6514', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-slider-rail" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('9186fa96', 'id'))}">\`
elements+=\`<span class="w-slider-fill" id="\${ty_escapeAttr(ty_generateId('2ad5748f', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-slider-input" type="range" value="60" aria-label="Volume" id="\${ty_escapeAttr(ty_generateId('cec61daa', 'id'))}" />\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('2f83c759', 'id'))}">\`
elements+=\`60\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('da1a468a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slider label="Volume" value="60" id="\${ty_escapeAttr(ty_generateId('f8aec2a5', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('d0666c25', 'id'))}">\`
elements+=\`Sizes\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('3ad133bc', 'id'))}">\`
elements+=\`Five sizes from \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('022f18a3', 'id'))}">\`
elements+=\`xs\`
elements+=\`</code>\`
elements+=\` to \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7620f035', 'id'))}">\`
elements+=\`xl\`
elements+=\`</code>\`
elements+=\`; omit for the default.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('3e4d2909', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('6376d01f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<input class="w-slider w-slider--xs" type="range" value="20" style="--w-slider-pct:20%" id="\${ty_escapeAttr(ty_generateId('0bcf4f79', 'id'))}" />\`
elements+=\`
      \`
elements+=\`<input class="w-slider w-slider--sm" type="range" value="30" style="--w-slider-pct:30%" id="\${ty_escapeAttr(ty_generateId('50e0dacd', 'id'))}" />\`
elements+=\`
      \`
elements+=\`<input class="w-slider" type="range" value="50" style="--w-slider-pct:50%" id="\${ty_escapeAttr(ty_generateId('b04b2099', 'id'))}" />\`
elements+=\`
      \`
elements+=\`<input class="w-slider w-slider--lg" type="range" value="70" style="--w-slider-pct:70%" id="\${ty_escapeAttr(ty_generateId('d36ff290', 'id'))}" />\`
elements+=\`
      \`
elements+=\`<input class="w-slider w-slider--xl" type="range" value="80" style="--w-slider-pct:80%" id="\${ty_escapeAttr(ty_generateId('9fc8a865', 'id'))}" />\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('e68fa121', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('51f353d8', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-slider size="xs" value="20" id="\${ty_escapeAttr(ty_generateId('7c4d5da8', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
      \`
elements+=\`<w-slider size="sm" value="30" id="\${ty_escapeAttr(ty_generateId('195cbe4e', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
      \`
elements+=\`<w-slider value="50" id="\${ty_escapeAttr(ty_generateId('c9ee5520', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
      \`
elements+=\`<w-slider size="lg" value="70" id="\${ty_escapeAttr(ty_generateId('851e4aba', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
      \`
elements+=\`<w-slider size="xl" value="80" id="\${ty_escapeAttr(ty_generateId('de3556cf', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('01cfca1e', 'id'))}">\`
elements+=\`Steps\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('03eb1118', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5b807979', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('796c8460', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('30c005b1', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\` to constrain the values.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('f913d147', 'id'))}">\`
elements+=\`
    \`
elements+=\`<input class="w-slider" type="range" min="0" max="10" step="2" value="6" style="--w-slider-pct:60%" id="\${ty_escapeAttr(ty_generateId('f106bf79', 'id'))}" />\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('9293fdd4', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slider min="0" max="10" step="2" value="6" id="\${ty_escapeAttr(ty_generateId('b327ad9b', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('0223145c', 'id'))}">\`
elements+=\`Thumb label\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('0d11ae0b', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('49ad6d52', 'id'))}">\`
elements+=\`thumb-label\`
elements+=\`</code>\`
elements+=\` to show the value on hover or focus, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('016cfd44', 'id'))}">\`
elements+=\`thumb-label="always"\`
elements+=\`</code>\`
elements+=\` to keep the bubble visible.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('3d60271b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-slider-field w-slider-field--thumb-label w-slider-field--thumb-label-always" id="\${ty_escapeAttr(ty_generateId('0c627053', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('b2efa1a3', 'id'))}">\`
elements+=\`Brightness\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-slider-control" style="--value:65%" id="\${ty_escapeAttr(ty_generateId('0183c423', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-slider-rail" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('5f637773', 'id'))}">\`
elements+=\`<span class="w-slider-fill" id="\${ty_escapeAttr(ty_generateId('5241d680', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-slider-input" type="range" value="65" aria-label="Brightness" id="\${ty_escapeAttr(ty_generateId('2b9f9c28', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-slider-thumb-label" style="--pos:65%" id="\${ty_escapeAttr(ty_generateId('5977ecd6', 'id'))}">\`
elements+=\`65\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('115da142', 'id'))}">\`
elements+=\`65\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('1e0e3d8e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slider label="Brightness" value="65" thumb-label="always" id="\${ty_escapeAttr(ty_generateId('d7d5fe1d', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('b8dc95be', 'id'))}">\`
elements+=\`Ticks\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('460a1d95', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fc9ac1c2', 'id'))}">\`
elements+=\`ticks\`
elements+=\`</code>\`
elements+=\` to mark every \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8a67bf47', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b9aab949', 'id'))}">\`
elements+=\`tick-labels\`
elements+=\`</code>\`
elements+=\` (pipe-separated) to label each one.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('87bd2689', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-slider-field" id="\${ty_escapeAttr(ty_generateId('a5ef0802', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('57545a4a', 'id'))}">\`
elements+=\`Rating\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-slider-control" style="--value:50%" id="\${ty_escapeAttr(ty_generateId('7b62fa2e', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-slider-rail" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('d4552411', 'id'))}">\`
elements+=\`<span class="w-slider-fill" id="\${ty_escapeAttr(ty_generateId('fc17294b', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-slider-ticks w-slider-ticks--labelled" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('8375d2a9', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-slider-tick" style="--pos:0%" id="\${ty_escapeAttr(ty_generateId('801a353f', 'id'))}">\`
elements+=\`<span class="w-slider-tick-label" id="\${ty_escapeAttr(ty_generateId('8f46ad9a', 'id'))}">\`
elements+=\`None\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-slider-tick" style="--pos:25%" id="\${ty_escapeAttr(ty_generateId('b7f0b435', 'id'))}">\`
elements+=\`<span class="w-slider-tick-label" id="\${ty_escapeAttr(ty_generateId('8e793dc4', 'id'))}">\`
elements+=\`Low\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-slider-tick" style="--pos:50%" id="\${ty_escapeAttr(ty_generateId('ff7c5073', 'id'))}">\`
elements+=\`<span class="w-slider-tick-label" id="\${ty_escapeAttr(ty_generateId('c9354891', 'id'))}">\`
elements+=\`Mid\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-slider-tick" style="--pos:75%" id="\${ty_escapeAttr(ty_generateId('ee22fb13', 'id'))}">\`
elements+=\`<span class="w-slider-tick-label" id="\${ty_escapeAttr(ty_generateId('9c151bb4', 'id'))}">\`
elements+=\`High\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-slider-tick" style="--pos:100%" id="\${ty_escapeAttr(ty_generateId('e766409d', 'id'))}">\`
elements+=\`<span class="w-slider-tick-label" id="\${ty_escapeAttr(ty_generateId('151da173', 'id'))}">\`
elements+=\`Max\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-slider-input" type="range" min="0" max="4" step="1" value="2" aria-label="Rating" id="\${ty_escapeAttr(ty_generateId('28c3cbf1', 'id'))}" />\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('b9bbf084', 'id'))}">\`
elements+=\`2\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('68aa410f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slider label="Rating" min="0" max="4" step="1" value="2" tick-labels="None|Low|Mid|High|Max" id="\${ty_escapeAttr(ty_generateId('783d6418', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('e1071413', 'id'))}">\`
elements+=\`Color\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('4a77c8fd', 'id'))}">\`
elements+=\`Theme the fill and thumb with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c36e059f', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\`, and the rail with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1e25022a', 'id'))}">\`
elements+=\`track-color\`
elements+=\`</code>\`
elements+=\`, using any token color name.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('ca806465', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('a5d6916b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-field w-slider-field" id="\${ty_escapeAttr(ty_generateId('de896cb6', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-slider-control" style="--value:60%;--w-slider-color:var(--w-success)" id="\${ty_escapeAttr(ty_generateId('f6f07493', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-slider-rail" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('2275b74b', 'id'))}">\`
elements+=\`<span class="w-slider-fill" id="\${ty_escapeAttr(ty_generateId('10f1566c', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<input class="w-slider-input" type="range" value="60" aria-label="Success" id="\${ty_escapeAttr(ty_generateId('3e92d15d', 'id'))}" />\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-field w-slider-field" id="\${ty_escapeAttr(ty_generateId('c152d9e1', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-slider-control" style="--value:40%;--w-slider-color:var(--w-error)" id="\${ty_escapeAttr(ty_generateId('9ca3aef9', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-slider-rail" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('d48b3732', 'id'))}">\`
elements+=\`<span class="w-slider-fill" id="\${ty_escapeAttr(ty_generateId('2a86d182', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<input class="w-slider-input" type="range" value="40" aria-label="Error" id="\${ty_escapeAttr(ty_generateId('1f82b5b9', 'id'))}" />\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('0a3e8beb', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('c2d3bbac', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-slider value="60" color="success" id="\${ty_escapeAttr(ty_generateId('01f6ef76', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
      \`
elements+=\`<w-slider value="40" color="error" id="\${ty_escapeAttr(ty_generateId('ba8d100a', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('5b0f53d2', 'id'))}">\`
elements+=\`Disabled &amp; readonly\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('b6463f83', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4b8c7476', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\` dims and freezes the slider; \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0d7d559d', 'id'))}">\`
elements+=\`readonly\`
elements+=\`</code>\`
elements+=\` freezes it without dimming.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('eb09aaac', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('437eefda', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-field w-slider-field w-slider-field--disabled" id="\${ty_escapeAttr(ty_generateId('c62a8863', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-slider-control" style="--value:50%" id="\${ty_escapeAttr(ty_generateId('d9b2bfdc', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-slider-rail" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('3c87d55a', 'id'))}">\`
elements+=\`<span class="w-slider-fill" id="\${ty_escapeAttr(ty_generateId('f70d3510', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<input class="w-slider-input" type="range" value="50" aria-label="Disabled" disabled="" id="\${ty_escapeAttr(ty_generateId('aa211463', 'id'))}" />\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-field w-slider-field w-slider-field--readonly" id="\${ty_escapeAttr(ty_generateId('386e6dd3', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-slider-control" style="--value:50%" id="\${ty_escapeAttr(ty_generateId('e67c888b', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-slider-rail" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('201f710a', 'id'))}">\`
elements+=\`<span class="w-slider-fill" id="\${ty_escapeAttr(ty_generateId('8ca550cf', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<input class="w-slider-input" type="range" value="50" aria-label="Readonly" disabled="" id="\${ty_escapeAttr(ty_generateId('77be44e1', 'id'))}" />\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('cc2509f0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('32e970b8', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-slider value="50" disabled="" id="\${ty_escapeAttr(ty_generateId('69e378d0', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
      \`
elements+=\`<w-slider value="50" readonly="" id="\${ty_escapeAttr(ty_generateId('0d80321f', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('07938445', 'id'))}">\`
elements+=\`Vertical\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('520554c6', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f1b89cd5', 'id'))}">\`
elements+=\`direction="vertical"\`
elements+=\`</code>\`
elements+=\` to orient the slider vertically.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('417cb4af', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-slider-field w-slider-field--vertical w-slider-field--thumb-label w-slider-field--thumb-label-always" id="\${ty_escapeAttr(ty_generateId('f0bc8fea', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-slider-control" style="--value:40%" id="\${ty_escapeAttr(ty_generateId('f63724ef', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-slider-rail" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('32acb5c0', 'id'))}">\`
elements+=\`<span class="w-slider-fill" id="\${ty_escapeAttr(ty_generateId('895b9276', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-slider-input" type="range" value="40" aria-label="Level" id="\${ty_escapeAttr(ty_generateId('af05b19f', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-slider-thumb-label" style="--pos:40%" id="\${ty_escapeAttr(ty_generateId('c5705e75', 'id'))}">\`
elements+=\`40\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('cb97d30b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slider value="40" direction="vertical" thumb-label="always" id="\${ty_escapeAttr(ty_generateId('fdf1241f', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/slider/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
