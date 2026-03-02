import { FC } from "react";
import { IconDatastudio } from "@icons/IconDatastudio.tsx";
import { MonacoVscodeApiConfig } from "monaco-languageclient/vscodeApiWrapper";
import {
  defineDefaultWorkerLoaders,
  useWorkerFactory,
  Worker as _Worker,
} from "monaco-languageclient/workerFactory";
import { MonacoEditorReactComp } from "@typefox/monaco-editor-react";
import { EditorAppConfig } from "monaco-languageclient/editorApp";
import type { ILogger } from "@codingame/monaco-vscode-log-service-override";
import "@codingame/monaco-vscode-editor-api/esm/vs/editor/editor.worker.js";

const configureDefaultWorkerFactory = (logger?: ILogger) => {
  const editorWorkerService = () =>
    new _Worker(new URL("../../workers/editor.worker.js", import.meta.url), {
      type: "module",
    });
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useWorkerFactory({
    workerLoaders: {
      ...defineDefaultWorkerLoaders(),
      editorWorkerService,
    },
    logger,
  });
};
export const Studio: FC = () => {
  const vscodeApiConfig: MonacoVscodeApiConfig = {
    $type: "extended",
    viewsConfig: {
      $type: "EditorService",
    },
    userConfiguration: {
      json: JSON.stringify({
        "workbench.colorTheme": "Default Dark Modern",
        "editor.wordBasedSuggestions": "off",
      }),
    },
    monacoWorkerFactory: configureDefaultWorkerFactory,
  };
  // editor app / monaco-editor configuration
  const editorAppConfig: EditorAppConfig = {};
  return (
    <div className={"p-2"}>
      <MonacoEditorReactComp
        vscodeApiConfig={vscodeApiConfig}
        editorAppConfig={editorAppConfig}
        style={{ height: "90vh" }}
        onError={e => {
          console.error(e);
        }}
      />
    </div>
  );
};

export default Studio;
export const order = 2;
export const text = "side_studio";
export const icon = <IconDatastudio />;
export const path = "studio";
