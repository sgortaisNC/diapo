<script lang="ts">
    export let data;
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    
    let fileList: string[] = [];

    onMount(() => {
        if (browser) {
            fileList = localStorage.getItem('fileList') ? JSON.parse(localStorage.getItem('fileList') as string) : [];``
        }
        for(let ownFile of fileList) {
            if (!data.fileList.includes(ownFile)) {
                fileList = fileList.filter(f => f !== ownFile);
                localStorage.setItem('fileList', JSON.stringify(fileList));
            }
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
        if (result.ok) {
            const file = formData.get('file');
            if (file instanceof File) {
                fileList.push(file.name);
                if (browser) {
                    localStorage.setItem('fileList', JSON.stringify(fileList));
                }
            }
        }
        window.location.reload();
    }

    async function deleteImage(file: string) {
        const response = await fetch(`/api/remove`, {
            method: 'DELETE',
            body: JSON.stringify({ file })
        });
        const removed: { ok: boolean } = await response.json();
        if (removed.ok) {
            fileList = fileList.filter((f: string) => f !== file);
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
                <img src="/api/images/{file}" height="100" alt="">
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