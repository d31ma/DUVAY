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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('f34cf7b8', 'id'))}">\`
elements+=\`Server-side Tables\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('0e81df09', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7b0ed031', 'id'))}">\`
elements+=\`w-data-table-server\`
elements+=\`</code>\`
elements+=\` shares all of \`
elements+=\`<a href="/docs/components/data-tables/introduction" id="\${ty_escapeAttr(ty_generateId('7100c6c7', 'id'))}">\`
elements+=\`data table\`
elements+=\`</a>\`
elements+=\`&#8217;s chrome but does \`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('038f1645', 'id'))}">\`
elements+=\`not\`
elements+=\`</strong>\`
elements+=\` filter, sort, or paginate locally. Instead \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3642d3ec', 'id'))}">\`
elements+=\`items\`
elements+=\`</code>\`
elements+=\` is the current page already prepared by your backend, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('04cdd014', 'id'))}">\`
elements+=\`items-length\`
elements+=\`</code>\`
elements+=\` is the total row count that drives the footer. When the user changes the page, page size, or sort, it emits \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('49469e0c', 'id'))}">\`
elements+=\`update:options\`
elements+=\`</code>\`
elements+=\` so you can fetch the matching slice and update \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4c15d9a2', 'id'))}">\`
elements+=\`items\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b466fe61', 'id'))}">\`
elements+=\`items-length\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('c6d75944', 'id'))}">\`
elements+=\`Example\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('98fd9968', 'id'))}">\`
elements+=\`The table holds only the current page of \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('db874206', 'id'))}">\`
elements+=\`items\`
elements+=\`</code>\`
elements+=\`; \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('27e88179', 'id'))}">\`
elements+=\`items-length\`
elements+=\`</code>\`
elements+=\` tells the footer there are 50 rows in total, so the pagination controls reflect the full set. Changing the page, size, or sort emits \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b94b7a5a', 'id'))}">\`
elements+=\`update:options\`
elements+=\`</code>\`
elements+=\` for your fetch handler (wired below).\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('5c65b48f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('68c987b0', 'id'))}">\`
elements+=\`
      \`
elements+=\`<table class="w-table" id="\${ty_escapeAttr(ty_generateId('afd97544', 'id'))}">\`
elements+=\`
        \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('646cad22', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e592d5ad', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('63f9c9bc', 'id'))}">\`
elements+=\`Item\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('f9a3aa9d', 'id'))}">\`
elements+=\`Value\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
        \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('1d8a9ff4', 'id'))}">\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('ff38bd5c', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('eeaec73f', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fbf500b7', 'id'))}">\`
elements+=\`3\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('a8c281ed', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('dce8af3b', 'id'))}">\`
elements+=\`Item 2\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('200150a0', 'id'))}">\`
elements+=\`6\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('27926d23', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9774bfcb', 'id'))}">\`
elements+=\`Item 3\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b848f367', 'id'))}">\`
elements+=\`9\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
        \`
elements+=\`</tbody>\`
elements+=\`
      \`
elements+=\`</table>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('9cdab0e3', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-data-table-server headers="[Item,Value]" items="[Item 1|3; Item 2|6; Item 3|9; Item 4|12; Item 5|15]" items-length="50" items-per-page="5" items-per-page-options="5,10,25" id="\${ty_escapeAttr(ty_generateId('c798025b', 'id'))}">\`
elements+=\`</w-data-table-server>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('5c0de72c', 'id'))}">\`
elements+=\`Wiring it up\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('49f97a28', 'id'))}">\`
elements+=\`In application code, listen for \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b86b8477', 'id'))}">\`
elements+=\`update:options\`
elements+=\`</code>\`
elements+=\`, fetch, then set the new \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('16015bf0', 'id'))}">\`
elements+=\`items\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('58c02107', 'id'))}">\`
elements+=\`items-length\`
elements+=\`</code>\`
elements+=\`:\`
elements+=\`</p>\`
elements+=\`<pre class="code-block" id="\${ty_escapeAttr(ty_generateId('496602ed', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c4293705', 'id'))}">\`
elements+=\`const table = document.querySelector('w-data-table-server');

table.addEventListener('update:options', async (e) =&gt; {
  const &#123; page, itemsPerPage, sortBy, sortDesc &#125; = e.detail;
  table.setAttribute('loading', '');
  const res = await fetch(\\\`/api/desserts?page=$&#123;page&#125;&amp;size=$&#123;itemsPerPage&#125;&amp;sort=$&#123;sortBy&#125;&amp;desc=$&#123;sortDesc&#125;\\\`);
  const &#123; rows, total &#125; = await res.json();
  table.items = rows;                       // current page only
  table.setAttribute('items-length', total); // total across all pages
  table.removeAttribute('loading');
&#125;);\`
elements+=\`</code>\`
elements+=\`</pre>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('5f2d18d2', 'id'))}">\`
elements+=\`Loading\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d2553738', 'id'))}">\`
elements+=\`Toggle \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('98831459', 'id'))}">\`
elements+=\`loading\`
elements+=\`</code>\`
elements+=\` around each fetch to show the progress bar.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('2e796fc0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-data-table w-data-table--loading" id="\${ty_escapeAttr(ty_generateId('95ae9b09', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-data-table-loader" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('09cd5167', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('a76ef4fa', 'id'))}">\`
elements+=\`
        \`
elements+=\`<table class="w-table" id="\${ty_escapeAttr(ty_generateId('71984943', 'id'))}">\`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('5385da36', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('5a502ec4', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('809aae33', 'id'))}">\`
elements+=\`Item\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('8474b712', 'id'))}">\`
elements+=\`Value\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
        \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('9f0bd4d0', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('38a4da29', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e0c391b5', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('abca72b2', 'id'))}">\`
elements+=\`3\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`</tbody>\`
elements+=\`</table>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('216770a7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-data-table-server loading="" headers="[Item,Value]" items="[Item 1|3; Item 2|6]" items-length="50" items-per-page="5" id="\${ty_escapeAttr(ty_generateId('86e47b1c', 'id'))}">\`
elements+=\`</w-data-table-server>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/components/data-tables/server-side-tables/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
