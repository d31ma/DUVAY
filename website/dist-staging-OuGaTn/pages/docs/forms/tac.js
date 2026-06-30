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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('aed9fcd8', 'id'))}">\`
elements+=\`Forms\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('0f94c5db', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('38a48d57', 'id'))}">\`
elements+=\`w-form\`
elements+=\`</code>\`
elements+=\` wraps native form controls and DuVay inputs, mirroring Vuetify&#8217;s \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b5b90904', 'id'))}">\`
elements+=\`v-form\`
elements+=\`</code>\`
elements+=\`. It aggregates the validity of every field, cascades \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f4f6cdcd', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('38f9c85f', 'id'))}">\`
elements+=\`readonly\`
elements+=\`</code>\`
elements+=\` to its controls, and emits \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('51a2ebbe', 'id'))}">\`
elements+=\`submit\`
elements+=\`</code>\`
elements+=\` with the result. Validation is native HTML5 constraint validation (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ca3f5a3b', 'id'))}">\`
elements+=\`required\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4d92b188', 'id'))}">\`
elements+=\`type\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e33477ed', 'id'))}">\`
elements+=\`pattern\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5ea1736b', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\`/\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e2e1463d', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3cd020c9', 'id'))}">\`
elements+=\`minlength\`
elements+=\`</code>\`
elements+=\`/\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d10c66d8', 'id'))}">\`
elements+=\`maxlength\`
elements+=\`</code>\`
elements+=\`), so the browser does the checking with no extra JavaScript. DuVay inputs forward those constraint attributes to their underlying control, so they validate inside a form too.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('ec93ce2c', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('3f190afc', 'id'))}">\`
elements+=\`Submitting validates every field. The native submit is always prevented; listen for \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('de496def', 'id'))}">\`
elements+=\`submit\`
elements+=\`</code>\`
elements+=\` and read \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2c0cffea', 'id'))}">\`
elements+=\`event.detail.valid\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('c8ca2387', 'id'))}">\`
elements+=\`
    \`
elements+=\`<form class="w-form" id="\${ty_escapeAttr(ty_generateId('812a932d', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('b0db9998', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-field" id="\${ty_escapeAttr(ty_generateId('9594cc00', 'id'))}">\`
elements+=\`
          \`
elements+=\`<label class="w-field-label" for="form-name" id="\${ty_escapeAttr(ty_generateId('6f2ce7dd', 'id'))}">\`
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
elements+=\`<div class="w-field" id="\${ty_escapeAttr(ty_generateId('944cbccd', 'id'))}">\`
elements+=\`
          \`
elements+=\`<label class="w-field-label" for="form-email" id="\${ty_escapeAttr(ty_generateId('f069200c', 'id'))}">\`
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
elements+=\`<button class="w-btn w-btn-primary" type="submit" id="\${ty_escapeAttr(ty_generateId('7269553d', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('414a8faf', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-form id="\${ty_escapeAttr(ty_generateId('9bbe7cfb', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('4af9655e', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-input label="Name" type="text" required="" placeholder="Jane Doe" id="\${ty_escapeAttr(ty_generateId('982936fe', 'id'))}">\`
elements+=\`</w-input>\`
elements+=\`
        \`
elements+=\`<w-input label="Email" type="email" required="" placeholder="you@example.com" id="\${ty_escapeAttr(ty_generateId('d548d480', 'id'))}">\`
elements+=\`</w-input>\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-primary" type="submit" id="\${ty_escapeAttr(ty_generateId('c457bfa5', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('48da6acc', 'id'))}">\`
elements+=\`Disabled and read-only\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('ef8bf87b', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('400788c4', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1f127732', 'id'))}">\`
elements+=\`readonly\`
elements+=\`</code>\`
elements+=\` on the form to apply it to every contained control at once. A control that is individually disabled stays disabled when the form is re-enabled.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('248530d3', 'id'))}">\`
elements+=\`
    \`
elements+=\`<form class="w-form" id="\${ty_escapeAttr(ty_generateId('6cf582a6', 'id'))}">\`
elements+=\`
      \`
elements+=\`<fieldset class="w-stack" disabled="" id="\${ty_escapeAttr(ty_generateId('1ff2adb5', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-field" id="\${ty_escapeAttr(ty_generateId('66b02330', 'id'))}">\`
elements+=\`
          \`
elements+=\`<label class="w-field-label" for="form-plan" id="\${ty_escapeAttr(ty_generateId('784dd30a', 'id'))}">\`
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
elements+=\`<button class="w-btn w-btn-primary" type="submit" id="\${ty_escapeAttr(ty_generateId('5488b6f9', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('2c942d9a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-form disabled="" id="\${ty_escapeAttr(ty_generateId('a34f7399', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('1df2981a', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-input label="Plan" type="text" value="Pro" id="\${ty_escapeAttr(ty_generateId('abb39fe5', 'id'))}">\`
elements+=\`</w-input>\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-primary" type="submit" id="\${ty_escapeAttr(ty_generateId('8fd7f405', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('43750e98', 'id'))}">\`
elements+=\`When fields validate\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('a1397a5f', 'id'))}">\`
elements+=\`The \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('63494b35', 'id'))}">\`
elements+=\`validate-on\`
elements+=\`</code>\`
elements+=\` attribute controls when fields re-validate as the user interacts: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bb350953', 'id'))}">\`
elements+=\`input\`
elements+=\`</code>\`
elements+=\` (default), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f25cae41', 'id'))}">\`
elements+=\`blur\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('06ef1112', 'id'))}">\`
elements+=\`submit\`
elements+=\`</code>\`
elements+=\`. Combine values with a space, e.g. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3ce213f3', 'id'))}">\`
elements+=\`validate-on="blur submit"\`
elements+=\`</code>\`
elements+=\`. Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('15c738d5', 'id'))}">\`
elements+=\`fast-fail\`
elements+=\`</code>\`
elements+=\` to stop at the first failing field.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('55efd5b9', 'id'))}">\`
elements+=\`
    \`
elements+=\`<form class="w-form" id="\${ty_escapeAttr(ty_generateId('7e1216ab', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-field" id="\${ty_escapeAttr(ty_generateId('d5a10192', 'id'))}">\`
elements+=\`
        \`
elements+=\`<label class="w-field-label" for="form-user" id="\${ty_escapeAttr(ty_generateId('0a7e9237', 'id'))}">\`
elements+=\`Username\`
elements+=\`</label>\`
elements+=\`
        \`
elements+=\`<input class="w-input" id="form-user" type="text" required="" minlength="3" />\`
elements+=\`
        \`
elements+=\`<span class="w-field-hint" id="\${ty_escapeAttr(ty_generateId('b9ae0da7', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('cd01e212', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-form validate-on="blur" id="\${ty_escapeAttr(ty_generateId('50e96723', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-input label="Username" type="text" required="" minlength="3" hint="At least 3 characters." id="\${ty_escapeAttr(ty_generateId('090776e0', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('b268f412', 'id'))}">\`
elements+=\`Programmatic validation\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('24e98e1a', 'id'))}">\`
elements+=\`Hold a reference to the element and call its methods directly &#8212; the same API \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('23723713', 'id'))}">\`
elements+=\`v-form\`
elements+=\`</code>\`
elements+=\` exposes through its ref.\`
elements+=\`</p>\`
elements+=\`<pre class="w-code" id="\${ty_escapeAttr(ty_generateId('d45e3737', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fe349595', 'id'))}">\`
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

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/forms/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
