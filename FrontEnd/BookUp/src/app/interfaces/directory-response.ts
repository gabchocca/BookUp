export interface DirectoryResponse {
  current_path: string;
  parent_path: string | null;
  folders: string[];
  files: string[];
}
