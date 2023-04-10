/*
JSON Data Structure:

{
    "files": {
        "file.txt": "Hello World!"
    },
    "directories": {
        "folder": {
            "files": {
                "file.txt": "Hello World!"
            },
            "directories": {}
        }
    }
}
*/

let rootName = "storage_file_system";

function _filePath(path: string): string {
    path = _combinePaths([path]);

    const directories = path.split("/");
    const end = directories.pop();

    let currentPath = JSON.parse(settings.readString(rootName));
    directories.forEach(directory => {
        currentPath = currentPath.directories[directory] || null;
    });

    return currentPath.files[end] || null;
}

type Files = { [fileName: string]: string }
type Directories = { [directoryName: string]: Directory }

type Directory = {
    files: Files,
    directories: Directories
}

function _directoryPath(path: string): Directory {
    const storage = JSON.parse(settings.readString(rootName));

    if (path == "") {
        return storage;
    }

    path = _combinePaths([path]);
    const directories = path.split("/");

    let currentPath = storage;
    directories.forEach(directory => {
        currentPath = currentPath.directories[directory] || null;
    });

    return currentPath || null;
}

enum Include {
    with,
    without
}

function _endsWith(str: string, searchValue: string, position?: number): boolean {
    if (position === undefined || position > str.length) {
        position = str.length;
    }
    return str.substr(position - searchValue.length, searchValue.length) === searchValue;
}

function _combinePaths(paths: string[]): string {
    let result = "";

    paths.forEach((path, index) => {
        if (_endsWith(path, "/") || _endsWith(path, "\\")) {
            path = path.slice(0, -1);
        }

        if (index == paths.length - 1) {
            result += path.replace("\\", "/");
        } else {
            result += path.replace("\\", "/") + "/";
        }
    });

    return result;
}

//% color="#C47713" icon="\uf07c" weight=20 block="Storage"
//% groups=['Configuration', 'Files', 'Directories', 'Path']
namespace storage {
    //% block="set|root|name|to $name"
    //% blockId="set_root_name"
    //% group='Configuration'
    //% name.defl="storage_file_system"
    //% weight=16
    export function setRootName(name: string): void {
        rootName = name;
    }

    //% block="set|up|file|system"
    //% blockId="setup"
    //% group='Configuration'
    //% weight=15
    export function setup(): void {
        if (!settings.exists(rootName)) {
            settings.writeString(rootName, JSON.stringify({
                "files": {},
                "directories": {}
            }));
        }
    }

    //% block="write|file|at|path $path with content $content"
    //% blockId="write_file"
    //% group='Files'
    //% path.defl="file.txt"
    //% content.defl="Hello World!"
    //% weight=14
    export function writeFile(path: string, content: string): void {
        let directory = _directoryPath(path);
        const file = namePath(path, Include.with);

        directory.files[file] = content;

        let storage = JSON.parse(settings.readString(rootName));
        // Finish code

        settings.writeString(rootName, JSON.stringify(storage));
    }

    //% block="read|file|at|path $path"
    //% blockId="read_file"
    //% group='Files'
    //% path.defl="file.txt"
    //% weight=13
    export function readFile(path: string): string {
        return _filePath(path);
    }

    //% block="rename|file|at|path $path to|name $name"
    //% blockId="rename_file"
    //% group='Files'
    //% path.defl="file.txt"
    //% name.defl="file2.txt"
    //% weight=12
    export function renameFile(path: string, name: string): void {
        const content = readFile(path);
        deleteFile(path);

        const renamePath = _combinePaths([directoriesPath(path), name]);
        writeFile(renamePath, content);
    }

    //% block="file|at|path $path exists?"
    //% blockId="file_exists"
    //% group='Files'
    //% path.defl="file.txt"
    //% weight=11
    export function fileExists(path: string): boolean {
        try {
            return _filePath(path) != null;
        } catch {
            return false
        }
    }

    //% block="delete|file|at|path $path"
    //% blockId="delete_file"
    //% group='Files'
    //% path.defl="file.txt"
    //% weight=10
    export function deleteFile(path: string): void {

    }

    //% block="create|directory|at|path $path"
    //% blockId="create_directory"
    //% group='Directories'
    //% path.defl="folder"
    //% weight=9
    export function createDirectory(path: string): void {

    }

    //% block="rename|directory|at|path $path to|name $name"
    //% blockId="rename_directory"
    //% group='Directories'
    //% path.defl="folder"
    //% name.defl="folder2"
    //% weight=8
    export function renameDirectory(path: string, name: string): void {

    }

    //% block="directory|at|path $path exists?"
    //% blockId="directory_exists"
    //% group='Directories'
    //% path.defl="folder"
    //% weight=7
    export function directoryExists(path: string): boolean {
        try {
            return _directoryPath(path) != null;
        } catch {
            return false
        }
    }

    //% block="delete|directory|at|path $path"
    //% blockId="delete_directory"
    //% group='Directories'
    //% path.defl="folder"
    //% weight=6
    export function deleteDirectory(path: string): void {

    }

    //% block="list|files|at|path $path"
    //% blockId="list_files"
    //% group='Directories'
    //% path.defl="folder"
    //% weight=5
    export function listFiles(path: string): Files {
        return _directoryPath(path).files;
    }

    //% block="list|directories|at|path $path"
    //% blockId="list_directories"
    //% group='Directories'
    //% path.defl="folder"
    //% weight=4
    export function listDirectories(path: string): Directories {
        return _directoryPath(path).directories;
    }

    //% block="name|of|path $path $include extension"
    //% blockId="name_path"
    //% group='Path'
    //% path.defl="file.txt"
    //% weight=3
    export function namePath(path: string, include: Include): string {
        path = combinePaths([path]);

        const names = path.split("/");
        const name = names[names.length - 1];

        switch (include) {
            case Include.with:
                return name;
            case Include.without:
                return name.split(".")[0];
            default:
                return "";
        }
    }

    //% block="extension|of|path $path"
    //% blockId="extension_path"
    //% group='Path'
    //% path.defl="file.txt"
    //% weight=2
    export function extensionPath(path: string): string {
        if (!path.includes(".")) {
            return "";
        }

        const extensions = path.split(".");
        return extensions[extensions.length - 1];
    }

    //% block="get|directories|of|path $path"
    //% blockId="directories_path"
    //% group='Path'
    //% path.defl="folder/file.txt"
    //% weight=1
    export function directoriesPath(path: string): string {
        path = _combinePaths([path]);

        const names = path.split("/");
        names.pop();

        const directoriesPath = names.join("/");
        return directoriesPath;
    }

    //% block="combine|paths $paths"
    //% blockId="combine_paths"
    //% group='Path'
    //% weight=0
    export function combinePaths(paths: string[]): string {
        return _combinePaths(paths);
    }
}