import fs from 'node:fs';
import path from 'node:path';

export default async function fileLoader(
    folderPath: string,
    callback: (filePath: string) => Promise<void>,
    recursive: boolean = false,
): Promise<void> {
    const entities = fs.readdirSync(folderPath);

    for (const entity of entities) {
        const entityPath = path.join(folderPath, entity);

        if (recursive && fs.statSync(entityPath).isDirectory()) {
            await fileLoader(entityPath, callback, true);
            continue;
        }

        if (!/\.[jt]s$/.test(path.extname(entityPath))) {
            continue;
        }

        await callback(entityPath);
    }
}