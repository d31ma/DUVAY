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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('bdce7e62', 'id'))}">\`
elements+=\`Slider\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('ed40fa11', 'id'))}">\`
elements+=\`A control for choosing a value along a track. Use the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8f151b13', 'id'))}">\`
elements+=\`.w-slider\`
elements+=\`</code>\`
elements+=\` class on a native \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f8138911', 'id'))}">\`
elements+=\`&lt;input type="range"&gt;\`
elements+=\`</code>\`
elements+=\` for the minimal version, or the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bca420cd', 'id'))}">\`
elements+=\`&lt;w-slider&gt;\`
elements+=\`</code>\`
elements+=\` web component for labels, ticks, value bubbles, theming, and vertical orientation. For two thumbs, see the \`
elements+=\`<a href="/docs/range-sliders" id="\${ty_escapeAttr(ty_generateId('2b6339b9', 'id'))}">\`
elements+=\`range slider\`
elements+=\`</a>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('6fbc2edb', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('0108479a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<input class="w-slider" type="range" min="0" max="100" value="40" style="--w-slider-pct:40%" id="\${ty_escapeAttr(ty_generateId('d3583f59', 'id'))}" />\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('7c7b1830', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slider min="0" max="100" value="40" id="\${ty_escapeAttr(ty_generateId('6ef8ddaa', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('67fb81b0', 'id'))}">\`
elements+=\`Label\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('1fc3b789', 'id'))}">\`
elements+=\`Add a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f25f8ff5', 'id'))}">\`
elements+=\`label\`
elements+=\`</code>\`
elements+=\`; the current value shows below the track.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('439019df', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-slider-field" id="\${ty_escapeAttr(ty_generateId('22123a69', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('1a81a403', 'id'))}">\`
elements+=\`Volume\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-slider-control" style="--value:60%" id="\${ty_escapeAttr(ty_generateId('e2b6d53f', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-slider-rail" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('a2b7fc22', 'id'))}">\`
elements+=\`<span class="w-slider-fill" id="\${ty_escapeAttr(ty_generateId('12d4ed03', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-slider-input" type="range" value="60" aria-label="Volume" id="\${ty_escapeAttr(ty_generateId('0f44d12c', 'id'))}" />\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('e5ca9e89', 'id'))}">\`
elements+=\`60\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('94bf3cbb', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slider label="Volume" value="60" id="\${ty_escapeAttr(ty_generateId('babb302d', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('cd5bb58a', 'id'))}">\`
elements+=\`Sizes\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('75ad7292', 'id'))}">\`
elements+=\`Five sizes from \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d0802288', 'id'))}">\`
elements+=\`xs\`
elements+=\`</code>\`
elements+=\` to \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0788042d', 'id'))}">\`
elements+=\`xl\`
elements+=\`</code>\`
elements+=\`; omit for the default.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('67ed1ec1', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('8fda669f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<input class="w-slider w-slider--xs" type="range" value="20" style="--w-slider-pct:20%" id="\${ty_escapeAttr(ty_generateId('1607dcf9', 'id'))}" />\`
elements+=\`
      \`
elements+=\`<input class="w-slider w-slider--sm" type="range" value="30" style="--w-slider-pct:30%" id="\${ty_escapeAttr(ty_generateId('1f8af83d', 'id'))}" />\`
elements+=\`
      \`
elements+=\`<input class="w-slider" type="range" value="50" style="--w-slider-pct:50%" id="\${ty_escapeAttr(ty_generateId('0273a79f', 'id'))}" />\`
elements+=\`
      \`
elements+=\`<input class="w-slider w-slider--lg" type="range" value="70" style="--w-slider-pct:70%" id="\${ty_escapeAttr(ty_generateId('3848d902', 'id'))}" />\`
elements+=\`
      \`
elements+=\`<input class="w-slider w-slider--xl" type="range" value="80" style="--w-slider-pct:80%" id="\${ty_escapeAttr(ty_generateId('0a17fb7c', 'id'))}" />\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('ad4a7e3c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('61ad1256', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-slider size="xs" value="20" id="\${ty_escapeAttr(ty_generateId('c5c3d0c7', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
      \`
elements+=\`<w-slider size="sm" value="30" id="\${ty_escapeAttr(ty_generateId('0533c145', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
      \`
elements+=\`<w-slider value="50" id="\${ty_escapeAttr(ty_generateId('fa384a36', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
      \`
elements+=\`<w-slider size="lg" value="70" id="\${ty_escapeAttr(ty_generateId('4f918804', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
      \`
elements+=\`<w-slider size="xl" value="80" id="\${ty_escapeAttr(ty_generateId('320cbfc3', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('8db52842', 'id'))}">\`
elements+=\`Steps\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('2fc46765', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('597a070e', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('87ac7cb9', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6ba7ee8a', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\` to constrain the values.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('e23334b4', 'id'))}">\`
elements+=\`
    \`
elements+=\`<input class="w-slider" type="range" min="0" max="10" step="2" value="6" style="--w-slider-pct:60%" id="\${ty_escapeAttr(ty_generateId('bc768e1c', 'id'))}" />\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('d72eea8b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slider min="0" max="10" step="2" value="6" id="\${ty_escapeAttr(ty_generateId('35fef2e8', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('148d07fb', 'id'))}">\`
elements+=\`Thumb label\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('9f3e6ac5', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('260b962a', 'id'))}">\`
elements+=\`thumb-label\`
elements+=\`</code>\`
elements+=\` to show the value on hover or focus, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('87c4f3d5', 'id'))}">\`
elements+=\`thumb-label="always"\`
elements+=\`</code>\`
elements+=\` to keep the bubble visible.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('d8b7087f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-slider-field w-slider-field--thumb-label w-slider-field--thumb-label-always" id="\${ty_escapeAttr(ty_generateId('e9e7978d', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('b1b26a7f', 'id'))}">\`
elements+=\`Brightness\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-slider-control" style="--value:65%" id="\${ty_escapeAttr(ty_generateId('22cae6a6', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-slider-rail" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('7a046123', 'id'))}">\`
elements+=\`<span class="w-slider-fill" id="\${ty_escapeAttr(ty_generateId('19a4d1f0', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-slider-input" type="range" value="65" aria-label="Brightness" id="\${ty_escapeAttr(ty_generateId('6d5c6d00', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-slider-thumb-label" style="--pos:65%" id="\${ty_escapeAttr(ty_generateId('962743a7', 'id'))}">\`
elements+=\`65\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('dce1b834', 'id'))}">\`
elements+=\`65\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('4f5e8f30', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slider label="Brightness" value="65" thumb-label="always" id="\${ty_escapeAttr(ty_generateId('3dde968f', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('90855c7a', 'id'))}">\`
elements+=\`Ticks\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('e39cf176', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8027d3c1', 'id'))}">\`
elements+=\`ticks\`
elements+=\`</code>\`
elements+=\` to mark every \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('50ab376a', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('842c3604', 'id'))}">\`
elements+=\`tick-labels\`
elements+=\`</code>\`
elements+=\` (pipe-separated) to label each one.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('ff5eb174', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-slider-field" id="\${ty_escapeAttr(ty_generateId('d5f107b3', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('c6b0ddb6', 'id'))}">\`
elements+=\`Rating\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-slider-control" style="--value:50%" id="\${ty_escapeAttr(ty_generateId('9fe0b4a6', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-slider-rail" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('ad3fc510', 'id'))}">\`
elements+=\`<span class="w-slider-fill" id="\${ty_escapeAttr(ty_generateId('68c65b60', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-slider-ticks w-slider-ticks--labelled" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('78dc0014', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-slider-tick" style="--pos:0%" id="\${ty_escapeAttr(ty_generateId('aa510ba7', 'id'))}">\`
elements+=\`<span class="w-slider-tick-label" id="\${ty_escapeAttr(ty_generateId('e76f8565', 'id'))}">\`
elements+=\`None\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-slider-tick" style="--pos:25%" id="\${ty_escapeAttr(ty_generateId('b4f48204', 'id'))}">\`
elements+=\`<span class="w-slider-tick-label" id="\${ty_escapeAttr(ty_generateId('9e33b284', 'id'))}">\`
elements+=\`Low\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-slider-tick" style="--pos:50%" id="\${ty_escapeAttr(ty_generateId('353da603', 'id'))}">\`
elements+=\`<span class="w-slider-tick-label" id="\${ty_escapeAttr(ty_generateId('d64f83c8', 'id'))}">\`
elements+=\`Mid\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-slider-tick" style="--pos:75%" id="\${ty_escapeAttr(ty_generateId('a2500b7e', 'id'))}">\`
elements+=\`<span class="w-slider-tick-label" id="\${ty_escapeAttr(ty_generateId('17acd38b', 'id'))}">\`
elements+=\`High\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-slider-tick" style="--pos:100%" id="\${ty_escapeAttr(ty_generateId('4c114c9c', 'id'))}">\`
elements+=\`<span class="w-slider-tick-label" id="\${ty_escapeAttr(ty_generateId('8c74e730', 'id'))}">\`
elements+=\`Max\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-slider-input" type="range" min="0" max="4" step="1" value="2" aria-label="Rating" id="\${ty_escapeAttr(ty_generateId('6de42194', 'id'))}" />\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('acfef07e', 'id'))}">\`
elements+=\`2\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('b9bea0e5', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slider label="Rating" min="0" max="4" step="1" value="2" tick-labels="None|Low|Mid|High|Max" id="\${ty_escapeAttr(ty_generateId('6236029a', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('248ed553', 'id'))}">\`
elements+=\`Color\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('14ab2d75', 'id'))}">\`
elements+=\`Theme the fill and thumb with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3cb57244', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\`, and the rail with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5d76e711', 'id'))}">\`
elements+=\`track-color\`
elements+=\`</code>\`
elements+=\`, using any token color name.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('558cfeb6', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('13c9a6be', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-field w-slider-field" id="\${ty_escapeAttr(ty_generateId('b633d734', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-slider-control" style="--value:60%;--w-slider-color:var(--w-success)" id="\${ty_escapeAttr(ty_generateId('f083d5c1', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-slider-rail" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('447ebea9', 'id'))}">\`
elements+=\`<span class="w-slider-fill" id="\${ty_escapeAttr(ty_generateId('fb9022ac', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<input class="w-slider-input" type="range" value="60" aria-label="Success" id="\${ty_escapeAttr(ty_generateId('9453706e', 'id'))}" />\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-field w-slider-field" id="\${ty_escapeAttr(ty_generateId('ac387f68', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-slider-control" style="--value:40%;--w-slider-color:var(--w-error)" id="\${ty_escapeAttr(ty_generateId('a680db69', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-slider-rail" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('10acb0e6', 'id'))}">\`
elements+=\`<span class="w-slider-fill" id="\${ty_escapeAttr(ty_generateId('4a5b4fa1', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<input class="w-slider-input" type="range" value="40" aria-label="Error" id="\${ty_escapeAttr(ty_generateId('8408245f', 'id'))}" />\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('f3208a5a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('e7c458f7', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-slider value="60" color="success" id="\${ty_escapeAttr(ty_generateId('7a366994', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
      \`
elements+=\`<w-slider value="40" color="error" id="\${ty_escapeAttr(ty_generateId('02c0fdf9', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('14ec7746', 'id'))}">\`
elements+=\`Disabled &amp; readonly\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('32579ebf', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3d1a217d', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\` dims and freezes the slider; \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('da511ca5', 'id'))}">\`
elements+=\`readonly\`
elements+=\`</code>\`
elements+=\` freezes it without dimming.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('be66a17c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('0a1f8ffa', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-field w-slider-field w-slider-field--disabled" id="\${ty_escapeAttr(ty_generateId('0889f521', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-slider-control" style="--value:50%" id="\${ty_escapeAttr(ty_generateId('a015150f', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-slider-rail" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('e38a5005', 'id'))}">\`
elements+=\`<span class="w-slider-fill" id="\${ty_escapeAttr(ty_generateId('958ce331', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<input class="w-slider-input" type="range" value="50" aria-label="Disabled" disabled="" id="\${ty_escapeAttr(ty_generateId('05531cbb', 'id'))}" />\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-field w-slider-field w-slider-field--readonly" id="\${ty_escapeAttr(ty_generateId('b37d2049', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-slider-control" style="--value:50%" id="\${ty_escapeAttr(ty_generateId('93e23e3d', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-slider-rail" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('22fde915', 'id'))}">\`
elements+=\`<span class="w-slider-fill" id="\${ty_escapeAttr(ty_generateId('914696dd', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<input class="w-slider-input" type="range" value="50" aria-label="Readonly" disabled="" id="\${ty_escapeAttr(ty_generateId('71d84daf', 'id'))}" />\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('da8ee743', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('af89531a', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-slider value="50" disabled="" id="\${ty_escapeAttr(ty_generateId('11b673d3', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
      \`
elements+=\`<w-slider value="50" readonly="" id="\${ty_escapeAttr(ty_generateId('d0ef481b', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('129d4a34', 'id'))}">\`
elements+=\`Vertical\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('b73b86e7', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7b241d32', 'id'))}">\`
elements+=\`direction="vertical"\`
elements+=\`</code>\`
elements+=\` to orient the slider vertically.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('2233d773', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-slider-field w-slider-field--vertical w-slider-field--thumb-label w-slider-field--thumb-label-always" id="\${ty_escapeAttr(ty_generateId('09ed9a67', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-slider-control" style="--value:40%" id="\${ty_escapeAttr(ty_generateId('244ec697', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-slider-rail" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('d9798cac', 'id'))}">\`
elements+=\`<span class="w-slider-fill" id="\${ty_escapeAttr(ty_generateId('d30f2687', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-slider-input" type="range" value="40" aria-label="Level" id="\${ty_escapeAttr(ty_generateId('12ef0dad', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-slider-thumb-label" style="--pos:40%" id="\${ty_escapeAttr(ty_generateId('4de0be45', 'id'))}">\`
elements+=\`40\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('8e19f97c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slider value="40" direction="vertical" thumb-label="always" id="\${ty_escapeAttr(ty_generateId('c806a8d0', 'id'))}">\`
elements+=\`</w-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('918273a9', 'id'))}">\`
elements+=\`Attributes\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('d48974f0', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('3f7d969f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('a8fc0c25', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('88cc2d6d', 'id'))}">\`
elements+=\`Attribute\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('a9c58207', 'id'))}">\`
elements+=\`Type\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('eff6f828', 'id'))}">\`
elements+=\`Default\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('836cf8bb', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('98a8f6c7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('cc4239d0', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('76f01e88', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('827f565b', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8df53d4f', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e37fa4c4', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('07aa1a34', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ef8d2954', 'id'))}">\`
elements+=\`0\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3bb3d37c', 'id'))}">\`
elements+=\`100\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('69963b76', 'id'))}">\`
elements+=\`Track bounds.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('782f78f6', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('31bf4a46', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fef66d02', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('799c9228', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f89a8d33', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5dd9f797', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('96b221e8', 'id'))}">\`
elements+=\`Current value (reflected; also a property).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e7bdb21c', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('626f451c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('92fb42eb', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('288e1819', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('dbccdfb2', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cc5428a3', 'id'))}">\`
elements+=\`1\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e107a331', 'id'))}">\`
elements+=\`Increment between values.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('12df7a63', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('57be3ab5', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9b070673', 'id'))}">\`
elements+=\`label\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f3b20d7b', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9a979cc8', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6bb22007', 'id'))}">\`
elements+=\`Field label.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('197103ac', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('48f0a0dc', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e8f258f5', 'id'))}">\`
elements+=\`hint\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5aa49f09', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('16a7e6cb', 'id'))}">\`
elements+=\`value\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6a375113', 'id'))}">\`
elements+=\`Helper text below the track; defaults to the current value.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('c367a82f', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a13ee933', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('beb0668f', 'id'))}">\`
elements+=\`hide-details\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('414c0c4c', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('cd597274', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6548395b', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('cefcaf32', 'id'))}">\`
elements+=\`Hide the message/value row.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('055e9695', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3e0326d8', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f374ae81', 'id'))}">\`
elements+=\`thumb-label\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fae6733f', 'id'))}">\`
elements+=\`boolean | \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d101c15d', 'id'))}">\`
elements+=\`always\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('90ae5ad9', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d82f8617', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('759dd7ef', 'id'))}">\`
elements+=\`Show a value bubble over the thumb (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ae67e2a5', 'id'))}">\`
elements+=\`always\`
elements+=\`</code>\`
elements+=\` keeps it visible).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('8619745c', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b1cad825', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1a35a163', 'id'))}">\`
elements+=\`ticks\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7ab1a035', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d003fd76', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bb553ec7', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('19045788', 'id'))}">\`
elements+=\`Draw a tick at every \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9316054d', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('fa83c356', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b69dfbd6', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2d47efb8', 'id'))}">\`
elements+=\`tick-labels\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('cf11249d', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1beb1a4e', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('cd1eb360', 'id'))}">\`
elements+=\`Pipe-separated labels placed at each step (implies \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8d3bd919', 'id'))}">\`
elements+=\`ticks\`
elements+=\`</code>\`
elements+=\`).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('654e0a01', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('390a6dcc', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('275b9173', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4e0352a1', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('207ad005', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f1b447dd', 'id'))}">\`
elements+=\`primary\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b2e73a69', 'id'))}">\`
elements+=\`Token color for the fill and thumb.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('4511d50e', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('cfc41659', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1a199846', 'id'))}">\`
elements+=\`track-color\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e4d77bed', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('164d136c', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('725bfc22', 'id'))}">\`
elements+=\`Token color for the unfilled rail.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('36da753e', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('859c367e', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fc87828b', 'id'))}">\`
elements+=\`direction\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c4380c2d', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4e837304', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('90888f46', 'id'))}">\`
elements+=\`horizontal\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('11445d5f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('02a9cad7', 'id'))}">\`
elements+=\`horizontal\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('26d99f42', 'id'))}">\`
elements+=\`vertical\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('b9852fb7', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2661959c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d0279f56', 'id'))}">\`
elements+=\`reverse\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5d993ed4', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b1d017e9', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('99b6a495', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('df7e84e5', 'id'))}">\`
elements+=\`Flip the track so the max is at the start.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('6815a3ea', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2900e009', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9dcce27f', 'id'))}">\`
elements+=\`size\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9a32c4ee', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('804eac11', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('46851f39', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9cb10e92', 'id'))}">\`
elements+=\`xs\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('88a3645c', 'id'))}">\`
elements+=\`sm\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('55935a79', 'id'))}">\`
elements+=\`lg\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6d30657e', 'id'))}">\`
elements+=\`xl\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('04e3786c', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c7ec1093', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5904ba44', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ce60df9a', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fe6f1e07', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c9148dce', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5f45eb4a', 'id'))}">\`
elements+=\`Non-interactive and dimmed.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('66c35b7f', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('af315671', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('98901cb4', 'id'))}">\`
elements+=\`readonly\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('da8cc6cc', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d468244b', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0ddb9fe3', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2ed7821d', 'id'))}">\`
elements+=\`Non-interactive without dimming.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('4f0e0c45', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c708e2e0', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b1748253', 'id'))}">\`
elements+=\`name\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c65f7659', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c759936b', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2872f3e3', 'id'))}">\`
elements+=\`Form field name.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('a0a566a2', 'id'))}">\`
elements+=\`Events\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('dd7017b8', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('b211c96e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('cda86054', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('b2b7cc77', 'id'))}">\`
elements+=\`Event\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('8dad2dd2', 'id'))}">\`
elements+=\`Detail\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('0d7f10e0', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('f183689b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('4419f162', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('13a1bfd1', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('01ebf076', 'id'))}">\`
elements+=\`input\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a61870aa', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('41f7cad1', 'id'))}">\`
elements+=\`&#123; value, name &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3f9cd14b', 'id'))}">\`
elements+=\`Fired while dragging.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('31ff6e29', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('82c3f404', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f615d06d', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2323258b', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('17464454', 'id'))}">\`
elements+=\`&#123; value, name &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f21c2d85', 'id'))}">\`
elements+=\`Fired when the thumb is released.\`
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
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/slider/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
