import fs from 'fs/promises';
import path from 'path';

function formatSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
}

// 添加类型定义
interface BundleInfo {
    path: string;
    name: string;
}

interface AssetInfo {
    name: string;
    size: number;
}

interface ModuleInfo {
    name: string;
    size: number;
}

interface BundleStats {
    assets: AssetInfo[];
    modules: ModuleInfo[];
}

interface AssetsByType {
    [key: string]: number;
}

async function analyzeBundle() {
    try {
        const bundles: Record<string, BundleInfo> = {
            client: {
                path: path.join(process.cwd(), '.next/server/chunks/.next/analyze/stats.json'),
                name: 'Client Bundle (客户端)'
            },
            server: {
                path: path.join(process.cwd(), '.next/server/.next/analyze/stats.json'),
                name: 'Server Bundle (服务端)'
            }
        };

        for (const [type, bundle] of Object.entries(bundles)) {
            try {
                const stats = JSON.parse(await fs.readFile(bundle.path, 'utf8')) as BundleStats;

                // 分类统计不同类型文件的大小
                const assetsByType = stats.assets.reduce<AssetsByType>((acc, asset) => {
                    const ext = path.extname(asset.name);
                    acc[ext] = (acc[ext] || 0) + asset.size;
                    return acc;
                }, {});

                // 显示总体统计
                const totalSize = stats.assets.reduce((acc, asset) => acc + asset.size, 0);
                console.log(`\n总构建大小: ${formatSize(totalSize)}`);

                // 显示分类统计
                const assetsByExt = new Map<string, AssetInfo[]>();
                
                stats.assets.forEach((asset) => {
                    const ext = path.extname(asset.name) || 'no-extension';
                    const files = assetsByExt.get(ext) || [];
                    assetsByExt.set(ext, [...files, asset]);
                });

                // 显示每种类型的总大小和最大的文件
                for (const [ext, files] of Array.from(assetsByExt.entries())) {
                    const totalSize = files.reduce<number>((sum, file) => sum + file.size, 0);
                    console.log(`\n${ext}: `.padEnd(15), formatSize(totalSize));
                    
                    console.log('  最大的文件:');
                    [...files]
                        .sort((a, b) => b.size - a.size)
                        .slice(0, 10)
                        .forEach(file => {
                            console.log(`  - ${file.name.padEnd(60)} ${formatSize(file.size)}`);
                        });
                }

                // 显示主要依赖
                const moduleGroups = new Map<string, number>();
                stats.modules.forEach((m) => {
                    if (m.name.includes('node_modules')) {
                        const pkgName = m.name.split('node_modules/')[1].split('/')[0];
                        const currentSize = moduleGroups.get(pkgName) || 0;
                        moduleGroups.set(pkgName, currentSize + m.size);
                    }
                });

                console.log('\n主要依赖模块:');
                console.log('Module'.padEnd(70), 'Size'.padEnd(15));
                console.log('='.repeat(85));

                Array.from(moduleGroups)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 10)
                    .forEach(([name, size]) => {
                        console.log(name.padEnd(70), formatSize(size));
                    });

                if (type === 'server') {
                    console.log('\n服务端特有组件:');
                    stats.modules
                        .filter((m) =>
                            m.name.includes('/pages/') ||
                            m.name.includes('/api/') ||
                            m.name.includes('/app/')
                        )
                        .sort((a, b) => b.size - a.size)
                        .slice(0, 5)
                        .forEach((m) => {
                            const name = m.name.replace(process.cwd(), '');
                            console.log(name.padEnd(70), formatSize(m.size));
                        });
                }
            } catch (err) {
                console.warn(`\n⚠️ 无法分析 ${bundle.name}`);
            }
        }
    } catch (err) {
        console.error('分析失败:', err);
    }
}

analyzeBundle().catch(console.error);