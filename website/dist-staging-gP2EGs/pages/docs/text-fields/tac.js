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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('0e0f1501', 'id'))}">\`
elements+=\`Text fields\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('a0a41b71', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('716558b9', 'id'))}">\`
elements+=\`w-text-field\`
elements+=\`</code>\`
elements+=\` is the full single-line control, mirroring Vuetify&#8217;s \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6708fd28', 'id'))}">\`
elements+=\`v-text-field\`
elements+=\`</code>\`
elements+=\`: a floating label, five variants, density, prefix/suffix, inner slots, clearable, a character counter, a loading bar, and the native HTML5 validation attributes. The web component writes the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8c4578c8', 'id'))}">\`
elements+=\`.w-text-field-*\`
elements+=\`</code>\`
elements+=\` markup shown in the CSS panes. For a bare styled input, see \`
elements+=\`<a href="/docs/inputs" id="\${ty_escapeAttr(ty_generateId('f1aca205', 'id'))}">\`
elements+=\`inputs\`
elements+=\`</a>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('42866a38', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('d24db242', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--density-default w-text-field--floating" id="\${ty_escapeAttr(ty_generateId('f2e2b3c7', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('4ba82b3f', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('754ed77e', 'id'))}">\`
elements+=\`<input class="w-text-field-input" type="text" placeholder=" " id="\${ty_escapeAttr(ty_generateId('efd9790d', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('e2130013', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('08df9d21', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-text-field label="Name" placeholder="Jane Doe" id="\${ty_escapeAttr(ty_generateId('7ec1ffbd', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('85b9e303', 'id'))}">\`
elements+=\`Variants\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('1924ddd7', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5f3712da', 'id'))}">\`
elements+=\`variant\`
elements+=\`</code>\`
elements+=\` to \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0903ffca', 'id'))}">\`
elements+=\`outlined\`
elements+=\`</code>\`
elements+=\` (default), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0ebafde6', 'id'))}">\`
elements+=\`filled\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f4716bae', 'id'))}">\`
elements+=\`underlined\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('18ed8653', 'id'))}">\`
elements+=\`plain\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ce500552', 'id'))}">\`
elements+=\`solo\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('a6351ba6', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('220d2a05', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('14ae0cb9', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('bdcc07fe', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('f3ce3781', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="Outlined" placeholder=" " id="\${ty_escapeAttr(ty_generateId('41998bf6', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('34138f85', 'id'))}">\`
elements+=\`Outlined\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--filled w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('9d55c114', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('7cd7729b', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('3cf9a1ae', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="Filled" placeholder=" " id="\${ty_escapeAttr(ty_generateId('3782bf83', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('8fa7b03b', 'id'))}">\`
elements+=\`Filled\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--underlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('b7e634fe', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('62983095', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('65eb33c3', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="Underlined" placeholder=" " id="\${ty_escapeAttr(ty_generateId('c6db5882', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('7f45d274', 'id'))}">\`
elements+=\`Underlined\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--plain w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('f932a800', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('123d1c0a', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('81864c49', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="Plain" placeholder=" " id="\${ty_escapeAttr(ty_generateId('ffd18e6b', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('6e532821', 'id'))}">\`
elements+=\`Plain\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--solo" id="\${ty_escapeAttr(ty_generateId('972d3841', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('2596aeb9', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('e0f7576b', 'id'))}">\`
elements+=\`<input class="w-text-field-input" placeholder="Solo (search)" aria-label="Solo (search)" id="\${ty_escapeAttr(ty_generateId('3e8ba28e', 'id'))}" />\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('d06b10ee', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('0cf662cd', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-text-field variant="outlined" label="Outlined" value="Outlined" id="\${ty_escapeAttr(ty_generateId('b940196c', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field variant="filled" label="Filled" value="Filled" id="\${ty_escapeAttr(ty_generateId('a0dafa35', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field variant="underlined" label="Underlined" value="Underlined" id="\${ty_escapeAttr(ty_generateId('fd13d49a', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field variant="plain" label="Plain" value="Plain" id="\${ty_escapeAttr(ty_generateId('1cdbb559', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field variant="solo" label="Solo (search)" id="\${ty_escapeAttr(ty_generateId('8f405a69', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('2e485556', 'id'))}">\`
elements+=\`Input types\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('0dacfc61', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b3aae117', 'id'))}">\`
elements+=\`type\`
elements+=\`</code>\`
elements+=\` to any native value &#8212; \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f2e8c121', 'id'))}">\`
elements+=\`email\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('57e1c76a', 'id'))}">\`
elements+=\`password\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2fa5cb42', 'id'))}">\`
elements+=\`url\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4119766e', 'id'))}">\`
elements+=\`tel\`
elements+=\`</code>\`
elements+=\`, and more.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('069de4f5', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--floating" id="\${ty_escapeAttr(ty_generateId('a34fb1b3', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('63706396', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('d69ecc3f', 'id'))}">\`
elements+=\`<input class="w-text-field-input" type="email" placeholder=" " id="\${ty_escapeAttr(ty_generateId('c60aacf4', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('837c30ff', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('ae39b6a8', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('d514ac4a', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row id="\${ty_escapeAttr(ty_generateId('c908e338', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="6" id="\${ty_escapeAttr(ty_generateId('70863b7b', 'id'))}">\`
elements+=\`<w-text-field label="Email" type="email" placeholder="you@example.com" hint="We'll never share your email." persistent-hint="" id="\${ty_escapeAttr(ty_generateId('f6d4e940', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="6" id="\${ty_escapeAttr(ty_generateId('a9f2f79d', 'id'))}">\`
elements+=\`<w-text-field label="Password" type="password" value="secret" id="\${ty_escapeAttr(ty_generateId('3f7fa628', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="6" id="\${ty_escapeAttr(ty_generateId('e6c00d47', 'id'))}">\`
elements+=\`<w-text-field label="URL" type="url" value="https://delma.dev" id="\${ty_escapeAttr(ty_generateId('66b70414', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="6" id="\${ty_escapeAttr(ty_generateId('fe82ef43', 'id'))}">\`
elements+=\`<w-text-field label="Phone" type="tel" placeholder="+1 555 0100" id="\${ty_escapeAttr(ty_generateId('70ae9648', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('b245219e', 'id'))}">\`
elements+=\`Density &amp; sizes\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('22a7bc58', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c56830cb', 'id'))}">\`
elements+=\`density\`
elements+=\`</code>\`
elements+=\` tightens vertical rhythm; \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('931f2e1c', 'id'))}">\`
elements+=\`size\`
elements+=\`</code>\`
elements+=\` scales the whole control.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('0d09e2be', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('39226972', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--density-compact w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('a7f6d969', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('4d8b7975', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('71d2bd8b', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="Compact" placeholder=" " id="\${ty_escapeAttr(ty_generateId('ef9f29eb', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('4da7072c', 'id'))}">\`
elements+=\`Compact\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--lg w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('b27d9d83', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('ebe77e89', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('0d70d05b', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="Large" placeholder=" " id="\${ty_escapeAttr(ty_generateId('4b61ed5a', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('e78415d0', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('31a99646', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('40592216', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-text-field density="compact" label="Compact" id="\${ty_escapeAttr(ty_generateId('89b4d33f', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field density="comfortable" label="Comfortable" id="\${ty_escapeAttr(ty_generateId('cee6df78', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field label="Default" id="\${ty_escapeAttr(ty_generateId('4040b6a9', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field size="lg" label="Large" id="\${ty_escapeAttr(ty_generateId('4711f40e', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('ac5b11a4', 'id'))}">\`
elements+=\`Prefix, suffix &amp; inner content\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d5d2a0ff', 'id'))}">\`
elements+=\`Add static \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3e18ebbe', 'id'))}">\`
elements+=\`prefix\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f96d944e', 'id'))}">\`
elements+=\`suffix\`
elements+=\`</code>\`
elements+=\` text, name icons with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9b7e8840', 'id'))}">\`
elements+=\`prepend-inner-icon\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('89c98916', 'id'))}">\`
elements+=\`append-inner-icon\`
elements+=\`</code>\`
elements+=\` (resolved through the icon registry), or drop arbitrary content into the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e5e06cfa', 'id'))}">\`
elements+=\`prepend-inner\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('966cd226', 'id'))}">\`
elements+=\`append-inner\`
elements+=\`</code>\`
elements+=\` slots.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('dfc72a49', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('1caaee2f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('a1df4709', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('3cc64f5c', 'id'))}">\`
elements+=\`<span class="w-text-field-affix w-text-field-prefix" id="\${ty_escapeAttr(ty_generateId('e339a4eb', 'id'))}">\`
elements+=\`$\`
elements+=\`</span>\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('985e66c8', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="49.00" placeholder=" " id="\${ty_escapeAttr(ty_generateId('59ec92de', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('acf348e7', 'id'))}">\`
elements+=\`Amount\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`<span class="w-text-field-affix w-text-field-suffix" id="\${ty_escapeAttr(ty_generateId('ea5dd7ba', 'id'))}">\`
elements+=\`USD\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('9f788d0a', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('615e49fb', 'id'))}">\`
elements+=\`<span class="w-text-field-prepend-inner" id="\${ty_escapeAttr(ty_generateId('b2fa001a', 'id'))}">\`
elements+=\`<span class="w-icon w-text-field-icon" id="\${ty_escapeAttr(ty_generateId('87837e90', 'id'))}">\`
elements+=\`\uD83D\uDD0D\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('989adcc9', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="duvay" placeholder=" " id="\${ty_escapeAttr(ty_generateId('b957b0f6', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('c36970a3', 'id'))}">\`
elements+=\`Search\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`<span class="w-text-field-append-inner" id="\${ty_escapeAttr(ty_generateId('4bca2a3c', 'id'))}">\`
elements+=\`<span class="w-icon w-text-field-icon" id="\${ty_escapeAttr(ty_generateId('200080b6', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('2ee15c01', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('e660c225', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-text-field label="Amount" prefix="$" suffix="USD" value="49.00" id="\${ty_escapeAttr(ty_generateId('42db4ac3', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field label="Search" value="duvay" prepend-inner-icon="\uD83D\uDD0D" append-inner-icon="↗" id="\${ty_escapeAttr(ty_generateId('68a8b345', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field label="With slot" placeholder="Custom slotted content" variant="solo" id="\${ty_escapeAttr(ty_generateId('31e48242', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span slot="prepend-inner" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('482602c1', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('3699bd84', 'id'))}">\`
elements+=\`Clearable\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('adf41949', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8a9359bb', 'id'))}">\`
elements+=\`clearable\`
elements+=\`</code>\`
elements+=\` for a clear button that appears once there&#8217;s a value.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('e87c94a9', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('053c14f6', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('bc397ed4', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('9c364269', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="design, css" placeholder=" " id="\${ty_escapeAttr(ty_generateId('526fcd49', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('d8e1e446', 'id'))}">\`
elements+=\`Tags\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`<button type="button" class="w-text-field-clear" tabindex="-1" aria-label="Clear" id="\${ty_escapeAttr(ty_generateId('911538f8', 'id'))}">\`
elements+=\`&times;\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('15a502a5', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-text-field label="Tags" value="design, css" clearable="" id="\${ty_escapeAttr(ty_generateId('129157c6', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('a13a654d', 'id'))}">\`
elements+=\`Counter\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('a20ba662', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('89a95787', 'id'))}">\`
elements+=\`counter\`
elements+=\`</code>\`
elements+=\` (with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('951c25f7', 'id'))}">\`
elements+=\`maxlength\`
elements+=\`</code>\`
elements+=\`) to show how many characters have been typed.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('dcfdb398', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('711bc711', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('8e2728dd', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('3ee302e1', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="Designer &amp; developer" maxlength="50" placeholder=" " id="\${ty_escapeAttr(ty_generateId('9b592be2', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('05254238', 'id'))}">\`
elements+=\`Bio\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`<div class="w-text-field-details" id="\${ty_escapeAttr(ty_generateId('7bab5091', 'id'))}">\`
elements+=\`<span class="w-text-field-messages" id="\${ty_escapeAttr(ty_generateId('8f66639a', 'id'))}">\`
elements+=\`</span>\`
elements+=\`<span class="w-text-field-counter" id="\${ty_escapeAttr(ty_generateId('a86fa571', 'id'))}">\`
elements+=\`20 / 50\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('2351090e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-text-field label="Bio" counter="" maxlength="50" value="Designer &amp; developer" id="\${ty_escapeAttr(ty_generateId('e6f78600', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('1b90c2fa', 'id'))}">\`
elements+=\`Loading\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('8bb54eb7', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6b171683', 'id'))}">\`
elements+=\`loading\`
elements+=\`</code>\`
elements+=\` to show an indeterminate bar along the bottom edge while a request is in flight.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('53e9216f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--loading w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('f2bb3280', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('a60936f6', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('92a1d599', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="duvay" placeholder=" " id="\${ty_escapeAttr(ty_generateId('c74741da', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('223ce59d', 'id'))}">\`
elements+=\`Checking availability…\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`<span class="w-text-field-loader" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('b50df240', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('b357e46b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-text-field label="Checking availability…" value="duvay" loading="" id="\${ty_escapeAttr(ty_generateId('50132f12', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('5370f366', 'id'))}">\`
elements+=\`States\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('2d657daa', 'id'))}">\`
elements+=\`Hints appear on focus (or always with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a3ba6a30', 'id'))}">\`
elements+=\`persistent-hint\`
elements+=\`</code>\`
elements+=\`); \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('563186bc', 'id'))}">\`
elements+=\`error\`
elements+=\`</code>\`
elements+=\` tints the control and replaces the hint.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('fc4ab8c1', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('9c75ed06', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--disabled w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('7e5e4a4f', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('26d51c18', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('15e409d5', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="Can't touch this" disabled="" placeholder=" " id="\${ty_escapeAttr(ty_generateId('563efb84', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('251e8a68', 'id'))}">\`
elements+=\`Disabled\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--outlined w-text-field--error w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('cef3bf0a', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('329d8536', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('75d5b004', 'id'))}">\`
elements+=\`<input class="w-text-field-input" value="bad-email" aria-invalid="true" placeholder=" " id="\${ty_escapeAttr(ty_generateId('c0838a54', 'id'))}" />\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('7e85ed19', 'id'))}">\`
elements+=\`Email\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`<div class="w-text-field-details" id="\${ty_escapeAttr(ty_generateId('ef9de710', 'id'))}">\`
elements+=\`<span class="w-text-field-messages" id="\${ty_escapeAttr(ty_generateId('fbc9d0cc', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('3713b854', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('a5f640bc', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-text-field label="Disabled" value="Can't touch this" disabled="" id="\${ty_escapeAttr(ty_generateId('74d7067d', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field label="Read-only" value="Locked" readonly="" id="\${ty_escapeAttr(ty_generateId('64a6a9e5', 'id'))}">\`
elements+=\`</w-text-field>\`
elements+=\`
      \`
elements+=\`<w-text-field label="Email" value="bad-email" error="Invalid email format." id="\${ty_escapeAttr(ty_generateId('f33b825a', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('308a0541', 'id'))}">\`
elements+=\`Attributes\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('86d6eb53', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('e4f2ab6a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('ab0c3219', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('b63f42a6', 'id'))}">\`
elements+=\`Attribute\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('da3be09e', 'id'))}">\`
elements+=\`Type\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('b7b3d9e4', 'id'))}">\`
elements+=\`Default\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('bf07c7b7', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('a3611aee', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('3b91c348', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('db1d841e', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('510677c5', 'id'))}">\`
elements+=\`type\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('99caf364', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e294d404', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('311f56ca', 'id'))}">\`
elements+=\`text\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fb1e93ac', 'id'))}">\`
elements+=\`Any native input type.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('fc0c0d11', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e46f7efb', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('348bc6ee', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9423ef9b', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('61462711', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('985e7587', 'id'))}">\`
elements+=\`Current value (reflected; also a property).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('8bff88f9', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('091e3ea1', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a3ae0b4d', 'id'))}">\`
elements+=\`label\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c21bf7a4', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3bce2dce', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d1f2cf6e', 'id'))}">\`
elements+=\`Floating label.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('cff0bcea', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ab3d3628', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e714f5b5', 'id'))}">\`
elements+=\`placeholder\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('48ebd3e4', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1c6b6e70', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('907cb29a', 'id'))}">\`
elements+=\`Placeholder text.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('20f4010e', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ed74bcc5', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c0d68da8', 'id'))}">\`
elements+=\`variant\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('70069399', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8759427b', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c56850f3', 'id'))}">\`
elements+=\`outlined\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8b8584d1', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cc90bd69', 'id'))}">\`
elements+=\`outlined\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('75a04a6c', 'id'))}">\`
elements+=\`filled\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('766d6870', 'id'))}">\`
elements+=\`underlined\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('aa376d7c', 'id'))}">\`
elements+=\`plain\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('54a3b3ba', 'id'))}">\`
elements+=\`solo\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('b577355b', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4931fdf8', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6b4c6b21', 'id'))}">\`
elements+=\`density\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2c11fbbf', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('06ef27e8', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dabdf70a', 'id'))}">\`
elements+=\`default\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('acc350c0', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bfc4e1ff', 'id'))}">\`
elements+=\`default\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('01fb4502', 'id'))}">\`
elements+=\`comfortable\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b092fe05', 'id'))}">\`
elements+=\`compact\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('8962c760', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('209bedde', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8b7f930c', 'id'))}">\`
elements+=\`size\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7f13a334', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1f1ba45d', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a667e9b6', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7da65a95', 'id'))}">\`
elements+=\`xs\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('746816f7', 'id'))}">\`
elements+=\`sm\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b236ba43', 'id'))}">\`
elements+=\`lg\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ba454b5d', 'id'))}">\`
elements+=\`xl\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('17a9e1a7', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9499a8c8', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8f9e40bb', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d2d30ee9', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0388fb4c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('67b6957b', 'id'))}">\`
elements+=\`primary\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b0e34d60', 'id'))}">\`
elements+=\`Token color for the focus accent.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('cc5d860b', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e354be24', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3a05c213', 'id'))}">\`
elements+=\`prefix\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a6cb4086', 'id'))}">\`
elements+=\`suffix\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('342ff5de', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('da51959c', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6a79dfd0', 'id'))}">\`
elements+=\`Static text inside the control.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('6988f372', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d2b1e918', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('111dc8fd', 'id'))}">\`
elements+=\`prepend-inner-icon\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5842ba47', 'id'))}">\`
elements+=\`append-inner-icon\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4f1b2445', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d143f67d', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9ee5b849', 'id'))}">\`
elements+=\`Icon names resolved through the icon registry, rendered inside the control.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('ca3f2486', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5c217faf', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a98131a1', 'id'))}">\`
elements+=\`icon-set\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d458d109', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7ec3a461', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('446028cf', 'id'))}">\`
elements+=\`Icon set prefix for the icon attributes.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2b0bcbd9', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('54c5b0e6', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ed54876f', 'id'))}">\`
elements+=\`clearable\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c1b314d1', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6f999a2a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7df0fc9c', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ffa0c7ee', 'id'))}">\`
elements+=\`Show a clear (×) button when non-empty.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('923364af', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fb8898aa', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('57bc85f1', 'id'))}">\`
elements+=\`counter\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('400f791b', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('dc50b18b', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ef2a26d8', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2fe55af8', 'id'))}">\`
elements+=\`Show a character counter; pairs with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b2dda4b4', 'id'))}">\`
elements+=\`maxlength\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('5a70f709', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f87b5626', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('210c46d8', 'id'))}">\`
elements+=\`loading\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('96214170', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('bb637469', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('52a55987', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ec75aa68', 'id'))}">\`
elements+=\`Show an indeterminate bar along the bottom edge.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('a70fa1a4', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5232c0b6', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6d2dd423', 'id'))}">\`
elements+=\`hint\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7d45bedd', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('118b669a', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fb0d6e30', 'id'))}">\`
elements+=\`Helper text below the control.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2b0bbade', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fbb8a392', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a7eb825b', 'id'))}">\`
elements+=\`persistent-hint\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3e94fa1b', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4722536b', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c599a2a8', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('cb99022d', 'id'))}">\`
elements+=\`Keep the hint visible when not focused.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('4ac03803', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f5278e34', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2e7c0824', 'id'))}">\`
elements+=\`error\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('21d458ec', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('953434f9', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b5b278e2', 'id'))}">\`
elements+=\`Error text; tints the control and replaces the hint.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2fd0bad6', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f5d95ad0', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f614b5c2', 'id'))}">\`
elements+=\`rounded\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('eb7f2d15', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b997e946', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8f8e7980', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ccff574c', 'id'))}">\`
elements+=\`Pill-rounded control.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('0dba1423', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6b2c7023', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4db9954e', 'id'))}">\`
elements+=\`single-line\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6b1975e0', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('12c35d43', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('687f0b72', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('85301135', 'id'))}">\`
elements+=\`No floating label; label becomes the placeholder.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('ca17c4b1', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('048efb27', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('63d4bfe5', 'id'))}">\`
elements+=\`hide-details\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a0ea5e08', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('137d1332', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ff87c1d8', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('92ea2fa7', 'id'))}">\`
elements+=\`Suppress the details row (hint / error / counter).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('c9e1ce3d', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5690d91d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('278b28b1', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('905e3901', 'id'))}">\`
elements+=\`readonly\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7f70fb86', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('71341c4c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bf65ec78', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('757399c6', 'id'))}">\`
elements+=\`State flags.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e3472bee', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2932a642', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1b08d2a5', 'id'))}">\`
elements+=\`name\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f4cabf20', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ae18f7fe', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('564ef42e', 'id'))}">\`
elements+=\`Form field name.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('a6225545', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f41fe9ad', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f5fd2640', 'id'))}">\`
elements+=\`required\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('30d8aa45', 'id'))}">\`
elements+=\`pattern\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('58d1c7bd', 'id'))}">\`
elements+=\`minlength\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e0163521', 'id'))}">\`
elements+=\`maxlength\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('28fe1e3f', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('34e95c55', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1aa8ca05', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e8539bd4', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('cf676b98', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('653d2730', 'id'))}">\`
elements+=\`Native HTML5 validation attributes, forwarded to the input.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('efbedfb1', 'id'))}">\`
elements+=\`Slots\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('876c36c5', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('220f556c', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('bc99fa17', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('379bfa94', 'id'))}">\`
elements+=\`Slot\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('4a0519a5', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('e75a2895', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('dea110bf', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('02b2d9ad', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1b4a3457', 'id'))}">\`
elements+=\`prepend-inner\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ee859c67', 'id'))}">\`
elements+=\`Content (e.g. an icon) inside the control, leading.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('7457ca18', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2e848099', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5fa02867', 'id'))}">\`
elements+=\`append-inner\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('791a0568', 'id'))}">\`
elements+=\`Content inside the control, trailing.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('9159d4de', 'id'))}">\`
elements+=\`Events\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('91b1585e', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('ae999696', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('4a41306b', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('237bdcb7', 'id'))}">\`
elements+=\`Event\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('71ebc32f', 'id'))}">\`
elements+=\`Detail\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('904c2388', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('bfa20da6', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('58233530', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c3f10846', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9a051f27', 'id'))}">\`
elements+=\`input\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2d05cbab', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('eaf48a9b', 'id'))}">\`
elements+=\`&#123; value, name &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('37730db9', 'id'))}">\`
elements+=\`Fired on every keystroke.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('bb64fa20', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('142130ef', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e5ae8b55', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7bd81fbe', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('58279b8a', 'id'))}">\`
elements+=\`&#123; value, name &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0cab3aae', 'id'))}">\`
elements+=\`Fired when the value is committed.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('89b8c83e', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('91287aa2', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4385f42e', 'id'))}">\`
elements+=\`clear\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('554a4cc6', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c55c797c', 'id'))}">\`
elements+=\`&#123; name &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9a557afc', 'id'))}">\`
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
