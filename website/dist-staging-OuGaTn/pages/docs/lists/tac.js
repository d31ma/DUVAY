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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('508d77e7', 'id'))}">\`
elements+=\`Lists\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('e61167d3', 'id'))}">\`
elements+=\`Vertical collections for navigation, settings rows, messages, and selectable options.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('210da8dd', 'id'))}">\`
elements+=\`Basic List\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c343b546', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a18e0237', 'id'))}">\`
elements+=\`w-list-item-title\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1318b534', 'id'))}">\`
elements+=\`w-list-item-subtitle\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('db0cb656', 'id'))}">\`
elements+=\`w-list-subheader\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4d2cfd6f', 'id'))}">\`
elements+=\`w-list-children\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7469f09a', 'id'))}">\`
elements+=\`w-list-img\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d11311ab', 'id'))}">\`
elements+=\`w-list-item-action\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('11970c89', 'id'))}">\`
elements+=\`w-list-item-media\`
elements+=\`</code>\`
elements+=\` are available as Vuetify-named subcomponents.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('ed49c41d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-list" id="\${ty_escapeAttr(ty_generateId('e7fff194', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-list-item" id="\${ty_escapeAttr(ty_generateId('f21cf79f', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-prepend" id="\${ty_escapeAttr(ty_generateId('5b3b446d', 'id'))}">\`
elements+=\`\uD83C\uDFE0\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('73008a10', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('33098867', 'id'))}">\`
elements+=\`Dashboard\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-append" id="\${ty_escapeAttr(ty_generateId('4bb14146', 'id'))}">\`
elements+=\`›\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-list-item active" id="\${ty_escapeAttr(ty_generateId('2cfec4d1', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-prepend" id="\${ty_escapeAttr(ty_generateId('4a4ccd39', 'id'))}">\`
elements+=\`\uD83D\uDCE5\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('8bf030a8', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('ba6067b5', 'id'))}">\`
elements+=\`Inbox\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-subtitle" id="\${ty_escapeAttr(ty_generateId('c74dcd8a', 'id'))}">\`
elements+=\`12 unread messages\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-append" id="\${ty_escapeAttr(ty_generateId('8463d955', 'id'))}">\`
elements+=\`12\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-list-item" id="\${ty_escapeAttr(ty_generateId('604e6ef1', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-prepend" id="\${ty_escapeAttr(ty_generateId('7f4281ca', 'id'))}">\`
elements+=\`⚙\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('4315dbfc', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('7b99ea17', 'id'))}">\`
elements+=\`Settings\`
elements+=\`</span>\`
elements+=\`
        \`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('cf9a6a42', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-list selectable="" id="\${ty_escapeAttr(ty_generateId('20469e82', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-list-item title="Dashboard" value="dashboard" prepend-icon="\uD83C\uDFE0" append-icon="›" id="\${ty_escapeAttr(ty_generateId('7d64397d', 'id'))}">\`
elements+=\`</w-list-item>\`
elements+=\`
      \`
elements+=\`<w-list-item title="Inbox" subtitle="12 unread messages" value="inbox" prepend-icon="\uD83D\uDCE5" append-icon="12" active="" id="\${ty_escapeAttr(ty_generateId('855425c5', 'id'))}">\`
elements+=\`</w-list-item>\`
elements+=\`
      \`
elements+=\`<w-list-item title="Settings" value="settings" prepend-icon="⚙" id="\${ty_escapeAttr(ty_generateId('bce092a6', 'id'))}">\`
elements+=\`</w-list-item>\`
elements+=\`
    \`
elements+=\`</w-list>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('49736082', 'id'))}">\`
elements+=\`Items API\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('956d74c9', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f6519abd', 'id'))}">\`
elements+=\`items\`
elements+=\`</code>\`
elements+=\` accepts a JSON array with item, divider, subheader, and nested children entries. Selection attributes also accept JSON arrays for multi-value state.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('926db0f2', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-list w-list--nav" id="\${ty_escapeAttr(ty_generateId('1c7c2d04', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-list-subheader" id="\${ty_escapeAttr(ty_generateId('1c9ba852', 'id'))}">\`
elements+=\`Workspace\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-list-item active" id="\${ty_escapeAttr(ty_generateId('f2e22964', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-prepend" id="\${ty_escapeAttr(ty_generateId('d096b4bf', 'id'))}">\`
elements+=\`@\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('1b53ebad', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('272fcdc2', 'id'))}">\`
elements+=\`Inbox\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-subtitle" id="\${ty_escapeAttr(ty_generateId('a48557b6', 'id'))}">\`
elements+=\`12 unread\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-list-divider" id="\${ty_escapeAttr(ty_generateId('0da4be65', 'id'))}">\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-list-group open" id="\${ty_escapeAttr(ty_generateId('41f9beb6', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-list-group-activator w-list-item" type="button" aria-expanded="true" id="\${ty_escapeAttr(ty_generateId('e64f5fc1', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('8edad163', 'id'))}">\`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('feffc3ee', 'id'))}">\`
elements+=\`Settings\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-append" id="\${ty_escapeAttr(ty_generateId('9e72c4f5', 'id'))}">\`
elements+=\`⌃\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-list-group-items" id="\${ty_escapeAttr(ty_generateId('6a69395e', 'id'))}">\`
elements+=\`
          \`
elements+=\`<button class="w-list-item" id="\${ty_escapeAttr(ty_generateId('42157e10', 'id'))}">\`
elements+=\`Profile\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<button class="w-list-item" id="\${ty_escapeAttr(ty_generateId('2de60f0f', 'id'))}">\`
elements+=\`Billing\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('c6a87ad3', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-list nav="" selectable="" selected="[&#39;inbox&#39;]" opened="[&#39;settings&#39;]" items="[{&#39;type&#39;:&#39;subheader&#39;,&#39;title&#39;:&#39;Workspace&#39;},{&#39;title&#39;:&#39;Inbox&#39;,&#39;value&#39;:&#39;inbox&#39;,&#39;subtitle&#39;:&#39;12 unread&#39;,&#39;prependIcon&#39;:&#39;@&#39;},{&#39;type&#39;:&#39;divider&#39;},{&#39;title&#39;:&#39;Settings&#39;,&#39;value&#39;:&#39;settings&#39;,&#39;children&#39;:[{&#39;title&#39;:&#39;Profile&#39;,&#39;value&#39;:&#39;profile&#39;},{&#39;title&#39;:&#39;Billing&#39;,&#39;value&#39;:&#39;billing&#39;}]}]" id="\${ty_escapeAttr(ty_generateId('2e64b6eb', 'id'))}">\`
elements+=\`</w-list>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('252f0961', 'id'))}">\`
elements+=\`Media and Variants\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('0fefc457', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-list w-list--two-line" id="\${ty_escapeAttr(ty_generateId('540b9fa2', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-list-item w-list-item--variant-tonal active" id="\${ty_escapeAttr(ty_generateId('b0f59754', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-prepend" id="\${ty_escapeAttr(ty_generateId('ef4cbc04', 'id'))}">\`
elements+=\`<span class="w-avatar w-avatar-sm" id="\${ty_escapeAttr(ty_generateId('73337826', 'id'))}">\`
elements+=\`<span class="w-avatar-text" id="\${ty_escapeAttr(ty_generateId('ce39bcfd', 'id'))}">\`
elements+=\`AM\`
elements+=\`</span>\`
elements+=\`<span class="w-avatar-underlay" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('7fa56cc4', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('dfd51af7', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('e6321233', 'id'))}">\`
elements+=\`Avery Morgan\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-subtitle" id="\${ty_escapeAttr(ty_generateId('0c6c78d5', 'id'))}">\`
elements+=\`Shared the revised roadmap.\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-append" id="\${ty_escapeAttr(ty_generateId('33aa2cf1', 'id'))}">\`
elements+=\`9:42\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-list-item w-list-item--variant-outlined" id="\${ty_escapeAttr(ty_generateId('8a4ed6f0', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-prepend" id="\${ty_escapeAttr(ty_generateId('fc35a0a5', 'id'))}">\`
elements+=\`<span class="w-avatar w-avatar-sm" id="\${ty_escapeAttr(ty_generateId('4f77b67b', 'id'))}">\`
elements+=\`<span class="w-avatar-text" id="\${ty_escapeAttr(ty_generateId('bc2429a4', 'id'))}">\`
elements+=\`NS\`
elements+=\`</span>\`
elements+=\`<span class="w-avatar-underlay" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('862e8432', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('6c9f96fc', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('71e8cb1e', 'id'))}">\`
elements+=\`Nora Singh\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-subtitle" id="\${ty_escapeAttr(ty_generateId('e5392c66', 'id'))}">\`
elements+=\`Left a launch checklist note.\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-append" id="\${ty_escapeAttr(ty_generateId('c4137d43', 'id'))}">\`
elements+=\`8:15\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('b2bc3322', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-list lines="two" selectable="" selected="avery" id="\${ty_escapeAttr(ty_generateId('1a35d3a5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-list-item title="Avery Morgan" subtitle="Shared the revised roadmap." value="avery" prepend-avatar="AM" append-icon="9:42" variant="tonal" id="\${ty_escapeAttr(ty_generateId('8f595707', 'id'))}">\`
elements+=\`</w-list-item>\`
elements+=\`
      \`
elements+=\`<w-list-item title="Nora Singh" subtitle="Left a launch checklist note." value="nora" prepend-avatar="NS" append-icon="8:15" variant="outlined" id="\${ty_escapeAttr(ty_generateId('69671f88', 'id'))}">\`
elements+=\`</w-list-item>\`
elements+=\`
    \`
elements+=\`</w-list>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('59747e8f', 'id'))}">\`
elements+=\`List Groups\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('4ecfafa7', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9ce02f07', 'id'))}">\`
elements+=\`w-list-group\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('76a0cf38', 'id'))}">\`
elements+=\`w-list-group-activator\`
elements+=\`</code>\`
elements+=\` provide expandable nested list sections.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('0b949e6b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-list" id="\${ty_escapeAttr(ty_generateId('e91400e2', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-list-group open" id="\${ty_escapeAttr(ty_generateId('e7bf87c3', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-list-group-activator w-list-item" type="button" aria-expanded="true" id="\${ty_escapeAttr(ty_generateId('3011727d', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('6515e93f', 'id'))}">\`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('7a8f6425', 'id'))}">\`
elements+=\`Components\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-append" id="\${ty_escapeAttr(ty_generateId('8647c969', 'id'))}">\`
elements+=\`⌃\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-list-group-items" id="\${ty_escapeAttr(ty_generateId('7a74d538', 'id'))}">\`
elements+=\`
          \`
elements+=\`<button class="w-list-item" id="\${ty_escapeAttr(ty_generateId('a4b9fac1', 'id'))}">\`
elements+=\`Lists\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<button class="w-list-item" id="\${ty_escapeAttr(ty_generateId('673d79ef', 'id'))}">\`
elements+=\`Tables\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('21f6630a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-list nav="" id="\${ty_escapeAttr(ty_generateId('a401e71f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-list-group title="Components" open="" id="\${ty_escapeAttr(ty_generateId('fe3bd211', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-list-item title="Lists" id="\${ty_escapeAttr(ty_generateId('5acf026b', 'id'))}">\`
elements+=\`</w-list-item>\`
elements+=\`
        \`
elements+=\`<w-list-item title="Tables" id="\${ty_escapeAttr(ty_generateId('2e202933', 'id'))}">\`
elements+=\`</w-list-item>\`
elements+=\`
      \`
elements+=\`</w-list-group>\`
elements+=\`
    \`
elements+=\`</w-list>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('7819eb8b', 'id'))}">\`
elements+=\`Navigation Density\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('7334eebf', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-list w-list--nav w-list--compact" id="\${ty_escapeAttr(ty_generateId('a9d63327', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-list-subheader" id="\${ty_escapeAttr(ty_generateId('8c6c15d6', 'id'))}">\`
elements+=\`Workspace\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<a class="w-list-item active" href="#" id="\${ty_escapeAttr(ty_generateId('2a483168', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-prepend" id="\${ty_escapeAttr(ty_generateId('f0c38c20', 'id'))}">\`
elements+=\`\uD83D\uDCCC\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('1edaa77b', 'id'))}">\`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('0c597a66', 'id'))}">\`
elements+=\`Pinned\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<a class="w-list-item" href="#" id="\${ty_escapeAttr(ty_generateId('9a84467e', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-prepend" id="\${ty_escapeAttr(ty_generateId('bba6c3c6', 'id'))}">\`
elements+=\`\uD83D\uDDC2\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('b6db4447', 'id'))}">\`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('8b0abc76', 'id'))}">\`
elements+=\`Projects\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<div class="w-list-divider" id="\${ty_escapeAttr(ty_generateId('e0119221', 'id'))}">\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<a class="w-list-item" href="#" id="\${ty_escapeAttr(ty_generateId('91105ae6', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-prepend" id="\${ty_escapeAttr(ty_generateId('bfba5550', 'id'))}">\`
elements+=\`\uD83D\uDD58\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('3d1e39ba', 'id'))}">\`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('702c009d', 'id'))}">\`
elements+=\`Recent\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</a>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('eff32a8b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-list nav="" density="compact" selectable="" id="\${ty_escapeAttr(ty_generateId('7e530af5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-list-subheader" id="\${ty_escapeAttr(ty_generateId('932e5519', 'id'))}">\`
elements+=\`Workspace\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<w-list-item href="#" title="Pinned" value="pinned" prepend-icon="\uD83D\uDCCC" active="" id="\${ty_escapeAttr(ty_generateId('ae4691a6', 'id'))}">\`
elements+=\`</w-list-item>\`
elements+=\`
      \`
elements+=\`<w-list-item href="#" title="Projects" value="projects" prepend-icon="\uD83D\uDDC2" id="\${ty_escapeAttr(ty_generateId('8b00a058', 'id'))}">\`
elements+=\`</w-list-item>\`
elements+=\`
      \`
elements+=\`<div class="w-list-divider" id="\${ty_escapeAttr(ty_generateId('efcacd12', 'id'))}">\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<w-list-item href="#" title="Recent" value="recent" prepend-icon="\uD83D\uDD58" id="\${ty_escapeAttr(ty_generateId('dd7d3bed', 'id'))}">\`
elements+=\`</w-list-item>\`
elements+=\`
    \`
elements+=\`</w-list>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('cd494643', 'id'))}">\`
elements+=\`Multi-line Items\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('152ab5fa', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-list w-list--two-line" id="\${ty_escapeAttr(ty_generateId('ea525860', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-list-item" id="\${ty_escapeAttr(ty_generateId('84f32c71', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-prepend" id="\${ty_escapeAttr(ty_generateId('bad6c36b', 'id'))}">\`
elements+=\`<span class="w-avatar w-avatar-sm" data-w-initials="AM" id="\${ty_escapeAttr(ty_generateId('c035435a', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('d7d5ff9c', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('efd84a25', 'id'))}">\`
elements+=\`Avery Morgan\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-subtitle" id="\${ty_escapeAttr(ty_generateId('fa922653', 'id'))}">\`
elements+=\`Shared the revised roadmap.\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-append" id="\${ty_escapeAttr(ty_generateId('989d8710', 'id'))}">\`
elements+=\`9:42\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-list-item" id="\${ty_escapeAttr(ty_generateId('b62ba713', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-prepend" id="\${ty_escapeAttr(ty_generateId('6315e0a5', 'id'))}">\`
elements+=\`<span class="w-avatar w-avatar-sm" data-w-initials="NS" id="\${ty_escapeAttr(ty_generateId('311b0317', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('75fe6e95', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('05ff0156', 'id'))}">\`
elements+=\`Nora Singh\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-subtitle" id="\${ty_escapeAttr(ty_generateId('8f86e70e', 'id'))}">\`
elements+=\`Left a comment on the launch checklist.\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-append" id="\${ty_escapeAttr(ty_generateId('b459cb6b', 'id'))}">\`
elements+=\`8:15\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('6f8f6d36', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-list lines="two" id="\${ty_escapeAttr(ty_generateId('1af1d1ba', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-list-item title="Avery Morgan" subtitle="Shared the revised roadmap." append-icon="9:42" id="\${ty_escapeAttr(ty_generateId('785d6b19', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span slot="prepend" class="w-avatar w-avatar-sm" data-w-initials="AM" id="\${ty_escapeAttr(ty_generateId('e6dcc6fd', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</w-list-item>\`
elements+=\`
      \`
elements+=\`<w-list-item title="Nora Singh" subtitle="Left a comment on the launch checklist." append-icon="8:15" id="\${ty_escapeAttr(ty_generateId('a1c5587c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span slot="prepend" class="w-avatar w-avatar-sm" data-w-initials="NS" id="\${ty_escapeAttr(ty_generateId('1adfae7c', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</w-list-item>\`
elements+=\`
    \`
elements+=\`</w-list>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('9f55d46d', 'id'))}">\`
elements+=\`Tree view\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('45edde90', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a0a2a094', 'id'))}">\`
elements+=\`w-treeview\`
elements+=\`</code>\`
elements+=\` renders hierarchical, collapsible data. Pass a flat \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5a031a74', 'id'))}">\`
elements+=\`items\`
elements+=\`</code>\`
elements+=\` array of \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('03069880', 'id'))}">\`
elements+=\`&gt;\`
elements+=\`</code>\`
elements+=\`-delimited paths and DuVay builds the tree, or compose \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('194890a4', 'id'))}">\`
elements+=\`w-treeview-item\`
elements+=\`</code>\`
elements+=\` children directly. Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0e2a0905', 'id'))}">\`
elements+=\`open-all\`
elements+=\`</code>\`
elements+=\` to expand every branch; toggle buttons are keyboard-focusable and report \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e06f551b', 'id'))}">\`
elements+=\`aria-expanded\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('60321ebe', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-treeview" role="tree" id="\${ty_escapeAttr(ty_generateId('fbb7edbe', 'id'))}">\`
elements+=\`
      \`
elements+=\`<ul id="\${ty_escapeAttr(ty_generateId('bbfcea65', 'id'))}">\`
elements+=\`
        \`
elements+=\`<li class="w-treeview-node open" role="treeitem" aria-expanded="true" id="\${ty_escapeAttr(ty_generateId('e15790a9', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-treeview-row" id="\${ty_escapeAttr(ty_generateId('faa6533f', 'id'))}">\`
elements+=\`
            \`
elements+=\`<button class="w-treevietoggle" type="button" aria-expanded="true" aria-label="Toggle Components" id="\${ty_escapeAttr(ty_generateId('f6c94975', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
            \`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('120f6626', 'id'))}">\`
elements+=\`Components\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<ul id="\${ty_escapeAttr(ty_generateId('31405e0c', 'id'))}">\`
elements+=\`
            \`
elements+=\`<li class="w-treeview-node open" role="treeitem" id="\${ty_escapeAttr(ty_generateId('9a7ac532', 'id'))}">\`
elements+=\`<span class="w-treeview-row" id="\${ty_escapeAttr(ty_generateId('bd403128', 'id'))}">\`
elements+=\`<span class="w-treeview-leaf" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('cd9b1555', 'id'))}">\`
elements+=\`</span>\`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('73126301', 'id'))}">\`
elements+=\`Buttons\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`</li>\`
elements+=\`
            \`
elements+=\`<li class="w-treeview-node open" role="treeitem" id="\${ty_escapeAttr(ty_generateId('072b8ff4', 'id'))}">\`
elements+=\`<span class="w-treeview-row" id="\${ty_escapeAttr(ty_generateId('ee068884', 'id'))}">\`
elements+=\`<span class="w-treeview-leaf" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('fc194a06', 'id'))}">\`
elements+=\`</span>\`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('93b09b35', 'id'))}">\`
elements+=\`Inputs\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`</li>\`
elements+=\`
          \`
elements+=\`</ul>\`
elements+=\`
        \`
elements+=\`</li>\`
elements+=\`
      \`
elements+=\`</ul>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('0f19a4f9', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-treeview open-all="" items="[Components > Buttons; Components > Inputs > Text field; Components > Inputs > Select; Layout > Grid; Layout > Utilities]" id="\${ty_escapeAttr(ty_generateId('a84a82f7', 'id'))}">\`
elements+=\`</w-treeview>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/lists/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
