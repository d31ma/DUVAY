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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('92bf3dda', 'id'))}">\`
elements+=\`Slider\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('ca213123', 'id'))}">\`
elements+=\`A control for choosing a value along a track. Use the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2022c26c', 'id'))}">\`
elements+=\`.w-slider\`
elements+=\`</code>\`
elements+=\` class on a native \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4bd967f3', 'id'))}">\`
elements+=\`&lt;input type="range"&gt;\`
elements+=\`</code>\`
elements+=\` for the minimal version, or the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ff43fff8', 'id'))}">\`
elements+=\`&lt;w-slider&gt;\`
elements+=\`</code>\`
elements+=\` web component for labels, ticks, value bubbles, theming, and vertical orientation. For two thumbs, see the \`
elements+=\`<a href="/docs/range-sliders" id="\${ty_escapeAttr(ty_generateId('3beb2cf8', 'id'))}">\`
elements+=\`range slider\`
elements+=\`</a>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('f432aaf5', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('d5699cd2', 'id'))}">\`
elements+=\`
    \`
elements+=\`<input class="w-slider" type="range" min="0" max="100" value="40" style="--w-slider-pct:40%" id="\${ty_escapeAttr(ty_generateId('4311e7ed', 'id'))}" />\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('ec2c6eba', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slider min="0" max="100" value="40" id="\${ty_escapeAttr(ty_generateId('c98cf020', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('2341a2b4', 'id'))}">\`
elements+=\`Label\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('cebf8820', 'id'))}">\`
elements+=\`Add a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c2d11f90', 'id'))}">\`
elements+=\`label\`
elements+=\`</code>\`
elements+=\`; the current value shows below the track.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('c0939850', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-slider-field" id="\${ty_escapeAttr(ty_generateId('e4465fcc', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('641e1f74', 'id'))}">\`
elements+=\`Volume\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-slider-control" style="--value:60%" id="\${ty_escapeAttr(ty_generateId('56e31666', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-slider-rail" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('66a2ef9e', 'id'))}">\`
elements+=\`<span class="w-slider-fill" id="\${ty_escapeAttr(ty_generateId('eafbb001', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-slider-input" type="range" value="60" aria-label="Volume" id="\${ty_escapeAttr(ty_generateId('5170857a', 'id'))}" />\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('2179ad44', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('19c79e41', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slider label="Volume" value="60" id="\${ty_escapeAttr(ty_generateId('d45ccedb', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('5ab3faa9', 'id'))}">\`
elements+=\`Sizes\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('0805e4f7', 'id'))}">\`
elements+=\`Five sizes from \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dddb0c75', 'id'))}">\`
elements+=\`xs\`
elements+=\`</code>\`
elements+=\` to \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c59a3b97', 'id'))}">\`
elements+=\`xl\`
elements+=\`</code>\`
elements+=\`; omit for the default.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('6ea2e5c3', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('c1e4dc35', 'id'))}">\`
elements+=\`
      \`
elements+=\`<input class="w-slider w-slider--xs" type="range" value="20" style="--w-slider-pct:20%" id="\${ty_escapeAttr(ty_generateId('2abf0f43', 'id'))}" />\`
elements+=\`
      \`
elements+=\`<input class="w-slider w-slider--sm" type="range" value="30" style="--w-slider-pct:30%" id="\${ty_escapeAttr(ty_generateId('e6fb519b', 'id'))}" />\`
elements+=\`
      \`
elements+=\`<input class="w-slider" type="range" value="50" style="--w-slider-pct:50%" id="\${ty_escapeAttr(ty_generateId('0bf13643', 'id'))}" />\`
elements+=\`
      \`
elements+=\`<input class="w-slider w-slider--lg" type="range" value="70" style="--w-slider-pct:70%" id="\${ty_escapeAttr(ty_generateId('d4ea974f', 'id'))}" />\`
elements+=\`
      \`
elements+=\`<input class="w-slider w-slider--xl" type="range" value="80" style="--w-slider-pct:80%" id="\${ty_escapeAttr(ty_generateId('36214a8b', 'id'))}" />\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('0a4bd4b6', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('2a2e46f4', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-slider size="xs" value="20" id="\${ty_escapeAttr(ty_generateId('6d3f5c9a', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
      \`
elements+=\`<w-slider size="sm" value="30" id="\${ty_escapeAttr(ty_generateId('2a52ed4b', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
      \`
elements+=\`<w-slider value="50" id="\${ty_escapeAttr(ty_generateId('4add88fc', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
      \`
elements+=\`<w-slider size="lg" value="70" id="\${ty_escapeAttr(ty_generateId('785ad08d', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
      \`
elements+=\`<w-slider size="xl" value="80" id="\${ty_escapeAttr(ty_generateId('c19bf4ce', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('6ec089d1', 'id'))}">\`
elements+=\`Steps\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('e9864d0c', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6ca76e58', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cea7b6ed', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c00733c9', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\` to constrain the values.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('083fd88e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<input class="w-slider" type="range" min="0" max="10" step="2" value="6" style="--w-slider-pct:60%" id="\${ty_escapeAttr(ty_generateId('1ac7dbd1', 'id'))}" />\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('82e02cd8', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slider min="0" max="10" step="2" value="6" id="\${ty_escapeAttr(ty_generateId('ab329672', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('b770f984', 'id'))}">\`
elements+=\`Thumb label\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('dec5feb4', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('20c62665', 'id'))}">\`
elements+=\`thumb-label\`
elements+=\`</code>\`
elements+=\` to show the value on hover or focus, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0b38d3e7', 'id'))}">\`
elements+=\`thumb-label="always"\`
elements+=\`</code>\`
elements+=\` to keep the bubble visible.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('6aa2ec7f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-slider-field w-slider-field--thumb-label w-slider-field--thumb-label-always" id="\${ty_escapeAttr(ty_generateId('1fb7235f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('d52bd5ef', 'id'))}">\`
elements+=\`Brightness\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-slider-control" style="--value:65%" id="\${ty_escapeAttr(ty_generateId('25f7b981', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-slider-rail" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('bcef13d6', 'id'))}">\`
elements+=\`<span class="w-slider-fill" id="\${ty_escapeAttr(ty_generateId('108cf2c4', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-slider-input" type="range" value="65" aria-label="Brightness" id="\${ty_escapeAttr(ty_generateId('c9aba3bc', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-slider-thumb-label" style="--pos:65%" id="\${ty_escapeAttr(ty_generateId('e00c7896', 'id'))}">\`
elements+=\`65\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('6d539705', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('04a8cf78', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slider label="Brightness" value="65" thumb-label="always" id="\${ty_escapeAttr(ty_generateId('dc78d8a9', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('b0d526ae', 'id'))}">\`
elements+=\`Ticks\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('ec854a97', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('229523a1', 'id'))}">\`
elements+=\`ticks\`
elements+=\`</code>\`
elements+=\` to mark every \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('06ed2663', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ad583dc1', 'id'))}">\`
elements+=\`tick-labels\`
elements+=\`</code>\`
elements+=\` (pipe-separated) to label each one.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('c4e7825a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-slider-field" id="\${ty_escapeAttr(ty_generateId('d605bdcf', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('f41b4e45', 'id'))}">\`
elements+=\`Rating\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-slider-control" style="--value:50%" id="\${ty_escapeAttr(ty_generateId('907e4104', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-slider-rail" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('9103db62', 'id'))}">\`
elements+=\`<span class="w-slider-fill" id="\${ty_escapeAttr(ty_generateId('aed2cdff', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-slider-ticks w-slider-ticks--labelled" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('9aed8440', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-slider-tick" style="--pos:0%" id="\${ty_escapeAttr(ty_generateId('bc302bce', 'id'))}">\`
elements+=\`<span class="w-slider-tick-label" id="\${ty_escapeAttr(ty_generateId('e6fe80bb', 'id'))}">\`
elements+=\`None\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-slider-tick" style="--pos:25%" id="\${ty_escapeAttr(ty_generateId('0cd40567', 'id'))}">\`
elements+=\`<span class="w-slider-tick-label" id="\${ty_escapeAttr(ty_generateId('c8c2af62', 'id'))}">\`
elements+=\`Low\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-slider-tick" style="--pos:50%" id="\${ty_escapeAttr(ty_generateId('e7d12808', 'id'))}">\`
elements+=\`<span class="w-slider-tick-label" id="\${ty_escapeAttr(ty_generateId('90e2535a', 'id'))}">\`
elements+=\`Mid\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-slider-tick" style="--pos:75%" id="\${ty_escapeAttr(ty_generateId('bf5230ff', 'id'))}">\`
elements+=\`<span class="w-slider-tick-label" id="\${ty_escapeAttr(ty_generateId('8fbafc01', 'id'))}">\`
elements+=\`High\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-slider-tick" style="--pos:100%" id="\${ty_escapeAttr(ty_generateId('366bc597', 'id'))}">\`
elements+=\`<span class="w-slider-tick-label" id="\${ty_escapeAttr(ty_generateId('d5307855', 'id'))}">\`
elements+=\`Max\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-slider-input" type="range" min="0" max="4" step="1" value="2" aria-label="Rating" id="\${ty_escapeAttr(ty_generateId('c7569fa3', 'id'))}" />\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('7b0601e9', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('583b86fd', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slider label="Rating" min="0" max="4" step="1" value="2" tick-labels="None|Low|Mid|High|Max" id="\${ty_escapeAttr(ty_generateId('dc9733ab', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('aad75d6d', 'id'))}">\`
elements+=\`Color\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('71a7a855', 'id'))}">\`
elements+=\`Theme the fill and thumb with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1b935988', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\`, and the rail with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fe40c018', 'id'))}">\`
elements+=\`track-color\`
elements+=\`</code>\`
elements+=\`, using any token color name.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('69d80139', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('44bed8a6', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-field w-slider-field" id="\${ty_escapeAttr(ty_generateId('f22688ef', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-slider-control" style="--value:60%;--w-slider-color:var(--w-success)" id="\${ty_escapeAttr(ty_generateId('6debcb2f', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-slider-rail" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('5c89c864', 'id'))}">\`
elements+=\`<span class="w-slider-fill" id="\${ty_escapeAttr(ty_generateId('149871c3', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<input class="w-slider-input" type="range" value="60" aria-label="Success" id="\${ty_escapeAttr(ty_generateId('b54f50e3', 'id'))}" />\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-field w-slider-field" id="\${ty_escapeAttr(ty_generateId('80505032', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-slider-control" style="--value:40%;--w-slider-color:var(--w-error)" id="\${ty_escapeAttr(ty_generateId('4bb9ca2a', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-slider-rail" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('7bde17c6', 'id'))}">\`
elements+=\`<span class="w-slider-fill" id="\${ty_escapeAttr(ty_generateId('8d2e5c2e', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<input class="w-slider-input" type="range" value="40" aria-label="Error" id="\${ty_escapeAttr(ty_generateId('536ed462', 'id'))}" />\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('7bd98ca4', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('18272084', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-slider value="60" color="success" id="\${ty_escapeAttr(ty_generateId('bef44812', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
      \`
elements+=\`<w-slider value="40" color="error" id="\${ty_escapeAttr(ty_generateId('e2cee15d', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('bc69bdc7', 'id'))}">\`
elements+=\`Disabled &amp; readonly\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d977964a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dc6ef601', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\` dims and freezes the slider; \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7a51b4b9', 'id'))}">\`
elements+=\`readonly\`
elements+=\`</code>\`
elements+=\` freezes it without dimming.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('8f78bc45', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('f0bf220f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-field w-slider-field w-slider-field--disabled" id="\${ty_escapeAttr(ty_generateId('7d011f00', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-slider-control" style="--value:50%" id="\${ty_escapeAttr(ty_generateId('1989258f', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-slider-rail" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('bf5befdf', 'id'))}">\`
elements+=\`<span class="w-slider-fill" id="\${ty_escapeAttr(ty_generateId('6a9e9a7b', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<input class="w-slider-input" type="range" value="50" aria-label="Disabled" disabled="" id="\${ty_escapeAttr(ty_generateId('f4f8636c', 'id'))}" />\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-field w-slider-field w-slider-field--readonly" id="\${ty_escapeAttr(ty_generateId('6c32230f', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-slider-control" style="--value:50%" id="\${ty_escapeAttr(ty_generateId('39fea952', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-slider-rail" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('bac53853', 'id'))}">\`
elements+=\`<span class="w-slider-fill" id="\${ty_escapeAttr(ty_generateId('58c5ddfb', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<input class="w-slider-input" type="range" value="50" aria-label="Readonly" disabled="" id="\${ty_escapeAttr(ty_generateId('d983c369', 'id'))}" />\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('3c9714ae', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('04ecf604', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-slider value="50" disabled="" id="\${ty_escapeAttr(ty_generateId('f990705a', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
      \`
elements+=\`<w-slider value="50" readonly="" id="\${ty_escapeAttr(ty_generateId('7d5bdde7', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('ed1bb1f5', 'id'))}">\`
elements+=\`Vertical\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('286daf32', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1850b1da', 'id'))}">\`
elements+=\`direction="vertical"\`
elements+=\`</code>\`
elements+=\` to orient the slider vertically.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('28a5b254', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-slider-field w-slider-field--vertical w-slider-field--thumb-label w-slider-field--thumb-label-always" id="\${ty_escapeAttr(ty_generateId('e826edf9', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-slider-control" style="--value:40%" id="\${ty_escapeAttr(ty_generateId('9483c113', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-slider-rail" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('dcceacea', 'id'))}">\`
elements+=\`<span class="w-slider-fill" id="\${ty_escapeAttr(ty_generateId('933a84e3', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-slider-input" type="range" value="40" aria-label="Level" id="\${ty_escapeAttr(ty_generateId('da44b8ce', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-slider-thumb-label" style="--pos:40%" id="\${ty_escapeAttr(ty_generateId('90689e03', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('bdc55737', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slider value="40" direction="vertical" thumb-label="always" id="\${ty_escapeAttr(ty_generateId('e59e2dda', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('c3bae0ba', 'id'))}">\`
elements+=\`Attributes\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('72ef0ae3', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('e1da666b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e86346fa', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('8fa72f38', 'id'))}">\`
elements+=\`Attribute\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('0d060987', 'id'))}">\`
elements+=\`Type\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('cf36b6d1', 'id'))}">\`
elements+=\`Default\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('399d409b', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('82518dd7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('47a7adc0', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('391e0736', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('95c385a0', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ed15f461', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('45cc95e4', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1a88e853', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7af573c5', 'id'))}">\`
elements+=\`0\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0dbab713', 'id'))}">\`
elements+=\`100\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3485811e', 'id'))}">\`
elements+=\`Track bounds.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('1634217f', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('49cdc604', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d33a7caa', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f70bd37f', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('411deab2', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('218b166f', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('47af0747', 'id'))}">\`
elements+=\`Current value (reflected; also a property).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e1613d29', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('836d2417', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d760a659', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a8cd010f', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fbdf3eff', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e32a9fcc', 'id'))}">\`
elements+=\`1\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('318ff3ac', 'id'))}">\`
elements+=\`Increment between values.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('28caf332', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0e1941bd', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cb46fad1', 'id'))}">\`
elements+=\`label\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8342b80f', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('461b6c6b', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('93f440be', 'id'))}">\`
elements+=\`Field label.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('682dbe27', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('505d153b', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1057015c', 'id'))}">\`
elements+=\`hint\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9b2f8f05', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('60409462', 'id'))}">\`
elements+=\`value\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5c34223d', 'id'))}">\`
elements+=\`Helper text below the track; defaults to the current value.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('95e303b2', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ca4fa50c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('38b6b71b', 'id'))}">\`
elements+=\`hide-details\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8222667a', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5573310f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e60917e4', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('026f9bd5', 'id'))}">\`
elements+=\`Hide the message/value row.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2ebe5529', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('85284905', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('faba5da8', 'id'))}">\`
elements+=\`thumb-label\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5a07f5a4', 'id'))}">\`
elements+=\`boolean | \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b9c48c44', 'id'))}">\`
elements+=\`always\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a1bee0c6', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3b98fb34', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('db43edf4', 'id'))}">\`
elements+=\`Show a value bubble over the thumb (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7fcd6206', 'id'))}">\`
elements+=\`always\`
elements+=\`</code>\`
elements+=\` keeps it visible).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('0b110413', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4f7dac59', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ee575730', 'id'))}">\`
elements+=\`ticks\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('15b2e763', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('755ae934', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e764ae6b', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('090b0afa', 'id'))}">\`
elements+=\`Draw a tick at every \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7af88a39', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('297713b6', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('74939208', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('426fb261', 'id'))}">\`
elements+=\`tick-labels\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d9c834f1', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b5dcb0c4', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('824b2ceb', 'id'))}">\`
elements+=\`Pipe-separated labels placed at each step (implies \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('08c4384d', 'id'))}">\`
elements+=\`ticks\`
elements+=\`</code>\`
elements+=\`).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('91d18c6d', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6867c988', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ca9126b6', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('41d1008a', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f195cc3c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('24c2c9c0', 'id'))}">\`
elements+=\`primary\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('cab3f917', 'id'))}">\`
elements+=\`Token color for the fill and thumb.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('59075ae2', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('91ed96f1', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('28e086f1', 'id'))}">\`
elements+=\`track-color\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9600bfb1', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3dfe9acd', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a80dafcf', 'id'))}">\`
elements+=\`Token color for the unfilled rail.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('bd4a3a25', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('947b03c4', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('47e15266', 'id'))}">\`
elements+=\`direction\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('dd9fbeb8', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a0a4dc57', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f3e73b28', 'id'))}">\`
elements+=\`horizontal\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('aae9afb5', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dd7098e6', 'id'))}">\`
elements+=\`horizontal\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ebda5a0c', 'id'))}">\`
elements+=\`vertical\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('73b0df98', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c01d3d2f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5e3a0483', 'id'))}">\`
elements+=\`reverse\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('edee15e2', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2468fe4c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e203c3de', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('06beb471', 'id'))}">\`
elements+=\`Flip the track so the max is at the start.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('d8bf7751', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('38d1b1d9', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6a9896c7', 'id'))}">\`
elements+=\`size\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4eb11084', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a6b8afed', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('79a753fb', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a7ca9ee4', 'id'))}">\`
elements+=\`xs\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0b6d4b91', 'id'))}">\`
elements+=\`sm\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f5fc96ea', 'id'))}">\`
elements+=\`lg\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0005b3c0', 'id'))}">\`
elements+=\`xl\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('1cbee6dd', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c5b67b75', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('261ab570', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5fffcd8e', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('44ef5d3f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9e8bf637', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('560da31b', 'id'))}">\`
elements+=\`Non-interactive and dimmed.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('a3ad4cf9', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('148eb414', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6649f088', 'id'))}">\`
elements+=\`readonly\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('787c168a', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fd31a428', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('677eafe6', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('bac760bc', 'id'))}">\`
elements+=\`Non-interactive without dimming.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('cfa1d433', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3a7c09d3', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0361df7b', 'id'))}">\`
elements+=\`name\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('97894629', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('bacfbd7b', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7d313de2', 'id'))}">\`
elements+=\`Form field name.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('c16f8d2b', 'id'))}">\`
elements+=\`Events\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('40a5b2fb', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('56c31928', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('b587ee7b', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('b9ca2744', 'id'))}">\`
elements+=\`Event\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('1130efda', 'id'))}">\`
elements+=\`Detail\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('480f478b', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('4fa66f3d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('ea1b3b0f', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('29379993', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c442bfcd', 'id'))}">\`
elements+=\`input\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5cb83c1e', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f96e89b1', 'id'))}">\`
elements+=\`&#123; value, name &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('603ece9e', 'id'))}">\`
elements+=\`Fired while dragging.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('7d7960c5', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('dc89aa84', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e16e276c', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3f3bfc72', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('43006af7', 'id'))}">\`
elements+=\`&#123; value, name &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e130ee98', 'id'))}">\`
elements+=\`Fired when the thumb is released.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/slider/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
