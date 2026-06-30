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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('1e405919', 'id'))}">\`
elements+=\`Speed Dials\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('32e3bb8c', 'id'))}">\`
elements+=\`A floating action button that reveals related actions in a radial or linear menu. Supports hover, click, keyboard, and multiple transition and direction modes.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('69dfef06', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('922a1dd0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-4 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('454db23f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-speed-dial w-speed-dial--top w-speed-dial--center w-speed-dial--open w-speed-dial--transition-scale" id="\${ty_escapeAttr(ty_generateId('3c848356', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-fab w-speed-dial__trigger" type="button" aria-expanded="true" aria-haspopup="true" aria-label="Open actions" id="\${ty_escapeAttr(ty_generateId('adbd542c', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-icon" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('c3034fd7', 'id'))}">\`
elements+=\`+\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-speed-dial__actions" id="\${ty_escapeAttr(ty_generateId('dcc8b739', 'id'))}">\`
elements+=\`
          \`
elements+=\`<button class="w-fab" type="button" aria-label="Edit" id="\${ty_escapeAttr(ty_generateId('8da2cc42', 'id'))}">\`
elements+=\`<span class="w-icon" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('3e809b63', 'id'))}">\`
elements+=\`✎\`
elements+=\`</span>\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<button class="w-fab" type="button" aria-label="Delete" id="\${ty_escapeAttr(ty_generateId('53d8cb78', 'id'))}">\`
elements+=\`<span class="w-icon" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('97b155fc', 'id'))}">\`
elements+=\`\uD83D\uDDD1\`
elements+=\`</span>\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('55cc4bcf', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-4 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('54ba8676', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-speed-dial open="" icon="+" aria-label="Open actions" id="\${ty_escapeAttr(ty_generateId('7f78a1b3', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-fab icon="✎" aria-label="Edit" id="\${ty_escapeAttr(ty_generateId('a90f5613', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
        \`
elements+=\`<w-fab icon="\uD83D\uDDD1" aria-label="Delete" id="\${ty_escapeAttr(ty_generateId('b6cb0fc0', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
      \`
elements+=\`</w-speed-dial>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('4f469d1d', 'id'))}">\`
elements+=\`Directions\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('de6c4f9b', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('106c4837', 'id'))}">\`
elements+=\`location\`
elements+=\`</code>\`
elements+=\` to control the fan direction: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b2dd8151', 'id'))}">\`
elements+=\`top\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('12c12edc', 'id'))}">\`
elements+=\`bottom\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f922c595', 'id'))}">\`
elements+=\`left\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b37f153f', 'id'))}">\`
elements+=\`right\`
elements+=\`</code>\`
elements+=\` combined with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3ee9e621', 'id'))}">\`
elements+=\`start\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e9fc443c', 'id'))}">\`
elements+=\`end\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('018f8886', 'id'))}">\`
elements+=\`center\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('d2eed720', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-4 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('24cb1ad0', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-speed-dial w-speed-dial--top w-speed-dial--center w-speed-dial--open w-speed-dial--transition-scale" id="\${ty_escapeAttr(ty_generateId('3308aab8', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-fab w-speed-dial__trigger" type="button" aria-expanded="true" aria-label="Up" id="\${ty_escapeAttr(ty_generateId('2727461f', 'id'))}">\`
elements+=\`+\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-speed-dial__actions" id="\${ty_escapeAttr(ty_generateId('fc4365b2', 'id'))}">\`
elements+=\`
          \`
elements+=\`<button class="w-fab" type="button" id="\${ty_escapeAttr(ty_generateId('71b6f8e0', 'id'))}">\`
elements+=\`1\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<button class="w-fab" type="button" id="\${ty_escapeAttr(ty_generateId('29c40654', 'id'))}">\`
elements+=\`2\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-speed-dial w-speed-dial--bottom w-speed-dial--center w-speed-dial--open w-speed-dial--transition-scale" id="\${ty_escapeAttr(ty_generateId('1b764c27', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-fab w-speed-dial__trigger" type="button" aria-expanded="true" aria-label="Down" id="\${ty_escapeAttr(ty_generateId('b35b1866', 'id'))}">\`
elements+=\`+\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-speed-dial__actions" id="\${ty_escapeAttr(ty_generateId('f7577dcc', 'id'))}">\`
elements+=\`
          \`
elements+=\`<button class="w-fab" type="button" id="\${ty_escapeAttr(ty_generateId('c1670877', 'id'))}">\`
elements+=\`1\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<button class="w-fab" type="button" id="\${ty_escapeAttr(ty_generateId('a262e644', 'id'))}">\`
elements+=\`2\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-speed-dial w-speed-dial--left w-speed-dial--center w-speed-dial--open w-speed-dial--transition-scale" id="\${ty_escapeAttr(ty_generateId('fc4dcf1c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-fab w-speed-dial__trigger" type="button" aria-expanded="true" aria-label="Left" id="\${ty_escapeAttr(ty_generateId('c39f1c8e', 'id'))}">\`
elements+=\`+\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-speed-dial__actions" id="\${ty_escapeAttr(ty_generateId('d6ede6bd', 'id'))}">\`
elements+=\`
          \`
elements+=\`<button class="w-fab" type="button" id="\${ty_escapeAttr(ty_generateId('009badea', 'id'))}">\`
elements+=\`1\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<button class="w-fab" type="button" id="\${ty_escapeAttr(ty_generateId('03800364', 'id'))}">\`
elements+=\`2\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-speed-dial w-speed-dial--right w-speed-dial--center w-speed-dial--open w-speed-dial--transition-scale" id="\${ty_escapeAttr(ty_generateId('78990654', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-fab w-speed-dial__trigger" type="button" aria-expanded="true" aria-label="Right" id="\${ty_escapeAttr(ty_generateId('9965db44', 'id'))}">\`
elements+=\`+\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-speed-dial__actions" id="\${ty_escapeAttr(ty_generateId('1775afe4', 'id'))}">\`
elements+=\`
          \`
elements+=\`<button class="w-fab" type="button" id="\${ty_escapeAttr(ty_generateId('ba1adb9e', 'id'))}">\`
elements+=\`1\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<button class="w-fab" type="button" id="\${ty_escapeAttr(ty_generateId('7546f9e2', 'id'))}">\`
elements+=\`2\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('a9a5564e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-4 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('bccdac55', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-speed-dial open="" location="top center" icon="+" id="\${ty_escapeAttr(ty_generateId('3a778a2a', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-fab icon="✎" id="\${ty_escapeAttr(ty_generateId('453b0ce3', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
        \`
elements+=\`<w-fab icon="\uD83D\uDDD1" id="\${ty_escapeAttr(ty_generateId('c641dd03', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
      \`
elements+=\`</w-speed-dial>\`
elements+=\`
      \`
elements+=\`<w-speed-dial open="" location="bottom center" icon="+" id="\${ty_escapeAttr(ty_generateId('9b2a0dfe', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-fab icon="✎" id="\${ty_escapeAttr(ty_generateId('9277bf2f', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
        \`
elements+=\`<w-fab icon="\uD83D\uDDD1" id="\${ty_escapeAttr(ty_generateId('2f17a7ee', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
      \`
elements+=\`</w-speed-dial>\`
elements+=\`
      \`
elements+=\`<w-speed-dial open="" location="left center" icon="+" id="\${ty_escapeAttr(ty_generateId('2546c6e0', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-fab icon="✎" id="\${ty_escapeAttr(ty_generateId('b4f9d731', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
        \`
elements+=\`<w-fab icon="\uD83D\uDDD1" id="\${ty_escapeAttr(ty_generateId('c70ad2d2', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
      \`
elements+=\`</w-speed-dial>\`
elements+=\`
      \`
elements+=\`<w-speed-dial open="" location="right center" icon="+" id="\${ty_escapeAttr(ty_generateId('6a24dd4a', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-fab icon="✎" id="\${ty_escapeAttr(ty_generateId('2eb840f6', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
        \`
elements+=\`<w-fab icon="\uD83D\uDDD1" id="\${ty_escapeAttr(ty_generateId('eea6a9c3', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
      \`
elements+=\`</w-speed-dial>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('f85ce581', 'id'))}">\`
elements+=\`Transitions\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('a57c554b', 'id'))}">\`
elements+=\`Choose \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('27d1263f', 'id'))}">\`
elements+=\`scale\`
elements+=\`</code>\`
elements+=\` (default), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('aa42ea48', 'id'))}">\`
elements+=\`slide\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bc39a5cf', 'id'))}">\`
elements+=\`fade\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('555d1ac2', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-4 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('a9dfc7a7', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-speed-dial w-speed-dial--top w-speed-dial--center w-speed-dial--open w-speed-dial--transition-scale" id="\${ty_escapeAttr(ty_generateId('ed5ea4f8', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-fab w-speed-dial__trigger" type="button" aria-expanded="true" aria-label="Scale" id="\${ty_escapeAttr(ty_generateId('96b9bf59', 'id'))}">\`
elements+=\`+\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-speed-dial__actions" id="\${ty_escapeAttr(ty_generateId('7b7db643', 'id'))}">\`
elements+=\`
          \`
elements+=\`<button class="w-fab" type="button" id="\${ty_escapeAttr(ty_generateId('3448b48c', 'id'))}">\`
elements+=\`1\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<button class="w-fab" type="button" id="\${ty_escapeAttr(ty_generateId('993a65f9', 'id'))}">\`
elements+=\`2\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-speed-dial w-speed-dial--top w-speed-dial--center w-speed-dial--open w-speed-dial--transition-slide" id="\${ty_escapeAttr(ty_generateId('ca4c3077', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-fab w-speed-dial__trigger" type="button" aria-expanded="true" aria-label="Slide" id="\${ty_escapeAttr(ty_generateId('fd11dd1b', 'id'))}">\`
elements+=\`+\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-speed-dial__actions" id="\${ty_escapeAttr(ty_generateId('9d308ff8', 'id'))}">\`
elements+=\`
          \`
elements+=\`<button class="w-fab" type="button" id="\${ty_escapeAttr(ty_generateId('1843b8d1', 'id'))}">\`
elements+=\`1\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<button class="w-fab" type="button" id="\${ty_escapeAttr(ty_generateId('b91e482a', 'id'))}">\`
elements+=\`2\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-speed-dial w-speed-dial--top w-speed-dial--center w-speed-dial--open w-speed-dial--transition-fade" id="\${ty_escapeAttr(ty_generateId('24799dbd', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-fab w-speed-dial__trigger" type="button" aria-expanded="true" aria-label="Fade" id="\${ty_escapeAttr(ty_generateId('148e3f81', 'id'))}">\`
elements+=\`+\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-speed-dial__actions" id="\${ty_escapeAttr(ty_generateId('1d9afa07', 'id'))}">\`
elements+=\`
          \`
elements+=\`<button class="w-fab" type="button" id="\${ty_escapeAttr(ty_generateId('0e3cf86f', 'id'))}">\`
elements+=\`1\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<button class="w-fab" type="button" id="\${ty_escapeAttr(ty_generateId('968e291d', 'id'))}">\`
elements+=\`2\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('ddbd2d23', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-4 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('fb6d54ee', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-speed-dial open="" location="top center" transition="scale" icon="+" id="\${ty_escapeAttr(ty_generateId('061c84ba', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-fab icon="✎" id="\${ty_escapeAttr(ty_generateId('17b3ab34', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
        \`
elements+=\`<w-fab icon="\uD83D\uDDD1" id="\${ty_escapeAttr(ty_generateId('4b6ebec6', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
      \`
elements+=\`</w-speed-dial>\`
elements+=\`
      \`
elements+=\`<w-speed-dial open="" location="top center" transition="slide" icon="+" id="\${ty_escapeAttr(ty_generateId('12357fdc', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-fab icon="✎" id="\${ty_escapeAttr(ty_generateId('264d7a99', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
        \`
elements+=\`<w-fab icon="\uD83D\uDDD1" id="\${ty_escapeAttr(ty_generateId('5d567bef', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
      \`
elements+=\`</w-speed-dial>\`
elements+=\`
      \`
elements+=\`<w-speed-dial open="" location="top center" transition="fade" icon="+" id="\${ty_escapeAttr(ty_generateId('99c728f4', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-fab icon="✎" id="\${ty_escapeAttr(ty_generateId('b854ddc0', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
        \`
elements+=\`<w-fab icon="\uD83D\uDDD1" id="\${ty_escapeAttr(ty_generateId('b3050fae', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
      \`
elements+=\`</w-speed-dial>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('466ed609', 'id'))}">\`
elements+=\`Open on Hover\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('549c5a0b', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8570a524', 'id'))}">\`
elements+=\`open-on-hover\`
elements+=\`</code>\`
elements+=\` to reveal actions on mouseenter and hide on mouseleave.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('fe860ee4', 'id'))}">\`
elements+=\`
    \`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('7b51cc1b', 'id'))}">\`
elements+=\`Hover over the FAB in the CSS column to see the effect (static example shown open).\`
elements+=\`</p>\`
elements+=\`
    \`
elements+=\`<div class="w-speed-dial w-speed-dial--top w-speed-dial--center w-speed-dial--open w-speed-dial--transition-scale" id="\${ty_escapeAttr(ty_generateId('d01bd008', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-fab w-speed-dial__trigger" type="button" aria-expanded="true" aria-label="Hover" id="\${ty_escapeAttr(ty_generateId('82124e4f', 'id'))}">\`
elements+=\`+\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-speed-dial__actions" id="\${ty_escapeAttr(ty_generateId('b36386f4', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-fab" type="button" id="\${ty_escapeAttr(ty_generateId('aad1415e', 'id'))}">\`
elements+=\`1\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-fab" type="button" id="\${ty_escapeAttr(ty_generateId('ec68cd17', 'id'))}">\`
elements+=\`2\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('6cad0148', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-speed-dial open-on-hover="" location="top center" icon="+" id="\${ty_escapeAttr(ty_generateId('1148012d', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-fab icon="✎" id="\${ty_escapeAttr(ty_generateId('1060478b', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
      \`
elements+=\`<w-fab icon="\uD83D\uDDD1" id="\${ty_escapeAttr(ty_generateId('45c534cb', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
    \`
elements+=\`</w-speed-dial>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('4d3b15f2', 'id'))}">\`
elements+=\`Extended Actions\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('0a17dfa7', 'id'))}">\`
elements+=\`Child \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('49890833', 'id'))}">\`
elements+=\`w-fab\`
elements+=\`</code>\`
elements+=\` elements can use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6555e969', 'id'))}">\`
elements+=\`label\`
elements+=\`</code>\`
elements+=\` for extended action buttons inside the speed dial.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('fb932841', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-speed-dial w-speed-dial--top w-speed-dial--center w-speed-dial--open w-speed-dial--transition-scale" id="\${ty_escapeAttr(ty_generateId('cdb3061f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-fab w-speed-dial__trigger" type="button" aria-expanded="true" aria-label="Menu" id="\${ty_escapeAttr(ty_generateId('8c7f5dae', 'id'))}">\`
elements+=\`+\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-speed-dial__actions" id="\${ty_escapeAttr(ty_generateId('e72c6e7a', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-fab w-fab--extended" type="button" id="\${ty_escapeAttr(ty_generateId('6a96ec0e', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-icon" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('6cf4a8e9', 'id'))}">\`
elements+=\`✎\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-fab__label" id="\${ty_escapeAttr(ty_generateId('68dbc2a3', 'id'))}">\`
elements+=\`Edit\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-fab w-fab--extended" type="button" id="\${ty_escapeAttr(ty_generateId('72b5cc2d', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-icon" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('bc648a07', 'id'))}">\`
elements+=\`\uD83D\uDDD1\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-fab__label" id="\${ty_escapeAttr(ty_generateId('80cbc8fc', 'id'))}">\`
elements+=\`Delete\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('89d02f72', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-speed-dial open="" location="top center" icon="+" id="\${ty_escapeAttr(ty_generateId('830598af', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-fab icon="✎" label="Edit" id="\${ty_escapeAttr(ty_generateId('32699b5e', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
      \`
elements+=\`<w-fab icon="\uD83D\uDDD1" label="Delete" id="\${ty_escapeAttr(ty_generateId('46adca92', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
    \`
elements+=\`</w-speed-dial>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/speed-dials/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
