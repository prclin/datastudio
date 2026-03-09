import type { LoaderDefinition } from "@rspack/core";
import { createFsFromVolume, IFs, Volume } from "memfs";
import * as yauzl from "yauzl";
import { Readable } from "node:stream";
import path from "node:path";
import { IExtensionManifest } from "@codingame/monaco-vscode-api/vscode/vs/platform/extensions/common/extensions";
import { getExtensionResources, parseJson } from "./extension-tools";
import nodeFs from "node:fs";
import { firstBy } from "thenby";
import { ExtensionFileMetadata } from "@codingame/monaco-vscode-files-service-override";

// Declare the type of loader options
type RspackVsixLoaderOptions = object;
const read = (stream: Readable): Promise<Buffer> => {
  const bufs: Buffer[] = [];
  return new Promise(resolve => {
    stream.on("data", d => {
      bufs.push(d);
    });
    stream.on("end", () => {
      resolve(Buffer.concat(bufs));
    });
  });
};
const readVsix = async (content: Buffer): Promise<IFs> => {
  return await new Promise(resolve => {
    const files: Record<string, Buffer> = {};
    yauzl.fromBuffer(content, { lazyEntries: true }, (err, zipfile) => {
      if (err != null) throw err;
      zipfile.readEntry();
      zipfile.on("entry", (entry: yauzl.Entry) => {
        if (
          /\/$/.test(entry.fileName) ||
          !entry.fileName.startsWith("extension/")
        ) {
          zipfile.readEntry();
        } else {
          zipfile.openReadStream(entry, async (err, readStream) => {
            if (err != null) throw err;
            readStream.on("end", () => {
              zipfile.readEntry();
            });
            files[entry.fileName.slice("extension/".length)] =
              await read(readStream);
          });
        }
      });
      zipfile.on("end", () => {
        resolve(createFsFromVolume(Volume.fromJSON(files, "/")));
      });
    });
  });
};
const getVsixPath = (file: string) => {
  return path.posix.relative("/", path.posix.resolve("/", file));
};

const id = "vsix";
const RspackVsixLoader: LoaderDefinition<RspackVsixLoaderOptions> = function (
  source,
) {
  const callback = this.async();
  const content = source as unknown as Buffer;
  (async () => {
    const vsixFS = await readVsix(content);
    const readFileSync = (filePath: string) =>
      vsixFS.readFileSync(path.join("/", filePath)) as Buffer;
    const manifest = parseJson<IExtensionManifest>(
      id,
      readFileSync("package.json").toString("utf8"),
    );

    const resources = await getExtensionResources(
      manifest,
      <typeof nodeFs>(<unknown>vsixFS),
      "/",
    );

    const resourcePaths = resources.map(r => r.path);
    const readmePath = resourcePaths.filter(child =>
      /^readme(\.txt|\.md|)$/i.test(child),
    )[0];
    const changelogPath = resourcePaths.filter(child =>
      /^changelog(\.txt|\.md|)$/i.test(child),
    )[0];

    const pathMapping = (
      await Promise.all(
        resources.map(async resource => {
          const assetPath = getVsixPath(resource.path);
          let url: string;
          if (process.env.NODE_ENV === "development") {
            const fileType = resource.mimeType ?? "text/javascript";
            url = `'data:${fileType};base64,${readFileSync(assetPath).toString("base64")}'`;
          } else {
            url =
              "import.meta.ROLLUP_FILE_URL_" +
              this.emitFile(
                `${path.basename(id)}/${path.basename(assetPath)}`,
                readFileSync(assetPath),
              );
          }

          return resource.extensionPaths.map(extensionPath => ({
            pathInExtension: getVsixPath(extensionPath),
            url,
            mimeType: resource.mimeType,
            size: resource.size,
          }));
        }),
      )
    )
      .flat()
      .sort(firstBy("pathInExtension"));
    callback(
      null,
      `
import { registerExtension } from '@codingame/monaco-vscode-api/extensions'

const manifest = ${JSON.stringify(manifest)}

const { registerFileUrl, whenReady } = registerExtension(manifest, undefined, ${JSON.stringify({ system: true, readmePath, changelogPath })})

${pathMapping
  .map(
    ({ pathInExtension, url, mimeType, size }) => `
registerFileUrl('${pathInExtension}', ${url}, ${JSON.stringify(<
      ExtensionFileMetadata
    >{
      mimeType,
      size,
    })})`,
  )
  .join("\n")}

export { whenReady }
`,
    );
  })();
};
export const raw = true;
export default RspackVsixLoader;
