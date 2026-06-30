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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('67393f10', 'id'))}">\`
elements+=\`Icons\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('82b4be6a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('94ea819c', 'id'))}">\`
elements+=\`w-icon\`
elements+=\`</code>\`
elements+=\` renders an icon resolved through the DuVay icon registry, matching Vuetify&#8217;s \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('050999d1', 'id'))}">\`
elements+=\`VIcon\`
elements+=\`</code>\`
elements+=\` API: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9ef97e1b', 'id'))}">\`
elements+=\`size\`
elements+=\`</code>\`
elements+=\` aliases, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3fe84dce', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dc3055f9', 'id'))}">\`
elements+=\`opacity\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3b706c72', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e4b2b87c', 'id'))}">\`
elements+=\`start\`
elements+=\`</code>\`
elements+=\`/\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a5adf05d', 'id'))}">\`
elements+=\`end\`
elements+=\`</code>\`
elements+=\` spacing helpers. The icon \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4dbc03ab', 'id'))}">\`
elements+=\`name\`
elements+=\`</code>\`
elements+=\` is rendered as text by default; register an icon set (font, ligature, or SVG) to draw glyphs. See \`
elements+=\`<a href="/docs/features/icon-fonts" id="\${ty_escapeAttr(ty_generateId('8763fe34', 'id'))}">\`
elements+=\`Icons setup\`
elements+=\`</a>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('febb5f84', 'id'))}">\`
elements+=\`Sizes\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('1aa73c2f', 'id'))}">\`
elements+=\`Use Vuetify sizes \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d8349dc3', 'id'))}">\`
elements+=\`x-small\`
elements+=\`</code>\`
elements+=\` … \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dbdc03f8', 'id'))}">\`
elements+=\`x-large\`
elements+=\`</code>\`
elements+=\`, the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c18169d8', 'id'))}">\`
elements+=\`xs\`
elements+=\`</code>\`
elements+=\`…\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cd4d8992', 'id'))}">\`
elements+=\`xl\`
elements+=\`</code>\`
elements+=\` aliases, or any CSS length.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('30ed4a54', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3 w-items-center" id="\${ty_escapeAttr(ty_generateId('b70d2ce5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-icon w-icon--x-small" id="\${ty_escapeAttr(ty_generateId('79c720a9', 'id'))}">\`
elements+=\`★\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-icon w-icon--small" id="\${ty_escapeAttr(ty_generateId('cc399bf3', 'id'))}">\`
elements+=\`★\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-icon w-icon--default" id="\${ty_escapeAttr(ty_generateId('057d0898', 'id'))}">\`
elements+=\`★\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-icon w-icon--large" id="\${ty_escapeAttr(ty_generateId('ab05018e', 'id'))}">\`
elements+=\`★\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-icon w-icon--x-large" id="\${ty_escapeAttr(ty_generateId('e943adea', 'id'))}">\`
elements+=\`★\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-icon" style="font-size: 3rem" id="\${ty_escapeAttr(ty_generateId('84765d21', 'id'))}">\`
elements+=\`★\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('5f8f5e65', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3 w-items-center" id="\${ty_escapeAttr(ty_generateId('f3e0da52', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-icon name="★" size="x-small" id="\${ty_escapeAttr(ty_generateId('df90c581', 'id'))}">\`
elements+=\`</w-icon>\`
elements+=\`
      \`
elements+=\`<w-icon name="★" size="small" id="\${ty_escapeAttr(ty_generateId('f71d2ebe', 'id'))}">\`
elements+=\`</w-icon>\`
elements+=\`
      \`
elements+=\`<w-icon name="★" size="default" id="\${ty_escapeAttr(ty_generateId('b2e8a398', 'id'))}">\`
elements+=\`</w-icon>\`
elements+=\`
      \`
elements+=\`<w-icon name="★" size="large" id="\${ty_escapeAttr(ty_generateId('9732db0d', 'id'))}">\`
elements+=\`</w-icon>\`
elements+=\`
      \`
elements+=\`<w-icon name="★" size="x-large" id="\${ty_escapeAttr(ty_generateId('6f5a226f', 'id'))}">\`
elements+=\`</w-icon>\`
elements+=\`
      \`
elements+=\`<w-icon name="★" size="3rem" id="\${ty_escapeAttr(ty_generateId('88d9ff1c', 'id'))}">\`
elements+=\`</w-icon>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('a9d3b3cf', 'id'))}">\`
elements+=\`Color\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('df96fcda', 'id'))}">\`
elements+=\`Pass a theme token (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ecef1f45', 'id'))}">\`
elements+=\`primary\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8e75900d', 'id'))}">\`
elements+=\`success\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('efa60f58', 'id'))}">\`
elements+=\`warning\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ba3ccff7', 'id'))}">\`
elements+=\`error\`
elements+=\`</code>\`
elements+=\`…) or any CSS color.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('b7521240', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3 w-items-center" id="\${ty_escapeAttr(ty_generateId('3ad28a32', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-icon w-icon--large" style="color: var(--w-primary)" id="\${ty_escapeAttr(ty_generateId('181a7cc9', 'id'))}">\`
elements+=\`●\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-icon w-icon--large" style="color: var(--w-success)" id="\${ty_escapeAttr(ty_generateId('554e2034', 'id'))}">\`
elements+=\`●\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-icon w-icon--large" style="color: var(--w-warning)" id="\${ty_escapeAttr(ty_generateId('aa308fdb', 'id'))}">\`
elements+=\`●\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-icon w-icon--large" style="color: var(--w-error)" id="\${ty_escapeAttr(ty_generateId('9b280959', 'id'))}">\`
elements+=\`●\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-icon w-icon--large" style="color: #8b5cf6" id="\${ty_escapeAttr(ty_generateId('3c4a44b2', 'id'))}">\`
elements+=\`●\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('6a5c666a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3 w-items-center" id="\${ty_escapeAttr(ty_generateId('8e3d0e35', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-icon name="●" size="large" color="primary" id="\${ty_escapeAttr(ty_generateId('4c7fdd8c', 'id'))}">\`
elements+=\`</w-icon>\`
elements+=\`
      \`
elements+=\`<w-icon name="●" size="large" color="success" id="\${ty_escapeAttr(ty_generateId('0e24121f', 'id'))}">\`
elements+=\`</w-icon>\`
elements+=\`
      \`
elements+=\`<w-icon name="●" size="large" color="warning" id="\${ty_escapeAttr(ty_generateId('683bf9ff', 'id'))}">\`
elements+=\`</w-icon>\`
elements+=\`
      \`
elements+=\`<w-icon name="●" size="large" color="error" id="\${ty_escapeAttr(ty_generateId('53b91652', 'id'))}">\`
elements+=\`</w-icon>\`
elements+=\`
      \`
elements+=\`<w-icon name="●" size="large" color="#8b5cf6" id="\${ty_escapeAttr(ty_generateId('e7e4e692', 'id'))}">\`
elements+=\`</w-icon>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('3911fcec', 'id'))}">\`
elements+=\`Opacity and disabled\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('ac49ad1a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3 w-items-center" id="\${ty_escapeAttr(ty_generateId('871470eb', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-icon w-icon--large" id="\${ty_escapeAttr(ty_generateId('936b3306', 'id'))}">\`
elements+=\`✓\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-icon w-icon--large" style="--w-icon-opacity: 0.5" id="\${ty_escapeAttr(ty_generateId('0c64f58f', 'id'))}">\`
elements+=\`✓\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-icon w-icon--large w-icon--disabled" id="\${ty_escapeAttr(ty_generateId('7b38afef', 'id'))}">\`
elements+=\`✓\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('0f2584e2', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3 w-items-center" id="\${ty_escapeAttr(ty_generateId('c5e4018e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-icon name="✓" size="large" id="\${ty_escapeAttr(ty_generateId('3329a812', 'id'))}">\`
elements+=\`</w-icon>\`
elements+=\`
      \`
elements+=\`<w-icon name="✓" size="large" opacity="0.5" id="\${ty_escapeAttr(ty_generateId('900afadd', 'id'))}">\`
elements+=\`</w-icon>\`
elements+=\`
      \`
elements+=\`<w-icon name="✓" size="large" disabled="" id="\${ty_escapeAttr(ty_generateId('7734ceb5', 'id'))}">\`
elements+=\`</w-icon>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('0be942b7', 'id'))}">\`
elements+=\`Inline with text\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('99ee2414', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3041b719', 'id'))}">\`
elements+=\`start\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('abf56b10', 'id'))}">\`
elements+=\`end\`
elements+=\`</code>\`
elements+=\` add spacing so an icon sits cleanly before or after adjacent text.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('cebfa8a5', 'id'))}">\`
elements+=\`
    \`
elements+=\`<button class="w-btn w-btn--primary" id="\${ty_escapeAttr(ty_generateId('b3cc4242', 'id'))}">\`
elements+=\`<span class="w-icon w-icon--start" id="\${ty_escapeAttr(ty_generateId('c3b004d9', 'id'))}">\`
elements+=\`→\`
elements+=\`</span>\`
elements+=\`Continue\`
elements+=\`</button>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('e2151937', 'id'))}">\`
elements+=\`
    \`
elements+=\`<button class="w-btn w-btn--primary" id="\${ty_escapeAttr(ty_generateId('5b9c7e93', 'id'))}">\`
elements+=\`<w-icon name="→" start="" id="\${ty_escapeAttr(ty_generateId('81bdf177', 'id'))}">\`
elements+=\`</w-icon>\`
elements+=\`Continue\`
elements+=\`</button>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/icons/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
