import { FC, RefObject, useEffect, useRef, useState } from "react";
import { MonacoEditorReactComp } from "@typefox/monaco-editor-react";
import {
  defaultViewsInit,
  MonacoVscodeApiConfig,
} from "monaco-languageclient/vscodeApiWrapper";
import { EditorAppConfig } from "monaco-languageclient/editorApp";
import getLogServiceOverride, {
  ILogger,
} from "@codingame/monaco-vscode-log-service-override";
import getModelServiceOverride from "@codingame/monaco-vscode-model-service-override";
import getNotificationServiceOverride from "@codingame/monaco-vscode-notifications-service-override";
import getDialogsServiceOverride from "@codingame/monaco-vscode-dialogs-service-override";
import getTextmateServiceOverride from "@codingame/monaco-vscode-textmate-service-override";
import getThemeServiceOverride from "@codingame/monaco-vscode-theme-service-override";
import getLanguagesServiceOverride from "@codingame/monaco-vscode-languages-service-override";
import getSecretStorageServiceOverride from "@codingame/monaco-vscode-secret-storage-service-override";
import getAuthenticationServiceOverride from "@codingame/monaco-vscode-authentication-service-override";
import getScmServiceOverride from "@codingame/monaco-vscode-scm-service-override";
import getExtensionGalleryServiceOverride from "@codingame/monaco-vscode-extension-gallery-service-override";
import getBannerServiceOverride from "@codingame/monaco-vscode-view-banner-service-override";
import getStatusBarServiceOverride from "@codingame/monaco-vscode-view-status-bar-service-override";
import getTitleBarServiceOverride from "@codingame/monaco-vscode-view-title-bar-service-override";
import getDebugServiceOverride from "@codingame/monaco-vscode-debug-service-override";
import getPreferencesServiceOverride from "@codingame/monaco-vscode-preferences-service-override";
import getSnippetServiceOverride from "@codingame/monaco-vscode-snippets-service-override";
import getOutputServiceOverride from "@codingame/monaco-vscode-output-service-override";
import getSearchServiceOverride from "@codingame/monaco-vscode-search-service-override";
import getMarkersServiceOverride from "@codingame/monaco-vscode-markers-service-override";
import getAccessibilityServiceOverride from "@codingame/monaco-vscode-accessibility-service-override";
import getLanguageDetectionWorkerServiceOverride from "@codingame/monaco-vscode-language-detection-worker-service-override";
import getStorageServiceOverride from "@codingame/monaco-vscode-storage-service-override";
import getExtensionServiceOverride from "@codingame/monaco-vscode-extensions-service-override";
import getRemoteAgentServiceOverride from "@codingame/monaco-vscode-remote-agent-service-override";
import getEnvironmentServiceOverride from "@codingame/monaco-vscode-environment-service-override";
import getLifecycleServiceOverride from "@codingame/monaco-vscode-lifecycle-service-override";
import getWorkspaceTrustOverride from "@codingame/monaco-vscode-workspace-trust-service-override";
import getWorkingCopyServiceOverride from "@codingame/monaco-vscode-working-copy-service-override";
import getTestingServiceOverride from "@codingame/monaco-vscode-testing-service-override";
import getChatServiceOverride from "@codingame/monaco-vscode-chat-service-override";
import getNotebookServiceOverride from "@codingame/monaco-vscode-notebook-service-override";
import getWelcomeServiceOverride from "@codingame/monaco-vscode-welcome-service-override";
import getWalkThroughServiceOverride from "@codingame/monaco-vscode-walkthrough-service-override";
import getUserDataSyncServiceOverride from "@codingame/monaco-vscode-user-data-sync-service-override";
import getUserDataProfileServiceOverride from "@codingame/monaco-vscode-user-data-profile-service-override";
import getAiServiceOverride from "@codingame/monaco-vscode-ai-service-override";
import getTaskServiceOverride from "@codingame/monaco-vscode-task-service-override";
import getOutlineServiceOverride from "@codingame/monaco-vscode-outline-service-override";
import getTimelineServiceOverride from "@codingame/monaco-vscode-timeline-service-override";
import getCommentsServiceOverride from "@codingame/monaco-vscode-comments-service-override";
import getEditSessionsServiceOverride from "@codingame/monaco-vscode-edit-sessions-service-override";
import getEmmetServiceOverride from "@codingame/monaco-vscode-emmet-service-override";
import getInteractiveServiceOverride from "@codingame/monaco-vscode-interactive-service-override";
import getIssueServiceOverride from "@codingame/monaco-vscode-issue-service-override";
import getMultiDiffEditorServiceOverride from "@codingame/monaco-vscode-multi-diff-editor-service-override";
import getPerformanceServiceOverride from "@codingame/monaco-vscode-performance-service-override";
import getRelauncherServiceOverride from "@codingame/monaco-vscode-relauncher-service-override";
import getShareServiceOverride from "@codingame/monaco-vscode-share-service-override";
import getSpeechServiceOverride from "@codingame/monaco-vscode-speech-service-override";
import getSurveyServiceOverride from "@codingame/monaco-vscode-survey-service-override";
import getUpdateServiceOverride from "@codingame/monaco-vscode-update-service-override";
import getExplorerServiceOverride from "@codingame/monaco-vscode-explorer-service-override";
import getLocalizationServiceOverride from "@codingame/monaco-vscode-localization-service-override";
import getTreeSitterServiceOverride from "@codingame/monaco-vscode-treesitter-service-override";
import getTelemetryServiceOverride from "@codingame/monaco-vscode-telemetry-service-override";
import getMcpServiceOverride from "@codingame/monaco-vscode-mcp-service-override";
import getProcessControllerServiceOverride from "@codingame/monaco-vscode-process-explorer-service-override";
import getImageResizeServiceOverride from "@codingame/monaco-vscode-image-resize-service-override";
import getAssignmentServiceOverride from "@codingame/monaco-vscode-assignment-service-override";
import getConfigurationServiceOverride from "@codingame/monaco-vscode-configuration-service-override";
import getKeybindingsServiceOverride from "@codingame/monaco-vscode-keybindings-service-override";
import { createDefaultLocaleConfiguration } from "monaco-languageclient/vscodeApiLocales";
import "./index.css";
import * as vscode from "vscode";
import {
  createIndexedDBProviders,
  initFile,
  registerHTMLFileSystemProvider,
} from "@codingame/monaco-vscode-files-service-override";
import "@codingame/monaco-vscode-coffeescript-default-extension";
import "@codingame/monaco-vscode-cpp-default-extension";
import "@codingame/monaco-vscode-csharp-default-extension";
import "@codingame/monaco-vscode-css-default-extension";
import "@codingame/monaco-vscode-diff-default-extension";
import "@codingame/monaco-vscode-fsharp-default-extension";
import "@codingame/monaco-vscode-go-default-extension";
import "@codingame/monaco-vscode-groovy-default-extension";
import "@codingame/monaco-vscode-html-default-extension";
import "@codingame/monaco-vscode-java-default-extension";
import "@codingame/monaco-vscode-javascript-default-extension";
import "@codingame/monaco-vscode-json-default-extension";
import "@codingame/monaco-vscode-julia-default-extension";
import "@codingame/monaco-vscode-lua-default-extension";
import "@codingame/monaco-vscode-markdown-basics-default-extension";
import "@codingame/monaco-vscode-objective-c-default-extension";
import "@codingame/monaco-vscode-perl-default-extension";
import "@codingame/monaco-vscode-php-default-extension";
import "@codingame/monaco-vscode-powershell-default-extension";
import "@codingame/monaco-vscode-python-default-extension";
import "@codingame/monaco-vscode-r-default-extension";
import "@codingame/monaco-vscode-ruby-default-extension";
import "@codingame/monaco-vscode-rust-default-extension";
import "@codingame/monaco-vscode-scss-default-extension";
import "@codingame/monaco-vscode-shellscript-default-extension";
import "@codingame/monaco-vscode-sql-default-extension";
import "@codingame/monaco-vscode-swift-default-extension";
import "@codingame/monaco-vscode-typescript-basics-default-extension";
import "@codingame/monaco-vscode-vb-default-extension";
import "@codingame/monaco-vscode-xml-default-extension";
import "@codingame/monaco-vscode-yaml-default-extension";
import "@codingame/monaco-vscode-theme-defaults-default-extension";
import "@codingame/monaco-vscode-theme-seti-default-extension";
import "@codingame/monaco-vscode-references-view-default-extension";
import "@codingame/monaco-vscode-search-result-default-extension";
import "@codingame/monaco-vscode-configuration-editing-default-extension";
import "@codingame/monaco-vscode-markdown-math-default-extension";
import "@codingame/monaco-vscode-npm-default-extension";
import "@codingame/monaco-vscode-media-preview-default-extension";
import "@codingame/monaco-vscode-ipynb-default-extension";
import "@codingame/monaco-vscode-simple-browser-default-extension";
import { LogLevel } from "@codingame/monaco-vscode-api/vscode/vs/platform/log/common/log";
import {
  defineDefaultWorkerLoaders,
  useWorkerFactory,
  Worker as _Worker,
} from "monaco-languageclient/workerFactory";

const configureDefaultWorkerFactory = (logger?: ILogger) => {
  const editorWorkerService = () =>
    new _Worker(new URL("../../workers/editor.worker.js", import.meta.url), {
      type: "module",
    });
  const LocalFileSearchWorker = () =>
    new _Worker(new URL("../../workers/search.worker.js", import.meta.url), {
      type: "module",
    });
  const TextMateWorker = () =>
    new _Worker(new URL("../../workers/textmate.worker.js", import.meta.url), {
      type: "module",
    });
  const extensionHostWorkerMain = () =>
    new _Worker(new URL("../../workers/extension.worker.js", import.meta.url), {
      type: "module",
    });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useWorkerFactory({
    workerLoaders: {
      ...defineDefaultWorkerLoaders(),
      editorWorkerService,
      LocalFileSearchWorker,
      TextMateWorker,
      extensionHostWorkerMain,
    },
    logger,
  });
};

export const Vscode: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    (async () => {
      if (mounted) return;
      await createIndexedDBProviders();
      const workspaceFile = vscode.Uri.from({
        scheme: "tmp",
        path: "/.code-workspace",
      });
      await initFile(
        workspaceFile,
        JSON.stringify(
          {
            folders: [],
          },
          null,
          2,
        ),
      );
      registerHTMLFileSystemProvider();
      setMounted(true);
    })();
  });

  return (
    <div
      className={
        "[&_::before]:box-content [&_.monaco-tl-twistie]:box-content relative"
      }
    >
      <div ref={containerRef}>
        <div id="workbench-container">
          <div id="titleBar"></div>
          <div id="banner"></div>
          <div id="workbench-top">
            <div id="sidebarDiv">
              <div id="activityBar"></div>
              <div id="sidebar"></div>
              <div id="auxiliaryBar-left"></div>
            </div>
            <div id="editorsDiv">
              <div id="editors"></div>
            </div>
            <div id="sidebarRightDiv">
              <div id="sidebar-right"></div>
              <div id="activityBar-right"></div>
              <div id="auxiliaryBar"></div>
            </div>
          </div>
          <div id="panel"></div>
          <div id="statusBar"></div>
        </div>
        {mounted && <VscodeViews container={containerRef} />}
      </div>
    </div>
  );
};

const VscodeViews: FC<{ container: RefObject<HTMLDivElement | null> }> = ({
  container,
}) => {
  const vscodeApiConfig: MonacoVscodeApiConfig = {
    $type: "extended",
    logLevel: LogLevel.Debug,
    viewsConfig: {
      $type: "ViewsService",
      htmlContainer: container.current!,
      viewsInitFunc: defaultViewsInit,
    },
    workspaceConfig: {
      workspaceProvider: {
        trusted: true,
        workspace: {
          workspaceUri: vscode.Uri.from({
            scheme: "tmp",
            path: "/.code-workspace",
          }),
        },
        async open() {
          window.open(window.location.href);
          return true;
        },
      },
    },
    advanced: {
      enableExtHostWorker: true,
    },
    userConfiguration: {
      json: JSON.stringify({
        "workbench.colorTheme": "Default Light Modern",
        "editor.wordBasedSuggestions": "off",
        "window.menuBarVisibility": "classic",
      }),
    },
    serviceOverrides: {
      ...getAuthenticationServiceOverride(),
      ...getLogServiceOverride(),
      ...getExtensionServiceOverride({
        enableWorkerExtensionHost: true,
      }),
      ...getExtensionGalleryServiceOverride({ webOnly: false }),
      ...getModelServiceOverride(),
      ...getNotificationServiceOverride(),
      ...getDialogsServiceOverride(),
      ...getConfigurationServiceOverride(),
      ...getKeybindingsServiceOverride(),
      ...getTextmateServiceOverride(),
      ...getTreeSitterServiceOverride(),
      ...getThemeServiceOverride(),
      ...getLanguagesServiceOverride(),
      ...getDebugServiceOverride(),
      ...getPreferencesServiceOverride(),
      ...getOutlineServiceOverride(),
      ...getTimelineServiceOverride(),
      ...getBannerServiceOverride(),
      ...getStatusBarServiceOverride(),
      ...getTitleBarServiceOverride(),
      ...getSnippetServiceOverride(),
      ...getOutputServiceOverride(),
      ...getSearchServiceOverride(),
      ...getMarkersServiceOverride(),
      ...getAccessibilityServiceOverride(),
      ...getLanguageDetectionWorkerServiceOverride(),
      ...getStorageServiceOverride({
        fallbackOverride: {
          "workbench.activity.showAccounts": false,
        },
      }),
      ...getRemoteAgentServiceOverride({ scanRemoteExtensions: true }),
      ...getLifecycleServiceOverride(),
      ...getEnvironmentServiceOverride(),
      ...getWorkspaceTrustOverride(),
      ...getWorkingCopyServiceOverride(),
      ...getScmServiceOverride(),
      ...getTestingServiceOverride(),
      ...getChatServiceOverride(),
      ...getNotebookServiceOverride(),
      ...getWelcomeServiceOverride(),
      ...getWalkThroughServiceOverride(),
      ...getUserDataProfileServiceOverride(),
      ...getUserDataSyncServiceOverride(),
      ...getAiServiceOverride(),
      ...getTaskServiceOverride(),
      ...getCommentsServiceOverride(),
      ...getEditSessionsServiceOverride(),
      ...getEmmetServiceOverride(),
      ...getInteractiveServiceOverride(),
      ...getIssueServiceOverride(),
      ...getMultiDiffEditorServiceOverride(),
      ...getPerformanceServiceOverride(),
      ...getRelauncherServiceOverride(),
      ...getShareServiceOverride(),
      ...getSpeechServiceOverride(),
      ...getSurveyServiceOverride(),
      ...getUpdateServiceOverride(),
      ...getExplorerServiceOverride(),
      ...getLocalizationServiceOverride(createDefaultLocaleConfiguration()),
      ...getSecretStorageServiceOverride(),
      ...getTelemetryServiceOverride(),
      ...getMcpServiceOverride(),
      ...getProcessControllerServiceOverride(),
      ...getImageResizeServiceOverride(),
      ...getAssignmentServiceOverride(),
    },
    monacoWorkerFactory: configureDefaultWorkerFactory,
  };
  // editor app / monaco-editor configuration
  const editorAppConfig: EditorAppConfig = {};
  return (
    <MonacoEditorReactComp
      vscodeApiConfig={vscodeApiConfig}
      editorAppConfig={editorAppConfig}
      onError={e => {
        console.error("错误", e);
      }}
    />
  );
};
