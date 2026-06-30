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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('942c7a07', 'id'))}">\`
elements+=\`Switches\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c692fd0d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('781e9623', 'id'))}">\`
elements+=\`w-switch\`
elements+=\`</code>\`
elements+=\` is a boolean toggle &#8212; an accessible checkbox styled as an on/off control. Use it for settings that take effect immediately. Style a native checkbox with the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e7ee4ae8', 'id'))}">\`
elements+=\`.w-switch\`
elements+=\`</code>\`
elements+=\` classes, or use the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e922f2dc', 'id'))}">\`
elements+=\`&lt;w-switch&gt;\`
elements+=\`</code>\`
elements+=\` web component for colors, sizes, loading, hints, and the inset/flat variants.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('098d2597', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('75fd7d15', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('18b7ab76', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md" id="\${ty_escapeAttr(ty_generateId('d2a326f4', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('b14e237f', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('1e8dc7e0', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('5b1589e3', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('b4837b15', 'id'))}">\`
elements+=\`Auto-renew\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md" id="\${ty_escapeAttr(ty_generateId('a9b93108', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" id="\${ty_escapeAttr(ty_generateId('a978d70a', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('fe6d72d8', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('a81ab74e', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('5026b1e0', 'id'))}">\`
elements+=\`Email notifications\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md" id="\${ty_escapeAttr(ty_generateId('bc692ada', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" disabled="" id="\${ty_escapeAttr(ty_generateId('e6b831e7', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('54551997', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('879cfd7f', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('8a6cca2d', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('8ab3a12f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('489a49da', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-switch checked="" label="Auto-renew" id="\${ty_escapeAttr(ty_generateId('8cde21c9', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch label="Email notifications" id="\${ty_escapeAttr(ty_generateId('17f5d9c5', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch disabled="" label="Locked setting" id="\${ty_escapeAttr(ty_generateId('5989cb4b', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('7e027760', 'id'))}">\`
elements+=\`Colors\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('cb4e44da', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('63ff796d', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\` to tint the track and accent when on.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('89306cad', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('f9652147', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md w-switch--primary" id="\${ty_escapeAttr(ty_generateId('db82af34', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('928857c5', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('ca1b74d3', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('11141a8c', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('87208946', 'id'))}">\`
elements+=\`Primary\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md w-switch--success" id="\${ty_escapeAttr(ty_generateId('a835c943', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('fcc95bc9', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('ba0fcbba', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('72ed0955', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('f8da7ce6', 'id'))}">\`
elements+=\`Success\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md w-switch--warning" id="\${ty_escapeAttr(ty_generateId('c1d8bf06', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('0897e937', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('392c4147', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('822b7741', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('d110e89c', 'id'))}">\`
elements+=\`Warning\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md w-switch--error" id="\${ty_escapeAttr(ty_generateId('6b5896b7', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('def72f3a', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('625a2b9e', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('8c6dba2c', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('4200a6f3', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('2d6475a3', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('3d2838f2', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-switch checked="" color="primary" label="Primary" id="\${ty_escapeAttr(ty_generateId('12b03615', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch checked="" color="success" label="Success" id="\${ty_escapeAttr(ty_generateId('5f5708ea', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch checked="" color="warning" label="Warning" id="\${ty_escapeAttr(ty_generateId('3ade8bac', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch checked="" color="error" label="Error" id="\${ty_escapeAttr(ty_generateId('2d121985', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('14039920', 'id'))}">\`
elements+=\`Sizes\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('b9a2b46f', 'id'))}">\`
elements+=\`Four sizes from \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4ebdc10e', 'id'))}">\`
elements+=\`xs\`
elements+=\`</code>\`
elements+=\` to \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e2b5736d', 'id'))}">\`
elements+=\`lg\`
elements+=\`</code>\`
elements+=\`; omit for the default (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c4ec9079', 'id'))}">\`
elements+=\`md\`
elements+=\`</code>\`
elements+=\`).\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('77516983', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('c4d295cd', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--xs" id="\${ty_escapeAttr(ty_generateId('ef334036', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('76eaa198', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('52125cd2', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('797d2a11', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('e0103ec6', 'id'))}">\`
elements+=\`Extra small\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--sm" id="\${ty_escapeAttr(ty_generateId('040c1140', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('23800158', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('6686977c', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('23bdfba4', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('1df1370b', 'id'))}">\`
elements+=\`Small\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md" id="\${ty_escapeAttr(ty_generateId('6b76a521', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('d364ba4b', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('2ff88f02', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('76b25c59', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('7bafa5ed', 'id'))}">\`
elements+=\`Medium\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--lg" id="\${ty_escapeAttr(ty_generateId('03f2a3d0', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('e6f2e20c', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('28bc63a1', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('3f548401', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('455d1961', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('421de003', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('3da17cf0', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-switch checked="" size="xs" label="Extra small" id="\${ty_escapeAttr(ty_generateId('40cbd305', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch checked="" size="sm" label="Small" id="\${ty_escapeAttr(ty_generateId('72a65b6f', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch checked="" size="md" label="Medium" id="\${ty_escapeAttr(ty_generateId('7fa09333', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch checked="" size="lg" label="Large" id="\${ty_escapeAttr(ty_generateId('c535d6c5', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('c2675aa1', 'id'))}">\`
elements+=\`Inset\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('abce70da', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bdd9322d', 'id'))}">\`
elements+=\`inset\`
elements+=\`</code>\`
elements+=\` so the track fully wraps the thumb.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('bce250b3', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('d1f85619', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md w-switch--inset" id="\${ty_escapeAttr(ty_generateId('ed7d73b4', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('0c444af9', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('1d48b52f', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('a84ea7b5', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('fee9db79', 'id'))}">\`
elements+=\`Inset\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md w-switch--inset w-switch--flat" id="\${ty_escapeAttr(ty_generateId('cf7bdfbf', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('61d0e589', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('d6bc60af', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('ea12549e', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('dee97244', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('d8ede74b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('5680be0d', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-switch checked="" inset="" label="Inset" id="\${ty_escapeAttr(ty_generateId('fb8d4c04', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch checked="" inset="" flat="" label="Flat inset" id="\${ty_escapeAttr(ty_generateId('cc5ea6c5', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('c76f2fbc', 'id'))}">\`
elements+=\`Loading\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('0a408597', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fad136be', 'id'))}">\`
elements+=\`loading\`
elements+=\`</code>\`
elements+=\` to show a spinner in the thumb and block toggling while a request is in flight.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('3a13a8c0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-switch w-switch--md w-switch--loading" id="\${ty_escapeAttr(ty_generateId('21c85c26', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" aria-busy="true" id="\${ty_escapeAttr(ty_generateId('6e719cd8', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('62ba1e89', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('aced9d09', 'id'))}">\`
elements+=\`<span class="w-switch-spinner" id="\${ty_escapeAttr(ty_generateId('19ec4020', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('182e50b7', 'id'))}">\`
elements+=\`Saving&#8230;\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('6aaeef19', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-switch checked="" loading="" label="Saving&#8230;" id="\${ty_escapeAttr(ty_generateId('3b0a3ebe', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('15f6a400', 'id'))}">\`
elements+=\`Hint &amp; error\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('709658a6', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7fe44b78', 'id'))}">\`
elements+=\`hint\`
elements+=\`</code>\`
elements+=\` for helper text, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bcb3e4ed', 'id'))}">\`
elements+=\`error\`
elements+=\`</code>\`
elements+=\` to surface a validation message and tint the control.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('5cc4ac86', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('0d11339f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md" id="\${ty_escapeAttr(ty_generateId('fa5b5135', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('083edaf9', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('0e0493a5', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('91471401', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-text" id="\${ty_escapeAttr(ty_generateId('e62d39b5', 'id'))}">\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('1abb368d', 'id'))}">\`
elements+=\`Marketing emails\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-hint" id="\${ty_escapeAttr(ty_generateId('0626ada4', 'id'))}">\`
elements+=\`You can change this anytime\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md w-switch--error" id="\${ty_escapeAttr(ty_generateId('4cc34202', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" aria-invalid="true" id="\${ty_escapeAttr(ty_generateId('3c64f629', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('ad42d878', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('a13175a9', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-text" id="\${ty_escapeAttr(ty_generateId('35e8edc3', 'id'))}">\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('46000220', 'id'))}">\`
elements+=\`Accept terms\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-error" id="\${ty_escapeAttr(ty_generateId('78d5e991', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('5347379b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('43ec90d1', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-switch checked="" label="Marketing emails" hint="You can change this anytime" id="\${ty_escapeAttr(ty_generateId('52c8d9ac', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch label="Accept terms" error="You must accept to continue" id="\${ty_escapeAttr(ty_generateId('d90d15f6', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('b892628f', 'id'))}">\`
elements+=\`Attributes\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('6ff44a20', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('e9f77686', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('feb05f3b', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('666cad7e', 'id'))}">\`
elements+=\`Attribute\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('a124057b', 'id'))}">\`
elements+=\`Type\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('cf3ee3df', 'id'))}">\`
elements+=\`Default\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('0c3badb2', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('a7bb66e5', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('8a2cb574', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('90fc9b01', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b8c7dd89', 'id'))}">\`
elements+=\`checked\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a5fe8a35', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('33df6439', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a51da788', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('96737f53', 'id'))}">\`
elements+=\`On/off state (reflected; also a property).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('095c0b45', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('bdc5ba66', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('818624f7', 'id'))}">\`
elements+=\`label\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3a6a99c8', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f644d234', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f22732ca', 'id'))}">\`
elements+=\`Label text (or use the default slot).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('dc65ab2f', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a5d9759a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2c2ea5f8', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('114d39d3', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ff8a6897', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2bdff6e6', 'id'))}">\`
elements+=\`primary\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('872bee80', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5b374081', 'id'))}">\`
elements+=\`primary\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b37f8681', 'id'))}">\`
elements+=\`success\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c05eee1d', 'id'))}">\`
elements+=\`warning\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d6cf1e3d', 'id'))}">\`
elements+=\`error\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('87a565e5', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('001ebc70', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('58667958', 'id'))}">\`
elements+=\`size\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('79fac95a', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4eb0a587', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8d55754b', 'id'))}">\`
elements+=\`md\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3683ba4f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5e434638', 'id'))}">\`
elements+=\`xs\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('878124ee', 'id'))}">\`
elements+=\`sm\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('40c06485', 'id'))}">\`
elements+=\`md\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7f6263b9', 'id'))}">\`
elements+=\`lg\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('43549ed3', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a32766d9', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ad9bcc95', 'id'))}">\`
elements+=\`inset\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('744041ca', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2938f57f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ed531ba9', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('badc05c7', 'id'))}">\`
elements+=\`Track fully encloses the thumb.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2609ad2e', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b81d31df', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c2533705', 'id'))}">\`
elements+=\`flat\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('dbe66895', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('14cf0982', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8852cde6', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6e312485', 'id'))}">\`
elements+=\`Thumb without elevation.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('25bb4972', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8417ad1e', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('545c1e53', 'id'))}">\`
elements+=\`loading\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7345f642', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ba1acecf', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1ab9b5ec', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('87c77bf5', 'id'))}">\`
elements+=\`Show a spinner in the thumb and block toggling.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('6a8cca24', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('25391ed4', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('90cc8410', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3d2dd69e', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5d5da44a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a02033a7', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6376572e', 'id'))}">\`
elements+=\`Non-interactive and dimmed.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e6ed91c3', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('10f624a0', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d98ac318', 'id'))}">\`
elements+=\`readonly\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8b81d0ef', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7d7b64a2', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c0d1815c', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0a7dc086', 'id'))}">\`
elements+=\`Non-interactive without dimming.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('f31b8378', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8b69709c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('aafe7723', 'id'))}">\`
elements+=\`hint\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7375d98b', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ec96d2e3', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ea6c8cce', 'id'))}">\`
elements+=\`Helper text below the label.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('cd3157f9', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b575868f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('88e117d6', 'id'))}">\`
elements+=\`error\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c94d5645', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('015b6463', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('99ff28be', 'id'))}">\`
elements+=\`Error text; tints the control red.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('763af069', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('380a1f0d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('07fb3b22', 'id'))}">\`
elements+=\`hide-details\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('73878165', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b180f8ca', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7e75a54d', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c0afcc94', 'id'))}">\`
elements+=\`Suppress hint/error text.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('827b3681', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a3f9bcd9', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c2076aad', 'id'))}">\`
elements+=\`name\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9aa62d60', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0d361d1f', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f0ffda92', 'id'))}">\`
elements+=\`&#8212; / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0a539664', 'id'))}">\`
elements+=\`on\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('357a68ae', 'id'))}">\`
elements+=\`Form field name and value when checked.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('1faec7b6', 'id'))}">\`
elements+=\`Events\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('29c48e0b', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('5a2f26ba', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('09fef48f', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('fbbcc861', 'id'))}">\`
elements+=\`Event\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('98391240', 'id'))}">\`
elements+=\`Detail\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('7127bca3', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('37e372ca', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('c68b52eb', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d34210d3', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2578b635', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('bceb301f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('15bb4429', 'id'))}">\`
elements+=\`&#123; checked, value, name &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('40318398', 'id'))}">\`
elements+=\`Fired when the switch is toggled.\`
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
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/switches/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
