<script lang="ts">
    export let data;
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    
    type FileItem = { name: string; url: string };
    let fileList: FileItem[] = [];

    onMount(() => {
        if (browser) {
            const stored = localStorage.getItem('fileList');
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    // Adapter l'ancien format (strings) au nouveau format (objets)
                    fileList = parsed.map((item: string | FileItem) => 
                        typeof item === 'string' 
                            ? { name: item, url: '' } 
                            : item
                    );
                } catch (e) {
                    fileList = [];
                }
            }
        }
        // Filtrer les fichiers qui n'existent plus dans data.fileList
        const serverUrls = new Set(data.fileList.map((f: FileItem) => f.url));
        fileList = fileList.filter(f => serverUrls.has(f.url));
        if (browser) {
            localStorage.setItem('fileList', JSON.stringify(fileList));
        }
    });

    async function handleSubmit(event: Event) {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (result.ok && result.url) {
            fileList.push({ name: result.filename, url: result.url });
            if (browser) {
                localStorage.setItem('fileList', JSON.stringify(fileList));
            }
        }
        window.location.reload();
    }

    async function deleteImage(file: FileItem) {
        const response = await fetch(`/api/remove`, {
            method: 'DELETE',
            body: JSON.stringify({ url: file.url })
        });
        const removed: { ok: boolean } = await response.json();
        if (removed.ok) {
            fileList = fileList.filter((f: FileItem) => f.url !== file.url);
            if (browser) {
                localStorage.setItem('fileList', JSON.stringify(fileList));
            }
        }
    }
</script>

<div class="container">
    <h1>DASHBOARD PAGE</h1>
    <form action="/api/upload" onsubmit={handleSubmit} method="post" enctype="multipart/form-data">
        <input type="file" name="file" accept="image/*" />
        <button type="submit">Upload</button>
    </form>
    <div class="list">
        {#each fileList as file}
            <div class="item">
                <img src={file.url} height="100" alt={file.name}>
                <button onclick={() => deleteImage(file)}>Delete</button>
            </div>
        {/each}
    </div>
</div>

<style scoped>
    .list {
        margin-top: 2rem;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 20px;
    }
    .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
    .item img {
        width: 100%;
        object-fit: contain;
    }

    button {
        background-color: white;
        color: var(--primary-color);
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
    }
</style>