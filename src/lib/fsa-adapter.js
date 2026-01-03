class FSAAdapter {
    constructor (dirHandle) {
        this.dirHandle = dirHandle;
    }

    async _getHandle (path, options = {}) {
        const parts = path.split('/').filter(p => p && p !== '.');
        let currentHandle = this.dirHandle;
        for (let i = 0; i < parts.length - 1; i++) {
            currentHandle = await currentHandle.getDirectoryHandle(parts[i], {create: options.create});
        }
        if (parts.length === 0) return this.dirHandle;
        
        const lastPart = parts[parts.length - 1];
        if (options.isDirectory) {
            return currentHandle.getDirectoryHandle(lastPart, {create: options.create});
        }
        return currentHandle.getFileHandle(lastPart, {create: options.create});
    }

    async readFile (path) {
        const handle = await this._getHandle(path);
        const file = await handle.getFile();
        return new Uint8Array(await file.arrayBuffer());
    }

    async writeFile (path, data) {
        const handle = await this._getHandle(path, {create: true});
        const writable = await handle.createWritable();
        await writable.write(data);
        await writable.close();
    }

    async mkdir (path) {
        await this._getHandle(path, {create: true, isDirectory: true});
    }

    async readdir (path) {
        const handle = await this._getHandle(path, {isDirectory: true});
        const result = [];
        for await (const entry of handle.values()) {
            result.push(entry.name);
        }
        return result;
    }

    async stat (path) {
        const parts = path.split('/').filter(p => p && p !== '.');
        if (parts.length === 0) {
            return {
                isDirectory: () => true,
                isFile: () => false,
                mtimeMs: Date.now(),
                size: 0
            };
        }
        const lastPart = parts[parts.length - 1];
        const parentPath = parts.slice(0, -1).join('/');
        const parentHandle = await this._getHandle(parentPath, {isDirectory: true});
        
        try {
            const handle = await parentHandle.getFileHandle(lastPart);
            const file = await handle.getFile();
            return {
                isDirectory: () => false,
                isFile: () => true,
                mtimeMs: file.lastModified,
                size: file.size
            };
        } catch (e) {
            try {
                await parentHandle.getDirectoryHandle(lastPart);
                return {
                    isDirectory: () => true,
                    isFile: () => false,
                    mtimeMs: Date.now(),
                    size: 0
                };
            } catch (e2) {
                throw e;
            }
        }
    }

    async unlink (path) {
        const parts = path.split('/').filter(p => p);
        const lastPart = parts.pop();
        const parentPath = parts.join('/');
        const parentHandle = await this._getHandle(parentPath, {isDirectory: true});
        await parentHandle.removeEntry(lastPart);
    }

    async rmdir (path) {
        const parts = path.split('/').filter(p => p);
        const lastPart = parts.pop();
        const parentPath = parts.join('/');
        const parentHandle = await this._getHandle(parentPath, {isDirectory: true});
        await parentHandle.removeEntry(lastPart, {recursive: true});
    }

    // Isomorphic-git might need these
    lstat (path) {
        return this.stat(path);
    }
    readlink () {
        throw new Error('Not implemented');
    }
    symlink () {
        throw new Error('Not implemented');
    }
    async chmod () {
        /* no-op in browser */
    }
}

export default FSAAdapter;
