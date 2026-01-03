import git from 'isomorphic-git';
import http from 'isomorphic-git/http/web';
import FS from '@isomorphic-git/lightning-fs';
import {Buffer} from 'buffer';
import FSAAdapter from './fsa-adapter';

// Ensure Buffer is available globally as some isomorphic-git parts might expect it
if (!window.Buffer) {
    window.Buffer = Buffer;
}

const defaultFs = new FS('git-storage');
const dir = '/repo';

class GitManager {
    constructor () {
        this.initialized = false;
        this.fs = defaultFs;
        this.dir = dir;
    }

    async setDirectoryHandle (handle) {
        this.fs = new FSAAdapter(handle);
        this.dir = '.'; // When using FSA, the handle itself is the repo root
        this.initialized = true;
    }

    async useDefaultFs () {
        this.fs = defaultFs;
        this.dir = dir;
        this.initialized = false;
        await this.init();
    }

    async init () {
        if (this.initialized) return;
        if (this.fs === defaultFs) {
            await this.fs.promises.mkdir(this.dir).catch(() => {});
        }
        this.initialized = true;
    }

    async clone (url) {
        await this.init();
        if (this.fs === defaultFs) {
            await this.clearDir(this.dir);
        }
        
        await git.clone({
            fs: this.fs,
            http,
            dir: this.dir,
            url: url,
            singleBranch: true,
            depth: 1
        });
    }

    async clearDir (path) {
        const files = await this.fs.promises.readdir(path);
        for (const file of files) {
            const filePath = path === '.' ? file : `${path}/${file}`;
            const stat = await this.fs.promises.stat(filePath);
            if (stat.isDirectory()) {
                await this.clearDir(filePath);
                await this.fs.promises.rmdir(filePath);
            } else {
                await this.fs.promises.unlink(filePath);
            }
        }
    }

    async commit (message, author = {name: 'User', email: 'user@example.com'}) {
        await this.init();
        await git.add({fs: this.fs, dir: this.dir, filepath: '.'});
        const sha = await git.commit({
            fs: this.fs,
            dir: this.dir,
            message: message,
            author: author
        });
        return sha;
    }

    async push (url, token) {
        await this.init();
        await git.push({
            fs: this.fs,
            http,
            dir: this.dir,
            url: url,
            onAuth: () => ({username: token})
        });
    }

    async pull (url) {
        await this.init();
        await git.pull({
            fs: this.fs,
            http,
            dir: this.dir,
            url: url,
            author: {name: 'User', email: 'user@example.com'}
        });
    }

    async status () {
        await this.init();
        return git.statusMatrix({fs: this.fs, dir: this.dir});
    }

    async writeFile (path, content) {
        await this.init();
        const fullPath = this.dir === '.' ? path : `${this.dir}/${path}`;
        const parts = fullPath.split('/');
        if (parts.length > 1) {
            let currentPath = '';
            for (let i = 0; i < parts.length - 1; i++) {
                currentPath += (i === 0 ? '' : '/') + parts[i];
                if (currentPath && currentPath !== '.') {
                    await this.fs.promises.mkdir(currentPath).catch(() => {});
                }
            }
        }
        await this.fs.promises.writeFile(fullPath, content);
    }

    async readFile (path) {
        await this.init();
        const fullPath = this.dir === '.' ? path : `${this.dir}/${path}`;
        return this.fs.promises.readFile(fullPath);
    }

    async listFiles (path = '.') {
        await this.init();
        const fullPath = path === '.' ? this.dir : (this.dir === '.' ? path : `${this.dir}/${path}`);
        const files = await this.fs.promises.readdir(fullPath);
        let result = [];
        for (const file of files) {
            if (file === '.git') continue;
            const relativePath = path === '.' ? file : `${path}/${file}`;
            const absolutePath = this.dir === '.' ? relativePath : `${this.dir}/${relativePath}`;
            const stat = await this.fs.promises.stat(absolutePath);
            if (stat.isDirectory()) {
                const subFiles = await this.listFiles(relativePath);
                result = result.concat(subFiles);
            } else {
                result.push(relativePath);
            }
        }
        return result;
    }
}

export default new GitManager();
