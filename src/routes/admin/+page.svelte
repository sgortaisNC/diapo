 <script lang="ts">
    export let data;

    async function deleteImage(file: { name: string; url: string }) {
        const response = await fetch(`/api/remove`, {
            method: 'DELETE',
            body: JSON.stringify({ url: file.url })
        });
        const removed: { ok: boolean } = await response.json();
        if (removed.ok) {
            data.fileList = data.fileList.filter((f: { name: string; url: string }) => f.url !== file.url);
        }
    }
</script>

<div class="container">
    <h1>ADMIN PAGE</h1>
    <button>Export all images</button>
    
    
    <div class="list">
        
        {#each data.fileList as file}
            <div class="item">
                <img src={file.url} height="100" alt={file.name}>
                <button onclick={() => deleteImage(file)}>Delete</button>
            </div> 
        {/each}
    </div>
</div>

<style scoped>
    .list {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 20px;
        width: 100%;
    }
    .item {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
    .item img {
        width: 100%;
        height: 100%;
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