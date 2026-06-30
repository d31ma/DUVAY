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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('4f0d933d', 'id'))}">\`
elements+=\`Range sliders\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('bb7798bd', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0c753e5c', 'id'))}">\`
elements+=\`w-range-slider\`
elements+=\`</code>\`
elements+=\` selects a range between two values with a pair of thumbs on a single track; the selected segment is highlighted. Bind the ends with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('40276dca', 'id'))}">\`
elements+=\`start\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('efef8516', 'id'))}">\`
elements+=\`end\`
elements+=\`</code>\`
elements+=\`, and constrain with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('317f9451', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fd57c997', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ba2876d4', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\`. For a single value, use the \`
elements+=\`<a href="/docs/sliders" id="\${ty_escapeAttr(ty_generateId('f933506c', 'id'))}">\`
elements+=\`slider\`
elements+=\`</a>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('6520029d', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('db6b11fc', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-range-slider" id="\${ty_escapeAttr(ty_generateId('f9e25d10', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('da58a41a', 'id'))}">\`
elements+=\`Budget\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-range-slider-control" id="\${ty_escapeAttr(ty_generateId('1bdca06d', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('22f7efb4', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-fill" style="left:20%;width:60%" id="\${ty_escapeAttr(ty_generateId('97d36c29', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="20" aria-label="Start" id="\${ty_escapeAttr(ty_generateId('837f6445', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="80" aria-label="End" id="\${ty_escapeAttr(ty_generateId('01904234', 'id'))}" />\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('57c033b4', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('2eba76c0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-range-slider label="Budget" start="20" end="80" id="\${ty_escapeAttr(ty_generateId('6bd42db2', 'id'))}">\`
elements+=\`</w-range-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('eacc1898', 'id'))}">\`
elements+=\`Min, max, and step\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('0b713c38', 'id'))}">\`
elements+=\`Constrain the range with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8d76ca78', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7475ede4', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\` and snap to increments with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('97d07fc1', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('08203fc0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-range-slider" id="\${ty_escapeAttr(ty_generateId('8cc31156', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('efcb5bbd', 'id'))}">\`
elements+=\`Temperature (°C)\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-range-slider-control" id="\${ty_escapeAttr(ty_generateId('28edaf99', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('315717b3', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-fill" style="left:33.33%;width:33.33%" id="\${ty_escapeAttr(ty_generateId('5ec84a0d', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" min="-20" max="40" step="5" value="0" aria-label="Start" id="\${ty_escapeAttr(ty_generateId('b7c2e54c', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" min="-20" max="40" step="5" value="20" aria-label="End" id="\${ty_escapeAttr(ty_generateId('93e55b11', 'id'))}" />\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('76668706', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('421895d9', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-range-slider label="Temperature (°C)" min="-20" max="40" step="5" start="0" end="20" id="\${ty_escapeAttr(ty_generateId('c8edac3d', 'id'))}">\`
elements+=\`</w-range-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('38182aff', 'id'))}">\`
elements+=\`Disabled\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('af503306', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-range-slider w-range-slider--disabled" id="\${ty_escapeAttr(ty_generateId('755de15d', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('9167a781', 'id'))}">\`
elements+=\`Budget\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-range-slider-control" id="\${ty_escapeAttr(ty_generateId('a55fe7d9', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('b0a28acc', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-fill" style="left:30%;width:40%" id="\${ty_escapeAttr(ty_generateId('12551441', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="30" aria-label="Start" disabled="" id="\${ty_escapeAttr(ty_generateId('6216f47e', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="70" aria-label="End" disabled="" id="\${ty_escapeAttr(ty_generateId('c6a09aec', 'id'))}" />\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('c87c97ea', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('cb13ecfc', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-range-slider label="Budget" start="30" end="70" disabled="" id="\${ty_escapeAttr(ty_generateId('741e6d95', 'id'))}">\`
elements+=\`</w-range-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('d8898af7', 'id'))}">\`
elements+=\`Thumb labels\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('140bf1e8', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c3bacd19', 'id'))}">\`
elements+=\`thumb-label\`
elements+=\`</code>\`
elements+=\` to show each thumb&#8217;s value on hover or focus, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0020e155', 'id'))}">\`
elements+=\`thumb-label="always"\`
elements+=\`</code>\`
elements+=\` to keep the bubbles visible.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('b63d3c16', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-range-slider w-range-slider--thumb-label w-range-slider--thumb-label-always" id="\${ty_escapeAttr(ty_generateId('8d410913', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('6beca0e8', 'id'))}">\`
elements+=\`Budget\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-range-slider-control" style="--start:20%;--end:80%" id="\${ty_escapeAttr(ty_generateId('50195751', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('9709c6f3', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-fill" id="\${ty_escapeAttr(ty_generateId('0294877c', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="20" aria-label="Start" id="\${ty_escapeAttr(ty_generateId('8b2c35bc', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="80" aria-label="End" id="\${ty_escapeAttr(ty_generateId('c3e28fe1', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-thumb-label" data-thumb="start" style="--pos:20%" id="\${ty_escapeAttr(ty_generateId('4f52529c', 'id'))}">\`
elements+=\`20\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-thumb-label" data-thumb="end" style="--pos:80%" id="\${ty_escapeAttr(ty_generateId('70cb1e25', 'id'))}">\`
elements+=\`80\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('b571e412', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('5522b2ec', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-range-slider label="Budget" start="20" end="80" thumb-label="always" id="\${ty_escapeAttr(ty_generateId('f7614283', 'id'))}">\`
elements+=\`</w-range-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('cfe751b9', 'id'))}">\`
elements+=\`Ticks\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('a15d1236', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0efac9a9', 'id'))}">\`
elements+=\`ticks\`
elements+=\`</code>\`
elements+=\` to mark each \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7b22a2c1', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\` along the track.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('5d6992a5', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-range-slider" id="\${ty_escapeAttr(ty_generateId('a8b13617', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('90a9d5a8', 'id'))}">\`
elements+=\`Rating\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-range-slider-control" style="--start:30%;--end:70%" id="\${ty_escapeAttr(ty_generateId('671de60a', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('2d06c819', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-fill" id="\${ty_escapeAttr(ty_generateId('d0fab07a', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-ticks" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('20369588', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:0%" id="\${ty_escapeAttr(ty_generateId('04b24339', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:10%" id="\${ty_escapeAttr(ty_generateId('04437353', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:20%" id="\${ty_escapeAttr(ty_generateId('c79e8dee', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:30%" id="\${ty_escapeAttr(ty_generateId('38cd04b2', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:40%" id="\${ty_escapeAttr(ty_generateId('510c8bfb', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:50%" id="\${ty_escapeAttr(ty_generateId('50d1e575', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:60%" id="\${ty_escapeAttr(ty_generateId('969e0b67', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:70%" id="\${ty_escapeAttr(ty_generateId('37969fe8', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:80%" id="\${ty_escapeAttr(ty_generateId('8eee8369', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:90%" id="\${ty_escapeAttr(ty_generateId('6515add3', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:100%" id="\${ty_escapeAttr(ty_generateId('a6d70eda', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" min="0" max="10" step="1" value="3" aria-label="Start" id="\${ty_escapeAttr(ty_generateId('91a5ee27', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" min="0" max="10" step="1" value="7" aria-label="End" id="\${ty_escapeAttr(ty_generateId('04eea47d', 'id'))}" />\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('5561d4a0', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('b4639b5b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-range-slider label="Rating" min="0" max="10" step="1" start="3" end="7" ticks="" id="\${ty_escapeAttr(ty_generateId('acbc4361', 'id'))}">\`
elements+=\`</w-range-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('ba8b1b9f', 'id'))}">\`
elements+=\`Vertical\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('b08ac9a0', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2f7d2288', 'id'))}">\`
elements+=\`direction="vertical"\`
elements+=\`</code>\`
elements+=\` to orient the slider vertically.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('12a65bea', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-range-slider w-range-slider--vertical w-range-slider--thumb-label w-range-slider--thumb-label-always" id="\${ty_escapeAttr(ty_generateId('ab24bf39', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('f6cb9dc0', 'id'))}">\`
elements+=\`Budget\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-range-slider-control" style="--start:20%;--end:80%" id="\${ty_escapeAttr(ty_generateId('1aa16da6', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('e6e51a27', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-fill" id="\${ty_escapeAttr(ty_generateId('99427483', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="20" aria-label="Start" id="\${ty_escapeAttr(ty_generateId('0c74001b', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="80" aria-label="End" id="\${ty_escapeAttr(ty_generateId('92bfc8cf', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-thumb-label" data-thumb="start" style="--pos:20%" id="\${ty_escapeAttr(ty_generateId('84cb3c5b', 'id'))}">\`
elements+=\`20\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-thumb-label" data-thumb="end" style="--pos:80%" id="\${ty_escapeAttr(ty_generateId('bbab4ef8', 'id'))}">\`
elements+=\`80\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('e181ad18', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('4e266b04', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-range-slider label="Budget" start="20" end="80" direction="vertical" thumb-label="always" id="\${ty_escapeAttr(ty_generateId('bd735da9', 'id'))}">\`
elements+=\`</w-range-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('0a3490bd', 'id'))}">\`
elements+=\`Attributes\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('e73d1f74', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('67718a3b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('a3691253', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('fbeec924', 'id'))}">\`
elements+=\`Attribute\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('6e6b4729', 'id'))}">\`
elements+=\`Type\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('20ddd50b', 'id'))}">\`
elements+=\`Default\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('0a99b69c', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('9b502429', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('bfa5d361', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('077fc553', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ad78d016', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3aeb2872', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8c7e6ae5', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4d556ef1', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d15b6d35', 'id'))}">\`
elements+=\`0\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9a0b9f66', 'id'))}">\`
elements+=\`100\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('86470fdb', 'id'))}">\`
elements+=\`Range bounds.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('cba2540f', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7ba5e15a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('022c51f0', 'id'))}">\`
elements+=\`start\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a874f9bb', 'id'))}">\`
elements+=\`end\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('99a4e36f', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('159057d2', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b12ebd81', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ebb91567', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e86c7ee5', 'id'))}">\`
elements+=\`Current range ends.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('d9b17ee4', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e8099378', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('abdaad30', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8c169da6', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('dee96844', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5c9eb335', 'id'))}">\`
elements+=\`1\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3976c1d4', 'id'))}">\`
elements+=\`Increment between values.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('f7dcce3f', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c43133a8', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c42a1cac', 'id'))}">\`
elements+=\`label\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('915e0916', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b2aa4953', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ad368830', 'id'))}">\`
elements+=\`Field label.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('403bcf03', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f86c5b6a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ffef5864', 'id'))}">\`
elements+=\`direction\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d3f37885', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5aec476b', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('479959d5', 'id'))}">\`
elements+=\`horizontal\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8675c764', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e95ee984', 'id'))}">\`
elements+=\`horizontal\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5f464da9', 'id'))}">\`
elements+=\`vertical\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('5a4bc990', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7008aadf', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e4e89341', 'id'))}">\`
elements+=\`thumb-label\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ba0c24eb', 'id'))}">\`
elements+=\`boolean | \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('63aa9508', 'id'))}">\`
elements+=\`always\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8e9d6b0f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a9756a58', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3824452b', 'id'))}">\`
elements+=\`Show a value bubble over each thumb (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('61b2801d', 'id'))}">\`
elements+=\`always\`
elements+=\`</code>\`
elements+=\` keeps it visible).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('35fa4a9d', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d19d3e64', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('da8c82c2', 'id'))}">\`
elements+=\`ticks\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a35d0f63', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7b7cf87d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4fb43a3c', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('50c8fbd2', 'id'))}">\`
elements+=\`Draw a tick at every \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('789aaaa2', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('72d5e722', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f86bbd65', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6b63f6f8', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e5808b29', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('33f45135', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bd6f8587', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('747bf73e', 'id'))}">\`
elements+=\`Disable both thumbs.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('722f18bb', 'id'))}">\`
elements+=\`Events\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('5c02744a', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('d5cda1b1', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('69e94b9f', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('398e32ef', 'id'))}">\`
elements+=\`Event\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('b3dcdd0f', 'id'))}">\`
elements+=\`Detail\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('6ed4cc87', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('296f9f15', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('83d948ab', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7975cf39', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('32e560f9', 'id'))}">\`
elements+=\`input\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('67b75d80', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2529d302', 'id'))}">\`
elements+=\`&#123; start, end &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9dc81026', 'id'))}">\`
elements+=\`Fired while dragging either thumb.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('c372ee11', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8f0018e8', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bdd4982c', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1ae9e098', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3e6cc31e', 'id'))}">\`
elements+=\`&#123; start, end &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('bedf5bcc', 'id'))}">\`
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
