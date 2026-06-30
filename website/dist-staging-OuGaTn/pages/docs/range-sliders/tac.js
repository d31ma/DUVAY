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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('6a703396', 'id'))}">\`
elements+=\`Range sliders\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d4310ff1', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3fb3dca0', 'id'))}">\`
elements+=\`w-range-slider\`
elements+=\`</code>\`
elements+=\` selects a range between two values with a pair of thumbs on a single track; the selected segment is highlighted. Bind the ends with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5aacfe9c', 'id'))}">\`
elements+=\`start\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3fb03b62', 'id'))}">\`
elements+=\`end\`
elements+=\`</code>\`
elements+=\`, and constrain with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a21469f2', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1e9031a0', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d55afde8', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\`. For a single value, use the \`
elements+=\`<a href="/docs/sliders" id="\${ty_escapeAttr(ty_generateId('b4137d13', 'id'))}">\`
elements+=\`slider\`
elements+=\`</a>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('0f4a2dde', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('f89db339', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-range-slider" id="\${ty_escapeAttr(ty_generateId('a89a8fbe', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('84d13e64', 'id'))}">\`
elements+=\`Budget\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-range-slider-control" id="\${ty_escapeAttr(ty_generateId('c68bdbee', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('58cdf0e8', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-fill" style="left:20%;width:60%" id="\${ty_escapeAttr(ty_generateId('97148d75', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="20" aria-label="Start" id="\${ty_escapeAttr(ty_generateId('83e5dfd0', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="80" aria-label="End" id="\${ty_escapeAttr(ty_generateId('3669e6fe', 'id'))}" />\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('a18d0ab5', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('136af6b6', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-range-slider label="Budget" start="20" end="80" id="\${ty_escapeAttr(ty_generateId('2e37776f', 'id'))}">\`
elements+=\`</w-range-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('c29cec02', 'id'))}">\`
elements+=\`Min, max, and step\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('0507c55e', 'id'))}">\`
elements+=\`Constrain the range with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('311c2ba8', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('88f4d056', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\` and snap to increments with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('49e3ffc4', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('716a218c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-range-slider" id="\${ty_escapeAttr(ty_generateId('377072a8', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('05b1ba0b', 'id'))}">\`
elements+=\`Temperature (°C)\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-range-slider-control" id="\${ty_escapeAttr(ty_generateId('40071aa1', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('af1acdd3', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-fill" style="left:33.33%;width:33.33%" id="\${ty_escapeAttr(ty_generateId('7e7bf2e0', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" min="-20" max="40" step="5" value="0" aria-label="Start" id="\${ty_escapeAttr(ty_generateId('b81e4230', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" min="-20" max="40" step="5" value="20" aria-label="End" id="\${ty_escapeAttr(ty_generateId('e266a8ff', 'id'))}" />\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('463096a5', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('f5fc82df', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-range-slider label="Temperature (°C)" min="-20" max="40" step="5" start="0" end="20" id="\${ty_escapeAttr(ty_generateId('af94baca', 'id'))}">\`
elements+=\`</w-range-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('be812f52', 'id'))}">\`
elements+=\`Disabled\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('31f23c0e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-range-slider w-range-slider--disabled" id="\${ty_escapeAttr(ty_generateId('dc7de2ab', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('051ac0e4', 'id'))}">\`
elements+=\`Budget\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-range-slider-control" id="\${ty_escapeAttr(ty_generateId('15ed2d81', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('7c06aa40', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-fill" style="left:30%;width:40%" id="\${ty_escapeAttr(ty_generateId('8154ddb0', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="30" aria-label="Start" disabled="" id="\${ty_escapeAttr(ty_generateId('49f3121a', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="70" aria-label="End" disabled="" id="\${ty_escapeAttr(ty_generateId('d27bfa58', 'id'))}" />\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('062e588b', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('c4750162', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-range-slider label="Budget" start="30" end="70" disabled="" id="\${ty_escapeAttr(ty_generateId('21386db7', 'id'))}">\`
elements+=\`</w-range-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('85264654', 'id'))}">\`
elements+=\`Thumb labels\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c51465f0', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d5b1700c', 'id'))}">\`
elements+=\`thumb-label\`
elements+=\`</code>\`
elements+=\` to show each thumb&#8217;s value on hover or focus, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1f0676ae', 'id'))}">\`
elements+=\`thumb-label="always"\`
elements+=\`</code>\`
elements+=\` to keep the bubbles visible.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('5f5d9609', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-range-slider w-range-slider--thumb-label w-range-slider--thumb-label-always" id="\${ty_escapeAttr(ty_generateId('3f0dfeb1', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('8378b693', 'id'))}">\`
elements+=\`Budget\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-range-slider-control" style="--start:20%;--end:80%" id="\${ty_escapeAttr(ty_generateId('089329d5', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('a9cc9125', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-fill" id="\${ty_escapeAttr(ty_generateId('47cea92e', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="20" aria-label="Start" id="\${ty_escapeAttr(ty_generateId('256e79fe', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="80" aria-label="End" id="\${ty_escapeAttr(ty_generateId('baaad995', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-thumb-label" data-thumb="start" style="--pos:20%" id="\${ty_escapeAttr(ty_generateId('e59cfb48', 'id'))}">\`
elements+=\`20\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-thumb-label" data-thumb="end" style="--pos:80%" id="\${ty_escapeAttr(ty_generateId('bf161a0e', 'id'))}">\`
elements+=\`80\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('bf12a3bf', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('7d4a3701', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-range-slider label="Budget" start="20" end="80" thumb-label="always" id="\${ty_escapeAttr(ty_generateId('384fbabe', 'id'))}">\`
elements+=\`</w-range-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('10de6519', 'id'))}">\`
elements+=\`Ticks\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('b5195324', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b214f604', 'id'))}">\`
elements+=\`ticks\`
elements+=\`</code>\`
elements+=\` to mark each \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1acb5910', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\` along the track.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('9fb6036f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-range-slider" id="\${ty_escapeAttr(ty_generateId('bf53ee1e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('d13548be', 'id'))}">\`
elements+=\`Rating\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-range-slider-control" style="--start:30%;--end:70%" id="\${ty_escapeAttr(ty_generateId('71d4c0f8', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('d68f6a8b', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-fill" id="\${ty_escapeAttr(ty_generateId('4cb5fa5f', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-ticks" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('eb702909', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:0%" id="\${ty_escapeAttr(ty_generateId('8630da15', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:10%" id="\${ty_escapeAttr(ty_generateId('668d73fb', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:20%" id="\${ty_escapeAttr(ty_generateId('f36ed3c1', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:30%" id="\${ty_escapeAttr(ty_generateId('bcaac3e9', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:40%" id="\${ty_escapeAttr(ty_generateId('fbfee987', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:50%" id="\${ty_escapeAttr(ty_generateId('79bea011', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:60%" id="\${ty_escapeAttr(ty_generateId('c3dfeb78', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:70%" id="\${ty_escapeAttr(ty_generateId('093145c4', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:80%" id="\${ty_escapeAttr(ty_generateId('247b921f', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:90%" id="\${ty_escapeAttr(ty_generateId('992767dc', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:100%" id="\${ty_escapeAttr(ty_generateId('4d052a81', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" min="0" max="10" step="1" value="3" aria-label="Start" id="\${ty_escapeAttr(ty_generateId('06f1386e', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" min="0" max="10" step="1" value="7" aria-label="End" id="\${ty_escapeAttr(ty_generateId('e6618d94', 'id'))}" />\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('03b3559b', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('6fb42853', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-range-slider label="Rating" min="0" max="10" step="1" start="3" end="7" ticks="" id="\${ty_escapeAttr(ty_generateId('9203d1e6', 'id'))}">\`
elements+=\`</w-range-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('e5074a40', 'id'))}">\`
elements+=\`Vertical\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('678a9b14', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('58e2c256', 'id'))}">\`
elements+=\`direction="vertical"\`
elements+=\`</code>\`
elements+=\` to orient the slider vertically.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('8c8e5bc3', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-range-slider w-range-slider--vertical w-range-slider--thumb-label w-range-slider--thumb-label-always" id="\${ty_escapeAttr(ty_generateId('d8cb0807', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('c2394b5b', 'id'))}">\`
elements+=\`Budget\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-range-slider-control" style="--start:20%;--end:80%" id="\${ty_escapeAttr(ty_generateId('09327def', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('e84ae0e1', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-fill" id="\${ty_escapeAttr(ty_generateId('40c2479c', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="20" aria-label="Start" id="\${ty_escapeAttr(ty_generateId('e2349729', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="80" aria-label="End" id="\${ty_escapeAttr(ty_generateId('24bbe865', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-thumb-label" data-thumb="start" style="--pos:20%" id="\${ty_escapeAttr(ty_generateId('debed9d6', 'id'))}">\`
elements+=\`20\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-thumb-label" data-thumb="end" style="--pos:80%" id="\${ty_escapeAttr(ty_generateId('3225ad64', 'id'))}">\`
elements+=\`80\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('8b59dfa7', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('1da7a044', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-range-slider label="Budget" start="20" end="80" direction="vertical" thumb-label="always" id="\${ty_escapeAttr(ty_generateId('0fd5a3e4', 'id'))}">\`
elements+=\`</w-range-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/range-sliders/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
