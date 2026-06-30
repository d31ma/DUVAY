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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('ff441786', 'id'))}">\`
elements+=\`Data Tables: Basics\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('870c34b5', 'id'))}">\`
elements+=\`The everyday interactions of \`
elements+=\`<a href="/docs/components/data-tables/introduction" id="\${ty_escapeAttr(ty_generateId('380ce532', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bdbe5885', 'id'))}">\`
elements+=\`w-data-table\`
elements+=\`</code>\`
elements+=\`</a>\`
elements+=\`: sorting, searching, and pagination. See \`
elements+=\`<a href="/docs/components/data-tables/data-and-display" id="\${ty_escapeAttr(ty_generateId('f0eb23cd', 'id'))}">\`
elements+=\`Data and Display\`
elements+=\`</a>\`
elements+=\` for selection, expansion, and rich columns.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('63e629db', 'id'))}">\`
elements+=\`Sorting\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('642b3017', 'id'))}">\`
elements+=\`Sortable headers toggle ascending → descending → unsorted. Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4e330d18', 'id'))}">\`
elements+=\`multi-sort\`
elements+=\`</code>\`
elements+=\` to sort by several columns; set an initial order with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9b0ccb4e', 'id'))}">\`
elements+=\`sort-by\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8524e188', 'id'))}">\`
elements+=\`sort-desc\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('9e27fc55', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('677fd3c4', 'id'))}">\`
elements+=\`
      \`
elements+=\`<table class="w-table" id="\${ty_escapeAttr(ty_generateId('2d879779', 'id'))}">\`
elements+=\`
        \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('873b10ab', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('0fb5c4bc', 'id'))}">\`
elements+=\`<th class="w-table-sortable" id="\${ty_escapeAttr(ty_generateId('fcecae0e', 'id'))}">\`
elements+=\`<button class="w-table-sort" type="button" id="\${ty_escapeAttr(ty_generateId('08815917', 'id'))}">\`
elements+=\`Dessert\`
elements+=\`</button>\`
elements+=\`</th>\`
elements+=\`<th class="w-table-sortable" aria-sort="ascending" id="\${ty_escapeAttr(ty_generateId('58919a3e', 'id'))}">\`
elements+=\`<button class="w-table-sort" type="button" id="\${ty_escapeAttr(ty_generateId('7b4a92bb', 'id'))}">\`
elements+=\`Calories\`
elements+=\`<span class="w-table-sort-icon" id="\${ty_escapeAttr(ty_generateId('6e0a3aca', 'id'))}">\`
elements+=\`↑\`
elements+=\`</span>\`
elements+=\`</button>\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
        \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('583daf75', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('0b4573f7', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b11bf0e0', 'id'))}">\`
elements+=\`Frozen yogurt\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('64041bf1', 'id'))}">\`
elements+=\`159\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('fd033b6a', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('edfe11e2', 'id'))}">\`
elements+=\`Eclair\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('17de6897', 'id'))}">\`
elements+=\`262\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`</tbody>\`
elements+=\`
      \`
elements+=\`</table>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('4ef78eb8', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-data-table headers="[Dessert,Calories,Fat]" sort-by="Calories" items="[Frozen yogurt|159|6; Ice cream sandwich|237|9; Eclair|262|16; Cupcake|305|3; Gingerbread|356|16]" items-per-page="5" id="\${ty_escapeAttr(ty_generateId('688d7aa4', 'id'))}">\`
elements+=\`</w-data-table>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('8e0d563f', 'id'))}">\`
elements+=\`Search\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('6835e351', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5086aee4', 'id'))}">\`
elements+=\`search\`
elements+=\`</code>\`
elements+=\` to filter across every cell (case-insensitive). Wire it to a text field for live filtering.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('58bf1002', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('1f5c129b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<table class="w-table" id="\${ty_escapeAttr(ty_generateId('9f8202f4', 'id'))}">\`
elements+=\`
        \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('7fe27a3b', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('0e677e15', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('71abb90f', 'id'))}">\`
elements+=\`Dessert\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('87899c12', 'id'))}">\`
elements+=\`Calories\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('4126d16f', 'id'))}">\`
elements+=\`Fat\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
        \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('c7ee8612', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('6e426268', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9f660a9c', 'id'))}">\`
elements+=\`Cupcake\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e626bc57', 'id'))}">\`
elements+=\`305\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5b85cf2f', 'id'))}">\`
elements+=\`3\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`</tbody>\`
elements+=\`
      \`
elements+=\`</table>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('a3e85dc2', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('7621cf31', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-text-field label="Search" oninput="document.getElementById('dt-search').setAttribute('search', event.detail.value)" id="\${ty_escapeAttr(ty_generateId('5fb4af7b', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-data-table id="dt-search" headers="[Dessert,Calories,Fat]" items="[Frozen yogurt|159|6; Ice cream sandwich|237|9; Eclair|262|16; Cupcake|305|3; Gingerbread|356|16]" items-per-page="10">\`
elements+=\`</w-data-table>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('3804a3fd', 'id'))}">\`
elements+=\`Pagination &amp; page size\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('5eee2630', 'id'))}">\`
elements+=\`The footer shows the item range and a per-page select from \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('88160c9a', 'id'))}">\`
elements+=\`items-per-page-options\`
elements+=\`</code>\`
elements+=\` (use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('caba376d', 'id'))}">\`
elements+=\`-1\`
elements+=\`</code>\`
elements+=\` for &#8220;All&#8221;).\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('6de80299', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-data-table-footer" id="\${ty_escapeAttr(ty_generateId('1e89be74', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-data-table-per-page" id="\${ty_escapeAttr(ty_generateId('6dbbdce9', 'id'))}">\`
elements+=\`Rows per page
        \`
elements+=\`<select class="w-select" id="\${ty_escapeAttr(ty_generateId('12a07e42', 'id'))}">\`
elements+=\`<option id="\${ty_escapeAttr(ty_generateId('b76a4056', 'id'))}">\`
elements+=\`5\`
elements+=\`</option>\`
elements+=\`<option id="\${ty_escapeAttr(ty_generateId('094bbd3c', 'id'))}">\`
elements+=\`10\`
elements+=\`</option>\`
elements+=\`<option id="\${ty_escapeAttr(ty_generateId('87f2fdb7', 'id'))}">\`
elements+=\`All\`
elements+=\`</option>\`
elements+=\`</select>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<span class="w-data-table-range" id="\${ty_escapeAttr(ty_generateId('287164a6', 'id'))}">\`
elements+=\`1–5 of 12\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<div class="w-data-table-pagination" id="\${ty_escapeAttr(ty_generateId('34cded3c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-data-table-nav" disabled="" id="\${ty_escapeAttr(ty_generateId('2d0ad2b9', 'id'))}">\`
elements+=\`«\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-data-table-nav" disabled="" id="\${ty_escapeAttr(ty_generateId('d8b8275f', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-data-table-nav" id="\${ty_escapeAttr(ty_generateId('b2b3027e', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-data-table-nav" id="\${ty_escapeAttr(ty_generateId('dc0f3184', 'id'))}">\`
elements+=\`»\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('fe4112f5', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-data-table headers="[Dessert,Calories]" items-per-page="3" items-per-page-options="3,5,-1" items="[Frozen yogurt|159; Ice cream sandwich|237; Eclair|262; Cupcake|305; Gingerbread|356; Jelly bean|375; Lollipop|392; Honeycomb|408]" id="\${ty_escapeAttr(ty_generateId('4d5b02f4', 'id'))}">\`
elements+=\`</w-data-table>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/components/data-tables/basics/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
