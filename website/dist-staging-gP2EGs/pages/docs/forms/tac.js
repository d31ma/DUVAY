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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('7f4b0648', 'id'))}">\`
elements+=\`Forms\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d1b41c53', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4927efdc', 'id'))}">\`
elements+=\`w-form\`
elements+=\`</code>\`
elements+=\` wraps native form controls and DuVay inputs, mirroring Vuetify&#8217;s \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0863190a', 'id'))}">\`
elements+=\`v-form\`
elements+=\`</code>\`
elements+=\`. It aggregates the validity of every field, cascades \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('90909193', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d28bbd0d', 'id'))}">\`
elements+=\`readonly\`
elements+=\`</code>\`
elements+=\` to its controls, and emits \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2fbb9778', 'id'))}">\`
elements+=\`submit\`
elements+=\`</code>\`
elements+=\` with the result. Validation is native HTML5 constraint validation (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a74a489a', 'id'))}">\`
elements+=\`required\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('48a5cec4', 'id'))}">\`
elements+=\`type\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9d392313', 'id'))}">\`
elements+=\`pattern\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('745481df', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\`/\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4ec02d05', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('80ab01b8', 'id'))}">\`
elements+=\`minlength\`
elements+=\`</code>\`
elements+=\`/\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5121fedb', 'id'))}">\`
elements+=\`maxlength\`
elements+=\`</code>\`
elements+=\`), so the browser does the checking with no extra JavaScript. DuVay inputs forward those constraint attributes to their underlying control, so they validate inside a form too.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('00fdf860', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('f4f6b9b3', 'id'))}">\`
elements+=\`Submitting validates every field. The native submit is always prevented; listen for \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7b2ae5e1', 'id'))}">\`
elements+=\`submit\`
elements+=\`</code>\`
elements+=\` and read \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('709ab89d', 'id'))}">\`
elements+=\`event.detail.valid\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('95792fa7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<form class="w-form" id="\${ty_escapeAttr(ty_generateId('487b52a3', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('eb11d74b', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-field" id="\${ty_escapeAttr(ty_generateId('506c1ea5', 'id'))}">\`
elements+=\`
          \`
elements+=\`<label class="w-field-label" for="form-name" id="\${ty_escapeAttr(ty_generateId('137deff8', 'id'))}">\`
elements+=\`Name\`
elements+=\`</label>\`
elements+=\`
          \`
elements+=\`<input class="w-input" id="form-name" type="text" required="" placeholder="Jane Doe" />\`
elements+=\`
        \`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-field" id="\${ty_escapeAttr(ty_generateId('f517da8e', 'id'))}">\`
elements+=\`
          \`
elements+=\`<label class="w-field-label" for="form-email" id="\${ty_escapeAttr(ty_generateId('80c43284', 'id'))}">\`
elements+=\`Email\`
elements+=\`</label>\`
elements+=\`
          \`
elements+=\`<input class="w-input" id="form-email" type="email" required="" placeholder="you@example.com" />\`
elements+=\`
        \`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-primary" type="submit" id="\${ty_escapeAttr(ty_generateId('15391614', 'id'))}">\`
elements+=\`Submit\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</form>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('32b25a67', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-form id="\${ty_escapeAttr(ty_generateId('e1f3bfe0', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('a792c9ca', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-input label="Name" type="text" required="" placeholder="Jane Doe" id="\${ty_escapeAttr(ty_generateId('05761db2', 'id'))}">\`
elements+=\`</w-input>\`
elements+=\`
        \`
elements+=\`<w-input label="Email" type="email" required="" placeholder="you@example.com" id="\${ty_escapeAttr(ty_generateId('5bf77fa8', 'id'))}">\`
elements+=\`</w-input>\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-primary" type="submit" id="\${ty_escapeAttr(ty_generateId('9a39bfc0', 'id'))}">\`
elements+=\`Submit\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</w-form>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('affd8931', 'id'))}">\`
elements+=\`Disabled and read-only\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('2c21f761', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('737e4dae', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('039d1ac4', 'id'))}">\`
elements+=\`readonly\`
elements+=\`</code>\`
elements+=\` on the form to apply it to every contained control at once. A control that is individually disabled stays disabled when the form is re-enabled.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('694e5ade', 'id'))}">\`
elements+=\`
    \`
elements+=\`<form class="w-form" id="\${ty_escapeAttr(ty_generateId('2c37c831', 'id'))}">\`
elements+=\`
      \`
elements+=\`<fieldset class="w-stack" disabled="" id="\${ty_escapeAttr(ty_generateId('a52ac342', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-field" id="\${ty_escapeAttr(ty_generateId('434981b4', 'id'))}">\`
elements+=\`
          \`
elements+=\`<label class="w-field-label" for="form-plan" id="\${ty_escapeAttr(ty_generateId('f051df37', 'id'))}">\`
elements+=\`Plan\`
elements+=\`</label>\`
elements+=\`
          \`
elements+=\`<input class="w-input" id="form-plan" type="text" value="Pro" />\`
elements+=\`
        \`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-primary" type="submit" id="\${ty_escapeAttr(ty_generateId('55d24856', 'id'))}">\`
elements+=\`Submit\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</fieldset>\`
elements+=\`
    \`
elements+=\`</form>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('99fdaa26', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-form disabled="" id="\${ty_escapeAttr(ty_generateId('21625521', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('10d38bac', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-input label="Plan" type="text" value="Pro" id="\${ty_escapeAttr(ty_generateId('733c147a', 'id'))}">\`
elements+=\`</w-input>\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-primary" type="submit" id="\${ty_escapeAttr(ty_generateId('0cd0ca1b', 'id'))}">\`
elements+=\`Submit\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</w-form>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('414b9944', 'id'))}">\`
elements+=\`When fields validate\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('2d4f0519', 'id'))}">\`
elements+=\`The \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9c886e50', 'id'))}">\`
elements+=\`validate-on\`
elements+=\`</code>\`
elements+=\` attribute controls when fields re-validate as the user interacts: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4e2383d9', 'id'))}">\`
elements+=\`input\`
elements+=\`</code>\`
elements+=\` (default), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8f0f4965', 'id'))}">\`
elements+=\`blur\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7604a2d1', 'id'))}">\`
elements+=\`submit\`
elements+=\`</code>\`
elements+=\`. Combine values with a space, e.g. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0872000b', 'id'))}">\`
elements+=\`validate-on="blur submit"\`
elements+=\`</code>\`
elements+=\`. Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b052e8c6', 'id'))}">\`
elements+=\`fast-fail\`
elements+=\`</code>\`
elements+=\` to stop at the first failing field.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('c449e2ad', 'id'))}">\`
elements+=\`
    \`
elements+=\`<form class="w-form" id="\${ty_escapeAttr(ty_generateId('369a3e7c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-field" id="\${ty_escapeAttr(ty_generateId('03ef2aca', 'id'))}">\`
elements+=\`
        \`
elements+=\`<label class="w-field-label" for="form-user" id="\${ty_escapeAttr(ty_generateId('bcaa5a5a', 'id'))}">\`
elements+=\`Username\`
elements+=\`</label>\`
elements+=\`
        \`
elements+=\`<input class="w-input" id="form-user" type="text" required="" minlength="3" />\`
elements+=\`
        \`
elements+=\`<span class="w-field-hint" id="\${ty_escapeAttr(ty_generateId('b6fc7e57', 'id'))}">\`
elements+=\`At least 3 characters.\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</form>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('5b18f700', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-form validate-on="blur" id="\${ty_escapeAttr(ty_generateId('ed5df411', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-input label="Username" type="text" required="" minlength="3" hint="At least 3 characters." id="\${ty_escapeAttr(ty_generateId('4471d536', 'id'))}">\`
elements+=\`</w-input>\`
elements+=\`
    \`
elements+=\`</w-form>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('416b5440', 'id'))}">\`
elements+=\`Programmatic validation\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('65a89f84', 'id'))}">\`
elements+=\`Hold a reference to the element and call its methods directly &#8212; the same API \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7462eff8', 'id'))}">\`
elements+=\`v-form\`
elements+=\`</code>\`
elements+=\` exposes through its ref.\`
elements+=\`</p>\`
elements+=\`<pre class="w-code" id="\${ty_escapeAttr(ty_generateId('59fb594d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('26aad478', 'id'))}">\`
elements+=\`const form = document.querySelector('w-form')

const &#123; valid, errors &#125; = form.validate()
// errors -&gt; [&#123; id: 'email', errorMessages: ['Please fill out this field.'] &#125;]

form.resetValidation() // clear messages, keep values
form.reset()           // clear values and validation

form.isValid     // true | false | null (not yet validated)
form.errors      // current FieldValidationResult[]
form.items       // the validatable controls in the form\`
elements+=\`</code>\`
elements+=\`</pre>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('db82250a', 'id'))}">\`
elements+=\`Attributes\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('a9d41829', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('e73dee82', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('7b817733', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('3775d6a7', 'id'))}">\`
elements+=\`Attribute\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('8bfcffef', 'id'))}">\`
elements+=\`Type\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('5f961c51', 'id'))}">\`
elements+=\`Default\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('9f841411', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('ed402cf0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('115f0228', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7267c34d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7ca9d1ce', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b4a65c02', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ac02e98a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('15a7966d', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('de7e0634', 'id'))}">\`
elements+=\`Disables every contained control.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('b7dcf784', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3a1854f8', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('87d107ae', 'id'))}">\`
elements+=\`readonly\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a18d436b', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e897a28a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('87a6d969', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('063efc8e', 'id'))}">\`
elements+=\`Makes every contained control read-only where supported.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('8ecea643', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3c049466', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4319fddb', 'id'))}">\`
elements+=\`fast-fail\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('78f1389f', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('05b746e8', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ff9778bd', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a64a0953', 'id'))}">\`
elements+=\`Stop validating at the first failing field.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('358ce6ea', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('186b81b3', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fc4b441f', 'id'))}">\`
elements+=\`validate-on\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('391e3cf3', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3d32c2a4', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b7929f3e', 'id'))}">\`
elements+=\`input\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1ff3a1ef', 'id'))}">\`
elements+=\`When fields validate: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('869b8c66', 'id'))}">\`
elements+=\`input\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5864eb6a', 'id'))}">\`
elements+=\`blur\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7285bbe7', 'id'))}">\`
elements+=\`submit\`
elements+=\`</code>\`
elements+=\`, or a space-separated combination.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('37534007', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2de21779', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c7a80bdf', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b448f96e', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a8d21992', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('efa7e050', 'id'))}">\`
elements+=\`Reflects validity: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('59e9ad88', 'id'))}">\`
elements+=\`true\`
elements+=\`</code>\`
elements+=\` valid, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2c1c8ed2', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\` invalid, absent until validated.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('36c0b759', 'id'))}">\`
elements+=\`Events\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('f561ee5c', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('ea2c9a61', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('14812f9a', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('c0378b13', 'id'))}">\`
elements+=\`Event\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('094bc6fd', 'id'))}">\`
elements+=\`Detail\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('cf7fa49b', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('0890869d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('97f54b54', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0e33a761', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c3a28905', 'id'))}">\`
elements+=\`submit\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c345bcdf', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('12f7f12a', 'id'))}">\`
elements+=\`&#123; valid, errors &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('aff97259', 'id'))}">\`
elements+=\`Fired on submit after validation; the native submit is prevented.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('1da917eb', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d0a2e0df', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('67760dd4', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('858873c9', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3b4be2be', 'id'))}">\`
elements+=\`&#123; value &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('288a3d28', 'id'))}">\`
elements+=\`Fired when validity changes to \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6abc55ac', 'id'))}">\`
elements+=\`true\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('baf3ba2b', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('469c519c', 'id'))}">\`
elements+=\`null\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('650553f4', 'id'))}">\`
elements+=\`Methods\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('b555eb50', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('fdb12b46', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('d4d954d0', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('8691414d', 'id'))}">\`
elements+=\`Method\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('980cdd14', 'id'))}">\`
elements+=\`Returns\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('20259c87', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('cfa2c85c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('719f0093', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5b7e3603', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b0496a84', 'id'))}">\`
elements+=\`validate()\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b65cab54', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7849dbc1', 'id'))}">\`
elements+=\`&#123; valid, errors &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5b88c594', 'id'))}">\`
elements+=\`Validate every field and mark invalid controls.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('44bee6c1', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4bd56f7d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ce892481', 'id'))}">\`
elements+=\`reset()\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fe153b6a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b7d6494c', 'id'))}">\`
elements+=\`void\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a1b55b09', 'id'))}">\`
elements+=\`Reset field values and clear validation.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('6d569002', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f3b2ab43', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5cd5e269', 'id'))}">\`
elements+=\`resetValidation()\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9bffa44d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fef2d79b', 'id'))}">\`
elements+=\`void\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b00066b6', 'id'))}">\`
elements+=\`Clear validation state, keep values.\`
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
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/forms/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
