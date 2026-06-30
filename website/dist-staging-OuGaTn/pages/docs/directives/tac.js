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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('e2284888', 'id'))}">\`
elements+=\`Directives\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('a066610d', 'id'))}">\`
elements+=\`DuVay uses HTML-first \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('407400ca', 'id'))}">\`
elements+=\`data-w-*\`
elements+=\`</code>\`
elements+=\` hooks for progressive behavior. They serve the same purpose as directives in heavier frameworks, but work in plain documents.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('7196db94', 'id'))}">\`
elements+=\`Theme\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('0b8bc0dc', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f605595e', 'id'))}">\`
elements+=\`data-w-theme-toggle\`
elements+=\`</code>\`
elements+=\` to cycle the root \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fffa0419', 'id'))}">\`
elements+=\`data-w-theme\`
elements+=\`</code>\`
elements+=\` value.\`
elements+=\`</p>\`
elements+=\`<div class="code-block" id="\${ty_escapeAttr(ty_generateId('b032c557', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('78443f44', 'id'))}">\`
elements+=\`&lt;button class="w-btn w-btn-outlined" data-w-theme-toggle&gt;
  Toggle theme
&lt;/button&gt;\`
elements+=\`</code>\`
elements+=\`</div>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('5bfbc5fe', 'id'))}">\`
elements+=\`Menus and navigation\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('17deea1b', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('af1e0871', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2f2f13c7', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('2f38355b', 'id'))}">\`
elements+=\`Hook\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('4d3b780c', 'id'))}">\`
elements+=\`Behavior\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('52b77570', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('0bbc3d40', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7e3e687c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cdafb407', 'id'))}">\`
elements+=\`data-w-dropdown-trigger\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5f5d78be', 'id'))}">\`
elements+=\`Opens or closes the matching \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b3ea11dc', 'id'))}">\`
elements+=\`data-w-dropdown\`
elements+=\`</code>\`
elements+=\` target.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e44a974d', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('10818121', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9bf25098', 'id'))}">\`
elements+=\`data-w-section-toggle\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5964b075', 'id'))}">\`
elements+=\`Collapses or expands the nearest sidebar section.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e9456bc1', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f9b940a0', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('94bdc3e5', 'id'))}">\`
elements+=\`data-w-sidebar-toggle\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('53ca0ca2', 'id'))}">\`
elements+=\`Toggles the mobile sidebar overlay.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('5585aa6f', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('473b1200', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fbdd464c', 'id'))}">\`
elements+=\`data-w-search\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('dad6e0b2', 'id'))}">\`
elements+=\`Marks the global search input for keyboard focus behavior.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('494ac7f4', 'id'))}">\`
elements+=\`Dialogs and sheets\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('1c50e6e2', 'id'))}">\`
elements+=\`Open and close targets by id or by matching \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5848b3fe', 'id'))}">\`
elements+=\`data-w-dialog\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5569329a', 'id'))}">\`
elements+=\`data-w-sheet\`
elements+=\`</code>\`
elements+=\`. Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b338a94f', 'id'))}">\`
elements+=\`data-w-overlay\`
elements+=\`</code>\`
elements+=\` on the target when it owns a named overlay.\`
elements+=\`</p>\`
elements+=\`<div class="code-block" id="\${ty_escapeAttr(ty_generateId('79eba41d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fd17427e', 'id'))}">\`
elements+=\`&lt;button class="w-btn w-btn-filled" data-w-dialog-open="confirm"&gt;Open&lt;/button&gt;
&lt;div id="confirm" class="w-dialog-wrapper" data-w-dialog="confirm" aria-hidden="true"&gt;
  &lt;div class="w-dialog"&gt;
    &lt;button class="w-btn w-btn-text" data-w-dialog-close="confirm"&gt;Close&lt;/button&gt;
  &lt;/div&gt;
&lt;/div&gt;\`
elements+=\`</code>\`
elements+=\`</div>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('570bbe51', 'id'))}">\`
elements+=\`Disclosure and feedback\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('bdee0053', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('047c57ce', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('f71f0e89', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('b021f828', 'id'))}">\`
elements+=\`Hook\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('2dff6994', 'id'))}">\`
elements+=\`Behavior\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('5913520b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('02431128', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('13e72b6c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('485e1cb3', 'id'))}">\`
elements+=\`data-w-expand-toggle\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4850b5a7', 'id'))}">\`
elements+=\`Toggles the matching expansion panel.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('4ad78116', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('51b33023', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('edf61239', 'id'))}">\`
elements+=\`data-w-speed-dial\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e769e25a', 'id'))}">\`
elements+=\`Toggles a floating speed-dial action group.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2a1ee332', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fb8d51c8', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7fb94c0c', 'id'))}">\`
elements+=\`data-w-alert-dismiss\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0e565b61', 'id'))}">\`
elements+=\`Dismisses the nearest alert.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('37bf6f99', 'id'))}">\`
elements+=\`Motion\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('1ec11924', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('f83c8590', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('d0361f58', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('289d2030', 'id'))}">\`
elements+=\`Hook\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('716a6f56', 'id'))}">\`
elements+=\`Behavior\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('36a7e6f9', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2d16f81c', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9081b00c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d05f9a7e', 'id'))}">\`
elements+=\`data-w-transition-toggle\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4a9df047', 'id'))}">\`
elements+=\`Runs a named transition on the matching target.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('00aeb82a', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ad8284e4', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f5f42cf8', 'id'))}">\`
elements+=\`data-w-flip\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b6a39666', 'id'))}">\`
elements+=\`Marks a container whose child reorders should use FLIP animation.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('a33e9ba4', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ef66ab55', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a67dab34', 'id'))}">\`
elements+=\`data-w-flip-reorder\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c2add2c0', 'id'))}">\`
elements+=\`Reorders a FLIP container for no-JS-authoring demos and prototypes.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('dafd6753', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('69bc326f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8f59714c', 'id'))}">\`
elements+=\`data-w-crossfade\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6abfaeb0', 'id'))}">\`
elements+=\`Animates a shared element between two keyed targets.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('94c84e8c', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('da9f70f5', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f72a895f', 'id'))}">\`
elements+=\`data-w-tween\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3c7e9eed', 'id'))}">\`
elements+=\`Tweens text, width, height, opacity, transform, CSS variables, or attributes.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('00f6472b', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1b94c01a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('598012bd', 'id'))}">\`
elements+=\`data-w-spring\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('caf5f99f', 'id'))}">\`
elements+=\`Runs a spring-like transform or value animation.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('63f68f91', 'id'))}">\`
elements+=\`Programmatic helpers\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('734a5801', 'id'))}">\`
elements+=\`The behavior script exposes \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f41b7b3f', 'id'))}">\`
elements+=\`WToast(message, duration)\`
elements+=\`</code>\`
elements+=\` for transient feedback, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('44ff7759', 'id'))}">\`
elements+=\`WTheme\`
elements+=\`</code>\`
elements+=\` for theme control, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('856bc6db', 'id'))}">\`
elements+=\`WMotion\`
elements+=\`</code>\`
elements+=\` for transitions, expansion, FLIP, crossfade, tween, and spring helpers.\`
elements+=\`</p>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/directives/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
