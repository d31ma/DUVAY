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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('7ba29b31', 'id'))}">\`
elements+=\`Text fields\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c3eeb4ed', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9d9bffa4', 'id'))}">\`
elements+=\`w-text-field\`
elements+=\`</code>\`
elements+=\` is the full single-line control, mirroring Vuetify&#8217;s \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9f73d03c', 'id'))}">\`
elements+=\`v-text-field\`
elements+=\`</code>\`
elements+=\`: a floating label, five variants, density, prefix/suffix, inner slots, clearable, a character counter, a loading bar, and the native HTML5 validation attributes. The web component writes the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2658762d', 'id'))}">\`
elements+=\`.w-text-field-*\`
elements+=\`</code>\`
elements+=\` markup shown in the CSS panes. For a bare styled input, see \`
elements+=\`<a href="/docs/inputs" id="\${ty_escapeAttr(ty_generateId('f38e7f51', 'id'))}">\`
elements+=\`inputs\`
elements+=\`</a>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('38c36511', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('ba6ff329', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--density-default w-text-field--floating" id="\${ty_escapeAttr(ty_generateId('68bf09a7', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('d4aabb0a', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('47b2b238', 'id'))}">\`
elements+=\`<input class="w-text-field-input" type="text" placeholder=" " id="\${ty_escapeAttr(ty_generateId('1a91fd86', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('25932008', 'id'))}">\`
elements+=\`Name\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('e613a8ee', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-text-field label="Name" placeholder="Jane Doe" id="\${ty_escapeAttr(ty_generateId('0f810a26', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('f289ed4f', 'id'))}">\`
elements+=\`Variants\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('ab28006e', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6e693bd9', 'id'))}">\`
elements+=\`variant\`
elements+=\`</code>\`
elements+=\` to \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('eadcc98b', 'id'))}">\`
elements+=\`outlined\`
elements+=\`</code>\`
elements+=\` (default), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('40600a9c', 'id'))}">\`
elements+=\`filled\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3d087147', 'id'))}">\`
elements+=\`underlined\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f40cb9d8', 'id'))}">\`
elements+=\`plain\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('93dfabf4', 'id'))}">\`
elements+=\`solo\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('4a0ea8a2', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('c00e540f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('bd0c3c74', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('7a876f06', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('b1f3aa5c', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="Outlined" placeholder=" " id="\${ty_escapeAttr(ty_generateId('f9d2579b', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('d6c20e88', 'id'))}">\`
elements+=\`Outlined\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--filled w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('0a0d5736', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('ee0acb2a', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('94a0ac7b', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="Filled" placeholder=" " id="\${ty_escapeAttr(ty_generateId('971033f8', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('3f5424ee', 'id'))}">\`
elements+=\`Filled\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--underlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('1fe40865', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('ac9cb401', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('05f791dd', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="Underlined" placeholder=" " id="\${ty_escapeAttr(ty_generateId('62873ade', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('f0f02258', 'id'))}">\`
elements+=\`Underlined\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--plain w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('14c30977', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('024bda53', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('e266c652', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="Plain" placeholder=" " id="\${ty_escapeAttr(ty_generateId('f8ffcaa1', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('6da43bef', 'id'))}">\`
elements+=\`Plain\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--solo" id="\${ty_escapeAttr(ty_generateId('d1670218', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('bc27f56d', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('b8bc1d60', 'id'))}">\`
elements+=\`<input class="w-text-field-input" placeholder="Solo (search)" aria-label="Solo (search)" id="\${ty_escapeAttr(ty_generateId('9b652312', 'id'))}" />\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('abe655b1', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('77839769', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-text-field variant="outlined" label="Outlined" value="Outlined" id="\${ty_escapeAttr(ty_generateId('48274df9', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field variant="filled" label="Filled" value="Filled" id="\${ty_escapeAttr(ty_generateId('e5bf09c3', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field variant="underlined" label="Underlined" value="Underlined" id="\${ty_escapeAttr(ty_generateId('9ab7b957', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field variant="plain" label="Plain" value="Plain" id="\${ty_escapeAttr(ty_generateId('a1056b3a', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field variant="solo" label="Solo (search)" id="\${ty_escapeAttr(ty_generateId('4911fccc', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('b10b1b18', 'id'))}">\`
elements+=\`Input types\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d0f6adee', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dad37b5e', 'id'))}">\`
elements+=\`type\`
elements+=\`</code>\`
elements+=\` to any native value &#8212; \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d2a78dbd', 'id'))}">\`
elements+=\`email\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ad4b174b', 'id'))}">\`
elements+=\`password\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d202c34f', 'id'))}">\`
elements+=\`url\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('065135ab', 'id'))}">\`
elements+=\`tel\`
elements+=\`</code>\`
elements+=\`, and more.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('3a417068', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--floating" id="\${ty_escapeAttr(ty_generateId('f1178524', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('c4b97c7e', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('037d18c7', 'id'))}">\`
elements+=\`<input class="w-text-field-input" type="email" placeholder=" " id="\${ty_escapeAttr(ty_generateId('c9f528c8', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('60bbdbe4', 'id'))}">\`
elements+=\`Email\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('929c3d45', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('4f617464', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row id="\${ty_escapeAttr(ty_generateId('3868ed38', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="6" id="\${ty_escapeAttr(ty_generateId('8e7ce019', 'id'))}">\`
elements+=\`<w-text-field label="Email" type="email" placeholder="you@example.com" hint="We'll never share your email." persistent-hint="" id="\${ty_escapeAttr(ty_generateId('30d04786', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="6" id="\${ty_escapeAttr(ty_generateId('d080253b', 'id'))}">\`
elements+=\`<w-text-field label="Password" type="password" value="secret" id="\${ty_escapeAttr(ty_generateId('cfc72ac3', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="6" id="\${ty_escapeAttr(ty_generateId('a724f26a', 'id'))}">\`
elements+=\`<w-text-field label="URL" type="url" value="https://delma.dev" id="\${ty_escapeAttr(ty_generateId('b2cdf7f7', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="6" id="\${ty_escapeAttr(ty_generateId('5997a5fa', 'id'))}">\`
elements+=\`<w-text-field label="Phone" type="tel" placeholder="+1 555 0100" id="\${ty_escapeAttr(ty_generateId('64049d2e', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`</w-col>\`
elements+=\`
      \`
elements+=\`</w-row>\`
elements+=\`
    \`
elements+=\`</w-container>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('f494439b', 'id'))}">\`
elements+=\`Density &amp; sizes\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c81ace8f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c64b8d4f', 'id'))}">\`
elements+=\`density\`
elements+=\`</code>\`
elements+=\` tightens vertical rhythm; \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c360636b', 'id'))}">\`
elements+=\`size\`
elements+=\`</code>\`
elements+=\` scales the whole control.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('7694236d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('0c8f3bef', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--density-compact w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('b0dc73c1', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('6722c945', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('c7be8f03', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="Compact" placeholder=" " id="\${ty_escapeAttr(ty_generateId('a06879cf', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('16b30e8d', 'id'))}">\`
elements+=\`Compact\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--lg w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('73874af6', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('58c96e17', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('e687436e', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="Large" placeholder=" " id="\${ty_escapeAttr(ty_generateId('101b3d33', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('e023964a', 'id'))}">\`
elements+=\`Large\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('ffa18a67', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('ef14a2e7', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-text-field density="compact" label="Compact" id="\${ty_escapeAttr(ty_generateId('d13a50a2', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field density="comfortable" label="Comfortable" id="\${ty_escapeAttr(ty_generateId('698de4b5', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field label="Default" id="\${ty_escapeAttr(ty_generateId('e8a7143c', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field size="lg" label="Large" id="\${ty_escapeAttr(ty_generateId('c4b676ab', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('807680d0', 'id'))}">\`
elements+=\`Prefix, suffix &amp; inner content\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('f6b20e78', 'id'))}">\`
elements+=\`Add static \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('808ff9c1', 'id'))}">\`
elements+=\`prefix\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b814da8e', 'id'))}">\`
elements+=\`suffix\`
elements+=\`</code>\`
elements+=\` text, name icons with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('28b31b49', 'id'))}">\`
elements+=\`prepend-inner-icon\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4b485d59', 'id'))}">\`
elements+=\`append-inner-icon\`
elements+=\`</code>\`
elements+=\` (resolved through the icon registry), or drop arbitrary content into the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2e29f3f9', 'id'))}">\`
elements+=\`prepend-inner\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('19a5c881', 'id'))}">\`
elements+=\`append-inner\`
elements+=\`</code>\`
elements+=\` slots.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('e61d1383', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('ac337d6e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('65b17150', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('83d7f2ea', 'id'))}">\`
elements+=\`<span class="w-text-field-affix w-text-field-prefix" id="\${ty_escapeAttr(ty_generateId('8971cd46', 'id'))}">\`
elements+=\`$\`
elements+=\`</span>\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('b2374f61', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="49.00" placeholder=" " id="\${ty_escapeAttr(ty_generateId('aefbf838', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('637e713a', 'id'))}">\`
elements+=\`Amount\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`<span class="w-text-field-affix w-text-field-suffix" id="\${ty_escapeAttr(ty_generateId('2bf7dd9c', 'id'))}">\`
elements+=\`USD\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('b802e10e', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('b885835c', 'id'))}">\`
elements+=\`<span class="w-text-field-prepend-inner" id="\${ty_escapeAttr(ty_generateId('a838959b', 'id'))}">\`
elements+=\`<span class="w-icon w-text-field-icon" id="\${ty_escapeAttr(ty_generateId('59ee3d55', 'id'))}">\`
elements+=\`\uD83D\uDD0D\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('19f5a026', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="duvay" placeholder=" " id="\${ty_escapeAttr(ty_generateId('f83815ca', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('72b45f98', 'id'))}">\`
elements+=\`Search\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`<span class="w-text-field-append-inner" id="\${ty_escapeAttr(ty_generateId('4ba3de1e', 'id'))}">\`
elements+=\`<span class="w-icon w-text-field-icon" id="\${ty_escapeAttr(ty_generateId('5aa02838', 'id'))}">\`
elements+=\`↗\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('30c4cf00', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('22b6321b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-text-field label="Amount" prefix="$" suffix="USD" value="49.00" id="\${ty_escapeAttr(ty_generateId('58818fa4', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field label="Search" value="duvay" prepend-inner-icon="\uD83D\uDD0D" append-inner-icon="↗" id="\${ty_escapeAttr(ty_generateId('bb500f20', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field label="With slot" placeholder="Custom slotted content" variant="solo" id="\${ty_escapeAttr(ty_generateId('d949f413', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span slot="prepend-inner" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('62355ed7', 'id'))}">\`
elements+=\`\uD83D\uDD0D\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</w-text-field>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('066c99bb', 'id'))}">\`
elements+=\`Clearable\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('bcc24373', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('296eb96f', 'id'))}">\`
elements+=\`clearable\`
elements+=\`</code>\`
elements+=\` for a clear button that appears once there&#8217;s a value.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('eeb135f2', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('2e29d9a2', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('3053077a', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('8f88677f', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="design, css" placeholder=" " id="\${ty_escapeAttr(ty_generateId('3dee5536', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('a660beb9', 'id'))}">\`
elements+=\`Tags\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`<button type="button" class="w-text-field-clear" tabindex="-1" aria-label="Clear" id="\${ty_escapeAttr(ty_generateId('fba5ff31', 'id'))}">\`
elements+=\`&times;\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('54df94ad', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-text-field label="Tags" value="design, css" clearable="" id="\${ty_escapeAttr(ty_generateId('26f8548f', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('eeffe2a0', 'id'))}">\`
elements+=\`Counter\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('a004dde1', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('49ff4c74', 'id'))}">\`
elements+=\`counter\`
elements+=\`</code>\`
elements+=\` (with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('21de7643', 'id'))}">\`
elements+=\`maxlength\`
elements+=\`</code>\`
elements+=\`) to show how many characters have been typed.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('42c3c770', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('c8cb4f18', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('8a0b3b5c', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('68b22853', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="Designer &amp; developer" maxlength="50" placeholder=" " id="\${ty_escapeAttr(ty_generateId('043c74b2', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('c9f1b0e2', 'id'))}">\`
elements+=\`Bio\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`<div class="w-text-field-details" id="\${ty_escapeAttr(ty_generateId('faa048bb', 'id'))}">\`
elements+=\`<span class="w-text-field-messages" id="\${ty_escapeAttr(ty_generateId('a323cc16', 'id'))}">\`
elements+=\`</span>\`
elements+=\`<span class="w-text-field-counter" id="\${ty_escapeAttr(ty_generateId('af6a83c6', 'id'))}">\`
elements+=\`20 / 50\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('0534295b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-text-field label="Bio" counter="" maxlength="50" value="Designer &amp; developer" id="\${ty_escapeAttr(ty_generateId('806b7281', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('e145f9a1', 'id'))}">\`
elements+=\`Loading\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('9c2c1d4c', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a51c1283', 'id'))}">\`
elements+=\`loading\`
elements+=\`</code>\`
elements+=\` to show an indeterminate bar along the bottom edge while a request is in flight.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('ea93aafa', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--loading w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('46609e18', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('cf6b3cf3', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('0e62b09d', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="duvay" placeholder=" " id="\${ty_escapeAttr(ty_generateId('cee55696', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('06e4f000', 'id'))}">\`
elements+=\`Checking availability…\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`<span class="w-text-field-loader" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('855bbae6', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('1864e798', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-text-field label="Checking availability…" value="duvay" loading="" id="\${ty_escapeAttr(ty_generateId('f829753d', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('5290dae6', 'id'))}">\`
elements+=\`States\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('61e5be96', 'id'))}">\`
elements+=\`Hints appear on focus (or always with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e38521b3', 'id'))}">\`
elements+=\`persistent-hint\`
elements+=\`</code>\`
elements+=\`); \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7a8e39d4', 'id'))}">\`
elements+=\`error\`
elements+=\`</code>\`
elements+=\` tints the control and replaces the hint.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('f2a3ef1b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('e3bd8404', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--disabled w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('cce0959f', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('1a7f650e', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('dd2da47f', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="Can't touch this" disabled="" placeholder=" " id="\${ty_escapeAttr(ty_generateId('04741905', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('a908d2c2', 'id'))}">\`
elements+=\`Disabled\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--error w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('9df57dff', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('462d71ee', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('0406ec6f', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="bad-email" aria-invalid="true" placeholder=" " id="\${ty_escapeAttr(ty_generateId('5db0f1fe', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('c67df5f9', 'id'))}">\`
elements+=\`Email\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`<div class="w-text-field-details" id="\${ty_escapeAttr(ty_generateId('17f13dec', 'id'))}">\`
elements+=\`<span class="w-text-field-messages" id="\${ty_escapeAttr(ty_generateId('497b1bdd', 'id'))}">\`
elements+=\`Invalid email format.\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('762631ea', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('97916ddb', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-text-field label="Disabled" value="Can't touch this" disabled="" id="\${ty_escapeAttr(ty_generateId('e5f9a425', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field label="Read-only" value="Locked" readonly="" id="\${ty_escapeAttr(ty_generateId('dd132716', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field label="Email" value="bad-email" error="Invalid email format." id="\${ty_escapeAttr(ty_generateId('d38da7f7', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('2b687f01', 'id'))}">\`
elements+=\`Attributes\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('08383b06', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('ef596589', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('df4457ed', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('86a4b5e2', 'id'))}">\`
elements+=\`Attribute\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('722c4054', 'id'))}">\`
elements+=\`Type\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('10569c1f', 'id'))}">\`
elements+=\`Default\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('0e3fb41a', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('71bd7ad3', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('67b4262f', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('026c87ca', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f50cce2f', 'id'))}">\`
elements+=\`type\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e31ac588', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('20979ed0', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('31c08205', 'id'))}">\`
elements+=\`text\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2d62c598', 'id'))}">\`
elements+=\`Any native input type.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('44e261ee', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7cff6236', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c071bf53', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4d22bc71', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5a0e78fa', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b0feed90', 'id'))}">\`
elements+=\`Current value (reflected; also a property).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e0a1cbb0', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1878ff60', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c8835d3b', 'id'))}">\`
elements+=\`label\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('36ea7b79', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f38ad08f', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('625d5215', 'id'))}">\`
elements+=\`Floating label.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('56c85efe', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2ef5ab50', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('06d5c381', 'id'))}">\`
elements+=\`placeholder\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('58063b69', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7b7c4fcb', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('611bc3e8', 'id'))}">\`
elements+=\`Placeholder text.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('9c83f3ac', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ebeab1bf', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ed49ec76', 'id'))}">\`
elements+=\`variant\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7a7d8e6f', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5f14d805', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d8f06c4d', 'id'))}">\`
elements+=\`outlined\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7863108c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f8cf1e8f', 'id'))}">\`
elements+=\`outlined\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a7499ec1', 'id'))}">\`
elements+=\`filled\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('eaa1a892', 'id'))}">\`
elements+=\`underlined\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7a1737f4', 'id'))}">\`
elements+=\`plain\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c1b3d87f', 'id'))}">\`
elements+=\`solo\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e1c9a1fb', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7021c099', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a51c5184', 'id'))}">\`
elements+=\`density\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6f0bdbc3', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e34a3cbd', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bc6f1a26', 'id'))}">\`
elements+=\`default\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('247cb626', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('de565b20', 'id'))}">\`
elements+=\`default\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ca32bc3d', 'id'))}">\`
elements+=\`comfortable\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3d6e4438', 'id'))}">\`
elements+=\`compact\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2f542d9a', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f22ae94d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0ab6df31', 'id'))}">\`
elements+=\`size\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c6cd2acb', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4cd781a5', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8ed0441c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8635173b', 'id'))}">\`
elements+=\`xs\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b57545e6', 'id'))}">\`
elements+=\`sm\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('64bae51f', 'id'))}">\`
elements+=\`lg\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3ce2da54', 'id'))}">\`
elements+=\`xl\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('9ae22f27', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9d68b9b1', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('92c75734', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f88b140f', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7165655c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a1c3785b', 'id'))}">\`
elements+=\`primary\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a582bbb8', 'id'))}">\`
elements+=\`Token color for the focus accent.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('6321bd5a', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4c802320', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('490ed2fd', 'id'))}">\`
elements+=\`prefix\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bbc97980', 'id'))}">\`
elements+=\`suffix\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3333ade1', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b2d3cd86', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4523becb', 'id'))}">\`
elements+=\`Static text inside the control.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('25408305', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('bb9910d6', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a98cc1f0', 'id'))}">\`
elements+=\`prepend-inner-icon\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9c1743f0', 'id'))}">\`
elements+=\`append-inner-icon\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3770662c', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f2ae5177', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f3ebaa6c', 'id'))}">\`
elements+=\`Icon names resolved through the icon registry, rendered inside the control.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('a4c2e0a0', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b21f0137', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('208d5a32', 'id'))}">\`
elements+=\`icon-set\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('772284e0', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a7e2d529', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3d7e153e', 'id'))}">\`
elements+=\`Icon set prefix for the icon attributes.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('870c1225', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1753dfb7', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9e3fd1a5', 'id'))}">\`
elements+=\`clearable\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7894ccd3', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4a0f7b71', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('df5b5d38', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('85c9b6bf', 'id'))}">\`
elements+=\`Show a clear (×) button when non-empty.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('58558ffe', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('24e6a483', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c7acd1c6', 'id'))}">\`
elements+=\`counter\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('bd7cf76e', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9a911907', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e529974a', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c5e53b40', 'id'))}">\`
elements+=\`Show a character counter; pairs with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('32f5de43', 'id'))}">\`
elements+=\`maxlength\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('18a662d7', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('378419a2', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7867579c', 'id'))}">\`
elements+=\`loading\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('cd46dca4', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e4858ae7', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fb30c7ee', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a5b2011d', 'id'))}">\`
elements+=\`Show an indeterminate bar along the bottom edge.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('c82d83a1', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5988b9d0', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bba7d7c2', 'id'))}">\`
elements+=\`hint\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('082f8144', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ea74a988', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('df6d2705', 'id'))}">\`
elements+=\`Helper text below the control.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('109e273b', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d9383b11', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d8d21b62', 'id'))}">\`
elements+=\`persistent-hint\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f8fa8935', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('461b2155', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f2026bd2', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4117663b', 'id'))}">\`
elements+=\`Keep the hint visible when not focused.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('efc7c7ce', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('924f1687', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ec197313', 'id'))}">\`
elements+=\`error\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3847d62f', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('acfaa498', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0c9bb519', 'id'))}">\`
elements+=\`Error text; tints the control and replaces the hint.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('1d237ac2', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('66246566', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d3b93283', 'id'))}">\`
elements+=\`rounded\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0ffa0367', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('46a88949', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('eff39758', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3023d2f7', 'id'))}">\`
elements+=\`Pill-rounded control.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('557616ba', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f2ef2955', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8b68f5f0', 'id'))}">\`
elements+=\`single-line\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ea522ddf', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2c0b7740', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('afaffb08', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('924bf5fc', 'id'))}">\`
elements+=\`No floating label; label becomes the placeholder.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('8958790b', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('69b3bb50', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7e538d96', 'id'))}">\`
elements+=\`hide-details\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('70890e3d', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ab3608a1', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e8be0a38', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ab06b359', 'id'))}">\`
elements+=\`Suppress the details row (hint / error / counter).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('a51eb6d2', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('88d281c9', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6e6d59a6', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a0e840d2', 'id'))}">\`
elements+=\`readonly\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d9643029', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('560a1836', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('005a3c1a', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7e625d33', 'id'))}">\`
elements+=\`State flags.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('48a319cb', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fb56e0f5', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('384f31c1', 'id'))}">\`
elements+=\`name\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d011fc50', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2946b0e7', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('bfa4f22f', 'id'))}">\`
elements+=\`Form field name.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('355f5f95', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('cd5e770c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('10a8656c', 'id'))}">\`
elements+=\`required\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e9a36641', 'id'))}">\`
elements+=\`pattern\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a264c297', 'id'))}">\`
elements+=\`minlength\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6722df5d', 'id'))}">\`
elements+=\`maxlength\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4471f964', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d33ba337', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('963dcc9f', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3ffcc69a', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8067ef58', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('70de0015', 'id'))}">\`
elements+=\`Native HTML5 validation attributes, forwarded to the input.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('2851caab', 'id'))}">\`
elements+=\`Slots\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('3a75d160', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('2aeafeb2', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('0c2e4504', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('5fe71119', 'id'))}">\`
elements+=\`Slot\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('a49421d1', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('35300b91', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('9f7d6f91', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2b78d0fb', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1e650144', 'id'))}">\`
elements+=\`prepend-inner\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('033f83fd', 'id'))}">\`
elements+=\`Content (e.g. an icon) inside the control, leading.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('a4cf1a60', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('64b94677', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c2ac0778', 'id'))}">\`
elements+=\`append-inner\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d1500e4b', 'id'))}">\`
elements+=\`Content inside the control, trailing.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('d9d56d9a', 'id'))}">\`
elements+=\`Events\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('197d96a6', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('087d9c30', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('ae7ac121', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('d66521a8', 'id'))}">\`
elements+=\`Event\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('301f45a2', 'id'))}">\`
elements+=\`Detail\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('22058cac', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('f9196755', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('86200016', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e529adc3', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3ac254ef', 'id'))}">\`
elements+=\`input\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b2eb8aee', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d3aea867', 'id'))}">\`
elements+=\`&#123; value, name &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3d568389', 'id'))}">\`
elements+=\`Fired on every keystroke.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('671814f7', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('816931f0', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('df8a0cc9', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8cfa4422', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dfbb719b', 'id'))}">\`
elements+=\`&#123; value, name &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('33588cb2', 'id'))}">\`
elements+=\`Fired when the value is committed.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('07a4be02', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4be7261e', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9d9bb763', 'id'))}">\`
elements+=\`clear\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7e31baad', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8b724ae2', 'id'))}">\`
elements+=\`&#123; name &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('835d9a2e', 'id'))}">\`
elements+=\`Fired when cleared via the clear button.\`
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
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/text-fields/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
