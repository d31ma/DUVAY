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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('3149157c', 'id'))}">\`
elements+=\`Hotkeys\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('b261c5a6', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('78e40e39', 'id'))}">\`
elements+=\`w-hotkey\`
elements+=\`</code>\`
elements+=\` displays a keyboard shortcut as styled \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('51b74259', 'id'))}">\`
elements+=\`&lt;kbd&gt;\`
elements+=\`</code>\`
elements+=\` chips with platform-aware labels &#8212; \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('55710888', 'id'))}">\`
elements+=\`⌘\`
elements+=\`</code>\`
elements+=\` on macOS, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a6bc55e9', 'id'))}">\`
elements+=\`Ctrl\`
elements+=\`</code>\`
elements+=\` on Windows / Linux. Join simultaneous keys with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3bc8097f', 'id'))}">\`
elements+=\`+\`
elements+=\`</code>\`
elements+=\` and separate sequential steps with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e3b05b23', 'id'))}">\`
elements+=\`-\`
elements+=\`</code>\`
elements+=\`. It is presentational; register the actual listeners yourself (see \`
elements+=\`<a href="#binding-the-shortcut" id="\${ty_escapeAttr(ty_generateId('6e31fe80', 'id'))}">\`
elements+=\`below\`
elements+=\`</a>\`
elements+=\`).\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('f9f937e3', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('2408d47b', 'id'))}">\`
elements+=\`Use the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4816b741', 'id'))}">\`
elements+=\`keys\`
elements+=\`</code>\`
elements+=\` attribute. By default the platform is detected from the browser.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('9f654a1f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<span class="w-hotkey w-hotkey--contained" id="\${ty_escapeAttr(ty_generateId('299e31df', 'id'))}">\`
elements+=\`<kbd class="w-kbd w-hotkey-key" id="\${ty_escapeAttr(ty_generateId('2d9eb7bc', 'id'))}">\`
elements+=\`⌘\`
elements+=\`</kbd>\`
elements+=\`<kbd class="w-kbd w-hotkey-key" id="\${ty_escapeAttr(ty_generateId('cd5dccd6', 'id'))}">\`
elements+=\`K\`
elements+=\`</kbd>\`
elements+=\`</span>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('c594f5fe', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-hotkey keys="cmd+k" id="\${ty_escapeAttr(ty_generateId('162d0658', 'id'))}">\`
elements+=\`</w-hotkey>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('1350514b', 'id'))}">\`
elements+=\`Platform\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('281c26ac', 'id'))}">\`
elements+=\`Force a platform with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d2f81a2d', 'id'))}">\`
elements+=\`platform="mac"\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e87f4376', 'id'))}">\`
elements+=\`platform="pc"\`
elements+=\`</code>\`
elements+=\` &#8212; handy for documentation that shows both.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('da9531a8', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('cdd6410d', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-hotkey w-hotkey--contained" id="\${ty_escapeAttr(ty_generateId('a6ac4cf9', 'id'))}">\`
elements+=\`<kbd class="w-kbd w-hotkey-key" id="\${ty_escapeAttr(ty_generateId('d62f6f45', 'id'))}">\`
elements+=\`⌘\`
elements+=\`</kbd>\`
elements+=\`<kbd class="w-kbd w-hotkey-key" id="\${ty_escapeAttr(ty_generateId('84b5558d', 'id'))}">\`
elements+=\`⇧\`
elements+=\`</kbd>\`
elements+=\`<kbd class="w-kbd w-hotkey-key" id="\${ty_escapeAttr(ty_generateId('bc3d59ff', 'id'))}">\`
elements+=\`P\`
elements+=\`</kbd>\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-hotkey w-hotkey--contained" id="\${ty_escapeAttr(ty_generateId('e0616d6e', 'id'))}">\`
elements+=\`<kbd class="w-kbd w-hotkey-key" id="\${ty_escapeAttr(ty_generateId('99ab98e9', 'id'))}">\`
elements+=\`Ctrl\`
elements+=\`</kbd>\`
elements+=\`<kbd class="w-kbd w-hotkey-key" id="\${ty_escapeAttr(ty_generateId('b7681e04', 'id'))}">\`
elements+=\`Shift\`
elements+=\`</kbd>\`
elements+=\`<kbd class="w-kbd w-hotkey-key" id="\${ty_escapeAttr(ty_generateId('9b67eec8', 'id'))}">\`
elements+=\`P\`
elements+=\`</kbd>\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('902ddebc', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('a1f5e7ff', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-hotkey keys="cmd+shift+p" platform="mac" id="\${ty_escapeAttr(ty_generateId('1d7317a2', 'id'))}">\`
elements+=\`</w-hotkey>\`
elements+=\`
      \`
elements+=\`<w-hotkey keys="cmd+shift+p" platform="pc" id="\${ty_escapeAttr(ty_generateId('602cd818', 'id'))}">\`
elements+=\`</w-hotkey>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('d34a8241', 'id'))}">\`
elements+=\`Display mode\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('2ad3767c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('01cfc32d', 'id'))}">\`
elements+=\`display-mode\`
elements+=\`</code>\`
elements+=\` controls how modifier keys render: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a3f51ce7', 'id'))}">\`
elements+=\`icon\`
elements+=\`</code>\`
elements+=\` (default, platform-aware), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('061e25ec', 'id'))}">\`
elements+=\`symbol\`
elements+=\`</code>\`
elements+=\` (always glyphs), or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c3045e72', 'id'))}">\`
elements+=\`text\`
elements+=\`</code>\`
elements+=\` (always words).\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('429ab5cd', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('56af6f3d', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-hotkey w-hotkey--contained" id="\${ty_escapeAttr(ty_generateId('a5c17a4a', 'id'))}">\`
elements+=\`<kbd class="w-kbd w-hotkey-key" id="\${ty_escapeAttr(ty_generateId('2d0d77e9', 'id'))}">\`
elements+=\`⌃\`
elements+=\`</kbd>\`
elements+=\`<kbd class="w-kbd w-hotkey-key" id="\${ty_escapeAttr(ty_generateId('c83e23b2', 'id'))}">\`
elements+=\`⌥\`
elements+=\`</kbd>\`
elements+=\`<kbd class="w-kbd w-hotkey-key" id="\${ty_escapeAttr(ty_generateId('3764b4dd', 'id'))}">\`
elements+=\`S\`
elements+=\`</kbd>\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-hotkey w-hotkey--contained" id="\${ty_escapeAttr(ty_generateId('8d3bf7ab', 'id'))}">\`
elements+=\`<kbd class="w-kbd w-hotkey-key" id="\${ty_escapeAttr(ty_generateId('58456278', 'id'))}">\`
elements+=\`Control\`
elements+=\`</kbd>\`
elements+=\`<kbd class="w-kbd w-hotkey-key" id="\${ty_escapeAttr(ty_generateId('fc387621', 'id'))}">\`
elements+=\`Option\`
elements+=\`</kbd>\`
elements+=\`<kbd class="w-kbd w-hotkey-key" id="\${ty_escapeAttr(ty_generateId('4f76a600', 'id'))}">\`
elements+=\`S\`
elements+=\`</kbd>\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('0464ed78', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('fe4cf9a5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-hotkey keys="ctrl+alt+s" display-mode="symbol" id="\${ty_escapeAttr(ty_generateId('02ad324f', 'id'))}">\`
elements+=\`</w-hotkey>\`
elements+=\`
      \`
elements+=\`<w-hotkey keys="ctrl+option+s" display-mode="text" id="\${ty_escapeAttr(ty_generateId('67531b4c', 'id'))}">\`
elements+=\`</w-hotkey>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('3a8687c0', 'id'))}">\`
elements+=\`Sequences\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('f2ceaf88', 'id'))}">\`
elements+=\`Separate sequential steps with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('668c6085', 'id'))}">\`
elements+=\`-\`
elements+=\`</code>\`
elements+=\` to show a &#8220;then&#8221; chord, e.g. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2b93c5d2', 'id'))}">\`
elements+=\`ctrl+k-ctrl+s\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('f1f90088', 'id'))}">\`
elements+=\`
    \`
elements+=\`<span class="w-hotkey w-hotkey--contained" id="\${ty_escapeAttr(ty_generateId('5f24415a', 'id'))}">\`
elements+=\`<kbd class="w-kbd w-hotkey-key" id="\${ty_escapeAttr(ty_generateId('29b29d25', 'id'))}">\`
elements+=\`Ctrl\`
elements+=\`</kbd>\`
elements+=\`<kbd class="w-kbd w-hotkey-key" id="\${ty_escapeAttr(ty_generateId('c97fd1e3', 'id'))}">\`
elements+=\`K\`
elements+=\`</kbd>\`
elements+=\`<span class="w-hotkey-then" id="\${ty_escapeAttr(ty_generateId('c52c50b8', 'id'))}">\`
elements+=\`then\`
elements+=\`</span>\`
elements+=\`<kbd class="w-kbd w-hotkey-key" id="\${ty_escapeAttr(ty_generateId('09e9cc49', 'id'))}">\`
elements+=\`Ctrl\`
elements+=\`</kbd>\`
elements+=\`<kbd class="w-kbd w-hotkey-key" id="\${ty_escapeAttr(ty_generateId('785e3c79', 'id'))}">\`
elements+=\`S\`
elements+=\`</kbd>\`
elements+=\`</span>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('fc8c71ad', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-hotkey keys="ctrl+k-ctrl+s" platform="pc" id="\${ty_escapeAttr(ty_generateId('e7d39210', 'id'))}">\`
elements+=\`</w-hotkey>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('b02bee92', 'id'))}">\`
elements+=\`Variants &amp; states\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('e72d0d7d', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('293b94b8', 'id'))}">\`
elements+=\`variant="plain"\`
elements+=\`</code>\`
elements+=\` for unboxed labels, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('df5e9319', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\` for an unavailable shortcut. Named keys like \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('437580e7', 'id'))}">\`
elements+=\`enter\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('834c67f6', 'id'))}">\`
elements+=\`esc\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('281fc3e9', 'id'))}">\`
elements+=\`tab\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2791b7b9', 'id'))}">\`
elements+=\`space\`
elements+=\`</code>\`
elements+=\`, and the arrows are recognized.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('429016d5', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('eec686a6', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-hotkey w-hotkey--plain" id="\${ty_escapeAttr(ty_generateId('f432e487', 'id'))}">\`
elements+=\`<kbd class="w-kbd w-hotkey-key" id="\${ty_escapeAttr(ty_generateId('c7603d21', 'id'))}">\`
elements+=\`⌘\`
elements+=\`</kbd>\`
elements+=\`<kbd class="w-kbd w-hotkey-key" id="\${ty_escapeAttr(ty_generateId('a47c91c8', 'id'))}">\`
elements+=\`↵\`
elements+=\`</kbd>\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-hotkey w-hotkey--contained w-hotkey--disabled" aria-disabled="true" id="\${ty_escapeAttr(ty_generateId('cfca6653', 'id'))}">\`
elements+=\`<kbd class="w-kbd w-hotkey-key" id="\${ty_escapeAttr(ty_generateId('397267bd', 'id'))}">\`
elements+=\`⌘\`
elements+=\`</kbd>\`
elements+=\`<kbd class="w-kbd w-hotkey-key" id="\${ty_escapeAttr(ty_generateId('bb11862a', 'id'))}">\`
elements+=\`Z\`
elements+=\`</kbd>\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('9b4038ea', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('654f5919', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-hotkey keys="cmd+enter" variant="plain" platform="mac" id="\${ty_escapeAttr(ty_generateId('03443230', 'id'))}">\`
elements+=\`</w-hotkey>\`
elements+=\`
      \`
elements+=\`<w-hotkey keys="cmd+z" disabled="" platform="mac" id="\${ty_escapeAttr(ty_generateId('4df7a5f9', 'id'))}">\`
elements+=\`</w-hotkey>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="binding-the-shortcut">\`
elements+=\`Binding the shortcut\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('7b37d52d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c985db40', 'id'))}">\`
elements+=\`w-hotkey\`
elements+=\`</code>\`
elements+=\` only renders the keys &#8212; wire the behavior with a listener:\`
elements+=\`</p>\`
elements+=\`<pre class="code-block" id="\${ty_escapeAttr(ty_generateId('076095d0', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a0cbb3dd', 'id'))}">\`
elements+=\`document.addEventListener('keydown', (e) =&gt; &#123;
  if ((e.metaKey || e.ctrlKey) &amp;&amp; e.key.toLowerCase() === 'k') &#123;
    e.preventDefault();
    openSearch();
  &#125;
&#125;);\`
elements+=\`</code>\`
elements+=\`</pre>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('39db88d9', 'id'))}">\`
elements+=\`Accessibility\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('8d9cc8d7', 'id'))}">\`
elements+=\`Each \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4e48dd6e', 'id'))}">\`
elements+=\`w-hotkey\`
elements+=\`</code>\`
elements+=\` carries a readable \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('57606f43', 'id'))}">\`
elements+=\`aria-label\`
elements+=\`</code>\`
elements+=\` (e.g. &#8220;Control + K, then Control + S&#8221;). Document shortcuts in a help dialog, avoid overriding browser or screen-reader keys, and keep focus visible when a shortcut opens a layer.\`
elements+=\`</p>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/features/hotkey/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
