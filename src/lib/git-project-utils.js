import JSZip from 'jszip';
import gitManager from './git-manager';

const exportProjectToGit = async sb3Content => {
    const zip = await JSZip.loadAsync(sb3Content);
    const files = zip.files;
    
    for (const filename of Object.keys(files)) {
        if (files[filename].dir) continue;
        const content = await files[filename].async('uint8array');
        await gitManager.writeFile(filename, content);
    }
};

const importProjectFromGit = async () => {
    const zip = new JSZip();
    const files = await gitManager.listFiles();
    
    for (const filename of files) {
        const content = await gitManager.readFile(filename);
        zip.file(filename, content);
    }
    
    return zip.generateAsync({
        type: 'uint8array',
        mimeType: 'application/x-scratch3',
        compression: 'STORE'
    });
};

export {
    exportProjectToGit,
    importProjectFromGit
};
