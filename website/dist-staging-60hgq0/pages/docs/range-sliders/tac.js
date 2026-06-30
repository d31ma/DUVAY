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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('88e24900', 'id'))}">\`
elements+=\`Range sliders\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d4759533', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('42ad635d', 'id'))}">\`
elements+=\`w-range-slider\`
elements+=\`</code>\`
elements+=\` selects a range between two values with a pair of thumbs on a single track; the selected segment is highlighted. Bind the ends with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3ad31565', 'id'))}">\`
elements+=\`start\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2b2310e4', 'id'))}">\`
elements+=\`end\`
elements+=\`</code>\`
elements+=\`, and constrain with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('19e5414d', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fc320806', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('50fb0b65', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\`. For a single value, use the \`
elements+=\`<a href="/docs/sliders" id="\${ty_escapeAttr(ty_generateId('23a799c1', 'id'))}">\`
elements+=\`slider\`
elements+=\`</a>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('a06947d2', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('db00538c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-range-slider" id="\${ty_escapeAttr(ty_generateId('00e7765e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('e9da340a', 'id'))}">\`
elements+=\`Budget\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-range-slider-control" id="\${ty_escapeAttr(ty_generateId('c6f89091', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('e9dce395', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-fill" style="left:20%;width:60%" id="\${ty_escapeAttr(ty_generateId('aabc8b08', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="20" aria-label="Start" id="\${ty_escapeAttr(ty_generateId('55c9a7af', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="80" aria-label="End" id="\${ty_escapeAttr(ty_generateId('39599139', 'id'))}" />\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('05e440ea', 'id'))}">\`
elements+=\`20 – 80\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('3c4c1600', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-range-slider label="Budget" start="20" end="80" id="\${ty_escapeAttr(ty_generateId('9b11b8ab', 'id'))}">\`
elements+=\`</w-range-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('6f717255', 'id'))}">\`
elements+=\`Min, max, and step\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('524f7dbe', 'id'))}">\`
elements+=\`Constrain the range with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('daed6f44', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dab4cda7', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\` and snap to increments with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('17860b76', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('4961f675', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-range-slider" id="\${ty_escapeAttr(ty_generateId('9d8444de', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('0418bbdf', 'id'))}">\`
elements+=\`Temperature (°C)\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-range-slider-control" id="\${ty_escapeAttr(ty_generateId('3f48e4be', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('503b883e', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-fill" style="left:33.33%;width:33.33%" id="\${ty_escapeAttr(ty_generateId('ca733bbd', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" min="-20" max="40" step="5" value="0" aria-label="Start" id="\${ty_escapeAttr(ty_generateId('827ba616', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" min="-20" max="40" step="5" value="20" aria-label="End" id="\${ty_escapeAttr(ty_generateId('73d0cf8c', 'id'))}" />\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('221dfd6b', 'id'))}">\`
elements+=\`0 – 20\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('28a5958a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-range-slider label="Temperature (°C)" min="-20" max="40" step="5" start="0" end="20" id="\${ty_escapeAttr(ty_generateId('9a1332b6', 'id'))}">\`
elements+=\`</w-range-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('dccdc2aa', 'id'))}">\`
elements+=\`Disabled\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('131d9b7e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-range-slider w-range-slider--disabled" id="\${ty_escapeAttr(ty_generateId('d0837795', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('3b4fd8da', 'id'))}">\`
elements+=\`Budget\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-range-slider-control" id="\${ty_escapeAttr(ty_generateId('41c45ea9', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('df57aede', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-fill" style="left:30%;width:40%" id="\${ty_escapeAttr(ty_generateId('740d6444', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="30" aria-label="Start" disabled="" id="\${ty_escapeAttr(ty_generateId('e7397c86', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="70" aria-label="End" disabled="" id="\${ty_escapeAttr(ty_generateId('f3eab53b', 'id'))}" />\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('76927144', 'id'))}">\`
elements+=\`30 – 70\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('eabbffe3', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-range-slider label="Budget" start="30" end="70" disabled="" id="\${ty_escapeAttr(ty_generateId('321da1de', 'id'))}">\`
elements+=\`</w-range-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('c6819f01', 'id'))}">\`
elements+=\`Thumb labels\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('8024b890', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('026d241e', 'id'))}">\`
elements+=\`thumb-label\`
elements+=\`</code>\`
elements+=\` to show each thumb&#8217;s value on hover or focus, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fb5bfebd', 'id'))}">\`
elements+=\`thumb-label="always"\`
elements+=\`</code>\`
elements+=\` to keep the bubbles visible.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('603ae4d8', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-range-slider w-range-slider--thumb-label w-range-slider--thumb-label-always" id="\${ty_escapeAttr(ty_generateId('7dc5cc24', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('623106ad', 'id'))}">\`
elements+=\`Budget\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-range-slider-control" style="--start:20%;--end:80%" id="\${ty_escapeAttr(ty_generateId('c76c43bf', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('094f5944', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-fill" id="\${ty_escapeAttr(ty_generateId('33f2c718', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="20" aria-label="Start" id="\${ty_escapeAttr(ty_generateId('e224f769', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="80" aria-label="End" id="\${ty_escapeAttr(ty_generateId('9201b222', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-thumb-label" data-thumb="start" style="--pos:20%" id="\${ty_escapeAttr(ty_generateId('879d1d3e', 'id'))}">\`
elements+=\`20\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-thumb-label" data-thumb="end" style="--pos:80%" id="\${ty_escapeAttr(ty_generateId('0e659299', 'id'))}">\`
elements+=\`80\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('341d6648', 'id'))}">\`
elements+=\`20 – 80\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('407a83a9', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-range-slider label="Budget" start="20" end="80" thumb-label="always" id="\${ty_escapeAttr(ty_generateId('6a321b00', 'id'))}">\`
elements+=\`</w-range-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('3cda6c7f', 'id'))}">\`
elements+=\`Ticks\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('9c27b9b6', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('99ccbe05', 'id'))}">\`
elements+=\`ticks\`
elements+=\`</code>\`
elements+=\` to mark each \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('178bd1b3', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\` along the track.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('064f5f2b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-range-slider" id="\${ty_escapeAttr(ty_generateId('33edfb70', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('f6118e1c', 'id'))}">\`
elements+=\`Rating\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-range-slider-control" style="--start:30%;--end:70%" id="\${ty_escapeAttr(ty_generateId('786b3185', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('fc9d5511', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-fill" id="\${ty_escapeAttr(ty_generateId('4ce24d11', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-ticks" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('97d262bd', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:0%" id="\${ty_escapeAttr(ty_generateId('9ff02262', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:10%" id="\${ty_escapeAttr(ty_generateId('dfadbe90', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:20%" id="\${ty_escapeAttr(ty_generateId('0a052c48', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:30%" id="\${ty_escapeAttr(ty_generateId('ee57b46b', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:40%" id="\${ty_escapeAttr(ty_generateId('18651954', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:50%" id="\${ty_escapeAttr(ty_generateId('b19aab08', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:60%" id="\${ty_escapeAttr(ty_generateId('e4e384b8', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:70%" id="\${ty_escapeAttr(ty_generateId('f850d74b', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:80%" id="\${ty_escapeAttr(ty_generateId('b18f803b', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:90%" id="\${ty_escapeAttr(ty_generateId('c4a8a69f', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:100%" id="\${ty_escapeAttr(ty_generateId('1a98443a', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" min="0" max="10" step="1" value="3" aria-label="Start" id="\${ty_escapeAttr(ty_generateId('9e4c6958', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" min="0" max="10" step="1" value="7" aria-label="End" id="\${ty_escapeAttr(ty_generateId('ec5e7530', 'id'))}" />\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('9fbe40be', 'id'))}">\`
elements+=\`3 – 7\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('1d928ae1', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-range-slider label="Rating" min="0" max="10" step="1" start="3" end="7" ticks="" id="\${ty_escapeAttr(ty_generateId('cc706f23', 'id'))}">\`
elements+=\`</w-range-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('d879a648', 'id'))}">\`
elements+=\`Vertical\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('7198e64d', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6546ec9c', 'id'))}">\`
elements+=\`direction="vertical"\`
elements+=\`</code>\`
elements+=\` to orient the slider vertically.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('9bd92c28', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-range-slider w-range-slider--vertical w-range-slider--thumb-label w-range-slider--thumb-label-always" id="\${ty_escapeAttr(ty_generateId('a2d5b5aa', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('56de0cce', 'id'))}">\`
elements+=\`Budget\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-range-slider-control" style="--start:20%;--end:80%" id="\${ty_escapeAttr(ty_generateId('d750297f', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('4508cc04', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-fill" id="\${ty_escapeAttr(ty_generateId('d38602ca', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="20" aria-label="Start" id="\${ty_escapeAttr(ty_generateId('1bcd5a60', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="80" aria-label="End" id="\${ty_escapeAttr(ty_generateId('ee4c648c', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-thumb-label" data-thumb="start" style="--pos:20%" id="\${ty_escapeAttr(ty_generateId('e204ef72', 'id'))}">\`
elements+=\`20\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-thumb-label" data-thumb="end" style="--pos:80%" id="\${ty_escapeAttr(ty_generateId('9f332c15', 'id'))}">\`
elements+=\`80\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('bf4b93c5', 'id'))}">\`
elements+=\`20 – 80\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('5ee3aced', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-range-slider label="Budget" start="20" end="80" direction="vertical" thumb-label="always" id="\${ty_escapeAttr(ty_generateId('63b15e0c', 'id'))}">\`
elements+=\`</w-range-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('4de312e1', 'id'))}">\`
elements+=\`Attributes\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('d2f0d212', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('f73c4cd5', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('037d3aeb', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('00448de1', 'id'))}">\`
elements+=\`Attribute\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('d6a5419a', 'id'))}">\`
elements+=\`Type\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('7c1a02d4', 'id'))}">\`
elements+=\`Default\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('17535655', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('02e42ae2', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('b75146a2', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('655ccdde', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('680e58f1', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('47866be8', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1acaceee', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('28010f81', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8be0fc46', 'id'))}">\`
elements+=\`0\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('318cb845', 'id'))}">\`
elements+=\`100\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0af62e0c', 'id'))}">\`
elements+=\`Range bounds.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e740c02c', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6a18ecef', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7da716b5', 'id'))}">\`
elements+=\`start\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8c39528d', 'id'))}">\`
elements+=\`end\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('43f684f6', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9c4a98c9', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('772d9f80', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('38631764', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4891cdf8', 'id'))}">\`
elements+=\`Current range ends.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('91a97e92', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('422ec76d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('64539f49', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('bfea6826', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('dea11747', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('59081118', 'id'))}">\`
elements+=\`1\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ffc7fbf2', 'id'))}">\`
elements+=\`Increment between values.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('dda3273a', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0986e33b', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a2fe61a6', 'id'))}">\`
elements+=\`label\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e4ef33a9', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c52c78b0', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b87036a9', 'id'))}">\`
elements+=\`Field label.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('fc70ecff', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e8060837', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ff653066', 'id'))}">\`
elements+=\`direction\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2d956178', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4058cae2', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('294af5b4', 'id'))}">\`
elements+=\`horizontal\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('aa0d34ea', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f0f0273e', 'id'))}">\`
elements+=\`horizontal\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ce65c67f', 'id'))}">\`
elements+=\`vertical\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('883f54b9', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c2cbc554', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2ee86c2c', 'id'))}">\`
elements+=\`thumb-label\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('819b7247', 'id'))}">\`
elements+=\`boolean | \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a7be19c7', 'id'))}">\`
elements+=\`always\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2769a18f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cd5b82b3', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9df211cb', 'id'))}">\`
elements+=\`Show a value bubble over each thumb (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dd95ace9', 'id'))}">\`
elements+=\`always\`
elements+=\`</code>\`
elements+=\` keeps it visible).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e986ce16', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7f5994a1', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c69d03c0', 'id'))}">\`
elements+=\`ticks\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9aeaa012', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('565b0705', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bf5c61be', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0f478103', 'id'))}">\`
elements+=\`Draw a tick at every \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7cd594d1', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('b8bb7b75', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f0076dfb', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e5c185c3', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('106681f4', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('da4b353c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6fc98d86', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f822ae26', 'id'))}">\`
elements+=\`Disable both thumbs.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('5d3cb214', 'id'))}">\`
elements+=\`Events\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('b34be9e5', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('263d7aa2', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('84c9187d', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('6721f67d', 'id'))}">\`
elements+=\`Event\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('e7acb564', 'id'))}">\`
elements+=\`Detail\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('74953931', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('2c5e14bf', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('29361ea0', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5651e1a8', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0d8f1d75', 'id'))}">\`
elements+=\`w-input\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('48c9aca9', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d8c14567', 'id'))}">\`
elements+=\`&#123; start, end &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('217ceaed', 'id'))}">\`
elements+=\`Fired while dragging either thumb.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('f31cdffd', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1c337f66', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('edcd73f6', 'id'))}">\`
elements+=\`w-change\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e9dfb35c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7a8ba4ed', 'id'))}">\`
elements+=\`&#123; start, end &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3a37c9c7', 'id'))}">\`
elements+=\`Fired when a thumb is released.\`
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
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/range-sliders/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
