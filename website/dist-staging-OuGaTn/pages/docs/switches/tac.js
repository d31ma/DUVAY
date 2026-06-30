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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('7c4a2091', 'id'))}">\`
elements+=\`Switches\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('00a42acd', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('38809b36', 'id'))}">\`
elements+=\`w-switch\`
elements+=\`</code>\`
elements+=\` is a boolean toggle &#8212; an accessible checkbox styled as an on/off control. Use it for settings that take effect immediately. Style a native checkbox with the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9445dda7', 'id'))}">\`
elements+=\`.w-switch\`
elements+=\`</code>\`
elements+=\` classes, or use the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5ad561ee', 'id'))}">\`
elements+=\`&lt;w-switch&gt;\`
elements+=\`</code>\`
elements+=\` web component for colors, sizes, loading, hints, and the inset/flat variants.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('8bca408c', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('7507a4a7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('99336278', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md" id="\${ty_escapeAttr(ty_generateId('5fdfc704', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('2c44be2a', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('fbac08b4', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('be613222', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('8e9dfb0b', 'id'))}">\`
elements+=\`Auto-renew\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md" id="\${ty_escapeAttr(ty_generateId('1f6f233c', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" id="\${ty_escapeAttr(ty_generateId('a724c09d', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('73830a6c', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('e5d82e2f', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('a988a19f', 'id'))}">\`
elements+=\`Email notifications\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md" id="\${ty_escapeAttr(ty_generateId('a3dcee76', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" disabled="" id="\${ty_escapeAttr(ty_generateId('1b5a4333', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('776b4c35', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('367eb858', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('28e96172', 'id'))}">\`
elements+=\`Locked setting\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('67763bce', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('eef369dd', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-switch checked="" label="Auto-renew" id="\${ty_escapeAttr(ty_generateId('fb626fd4', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch label="Email notifications" id="\${ty_escapeAttr(ty_generateId('10d9f204', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch disabled="" label="Locked setting" id="\${ty_escapeAttr(ty_generateId('2c8539a3', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('356be3f2', 'id'))}">\`
elements+=\`Colors\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('7a31398a', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('aa3c38c0', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\` to tint the track and accent when on.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('162ccead', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('5c3d0724', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md w-switch--primary" id="\${ty_escapeAttr(ty_generateId('e442edfe', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('44523cd5', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('0125faad', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('c27bf281', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('fb8c3797', 'id'))}">\`
elements+=\`Primary\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md w-switch--success" id="\${ty_escapeAttr(ty_generateId('da3e175c', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('fb9136ca', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('b7bf2bf2', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('fe5f8edc', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('7be9f4df', 'id'))}">\`
elements+=\`Success\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md w-switch--warning" id="\${ty_escapeAttr(ty_generateId('afa34d8a', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('eafd4be5', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('bb80c33b', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('8ea9ca79', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('010dc12d', 'id'))}">\`
elements+=\`Warning\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md w-switch--error" id="\${ty_escapeAttr(ty_generateId('5ef7ef09', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('4b9a2d6b', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('99f2fe17', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('e345a4d2', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('1e3610e7', 'id'))}">\`
elements+=\`Error\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('29061e67', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('2c88b39e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-switch checked="" color="primary" label="Primary" id="\${ty_escapeAttr(ty_generateId('c60913cb', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch checked="" color="success" label="Success" id="\${ty_escapeAttr(ty_generateId('b094e40b', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch checked="" color="warning" label="Warning" id="\${ty_escapeAttr(ty_generateId('11567a73', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch checked="" color="error" label="Error" id="\${ty_escapeAttr(ty_generateId('177c93a6', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('63682a92', 'id'))}">\`
elements+=\`Sizes\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('1e07cd12', 'id'))}">\`
elements+=\`Four sizes from \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0035af07', 'id'))}">\`
elements+=\`xs\`
elements+=\`</code>\`
elements+=\` to \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('57a61121', 'id'))}">\`
elements+=\`lg\`
elements+=\`</code>\`
elements+=\`; omit for the default (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4dd53b81', 'id'))}">\`
elements+=\`md\`
elements+=\`</code>\`
elements+=\`).\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('fa4d4caf', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('c657c2c9', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--xs" id="\${ty_escapeAttr(ty_generateId('3a9aeb0d', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('23d89564', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('782d10b3', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('2263840d', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('aa2662c1', 'id'))}">\`
elements+=\`Extra small\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--sm" id="\${ty_escapeAttr(ty_generateId('5010e303', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('2a5cbf53', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('75ef975b', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('7dc049b1', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('9cd70aba', 'id'))}">\`
elements+=\`Small\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md" id="\${ty_escapeAttr(ty_generateId('607141e6', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('8848ba28', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('23dab11d', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('95927649', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('daa119e0', 'id'))}">\`
elements+=\`Medium\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--lg" id="\${ty_escapeAttr(ty_generateId('4313742f', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('7143229a', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('31d50525', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('4a296fbc', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('328dfe35', 'id'))}">\`
elements+=\`Large\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('89fbe024', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('93e82360', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-switch checked="" size="xs" label="Extra small" id="\${ty_escapeAttr(ty_generateId('ce40a4ed', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch checked="" size="sm" label="Small" id="\${ty_escapeAttr(ty_generateId('9371bbd5', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch checked="" size="md" label="Medium" id="\${ty_escapeAttr(ty_generateId('c9c54853', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch checked="" size="lg" label="Large" id="\${ty_escapeAttr(ty_generateId('efa465c1', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('2f440911', 'id'))}">\`
elements+=\`Inset\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('37f238fc', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4cff27d0', 'id'))}">\`
elements+=\`inset\`
elements+=\`</code>\`
elements+=\` so the track fully wraps the thumb.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('d41a2e75', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('f33faf5b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md w-switch--inset" id="\${ty_escapeAttr(ty_generateId('1ccb8318', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('97692fb3', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('1c82b651', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('dccbac93', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('32ad7dd7', 'id'))}">\`
elements+=\`Inset\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md w-switch--inset w-switch--flat" id="\${ty_escapeAttr(ty_generateId('d2330eb6', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('406a2a38', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('e6bc70c3', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('644e6d31', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('d243e3b2', 'id'))}">\`
elements+=\`Flat inset\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('cfed001d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('450efd24', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-switch checked="" inset="" label="Inset" id="\${ty_escapeAttr(ty_generateId('b7ec2bc5', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch checked="" inset="" flat="" label="Flat inset" id="\${ty_escapeAttr(ty_generateId('6efe59d2', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('fd1c4fb4', 'id'))}">\`
elements+=\`Loading\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('cfb6e980', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ef9ccc8d', 'id'))}">\`
elements+=\`loading\`
elements+=\`</code>\`
elements+=\` to show a spinner in the thumb and block toggling while a request is in flight.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('ab3cd873', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-switch w-switch--md w-switch--loading" id="\${ty_escapeAttr(ty_generateId('84169497', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" aria-busy="true" id="\${ty_escapeAttr(ty_generateId('ee179b1e', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('c41ac154', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('9df1f47c', 'id'))}">\`
elements+=\`<span class="w-switch-spinner" id="\${ty_escapeAttr(ty_generateId('e16b922c', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('446b4e3c', 'id'))}">\`
elements+=\`Saving&#8230;\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('311f7939', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-switch checked="" loading="" label="Saving&#8230;" id="\${ty_escapeAttr(ty_generateId('ae4c0736', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('460a84db', 'id'))}">\`
elements+=\`Hint &amp; error\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('a2c3961f', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('516cbfbf', 'id'))}">\`
elements+=\`hint\`
elements+=\`</code>\`
elements+=\` for helper text, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7a755f87', 'id'))}">\`
elements+=\`error\`
elements+=\`</code>\`
elements+=\` to surface a validation message and tint the control.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('9a06618b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('1f718ec1', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md" id="\${ty_escapeAttr(ty_generateId('6dd4b36d', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('030e6b27', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('19d5a818', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('7d7f597f', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-text" id="\${ty_escapeAttr(ty_generateId('6aaca453', 'id'))}">\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('71d71665', 'id'))}">\`
elements+=\`Marketing emails\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-hint" id="\${ty_escapeAttr(ty_generateId('d72b89c8', 'id'))}">\`
elements+=\`You can change this anytime\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md w-switch--error" id="\${ty_escapeAttr(ty_generateId('da33969e', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" aria-invalid="true" id="\${ty_escapeAttr(ty_generateId('7475e526', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('befc9d21', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('01078bfd', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-text" id="\${ty_escapeAttr(ty_generateId('0e002777', 'id'))}">\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('f89ad1e5', 'id'))}">\`
elements+=\`Accept terms\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-error" id="\${ty_escapeAttr(ty_generateId('08b90703', 'id'))}">\`
elements+=\`You must accept to continue\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('ca57bdf2', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('b1004bda', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-switch checked="" label="Marketing emails" hint="You can change this anytime" id="\${ty_escapeAttr(ty_generateId('72484e37', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch label="Accept terms" error="You must accept to continue" id="\${ty_escapeAttr(ty_generateId('f22ae9db', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/switches/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
