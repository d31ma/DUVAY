var __esm=(fn,res)=>()=>(fn&&(res=fn(fn=0)),res);var __require=((x)=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(x,{get:(a,b)=>(typeof require<"u"?require:a)[b]}):x)(function(x){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+x+'" is not supported')});var exports_tac={};var init_tac=__esm(()=>{document.title="DuVay — CSS Framework + Web Components"});var AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;var TY_INTERNAL_FIELDS=new Set(["props","tac","__ty_bound_persistent_fields__","__ty_bound_reactive_fields__"]),ty_camelCasePropName=(name)=>name.replace(/-([a-zA-Z0-9])/g,(_match,char)=>char.toUpperCase()),ty_decodeProps=(props)=>{let withCamelAliases=(propBag)=>{for(let key of Object.keys(propBag)){if(!key.includes("-"))continue;let camelKey=ty_camelCasePropName(key);if(camelKey!==key&&!Object.prototype.hasOwnProperty.call(propBag,camelKey))propBag[camelKey]=propBag[key]}return propBag};if(typeof props==="string")try{return withCamelAliases(JSON.parse(decodeURIComponent(props)))}catch{return{}}return props&&typeof props==="object"?withCamelAliases(props):{}},ty_createScope=(controller,props)=>{let state=Object.create(null),propBag=props&&typeof props==="object"?props:{},proxy;return proxy=new Proxy(state,{has(_target,key){if(key===Symbol.unscopables||typeof key!=="string")return!1;return Object.prototype.hasOwnProperty.call(state,key)||(controller?key in controller:!1)||key in propBag},get(_target,key){if(key===Symbol.unscopables)return;if(key==="__ty_controller__")return controller;if(key==="__ty_props__")return propBag;if(typeof key!=="string")return;if(Object.prototype.hasOwnProperty.call(state,key))return state[key];if(controller&&key in controller){let value=controller[key];return typeof value==="function"?value.bind(controller):value}return propBag[key]},set(_target,key,value){if(typeof key!=="string")return!0;if(controller&&key in controller)return controller[key]=value,!0;if(key in propBag)return propBag[key]=value,!0;return state[key]=value,!0},ownKeys(){let keys=new Set(Object.keys(state));if(controller&&typeof controller==="object")for(let key of Object.keys(controller))keys.add(key);for(let key of Object.keys(propBag))keys.add(key);return[...keys]},getOwnPropertyDescriptor(_target,key){if(typeof key!=="string")return;return{configurable:!0,enumerable:!0,writable:!0,value:proxy[key]}}}),proxy},__ty_isBrowserEnv=()=>typeof window<"u"&&!globalThis.__ty_prerender__,__ty_openFetchCache=async()=>{if(!__ty_isBrowserEnv()||typeof indexedDB>"u")return null;if(window.__ty_fetch_cache_db__)return window.__ty_fetch_cache_db__??null;return window.__ty_fetch_cache_db__=await new Promise((resolve)=>{let request=indexedDB.open("tachyon-fetch-cache",1);request.onupgradeneeded=()=>{request.result.createObjectStore("responses",{keyPath:"key"})},request.onsuccess=()=>resolve(request.result),request.onerror=()=>resolve(null)}),window.__ty_fetch_cache_db__??null},__ty_readCachedResponse=async(cacheKey)=>{let db=await __ty_openFetchCache();if(!db)return null;return await new Promise((resolve)=>{let request=db.transaction("responses","readonly").objectStore("responses").get(cacheKey);request.onsuccess=()=>{let entry=request.result;if(!entry){resolve(null);return}resolve(new Response(entry.body?new Uint8Array(entry.body):null,{status:entry.status,statusText:entry.statusText,headers:entry.headers}))},request.onerror=()=>resolve(null)})},__ty_writeCachedResponse=async(cacheKey,response)=>{let db=await __ty_openFetchCache();if(!db)return;let body=await response.arrayBuffer();await new Promise((resolve)=>{let tx=db.transaction("responses","readwrite");tx.oncomplete=()=>resolve(void 0),tx.onerror=()=>resolve(void 0),tx.objectStore("responses").put({key:cacheKey,status:response.status,statusText:response.statusText,headers:Object.fromEntries(response.headers.entries()),body,updatedAt:Date.now()})})},__ty_deleteCachedResponse=async(cacheKey)=>{let db=await __ty_openFetchCache();if(!db)return;await new Promise((resolve)=>{let tx=db.transaction("responses","readwrite");tx.oncomplete=()=>resolve(void 0),tx.onerror=()=>resolve(void 0),tx.objectStore("responses").delete(cacheKey)})},localFirstFetch=async(input,init)=>{let request=new Request(input,init),method=request.method.toUpperCase(),browserEnv=__ty_isBrowserEnv(),sharedCache=globalThis.__ty_browser_cache__;if(browserEnv&&typeof sharedCache?.fetch==="function"){let canCacheRead=(method==="GET"||method==="HEAD")&&request.cache!=="no-store";return await sharedCache.fetch(input,init,{key:canCacheRead?`${method}:${request.url}`:null,invalidateKeys:method==="GET"||method==="HEAD"?[]:[`GET:${request.url}`,`HEAD:${request.url}`]})}let cacheKey=browserEnv&&(method==="GET"||method==="HEAD")&&request.cache!=="no-store"?`${method}:${request.url}`:null;if(cacheKey&&request.cache!=="reload"){let cached=await __ty_readCachedResponse(cacheKey);if(cached)return cached}try{let response=await(globalThis.__ty_native_fetch__??fetch)(input,init);if(cacheKey&&response.ok)__ty_writeCachedResponse(cacheKey,response.clone());if(!cacheKey&&response.ok&&browserEnv)Promise.all([__ty_deleteCachedResponse(`GET:${request.url}`),__ty_deleteCachedResponse(`HEAD:${request.url}`)]);return response}catch(error){if(cacheKey){let cached=await __ty_readCachedResponse(cacheKey);if(cached)return cached}throw error}};if(__ty_isBrowserEnv()){let g=globalThis;if(!g.__ty_fetch_installed__)g.__ty_fetch_installed__=!0,g.__ty_native_fetch__=globalThis.fetch.bind(globalThis),globalThis.fetch=(input,init)=>localFirstFetch(input,init)}var ty_createHelpers=(modulePath)=>{let renderContext={componentRootId:null,elemId:null,event:void 0},isBrowser=typeof window<"u"&&!globalThis.__ty_prerender__,isServer=!isBrowser,rerenderScheduled=!1,suppressReactiveRerender=!1,scheduleRerender=()=>{if(!isBrowser||suppressReactiveRerender||renderContext.elemId)return;if(rerenderScheduled)return;rerenderScheduled=!0,queueMicrotask(()=>{rerenderScheduled=!1,window.__ty_rerender?.()})},onMount=(fn)=>{if(!isBrowser)return;if(!window.__ty_onMount_queue__)window.__ty_onMount_queue__=[];window.__ty_onMount_queue__.push(fn)},rerender=()=>{if(isBrowser)window.__ty_rerender?.()},inject=(key,fallback=void 0)=>{if(!isBrowser)return fallback;return window.__ty_context__?.get(key)??fallback},env=(key,fallback=void 0)=>{if(!isBrowser)return fallback;let publicEnv=window.__ty_public_env__;if(!publicEnv||!(key in publicEnv))return fallback;return publicEnv[key]},fylo=(()=>{let noopCollection={find:async()=>({error:"Fylo browser not enabled"}),list:async()=>({error:"Fylo browser not enabled"}),get:async()=>({error:"Fylo browser not enabled"}),events:async()=>({error:"Fylo browser not enabled"}),patch:async()=>({error:"Fylo browser not enabled"}),del:async()=>({error:"Fylo browser not enabled"}),rebuild:async()=>({error:"Fylo browser not enabled"})},noop=new Proxy({enabled:!1,root:void 0,setCredentials(){},clearCredentials(){},sql:async()=>({error:"Fylo browser not enabled"}),collections:async()=>({root:"",collections:[]}),meta:async()=>null},{get(target,prop){if(typeof prop==="string"&&!(prop in target))return noopCollection;return Reflect.get(target,prop)}});return new Proxy(noop,{get(_,prop){let live=(typeof window<"u"?window.fylo:void 0)??noop;return Reflect.get(live,prop)}})})(),provide=(key,value)=>{if(isBrowser)window.__ty_context__?.set(key,value)},resolvePersistScope=(props)=>{let rawScope=props.__ty_persist_id__??(isBrowser?window.location.pathname||"/":modulePath||"server");return`${modulePath||"module"}:${String(rawScope)}`},emit=(name,detail)=>{let eventName=String(name||"").replace(/^@/,""),targetId=renderContext.componentRootId;if(!eventName||!targetId||typeof document>"u")return!1;let target=document.getElementById(targetId);if(!target||typeof CustomEvent>"u")return!1;return target.dispatchEvent(new CustomEvent(eventName,{detail,bubbles:!0,composed:!0}))},readSessionValue=(storageKey,fallback=void 0)=>{if(!isBrowser)return fallback;try{let stored=sessionStorage.getItem(storageKey);return stored===null?fallback:JSON.parse(stored)}catch{return fallback}},writeSessionValue=(storageKey,value)=>{if(!isBrowser)return;try{if(value===void 0){sessionStorage.removeItem(storageKey);return}sessionStorage.setItem(storageKey,JSON.stringify(value))}catch{}},readLocalValue=(storageKey,fallback=void 0)=>{if(!isBrowser)return fallback;try{let stored=globalThis.localStorage.getItem(storageKey);return stored===null?fallback:JSON.parse(stored)}catch{return fallback}},writeLocalValue=(storageKey,value)=>{if(!isBrowser)return;try{if(value===void 0){globalThis.localStorage.removeItem(storageKey);return}globalThis.localStorage.setItem(storageKey,JSON.stringify(value))}catch{}},bindPersistentFields=(controller,props)=>{let boundFields=controller.__ty_bound_persistent_fields__ instanceof Set?controller.__ty_bound_persistent_fields__:new Set;controller.__ty_bound_persistent_fields__=boundFields;let persistScope=resolvePersistScope(props);for(let fieldName of Object.keys(controller)){if(boundFields.has(fieldName))continue;if(fieldName.startsWith("$$")){let storageKey2=`tac:${persistScope}:${fieldName}`,currentValue2=readLocalValue(storageKey2,controller[fieldName]);Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:!0,get(){return currentValue2},set(nextValue){currentValue2=nextValue,writeLocalValue(storageKey2,nextValue)}}),controller[fieldName]=currentValue2,boundFields.add(fieldName);continue}if(!fieldName.startsWith("$"))continue;let storageKey=`tac:${persistScope}:${fieldName}`,currentValue=readSessionValue(storageKey,controller[fieldName]);Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:!0,get(){return currentValue},set(nextValue){currentValue=nextValue,writeSessionValue(storageKey,nextValue)}}),controller[fieldName]=currentValue,boundFields.add(fieldName)}},bindReactiveFields=(controller)=>{let boundFields=controller.__ty_bound_reactive_fields__ instanceof Set?controller.__ty_bound_reactive_fields__:new Set;controller.__ty_bound_reactive_fields__=boundFields;for(let fieldName of Object.keys(controller)){if(TY_INTERNAL_FIELDS.has(fieldName)||boundFields.has(fieldName))continue;let descriptor=Object.getOwnPropertyDescriptor(controller,fieldName);if(!descriptor||descriptor.configurable===!1)continue;if("value"in descriptor){let currentValue=descriptor.value;Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:descriptor.enumerable,get(){return currentValue},set(nextValue){if(Object.is(currentValue,nextValue))return;currentValue=nextValue,scheduleRerender()}}),boundFields.add(fieldName);continue}if(typeof descriptor.get==="function"&&typeof descriptor.set==="function")Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:descriptor.enumerable,get(){return descriptor.get?.call(controller)},set(nextValue){let previousValue=descriptor.get?.call(controller);descriptor.set?.call(controller,nextValue);let currentValue=descriptor.get?.call(controller);if(!Object.is(previousValue,currentValue))scheduleRerender()}}),boundFields.add(fieldName)}};return{createTacHelpers:(props)=>({get isBrowser(){return isBrowser},get isServer(){return isServer},bindPersistentFields(controller){bindPersistentFields(controller,props)},env,props,emit,fetch:(input,init)=>localFirstFetch(input,init),inject,onMount,provide,rerender}),bindCompanion:(instance,props,tac)=>{instance.props=props,instance.tac=tac,suppressReactiveRerender=!0;try{if(props){let propBag=props;for(let fieldName of Object.keys(instance)){if(fieldName==="props"||fieldName==="tac")continue;if(Object.prototype.hasOwnProperty.call(propBag,fieldName)){instance[fieldName]=propBag[fieldName];continue}if(fieldName.startsWith("$$")){let stripped=fieldName.slice(2);if(Object.prototype.hasOwnProperty.call(propBag,stripped))instance[fieldName]=propBag[stripped];continue}if(fieldName.startsWith("$")){let stripped=fieldName.slice(1);if(Object.prototype.hasOwnProperty.call(propBag,stripped))instance[fieldName]=propBag[stripped]}}}bindPersistentFields(instance,props),bindReactiveFields(instance)}finally{suppressReactiveRerender=!1}},createScope:ty_createScope,decodeProps:ty_decodeProps,env,emit,inject,isBrowser,isServer,onMount,provide,rerender,fylo,loadTacModule:async(modulePath2)=>{let tacGlobal=typeof window<"u"?window.Tac:void 0;if(tacGlobal?.load)return tacGlobal.load(modulePath2);let resolved=new URL(import.meta.url);resolved.pathname=resolved.pathname.replace(/\/(?:pages|components)\/.*$/,modulePath2);let module=await import(resolved.href);if(typeof module.default==="function")return module.default;throw Error(`Tac module "${modulePath2}" did not export a renderer`)},matchSwitchCase(switchValue,caseValue){return Array.isArray(caseValue)?caseValue.some((value)=>Object.is(value,switchValue)):Object.is(caseValue,switchValue)},setRenderContext(context){renderContext.componentRootId=context.componentRootId??null,renderContext.elemId=context.elemId??null,renderContext.event=context.event}}},__ty_module_imports__={site_header:(p)=>import("../components/site/header/tac.js").then(async(m)=>{return await(m.default||m)(p)}),__ty_companion_import__:()=>Promise.resolve().then(() => (init_tac(),exports_tac))},__ty_compiled_factory__=new AsyncFunction("__ty_helpers__","__ty_module_imports__","props",`
const __ty_props__ = __ty_helpers__.decodeProps(props);
const { site_header, __ty_companion_import__ } = __ty_module_imports__;

const __ty_companion__ = await (async () => {
    const __ty_companion_module__ = await __ty_companion_import__();
    const __ty_Companion__ = __ty_companion_module__?.default;
    if (typeof __ty_Companion__ !== 'function') return null;
    const __ty_runtime_bindings__ = __ty_helpers__.createTacHelpers(__ty_props__);
    const __ty_instance__ = new __ty_Companion__(__ty_props__, __ty_runtime_bindings__);
    if (__ty_instance__) {
        if (__ty_instance__.__tac_wasm_ready__ && typeof __ty_instance__.__tac_wasm_ready__.then === 'function') {
            await __ty_instance__.__tac_wasm_ready__;
        }
        __ty_helpers__.bindCompanion(__ty_instance__, __ty_props__, __ty_runtime_bindings__);
    }
    return __ty_instance__;
})();
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

    const site_header = await __ty_helpers__.loadTacModule('/components/site/header/tac.js')
    

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

        
                elements += \`<div id="\${ty_generateId('1ef14e6e', 'id')}" data-tac-scope="site-header" data-tac-module="/components/site/header/tac.js" >\`
                const __ty_child_props_1ef14e6e = {"__ty_persist_id__": ty_generateId('1ef14e6e', 'persist')}
                const __ty_child_props_sig_1ef14e6e = JSON.stringify(__ty_child_props_1ef14e6e)
                if(!compRenders.has('1ef14e6e') || compRenderProps.get('1ef14e6e') !== __ty_child_props_sig_1ef14e6e) {
                    render = await site_header(__ty_child_props_1ef14e6e)
                    elements += await render(elemId, event, '1ef14e6e')
                    compRenders.set('1ef14e6e', render)
                    compRenderProps.set('1ef14e6e', __ty_child_props_sig_1ef14e6e)
                } else {
                    render = compRenders.get('1ef14e6e')
                    elements += await render(elemId, event, '1ef14e6e')
                }
                elements += '</div>'
            
elements+=\`

\`
elements+=\`<w-app id="\${ty_escapeAttr(ty_generateId('295bc134', 'id'))}">\`
elements+=\`
  \`
elements+=\`<w-container size="lg" id="\${ty_escapeAttr(ty_generateId('135d6499', 'id'))}">\`
elements+=\`
    \`
elements+=\`<section class="w-text-center w-pa-12" aria-labelledby="duvay-title" id="\${ty_escapeAttr(ty_generateId('3a52531e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<p class="w-text-label-large w-color-primary w-font-semibold w-mb-3" id="\${ty_escapeAttr(ty_generateId('75a3afb0', 'id'))}">\`
elements+=\`Zero-dependency UI framework\`
elements+=\`</p>\`
elements+=\`
      \`
elements+=\`<h1 id="duvay-title" class="w-text-display-medium w-font-bold w-ma-0 w-mb-4">\`
elements+=\`DuVay\`
elements+=\`</h1>\`
elements+=\`
      \`
elements+=\`<p class="w-text-headline-small w-ma-0 w-mb-4" id="\${ty_escapeAttr(ty_generateId('3318202e', 'id'))}">\`
elements+=\`Build polished interfaces without writing component CSS.\`
elements+=\`</p>\`
elements+=\`
      \`
elements+=\`<p class="w-text-body-large w-text-subtle w-leading-normal w-mw-prose w-mx-auto w-ma-0" id="\${ty_escapeAttr(ty_generateId('f6f936b5', 'id'))}">\`
elements+=\`
        Design tokens, responsive utilities, themes, and accessible components share one system.
        Compose with CSS classes, web components, or both.
      \`
elements+=\`</p>\`
elements+=\`

      \`
elements+=\`<w-row justify="center" gutter="sm" class="w-mt-6" id="\${ty_escapeAttr(ty_generateId('9d0bd55c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="12" sm="auto" id="\${ty_escapeAttr(ty_generateId('f1bed63c', 'id'))}">\`
elements+=\`
          \`
elements+=\`<w-btn href="/docs/install" variant="filled" size="lg" block="" id="\${ty_escapeAttr(ty_generateId('8b4c249d', 'id'))}">\`
elements+=\`Get Started\`
elements+=\`</w-btn>\`
elements+=\`
        \`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="12" sm="auto" id="\${ty_escapeAttr(ty_generateId('5a266ebc', 'id'))}">\`
elements+=\`
          \`
elements+=\`<w-btn href="/docs/components" variant="outlined" size="lg" block="" id="\${ty_escapeAttr(ty_generateId('4ed7874c', 'id'))}">\`
elements+=\`Browse Components\`
elements+=\`</w-btn>\`
elements+=\`
        \`
elements+=\`</w-col>\`
elements+=\`
      \`
elements+=\`</w-row>\`
elements+=\`
    \`
elements+=\`</section>\`
elements+=\`

    \`
elements+=\`<section class="w-px-4 w-pb-8" aria-labelledby="framework-features" id="\${ty_escapeAttr(ty_generateId('acca03cc', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-text-center w-mb-8" id="\${ty_escapeAttr(ty_generateId('c1ebbb36', 'id'))}">\`
elements+=\`
        \`
elements+=\`<h2 id="framework-features" class="w-text-headline-medium w-ma-0 w-mb-2">\`
elements+=\`Built to stay out of your way\`
elements+=\`</h2>\`
elements+=\`
        \`
elements+=\`<p class="w-text-body-large w-text-subtle w-ma-0" id="\${ty_escapeAttr(ty_generateId('73ba0bbe', 'id'))}">\`
elements+=\`A coherent foundation for production interfaces.\`
elements+=\`</p>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`

      \`
elements+=\`<w-row gutter="md" id="\${ty_escapeAttr(ty_generateId('d7c47f17', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="4" id="\${ty_escapeAttr(ty_generateId('d8992a60', 'id'))}">\`
elements+=\`
          \`
elements+=\`<w-card class="w-h-100" variant="text" hover="" title="Zero Dependencies" text="No runtime dependency chain. Import the CSS, add the optional components, and build." id="\${ty_escapeAttr(ty_generateId('8db14c04', 'id'))}">\`
elements+=\`</w-card>\`
elements+=\`
        \`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="4" id="\${ty_escapeAttr(ty_generateId('995dfd56', 'id'))}">\`
elements+=\`
          \`
elements+=\`<w-card class="w-h-100" variant="text" hover="" title="Design Tokens" text="Colors, spacing, typography, motion, and layout share customizable CSS variables." id="\${ty_escapeAttr(ty_generateId('ab1b203b', 'id'))}">\`
elements+=\`</w-card>\`
elements+=\`
        \`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="4" id="\${ty_escapeAttr(ty_generateId('08608bf0', 'id'))}">\`
elements+=\`
          \`
elements+=\`<w-card class="w-h-100" variant="text" hover="" title="Two Flavors" text="Use utility classes for direct control or Light-DOM web components for declarative UI." id="\${ty_escapeAttr(ty_generateId('7fd1358a', 'id'))}">\`
elements+=\`</w-card>\`
elements+=\`
        \`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="4" id="\${ty_escapeAttr(ty_generateId('264439be', 'id'))}">\`
elements+=\`
          \`
elements+=\`<w-card class="w-h-100" variant="text" hover="" title="Accessible" text="Keyboard navigation, focus management, semantic roles, and ARIA behavior are built in." id="\${ty_escapeAttr(ty_generateId('2b7b4200', 'id'))}">\`
elements+=\`</w-card>\`
elements+=\`
        \`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="4" id="\${ty_escapeAttr(ty_generateId('caae2e54', 'id'))}">\`
elements+=\`
          \`
elements+=\`<w-card class="w-h-100" variant="text" hover="" title="Adaptive" text="Container queries and responsive primitives reshape interfaces for desktop, tablet, and mobile." id="\${ty_escapeAttr(ty_generateId('1c152555', 'id'))}">\`
elements+=\`</w-card>\`
elements+=\`
        \`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="4" id="\${ty_escapeAttr(ty_generateId('1cee26de', 'id'))}">\`
elements+=\`
          \`
elements+=\`<w-card class="w-h-100" variant="text" hover="" title="Lightweight" id="\${ty_escapeAttr(ty_generateId('48dc29ff', 'id'))}">\`
elements+=\`
            \`
elements+=\`<span slot="text" id="\${ty_escapeAttr(ty_generateId('a818411d', 'id'))}">\`
elements+=\`<span data-w-size="duvay.min.css" id="\${ty_escapeAttr(ty_generateId('965278ed', 'id'))}">\`
elements+=\`~258 KB\`
elements+=\`</span>\`
elements+=\` minified CSS, \`
elements+=\`<span data-w-size="duvay.min.js" id="\${ty_escapeAttr(ty_generateId('3925723f', 'id'))}">\`
elements+=\`~7 KB\`
elements+=\`</span>\`
elements+=\` behavior, and an optional \`
elements+=\`<span data-w-size="duvay-motion.min.js" id="\${ty_escapeAttr(ty_generateId('8690ab22', 'id'))}">\`
elements+=\`~10 KB\`
elements+=\`</span>\`
elements+=\` motion add-on.\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`</w-card>\`
elements+=\`
        \`
elements+=\`</w-col>\`
elements+=\`
      \`
elements+=\`</w-row>\`
elements+=\`
    \`
elements+=\`</section>\`
elements+=\`
  \`
elements+=\`</w-container>\`
elements+=\`
\`
elements+=\`</w-app>\`
elements+=\`
\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
