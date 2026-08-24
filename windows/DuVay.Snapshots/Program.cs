// DuVay — WinUI control-surface snapshot (Windows)
//
// The plan requires a snapshot suite per platform before a tier may be
// published as supported. This is the Windows one, and it is deliberately
// structural rather than visual.
//
// WinAppDriver — the tool the plan names — drives a running app on a visible
// desktop. The Windows gate reaches the host over SSH, where
// [Environment]::UserInteractive is False and there is no desktop session to
// attach to, so a pixel suite cannot run there at all. Rather than ship a suite
// that is permanently skipped, this captures what the library actually
// declares: every control, the WinUI type it extends, and its public surface.
//
// That is not a substitute for a visual pass, and the plan's manual
// screen-reader pass on Windows still stands. It does catch the regressions
// this layer produces: a control silently changing base type (several WinUI
// types are sealed, so DuVay composes instead of subclassing, and which
// strategy a control uses is exactly the kind of thing that drifts), or a
// property disappearing from the public API.
//
// Metadata only — System.Reflection.Metadata reads the tables directly, so
// nothing is loaded or executed and no Windows App SDK runtime is required.
// The tool therefore runs on any machine that has the built DLL.
//
//   dotnet run --project DuVay.Snapshots -- <path-to-DuVay.dll> --record
//   dotnet run --project DuVay.Snapshots -- <path-to-DuVay.dll> --check

using System.Collections.Immutable;
using System.Reflection.Metadata;
using System.Reflection.PortableExecutable;
using System.Text;

static string Describe(MetadataReader reader, TypeDefinition type)
{
    var builder = new StringBuilder();
    var name = reader.GetString(type.Name);
    builder.Append(name).Append(" : ").Append(BaseName(reader, type)).Append('\n');

    // Public instance properties are the control's configuration surface.
    var properties = new List<string>();
    foreach (var handle in type.GetProperties())
    {
        var property = reader.GetPropertyDefinition(handle);
        var accessors = property.GetAccessors();
        if (!IsPublic(reader, accessors)) continue;
        properties.Add(reader.GetString(property.Name));
    }
    properties.Sort(StringComparer.Ordinal);
    foreach (var property in properties) builder.Append("  prop ").Append(property).Append('\n');

    var methods = new List<string>();
    foreach (var handle in type.GetMethods())
    {
        var method = reader.GetMethodDefinition(handle);
        if ((method.Attributes & System.Reflection.MethodAttributes.MemberAccessMask)
            != System.Reflection.MethodAttributes.Public) continue;
        var methodName = reader.GetString(method.Name);
        // Property accessors are already reported through the property itself.
        if (methodName.StartsWith("get_", StringComparison.Ordinal)
            || methodName.StartsWith("set_", StringComparison.Ordinal)) continue;
        methods.Add(methodName);
    }
    methods.Sort(StringComparer.Ordinal);
    foreach (var method in methods) builder.Append("  method ").Append(method).Append('\n');

    return builder.ToString();
}

static bool IsPublic(MetadataReader reader, PropertyAccessors accessors)
{
    foreach (var handle in new[] { accessors.Getter, accessors.Setter })
    {
        if (handle.IsNil) continue;
        var method = reader.GetMethodDefinition(handle);
        if ((method.Attributes & System.Reflection.MethodAttributes.MemberAccessMask)
            == System.Reflection.MethodAttributes.Public) return true;
    }
    return false;
}

// Resolved from the metadata tables rather than by loading the type, so a
// missing Windows App SDK cannot turn into a missing base type.
static string BaseName(MetadataReader reader, TypeDefinition type)
{
    var handle = type.BaseType;
    if (handle.IsNil) return "(none)";
    return handle.Kind switch
    {
        HandleKind.TypeReference => reader.GetString(reader.GetTypeReference((TypeReferenceHandle)handle).Name),
        HandleKind.TypeDefinition => reader.GetString(reader.GetTypeDefinition((TypeDefinitionHandle)handle).Name),
        _ => "(unresolved)",
    };
}

var arguments = args.ToList();
var record = arguments.Remove("--record");
arguments.Remove("--check");
if (arguments.Count == 0)
{
    Console.Error.WriteLine("usage: duvay-snapshots <DuVay.dll> [--record|--check]");
    return 2;
}

var assemblyPath = arguments[0];
if (!File.Exists(assemblyPath))
{
    Console.Error.WriteLine($"duvay-snapshots: {assemblyPath} not found — build DuVay.csproj first");
    return 2;
}

using var stream = File.OpenRead(assemblyPath);
using var peReader = new PEReader(stream);
var metadata = peReader.GetMetadataReader();

var descriptions = new List<string>();
foreach (var handle in metadata.TypeDefinitions)
{
    var type = metadata.GetTypeDefinition(handle);
    var typeName = metadata.GetString(type.Name);
    if (!typeName.StartsWith("DuVay", StringComparison.Ordinal)) continue;
    // Compiler-generated nested and closure types are not API.
    if (typeName.Contains('<', StringComparison.Ordinal)) continue;
    if ((type.Attributes & System.Reflection.TypeAttributes.VisibilityMask)
        != System.Reflection.TypeAttributes.Public) continue;
    descriptions.Add(Describe(metadata, type));
}

descriptions.Sort(StringComparer.Ordinal);
var snapshot = string.Join("\n", descriptions);

var storePath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "snapshots", "controls.txt");
storePath = Path.GetFullPath(storePath);

if (record)
{
    Directory.CreateDirectory(Path.GetDirectoryName(storePath)!);
    File.WriteAllText(storePath, snapshot);
    Console.WriteLine($"✓ recorded {descriptions.Count} WinUI control surfaces");
    return 0;
}

// A missing recording fails rather than silently passing: it would otherwise go
// green on a machine that has never seen the library.
if (!File.Exists(storePath))
{
    Console.Error.WriteLine("✗ no recording — run with --record");
    return 1;
}

var recorded = File.ReadAllText(storePath);
if (recorded.Replace("\r\n", "\n") == snapshot.Replace("\r\n", "\n"))
{
    Console.WriteLine($"✓ {descriptions.Count} WinUI control surfaces match");
    return 0;
}

Console.Error.WriteLine("✗ the WinUI control surface changed");
var before = recorded.Replace("\r\n", "\n").Split('\n');
var after = snapshot.Replace("\r\n", "\n").Split('\n');
foreach (var line in before.Except(after)) Console.Error.WriteLine($"  - {line}");
foreach (var line in after.Except(before)) Console.Error.WriteLine($"  + {line}");
return 1;
