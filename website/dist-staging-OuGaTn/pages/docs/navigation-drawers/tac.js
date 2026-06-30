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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('ad5bcf45', 'id'))}">\`
elements+=\`Navigation Drawers\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('89573868', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('39e305d1', 'id'))}">\`
elements+=\`w-navigation-drawer\`
elements+=\`</code>\`
elements+=\` provides a slide-out panel for app navigation with Vuetify parity: rail mode, expand-on-hover, floating, scrim, border, elevation, color, and responsive behavior.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('8f2029f9', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('74c1f0fb', 'id'))}">\`
elements+=\`
    \`
elements+=\`<aside class="w-navigation-drawer open" aria-label="Navigation" aria-hidden="false" id="\${ty_escapeAttr(ty_generateId('fca797a3', 'id'))}">\`
elements+=\`
      \`
elements+=\`<nav class="w-nav-menu" id="\${ty_escapeAttr(ty_generateId('8342d5a4', 'id'))}">\`
elements+=\`
        \`
elements+=\`<a href="#overview" class="w-nav-item" aria-current="page" id="\${ty_escapeAttr(ty_generateId('f4350fab', 'id'))}">\`
elements+=\`<span aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('6d18d24d', 'id'))}">\`
elements+=\`\uD83C\uDFE0\`
elements+=\`</span>\`
elements+=\` Overview\`
elements+=\`</a>\`
elements+=\`
        \`
elements+=\`<a href="#projects" class="w-nav-item" id="\${ty_escapeAttr(ty_generateId('117fadf3', 'id'))}">\`
elements+=\`<span aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('4ccb7fa6', 'id'))}">\`
elements+=\`\uD83D\uDCC1\`
elements+=\`</span>\`
elements+=\` Projects\`
elements+=\`</a>\`
elements+=\`
        \`
elements+=\`<a href="#settings" class="w-nav-item" id="\${ty_escapeAttr(ty_generateId('6afa9b83', 'id'))}">\`
elements+=\`<span aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('454dfadc', 'id'))}">\`
elements+=\`⚙️\`
elements+=\`</span>\`
elements+=\` Settings\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`</nav>\`
elements+=\`
    \`
elements+=\`</aside>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('803e0352', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-navigation-drawer open="" label="Navigation" id="\${ty_escapeAttr(ty_generateId('27a62882', 'id'))}">\`
elements+=\`
      \`
elements+=\`<nav class="w-nav-menu" id="\${ty_escapeAttr(ty_generateId('aed173af', 'id'))}">\`
elements+=\`
        \`
elements+=\`<a href="#overview" aria-current="page" id="\${ty_escapeAttr(ty_generateId('28e57841', 'id'))}">\`
elements+=\`<span aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('15b19b03', 'id'))}">\`
elements+=\`\uD83C\uDFE0\`
elements+=\`</span>\`
elements+=\` Overview\`
elements+=\`</a>\`
elements+=\`
        \`
elements+=\`<a href="#projects" id="\${ty_escapeAttr(ty_generateId('f218cb8c', 'id'))}">\`
elements+=\`<span aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('15a8409a', 'id'))}">\`
elements+=\`\uD83D\uDCC1\`
elements+=\`</span>\`
elements+=\` Projects\`
elements+=\`</a>\`
elements+=\`
        \`
elements+=\`<a href="#settings" id="\${ty_escapeAttr(ty_generateId('1e6176ab', 'id'))}">\`
elements+=\`<span aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('05884cd7', 'id'))}">\`
elements+=\`⚙️\`
elements+=\`</span>\`
elements+=\` Settings\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`</nav>\`
elements+=\`
    \`
elements+=\`</w-navigation-drawer>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('ccce2d5c', 'id'))}">\`
elements+=\`Rail mode\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('ec18d2b4', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3250321f', 'id'))}">\`
elements+=\`rail\`
elements+=\`</code>\`
elements+=\` for a collapsed icon-only rail. Combine with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('febc37dd', 'id'))}">\`
elements+=\`expand-on-hover\`
elements+=\`</code>\`
elements+=\` to temporarily expand on hover/focus.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('863a772c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<aside class="w-navigation-drawer w-navigation-drawer--rail w-navigation-drawer--permanent" aria-label="Rail" aria-hidden="false" id="\${ty_escapeAttr(ty_generateId('c910cfd6', 'id'))}">\`
elements+=\`
      \`
elements+=\`<nav class="w-nav-menu" id="\${ty_escapeAttr(ty_generateId('f0da26ec', 'id'))}">\`
elements+=\`
        \`
elements+=\`<a href="#home" class="w-nav-item" id="\${ty_escapeAttr(ty_generateId('d2e95acb', 'id'))}">\`
elements+=\`<span aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('a06562ef', 'id'))}">\`
elements+=\`\uD83C\uDFE0\`
elements+=\`</span>\`
elements+=\` \`
elements+=\`<span class="w-nav-label" id="\${ty_escapeAttr(ty_generateId('84eccaa6', 'id'))}">\`
elements+=\`Home\`
elements+=\`</span>\`
elements+=\`</a>\`
elements+=\`
        \`
elements+=\`<a href="#search" class="w-nav-item" id="\${ty_escapeAttr(ty_generateId('faf3f707', 'id'))}">\`
elements+=\`<span aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('e8a6d343', 'id'))}">\`
elements+=\`\uD83D\uDD0D\`
elements+=\`</span>\`
elements+=\` \`
elements+=\`<span class="w-nav-label" id="\${ty_escapeAttr(ty_generateId('468f2240', 'id'))}">\`
elements+=\`Search\`
elements+=\`</span>\`
elements+=\`</a>\`
elements+=\`
        \`
elements+=\`<a href="#fav" class="w-nav-item" id="\${ty_escapeAttr(ty_generateId('1f2b44c8', 'id'))}">\`
elements+=\`<span aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('e3a2126b', 'id'))}">\`
elements+=\`⭐\`
elements+=\`</span>\`
elements+=\` \`
elements+=\`<span class="w-nav-label" id="\${ty_escapeAttr(ty_generateId('6c2d8e41', 'id'))}">\`
elements+=\`Favorites\`
elements+=\`</span>\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`</nav>\`
elements+=\`
    \`
elements+=\`</aside>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('5f7cf173', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-navigation-drawer permanent="" rail="" label="Rail" id="\${ty_escapeAttr(ty_generateId('2fa661c6', 'id'))}">\`
elements+=\`
      \`
elements+=\`<nav class="w-nav-menu" id="\${ty_escapeAttr(ty_generateId('6ed14652', 'id'))}">\`
elements+=\`
        \`
elements+=\`<a href="#home" id="\${ty_escapeAttr(ty_generateId('d02b4e3a', 'id'))}">\`
elements+=\`<span aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('6feec1b0', 'id'))}">\`
elements+=\`\uD83C\uDFE0\`
elements+=\`</span>\`
elements+=\` \`
elements+=\`<span class="w-nav-label" id="\${ty_escapeAttr(ty_generateId('69953213', 'id'))}">\`
elements+=\`Home\`
elements+=\`</span>\`
elements+=\`</a>\`
elements+=\`
        \`
elements+=\`<a href="#search" id="\${ty_escapeAttr(ty_generateId('cfe0a402', 'id'))}">\`
elements+=\`<span aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('9b4fb624', 'id'))}">\`
elements+=\`\uD83D\uDD0D\`
elements+=\`</span>\`
elements+=\` \`
elements+=\`<span class="w-nav-label" id="\${ty_escapeAttr(ty_generateId('45277655', 'id'))}">\`
elements+=\`Search\`
elements+=\`</span>\`
elements+=\`</a>\`
elements+=\`
        \`
elements+=\`<a href="#fav" id="\${ty_escapeAttr(ty_generateId('0e26ae17', 'id'))}">\`
elements+=\`<span aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('9d0c4ccb', 'id'))}">\`
elements+=\`⭐\`
elements+=\`</span>\`
elements+=\` \`
elements+=\`<span class="w-nav-label" id="\${ty_escapeAttr(ty_generateId('7c8dffc5', 'id'))}">\`
elements+=\`Favorites\`
elements+=\`</span>\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`</nav>\`
elements+=\`
    \`
elements+=\`</w-navigation-drawer>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('d4cc8eb2', 'id'))}">\`
elements+=\`Expand on hover\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('27cca88a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<aside class="w-navigation-drawer w-navigation-drawer--rail w-navigation-drawer--expand-on-hover w-navigation-drawer--permanent" aria-label="Expand" aria-hidden="false" id="\${ty_escapeAttr(ty_generateId('f87a4c00', 'id'))}">\`
elements+=\`
      \`
elements+=\`<nav class="w-nav-menu" id="\${ty_escapeAttr(ty_generateId('6f33174e', 'id'))}">\`
elements+=\`
        \`
elements+=\`<a href="#home" class="w-nav-item" id="\${ty_escapeAttr(ty_generateId('5680c85e', 'id'))}">\`
elements+=\`<span aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('8035ab17', 'id'))}">\`
elements+=\`\uD83C\uDFE0\`
elements+=\`</span>\`
elements+=\` \`
elements+=\`<span class="w-nav-label" id="\${ty_escapeAttr(ty_generateId('16c82d1a', 'id'))}">\`
elements+=\`Home\`
elements+=\`</span>\`
elements+=\`</a>\`
elements+=\`
        \`
elements+=\`<a href="#search" class="w-nav-item" id="\${ty_escapeAttr(ty_generateId('ce75ae63', 'id'))}">\`
elements+=\`<span aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('8a467ca1', 'id'))}">\`
elements+=\`\uD83D\uDD0D\`
elements+=\`</span>\`
elements+=\` \`
elements+=\`<span class="w-nav-label" id="\${ty_escapeAttr(ty_generateId('796cf83a', 'id'))}">\`
elements+=\`Search\`
elements+=\`</span>\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`</nav>\`
elements+=\`
    \`
elements+=\`</aside>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('48087a77', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-navigation-drawer permanent="" rail="" expand-on-hover="" label="Expand" id="\${ty_escapeAttr(ty_generateId('40876acf', 'id'))}">\`
elements+=\`
      \`
elements+=\`<nav class="w-nav-menu" id="\${ty_escapeAttr(ty_generateId('10cbb620', 'id'))}">\`
elements+=\`
        \`
elements+=\`<a href="#home" id="\${ty_escapeAttr(ty_generateId('24d49eac', 'id'))}">\`
elements+=\`<span aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('3064c204', 'id'))}">\`
elements+=\`\uD83C\uDFE0\`
elements+=\`</span>\`
elements+=\` \`
elements+=\`<span class="w-nav-label" id="\${ty_escapeAttr(ty_generateId('5f046577', 'id'))}">\`
elements+=\`Home\`
elements+=\`</span>\`
elements+=\`</a>\`
elements+=\`
        \`
elements+=\`<a href="#search" id="\${ty_escapeAttr(ty_generateId('9dcb58db', 'id'))}">\`
elements+=\`<span aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('b470487a', 'id'))}">\`
elements+=\`\uD83D\uDD0D\`
elements+=\`</span>\`
elements+=\` \`
elements+=\`<span class="w-nav-label" id="\${ty_escapeAttr(ty_generateId('edb41f24', 'id'))}">\`
elements+=\`Search\`
elements+=\`</span>\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`</nav>\`
elements+=\`
    \`
elements+=\`</w-navigation-drawer>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('fae27d1d', 'id'))}">\`
elements+=\`Temporary with scrim\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('9bbcc842', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9604458d', 'id'))}">\`
elements+=\`temporary\`
elements+=\`</code>\`
elements+=\` for a modal drawer that overlays content with a scrim backdrop. Clicking the scrim closes the drawer.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('031dbe26', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div id="\${ty_escapeAttr(ty_generateId('0ba0c9fc', 'id'))}">\`
elements+=\`
      \`
elements+=\`<aside class="w-navigation-drawer w-navigation-drawer--temporary open" aria-label="Temporary" aria-hidden="false" id="\${ty_escapeAttr(ty_generateId('dde78920', 'id'))}">\`
elements+=\`
        \`
elements+=\`<nav class="w-nav-menu" id="\${ty_escapeAttr(ty_generateId('648d51bd', 'id'))}">\`
elements+=\`
          \`
elements+=\`<a href="#item1" class="w-nav-item" id="\${ty_escapeAttr(ty_generateId('d7125b3b', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</a>\`
elements+=\`
          \`
elements+=\`<a href="#item2" class="w-nav-item" id="\${ty_escapeAttr(ty_generateId('ec15fc04', 'id'))}">\`
elements+=\`Item 2\`
elements+=\`</a>\`
elements+=\`
        \`
elements+=\`</nav>\`
elements+=\`
      \`
elements+=\`</aside>\`
elements+=\`
      \`
elements+=\`<button class="w-navigation-drawer-scrim open" type="button" aria-label="Close navigation" id="\${ty_escapeAttr(ty_generateId('6c4d3799', 'id'))}">\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('92b7d4c2', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-navigation-drawer id="temp-drawer" temporary="" open="" label="Temporary">\`
elements+=\`
      \`
elements+=\`<a href="#item1" id="\${ty_escapeAttr(ty_generateId('cbf58354', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<a href="#item2" id="\${ty_escapeAttr(ty_generateId('b9fe9c7d', 'id'))}">\`
elements+=\`Item 2\`
elements+=\`</a>\`
elements+=\`
    \`
elements+=\`</w-navigation-drawer>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('e4754f0e', 'id'))}">\`
elements+=\`Right location\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('ae355c26', 'id'))}">\`
elements+=\`
    \`
elements+=\`<aside class="w-navigation-drawer w-navigation-drawer--right w-navigation-drawer--permanent open" aria-label="Right" aria-hidden="false" id="\${ty_escapeAttr(ty_generateId('38248ac4', 'id'))}">\`
elements+=\`
      \`
elements+=\`<nav class="w-nav-menu" id="\${ty_escapeAttr(ty_generateId('96a79818', 'id'))}">\`
elements+=\`
        \`
elements+=\`<a href="#item1" class="w-nav-item" id="\${ty_escapeAttr(ty_generateId('394d8ed7', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</a>\`
elements+=\`
        \`
elements+=\`<a href="#item2" class="w-nav-item" id="\${ty_escapeAttr(ty_generateId('b6c4da4a', 'id'))}">\`
elements+=\`Item 2\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`</nav>\`
elements+=\`
    \`
elements+=\`</aside>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('2eba4cb6', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-navigation-drawer permanent="" open="" location="right" label="Right" id="\${ty_escapeAttr(ty_generateId('57cb1027', 'id'))}">\`
elements+=\`
      \`
elements+=\`<a href="#item1" id="\${ty_escapeAttr(ty_generateId('c27f3d24', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<a href="#item2" id="\${ty_escapeAttr(ty_generateId('b3b0b78d', 'id'))}">\`
elements+=\`Item 2\`
elements+=\`</a>\`
elements+=\`
    \`
elements+=\`</w-navigation-drawer>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('7d35216c', 'id'))}">\`
elements+=\`Floating\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('8408f859', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('030a30a1', 'id'))}">\`
elements+=\`floating\`
elements+=\`</code>\`
elements+=\` to remove borders for an elevated floating look.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('97bf0f14', 'id'))}">\`
elements+=\`
    \`
elements+=\`<aside class="w-navigation-drawer w-navigation-drawer--floating w-navigation-drawer--permanent open" aria-label="Floating" aria-hidden="false" id="\${ty_escapeAttr(ty_generateId('5fe6a548', 'id'))}">\`
elements+=\`
      \`
elements+=\`<nav class="w-nav-menu" id="\${ty_escapeAttr(ty_generateId('8a36263a', 'id'))}">\`
elements+=\`
        \`
elements+=\`<a href="#item1" class="w-nav-item" id="\${ty_escapeAttr(ty_generateId('a1044a78', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</a>\`
elements+=\`
        \`
elements+=\`<a href="#item2" class="w-nav-item" id="\${ty_escapeAttr(ty_generateId('26f3fa23', 'id'))}">\`
elements+=\`Item 2\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`</nav>\`
elements+=\`
    \`
elements+=\`</aside>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('0dff8c8e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-navigation-drawer permanent="" open="" floating="" label="Floating" id="\${ty_escapeAttr(ty_generateId('a12331a8', 'id'))}">\`
elements+=\`
      \`
elements+=\`<a href="#item1" id="\${ty_escapeAttr(ty_generateId('dabc0826', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<a href="#item2" id="\${ty_escapeAttr(ty_generateId('8dd133f8', 'id'))}">\`
elements+=\`Item 2\`
elements+=\`</a>\`
elements+=\`
    \`
elements+=\`</w-navigation-drawer>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('f010c1b2', 'id'))}">\`
elements+=\`Border\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('199299fc', 'id'))}">\`
elements+=\`
    \`
elements+=\`<aside class="w-navigation-drawer w-navigation-drawer--border w-navigation-drawer--permanent open" aria-label="Border" aria-hidden="false" id="\${ty_escapeAttr(ty_generateId('0c01e9f0', 'id'))}">\`
elements+=\`
      \`
elements+=\`<nav class="w-nav-menu" id="\${ty_escapeAttr(ty_generateId('cd0085b3', 'id'))}">\`
elements+=\`
        \`
elements+=\`<a href="#item1" class="w-nav-item" id="\${ty_escapeAttr(ty_generateId('8f21d08b', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`</nav>\`
elements+=\`
    \`
elements+=\`</aside>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('d033fae8', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-navigation-drawer permanent="" open="" border="" label="Border" id="\${ty_escapeAttr(ty_generateId('a70d13c5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<a href="#item1" id="\${ty_escapeAttr(ty_generateId('460a23ab', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</a>\`
elements+=\`
    \`
elements+=\`</w-navigation-drawer>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('c3e4c21d', 'id'))}">\`
elements+=\`Elevation\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('d5b20351', 'id'))}">\`
elements+=\`
    \`
elements+=\`<aside class="w-navigation-drawer w-elevation-4 w-navigation-drawer--permanent open" aria-label="Elevation" aria-hidden="false" id="\${ty_escapeAttr(ty_generateId('60fea1d2', 'id'))}">\`
elements+=\`
      \`
elements+=\`<nav class="w-nav-menu" id="\${ty_escapeAttr(ty_generateId('c2ab2b29', 'id'))}">\`
elements+=\`
        \`
elements+=\`<a href="#item1" class="w-nav-item" id="\${ty_escapeAttr(ty_generateId('e0c25b72', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`</nav>\`
elements+=\`
    \`
elements+=\`</aside>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('f0233146', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-navigation-drawer permanent="" open="" elevation="4" label="Elevation" id="\${ty_escapeAttr(ty_generateId('3dda5839', 'id'))}">\`
elements+=\`
      \`
elements+=\`<a href="#item1" id="\${ty_escapeAttr(ty_generateId('ffa30ebc', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</a>\`
elements+=\`
    \`
elements+=\`</w-navigation-drawer>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('f1b69779', 'id'))}">\`
elements+=\`Color\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('5ad7009e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<aside class="w-navigation-drawer w-navigation-drawer--permanent open" style="--w-drawer-bg:var(--w-surface)" aria-label="Color" aria-hidden="false" id="\${ty_escapeAttr(ty_generateId('75a3c6f7', 'id'))}">\`
elements+=\`
      \`
elements+=\`<nav class="w-nav-menu" id="\${ty_escapeAttr(ty_generateId('f3f38324', 'id'))}">\`
elements+=\`
        \`
elements+=\`<a href="#item1" class="w-nav-item" id="\${ty_escapeAttr(ty_generateId('1acfeeca', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`</nav>\`
elements+=\`
    \`
elements+=\`</aside>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('dd22a9dc', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-navigation-drawer permanent="" open="" color="surface" label="Color" id="\${ty_escapeAttr(ty_generateId('e9d4ce7e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<a href="#item1" id="\${ty_escapeAttr(ty_generateId('3759ab38', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</a>\`
elements+=\`
    \`
elements+=\`</w-navigation-drawer>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('f970d890', 'id'))}">\`
elements+=\`Custom width\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('5774dff7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<aside class="w-navigation-drawer w-navigation-drawer--permanent open" style="--w-drawer-width:320px" aria-label="Width" aria-hidden="false" id="\${ty_escapeAttr(ty_generateId('4926ef1a', 'id'))}">\`
elements+=\`
      \`
elements+=\`<nav class="w-nav-menu" id="\${ty_escapeAttr(ty_generateId('c6d3d999', 'id'))}">\`
elements+=\`
        \`
elements+=\`<a href="#item1" class="w-nav-item" id="\${ty_escapeAttr(ty_generateId('862e1efc', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`</nav>\`
elements+=\`
    \`
elements+=\`</aside>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('d9585ce4', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-navigation-drawer permanent="" open="" width="320" label="Width" id="\${ty_escapeAttr(ty_generateId('04c55bd5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<a href="#item1" id="\${ty_escapeAttr(ty_generateId('2d70d735', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</a>\`
elements+=\`
    \`
elements+=\`</w-navigation-drawer>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('9df79b9c', 'id'))}">\`
elements+=\`Permanent\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('37191158', 'id'))}">\`
elements+=\`A \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('53815455', 'id'))}">\`
elements+=\`permanent\`
elements+=\`</code>\`
elements+=\` drawer is always visible and cannot be closed.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('072d607f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<aside class="w-navigation-drawer w-navigation-drawer--permanent open" aria-label="Permanent" aria-hidden="false" id="\${ty_escapeAttr(ty_generateId('42a80ead', 'id'))}">\`
elements+=\`
      \`
elements+=\`<nav class="w-nav-menu" id="\${ty_escapeAttr(ty_generateId('f42b9f1d', 'id'))}">\`
elements+=\`
        \`
elements+=\`<a href="#item1" class="w-nav-item" id="\${ty_escapeAttr(ty_generateId('4b8b4733', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</a>\`
elements+=\`
        \`
elements+=\`<a href="#item2" class="w-nav-item" id="\${ty_escapeAttr(ty_generateId('daec04a5', 'id'))}">\`
elements+=\`Item 2\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`</nav>\`
elements+=\`
    \`
elements+=\`</aside>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('3356286b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-navigation-drawer permanent="" label="Permanent" id="\${ty_escapeAttr(ty_generateId('1a556d9a', 'id'))}">\`
elements+=\`
      \`
elements+=\`<a href="#item1" id="\${ty_escapeAttr(ty_generateId('2c31eb22', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<a href="#item2" id="\${ty_escapeAttr(ty_generateId('a0d2852c', 'id'))}">\`
elements+=\`Item 2\`
elements+=\`</a>\`
elements+=\`
    \`
elements+=\`</w-navigation-drawer>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/navigation-drawers/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
