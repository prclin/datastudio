export interface Notebook {
  cells: Cell[];
  metadata: NotebookMetadata;
  nbformat: 4;
  nbformat_minor: 5;
}

export interface NotebookMetadata {
  kernelspec: { display_name: string; name: string };
  language_info: {
    file_extension?: ".fsql" | ".ssql" | ".hsql" | ".py" | ".scala";
    mimetype?:
      | "text/x-fsql"
      | "text/x-ssql"
      | "text/x-hsql"
      | "text/x-python"
      | "text/x-scala";
    name: "fsql" | "ssql" | "hsql" | "python" | "scala";
    version?: string;
  };
}

export interface Cell {
  id: string;
  cell_type: "code" | "markdown";
  metadata: CellMetadata;
  source: string[];
  outputs?: Output[];
  execution_count?: number;
}

export interface CellMetadata {
  editable?: boolean;
  jupyter?: { outputs_hidden?: boolean; source_hidden?: boolean };
}

export interface Output {
  output_type: "execute_result" | "display_data" | "stream" | "error";
  data?: { "text/plain"?: string[]; "text/html"?: string[] };
  metadata?: object;
  execution_count?: number;
  name?: string;
  text?: string[];
  ename?: string;
  evalue?: string;
  traceback?: string[];
}
