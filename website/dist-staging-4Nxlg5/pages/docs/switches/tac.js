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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('4038100b', 'id'))}">\`
elements+=\`Switches\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('94786c7e', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('be588e0f', 'id'))}">\`
elements+=\`w-switch\`
elements+=\`</code>\`
elements+=\` is a boolean toggle &#8212; an accessible checkbox styled as an on/off control. Use it for settings that take effect immediately. Style a native checkbox with the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e5a34b8d', 'id'))}">\`
elements+=\`.w-switch\`
elements+=\`</code>\`
elements+=\` classes, or use the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('088f002b', 'id'))}">\`
elements+=\`&lt;w-switch&gt;\`
elements+=\`</code>\`
elements+=\` web component for colors, sizes, loading, hints, and the inset/flat variants.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('96f4c5f2', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('4f75b87f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('7295eacb', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md" id="\${ty_escapeAttr(ty_generateId('e81fe1f3', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('fe05d3ba', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('addb3fad', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('9654899b', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('542aadac', 'id'))}">\`
elements+=\`Auto-renew\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md" id="\${ty_escapeAttr(ty_generateId('a4dfa000', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" id="\${ty_escapeAttr(ty_generateId('3d805366', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('1f77fa71', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('ab28ee94', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('a6788613', 'id'))}">\`
elements+=\`Email notifications\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md" id="\${ty_escapeAttr(ty_generateId('6fa1f460', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" disabled="" id="\${ty_escapeAttr(ty_generateId('cb653836', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('27eb8b18', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('19bd1ec4', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('7256a535', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('a887d3ef', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('0d49fbe6', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-switch checked="" label="Auto-renew" id="\${ty_escapeAttr(ty_generateId('84f51179', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch label="Email notifications" id="\${ty_escapeAttr(ty_generateId('e3a17dd9', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch disabled="" label="Locked setting" id="\${ty_escapeAttr(ty_generateId('d8d084d9', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('310104e9', 'id'))}">\`
elements+=\`Colors\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('26dfb9a9', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4c430617', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\` to tint the track and accent when on.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('97be1edb', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('17248ba6', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md w-switch--primary" id="\${ty_escapeAttr(ty_generateId('ed4b476e', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('1e64fd4a', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('499b3c0a', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('0766051f', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('1105ef3c', 'id'))}">\`
elements+=\`Primary\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md w-switch--success" id="\${ty_escapeAttr(ty_generateId('eb02165f', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('c654969b', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('3c3d4d23', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('ca94596d', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('c3031348', 'id'))}">\`
elements+=\`Success\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md w-switch--warning" id="\${ty_escapeAttr(ty_generateId('23897501', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('1e59ba44', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('61073179', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('8bd3171d', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('c42aaba7', 'id'))}">\`
elements+=\`Warning\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md w-switch--error" id="\${ty_escapeAttr(ty_generateId('08939bd0', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('dc8ffe88', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('420f512d', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('e0662dcc', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('8f3fbafb', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('49e282ce', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('e7067ffe', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-switch checked="" color="primary" label="Primary" id="\${ty_escapeAttr(ty_generateId('f0c28aa0', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch checked="" color="success" label="Success" id="\${ty_escapeAttr(ty_generateId('acb7b8bd', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch checked="" color="warning" label="Warning" id="\${ty_escapeAttr(ty_generateId('202a570b', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch checked="" color="error" label="Error" id="\${ty_escapeAttr(ty_generateId('ac7d035f', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('c38d4f98', 'id'))}">\`
elements+=\`Sizes\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('8f2c65cd', 'id'))}">\`
elements+=\`Four sizes from \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b2b3fd6e', 'id'))}">\`
elements+=\`xs\`
elements+=\`</code>\`
elements+=\` to \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dea36a2d', 'id'))}">\`
elements+=\`lg\`
elements+=\`</code>\`
elements+=\`; omit for the default (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dc575a99', 'id'))}">\`
elements+=\`md\`
elements+=\`</code>\`
elements+=\`).\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('9966dced', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('07af7d84', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--xs" id="\${ty_escapeAttr(ty_generateId('55d9146d', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('c327737a', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('47d6d35c', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('12ec8200', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('93f4374e', 'id'))}">\`
elements+=\`Extra small\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--sm" id="\${ty_escapeAttr(ty_generateId('0cfc91b3', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('04de4c32', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('a0e205e5', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('4dbc35a3', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('60b108d7', 'id'))}">\`
elements+=\`Small\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md" id="\${ty_escapeAttr(ty_generateId('3e739179', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('6f37f77e', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('85d5fd29', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('7b613fbb', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('ec07e7f1', 'id'))}">\`
elements+=\`Medium\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--lg" id="\${ty_escapeAttr(ty_generateId('7f7ab4bc', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('4512cd2d', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('c1317c3e', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('7986b51a', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('dbc4cb1e', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('b0c69638', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('06dacd76', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-switch checked="" size="xs" label="Extra small" id="\${ty_escapeAttr(ty_generateId('1714c9ac', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch checked="" size="sm" label="Small" id="\${ty_escapeAttr(ty_generateId('21983c49', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch checked="" size="md" label="Medium" id="\${ty_escapeAttr(ty_generateId('53239a03', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch checked="" size="lg" label="Large" id="\${ty_escapeAttr(ty_generateId('ffb4d1ac', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('d015020a', 'id'))}">\`
elements+=\`Inset\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('ff242c07', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2aca6f14', 'id'))}">\`
elements+=\`inset\`
elements+=\`</code>\`
elements+=\` so the track fully wraps the thumb.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('52f51170', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('f698d816', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md w-switch--inset" id="\${ty_escapeAttr(ty_generateId('7dc58bce', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('31756d72', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('7c91855b', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('bd608fb5', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('cfb60396', 'id'))}">\`
elements+=\`Inset\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md w-switch--inset w-switch--flat" id="\${ty_escapeAttr(ty_generateId('7d7c9359', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('d662e865', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('f254ae80', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('0096d159', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('b6e990ac', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('d89951ed', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('c6326e33', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-switch checked="" inset="" label="Inset" id="\${ty_escapeAttr(ty_generateId('f8e9051f', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch checked="" inset="" flat="" label="Flat inset" id="\${ty_escapeAttr(ty_generateId('d94e3616', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('21b942de', 'id'))}">\`
elements+=\`Loading\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('ae640a7a', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7e061609', 'id'))}">\`
elements+=\`loading\`
elements+=\`</code>\`
elements+=\` to show a spinner in the thumb and block toggling while a request is in flight.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('df2e91ce', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-switch w-switch--md w-switch--loading" id="\${ty_escapeAttr(ty_generateId('9f1a76eb', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" aria-busy="true" id="\${ty_escapeAttr(ty_generateId('6d484e65', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('c265e0be', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('fc0631fe', 'id'))}">\`
elements+=\`<span class="w-switch-spinner" id="\${ty_escapeAttr(ty_generateId('f97a6a25', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('49b93d03', 'id'))}">\`
elements+=\`Saving&#8230;\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('2e4db8a8', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-switch checked="" loading="" label="Saving&#8230;" id="\${ty_escapeAttr(ty_generateId('5d06c365', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('3c99d28b', 'id'))}">\`
elements+=\`Hint &amp; error\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('5fd20520', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('74ac0a04', 'id'))}">\`
elements+=\`hint\`
elements+=\`</code>\`
elements+=\` for helper text, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c42d366f', 'id'))}">\`
elements+=\`error\`
elements+=\`</code>\`
elements+=\` to surface a validation message and tint the control.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('3b8f7c81', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('a58e7520', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md" id="\${ty_escapeAttr(ty_generateId('4952ee0b', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('2690df31', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('678bc8b5', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('c8b03f64', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-text" id="\${ty_escapeAttr(ty_generateId('ff616843', 'id'))}">\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('93fed214', 'id'))}">\`
elements+=\`Marketing emails\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-hint" id="\${ty_escapeAttr(ty_generateId('15c1ad83', 'id'))}">\`
elements+=\`You can change this anytime\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-switch w-switch--md w-switch--error" id="\${ty_escapeAttr(ty_generateId('6893eafc', 'id'))}">\`
elements+=\`<input class="w-switch-input" type="checkbox" aria-invalid="true" id="\${ty_escapeAttr(ty_generateId('f4f01bc6', 'id'))}" />\`
elements+=\`<span class="w-switch-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('8cf6c900', 'id'))}">\`
elements+=\`<span class="w-switch-thumb" id="\${ty_escapeAttr(ty_generateId('ef7170cb', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-text" id="\${ty_escapeAttr(ty_generateId('66bde4b6', 'id'))}">\`
elements+=\`<span class="w-switch-label" id="\${ty_escapeAttr(ty_generateId('6d3ff5d9', 'id'))}">\`
elements+=\`Accept terms\`
elements+=\`</span>\`
elements+=\`<span class="w-switch-error" id="\${ty_escapeAttr(ty_generateId('4dc605d4', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('0a3c8b99', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('ef7a4747', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-switch checked="" label="Marketing emails" hint="You can change this anytime" id="\${ty_escapeAttr(ty_generateId('436ab055', 'id'))}">\`
elements+=\`</w-switch>\`
elements+=\`
      \`
elements+=\`<w-switch label="Accept terms" error="You must accept to continue" id="\${ty_escapeAttr(ty_generateId('4cca67bf', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('3056855e', 'id'))}">\`
elements+=\`Attributes\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('14d2d1fc', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('126c45d9', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('c7a07136', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('4b7d09af', 'id'))}">\`
elements+=\`Attribute\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('fe22a5b5', 'id'))}">\`
elements+=\`Type\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('fbe26b75', 'id'))}">\`
elements+=\`Default\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('f076d6bb', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('0aa033e8', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('69c64b82', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7b9be483', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8f6ab16a', 'id'))}">\`
elements+=\`checked\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0412b400', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5a638cd8', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cf65aa9c', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('475aaf20', 'id'))}">\`
elements+=\`On/off state (reflected; also a property).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('6efa808f', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b3613cc7', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5369f6e4', 'id'))}">\`
elements+=\`label\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('432318de', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('436268df', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('94744b90', 'id'))}">\`
elements+=\`Label text (or use the default slot).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('9864b1d7', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('826a0990', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('373293ba', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1e6875dd', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b38f5000', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2f1e80a0', 'id'))}">\`
elements+=\`primary\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e124bce5', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('05c05db5', 'id'))}">\`
elements+=\`primary\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a17bce7e', 'id'))}">\`
elements+=\`success\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6fcd5656', 'id'))}">\`
elements+=\`warning\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9da09eb1', 'id'))}">\`
elements+=\`error\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('c2976f17', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c4f32d9d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('88de0788', 'id'))}">\`
elements+=\`size\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0896ac42', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d57c4e85', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f9ec74e0', 'id'))}">\`
elements+=\`md\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5a15b3da', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8004621c', 'id'))}">\`
elements+=\`xs\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c7c841ba', 'id'))}">\`
elements+=\`sm\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c760224e', 'id'))}">\`
elements+=\`md\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e9f6fde1', 'id'))}">\`
elements+=\`lg\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('7dcf070e', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('12dba951', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ce843c9f', 'id'))}">\`
elements+=\`inset\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8ccc2e6f', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fb7481f9', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dc53e4fd', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ec600099', 'id'))}">\`
elements+=\`Track fully encloses the thumb.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('4d6af6c9', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ac93d90c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0cf632d7', 'id'))}">\`
elements+=\`flat\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('600ac631', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('12cd0cb6', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('71ef9cce', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d3e89332', 'id'))}">\`
elements+=\`Thumb without elevation.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('53156917', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3e4ec327', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3dc9b5b4', 'id'))}">\`
elements+=\`loading\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('abf44e73', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4b1bb681', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d9c02075', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('be3ffe85', 'id'))}">\`
elements+=\`Show a spinner in the thumb and block toggling.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('f6191fb6', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7190a062', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cd78aa55', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('619f07a4', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('874c96c6', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dfd00665', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ab740e6d', 'id'))}">\`
elements+=\`Non-interactive and dimmed.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e3663430', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('33401172', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cebd2043', 'id'))}">\`
elements+=\`readonly\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d8315ad9', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a89ed2a7', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('614a4392', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e6344975', 'id'))}">\`
elements+=\`Non-interactive without dimming.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('328719e4', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c6477cc7', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8faa7f54', 'id'))}">\`
elements+=\`hint\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('151d3afe', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d8000fed', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c26714e5', 'id'))}">\`
elements+=\`Helper text below the label.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('0c01708d', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8074622b', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f7b72718', 'id'))}">\`
elements+=\`error\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e26e2de1', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d60cc07b', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('08d09714', 'id'))}">\`
elements+=\`Error text; tints the control red.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('4e6105de', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5fcdda17', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a0857bc6', 'id'))}">\`
elements+=\`hide-details\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('887e2873', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f02fca8e', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a16e6d85', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7460a474', 'id'))}">\`
elements+=\`Suppress hint/error text.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('3997d8eb', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6793c7e3', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c59c99c2', 'id'))}">\`
elements+=\`name\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('509bd570', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('57c57b08', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('bb4a52d7', 'id'))}">\`
elements+=\`&#8212; / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('11160a67', 'id'))}">\`
elements+=\`on\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('941734e8', 'id'))}">\`
elements+=\`Form field name and value when checked.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('66a67d99', 'id'))}">\`
elements+=\`Events\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('67a3b5f3', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('2a6e4868', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('955f6764', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('33345960', 'id'))}">\`
elements+=\`Event\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('d4fad13b', 'id'))}">\`
elements+=\`Detail\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('a077a5dd', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('a3493d3f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('45114958', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9c0c9f5a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5293a170', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('654361de', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('54c3c170', 'id'))}">\`
elements+=\`&#123; checked, value, name &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4ba58819', 'id'))}">\`
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
