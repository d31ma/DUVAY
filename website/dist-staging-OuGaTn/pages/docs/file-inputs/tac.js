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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('29b943cb', 'id'))}">\`
elements+=\`File inputs\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('e28edfd2', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('90105379', 'id'))}">\`
elements+=\`w-file-input\`
elements+=\`</code>\`
elements+=\` is a labelled file picker. Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('619be15f', 'id'))}">\`
elements+=\`accept\`
elements+=\`</code>\`
elements+=\` to restrict file types, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ec7b1b57', 'id'))}">\`
elements+=\`multiple\`
elements+=\`</code>\`
elements+=\` to allow several files, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('16fbe81a', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\` to lock it.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('03d43546', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('753687c3', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-file-input" id="\${ty_escapeAttr(ty_generateId('a2ac2250', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-file-input-label" id="\${ty_escapeAttr(ty_generateId('430efc66', 'id'))}">\`
elements+=\`Upload file\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-file-input-name" id="\${ty_escapeAttr(ty_generateId('c1fb1628', 'id'))}">\`
elements+=\`No file chosen\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<input type="file" id="\${ty_escapeAttr(ty_generateId('27c567f2', 'id'))}" />\`
elements+=\`
    \`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('1f041cb1', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-file-input label="Upload file" id="\${ty_escapeAttr(ty_generateId('3f644f26', 'id'))}">\`
elements+=\`</w-file-input>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('5bedc94c', 'id'))}">\`
elements+=\`Multiple and accept\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('3e78f97a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-file-input" id="\${ty_escapeAttr(ty_generateId('3df8cddf', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-file-input-label" id="\${ty_escapeAttr(ty_generateId('5e318e95', 'id'))}">\`
elements+=\`Attach images\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-file-input-name" id="\${ty_escapeAttr(ty_generateId('74b41bfb', 'id'))}">\`
elements+=\`No file chosen\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<input type="file" accept="image/*" multiple="" id="\${ty_escapeAttr(ty_generateId('3dbdf2d3', 'id'))}" />\`
elements+=\`
    \`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('2ab7cbd2', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-file-input label="Attach images" accept="image/*" multiple="" id="\${ty_escapeAttr(ty_generateId('c588311c', 'id'))}">\`
elements+=\`</w-file-input>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('7945f99f', 'id'))}">\`
elements+=\`Chips and counter\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('231a6758', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-field" id="\${ty_escapeAttr(ty_generateId('b25f252c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-field-label" id="\${ty_escapeAttr(ty_generateId('8edbbb64', 'id'))}">\`
elements+=\`Attachments\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<div class="w-file-input w-file-input--field" id="\${ty_escapeAttr(ty_generateId('ab79bc15', 'id'))}">\`
elements+=\`
        \`
elements+=\`<label class="w-file-input-field" id="\${ty_escapeAttr(ty_generateId('ab9fa443', 'id'))}">\`
elements+=\`
          \`
elements+=\`<input type="file" multiple="" id="\${ty_escapeAttr(ty_generateId('9d23e6c0', 'id'))}" />\`
elements+=\`
          \`
elements+=\`<span class="w-file-input-placeholder" id="\${ty_escapeAttr(ty_generateId('e681e864', 'id'))}">\`
elements+=\`Drop files here\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<span class="w-field-hint" id="\${ty_escapeAttr(ty_generateId('18159f5d', 'id'))}">\`
elements+=\`Selected files appear as chips\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('ddff5775', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-file-input label="Attachments" chips="" counter="" show-size="" multiple="" placeholder="Drop files here" hint="Selected files appear as chips" id="\${ty_escapeAttr(ty_generateId('ea33fc28', 'id'))}">\`
elements+=\`</w-file-input>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('076b6475', 'id'))}">\`
elements+=\`Clearable and placeholder\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('5d83ddd5', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-field" id="\${ty_escapeAttr(ty_generateId('c9dd59ef', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-field-label" id="\${ty_escapeAttr(ty_generateId('aed83a2c', 'id'))}">\`
elements+=\`Resume\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<div class="w-file-input w-file-input--field" id="\${ty_escapeAttr(ty_generateId('86fd1433', 'id'))}">\`
elements+=\`
        \`
elements+=\`<label class="w-file-input-field" id="\${ty_escapeAttr(ty_generateId('7fc02f05', 'id'))}">\`
elements+=\`
          \`
elements+=\`<input type="file" accept=".pdf,.doc,.docx" id="\${ty_escapeAttr(ty_generateId('e680fad1', 'id'))}" />\`
elements+=\`
          \`
elements+=\`<span class="w-file-input-placeholder" id="\${ty_escapeAttr(ty_generateId('002bfeb0', 'id'))}">\`
elements+=\`Choose a PDF or Word document\`
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
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('1d36e60c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-file-input label="Resume" clearable="" placeholder="Choose a PDF or Word document" accept=".pdf,.doc,.docx" id="\${ty_escapeAttr(ty_generateId('52f08fa3', 'id'))}">\`
elements+=\`</w-file-input>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('99bbab9b', 'id'))}">\`
elements+=\`API\`
elements+=\`</h2>\`
elements+=\`<ul id="\${ty_escapeAttr(ty_generateId('6ec7a1e3', 'id'))}">\`
elements+=\`
  \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('e9bcdd37', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5f772450', 'id'))}">\`
elements+=\`label\`
elements+=\`</code>\`
elements+=\` — button or field label.\`
elements+=\`</li>\`
elements+=\`
  \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('1178faed', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('09ee4799', 'id'))}">\`
elements+=\`accept\`
elements+=\`</code>\`
elements+=\` — comma-separated accepted MIME types or extensions.\`
elements+=\`</li>\`
elements+=\`
  \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('4f3283d4', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('eaaf84dc', 'id'))}">\`
elements+=\`multiple\`
elements+=\`</code>\`
elements+=\` — allow selecting several files.\`
elements+=\`</li>\`
elements+=\`
  \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('e63f9d4c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4c485383', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('196d0eda', 'id'))}">\`
elements+=\`readonly\`
elements+=\`</code>\`
elements+=\` — lock the input; readonly also prevents the file dialog.\`
elements+=\`</li>\`
elements+=\`
  \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('e8ac3e88', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('577961e5', 'id'))}">\`
elements+=\`chips\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c64a74a8', 'id'))}">\`
elements+=\`small-chips\`
elements+=\`</code>\`
elements+=\` — show selected files as chips.\`
elements+=\`</li>\`
elements+=\`
  \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('9febfcc0', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b154ae04', 'id'))}">\`
elements+=\`counter\`
elements+=\`</code>\`
elements+=\` — show the file count and total size.\`
elements+=\`</li>\`
elements+=\`
  \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('0938a218', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('786062ef', 'id'))}">\`
elements+=\`show-size\`
elements+=\`</code>\`
elements+=\` — show each file size inside its chip.\`
elements+=\`</li>\`
elements+=\`
  \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('bdaf833c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('98d42aeb', 'id'))}">\`
elements+=\`clearable\`
elements+=\`</code>\`
elements+=\` — show a clear-all button when files are selected.\`
elements+=\`</li>\`
elements+=\`
  \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('fbdb1712', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e2ce8a43', 'id'))}">\`
elements+=\`placeholder\`
elements+=\`</code>\`
elements+=\` — text shown when no files are selected.\`
elements+=\`</li>\`
elements+=\`
  \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('9bb4226c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('99a2ac0c', 'id'))}">\`
elements+=\`hint\`
elements+=\`</code>\`
elements+=\` — helper text below the field.\`
elements+=\`</li>\`
elements+=\`
  \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('a66f054a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ab2bdc74', 'id'))}">\`
elements+=\`error\`
elements+=\`</code>\`
elements+=\` — error message; also applies error styling.\`
elements+=\`</li>\`
elements+=\`
  \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('c07a554f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('06e39ab3', 'id'))}">\`
elements+=\`truncate-length\`
elements+=\`</code>\`
elements+=\` — max characters for a file name before truncation (default 22).\`
elements+=\`</li>\`
elements+=\`
  \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('6099111b', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a5b738ed', 'id'))}">\`
elements+=\`density\`
elements+=\`</code>\`
elements+=\` — \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4d25a2ad', 'id'))}">\`
elements+=\`compact\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ece801e1', 'id'))}">\`
elements+=\`comfortable\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</li>\`
elements+=\`
  \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('ffdb4b15', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3651882c', 'id'))}">\`
elements+=\`name\`
elements+=\`</code>\`
elements+=\` — native form field name forwarded to the file input.\`
elements+=\`</li>\`
elements+=\`
\`
elements+=\`</ul>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('b670c436', 'id'))}">\`
elements+=\`Events: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('045f2cb1', 'id'))}">\`
elements+=\`input\`
elements+=\`</code>\`
elements+=\` on every selection and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('93a1d637', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\` when files change or clear.\`
elements+=\`</p>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/file-inputs/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
