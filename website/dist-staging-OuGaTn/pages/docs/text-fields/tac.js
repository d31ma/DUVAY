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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('31cf8465', 'id'))}">\`
elements+=\`Text fields\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('121ed017', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('002c98b9', 'id'))}">\`
elements+=\`w-text-field\`
elements+=\`</code>\`
elements+=\` is the full single-line control, mirroring Vuetify&#8217;s \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c38795a0', 'id'))}">\`
elements+=\`v-text-field\`
elements+=\`</code>\`
elements+=\`: a floating label, five variants, density, prefix/suffix, inner slots, clearable, a character counter, a loading bar, and the native HTML5 validation attributes. The web component writes the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e9b36f37', 'id'))}">\`
elements+=\`.w-text-field-*\`
elements+=\`</code>\`
elements+=\` markup shown in the CSS panes. For a bare styled input, see \`
elements+=\`<a href="/docs/inputs" id="\${ty_escapeAttr(ty_generateId('0c08fb38', 'id'))}">\`
elements+=\`inputs\`
elements+=\`</a>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('23157f4a', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('8c77fb40', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--density-default w-text-field--floating" id="\${ty_escapeAttr(ty_generateId('2d47fc1c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('caf24b1b', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('e50ef57f', 'id'))}">\`
elements+=\`<input class="w-text-field-input" type="text" placeholder=" " id="\${ty_escapeAttr(ty_generateId('92a5ed7f', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('f3c0a4f2', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('a7f88563', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-text-field label="Name" placeholder="Jane Doe" id="\${ty_escapeAttr(ty_generateId('2a1bc35a', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('9c38b1ad', 'id'))}">\`
elements+=\`Variants\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('0efb68e1', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('11471324', 'id'))}">\`
elements+=\`variant\`
elements+=\`</code>\`
elements+=\` to \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c27565c5', 'id'))}">\`
elements+=\`outlined\`
elements+=\`</code>\`
elements+=\` (default), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a4305bb6', 'id'))}">\`
elements+=\`filled\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cd9eadfa', 'id'))}">\`
elements+=\`underlined\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8b73a403', 'id'))}">\`
elements+=\`plain\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('062166dd', 'id'))}">\`
elements+=\`solo\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('1b602189', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('0dfac770', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('98498df5', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('b62acd3e', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('9d22b5d1', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="Outlined" placeholder=" " id="\${ty_escapeAttr(ty_generateId('d07cbcba', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('9e1c562a', 'id'))}">\`
elements+=\`Outlined\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--filled w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('d42f7501', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('4935e924', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('bbb3491c', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="Filled" placeholder=" " id="\${ty_escapeAttr(ty_generateId('b1e5d91c', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('f4d6833d', 'id'))}">\`
elements+=\`Filled\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--underlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('453bd437', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('41c784b6', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('4455fbfa', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="Underlined" placeholder=" " id="\${ty_escapeAttr(ty_generateId('a9e668af', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('0bb667e2', 'id'))}">\`
elements+=\`Underlined\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--plain w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('dd504088', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('f8172317', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('1895dff7', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="Plain" placeholder=" " id="\${ty_escapeAttr(ty_generateId('e5df4648', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('0896c965', 'id'))}">\`
elements+=\`Plain\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--solo" id="\${ty_escapeAttr(ty_generateId('3200fd29', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('0dd05944', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('474629ae', 'id'))}">\`
elements+=\`<input class="w-text-field-input" placeholder="Solo (search)" aria-label="Solo (search)" id="\${ty_escapeAttr(ty_generateId('43714fa0', 'id'))}" />\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('114b7d86', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('37980200', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-text-field variant="outlined" label="Outlined" value="Outlined" id="\${ty_escapeAttr(ty_generateId('23587e91', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field variant="filled" label="Filled" value="Filled" id="\${ty_escapeAttr(ty_generateId('82e7d8c0', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field variant="underlined" label="Underlined" value="Underlined" id="\${ty_escapeAttr(ty_generateId('825176ee', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field variant="plain" label="Plain" value="Plain" id="\${ty_escapeAttr(ty_generateId('9d915757', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field variant="solo" label="Solo (search)" id="\${ty_escapeAttr(ty_generateId('a8adbe22', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('934ee30f', 'id'))}">\`
elements+=\`Input types\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('111f949f', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4bdae36a', 'id'))}">\`
elements+=\`type\`
elements+=\`</code>\`
elements+=\` to any native value &#8212; \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('58637935', 'id'))}">\`
elements+=\`email\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f907adce', 'id'))}">\`
elements+=\`password\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('61138e1c', 'id'))}">\`
elements+=\`url\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8106e15e', 'id'))}">\`
elements+=\`tel\`
elements+=\`</code>\`
elements+=\`, and more.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('63aebd73', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--floating" id="\${ty_escapeAttr(ty_generateId('824b1676', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('f3cc990f', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('60e2a49c', 'id'))}">\`
elements+=\`<input class="w-text-field-input" type="email" placeholder=" " id="\${ty_escapeAttr(ty_generateId('656e5e4d', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('786648da', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('1723762f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('3593add7', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row id="\${ty_escapeAttr(ty_generateId('0327a580', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="6" id="\${ty_escapeAttr(ty_generateId('9c6f7c20', 'id'))}">\`
elements+=\`<w-text-field label="Email" type="email" placeholder="you@example.com" hint="We'll never share your email." persistent-hint="" id="\${ty_escapeAttr(ty_generateId('e8b61b7d', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="6" id="\${ty_escapeAttr(ty_generateId('0f255873', 'id'))}">\`
elements+=\`<w-text-field label="Password" type="password" value="secret" id="\${ty_escapeAttr(ty_generateId('1a4f7265', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="6" id="\${ty_escapeAttr(ty_generateId('dd0ded95', 'id'))}">\`
elements+=\`<w-text-field label="URL" type="url" value="https://delma.dev" id="\${ty_escapeAttr(ty_generateId('3a5038eb', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="6" id="\${ty_escapeAttr(ty_generateId('95fe1439', 'id'))}">\`
elements+=\`<w-text-field label="Phone" type="tel" placeholder="+1 555 0100" id="\${ty_escapeAttr(ty_generateId('51c2c5c1', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('49823d65', 'id'))}">\`
elements+=\`Density &amp; sizes\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('e3475915', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0a134eae', 'id'))}">\`
elements+=\`density\`
elements+=\`</code>\`
elements+=\` tightens vertical rhythm; \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('95fd7a30', 'id'))}">\`
elements+=\`size\`
elements+=\`</code>\`
elements+=\` scales the whole control.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('eb3c543b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('377fc6f1', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--density-compact w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('2c88298d', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('db786329', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('f46dde96', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="Compact" placeholder=" " id="\${ty_escapeAttr(ty_generateId('545e1e2e', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('90d6e35c', 'id'))}">\`
elements+=\`Compact\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--lg w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('da17c663', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('222d2bdf', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('78baea54', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="Large" placeholder=" " id="\${ty_escapeAttr(ty_generateId('b9f58d12', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('bdd7e4aa', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('e2aa7fd5', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('0d475a1e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-text-field density="compact" label="Compact" id="\${ty_escapeAttr(ty_generateId('dcb60912', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field density="comfortable" label="Comfortable" id="\${ty_escapeAttr(ty_generateId('29e461e6', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field label="Default" id="\${ty_escapeAttr(ty_generateId('8e90f848', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field size="lg" label="Large" id="\${ty_escapeAttr(ty_generateId('8602943b', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('7a304092', 'id'))}">\`
elements+=\`Prefix, suffix &amp; inner content\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d29ede39', 'id'))}">\`
elements+=\`Add static \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('86cd0ff7', 'id'))}">\`
elements+=\`prefix\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('43bce609', 'id'))}">\`
elements+=\`suffix\`
elements+=\`</code>\`
elements+=\` text, name icons with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('282bd548', 'id'))}">\`
elements+=\`prepend-inner-icon\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f07b01e6', 'id'))}">\`
elements+=\`append-inner-icon\`
elements+=\`</code>\`
elements+=\` (resolved through the icon registry), or drop arbitrary content into the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('16b620bc', 'id'))}">\`
elements+=\`prepend-inner\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('455f18b4', 'id'))}">\`
elements+=\`append-inner\`
elements+=\`</code>\`
elements+=\` slots.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('019c77d0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('c0bd6535', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('588d209e', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('330e2ebe', 'id'))}">\`
elements+=\`<span class="w-text-field-affix w-text-field-prefix" id="\${ty_escapeAttr(ty_generateId('372e36dc', 'id'))}">\`
elements+=\`$\`
elements+=\`</span>\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('48a2dbb5', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="49.00" placeholder=" " id="\${ty_escapeAttr(ty_generateId('4434feb4', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('fd30c890', 'id'))}">\`
elements+=\`Amount\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`<span class="w-text-field-affix w-text-field-suffix" id="\${ty_escapeAttr(ty_generateId('b8d6288c', 'id'))}">\`
elements+=\`USD\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('32278ee3', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('5faad52c', 'id'))}">\`
elements+=\`<span class="w-text-field-prepend-inner" id="\${ty_escapeAttr(ty_generateId('9c5e28bf', 'id'))}">\`
elements+=\`<span class="w-icon w-text-field-icon" id="\${ty_escapeAttr(ty_generateId('c4db27a4', 'id'))}">\`
elements+=\`\uD83D\uDD0D\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('fa34a5e4', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="duvay" placeholder=" " id="\${ty_escapeAttr(ty_generateId('20418913', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('06a44e77', 'id'))}">\`
elements+=\`Search\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`<span class="w-text-field-append-inner" id="\${ty_escapeAttr(ty_generateId('3e9fcfd2', 'id'))}">\`
elements+=\`<span class="w-icon w-text-field-icon" id="\${ty_escapeAttr(ty_generateId('45fe3d9c', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('4024235e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('bd2931b0', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-text-field label="Amount" prefix="$" suffix="USD" value="49.00" id="\${ty_escapeAttr(ty_generateId('15c6f9c9', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field label="Search" value="duvay" prepend-inner-icon="\uD83D\uDD0D" append-inner-icon="↗" id="\${ty_escapeAttr(ty_generateId('e0234840', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field label="With slot" placeholder="Custom slotted content" variant="solo" id="\${ty_escapeAttr(ty_generateId('0468b35a', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span slot="prepend-inner" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('078ee23c', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('3f124baf', 'id'))}">\`
elements+=\`Clearable\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('00226947', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a387777f', 'id'))}">\`
elements+=\`clearable\`
elements+=\`</code>\`
elements+=\` for a clear button that appears once there&#8217;s a value.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('28108e82', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('4719a34d', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('ca8143bd', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('709937f0', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="design, css" placeholder=" " id="\${ty_escapeAttr(ty_generateId('0d244434', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('77b3b2ae', 'id'))}">\`
elements+=\`Tags\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`<button type="button" class="w-text-field-clear" tabindex="-1" aria-label="Clear" id="\${ty_escapeAttr(ty_generateId('a0d965b8', 'id'))}">\`
elements+=\`&times;\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('408057de', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-text-field label="Tags" value="design, css" clearable="" id="\${ty_escapeAttr(ty_generateId('4290712d', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('e9d4d237', 'id'))}">\`
elements+=\`Counter\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('e750df2c', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('66127fe0', 'id'))}">\`
elements+=\`counter\`
elements+=\`</code>\`
elements+=\` (with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('12a4c8b8', 'id'))}">\`
elements+=\`maxlength\`
elements+=\`</code>\`
elements+=\`) to show how many characters have been typed.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('44aaef7e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('f4d7c73e', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('3e130418', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('9319f267', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="Designer &amp; developer" maxlength="50" placeholder=" " id="\${ty_escapeAttr(ty_generateId('351d3027', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('cb17da33', 'id'))}">\`
elements+=\`Bio\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`<div class="w-text-field-details" id="\${ty_escapeAttr(ty_generateId('a14bd553', 'id'))}">\`
elements+=\`<span class="w-text-field-messages" id="\${ty_escapeAttr(ty_generateId('78521f61', 'id'))}">\`
elements+=\`</span>\`
elements+=\`<span class="w-text-field-counter" id="\${ty_escapeAttr(ty_generateId('bec47749', 'id'))}">\`
elements+=\`20 / 50\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('e48081d4', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-text-field label="Bio" counter="" maxlength="50" value="Designer &amp; developer" id="\${ty_escapeAttr(ty_generateId('6486a4d4', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('fe037a0e', 'id'))}">\`
elements+=\`Loading\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('9c6f9aa1', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('eeb083ac', 'id'))}">\`
elements+=\`loading\`
elements+=\`</code>\`
elements+=\` to show an indeterminate bar along the bottom edge while a request is in flight.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('8eca578d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--loading w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('36b0a926', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('63005a75', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('52964fe3', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="duvay" placeholder=" " id="\${ty_escapeAttr(ty_generateId('e536b666', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('e13f9231', 'id'))}">\`
elements+=\`Checking availability…\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`<span class="w-text-field-loader" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('5300c8a8', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('6f49ee15', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-text-field label="Checking availability…" value="duvay" loading="" id="\${ty_escapeAttr(ty_generateId('1b7cffca', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('df6016b9', 'id'))}">\`
elements+=\`States\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('80dccca9', 'id'))}">\`
elements+=\`Hints appear on focus (or always with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('91386ffd', 'id'))}">\`
elements+=\`persistent-hint\`
elements+=\`</code>\`
elements+=\`); \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('000a8b89', 'id'))}">\`
elements+=\`error\`
elements+=\`</code>\`
elements+=\` tints the control and replaces the hint.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('63218e7c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('26a8d072', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--disabled w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('f73e445f', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('6a643ed7', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('3df4bbe7', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="Can't touch this" disabled="" placeholder=" " id="\${ty_escapeAttr(ty_generateId('80eaf586', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('55025ae0', 'id'))}">\`
elements+=\`Disabled\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--error w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('41ac186a', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('ed435636', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('8e28b187', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="bad-email" aria-invalid="true" placeholder=" " id="\${ty_escapeAttr(ty_generateId('23e9502f', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('5bf6a33a', 'id'))}">\`
elements+=\`Email\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`<div class="w-text-field-details" id="\${ty_escapeAttr(ty_generateId('32e94ad9', 'id'))}">\`
elements+=\`<span class="w-text-field-messages" id="\${ty_escapeAttr(ty_generateId('62f24ec2', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('675664ae', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('525ccfe5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-text-field label="Disabled" value="Can't touch this" disabled="" id="\${ty_escapeAttr(ty_generateId('66044c5f', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field label="Read-only" value="Locked" readonly="" id="\${ty_escapeAttr(ty_generateId('8e7604ed', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field label="Email" value="bad-email" error="Invalid email format." id="\${ty_escapeAttr(ty_generateId('948fe01c', 'id'))}">\`
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

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/text-fields/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
