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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('70a3877b', 'id'))}">\`
elements+=\`Confirm Edit\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('1b6a8c81', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ea9f7fe9', 'id'))}">\`
elements+=\`w-confirm-edit\`
elements+=\`</code>\`
elements+=\` keeps changes on a temporary copy of a value until the user commits (OK) or reverts (Cancel). OK stays disabled until the edit differs from the original. Edit with the built-in field, or wrap any control that exposes a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9e9b9929', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\` &#8212; a \`
elements+=\`<a href="/docs/text-fields" id="\${ty_escapeAttr(ty_generateId('4551fc37', 'id'))}">\`
elements+=\`text field\`
elements+=\`</a>\`
elements+=\`, \`
elements+=\`<a href="/docs/textareas" id="\${ty_escapeAttr(ty_generateId('7e770d36', 'id'))}">\`
elements+=\`textarea\`
elements+=\`</a>\`
elements+=\`, select, or a native input.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('ca2cb944', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('694f2ba8', 'id'))}">\`
elements+=\`With no slotted editor, a built-in input is rendered from \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5e922962', 'id'))}">\`
elements+=\`label\`
elements+=\`</code>\`
elements+=\`. Type to enable OK.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('cd20cf14', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-confirm-edit" id="\${ty_escapeAttr(ty_generateId('efe29be5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-confirm-edit-body" id="\${ty_escapeAttr(ty_generateId('c4d2852c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<label class="w-field" id="\${ty_escapeAttr(ty_generateId('718992df', 'id'))}">\`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('4e34a613', 'id'))}">\`
elements+=\`Name\`
elements+=\`</span>\`
elements+=\`<input class="w-input" value="Launch review" id="\${ty_escapeAttr(ty_generateId('0110910d', 'id'))}" />\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-confirm-edit-actions" id="\${ty_escapeAttr(ty_generateId('9da80b76', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-text" type="button" id="\${ty_escapeAttr(ty_generateId('75d4dce7', 'id'))}">\`
elements+=\`Cancel\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-filled" type="button" disabled="" id="\${ty_escapeAttr(ty_generateId('111c1e09', 'id'))}">\`
elements+=\`Save\`
elements+=\`</button>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('759773b1', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-confirm-edit label="Name" value="Launch review" id="\${ty_escapeAttr(ty_generateId('4e285b81', 'id'))}">\`
elements+=\`</w-confirm-edit>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('4602d7f4', 'id'))}">\`
elements+=\`Custom action labels\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('34c4f629', 'id'))}">\`
elements+=\`Override the button text with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('eb20f944', 'id'))}">\`
elements+=\`cancel-text\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4cd79f38', 'id'))}">\`
elements+=\`ok-text\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('708efa65', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-confirm-edit" id="\${ty_escapeAttr(ty_generateId('70570f5b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-confirm-edit-body" id="\${ty_escapeAttr(ty_generateId('4ac4977a', 'id'))}">\`
elements+=\`
        \`
elements+=\`<label class="w-field" id="\${ty_escapeAttr(ty_generateId('cdc1a184', 'id'))}">\`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('64eb0a12', 'id'))}">\`
elements+=\`Display name\`
elements+=\`</span>\`
elements+=\`<input class="w-input" value="ada" id="\${ty_escapeAttr(ty_generateId('1dd2e29b', 'id'))}" />\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-confirm-edit-actions" id="\${ty_escapeAttr(ty_generateId('117962a1', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-text" type="button" id="\${ty_escapeAttr(ty_generateId('9a9fcd94', 'id'))}">\`
elements+=\`Discard\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-filled" type="button" disabled="" id="\${ty_escapeAttr(ty_generateId('74f19822', 'id'))}">\`
elements+=\`Update\`
elements+=\`</button>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('42275ca4', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-confirm-edit label="Display name" value="ada" cancel-text="Discard" ok-text="Update" id="\${ty_escapeAttr(ty_generateId('7f908741', 'id'))}">\`
elements+=\`</w-confirm-edit>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('3e8e3e14', 'id'))}">\`
elements+=\`Custom editor\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('70298ab9', 'id'))}">\`
elements+=\`Drop any control into the default slot &#8212; it&#8217;s bound to \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1e64d70b', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`, and its changes drive the pristine state.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('20d0330f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-confirm-edit" id="\${ty_escapeAttr(ty_generateId('1e562557', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-confirm-edit-body" id="\${ty_escapeAttr(ty_generateId('a552aff7', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--outlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('759fd2ac', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('02e41c74', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('953fa212', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="3" id="\${ty_escapeAttr(ty_generateId('8d375337', 'id'))}">\`
elements+=\`Hello there, this is a longer note.\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('c075e0b1', 'id'))}">\`
elements+=\`Bio\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-confirm-edit-actions" id="\${ty_escapeAttr(ty_generateId('76474aeb', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-text" type="button" id="\${ty_escapeAttr(ty_generateId('ac3fd9f6', 'id'))}">\`
elements+=\`Cancel\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-filled" type="button" disabled="" id="\${ty_escapeAttr(ty_generateId('86dcf3d6', 'id'))}">\`
elements+=\`Save\`
elements+=\`</button>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('96011862', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-confirm-edit value="Hello there, this is a longer note." id="\${ty_escapeAttr(ty_generateId('90d2b6f7', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-textarea label="Bio" rows="3" value="Hello there, this is a longer note." id="\${ty_escapeAttr(ty_generateId('8ffc5713', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
    \`
elements+=\`</w-confirm-edit>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('3e4bc94a', 'id'))}">\`
elements+=\`Disabled\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d4c30bdd', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e8706d1d', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\` to lock the editor and both actions.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('de456990', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-confirm-edit" id="\${ty_escapeAttr(ty_generateId('bdb9cf35', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-confirm-edit-body" id="\${ty_escapeAttr(ty_generateId('077adade', 'id'))}">\`
elements+=\`
        \`
elements+=\`<label class="w-field" id="\${ty_escapeAttr(ty_generateId('b28af773', 'id'))}">\`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('c02c41f7', 'id'))}">\`
elements+=\`Name\`
elements+=\`</span>\`
elements+=\`<input class="w-input" value="Read only" disabled="" id="\${ty_escapeAttr(ty_generateId('6dcb59c7', 'id'))}" />\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-confirm-edit-actions" id="\${ty_escapeAttr(ty_generateId('5124d400', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-text" type="button" disabled="" id="\${ty_escapeAttr(ty_generateId('c50ed923', 'id'))}">\`
elements+=\`Cancel\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-filled" type="button" disabled="" id="\${ty_escapeAttr(ty_generateId('1f7a44ba', 'id'))}">\`
elements+=\`Save\`
elements+=\`</button>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('e2062543', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-confirm-edit label="Name" value="Read only" disabled="" id="\${ty_escapeAttr(ty_generateId('07f8ec66', 'id'))}">\`
elements+=\`</w-confirm-edit>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('b220e88c', 'id'))}">\`
elements+=\`Custom actions\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('4d6c31e0', 'id'))}">\`
elements+=\`Provide your own buttons in the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cb877808', 'id'))}">\`
elements+=\`actions\`
elements+=\`</code>\`
elements+=\` slot and mark them \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('08665a10', 'id'))}">\`
elements+=\`data-save\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7f5f122a', 'id'))}">\`
elements+=\`data-cancel\`
elements+=\`</code>\`
elements+=\`; the component wires the rest. With \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('26e0e6db', 'id'))}">\`
elements+=\`hide-actions\`
elements+=\`</code>\`
elements+=\` you can omit the buttons entirely and call \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5e1c785e', 'id'))}">\`
elements+=\`save()\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6330a9b5', 'id'))}">\`
elements+=\`cancel()\`
elements+=\`</code>\`
elements+=\` yourself.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('89f75d44', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-confirm-edit" id="\${ty_escapeAttr(ty_generateId('34a9ccae', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-confirm-edit-body" id="\${ty_escapeAttr(ty_generateId('eebb961d', 'id'))}">\`
elements+=\`
        \`
elements+=\`<label class="w-field" id="\${ty_escapeAttr(ty_generateId('a47b569d', 'id'))}">\`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('ae7e576c', 'id'))}">\`
elements+=\`Title\`
elements+=\`</span>\`
elements+=\`<input class="w-input" value="Q3 roadmap" id="\${ty_escapeAttr(ty_generateId('6c254f23', 'id'))}" />\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-confirm-edit-actions" id="\${ty_escapeAttr(ty_generateId('8778a4be', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-text" type="button" id="\${ty_escapeAttr(ty_generateId('179fd2cf', 'id'))}">\`
elements+=\`Undo\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-tonal" type="button" id="\${ty_escapeAttr(ty_generateId('e3ba7f84', 'id'))}">\`
elements+=\`Apply\`
elements+=\`</button>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('49bd571f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-confirm-edit label="Title" value="Q3 roadmap" id="\${ty_escapeAttr(ty_generateId('c77097a2', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button slot="actions" data-cancel="" class="w-btn w-btn-text" type="button" id="\${ty_escapeAttr(ty_generateId('a1d39aee', 'id'))}">\`
elements+=\`Undo\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button slot="actions" data-save="" class="w-btn w-btn-tonal" type="button" id="\${ty_escapeAttr(ty_generateId('cef1e46a', 'id'))}">\`
elements+=\`Apply\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</w-confirm-edit>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/components/confirm-edit/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
